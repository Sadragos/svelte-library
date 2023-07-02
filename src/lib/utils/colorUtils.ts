
export const lightOrDark = (color: string, breakpoint = 128) => {
    return (getBrightness(color) >= breakpoint) ? 'light' : 'dark';
}

export const lightOrDarkContrast = (color: string | undefined, breakpoint = 128) => {
    return (getBrightness(color) < breakpoint) ? 'light' : 'dark';
}

export const getBestTextColor = (color: string, breakpoint = 128) => {
    return lightOrDark(color, breakpoint) === 'light' ? '#000000' : '#ffffff';
}

export const getBrightness = (color: string | undefined) => {
    if(!color) return -1;
    // Variables for red, green, blue values
    let r: number, g: number, b: number, brightness: number;

    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

        // If RGB --> store the red, green, blue values in separate variables
        const colorMatch = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        if (!colorMatch) return -1;
        r = parseFloat(colorMatch[1]);
        g = parseFloat(colorMatch[2]);
        b = parseFloat(colorMatch[3]);
    }
    else {

        // If hex --> Convert it to RGB: http://gist.github.com/983661
        const colorValue = color.split('#').pop();

        r = Number(`0x${colorValue?.substring(0, 2)}`);
        g = Number(`0x${colorValue?.substring(2, 4)}`);
        b = Number(`0x${colorValue?.substring(4, 6)}`);
    }

    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    brightness = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
    return brightness;
}

export const generateRandomColor = (minBrightness = 128, maxBrightness = 255) => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    let brightness = 0;

    do {
        color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        brightness = getBrightness(color);
    } while (brightness < minBrightness && brightness > maxBrightness);
    return color;
}