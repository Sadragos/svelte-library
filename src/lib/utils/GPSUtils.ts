export type GPSPosition = {
    lat?: number;
    long?: number;
    accuracy?: number;
    timestamp?: Date;
};

/**
 * Checks if a GPSPosition is valid. To be Valid, it must have a lat and long property and both must be numbers and not 0.
 * @param position 
 * @returns 
 */
export const isValidPosition = (position?: GPSPosition | undefined | null) => {
    if (!position || position.lat === undefined || position.long === undefined) return false;
    if (isNaN(position.lat) || isNaN(position.long)) return false;
    if (position.lat === 0 && position.long === 0) return false;
    return true;
}