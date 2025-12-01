NEVER START BACKGROUND PROCESSES. If you find that one was started, kill it immediately.

Prefer the words "no" or "none," "a few," "some," "many," or "all" rather than giving explicit counts of things, unless it's strictly necessary to understand a situation.

Run 'mise validate' to check your work. 'mise dev' is always running and you are forbidden from starting additional copies. Prompt me if it doesn't seem to be running.

@mise.toml is the canonical manifets of scripts relevant to this project.

"Backward compatibility" isn't real, this is a greenfield project. After each set of changes, evaluate whether you added "backward compatibility." If so, delete it immediately.

Never run typecheck via pnpm. Always use 'mise validate'.

Typically, test changes after validate using chrome devtools MCP.

Ask permission before taking visual snapshots of chrome devtools MCP. Prefer using code-based evaluation over visual evaluation.

Sometimes hot reloading doesn't work. Try reloading as a debugging step.

Read @pkg-js/design-system/src/styles/variables.css
