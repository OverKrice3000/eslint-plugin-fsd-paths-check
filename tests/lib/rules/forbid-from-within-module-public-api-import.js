const rule = require("../../../lib/rules/forbid-from-within-module-public-api-import"),
    RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 6,
        sourceType: "module",
    }
});

const baseProjectPath = 'C:\\Users\\igor\\WebstormProjects\\ProductionProject\\src';

ruleTester.run('fsd-resolve-public-api-imports', rule, {
    valid: [
        // Direct relative import (already correct)
        {
            code: "import { ArticleModel } from '../model/types/article'",
            filename: `${baseProjectPath}\\entities\\Article\\ui\\Article.ts`,
        },
        // Import from different module (public API is OK)
        {
            code: "import { Comment } from '../../features/Comment'",
            filename: `${baseProjectPath}\\entities\\Article\\ui\\Article.ts`,
        },
        // Import with additional path segments (not only parent dirs)
        {
            code: "import { x } from '../../model/types'",
            filename: `${baseProjectPath}\\entities\\Article\\ui\\Article.ts`,
        },
    ],
    invalid: []
});
