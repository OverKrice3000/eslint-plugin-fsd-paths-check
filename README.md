# eslint-plugin-path-check

Plugin to check feature sliced design paths correctness

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-fsd-paths-check`:

```sh
npm install eslint-plugin-fsd-paths-check --save-dev
```

## Usage

In your [configuration file](https://eslint.org/docs/latest/use/configure/configuration-files#configuration-file), import the plugin `eslint-plugin-fsd-paths-check` and add `fsd-paths-check` to the `plugins` key:

```js
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        plugins: {
            [`fsd-paths-check`]
        }
    }
]);
```


Then configure the rules you want to use under the `rules` key.

```js
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        plugins: {
            [`fsd-paths-check`]
        },
        rules: {
            "fsd-paths-check/rule-name": "warn"
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


