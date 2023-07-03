import { writable } from "svelte/store";

export type PushMessage = {
    title?: string,
    message: string,
    hint?: string,
    icon?: string,
    type?: 'success' | 'error' | 'info' | 'warning',
    closeAfter?: number
};

function createMessages() {
    const { subscribe, set, update } = writable<PushMessage[]>([]);

    return {
        subscribe,
        append: (message: PushMessage) => {
            if (!message) return;
            update(n => [...n, message]);
            if (!message.closeAfter) {
                const chars = (message.title?.length || 0) + message.message.length + (message.hint?.length || 0);
                const time = chars * 50;
                setTimeout(() => {
                    update(n => n.filter(m => m !== message));
                }, time);
            } else if (message.closeAfter > 0) {
                setTimeout(() => {
                    update(n => n.filter(m => m !== message));
                }, message.closeAfter);
            }
        },
        remove: (message: PushMessage) => update(n => n.filter(m => m !== message)),
        reset: () => set([])
    };
}

export const messages = createMessages();