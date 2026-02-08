"use strict";

const rule = require("../../../lib/rules/enforce-public-api-imports"),
  RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  }
});
const aliasOptions = [{
  alias: `@/`
}];
ruleTester.run("enforce-public-api-imports", rule, {
  valid: [
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentForm'"
    },
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
      options: aliasOptions,
    },
    {
      code: "import { useCallback } from 'react'",
    },
    {
      code: "import { useCallback } from 'react/internals'",
    },
  ],

  invalid: [
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/file.ts'",
      errors: [{ messageId: `useOthersModulesPublicApi` }],
      options: aliasOptions,
      output: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'"
    },
    {
      filename: '/Users/igor/WebstormProjects/ProductionProject/src/entities/Article/ui/Article.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/types/article'",
      options: aliasOptions,
      errors: [{ messageId: `doNotUseAbsolutePathInSameModuleImport` }],
    }
  ],
});
