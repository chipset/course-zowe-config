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

Click **Check Work** when done.
