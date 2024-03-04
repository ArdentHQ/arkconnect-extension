const formatDomain = (domain?: string, truncate = true) => {
    const newDomain = domain
        ?.replace(/^(https?:\/\/)|(https?:\/\/)|(\/)+$/g, '')
        .replace(/\/$/, '');

    if (truncate) {
        return newDomain && newDomain?.length > 16 ? newDomain.slice(0, 16) + '...' : newDomain;
    }

    return newDomain;
};

export default formatDomain;
