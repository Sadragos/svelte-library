import exifr from "exifr";
import { isValidPosition, type GPSPosition } from "./GPSUtils.js";


/**
 * Compresses and resizes an image to a given size.
 * @param file The image file to compress and resize.
 * @param maxWidth The maximum width of the image.
 * @param maxHeight The maximum height of the image.
 * @param quality The quality of the image. 0 is worst, 100 is best.
 * @returns The compressed and resized image.
 */
export const compressAndResizeImage = async (file: File, maxWidth = 2000, maxHeight = 2000, quality = 90): Promise<File> => {
    const image = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if(!ctx) throw new Error('Failed to create canvas context');
    const ratio = Math.min(Math.min(maxWidth / image.width, maxHeight / image.height), 1);
    canvas.width = image.width * ratio;
    canvas.height = image.height * ratio;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    const blob = await fetch(dataUrl).then(r => r.blob());
    return new File([blob], file.name, {type: file.type});
}

/**
 * Reads the exif data from an image file.
 * @param blob 
 * @returns 
 */
export const readExifData = async (blob: File) => {
    const data = await exifr.parse(blob);
    return data;
}

/**
 * Converts a DMS coordinate to a DD coordinate.
 * @param degrees 
 * @param minutes 
 * @param seconds 
 * @param direction 
 * @returns 
 */
const convertDMSToDD = (degrees: number, minutes: number, seconds: number, direction: string) => {
    let dd = degrees + minutes/60 + seconds/(60*60);
    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    }
    return parseFloat(Number(dd).toFixed(5));
}

/**
 * Gets the GPS location from an image file if it is present in the exif data.
 * @param blob 
 * @returns 
 */
export const getLocationFromImage = async (blob: File): Promise<GPSPosition | undefined> => {
    const exif = await readExifData(blob);
    if(!exif) return undefined;

    let result: GPSPosition = {};

    if(exif.hasOwnProperty('latitude') && exif.hasOwnProperty('longitude')) {
        result = {
            lat: parseFloat(Number(exif.latitude).toFixed(5)),
            long: parseFloat(Number(exif.longitude).toFixed(5)),
            accuracy: -1
        }
        if(isValidPosition(result)) return result;
    }

    if(exif.hasOwnProperty('GPSLatitude') && exif.hasOwnProperty('GPSLongitude')) {
        const lat = convertDMSToDD(exif.GPSLatitude[0], exif.GPSLatitude[1], exif.GPSLatitude[2], exif.GPSLatitudeRef);
        const long = convertDMSToDD(exif.GPSLongitude[0], exif.GPSLongitude[1], exif.GPSLongitude[2], exif.GPSLongitudeRef);
        result = {
            lat,
            long,
            accuracy: -1
        }
        if(isValidPosition(result)) return result;
    }

    return undefined;
}