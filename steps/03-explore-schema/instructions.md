# Explore the Configuration Schema

Open `zowe.config.schema` in the editor:

```
code ~/.zowe/zowe.config.schema
```

> **Do not modify this file.** It is managed automatically by Zowe CLI.

## What is it?

The schema file lists every valid property for every profile type in `zowe.config.json`. It serves two purposes:

1. **Validation** — if you make a typo in `zowe.config.json`, your editor will underline it
2. **Autocomplete** — editors like VS Code use the schema to suggest property names and values as you type

## How it stays up to date

When you install a new Zowe CLI plugin, the plugin registers its own profile types and properties. Running:

```
zowe config update-schemas
```

regenerates the schema file (and any schema files further up the directory tree) to include the new plugin's settings. This keeps editor tooling accurate as your plugin set changes.

## Try it

Scroll through `zowe.config.schema` and find the `zosmf` profile type. Notice how each property lists its type, description, and valid values — exactly what VS Code reads to power IntelliSense in `zowe.config.json`.

When you're done exploring, close the schema file and click **Check Work**.
