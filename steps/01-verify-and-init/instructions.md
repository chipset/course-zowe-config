# Verify Zowe CLI and Create Global Config

Before working with Zowe configuration files, confirm the CLI is installed and then create the global configuration file.

## Step 1 — Verify Zowe CLI

Run:

```
zowe --help
```

If a list of commands is displayed, the CLI is ready. If not, Zowe CLI needs to be installed — ask your instructor.

## Step 2 — Create the global config file

Zowe supports multiple configuration files at different levels. The **global configuration file** lives in `~/.zowe` and acts as the base layer — it's used whenever no project-level config is present.

Create it with:

```
zowe config init --gc
```

You'll see a warning about secure credential storage — this is expected in workshop environments where the OS keychain isn't configured. The important line is:

```
Saved config template to /home/developer/.zowe/zowe.config.json
```

## Step 3 — Inspect what was created

Navigate to the global config folder and list its contents:

```
ls -la ~/.zowe
```

Two files are of interest:

| File | Purpose |
|---|---|
| `zowe.config.json` | All connection settings for the Zowe CLI and Zowe Explorer |
| `zowe.schema.json` | JSON schema — drives editor validation and autocomplete |

You can type 
```code ~/.zowe/zowe.config.json```
And it will open the file. 

To open the config.json, type:
```code ~/.zowe/zowe.schema.json```

## About that secure storage warning

The warning you saw is because `zowe config secure` — the command that normally prompts for sensitive properties (like `user`, `password`, `tokenValue`) and writes them into the OS keychain instead of the plain-text config file — needs a keychain that this workshop container doesn't have. In a real install, after running `zowe config secure` those properties would move into each profile's `secure` array and disappear from `properties`.

This course uses a different workaround (environment variables) covered in a later step, so you won't run `zowe config secure` for real here. You can still see what it offers:

```
zowe config secure --help
```

This is informational only — nothing here is checked.

Click **Check Work** when done.
