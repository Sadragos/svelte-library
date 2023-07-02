export type Vector2 = { x: number, y: number };

/**
 * Adds swipe events to a node. To be used the custom events swipeRight, swipeLeft, swipeUp and swipeDown must be registered in the scvelte app.
 * @param node 
 * @returns 
 */
export const gestureHandler = (node: any) => {

    let startPos: Vector2 = { x: 0, y: 0 };
    let endPos: Vector2 = { x: 0, y: 0 };

    const handleTouchStart = (event: TouchEvent) => {
        startPos.x = event.changedTouches[0].screenX;
        startPos.y = event.changedTouches[0].screenY;
    };

    const handleTouchEnd = (event: TouchEvent) => {
        endPos.x = event.changedTouches[0].screenX;
        endPos.y = event.changedTouches[0].screenY;
        handleGesture(startPos, endPos);
    };

    const handleGesture = (pos1: Vector2, pos2: Vector2) => {
        const delta: Vector2 = { x: pos2.x - pos1.x, y: pos2.y - pos1.y };
        if(Math.abs(delta.x) < 50 && Math.abs(delta.y) < 50) return;
        if(Math.abs(delta.x) > Math.abs(delta.y)) {
            if(delta.x > 0) {
                node.dispatchEvent(new CustomEvent("swipeRight"));
            } else {
                node.dispatchEvent(new CustomEvent("swipeLeft"));
            }
        } else {
            if(delta.y > 0) {
                node.dispatchEvent(new CustomEvent("swipeDown"));
            } else {
                node.dispatchEvent(new CustomEvent("swipeUp"));
            }
        }
    };

    const destroy = () => {
        node.removeEventListener('touchstart', handleTouchStart);
        node.removeEventListener('touchend', handleTouchEnd);
    };

    node.addEventListener('touchstart', handleTouchStart);
    node.addEventListener('touchend', handleTouchEnd);

    return {
        destroy
    };
};