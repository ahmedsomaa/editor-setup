# editorSetup

Status: ready-for-agent

## Problem Statement

A developer finds a monospace Font and a Theme that look good together, then has to reconstruct the Settings for their own Editor. Screenshots on social sites are personal, inconsistent, and missing the Settings. Paid Fonts and Themes cannot be rendered live on a public site.

## Solution

editorSetup is a git-backed Registry of Pairs. A Pair is one Font combined with one Theme. Each Pair carries one Config per Editor: the Settings to apply it, and a Snapshot of it. Visitors browse, filter, Compare, and copy Settings. Contributors add Pairs by opening a pull request. There is no sign-in, no in-app form, and no rating. The home page is a header, a hero hook sentence, and a footer.

## User Stories

1. As a visitor, I want the home page to show a header, a hero, and a footer, so that I immediately see what the Registry is.
2. As a visitor, I want the hero to read "your favorite editor in <theme> & <font>", so that the hook names a Font and a Theme.
3. As a visitor, I want the Theme word in the hero drawn in a theme color, so that the hook feels like a Theme.
4. As a visitor, I want the Font word in the hero set in a monospace face, so that the hook feels like a Font.
5. As a visitor, I want the subhook "Font and theme pairs from real developers. Find yours and copy the settings.", so that I know the page gives me Settings to copy.
6. As a visitor, I want a primary action that opens the Registry, so that I can start browsing.
7. As a visitor, I want the Registry to list every Pair on `main` that has at least one Config, so that I can browse real Pairs.
8. As a visitor, I want to search by Font name and Theme name, so that I can find a Pair I already have in mind.
9. As a visitor, I want to filter the Registry by Editor, so that I only see Pairs that have a Config for the Editor I use.
10. As a visitor, I want to filter the Registry by Appearance, so that I can choose dark or light Themes.
11. As a visitor, I want to filter the Registry by License, so that I can hide Paid Fonts and Themes.
12. As a visitor, I want a "free" License filter to include Open and Free, so that no-cost Fonts and Themes show up together.
13. As a visitor, I want to filter the Registry by Font and by Theme, so that I can see every Pair that uses one I already like.
14. As a visitor, I want the default order to be Font name, then Theme name, so that the list has a stable order without votes.
15. As a visitor, I want each Registry card to show one Snapshot from that Pair, so that every card has an image.
16. As a visitor, I want the Registry to paginate, so that a long list stays usable.
17. As a visitor, I want to open a Pair and see the Font name, its links, and its License, so that I can find and judge the Font.
18. As a visitor, I want to open a Pair and see the Theme name, its links, its License, and its Appearance, so that I can find and judge the Theme.
19. As a visitor, I want a list of Editors that have a Config for this Pair, so that I can pick my Editor.
20. As a visitor, I want the selected Editor to show its Snapshot, so that I see the Pair before the Settings.
21. As a visitor, I want that Config's Settings as plain text, with a way to copy them, so that I can paste them into my Editor.
22. As a visitor, I want to Compare two Pairs side by side, so that I can judge them together.
23. As a visitor, I want to pick the Editor for a Compare, so that both sides use the same Editor.
24. As a visitor, I want each side of a Compare to show that Editor's Snapshot, so that I am judging the Font and Theme.
25. As a visitor, I want a Pair with no Config for the chosen Editor to be unavailable for that Compare, so that I never see a different Editor standing in.
26. As a visitor, I want the Registry and Pair pages to come back as HTML that already contains the Font, Theme, and Snapshot, so that a pasted link previews the Pair.
27. As a contributor, I want a CONTRIBUTING.md that explains how to add a Pair, so that I know what files to open a pull request with.
28. As a contributor, I want a new Pair to be one JSON file under `registry/pairs/` plus Snapshots under `registry/snapshots/`, so that I do not edit a central index.
29. As a contributor, I want each Editor in the Pair file to carry Settings text and a Snapshot filename, so that one pull request holds the whole Config.
30. As a contributor, I want to run `npm run check` locally, so that I catch schema and image mistakes before I open the pull request.
31. As a contributor, I want the same check to run on the pull request, so that invalid files never merge.
32. As a contributor, I want a new Pair pull request to allow several Editors at once, so that the first submission can cover more than one Editor.
33. As a contributor, I want adding an Editor to an existing Pair to be its own pull request, so that the image diff stays to one Snapshot.
34. As a maintainer, I want one Pair per pull request, so that review stays focused.
35. As a maintainer, I want to merge a valid pull request by hand, so that taste and Snapshot quality stay a human call.

## Implementation Decisions

- The Registry is files in this repository. There is no database for Pair content.
- Pair file: `registry/pairs/<font-slug>--<theme-slug>.json`.
- Snapshot file: `registry/snapshots/<pair-slug>--<editor-id>.png`.
- Pair JSON holds Font, Theme, and an `editors` array. Each entry has `id`, `snapshot`, and `settings`.
- `appearance` is `dark` or `light` on the Theme. License is `open`, `free`, or `paid` on the Font and on the Theme. Each needs at least one publish link.
- One Pair per Font and Theme. One Config per Editor. Both Settings and Snapshot required.
- Settings are plain text with no allow-list. Neovim Settings set only the Theme.
- Snapshots are 16:9. The contributor chooses the code and the frame. The site does not add a frame.
- Launch Editors: VS Code, Cursor, Zed, Neovim. JetBrains and other Editors are later; each app is its own Editor.
- Visual direction: Untitled UI pills, violet primary `#7f56d9`, tweakcn-style home (header, hero, footer only). Type: Sora, Geist, Geist Mono. Mark: Lucide pencil-sparkles. Handbook lives in `apps/handbook/`.
- Site (Next.js static pages) is later. Not in this pass.
- Pull requests target `main`. `npm run check` is the local and CI check.
- Review by an LLM agent, and ratings via Convex or Supabase, are later and out of this pass.

## Testing Decisions

- Test seam: the registry check (`npm run check`).
- The check covers schema, non-empty Settings, 16:9 Snapshots, filename contract, one Config per Editor, and one Pair per Font and Theme.

## Out of Scope

- Sign-in, profiles, in-app forms, admin queue, Catalog admin UI
- Upvotes, Score, hot badge, trending tabs
- NestJS, Postgres, object storage
- Drag-slider Compare
- Live preview of Paid Fonts
- Email
- JetBrains and Helix screens at launch
- Import of the old v1 image set without Settings
- LLM review agent with written accept/decline reasons
- Ratings via Convex or Supabase

## Further Notes

- Hook: “your favorite editor in <theme> & <font>”. Subhook: “Font and theme pairs from real developers. Find yours and copy the settings.”
- The hero is a hook sentence, not a featured Pair. There is no Open-only hero rule.
- Contribution guide: [CONTRIBUTING.md](../../CONTRIBUTING.md).
