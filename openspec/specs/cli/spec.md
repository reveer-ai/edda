# cli Specification

## Purpose
The `edda` command-line tool that ships in the `edda-ai` npm package: how commands are run, and how the tool reports its help, its version and its errors.

## Requirements

### Requirement: Runs from the edda-ai package
The `edda-ai` package SHALL provide an `edda` command that runs with `npx edda-ai <command>`, needing nothing installed except Node 18 or later.

#### Scenario: Run through npx
- **WHEN** a user runs `npx edda-ai --version` on a machine with Node 18 or later
- **THEN** the command prints the package version and exits with status 0

### Requirement: Shows help
The `edda` command SHALL print a usage summary listing its commands and options, and exit with status 0, when it is run with no arguments, with `--help`, or with `-h`.

#### Scenario: No arguments
- **WHEN** a user runs `edda` with no arguments
- **THEN** it prints a usage summary that lists `init`, and exits with status 0

#### Scenario: Help flag
- **WHEN** a user runs `edda --help` or `edda -h`
- **THEN** it prints the same usage summary and exits with status 0

### Requirement: Shows its version
The `edda` command SHALL print the installed package's version and exit with status 0 when it is run with `--version` or `-v`.

#### Scenario: Version flag
- **WHEN** a user runs `edda --version` or `edda -v`
- **THEN** it prints the version from the package's `package.json` and nothing else

### Requirement: Rejects unknown commands
The `edda` command SHALL print an error that names the unknown command, followed by the usage summary, to standard error, and exit with a non-zero status.

#### Scenario: Unknown command
- **WHEN** a user runs `edda bogus`
- **THEN** standard error contains `Unknown command: bogus` and the usage summary, and the exit status is non-zero
