# AGI HQ — Self-Service Client Desk MVP

## North Star
AGI HQ is a self-service desk for Ayima clients. Clients request pre-defined SEO
deliverables, customise formats, or ask questions to specific agents. Agents retrieve
context from the knowledge base and produce real, useful output — not simulations.

## Current State (What Works)
- ✅ Pixel art UI with 8 SEO agents, idle behaviors, speech bubbles
- ✅ Knowledge base with search, file upload, URL import, manage
- ✅ Ralph Wiggum bash loop (autonomous Claude Code invocation)
- ✅ Express REST API + WebSocket server
- ✅ 8 SEO task buttons (Keyword Research, Content Production, etc.)
- ❌ LLM calls are simulated (hardcoded responses)
- ❌ No real agent reasoning or KB retrieval
- ❌ No deliverable output (no files, reports, or formatted answers)
- ❌ No client customisation of deliverables
- ❌ No persistent storage (in-memory only)

---

## PHASE 1: Real Agent Brains (Connect LLM)
**Goal**: Agents actually think. When you ask a question or submit a task,
a real LLM processes it with KB context and returns a real answer.

- [ ] 1.1 Create `src/agents/ClaudeClient.js` — Anthropic SDK wrapper
  - API key management (env var ANTHROPIC_API_KEY)
  - Message formatting (system prompt + KB context + user query)
  - Streaming response support
  - Token counting and cost tracking
  - Rate limiting (respect API limits)
  - Error handling (401, 429, 5xx with retry)

- [ ] 1.2 Replace simulated `callLLM()` in AgentOrchestrator.js
  - Wire callLLM to ClaudeClient
  - Inject agent's system prompt + personality
  - Search KB for relevant context (top 5 docs)
  - Include KB results in the prompt as grounding context
  - Return real LLM response to the UI

- [ ] 1.3 Wire App.jsx task submission to real orchestrator
  - Replace setTimeout simulation with actual API calls
  - Stream agent "thinking" state while LLM processes
  - Display real response in Activity Feed
  - Show which KB docs were used as context

- [ ] 1.4 Add "Ask a Question" mode to the UI
  - Text input for freeform questions
  - Agent selector (ask specific agent or "ask the team")
  - Response displayed as rich text in a results pane
  - Question history with agent responses

---

## PHASE 2: Deliverable Engine
**Goal**: Task buttons produce real, downloadable deliverables —
not just chat responses. Clients can customise the format.

- [ ] 2.1 Define deliverable schemas for each task type
  - Keyword Research → CSV/Excel with columns: keyword, volume, difficulty, intent, priority
  - Content Production → Markdown document with headings, meta, word count target
  - Redirect Mapping → CSV with columns: source URL, target URL, status code, notes
  - Performance Analysis → HTML report with metrics, charts placeholder, recommendations
  - Technical Auditing → Markdown checklist with pass/fail/warning per item
  - Internal Linking → CSV with source page, target page, anchor text, priority
  - HREFLANG Mapping → XML/CSV with URL, language, region, hreflang tag
  - Sitemap Production → XML sitemap format with loc, lastmod, priority, changefreq

- [ ] 2.2 Create `src/deliverables/DeliverableEngine.js`
  - Template system for each deliverable type
  - Format options: CSV, Markdown, HTML, JSON, XML
  - LLM fills in the template with real analysis
  - Output stored in memory + downloadable

- [ ] 2.3 Build Deliverable Customisation UI
  - When user clicks a task button, show a config panel:
    - Target URL / domain (required input)
    - Format selector (CSV, MD, HTML, JSON)
    - Scope options (full site, specific pages, specific keywords)
    - Additional instructions (free text)
  - Preview of what the deliverable will contain
  - "Generate" button triggers agent processing

- [ ] 2.4 Build Results Panel
  - Shows deliverable output inline (formatted)
  - Download button (generates file in selected format)
  - "Refine" button to ask the agent to adjust
  - History of generated deliverables

---

## PHASE 3: Knowledge Base Intelligence
**Goal**: KB becomes the brain. Agents retrieve the right context
automatically and clients can build the KB with their own site data.

- [ ] 3.1 Persist KB to disk
  - Save documents as JSON in `knowledge/user/` directory
  - Auto-load on server start
  - Sync frontend state with server state

- [ ] 3.2 Improve KB search with relevance scoring
  - TF-IDF scoring instead of basic keyword match
  - Category-aware search (boost docs matching agent's domain)
  - Recency weighting (newer docs ranked higher)

- [ ] 3.3 Client data import flow
  - "Import Site Data" wizard in the UI
  - Accepts: sitemap XML, crawl export CSV, GSC export, GA4 export
  - Parses and indexes automatically
  - Tags with metadata (domain, date imported, data type)

- [ ] 3.4 Contextual KB retrieval for agent tasks
  - When agent processes a task, auto-search KB for relevant docs
  - Include top N results as context in the LLM prompt
  - Show "Sources used" in the response
  - Allow user to pin specific KB docs to a task

---

## PHASE 4: Client Experience Polish
**Goal**: The UI feels like a real product, not a prototype.
Clients can self-serve without technical knowledge.

- [ ] 4.1 Onboarding flow
  - Welcome screen for new clients
  - "Add your website" step (URL input)
  - Auto-crawl basics (title, meta, sitemap detection)
  - Populate KB with initial site data

- [ ] 4.2 Conversation history & persistence
  - Store all questions and deliverables per session
  - LocalStorage for client-side persistence
  - Export conversation as PDF/Markdown

- [ ] 4.3 Agent personality in responses
  - Each agent responds in character (tone, expertise focus)
  - Agent explains their reasoning process
  - Cross-agent collaboration visible ("I asked Rob about the technical side...")

- [ ] 4.4 Dashboard metrics
  - Tasks completed count
  - KB documents count
  - Deliverables generated count
  - Agent utilisation (who's busiest)

---

## PHASE 5: Production Readiness
**Goal**: Deployable, secure, reliable.

- [ ] 5.1 Environment configuration
  - .env file for API keys, config
  - Production build optimisations
  - Error boundaries in React

- [ ] 5.2 Rate limiting & cost controls
  - Per-client token budget
  - Queue management for concurrent requests
  - Graceful degradation when API is unavailable

- [ ] 5.3 Security
  - API key never exposed to client
  - Input sanitisation on all user inputs
  - CORS configuration for production domain

- [ ] 5.4 Deployment
  - Netlify (frontend) + Railway/Render (backend) config
  - Environment variable management
  - Health check endpoint

---

## Success Criteria for MVP (Phases 1-2)
1. Client can ask a question and get a real, contextual answer from an agent
2. Client can click "Keyword Research" and get a real CSV with keyword suggestions
3. Agents use the knowledge base to ground their responses
4. All 8 task buttons produce a downloadable deliverable
5. The UI shows real agent thinking/processing states
6. Results are displayed inline and downloadable
