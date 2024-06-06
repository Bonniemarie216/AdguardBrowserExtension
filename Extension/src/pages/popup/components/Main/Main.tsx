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

import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { logger } from '../../../../common/logger';
import { translator } from '../../../../common/translators/translator';
import { Icon } from '../../../common/components/ui/Icon';
import { popupStore } from '../../stores/PopupStore';
import { POPUP_STATES, COMPARE_URL } from '../../constants';
import { addMinDelayLoaderAndRemove } from '../../../common/components/helpers';

import './main.pcss';

export const Main = observer(() => {
    const store = useContext(popupStore);

    const toggleAllowlistedHandler = __IS_MV3__
        ? addMinDelayLoaderAndRemove(
            store.setShowLoader,
            store.toggleAllowlistedMv3,
        )
        : store.toggleAllowlisted;

    const switchersMap = {
        [POPUP_STATES.APPLICATION_ENABLED]: {
            handler: toggleAllowlistedHandler,
            mode: 'enabled',
        },
        [POPUP_STATES.APPLICATION_FILTERING_DISABLED]: {
            handler: addMinDelayLoaderAndRemove(
                store.setShowLoader,
                async () => {
                    await store.changeApplicationFilteringDisabled(false);
                },
            ),
            mode: 'disabled',
        },
        [POPUP_STATES.APPLICATION_UNAVAILABLE]: {
            mode: 'unavailable',
        },
        [POPUP_STATES.SITE_IN_EXCEPTION]: {
            mode: 'in-exception',
        },
        [POPUP_STATES.SITE_ALLOWLISTED]: {
            handler: toggleAllowlistedHandler,
            mode: 'allowlisted',
        },
    };

    const switcher = switchersMap[store.popupState];

    if (!switcher) {
        logger.error(`Unknown popup state: ${store.popupState}`);
        return null;
    }

    return (
        <div className={`main main--${switcher.mode}`}>
            {store.isInitialDataReceived && (
                <>
                    <div className="main__header">
                        <div className="main__header--current-status">
                            {
                                __IS_MV3__
                                    ? store.currentStatusMessage
                                    : translator.getMessage('popup_tab_blocked_count', {
                                        num: store.totalBlockedTab.toLocaleString(),
                                    })
                            }
                        </div>
                        <div className="main__header--current-site">
                            {store.currentSite}
                        </div>
                    </div>

                    <button
                        type="button"
                        className="switcher"
                        onClick={switcher.handler}
                        title={translator.getMessage('popup_switch_button')}
                    >
                        <div className={`switcher__center switcher__center--${switcher.mode}`} />
                        <div className="switcher__btn">
                            <Icon id="#checkmark" classname="icon--24 switcher__icon switcher__icon--checkmark" />
                            <Icon id="#circle" classname="icon--24 switcher__icon switcher__icon--circle" />
                            <Icon id="#play" classname="icon--24 switcher__icon switcher__icon--play" />
                            <Icon id="#exclamation" classname="icon--exclamation switcher__icon switcher__icon--exclamation" />
                        </div>
                    </button>

                    {store.showInfoAboutFullVersion && (
                        <div className="main__cta">
                            <a
                                href={COMPARE_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="main__cta--link"
                            >
                                {translator.getMessage('popup_header_cta_link')}
                            </a>
                        </div>
                    )}
                </>
            )}
        </div>
    );
});
