const { isPathRelative } = require("./isPathRelative");
const path = require("path");
const { getNormalizedProjectPath } = require("./getNormalizedProjectPath");

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

    const fromProject = getNormalizedProjectPath(from)

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