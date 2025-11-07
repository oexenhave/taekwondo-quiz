# Context File Optimization

(Place in .claude/commands/trim-context.md to use)

MANDATORY FIRST STEP: Create backup of CLAUDE.md as CLAUDE.md.backup-[YYYYMMDD-HHMMSS] before any changes.

## Phase 1: Usage Pattern Analysis

Before trimming, analyze the current CLAUDE.md and identify content categories:
1. Infrastructure/architecture context
2. Code generation rules and conventions
3. Document/content generation rules (backlog items, ADRs, reports, etc.)
4. Process documentation (deployment, testing, team workflows)
5. Historical context and completed work
6. Ambiguous sections that could be multiple categories

Ask user to confirm: "I found content about [list categories]. Which of these do you actively use Claude for in this workspace?"

Wait for user response before proceeding to Phase 2.

## Phase 2: Apply Retention Rules

Based on confirmed usage patterns, apply these rules:

### Always Keep (Universal)
- Forbidden directories list
- Core tech stack (one line per layer)
- Working directory path
- Critical non-obvious commands
- Active bugs/blockers with issue numbers

### Keep If User Confirmed Code Generation Usage
- Architecture constraints and patterns
- Code quality gates and linting rules
- Non-standard conventions vs language defaults
- API integration quirks and gotchas
- Security requirements
- Performance constraints

### Keep If User Confirmed Document/Content Generation Usage
- Content structure templates and rules
- Quality standards for documents
- Required format specifications
- Domain-specific terminology requirements
- Audience-specific communication guidelines

### Keep If User Confirmed Process/Workflow Usage
- Deployment procedures Claude executes
- Automated workflow steps
- Integration handoff requirements

### Always Remove (Universal)
- Narrative paragraphs or explanatory prose
- Self-evident folder descriptions
- Historical reasoning or "why we chose X" commentary
- Resolved issues or completed TODOs
- Example outputs or sample data
- Step-by-step tutorials for humans
- Polite padding ("please", "remember to", "make sure to")
- Generic instructions about being helpful/thorough

## Optimization Rules
1. Convert any paragraph to bullet points
2. Remove any bullet longer than 15 words - split or delete
3. Eliminate filler words: "typically", "usually", "generally", "basically"
4. Remove duplicate information across sections
5. Target: <5000 tokens total (estimate 1 token = 0.75 words)

## Output Format
1. Show token count before and after (use word count * 1.33 as estimate)
2. List what was removed and why (organized by category)
3. List what was kept and why (with category justification)
4. Always add additional md files in docs/ for removed content:
   - Specific filenames (e.g., docs/architecture-decisions.md)
   - Brief description of what should go in each file
   - Flag any removed content that's valuable but shouldn't be in CLAUDE.md
5. Confirm backup file path
6. Ask for approval before writing changes