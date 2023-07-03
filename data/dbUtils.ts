import _ from "lodash";

    /**
     * Bereinigt Pocketbase Metadata aus dem Datensatz
     * @param data 
     * @param extraField 
     * @returns 
     */
    export const clearForStorage = <T extends object = any>(data: T, ...extraField: string[]) => {
        return _.omit<T>(data, 'collectionId', 'collection', 'extends', ...extraField);
    }