"use strict";

const path = require("path");
const fs = require("fs");
const { allFsdLayers } = require("../constants/constants");

const calculateRelativePath = (fromFile, toFile) => {
    const fromDir = path.dirname(fromFile);
    let relative = path.relative(fromDir, toFile);

    if (!relative.startsWith('.') && !relative.startsWith('/')) {
        relative = `./${relative}`;
    }

    relative = relative.replace(/\\/g, '/');

    return relative;
};

const getFsdSlice = (filePath) => {
    const normalized = filePath.replace(/\\/g, '/');
    const segments = normalized.split('/');
    const layerIndex = segments.findIndex(segment => allFsdLayers.includes(segment));

    if (layerIndex === -1) return null;
    if (layerIndex + 1 >= segments.length) return segments[layerIndex];

    return `${segments[layerIndex]}/${segments[layerIndex + 1]}`;
};

const isOnlyParentDirs = (importPath) => {
    const normalized = importPath.replace(/\\/g, '/');
    const segments = normalized.split('/').filter(s => s.length > 0);
    return segments.every(s => s === '..');
};

const resolveTargetDirectory = (importPath, currentFile) => {
    const currentDir = path.dirname(currentFile);
    const normalized = importPath.replace(/\\/g, '/');
    const parentCount = normalized.split('/').filter(s => s === '..').length;

    let targetDir = currentDir;
    for (let i = 0; i < parentCount; i++) {
        targetDir = path.dirname(targetDir);
    }

    return targetDir;
};

const findReExportInIndex = (indexFilePath, exportedName) => {
    try {
        if (!fs.existsSync(indexFilePath)) {
            return null;
        }

        const content = fs.readFileSync(indexFilePath, 'utf-8');

        const exportFromRegex = /export\s*\{\s*[^}]*?\b(\w+)\s*(?:as\s*\w+)?\s*\}\s*from\s*['"]([^'"]+)['"]/g;

        let match;
        while ((match = exportFromRegex.exec(content)) !== null) {
            const [_, exportName, exportPath] = match;
            if (exportName === exportedName) {
                return exportPath;
            }
        }

        const exportAllRegex = /export\s*\*\s*from\s*['"]([^'"]+)['"]/g;
        while ((match = exportAllRegex.exec(content)) !== null) {
            const [_, exportPath] = match;
        }

        return null;
    } catch (error) {
        console.warn(`Failed to read index.ts: ${error.message}`);
        return null;
    }
};

const resolveActualFilePath = (basePath, relativeImport) => {
    const resolved = path.resolve(basePath, relativeImport);

    const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx'];

    for (const ext of extensions) {
        const fullPath = resolved + ext;
        if (fs.existsSync(fullPath)) {
            return fullPath;
        }
    }

    return resolved;
};

const isSameFsdModule = (file1, file2) => {
    const slice1 = getFsdSlice(file1);
    const slice2 = getFsdSlice(file2);
    return slice1 !== null && slice1 === slice2;
};

module.exports = {
    meta: {
        type: `suggestion`,
        docs: {
            description: "Resolve public API imports to direct relative paths within same module",
            recommended: false,
            url: null,
        },
        fixable: `code`,
        schema: [],
        messages: {
            resolvePublicApiImport: `Use direct relative import instead of public API within the same module`,
        },
    },

    create(context) {
        return {
            ImportDeclaration(node) {
                const importPath = node.source.value;
                const currentFile = context.getFilename();

                if (!isOnlyParentDirs(importPath)) {
                    return;
                }

                const targetDir = resolveTargetDirectory(importPath, currentFile);
                const indexPath = path.join(targetDir, 'index.ts');

                const importedNames = node.specifiers
                    .filter(spec => spec.type === 'ImportSpecifier')
                    .map(spec => spec.imported.name);

                if (importedNames.length === 0) {
                    return;
                }

                const reExportPath = findReExportInIndex(indexPath, importedNames[0]);

                if (!reExportPath) {
                    return;
                }

                const actualFilePath = resolveActualFilePath(targetDir, reExportPath);

                if (!isSameFsdModule(currentFile, actualFilePath)) {
                    return;
                }

                const directRelativePath = calculateRelativePath(currentFile, actualFilePath);

                if (directRelativePath === importPath) {
                    return;
                }

                context.report({
                    node,
                    messageId: `resolvePublicApiImport`,
                    fix(fixer) {
                        return fixer.replaceText(node.source, `'${directRelativePath}'`);
                    }
                });
            }
        };
    },
};