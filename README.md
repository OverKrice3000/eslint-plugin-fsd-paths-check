# eslint-plugin-path-check

plugin to check typescript imports

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-path-check`:

```sh
npm install eslint-plugin-path-check --save-dev
```

## Usage

In your [configuration file](https://eslint.org/docs/latest/use/configure/configuration-files#configuration-file), import the plugin `eslint-plugin-path-check` and add `path-check` to the `plugins` key:

```js
import { defineConfig } from "eslint/config";
import path-check from "eslint-plugin-path-check";

export default defineConfig([
    {
        plugins: {
            path-check
        }
    }
]);
```


Then configure the rules you want to use under the `rules` key.

```js
import { defineConfig } from "eslint/config";
import path-check from "eslint-plugin-path-check";

export default defineConfig([
    {
        plugins: {
            path-check
        },
        rules: {
            "path-check/rule-name": "warn"
        }
    }
]);
```



## Configurations

<!-- begin auto-generated configs list -->
TODO: Run eslint-doc-generator to generate the configs list (or delete this section if no configs are offered).
<!-- end auto-generated configs list -->



## Rules

<!-- begin auto-generated rules list -->
TODO: Run eslint-doc-generator to generate the rules list.
<!-- end auto-generated rules list -->


