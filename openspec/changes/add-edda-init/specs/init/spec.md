# Spec Delta

## Purpose

`edda init` sets Edda up in a repository by giving it a place for its record. Running it again is always safe.

## ADDED Requirements

### Requirement: Seeds the record
`edda init` SHALL create `edda/README.md` in the current working directory, creating the `edda/` directory if needed. The file's content SHALL be the seed record that ships with the package.

#### Scenario: Fresh repository
- **GIVEN** a directory with no `edda/` directory
- **WHEN** a user runs `edda init` there
- **THEN** `edda/README.md` exists with the seed record's content, the command reports that it created the file, and it exits with status 0

#### Scenario: Directory exists without a record
- **GIVEN** a directory with an `edda/` directory but no `edda/README.md`
- **WHEN** a user runs `edda init` there
- **THEN** `edda/README.md` is created with the seed record's content, and nothing else in `edda/` changes

### Requirement: Never overwrites an existing record
`edda init` SHALL leave an existing `edda/README.md` unchanged, report that it left the file alone, and exit with status 0.

#### Scenario: Running init again
- **GIVEN** a directory whose `edda/README.md` has been edited since it was created
- **WHEN** a user runs `edda init` there
- **THEN** the file's content is unchanged, the command says it left the file as it is, and it exits with status 0

### Requirement: Reports failures
If `edda init` can't create the record, for example because `edda` already exists as a file, it SHALL print an error to standard error and exit with a non-zero status.

#### Scenario: edda is a file
- **GIVEN** a directory where `edda` is a regular file
- **WHEN** a user runs `edda init` there
- **THEN** the command prints an error starting with `edda:` to standard error, exits with a non-zero status, and leaves the file unchanged

### Requirement: Changes nothing else
`edda init` SHALL NOT create, change or delete any file outside `edda/README.md` and its `edda/` directory.

#### Scenario: Other files untouched
- **GIVEN** a repository with an `AGENTS.md`, a `CLAUDE.md` and a `.claude/` directory
- **WHEN** a user runs `edda init` there
- **THEN** only `edda/README.md` (and `edda/`, if it was missing) is added, and every other file is unchanged
