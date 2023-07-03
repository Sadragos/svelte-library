import _ from 'lodash';
import moment from 'moment';
import seedrandom from 'seedrandom';
import { v4 as uuidv4 } from 'uuid';
import type { DbDefaults } from './MyDB';

export const DEFAULT_IGNORES = ['expand', 'created', 'collectionId', 'collectionName', 'updated', 'id'];
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DATE_FORMAT = 'YYYY-MM-DD';


/**
 * Erzeugt eine ID, die von Pocketbase verwendet werden kann
 * @param length 
 * @returns 
 */
export const generateId = (length = 15) => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const uuid = uuidv4();
    const random = seedrandom(uuid);
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[Math.abs(random.int32()) % chars.length];
    }
    return result;
}

/**
 * Entfernt lokale Felder, die nicht synchronisiert werden sollen
 * @param data Zu bereinigendes Objekt
 * @param extraField Felder, die außerdem vom sync ausgeschlossen werden sollen
 * @returns 
 */
export const clearForSync = <T extends DbDefaults>(data: T, ...extraField: string[]) => {
    const locals = Object.keys(data).filter(key => key.startsWith('_'));
    return _.omit<T>(data, 'extends', ...locals, ...extraField);
}


export const toDatabaseDate = (date: Date) => {
    return date;
}

export const toDatabaseDateTime = (date: Date) => {
    return date;
}

export const fromDatabaseDate = (date: string) => {
    return moment(date).toDate();
}