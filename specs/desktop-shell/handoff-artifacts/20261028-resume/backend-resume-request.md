# Resume desktop-shell backend batch — user explicitly said 按照HANDOFF.md继续

Walter has now explicitly resumed work. This overrides the temporary STOP/pause instruction in HANDOFF.md. You are continuing Implement = openai/gpt-6-astra via openai in your OWN worktree D:/2030/Futures-AI-desktop-implement, branch feat/desktop-shell-astra. Coordinator remains openai/gpt-6.1-sol, coordination only. The previous exit=1 was USER cancellation, NOT model failure. Do not fall back, launch agents, alter model/provider/global settings, or start another feature.

## Current fixed state
- Your saved HEAD = 782aa20 (WIP, not completion); coordinator HEAD = 007a4c0 in D:/2030/Futures-AI-desktop-finish.
- Original source base = 8ba1b6a304f916e3d57ebdd6b89790b75a15f14c.
- Approved docs are NOW COMMITTED in WIP; old request's 'uncommitted planning overlay' and 'do not stage planning overlay' statements are historical. Do not undo/reset any WIP.
- You are resumed via the original Astra session 01a18285-2349-7290-b570-c8f9b2e18658. Only this writer uses the implementation tree.
- First seven backend units T-01b/c/d, T-02b/c, T-03b/c have code and historical targeted evidence. Last T-04b edits to shell_check.py/test_app_health.py have NEVER BEEN VERIFIED. No build has run since those changes.

## Required preflight
Read HANDOFF.md and AGENTS.md completely, docs/plan.md + docs/architecture.md + appropriate ADR; specs/desktop-shell/{spec,plan,tasks,checklist,analyze,review}.md completely, continuing offsets on truncation. Confirm all 41 checklist items checked and 0 unchecked before testing/editing; NEVER edit checklist. Read relevant source and task sections at boundaries, not just session memory. Print only PI_PROVIDER, PI_MODEL, PI_SESSION_ID and git HEAD (no other environment/credential details). Current pause metadata in docs is historical, this message is user's explicit restoration.

## This invocation: finish ONLY backend first batch
Keep original file ownership and scope from specs/desktop-shell/handoff-artifacts/20261028/backend-batch-request.md. Writable:
backend/app/{main.py,__main__.py}; backend/tests/test_app_{health,lifecycle,settings_api,startup_errors,channel,disk_full}.py; backend/tools/shell_check.py; NEW specs/desktop-shell/implementation-evidence.md. All other files (including build_backend.py, backend/data/**, backend/settings/**, shell/**, docs/**, frozen specs, checklist, tasks, review, README, HANDOFF) read-only. Generated PyInstaller build output allowed, never hand-edit generated files. Coordinator owns progress metadata.

1. FIRST rerun the six backend test files on FINAL SAVED CODE with a fresh external basetemp, no cache, no bytecode, UTF8:
cd backend
PYTHONDONTWRITEBYTECODE=1 PYTHONIOENCODING=utf-8 python -c "import tempfile,subprocess,sys; sys.exit(subprocess.call([sys.executable,'-m','pytest','tests/test_app_health.py','tests/test_app_startup_errors.py','tests/test_app_lifecycle.py','tests/test_app_channel.py','tests/test_app_settings_api.py','tests/test_app_disk_full.py','-q','-vv','-p','no:cacheprovider','--basetemp='+tempfile.mkdtemp(prefix='fai-resume-targeted-')]))"
Historical baseline 389 passed/5 skipped is not new validation. Do not enable online/live smoke tests or read/use real credentials.
2. Diagnose and fix real failures within ownership/approved design; do not weaken assertions or fallback models. Complete T-04b according to actual tasks.md/plan, including real health check criterion, Windows netstat LISTENING by pid, and frozen blacklist.
3. Run complete backend regression with fresh external basetemp:
PYTHONDONTWRITEBYTECODE=1 PYTHONIOENCODING=utf-8 python -c "import tempfile,subprocess,sys; sys.exit(subprocess.call([sys.executable,'-m','pytest','tests/','-q','-rs','-p','no:cacheprovider','--basetemp='+tempfile.mkdtemp(prefix='fai-resume-full-')]))"
4. Only AFTER tests pass run REAL python tools/build_backend.py then python tools/shell_check.py from backend. No retired --backend-only. Keep long outputs outside repo (this run dir) if useful. If bundled dependency genuinely conflicts with frozen blacklist STOP and report exact safe paths/category; do not relax scan, modify build scope, or fake a pass. Other plan/scope/security changes likewise stop affected task and report, no unauthorized expansion.
5. Write real implementation-evidence.md: actual model/channel/session, WIP input, old baseline separately, new exact commands/results/counts/skip reasons, failures and fixes, all eight batch units with AC mapping and precise partial/full backend-side status, build+smoke outcome, clean process/lock/port evidence, external evidence NOT attained, next T-05b. Do not call whole AC/feature complete from backend-only evidence.
6. git diff --check; git status --short --ignored backend shell packaging; ensure only owned files modified. If ALL batch checks pass you may make ONE LOCAL commit on feat/desktop-shell-astra, staging explicit owned changed paths plus implementation-evidence.md only. No git add -A, no push/PR/merge/reset. If blocked, preserve WIP and write evidence, no completed-task commit or success claim.
7. STOP after backend checkpoint and return concise Chinese final: actual model/session, resulting commit (if any), task IDs and ACs, changed files, real test/build/smoke summaries, blocker/limitations, next T-05b. Do NOT start shell tasks in this invocation; coordinator will explicitly release next validated batch per HANDOFF order.

## Strict tool/edit discipline
Use read for file contents; bash for enumeration/test/build/git. Existing-file targeted edits must use edit with minimal unique oldText and non-overlapping edits in ONE call per file when possible. If match fails re-read/retry, never shell/Python/PowerShell text splicing. write only NEW files or genuine complete rewrites. Keep request/response payloads, full auth errors, real user data and key/email out of logs/Git. Only owned temporary fixture processes/directories may be cleaned; do not kill broad Python/Node/Electron processes.
