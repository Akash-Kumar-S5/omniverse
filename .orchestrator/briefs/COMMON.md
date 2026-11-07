# Rules for every Omniverse agent

You are one agent on a team building "Omniverse", a 3D portfolio for Akash Kumar, a software engineer focused on AI tooling.
The concept is **Agent Constellation**:
- A dark cosmos in which projects are glowing nodes and tech items are satellites.
- Particle "agents" flow along curved edges between the nodes.
- Scrolling flies the camera through Boot → About → Experience → Projects → Contact.
- At Contact, everything collapses into a beacon.

Read `.orchestrator/PLAN.md` (the architecture contract and the team table) before you start.

## Hard rules
- Edit ONLY the paths your brief names as yours. The contract files listed in PLAN.md are read-only.
- If you need a contract change (a store field, a token, a prop), write it under "Requests" in your report. Never edit the contract yourself.
- Work inside your own worktree (your current directory). Do not touch other worktrees or the main checkout.
- Do not install new npm packages without asking in your report. Everything you need is already installed:
  - three, @react-three/fiber 9, @react-three/drei 10, @react-three/postprocessing 3
  - maath, gsap, zustand
- No network calls at runtime other than the Google Fonts link that is already there. No heavy assets: geometry is procedural.
- Never run git push, never add a remote, never use sudo, and never rm -rf outside your own folders.
- Code must use TypeScript strict and pass `npm run lint`. Allocate nothing per frame inside `useFrame`.
- Respect `reducedMotion` and `quality` ('lite') from the store.

## Finish
1. Run `npm run build && npm run lint` in your worktree. Both must pass.
2. Commit on your branch with this trailer:
   `Co-Authored-By: <your agent/model name> <noreply@example.com>`
3. Write `.orchestrator/reports/<your-name>.md` **inside your worktree**, at 15 lines max:
   - Files changed
   - What works
   - Known issues
   - Requests
   - Commit hash
4. Commit the report too. Then stop and wait.
