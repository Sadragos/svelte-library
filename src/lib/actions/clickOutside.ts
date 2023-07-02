/**
 * Checks if there was a click outside of the node.
 * @param node 
 * @param param1 
 * @returns 
 */
export const clickOutside = (
    node: any,
    { enabled: initialEnabled, cb }: { enabled: boolean; cb: any }
) => {
    const handleOutsideClick = ({ target }: { target: any }) => {
        if (!node.contains(target)) {
            cb();
        }
    };

    function update({ enabled }: { enabled: boolean }) {
        if (enabled) {
            window.addEventListener('click', handleOutsideClick);
        } else {
            window.removeEventListener('click', handleOutsideClick);
        }
    }

    update({ enabled: initialEnabled });
    
    return {
        update,
        destroy() {
            window.removeEventListener('click', handleOutsideClick);
        }
    };
};