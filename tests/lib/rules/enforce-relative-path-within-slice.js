"use strict";

const rule = require("../../../lib/rules/enforce-relative-path-within-slice"),
  RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  }
});
ruleTester.run("enforce-relative-path-within-slice", rule, {
  valid: [
    {
      filename: '/Users/igor/WebstormProjects/ProductionProject/src/features/Article/model/types/article.ts',
      code: "import { addCommentFormActions } from 'entities/Article/model/slices/addCommentForm'",
    },
    {
      code: "const rating = 5; export { rating };",
    },
  ],

  invalid: [
    {
      filename: '/Users/igor/WebstormProjects/ProductionProject/src/entities/Article/model/types/article.ts',
      code: "import { addCommentFormActions } from 'entities/Article/model/slices/addCommentForm'",
      errors: [{ messageId: "useRelativePathWithinSlice" }],
      output: "import { addCommentFormActions } from '../slices/addCommentForm'"
    },
    {
      filename: '/Users/igor/WebstormProjects/ProductionProject/src/entities/Article/model/types/article.ts',
      code: "import { addCommentFormActions } from '@/entities/Article/model/slices/addCommentForm'",
      errors: [{ messageId: "useRelativePathWithinSlice" }],
      options: [{
        alias: `@/`
      }],
      output: "import { addCommentFormActions } from '../slices/addCommentForm'"
    },
    {
      filename: '/Users/igor/WebstormProjects/ProductionProject/src/entities/Article/index.ts',
      code: "import { addCommentFormActions } from 'entities/Article/model/slices/addCommentForm'",
      errors: [{ messageId: "useRelativePathWithinSlice" }],
      output: "import { addCommentFormActions } from './model/slices/addCommentForm'"
    },
    {
      filename: '/Users/igor/WebstormProjects/ProductionProject/src/entities/Rating/index.ts',
      code: "export { RatingCard } from '@/entities/Rating/ui/RatingCard/RatingCard'",
      errors: [{ messageId: "useRelativePathWithinSlice" }],
      options: [{
        alias: `@/`
      }],
      output: "export { RatingCard } from './ui/RatingCard/RatingCard'"
    },
  ],
});
