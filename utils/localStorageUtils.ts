
/**
 * Loads a value from local storage and returns it. If the value is not found, the default value is returned and written to local storage. If the Code is not run in a Client it is aborted.
 * @param key 
 * @param defaultValue 
 * @param writeDefault
 * @returns 
 */
export const getLocalStorage = <T = any>(key: string): T | undefined => {
    if (typeof window === 'undefined') return undefined;
    const value = localStorage.getItem(key);
    if (value) {
        try {
            return JSON.parse(value) as T;
        } catch (e) {
            console.error('Could not parse', value);
            console.error(e);
        }
    }

    return undefined;
}

/**
 * Loads a value from local storage and returns it. If the value is not found, the default value is returned and written to local storage. If the Code is not run in a Client it is aborted.
 * @param key 
 * @param defaultValue 
 * @param writeDefault
 * @returns 
 */
export const getLocalStorageDefault = <T = any>(key: string, defaultValue: T, writeDefault = true): T => {
    if (typeof window === 'undefined') return defaultValue;
    const value = localStorage.getItem(key);
    if (value) {
        try {
            return JSON.parse(value) as T;
        } catch (e) {
            console.error('Could not parse', value);
            console.error(e);
        }
    }

    if (defaultValue && writeDefault) setLocalStorage(key, defaultValue);

    return defaultValue;
}

/**
 * Writes a value to local storage. If the Code is not run in a Client it is aborted.
 * @param key 
 * @param value 
 * @returns 
 */
export const setLocalStorage = <T = any>(key: string, value: T) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
}