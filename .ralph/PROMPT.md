# AGI HQ — North Star

## Vision
AGI HQ is a self-service desk for Ayima clients. Clients request pre-defined SEO
deliverables (keyword research, technical audits, redirect mappings, etc.),
customise the format to suit their needs, or ask questions to specific agents
who answer after retrieving relevant context from the knowledge base.

## Current Phase: Phase 1 — Real Agent Brains
Connect real LLM (Claude) to the agent system so agents actually think,
retrieve KB context, and return real answers — not simulations.

## Architecture
- Frontend: React 18 + Vite 5 (pixel art game UI, Ayima brand)
- Backend: Node.js + Express + WebSocket (ws)
- Knowledge Base: In-memory keyword search + file uploads + URL import
- Agents: 8 SEO specialists with defined roles and personalities
- Automation: Ralph Wiggum bash loop for continuous development
- LLM: Anthropic Claude API (to be integrated)

## Key Principles
1. Every change must move toward the north star (client self-service)
2. Agents must use the knowledge base for grounded responses
3. Deliverables must be real, downloadable, and useful
4. The UI must feel like a product, not a demo
5. Safety first — circuit breakers, rate limits, cost controls

## Reference
- See `.ralph/MVP_PLAN.md` for the full phased roadmap
- See `.ralph/fix_plan.md` for the current active task list
- See `CLAUDE.md` for project conventions and commands
