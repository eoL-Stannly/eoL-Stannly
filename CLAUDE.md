# Model Hierarchy

Route tasks to the cheapest model that can handle them. Most agent work is routine.

## Core Principle

**80% of agent tasks are janitorial.** File reads, status checks, formatting, simple Q&A. These don't need expensive models. Reserve premium models for problems that actually require deep reasoning.

## Model Routing

Before executing tasks, classify by complexity:

### ROUTINE → Use Tier 1 (spawn on haiku/cheap)

Characteristics:
- Single-step operations
- Clear, unambiguous instructions
- No judgment required
- Deterministic output expected

Examples:
- File read/write operations
- Status checks and health monitoring
- Simple lookups (time, weather, definitions)
- Formatting and restructuring text
- List operations (filter, sort, transform)
- API calls with known parameters
- Heartbeat and cron tasks
- URL fetching and basic parsing

### MODERATE → Use Tier 2 (use current model)

Characteristics:
- Multi-step but well-defined
- Some synthesis required
- Standard patterns apply
- Quality matters but isn't critical

Examples:
- Code generation (standard patterns)
- Summarization and synthesis
- Draft writing (emails, docs, messages)
- Data analysis and transformation
- Multi-file operations
- Tool orchestration
- Code review (non-security)
- Search and research tasks

### COMPLEX → Use Tier 3 (request upgrade to opus if needed)

Characteristics:
- Novel problem solving required
- Multiple valid approaches
- Nuanced judgment calls
- High stakes or irreversible
- Previous attempts failed

Examples:
- Multi-step debugging
- Architecture and design decisions
- Security-sensitive code review
- Tasks where cheaper model already failed
- Ambiguous requirements needing interpretation
- Long-context reasoning (>50K tokens)
- Creative work requiring originality
- Adversarial or edge-case handling

## Decision Algorithm

```
function selectModel(task):
    # Rule 1: Escalation override
    if task.previousAttemptFailed:
        return nextTierUp(task.previousModel)

    # Rule 2: Explicit complexity signals
    if task.hasSignal("debug", "architect", "design", "security"):
        return TIER_3

    if task.hasSignal("write", "code", "summarize", "analyze"):
        return TIER_2

    # Rule 3: Default classification
    complexity = classifyTask(task)

    if complexity == ROUTINE:
        return TIER_1
    elif complexity == MODERATE:
        return TIER_2
    else:
        return TIER_3
```

## Behavioral Rules

### For Main Session

1. **Default to Tier 2** for interactive work
2. **Suggest downgrade** when doing routine work: "This is routine - I can handle this on a cheaper model or spawn a sub-agent."
3. **Request upgrade** when stuck: "This needs more reasoning power. Switching to [premium model]."

### For Sub-Agents

1. **Default to Tier 1** unless task is clearly moderate+
2. **Batch similar tasks** to amortize overhead
3. **Report failures** back to parent for escalation

### For Automated Tasks

1. **Heartbeats/monitoring** → Always Tier 1
2. **Scheduled reports** → Tier 1 or 2 based on complexity
3. **Alert responses** → Start Tier 2, escalate if needed

## Sub-Agent Spawning

When spawning background agents, default to haiku for routine work.

```
# Good - routine work on cheap model
Spawn background agent (haiku): "Fetch these 20 URLs and extract titles"

# Good - complex work on appropriate model
Spawn background agent (sonnet): "Analyze this codebase and document the architecture"

# Bad - wasting money
Spawn background agent (opus): "Read all .md files in this directory"
```

## Anti-Patterns

**DON'T:**
- Run heartbeats on Opus
- Use premium models for file I/O
- Keep expensive model when task is clearly routine
- Spawn sub-agents on premium models by default

**DO:**
- Start mid-tier, adjust based on task
- Spawn helpers on cheapest viable model
- Escalate explicitly when stuck
- Track cost per task type to optimize further
