# CLAUDE.md - Project Instructions

## Project Overview
LLM Agents Office is a visual workspace showing AI agents as cartoon characters
collaborating in an office environment, powered by a shared knowledge base and
an autonomous Ralph Wiggum bash loop.

## Tech Stack
- Frontend: React 18 + Vite 5
- Backend: Node.js + Express + WebSocket (ws)
- Automation: Bash (Ralph Wiggum loop)
- No TypeScript, no build-time dependencies beyond Vite

## Key Commands
```bash
npm install           # Install dependencies
npm run dev           # Start dev (client + server)
npm run build         # Production build
bash ralph_loop.sh    # Start autonomous loop
bash ralph_monitor.sh # Live monitoring dashboard
```

## Architecture
- `src/agents/` - Agent definitions (6 agents) and orchestrator
- `src/knowledgebase/` - Document store with keyword search
- `src/components/` - React components (OfficeWorkspace, ActivityFeed, TaskPanel, StatusBar, KnowledgePanel)
- `src/server/` - Express REST API + WebSocket server
- `lib/` - Bash libraries for circuit breaker and response analysis
- `.ralph/` - Loop state, prompts, and fix plan

## Conventions
- ES modules everywhere (import/export)
- Functional React components with hooks
- CSS in global.css with BEM-like naming
- Agent IDs are lowercase short names (ada, byte, chip, dot, echo, flux)
