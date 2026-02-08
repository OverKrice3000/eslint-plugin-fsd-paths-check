"use strict";

const path = require("path");

module.exports = {
  meta: {
    type: `suggestion`, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "FSD relative path check",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: `code`,
    schema: [
      {
        type: `object`,
        properties: {
          alias: {
            type: `string`,
          }
        }
      }
    ],
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
  const alias = context.options[0]?.alias ?? ``;
  const value = node.source.value;
  const pathTo = alias ? value.replace(`${alias}`, ``) : value;
  const currentFile = context.getFilename();

  if(shouldBeRelative(currentFile, pathTo)) {
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

const fsdLayers = {
  'shared': 'shared',
  'entities': 'entities',
  'features': 'features',
  'widgets': 'widgets',
  'pages': 'pages',
}

function isPathRelative(path) {
  return path === `.` || path.startsWith(`./`) || path.startsWith('../');
}

function getProjectPath(fullPath) {
  const fromNormalized = path.toNamespacedPath(fullPath);

  return fromNormalized.split(`src/`)[1];
}

function shouldBeRelative(from, to) {
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
