# LoopNotes

**The project app of [The DevOps Loop](https://www.instagram.com/thedevopsloop/)** — learn DevOps from zero in 112 days, 4 short lessons a day.

LoopNotes is a tiny notes app. On its own it's boring. That's the point: we take this one small app all the way from
a laptop to a production Kubernetes cluster, and every step teaches one real DevOps skill.

> Follow the series on Instagram and Threads **@thedevopsloop**. Each build day adds the next step to this repo.

## Run it (you only need Node.js 18+)

```bash
git clone https://github.com/thedevopsloop/loopnotes.git
cd loopnotes
node server.js
```

Open http://localhost:3000. No `npm install` needed: zero dependencies.

| Setting | Env variable | Default |
|---|---|---|
| Port | `PORT` | `3000` |
| Where notes are saved | `DATA_FILE` | `./data/notes.json` |
| Environment name (dev / staging / production) | `APP_ENV` | `dev` |

Health check: `curl http://localhost:3000/health` → `{"status":"ok","env":"dev"}`

## The journey (tick these off with us)

- [x] **Week 1 — It works on my laptop** · Ep 5: meet LoopNotes · Ep 6: why it breaks on a server
- [ ] **Week 1 build day** — run LoopNotes on a Linux machine (WSL, Multipass or a cloud VM)
- [ ] **Week 2** — run it as a Linux service with systemd, read its logs
- [ ] **Week 3** — reach it from a browser: ports, DNS, nginx in front of it
- [ ] **Week 4** — every change goes through Git and pull requests
- [ ] **Week 5** — a Bash script to deploy and back up
- [ ] **Weeks 6–7** — package it with Docker, add a database with Docker Compose
- [ ] **Week 8** — CI/CD with GitHub Actions: test, build and ship on every push
- [ ] **Weeks 9–10** — deploy to AWS behind a load balancer
- [ ] **Week 11** — the whole AWS setup as code with Terraform
- [ ] **Weeks 12–14** — run it on Kubernetes: Deployments, Services, Ingress, autoscaling
- [ ] **Week 15** — monitoring with Prometheus and Grafana
- [ ] **Week 16** — GitOps, security, and your portfolio

## How to use this repo

- **Following along?** Star the repo, then fork it and do each build day in your fork.
- **Stuck?** Open an issue with what you ran and what you saw.
- **Each week** gets its own folder of notes and a tagged release, so you can jump to any step.

## License

MIT. Use it, break it, learn from it.
