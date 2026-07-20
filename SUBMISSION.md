# QueryShadow submission draft

Use this as a factual starting point, then rewrite the public description in the entrant’s own voice before submitting.

## Project name

**QueryShadow**

## Tagline

**See what your agent’s searches reveal together.**

## Track

**Developer Tools**

## One-sentence description

QueryShadow is a local-first debugger that reveals how individually harmless AI-agent searches combine into a private fact, then rewrites the trail to reduce cumulative exposure without destroying research utility.

## Short description

AI agents increasingly combine private files with public search. A search provider may never receive the file, but it sees every query derived from it. QueryShadow replays that outbound trail, measures the mosaic effect across the sequence, shows what a plausible observer could reconstruct and why, and produces a safer query plan plus an exportable mitigation receipt. The judge path is instant, local, no-login, and requires no API key.

## What makes it different

Most privacy controls inspect one prompt, file, or tool call at a time. QueryShadow treats the **cumulative ordered trace** as the unit of risk. It also closes the loop: reconstruction → literal bridge evidence → minimally generalised query plan → residual-risk receipt.

## Technology

- React 19 and TypeScript on Vinext/Vite.
- Transparent deterministic signal extraction and accumulation.
- Browser-local trace import and transformation.
- JSON audit export.
- OpenAI Sites / Cloudflare Worker deployment target.

## Codex and GPT-5.6

Built in one primary Codex task using GPT-5.6 Sol at Ultra effort. GPT-5.6 was used for public-web gap research, collision checks, product selection, threat-model translation, adversarial fixtures, deterministic scoring design, implementation, UX, accessibility, tests, build repair, and submission packaging. The app intentionally has no runtime model dependency, so the privacy demo does not need a new secret or network call.

## Honest limitations

This prototype is a review debugger, not a production traffic gateway. Scores are heuristic and do not prove an external provider made an inference. Seeded confidence and utility values are fixture estimates. Production use would require organisation-specific sensitivity labels, live adapters, calibrated adversarial evals, and policy review.

## Required links before submission

- Live app: [https://queryshadow.ashleyjmayne.chatgpt.site](https://queryshadow.ashleyjmayne.chatgpt.site)
- Repository: [https://github.com/ashleyjmayne-bit/queryshadow](https://github.com/ashleyjmayne-bit/queryshadow)
- Public YouTube demo under 3 minutes: [https://youtu.be/EToqqR3OeuM](https://youtu.be/EToqqR3OeuM)
- Codex `/feedback` session ID: `PENDING — obtain from the primary build task`

## Final checklist

- [x] App is publicly reachable and testable without payment.
- [x] Repository is public with MIT license, or private access is shared with the addresses in the official rules.
- [x] README includes setup, sample data, Codex collaboration, and key decisions.
- [x] Video is public, under 3:00, narrated, and shows the real product.
- [ ] `/feedback` ID is added to README and Devpost.
- [ ] Exactly one track is selected.
- [ ] Submission text is in English and reviewed in the entrant’s own voice.
- [x] All claims preserve the prototype’s stated limitations.
