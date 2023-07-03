import moment from "moment";
import _ from "lodash";
import { clearForSync } from "./pocketUtils";
import { db } from "$lib/data/db";
import { type DbDefaults, DbStatus, type ImageField, MyDB } from "$lib/mylib/data/MyDB";
import { clearForStorage } from "$lib/mylib/data/dbUtils";
import type PocketBase from 'pocketbase';

export type SyncableConfig = {
    tableName: string;
    imageFields?: string[];
    batchSize?: number;
}

export type SyncCheckResponse<T> = {
    [key: string]: {
        exists: boolean,
        entity?: T,
        changed?: Date
    }
}

export enum DbAction {
    NOTHING = 'NOTHING',
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE'
}

export type ActionSet = {
    local: DbAction,
    server: DbAction
}


export class Syncable<T extends DbDefaults> {
    public tableName: string;
    public imageFields: string[];
    public batchSize: number;

    constructor(protected pb: PocketBase,
        protected db: MyDB,
        config: SyncableConfig) {
        this.tableName = config.tableName;
        this.imageFields = config.imageFields || [];
        this.batchSize = config.batchSize || 100;
    }

    /**
     * 
     * @param local Führt einen merge aus und holt dafür einen neuen Datensatz vom Server
     * @returns 
     * @see merge
     */
    public async sync(local: T) {
        const server = await this.readServer(local);
        return await this.merge(local, server);
    }

    /**
     * 
     * @param local Führt eine synchronisation für den gegebenen Datensatz aus
     * @param server 
     */
    public async merge(local: T | undefined, server: T | undefined) {
        const actionSet = this.decideActionSet(local, server);

        let result: T | undefined = undefined;
        switch (actionSet.server) {
            case DbAction.CREATE:
                result = await this.createServer(local || {} as T, true);
            case DbAction.UPDATE:
                result = await this.updateServer(local || {} as T, true);
            case DbAction.DELETE:
                await this.deleteServer(local || {} as T, true);
        }

        switch (actionSet.local) {
            case DbAction.CREATE:
                result = await this.createLocal(server || {} as T);
            case DbAction.UPDATE:
                result = await this.updateLocal(server || {} as T);
            case DbAction.DELETE:
                await this.deleteLocal(server || {} as T);
        }

        return result;
    }



    /**
     * Errechnet den Status eines Elements auf dem Server
     * @param local 
     * @param server 
     * @returns 
     */
    protected decideServerState(local?: T, server?: T): DbStatus {
        if (!local && !server) return DbStatus.UNKNOWN;

        if (!local) return DbStatus.CREATED;
        if (!server && local._lastDownload) return DbStatus.DELETED;
        if (!server) return DbStatus.MISSING;

        // TODO Datumsvergleich mit moment?
        if (local.updated !== server.updated) return DbStatus.UPDATED;
        return DbStatus.UNCHANGED;
    }

    /**
     * Errechnet den Status eines Elements in der lokalen Datenbank
     * @param local 
     * @param server 
     * @returns 
     */
    protected decideLocalState(local?: T, server?: T): DbStatus {
        if (!local && !server) return DbStatus.UNKNOWN;
        if (!local) return DbStatus.MISSING;
        if (!server && local._lastDownload) return DbStatus.ABANDONED;
        if (!server) return DbStatus.CREATED;

        return local._status || DbStatus.UNCHANGED;
    }

    /**
     * Ermittelt bei einem Elementpaar das Set an Aktionen, die durchgeführt werden müssen
     * @param local 
     * @param server 
     * @returns 
     */
    protected decideActionSet(local?: T, server?: T): ActionSet {
        if (!local && !server) return { local: DbAction.NOTHING, server: DbAction.NOTHING };

        const serverState = this.decideServerState(local, server);
        const localState = this.decideLocalState(local, server);

        if (serverState === DbStatus.CREATED) return { local: DbAction.CREATE, server: DbAction.NOTHING };
        if (serverState === DbStatus.UPDATED && localState === DbStatus.UNCHANGED) return { local: DbAction.UPDATE, server: DbAction.NOTHING };
        if (serverState === DbStatus.DELETED) return { local: DbAction.DELETE, server: DbAction.NOTHING };


        if (serverState === DbStatus.MISSING) return { local: DbAction.NOTHING, server: DbAction.CREATE };
        if (localState === DbStatus.UPDATED && serverState === DbStatus.UNCHANGED) return { local: DbAction.NOTHING, server: DbAction.UPDATE };
        if (localState === DbStatus.DELETED) return { local: DbAction.DELETE, server: DbAction.DELETE };

        if (localState === DbStatus.ABANDONED) return { local: DbAction.DELETE, server: DbAction.NOTHING };

        if (localState == DbStatus.UPDATED && serverState === DbStatus.UPDATED) {
            // TODO Datumsvergleich kontrollieren
            if (moment(local?._changed).isSameOrAfter(server?.updated, 'minute')) {
                return { local: DbAction.NOTHING, server: DbAction.UPDATE };
            } else {
                return { local: DbAction.UPDATE, server: DbAction.NOTHING };
            }
        }

        return { local: DbAction.NOTHING, server: DbAction.NOTHING };
    }


    /**
     * Entfernt lokale Felder, die nicht synchronisiert werden sollen
     * @param data Zu bereinigendes Objekt
     * @param extraField Felder, die außerdem vom sync ausgeschlossen werden sollen
     * @returns 
     * @see clearForSync
     */
    public clearSyncData(data: T, ...extraField: string[]) {
        return clearForSync(data, ...extraField);
    }

    /**
     * Bereinigt Pocketbase Metadata aus dem Datensatz
     * @param data 
     * @param extraField 
     * @returns 
     * @see clearForStorage
     */
    public clearStorageData<T extends DbDefaults>(data: T, ...extraField: string[]) {
        return clearForStorage<T>(data, ...extraField);
    }

    /**
     * Erzeugt ein result Datensatz und markiert ihn als frisch gesynct.
     * @param local 
     * @param server 
     * @returns 
     */
    public async updateLocalAfterSync(local: T | undefined, server: T, date = new Date(), storeToLocalDb = true) {
        if (local === undefined) local = {} as T;
        const result = {
            ...local,
            ...server,
            _status: undefined,
            _changed: undefined,
            _lastCheck: date,
            _lastDownload: date
        } as any;

        // Bildercache löschen, falls sich der Dateiname auf dem Server geändert hat
        this.imageFields.forEach(field => {
            const binFieldIndex = `_${field}`;
            if (result.hasOwnProperty(binFieldIndex)) {
                const binField = result[binFieldIndex] as ImageField;
                if (binField.name !== result[field]) {
                    result[binFieldIndex] = undefined;
                }
            }
        });

        if (storeToLocalDb) return await this.updateLocal(result);

        return result as T;
    }

    /**
 * Hole den neusten Datensatz eines Elements vom Server
 */
    public async readServer(local: T): Promise<T | undefined> {
        try {
            const downloadDate = new Date();
            const res = await this.pb.collection(this.tableName).getOne<T>(local.id || '-1');
            res._lastDownload = downloadDate;
            res._lastCheck = downloadDate;
        } catch (e) {
            return undefined;
        }
    }

    /**
     * Erstellt einen neuen Datensatz auf dem Server
     * @param local 
     * @param storeToLocalDb 
     * @returns 
     */
    public async createServer(local: T, storeToLocalDb = true): Promise<T> {
        const date = new Date();
        const result = await this.pb.collection(this.tableName).create<T>(this.clearSyncData(local));
        return await this.updateLocalAfterSync(local, result, date, storeToLocalDb);
    }

    /**
     * Aktualisiert einen Datensatz auf dem Server
     * @param local 
     * @param storeToLocalDb 
     * @returns 
     */
    public async updateServer(local: T, storeToLocalDb = true): Promise<T> {
        const date = new Date();
        const result = await this.pb.collection(this.tableName).update<T>(local.id || '-1', this.clearSyncData(local));
        return await this.updateLocalAfterSync(local, result, date, storeToLocalDb);
    }

    /**
     * Löscht einen Datensatz auf dem Server
     * @param local 
     * @param storeToLocalDb 
     */
    public async deleteServer(local: T, storeToLocalDb = true): Promise<boolean> {
        const date = new Date();
        const result = await this.pb.collection(this.tableName).delete(local.id || '-1');
        if (storeToLocalDb) await this.deleteLocal(local);
        return true;
    }

    /**
     * Liest einen Datensatz aus der lokalen Datenbank
     * @param id 
     * @returns 
     */
    public async readLocal(id: string): Promise<T | undefined> {
        return await db.table(this.tableName).where('id').equals(id).first();
    }

    /**
     * Erstellt einen neuen Datensatz in der lokalen Datenbank
     * @param entity 
     * @returns 
     * @see updateLocal
     */
    public async createLocal(entity: T): Promise<T> {
        return this.updateLocal(entity);
    }

    /**
     * Aktualisiert einen Datensatz in der lokalen Datenbank
     * @param entity 
     * @returns 
     */
    public async updateLocal(entity: T): Promise<T> {
        const key = await db.table(this.tableName).put(this.clearStorageData(entity));
        return await db.table(this.tableName).get(key) as T;
    }

    /**
     * Löscht einen Datensatz in der lokalen Datenbank
     * @param entity
     * @returns
     */
    public async deleteLocal(entity: T): Promise<void> {
        if (!entity._id) return;
        await db.table(this.tableName).delete(entity._id);
    }
}