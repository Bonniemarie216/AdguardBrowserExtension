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

import { customAlphabet } from 'nanoid';
import browser from 'webextension-polyfill';

import { logger } from '../../common/logger';

import { TimersInterface } from './AbstractTimers';

/**
 * Implements timers interface via Alarm API to be used in MV3.
 * Alarm API used in MV3 for long timers, that could be interrupted
 * by the service worker's death.
 */
class Mv3Timers implements TimersInterface {
    /**
     * Minimal interval for Alarm API in minutes.
     */
    private static readonly MINIMAL_INTERVAL_MIN = 1;

    /**
     * Generates ID.
     *
     * @returns Generated ID.
     */
    private static generateId(): number {
        const nanoid = customAlphabet('1234567890', 10);
        const id = nanoid();

        return parseInt(id, 10);
    }

    /**
     * Converts milliseconds to minutes.
     *
     * @param timeMs Time in milliseconds.
     *
     * @returns Time in minutes.
     */
    private convertMsToMin = (timeMs: number): number => {
        let timeMin = timeMs / (1000 * 60);

        // Interval cannot be less than 1 minute in Alarm API.
        // https://developer.chrome.com/docs/extensions/reference/alarms/#method-create
        // So if converted time is less than 1 minute, we round it to the 1
        if (timeMin < Mv3Timers.MINIMAL_INTERVAL_MIN) {
            logger.warn('Alarm API interval can\'t be less than 1 minute, so it was rounded to 1');
            timeMin = Mv3Timers.MINIMAL_INTERVAL_MIN;
        }

        return timeMin;
    };

    /**
     * SetTimeout implementation.
     *
     * @param callback Function to be called.
     * @param timeout In ms.
     *
     * @returns Timer ID.
     */
    setTimeout = (callback: () => void, timeout: number): number => {
        const timerId = Mv3Timers.generateId();
        this.createAlarm(`${timerId}`, timeout);
        this.onAlarmFires(`${timerId}`, callback);
        return timerId;
    };

    /**
     * ClearTimeout implementation.
     *
     * @param timerId Timer ID.
     */
    clearTimeout = (timerId: number | undefined): void => {
        if (timerId === undefined) {
            return;
        }
        this.clearAlarm(`${timerId}`);
    };

    /**
     * SetInterval implementation.
     *
     * @param callback Function to be called.
     * @param interval In ms.
     *
     * @returns Timer ID.
     */
    setInterval = (callback: () => void, interval: number): number => {
        const timerId = Mv3Timers.generateId();
        this.createPeriodicAlarm(`${timerId}`, this.convertMsToMin(interval));
        this.onAlarmFires(`${timerId}`, callback);
        return timerId;
    };

    /**
     * ClearInterval implementation.
     *
     * @param intervalId Timer ID.
     */
    clearInterval = (intervalId: number | undefined): void => {
        if (intervalId === undefined) {
            return;
        }
        this.clearAlarm(`${intervalId}`);
    };

    /**
     * Creates alarm.
     *
     * @param alarmName Alarm name.
     * @param delay In ms.
     */
    private createAlarm = (alarmName: string, delay: number): void => {
        browser.alarms.create(alarmName, { when: Date.now() + delay });
    };

    /**
     * Creates periodic alarm.
     *
     * @param alarmName Alarm name.
     * @param periodInMinutes In **minutes**.
     */
    private createPeriodicAlarm = (alarmName: string, periodInMinutes: number): void => {
        browser.alarms.create(alarmName, { periodInMinutes });
    };

    /**
     * Clears alarm timer by provided alarm name.
     *
     * @param alarmName Alarm name.
     */
    private clearAlarm = async (alarmName: string): Promise<void> => {
        const alarm = await browser.alarms.get(alarmName);
        await browser.alarms.clear(alarm?.name);
    };

    /**
     * Executes callback on alarm fires.
     *
     * @param alarmName Alarm name.
     * @param callback Function to be called.
     */
    private onAlarmFires = (alarmName: string, callback: () => void): void => {
        browser.alarms.onAlarm.addListener((alarm) => {
            if (alarm.name === alarmName) {
                callback();
            }
        });
    };
}

export const timers = new Mv3Timers();
