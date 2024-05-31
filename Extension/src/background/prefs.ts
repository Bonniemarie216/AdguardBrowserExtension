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
import browser from 'webextension-polyfill';

import { TSURLFILTER_VERSION } from '@adguard/tsurlfilter';
import { SCRIPTLETS_VERSION } from '@adguard/scriptlets';

import { TSWEBEXTENSION_VERSION } from 'tswebextension';

/**
 * Extension global preferences.
 */
export class Prefs {
    public static id = browser.runtime.id;

    public static baseUrl = browser.runtime.getURL('');

    public static version = browser.runtime.getManifest().version;

    public static language = browser.i18n.getUILanguage();

    public static readonly libVersions = {
        tswebextension: TSWEBEXTENSION_VERSION,
        tsurlfilter: TSURLFILTER_VERSION,
        scriptlets: SCRIPTLETS_VERSION,
        // FIXME: 1. Exclude using 'window' object from the exported modules
        // FIXME: 2. Use the imported version after the fix
        extendedCss: '2.0.56',
    };
}
