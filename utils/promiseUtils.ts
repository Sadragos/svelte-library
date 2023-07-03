/**
 * Rejects a promise after a given time
 * @param ms 
 * @returns 
 */
export const asyncTimeout = <T = any>(ms: number = 5000) => new Promise<T>((resolve, reject) => setTimeout(() => reject(new Error('timeout')), ms));

/**
 * Waits for a promise or cancels it after a given time
 * @param promise 
 * @param ms 
 * @param defaultValue
 * @returns 
 */
export const timeoutResult = async <T = any>(promise: Promise<T>, ms: number = 5000, defaultValue: T | undefined = undefined): Promise<T | undefined> => {
    try {
        return await Promise.race<T>([promise, asyncTimeout<T>(ms)]);
    } catch (error) {
        return defaultValue    
    }
}