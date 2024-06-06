const trimAddress = (
    address: string,
    modeOrLength: 'short' | 'long' | 'longest' | number,
    position: 'middle' | 'end' = 'middle',
): string => {
    let trimmedAddress = '';
    const maxLength =
        typeof modeOrLength === 'number'
            ? modeOrLength
            : {
                  short: 8,
                  long: 16,
                  longest: 24,
              }[modeOrLength];

    if (address.length <= maxLength) {
        return address;
    }

    const totalLength = maxLength - 1; // Account for the ellipsis character
    const sideLength = Math.ceil(totalLength / 2);

    if (position === 'middle') {
        const prefix = address.slice(0, sideLength);
        const suffix = address.slice(-sideLength);
        trimmedAddress = `${prefix}…${suffix}`;
    } else if (position === 'end') {
        const prefix = address.slice(0, totalLength);
        trimmedAddress = `${prefix}…`;
    }

    return trimmedAddress;
};

export default trimAddress;
