const { isPathRelative } = require("./isPathRelative");
const path = require("path");

function isSameModuleImport(from, to, fsdLayers, noSlicesLayers) {
    if(isPathRelative(to)) {
        return false;
    }

    const noSliceLayersInternal = noSlicesLayers ?? {};
    const toArray = to.split('/');
    const toLayer = toArray[0];
    const toSlice = toArray[1];

    if(!toLayer || !fsdLayers[toLayer] || (!noSliceLayersInternal[toLayer] && !toSlice)) {
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

    if(!fromLayer || !fsdLayers[fromLayer] || (!noSliceLayersInternal[fromLayer] && !fromSlice)) {
        return false;
    }

    return fromLayer === toLayer && (noSliceLayersInternal[fromLayer] || fromSlice === toSlice);
}

module.exports = {
    isSameModuleImport
};