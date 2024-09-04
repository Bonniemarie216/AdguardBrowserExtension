/**
 * @file
 * This file is part of AdGuard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * AdGuard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * AdGuard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AdGuard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */
import { PreprocessedFilterList } from '@adguard/tsurlfilter';

import { AntiBannerFiltersId } from '../../../common/constants';
import { FiltersStorage, filterStateStorage } from '../../storages';
import { engine } from '../../engine';

import { FiltersApi } from './main';
import { CommonFilterApi } from './common';

/**
 * API for managing quick fixes filter.
 *
 * **Note:** This filter is needed only in MV3 version.
 *
 * Quick Fixes Filter does not have a local list of rules, it is loaded from
 * the server.
 */
export class QuickFixesRulesApi {
    /**
     * Partially updates metadata for quick fixes filter, then load newest rules
     * from the server without patches (because filter is quite small) and
     * enables it.
     *
     * @param reloadEngine If true, then engine will be reloaded after enabling.
     */
    public static async loadAndEnableQuickFixesRules(reloadEngine = false): Promise<void> {
        FiltersApi.partialUpdateMetadataFromRemoteForFilter(AntiBannerFiltersId.QuickFixesFilterId);

        await CommonFilterApi.loadFilterRulesFromBackend(
            {
                filterId: AntiBannerFiltersId.QuickFixesFilterId,
                // Without patches because filter is quite small.
                // Because otherwise, if we will load it with patches, we should
                // also load it fully from time to time (as we do for static
                // filters in MV2) to prevent some unexpected problems from
                // patches.
                ignorePatches: true,
            },
            true,
        );

        filterStateStorage.enableFilters([AntiBannerFiltersId.QuickFixesFilterId]);

        if (reloadEngine) {
            engine.update();
        }
    }

    /**
     * Checks, if quick fixes filter is enabled.
     *
     * @returns True, if quick fixes filter is enabled, else returns false.
     */
    public static isEnabled(): boolean {
        return FiltersApi.isFilterEnabled(AntiBannerFiltersId.QuickFixesFilterId);
    }

    /**
     * Returns rules from quick fixes filter.
     */
    public static async getQuickFixesRules(): Promise<PreprocessedFilterList> {
        const data = await FiltersStorage.getAllFilterData(AntiBannerFiltersId.QuickFixesFilterId);

        if (!data) {
            return {
                rawFilterList: '',
                filterList: [],
                sourceMap: {},
                conversionMap: {},
            };
        }

        return data;
    }
}
