import Dexie from "dexie";
import { generateId } from "./pocketUtils";

export type DbDefaults = {
    _id?: number,
    _lastDownload?: Date,
    _lastCheck?: Date,
    _status?: DbStatus,
    _changed?: Date,
    id?: string,
    created?: string,
    updated?: string,
    createdBy?: string,
    updatedBy?: string
}

export type ImageField = {
    bin?: File;
    status?: DbStatus;
    base64?: string;
    name?: string;
}

export enum DbStatus {
    /**Unknown state */
    UNKNOWN = 'UNKNOWN',
    /**Created locally */
    CREATED = 'CREATED',
    /** Updated locally */
    UPDATED = 'UPDATED',
    /** Deleted locally */
    DELETED = 'DELETED',
    /** No Changes on neither side */
    UNCHANGED = "UNCHANGED",
    /**Entry is missing and was most likely not deleted */
    MISSING = "MISSING",
    /**Entry was deleted on the server, but still exists locally */
    ABANDONED = "ABANDONED"
}

export class MyDB extends Dexie {
    protected dbDefaults = '++_id, _changed, _lastCheck, _lastDownload, _status, id, created, createdBy, updated, updatedBy, ';

    public modify<T extends DbDefaults>(data: T, type: DbStatus, user?: { id: string } | undefined): T {
        switch (type) {
            case DbStatus.CREATED:
                if (!data.id) data.id = generateId();
                if (!data.createdBy && user) data.createdBy = user.id;
                data._status = DbStatus.CREATED;
            case DbStatus.UPDATED:
                if (data._status !== DbStatus.CREATED) data._status = DbStatus.UPDATED;
                break;
            case DbStatus.DELETED:
                data._status = DbStatus.DELETED;
                break;
        }
        if (!data.updatedBy && user) data.updatedBy = user.id;
        data._changed = new Date();

        return data;
    }
}