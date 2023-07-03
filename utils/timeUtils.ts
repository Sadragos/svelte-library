import _ from "lodash";
import type { MomentInput, unitOfTime } from "moment";
import moment from "moment";
import { get } from "svelte/store";

export type TimeDiff = {
    amount?: number;
    date?: Date;
    type: 'never' | 'just_now' | 'minutes_ago' | 'hours_ago' | 'days_ago' | 'exact_date';
}
export type TimeList<T = any> =  {date: Date, items: T[]}[];

/**
 * Compares a given Time to the current timestamp and calculates the difference in a nice format
 * @param timestamp 
 * @returns 
 */
export const toTimeDiff = (timestamp: MomentInput): TimeDiff => {
    if(!timestamp) return { type: 'never'}
    const diff = moment().diff(timestamp, 'seconds');
    if (diff < 60) {
        return { type: 'just_now' };
    } else if (diff < 3600) {
        return { type: 'minutes_ago', amount: Math.floor(diff / 60) };
    } else if (diff < 86400) {
        return { type: 'hours_ago', amount: Math.floor(diff / 3600) };
    } else if (diff < 86400 * 14) {
        return { type: 'days_ago', amount: Math.floor(diff / 86400) };
    } else {
        return { type: 'exact_date', date: moment(timestamp).toDate() };
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
