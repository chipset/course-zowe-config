# Named Profiles and Defaults

So far you've had exactly one profile of each type (`zosmf`, `tso`, `ssh`). In practice, a team config often holds **several profiles of the same type** — one per mainframe, environment, or LPAR — and the `defaults` block decides which one gets used when a command doesn't say otherwise.

Open the global config file:

```
code ~/.zowe/zowe.config.json
```

## Look at `defaults`

Find the `defaults` object:

```json
"defaults": {
    "zosmf": "zosmf",
    "tso": "tso",
    "ssh": "ssh",
    "base": "global_base"
}
```

Each key is a profile **type**, and each value is the **name** of the profile to use for that type when a command doesn't specify one. Right now, the type `zosmf` defaults to the profile named `zosmf`.

## Step 1 — Add a second zosmf profile

Inside `profiles`, add a new profile named `zosmf_test` alongside your existing `zosmf` profile:

```json
"zosmf_test": {
    "type": "zosmf",
    "properties": {
        "port": 443
    },
    "secure": []
}
```

This simulates a second z/OSMF instance — one that's reachable, but listening on the wrong port (443 instead of 10443) so you can tell the two profiles apart by their behavior. Save the file.

## Step 2 — Confirm nothing changed yet

`defaults.zosmf` still points at `zosmf`, so this should still work:

```
zowe files list ds "cust001.*"
```

## Step 3 — Select the other profile explicitly

Every service command group has a `--<type>-profile` flag that picks a specific named profile, ignoring `defaults`:

```
zowe files list ds "cust001.*" --zosmf-profile zosmf_test
```

This should fail with `ECONNREFUSED` — you've explicitly targeted `zosmf_test`, which is on the wrong port, without touching `defaults` at all.

## Step 4 — Change the default itself

Now edit `defaults.zosmf` and change it from `"zosmf"` to `"zosmf_test"`. Save the file, then run the baseline command **without any flag**:

```
zowe files list ds "cust001.*"
```

It fails the same way — because now `zosmf_test` *is* the default. `defaults` controls which named profile is used implicitly; `--<type>-profile` overrides it for a single command.

## Step 5 — Restore the default

Change `defaults.zosmf` back to `"zosmf"` and save. Confirm the baseline works again:

```
zowe files list ds "cust001.*"
```

Click **Check Work** when done.
