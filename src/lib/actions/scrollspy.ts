
export type ScrollInfo = {
    scrollTop: number,
    scrollHeight: number,
    clientHeight: number,
    scrollPercent: number,
    scrollDirection?: 'up' | 'down' | 'none',
}

/**
 * Adds an event listener to a node that fires events when the user scrolls up or down. To be used the custom events scrollUp, scrollDown and scroll must be registered in the scvelte app.
 * @param node 
 */
export const scrollSpy = (
    node: any,
) => {
    let lastScrollTop = 0;

    const onScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = node;
        if(scrollTop === lastScrollTop) return;
        const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        const info: ScrollInfo = {
            scrollTop,
            scrollHeight,
            clientHeight,
            scrollPercent: (scrollTop / (scrollHeight - clientHeight)) * 100,
            scrollDirection,
        };
        if(scrollDirection === 'down') node.dispatchEvent(new CustomEvent("scrollDown", { detail: info }));
        if(scrollDirection === 'up') node.dispatchEvent(new CustomEvent("scrollUp", { detail: info }));
        node.dispatchEvent(new CustomEvent("scroll", { detail: info }));
    }

    const destroy = () => {
        node.removeEventListener('scroll', onScroll);
    };

    node.addEventListener('scroll', onScroll);
};