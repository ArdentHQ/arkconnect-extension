const trimAddress = (
    address: string,
    modeOrLength: 'short' | 'long' | 'longest' | number,
): string => {
    const maxLength =
        typeof modeOrLength === 'number'
            ? modeOrLength
            : {
                  short: 13,
                  long: 24,
                  longest: 34,
              }[modeOrLength];

    if (address.length <= maxLength) {
        return address;
    }

    const totalLength = maxLength - 1; // Account for the ellipsis character
    const sideLength = Math.ceil(totalLength / 2);

    const prefix = address.slice(0, sideLength);
    const suffix = address.slice(-sideLength);

    return `${prefix}…${suffix}`;
};

export default trimAddress;
