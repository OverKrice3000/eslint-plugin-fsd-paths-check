"use strict";

const path = require("path");
const { isSameModuleImport } = require("../helpers/isSameModuleImport");

const fsdLayers = {
  'shared': 'shared',
  'entities': 'entities',
  'features': 'features',
  'widgets': 'widgets',
  'pages': 'pages',
}

module.exports = {
  meta: {
    type: `suggestion`, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "FSD relative path check",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: `code`,
    schema: [{
        type: `object`,
        properties: {
          alias: {
            type: `string`,
          }
        }
      }],
    messages: {
      useRelativePathWithinSlice: `Imports within the slice should be relative`
    },
  },

  create(context) {
    return {
      ImportDeclaration: importExportDeclaration(context),
      ExportNamedDeclaration: importExportDeclaration(context),
    };
  },
};

const importExportDeclaration = (context) => (node) => {
  if(!node.source) {
    return;
  }

  const alias = context.options[0]?.alias ?? ``;
  const value = node.source.value;
  const pathTo = alias ? value.replace(`${alias}`, ``) : value;
  const currentFile = context.getFilename();

  if(isSameModuleImport(currentFile, pathTo, fsdLayers)) {
    context.report({
      node,
      messageId: `useRelativePathWithinSlice`,
      fix(fixer) {
        const projectFromPath = getProjectPath(currentFile);
        const currentDir = path.dirname(projectFromPath);
        const relativePath = path.relative(currentDir, pathTo);
        const finalRelativePath = relativePath.startsWith(`.`) ? relativePath : `./${relativePath}`;

        return fixer.replaceText(node.source, `'${finalRelativePath}'`);
      }
    });
  }
}

function getProjectPath(fullPath) {
  const fromNormalized = path.toNamespacedPath(fullPath);

  return fromNormalized.split(`src/`)[1];
}
