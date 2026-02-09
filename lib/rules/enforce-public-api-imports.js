"use strict";

const { isPathRelative } = require("../helpers/isPathRelative");
const {isSameModuleImport} = require("../helpers/isSameModuleImport");

const fsdLayers = {
  'entities': 'entities',
  'features': 'features',
  'widgets': 'widgets',
  'pages': 'pages',
}

module.exports = {
  meta: {
    type: `suggestion`,
    docs: {
      description: "Rule to enforce other modules public api usage",
      recommended: false,
      url: null,
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
      useOthersModulesPublicApi: `When importing from other modules, public api should be used`,
      doNotUseAbsolutePathInSameModuleImport: `When importing from the same module, absolute path should not be used`,
    },
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        const alias = context.options[0]?.alias ?? ``;
        const value = node.source.value;
        const pathTo = alias ? value.replace(`${alias}`, ``) : value;
        const currentFile = context.getFilename();

        if(isPathRelative(pathTo)) {
          return;
        }

        const segments = pathTo.split("/");
        const layer = segments[0];

        if(!fsdLayers[layer]) {
          return;
        }

        const isImportNotFromPublicApi = segments.length > 2;
        const isSameModule = isSameModuleImport(currentFile, pathTo, fsdLayers);

        if (isImportNotFromPublicApi && !isSameModule) {
          context.report({
            node,
            messageId: `useOthersModulesPublicApi`,
            fix(fixer) {
              const index = value.indexOf(segments[1]);
              if (index === -1) return undefined;

              const publicPathImport = value.substring(0, index + segments[1].length);

              return fixer.replaceText(node.source, `'${publicPathImport}'`);
            }
          })
        }
        else if (isSameModule) {
          context.report({
            node,
            messageId: `doNotUseAbsolutePathInSameModuleImport`
          })
        }
      }
    };
  },
};
