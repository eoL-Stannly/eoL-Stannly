# CLAUDE.md - Project Instructions

## Project Overview
AGI (Ayima General Intelligence) HQ — an SEO agency simulation with LLM agents visualized
as pixel art characters in a game-style office. Agents work from a shared SEO knowledge base
and operate autonomously via the Ralph Wiggum bash loop.

## Tech Stack
- Frontend: React 18 + Vite 5
- Backend: Node.js + Express + WebSocket (ws)
- Knowledge Base: qmd (Query Markup Documents) for local search & retrieval
- Automation: Bash (Ralph Wiggum loop)
- No TypeScript, no build-time dependencies beyond Vite

## Key Commands
```bash
npm install           # Install dependencies
npm run dev           # Start dev (client only via Vite)
npm run dev:local     # Start dev (client + server)
npm run build         # Production build
bash ralph_loop.sh    # Start autonomous loop
bash ralph_monitor.sh # Live monitoring dashboard
```

## QMD - Knowledge Base Management

qmd is installed globally via bun. Use it to index and search the `knowledge/` directory.

**Important: Do NOT run qmd indexing commands automatically. Write out example commands for the user to run manually.**

### Setup (run manually)
```bash
qmd collection add ./knowledge --name seo-knowledge --mask '**/*.md'
qmd embed           # Generate vector embeddings (~2GB models download on first use)
```

### Searching the Knowledge Base
```bash
qmd search "core web vitals optimization"          # Fast BM25 keyword search
qmd vsearch "how to improve page speed"             # Semantic similarity search
qmd query "technical SEO site architecture"          # Hybrid search (best quality)
qmd get "#abc123"                                    # Get document by docid
qmd multi-get "knowledge/technical-seo/*.md"         # Get multiple docs by glob
```

### QMD Options
```bash
-c, --collection <name>   # Restrict to a collection
-n <num>                   # Number of results
--full                     # Show full document content
--json, --csv, --md        # Output formats
```

### Knowledge Base Structure
```
knowledge/
├── technical-seo/        # Rob's domain
│   ├── site-architecture.md
│   ├── core-web-vitals.md
│   ├── indexation-management.md
│   └── structured-data.md
├── content-strategy/     # Craig's domain
│   ├── keyword-research.md
│   ├── on-page-optimization.md
│   └── topic-clusters.md
├── local-seo/            # Leo's domain
│   ├── google-business-profile.md
│   ├── eeat-signals.md
│   └── citation-building.md
├── data-analytics/       # Alex & Ken's domain
│   ├── gsc-analytics.md
│   ├── log-file-analysis.md
│   └── seo-data-pipelines.md
├── link-building/        # Craig & Ewan's domain
│   └── link-building-strategies.md
└── operations/           # Mike & Mya's domain
    └── seo-project-management.md
```

## Architecture
- `src/agents/` - Agent definitions (8 SEO agents) and orchestrator
- `src/knowledgebase/` - Document store with keyword search (frontend fallback)
- `src/components/` - React components (OfficeWorkspace, ActivityFeed, TaskPanel, KnowledgePanel)
- `src/server/` - Express REST API + WebSocket server
- `knowledge/` - SEO knowledge base markdown docs (indexed by qmd)
- `lib/` - Bash libraries for circuit breaker and response analysis
- `.ralph/` - Loop state, prompts, and fix plan

## Team
- Rob: Principal SEO (technical SEO, site architecture)
- Mike: COO (operations, project management)
- Craig: SEO Director (content strategy, keyword research)
- Leo: SEO Director (local SEO, E-E-A-T)
- Ewan: Head of SEO (account oversight, quick wins)
- Mya: SEO Account Manager (client management, reporting)
- Alex: Data Scientist & Engineer (analytics, pipelines)
- Ken: Data Scientist & Engineer (tooling, scraping, APIs)

## Conventions
- ES modules everywhere (import/export)
- Functional React components with hooks
- CSS in global.css with BEM-like naming
- Agent IDs are lowercase short names (rob, mike, craig, leo, ewan, mya, alex, ken)
