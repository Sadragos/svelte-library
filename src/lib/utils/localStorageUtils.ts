
/**
 * Loads a value from local storage and returns it. If the value is not found, the default value is returned and written to local storage. If the Code is not run in a Client it is aborted.
 * @param key 
 * @param defaultValue 
 * @param writeDefault
 * @returns 
 */
export const loadLocalStorage = <T>(key: string, defaultValue: T = undefined, writeDefault = true) => {
    if (typeof window === 'undefined') return defaultValue;
    const value = localStorage.getItem(key);
    if (value) {
        return JSON.parse(value) as T;
    }
    
    if(defaultValue && writeDefault) setLocalStorage(key, defaultValue);

    return defaultValue;
}

/**
 * Writes a value to local storage. If the Code is not run in a Client it is aborted.
 * @param key 
 * @param value 
 * @returns 
 */
export const setLocalStorage = <T>(key: string, value: T) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
}