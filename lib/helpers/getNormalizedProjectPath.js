const {toNamespacedPath} = require("path");

function getNormalizedProjectPath(fullPath) {
    const fromNamespaced = toNamespacedPath(fullPath);
    const fromNormalized = fromNamespaced.split(`\\`).join(`/`);

    return fromNormalized.split(`src/`)[1];
}

module.exports = {
    getNormalizedProjectPath
};