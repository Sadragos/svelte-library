import _ from "lodash";
import type { MomentInput, unitOfTime } from "moment";
import moment from "moment";
import { t } from "svelte-i18n";
import { get } from "svelte/store";

export type TimeList<T = any> =  {date: Date, items: T[]}[];

/**
 * Compares a given Time to the current timestamp and calculates the difference in a nice format
 * @param timestamp 
 * @returns 
 */
export const toTimeDiff = (timestamp: MomentInput): string => {
    const $t = get(t);
    if(!timestamp) return $t('never');
    const diff = moment().diff(timestamp, 'seconds');
    if (diff < 60) {
        return $t('just_now');
    } else if (diff < 3600) {
        return $t('minutes_ago', { values: {minutes: Math.floor(diff / 60) }});
    } else if (diff < 86400) {
        return $t('hours_ago', { values: {hours: Math.floor(diff / 3600) }});
    } else if (diff < 86400 * 14) {
        return $t('days_ago', { values: {days: Math.floor(diff / 86400) }});
    } else {
        return $t('time_at', {values: {when: moment(timestamp).toDate().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' })}});
    }
}

/**
 * Splits a list of items by a given time field and granularity
 * @param list 
 * @param timeField 
 * @param granularity 
 * @returns 
 */
export const splitByTime = <T>(list: T[], timeField: string, granularity: unitOfTime.StartOf = 'day'): TimeList<T> => {
    if(!list || list.length === 0) return [];
    let currentDate = moment(new Date(0)).startOf(granularity);
    const result: TimeList<T> = [];
    for (const item of list) {
        const itemDate = moment(_.get(item, timeField)).startOf(granularity);
        if(!itemDate.isSame(currentDate)) {
            currentDate = itemDate;
            result.push({
                date: currentDate.toDate(),
                items: []
            });
        }
        result[result.length - 1].items.push(item);
    }
    return result;
}
