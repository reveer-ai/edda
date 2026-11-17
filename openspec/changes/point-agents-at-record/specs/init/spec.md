# Spec Delta

## MODIFIED Requirements

### Requirement: Seeds the record
`edda init` SHALL create `edda/index.md` in the current working directory, creating the `edda/` directory if needed. The file's content SHALL be the seed index that ships with the package: a blank slate that leaves the record's contents and shape to the project's agent.

#### Scenario: Fresh repository
- **GIVEN** a directory with no `edda/` directory
- **WHEN** a user runs `edda init` there
- **THEN** `edda/index.md` exists with the seed index's content, the command reports that it created the file, and it exits with status 0

#### Scenario: Directory exists without a record
- **GIVEN** a directory with an `edda/` directory but no `edda/index.md`
- **WHEN** a user runs `edda init` there
- **THEN** `edda/index.md` is created with the seed index's content, and nothing else in `edda/` changes

#### Scenario: Record from 0.1.0
- **GIVEN** a directory with an `edda/README.md` and no `edda/index.md`
- **WHEN** a user runs `edda init` there
- **THEN** `edda/index.md` is created with the seed index's content, and `edda/README.md` is unchanged

### Requirement: Never overwrites an existing record
`edda init` SHALL leave an existing `edda/index.md` unchanged, report that it left the file alone, and continue.

#### Scenario: Running init again
- **GIVEN** a directory whose `edda/index.md` has been edited since it was created
- **WHEN** a user runs `edda init` there
- **THEN** the file's content is unchanged, the command says it left the file as it is, and it exits with status 0

### Requirement: Reports failures
If any step of `edda init` fails, for example because `edda` already exists as a file, it SHALL print an error to standard error, exit with a non-zero status, and stop at the failing step. It seeds the index first, so a failure there leaves everything else unchanged.

#### Scenario: edda is a file
- **GIVEN** a directory where `edda` is a regular file
- **WHEN** a user runs `edda init` there
- **THEN** the command prints an error starting with `edda:` to standard error, exits with a non-zero status, leaves the file unchanged, and creates or changes nothing else

### Requirement: Changes nothing else
`edda init` SHALL NOT create, change or delete anything except `edda/index.md` and its `edda/` directory, the pointer block in `AGENTS.md` and `CLAUDE.md`, and `AGENTS.md` when it creates one.

#### Scenario: Other files untouched
- **GIVEN** a repository with other files in `edda/`, an `AGENTS.md` with its own content, and a `.claude/` directory
- **WHEN** a user runs `edda init` there
- **THEN** the other files in `edda/` and everything in `.claude/` are unchanged, and `AGENTS.md` keeps its own content, followed by the pointer block

#### Scenario: Running init twice
- **GIVEN** a directory where `edda init` has run
- **WHEN** a user runs `edda init` there again
- **THEN** every file is the same as after the first run

## ADDED Requirements

### Requirement: Points agents at the record
`edda init` SHALL append a pointer block to the end of each of `AGENTS.md` and `CLAUDE.md` that exists, except a `CLAUDE.md` that imports `AGENTS.md`, leaving the rest of the file unchanged. The block SHALL start with a line `<!-- edda:begin -->` and end with a line `<!-- edda:end -->`. It SHALL tell the agent to start by reading `edda/index.md`, and SHALL import it with a line `@edda/index.md`.

#### Scenario: Both files exist
- **GIVEN** a directory with an `AGENTS.md` and a `CLAUDE.md` that doesn't import it
- **WHEN** a user runs `edda init` there
- **THEN** each file keeps its content, followed by a blank line and the pointer block, and the command reports each file it changed

#### Scenario: Only one file exists
- **GIVEN** a directory with a `CLAUDE.md` and no `AGENTS.md`
- **WHEN** a user runs `edda init` there
- **THEN** `CLAUDE.md` ends with the pointer block, and no `AGENTS.md` is created

#### Scenario: Block contents
- **WHEN** init adds the pointer block
- **THEN** the block names `edda/index.md` and contains the line `@edda/index.md`

### Requirement: Skips a CLAUDE.md that imports AGENTS.md
When `AGENTS.md` exists and `CLAUDE.md` imports it, `edda init` SHALL put the pointer block only in `AGENTS.md`, because Claude Code gets it through the import. It SHALL remove any pointer block an earlier run put in `CLAUDE.md`, and leave the rest of `CLAUDE.md` unchanged. `CLAUDE.md` imports `AGENTS.md` when, outside fenced code blocks, it has a line that, after trimming whitespace, is exactly `@AGENTS.md` or `@./AGENTS.md`.

#### Scenario: CLAUDE.md is only the import
- **GIVEN** a directory with an `AGENTS.md` and a `CLAUDE.md` whose only line is `@AGENTS.md`
- **WHEN** a user runs `edda init` there
- **THEN** `AGENTS.md` ends with the pointer block, and `CLAUDE.md` is unchanged

#### Scenario: Import added after an earlier run
- **GIVEN** a directory where `edda init` put a pointer block in both `AGENTS.md` and `CLAUDE.md`, and a `@AGENTS.md` line has since been added to `CLAUDE.md`
- **WHEN** a user runs `edda init` there again
- **THEN** `CLAUDE.md` no longer has a pointer block and its other content is unchanged, and `AGENTS.md` has exactly one pointer block

#### Scenario: Not a line of its own
- **GIVEN** a directory with an `AGENTS.md` and a `CLAUDE.md` that mentions `@AGENTS.md` only inside a sentence, in a code span, or in a fenced code block
- **WHEN** a user runs `edda init` there
- **THEN** both files end with the pointer block

#### Scenario: Import of a missing file
- **GIVEN** a directory with no `AGENTS.md` and a `CLAUDE.md` with a `@AGENTS.md` line
- **WHEN** a user runs `edda init` there
- **THEN** `CLAUDE.md` ends with the pointer block, and no `AGENTS.md` is created

### Requirement: Creates AGENTS.md when there's neither file
If neither `AGENTS.md` nor `CLAUDE.md` exists, `edda init` SHALL create `AGENTS.md` holding only the pointer block, and report that it created it.

#### Scenario: No agent instructions file
- **GIVEN** a directory with neither `AGENTS.md` nor `CLAUDE.md`
- **WHEN** a user runs `edda init` there
- **THEN** `AGENTS.md` exists and holds only the pointer block, and no `CLAUDE.md` is created

### Requirement: Replaces the pointer in place
When a file already has a pointer block, `edda init` SHALL replace that block where it is with the current one, instead of adding another, and leave the rest of the file unchanged. An end marker SHALL pair with the nearest begin marker before it.

#### Scenario: Running init again
- **GIVEN** a directory where `edda init` has run, and the block in `AGENTS.md` has since been edited and text added after it
- **WHEN** a user runs `edda init` there again
- **THEN** `AGENTS.md` has exactly one pointer block, the current one, in the same place, and the added text is unchanged

#### Scenario: One file linked to the other
- **GIVEN** a directory where `CLAUDE.md` is a symbolic link to `AGENTS.md`
- **WHEN** a user runs `edda init` there
- **THEN** `AGENTS.md` has exactly one pointer block

#### Scenario: Stray begin marker
- **GIVEN** an `AGENTS.md` with a `<!-- edda:begin -->` line and no end marker, followed by other text
- **WHEN** a user runs `edda init` there twice
- **THEN** the other text is unchanged and `AGENTS.md` has exactly one complete pointer block
