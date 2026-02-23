"use strict";

const isOnlyParentDirs = (importPath) => {
    const normalized = importPath.replace(/\\/g, '/');
    const segments = normalized.split('/').filter(s => s.length > 0);
    return segments.every(s => s === '..');
};

module.exports = {
    meta: {
        type: `suggestion`,
        docs: {
            description: "Resolve public API imports to direct relative paths within same module",
            recommended: false,
            url: null,
        },
        fixable: null,
        schema: [],
        messages: {
            resolvePublicApiImport: `Use direct relative import instead of public API within the same module`,
        },
    },

    create(context) {
        return {
            ImportDeclaration(node) {
                const importPath = node.source.value;

                if (isOnlyParentDirs(importPath)) {
                    context.report({
                        node,
                        messageId: `resolvePublicApiImport`,
                    });
                }
            }
        };
    },
};