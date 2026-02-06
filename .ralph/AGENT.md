# Agent Configuration

## Build Commands
```bash
npm install
npm run build
```

## Dev Commands
```bash
npm run dev          # Start both client and server
npm run dev:client   # Start Vite dev server only
npm run dev:server   # Start Express server only
```

## Ralph Commands
```bash
npm run ralph          # Start Ralph Wiggum loop
npm run ralph:monitor  # Start monitoring dashboard
bash ralph_loop.sh     # Direct loop execution
bash ralph_monitor.sh  # Direct monitor execution
```

## Test Commands
```bash
npm test
```

## Project Structure
- `src/agents/` - Agent definitions and orchestrator
- `src/knowledgebase/` - Knowledge base system
- `src/components/` - React UI components
- `src/server/` - Express backend
- `src/styles/` - CSS styles
- `lib/` - Bash libraries (circuit breaker, response analyzer)
- `.ralph/` - Ralph loop configuration and state
