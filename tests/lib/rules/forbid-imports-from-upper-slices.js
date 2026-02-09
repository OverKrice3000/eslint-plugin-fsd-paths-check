"use strict";

const rule = require("../../../lib/rules/forbid-imports-from-upper-slices"),
  RuleTester = require("eslint").RuleTester;

const aliasOptions = [
  {
    alias: '@/'
  }
]
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  }
});
ruleTester.run("forbid-imports-from-upper-slices", rule, {
  valid: [
    {
      filename: 'C:/Users/tim/Desktop/javascript/production_project/src/features/Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/shared/Button.tsx'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:/Users/tim/Desktop/javascript/production_project/src/features/Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:/Users/tim/Desktop/javascript/production_project/src/app/providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Articl'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:/Users/tim/Desktop/javascript/production_project/src/widgets/pages',
      code: "import { useLocation } from 'react-router-dom'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:/Users/tim/Desktop/javascript/production_project/src/app/providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'redux'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:/Users/tim/Desktop/javascript/production_project/src/index.tsx',
      code: "import { StoreProvider } from '@/app/providers/StoreProvider';",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:/Users/tim/Desktop/javascript/production_project/src/entities/Article.tsx',
      code: "import { StateSchema } from '@/app/providers/StoreProvider'",
      errors: [],
      options: [
        {
          alias: '@/',
          ignoreImportPatterns: ['**/StoreProvider']
        }
      ],
    },
    {
      filename: 'C:/Users/tim/Desktop/javascript/production_project/src/entities/Article.tsx',
      code: "import { StateSchema } from '@/app/providers/StoreProvider'",
      errors: [],
      options: [
        {
          alias: '@/',
          ignoreImportPatterns: ['**/StoreProvider']
        }
      ],
    },
    {
      filename: 'C:/Users/tim/Desktop/javascript/production_project/src/entities/Article/index.ts',
      code: "export { Article } from './ui/Article.tsx'",
      errors: [],
    },
  ],

  invalid: [
    {
      filename: 'C:/Users/tim/Desktop/javascript/production_project/src/entities/providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/features/Article'",
      errors: [{ messageId: `doNotImportFromUpperFSDLayers`}],
      options: aliasOptions,
    },
    {
      filename: 'C:/Users/tim/Desktop/javascript/production_project/src/features/providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Article'",
      errors: [{ messageId: `doNotImportFromUpperFSDLayers`}],
      options: aliasOptions,
    },
    {
      filename: 'C:/Users/tim/Desktop/javascript/production_project/src/entities/providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Article'",
      errors: [{ messageId: `doNotImportFromUpperFSDLayers`}],
      options: aliasOptions,
    },
    {
      filename: 'C:/Users/tim/Desktop/javascript/production_project/src/entities/providers',
      code: "export { addCommentFormActions, addCommentFormReducer } from '@/widgets/Article'",
      errors: [{ messageId: `doNotImportFromUpperFSDLayers`}],
      options: aliasOptions,
    },
  ],
});
