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

export interface TimersInterface {
    setTimeout(callback: () => void, timeout: number): number;
    clearTimeout(timerId: number | undefined): void;
    setInterval(callback: () => void, interval: number): number;
    clearInterval(intervalId: number | undefined): void;
}

/**
 * This class used only to show timers interface
 * export './AbstractTimers' is replaced during webpack compilation
 * with NormalModuleReplacementPlugin to proper implementation
 * from './Mv2Timers' or './Mv3Timers'.
 */
class AbstractTimers implements TimersInterface {
    /**
     * Throws an error if this class is used.
     */
    constructor() {
        throw new Error('Webpack did not inject proper manifest-dependant implementation of timers.');
    }

    // eslint-disable-next-line jsdoc/require-jsdoc, class-methods-use-this, @typescript-eslint/no-unused-vars
    setTimeout(callback: () => void, timeout: number): number { return -1; }

    // eslint-disable-next-line jsdoc/require-jsdoc, class-methods-use-this, @typescript-eslint/no-unused-vars
    clearTimeout(timerId: number | undefined): void {}

    // eslint-disable-next-line jsdoc/require-jsdoc, class-methods-use-this, @typescript-eslint/no-unused-vars
    setInterval(callback: () => void, interval: number): number { return -1; }

    // eslint-disable-next-line jsdoc/require-jsdoc, class-methods-use-this, @typescript-eslint/no-unused-vars
    clearInterval(intervalId: number | undefined): void {}
}

export const timers = new AbstractTimers();
