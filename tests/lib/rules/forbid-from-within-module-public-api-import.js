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
    invalid: [
        // Public API import within same module - should resolve through index.ts
        {
            filename: `${baseProjectPath}\\entities\\Article\\ui\\Article.ts`,
            code: "import { ArticleModel } from '../../'",
            errors: [{ messageId: 'resolvePublicApiImport' }],
        },
        // Deeper nesting
        {
            filename: `${baseProjectPath}\\entities\\Article\\ui\\Article\\Article.tsx`,
            code: "import { ArticleModel } from '../../../'",
            errors: [{ messageId: 'resolvePublicApiImport' }],
        },
        // Multiple imports (uses first one to resolve)
        {
            filename: `${baseProjectPath}\\features\\Comment\\ui\\CommentList\\CommentList.tsx`,
            code: "import { Comment, CommentDto } from '../../../'",
            errors: [{ messageId: 'resolvePublicApiImport' }],
        },
    ],
});
