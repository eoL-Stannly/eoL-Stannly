# LLM Agents Office

A visual workspace showing LLM agents as cartoon characters working in an office environment. Agents collaborate autonomously to complete tasks, powered by a shared knowledge base and the **Ralph Wiggum** autonomous bash loop.

## The Team

| Agent | Role | Specialty |
|-------|------|-----------|
| **Ada** | Project Manager | Task planning, delegation, progress tracking |
| **Byte** | Research Analyst | Knowledge base search, summarization, fact-checking |
| **Chip** | Senior Developer | Code writing, debugging, refactoring |
| **Dot** | Code Reviewer | Code review, security audit, style checking |
| **Echo** | QA Engineer | Test writing, edge cases, regression testing |
| **Flux** | Technical Writer | Documentation, tutorials, API docs |

## Quick Start

```bash
# Install dependencies
npm install

# Start the development server (frontend + backend)
npm run dev

# Open http://localhost:3000
```

## Ralph Wiggum Loop

The Ralph Wiggum loop enables autonomous continuous operation of the agent team. Inspired by [ralph-claude-code](https://github.com/frankbria/ralph-claude-code).

```bash
# Start the autonomous loop
bash ralph_loop.sh

# Monitor in a separate terminal
bash ralph_monitor.sh
```

### Safety Features
- **Dual-condition exit gate** - Requires both completion indicators AND explicit `EXIT_SIGNAL: true`
- **Rate limiting** - Configurable calls/hour with automatic cooldown
- **Circuit breaker** - Detects stagnation (no file changes, repeated errors)
- **Safety breaker** - Stops after consecutive completion signals
- **Session management** - Auto-expiry to prevent stale context
- **Permission denial detection** - Immediate halt on access issues

### Configuration

Edit `.ralphrc` to customize:

```bash
MAX_CALLS_PER_HOUR=100
CLAUDE_TIMEOUT_MINUTES=15
SESSION_EXPIRY_HOURS=24
CB_NO_PROGRESS_THRESHOLD=3
ALLOWED_TOOLS="Write,Read,Edit,Bash(git *),Bash(npm *)"
```

## Architecture

```
src/
  agents/           # Agent definitions & orchestrator
  knowledgebase/    # Document store with keyword search
  components/       # React UI (Office, Feed, Tasks, Status, KB)
  server/           # Express REST API + WebSocket
  styles/           # CSS with animations
lib/                # Bash libraries (circuit breaker, response analyzer)
.ralph/             # Loop state, prompts, fix plan
ralph_loop.sh       # The autonomous loop
ralph_monitor.sh    # Live monitoring dashboard
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/agents` | List all agents and their states |
| GET | `/api/agents/:id` | Get specific agent details |
| POST | `/api/tasks` | Submit a task to the team |
| GET | `/api/status` | System status (orchestrator + Ralph + KB) |
| GET | `/api/activity` | Activity log |
| GET | `/api/knowledge` | All knowledge base documents |
| GET | `/api/knowledge/search?q=` | Search the knowledge base |
| POST | `/api/knowledge` | Add a document |
| DELETE | `/api/knowledge/:id` | Remove a document |
| WS | `/ws` | Real-time event stream |
