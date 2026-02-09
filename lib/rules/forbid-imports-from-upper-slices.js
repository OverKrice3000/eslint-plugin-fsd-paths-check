"use strict";

const path = require("path");
const {isPathRelative} = require("../helpers/isPathRelative");
const micromatch = require("micromatch");

const fsdLayers = {
  'shared': 'shared',
  'entities': 'entities',
  'features': 'features',
  'widgets': 'widgets',
  'pages': 'pages',
  'app': 'app'
}

const allowedLayerImports = {
  app: ['pages', 'widgets', 'features', 'entities', 'shared'],
  pages: ['widgets', 'features', 'entities', 'shared'],
  widgets: ['features', 'entities', 'shared'],
  features: ['entities', 'shared'],
  entities: ['entities', 'shared'],
  shared: ['shared'],
}

module.exports = {
  meta: {
    type: `suggestion`,
    docs: {
      description: "Rule, which forbids imports from upper fsd slices",
      recommended: false,
      url: null,
    },
    fixable: null,
    schema: [
      {
        type: `object`,
        properties: {
          alias: {
            type: `string`,
          },
          ignoreImportPatterns: {
            type: `array`,
          }
        }
      }
    ],
    messages: {
      doNotImportFromUpperFSDLayers: `Imports from upper FSD layers are prohibited`
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
  const { alias = '', ignoreImportPatterns = [] } = context.options[0] ?? {};

  const getCurrentFileLayer = (currentFilePath) => {
    const normalizedPath = path.toNamespacedPath(currentFilePath);
    const projectPath = normalizedPath?.split('src')[1];
    const segments = projectPath?.split('/');

    return segments?.[1];
  }

  const getImportLayer = (value) => {
    const importPath = alias ? value.replace(alias, '') : value;
    const segments = importPath?.split('/');

    return segments?.[0];
  }

  if(!node.source) {
    return;
  }

  const currentFilePath = context.getFilename();
  const importPath = node.source.value;
  const currentFileLayer = getCurrentFileLayer(currentFilePath);
  const importLayer = getImportLayer(importPath);

  if(isPathRelative(importPath)) {
    return;
  }

  if(!currentFileLayer || !fsdLayers[importLayer] || !fsdLayers[currentFileLayer]) {
    return;
  }

  const isIgnored = ignoreImportPatterns.some((pattern) => {
    return micromatch.isMatch(importPath, pattern);
  })

  if(isIgnored) {
    return;
  }

  if(!allowedLayerImports[currentFileLayer].includes(importLayer)) {
    context.report({
      node,
      messageId: `doNotImportFromUpperFSDLayers`
    })
  }
}
