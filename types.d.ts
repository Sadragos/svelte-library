
export type Link = {
    title?: string;
    icon?: string;
    classes?: string;
    click?: (() => void) | (() => Promise<void>);
    href?: string;
    disabled?: boolean;
    tooltip?: string;
    isActive?: (currentLink: string) => boolean | undefined;
    children?: Link[];
    id?: string;
    position?: 'left' | 'right' | 'center';
    hidden?: boolean;
    replaceState?: boolean;
}

export type InputOption<T = any> = { value: T; label?: string };
export type InputValidator = (value: any) => boolean | string;
