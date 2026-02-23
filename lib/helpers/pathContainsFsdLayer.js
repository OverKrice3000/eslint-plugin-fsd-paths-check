const { allFsdLayers } = require("../constants/constants");

const getFsdLayerFromPath = (filePath) => {
    const normalizedPath = filePath.replace(/\\/g, '/');
    const segments = normalizedPath.split('/');

    for (const segment of segments) {
        if (allFsdLayers.includes(segment)) {
            return segment;
        }
    }

    return null;
};

const hasFsdLayerInPath = (filePath) => {
    return getFsdLayerFromPath(filePath) !== null;
};

module.exports = {
    getFsdLayerFromPath,
    hasFsdLayerInPath,
};