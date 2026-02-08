const { isPathRelative } = require("./isPathRelative");
const path = require("path");

function isSameModuleImport(from, to, fsdLayers) {
    if(isPathRelative(to)) {
        return false;
    }

    const toArray = to.split('/');
    const toLayer = toArray[0];
    const toSlice = toArray[1];

    if(!toLayer || !toSlice || !fsdLayers[toLayer]) {
        return false;
    }

    const fromNormalized = path.toNamespacedPath(from);
    const fromProject = fromNormalized.split(`src/`)[1];

    if(!fromProject) {
        return false;
    }

    const fromArray = fromProject.split('/');
    const fromLayer = fromArray[0];
    const fromSlice = fromArray[1];

    if(!fromLayer || !fromSlice || !fsdLayers[fromLayer]) {
        return false;
    }

    return fromSlice === toSlice && fromLayer === toLayer;
}

module.exports = {
    isSameModuleImport
};