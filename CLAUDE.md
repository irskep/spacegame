NEVER START BACKGROUND PROCESSES. If you find that one was started, kill it immediately.

Run 'mise validate' to check your work. 'mise dev' is always running and you are forbidden from starting additional copies. Prompt me if it doesn't seem to be running.

@mise.toml is the canonical manifets of scripts relevant to this project.

"Backward compatibility" isn't real, this is a greenfield project. After each set of changes, evaluate whether you added "backward compatibility." If so, delete it immediately.

Never run typecheck via pnpm. Always use 'mise validate'.

Ask permission before taking visual snapshots of chrome devtools MCP. Prefer using code-based evaluation over visual evaluation.
