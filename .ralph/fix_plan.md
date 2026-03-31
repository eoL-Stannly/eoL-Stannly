# Active Development Tasks — AGI HQ

## North Star Reference
See `.ralph/MVP_PLAN.md` for the full 5-phase roadmap.
See `.ralph/PROMPT.md` for the vision and principles.

## Completed (Previous Phases)
- [x] Project structure (React + Node + Ralph)
- [x] Agent definitions with SEO roles and personalities
- [x] Agent Orchestrator with task queue
- [x] Knowledge Base with keyword search
- [x] Office Workspace UI with pixel art characters
- [x] Ralph Wiggum bash loop with safety mechanisms
- [x] Ralph Monitor dashboard
- [x] Activity Feed, Task Panel, Knowledge Panel
- [x] Ayima branding (navy/cyan palette, logo)
- [x] Expanded office (meeting rooms, breakout, garden)
- [x] 8 SEO task buttons
- [x] KB file upload (PDF, TXT, MD, CSV, HTML, JSON, XML, DOC, RTF)
- [x] KB URL import with HTML-to-markdown conversion
- [x] KB management (remove, clear seed docs)
- [x] Idle agent behaviors (water cooler, coffee, speech bubbles)

## Phase 1: Real Agent Brains (CURRENT)

- [ ] 1.1 Create ClaudeClient.js — Anthropic SDK wrapper
  - API key from env var ANTHROPIC_API_KEY
  - Message formatting with system prompt + KB context
  - Streaming response support
  - Token counting and error handling

- [ ] 1.2 Replace simulated callLLM() in AgentOrchestrator.js
  - Wire to ClaudeClient
  - Inject agent system prompt + personality
  - Auto-search KB for relevant context (top 5 docs)
  - Return real LLM response

- [ ] 1.3 Wire App.jsx to real orchestrator (remove fake setTimeout flow)
  - Real API calls to /api/tasks
  - Stream thinking state during processing
  - Display real response in Activity Feed
  - Show KB sources used

- [ ] 1.4 Add "Ask a Question" UI mode
  - Freeform text input
  - Agent selector (specific agent or "ask the team")
  - Rich text response display
  - Question history

## Phase 2: Deliverable Engine (NEXT)

- [ ] 2.1 Define deliverable schemas per task type
- [ ] 2.2 Create DeliverableEngine.js (templates + LLM fill)
- [ ] 2.3 Build deliverable customisation UI (domain, format, scope)
- [ ] 2.4 Build results panel (inline display + download)

## Guard Rails
- Every change must pass `npm run build`
- No API keys committed to git
- Rate limit all LLM calls
- Circuit breaker for stalled development
