# Proposal

## Why

`edda-ai` 0.1.0 is merged but not yet on npm (Linear issue EDA-3). npm shows the package root's `README.md` on the package page, and the package has none, so the page would be blank. A version number can never be reused once it's published, so the first release should go out complete and tested.

## What Changes

- Add a package `README.md` for the npm page. It says what Edda is, how to run `npx edda-ai init`, what that does today, and what's coming. This is product documentation for people, and it's separate from the record that `edda init` seeds.
- Add a `prepublishOnly` script that runs the tests, so `npm publish` stops if they fail.
- No change to the CLI's behavior, so there are no spec changes (`skip_specs: true`).
- Out of scope: more links to the GitHub repository (`homepage`, `bugs`). The repository is private, so those links would 404 for everyone else.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None.

## Impact

- New file: `README.md`. npm always includes the root README in the package, so it ships without changing `files`.
- `package.json` gets a `prepublishOnly` script.
- The published package grows from 4 files to 5.
