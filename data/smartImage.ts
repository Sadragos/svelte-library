import type { ImageField } from "./MyDB";

export type SmartImageOptions<T = any> = {
    record: T;
    field: string;
    download?: boolean;
    hideMissing?: boolean;
};
export function smartImage(node: HTMLImageElement, options: SmartImageOptions) {
    const origFit = node.style.objectFit;
    let hasImage = false;
    node.src = '/photo.svg';
    node.className += ' pulsating bg-secondary-subtle';
    node.style.objectFit = 'none';

    const dexieField = `_${options.field}`;
    const currentImageValue = options.record[options.field];
    const dexieBinField: ImageField = options.record[dexieField];

    if (dexieBinField && dexieBinField.bin) {
        if (currentImageValue) {
            if (currentImageValue !== dexieBinField.name && !dexieBinField.status) {
                // TODO neues bild herunterladen
            } else {
                node.src = URL.createObjectURL(dexieBinField.bin);
            }
        } else {
            node.src = URL.createObjectURL(dexieBinField.bin);
        }
        hasImage = true;
    } else if (currentImageValue) {
        // TODO neues bild herunterladen
        hasImage = true;
    }
    if (hasImage) {
        node.style.objectFit = origFit;
    } else if (options.hideMissing){
         node.className += ' d-none';
    }
    node.className = node.className.replace(' pulsating', '');
}