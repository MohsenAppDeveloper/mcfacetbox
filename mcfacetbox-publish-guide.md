# Publish `mcfacetbox` to GitHub (from GitLab-connected monorepo)

This guide provides repeatable PowerShell commands to push only `packages/mcfacetbox` to the GitHub repo `MohsenAppDeveloper/mcfacetbox` using `git subtree`. You do NOT need to push to GitLab first; you only need local commits that include your changes.

## Prerequisites
- Local branch exists (e.g., `master`); any branch is fine.
- Git installed; you are in the monorepo root: `E:\Project\Encylopedia\EncyclopediaClaude\encyclopediafrontend`.
- The GitHub repo `https://github.com/MohsenAppDeveloper/mcfacetbox` exists and you have push access.

## Typical Flow (each time after changes)

1) Commit your changes (locally) for `packages/mcfacetbox`
```powershell
# Create or switch to a working branch for exports (optional)
git switch -c mcfacetbox-export; git add packages/mcfacetbox; git commit -m "chore(mcfacetbox): update package files"
```

2) Split the subtree (refresh the export branch)
```powershell
git subtree split --prefix packages/mcfacetbox -b mcfacetbox-publish
```
- If you see `fatal: no new revisions were found`, it means no local commit included changes under `packages/mcfacetbox`. Make sure step (1) is done.

3) Push only the subtree branch to GitHub as `main`
```powershell
git push https://github.com/MohsenAppDeveloper/mcfacetbox.git mcfacetbox-publish:main -f
```
- `-f` is used because `mcfacetbox-publish` is regenerated and may rewrite history.

4) (Optional) Create and push a release tag to trigger CI release
```powershell
$version = "0.1.0"; $tag = "mcfacetbox-v$version"; git tag -f -a $tag -m "Release $tag"; git push https://github.com/MohsenAppDeveloper/mcfacetbox.git $tag
```
- Your GitHub Actions workflow inside the package (or the repo) will build and attach artifacts when the tag is pushed or a release is published.

## One-Liner Convenience (commit → split → push)
```powershell
$msg = "chore(mcfacetbox): update"; git switch -c mcfacetbox-export; git add packages/mcfacetbox; git commit -m $msg; git subtree split --prefix packages/mcfacetbox -b mcfacetbox-publish; git push https://github.com/MohsenAppDeveloper/mcfacetbox.git mcfacetbox-publish:main -f
```

## Optional Cleanup (local only)
```powershell
git switch master; git branch -D mcfacetbox-export; git branch -D mcfacetbox-publish
```
- This removes temporary local branches if you prefer keeping your local repo tidy.

## Troubleshooting
- `fatal: no new revisions were found`: You didn’t commit changes affecting `packages/mcfacetbox`. Run step (1) then split again.
- Permission denied: Ensure your GitHub credentials/token have push rights to `MohsenAppDeveloper/mcfacetbox`.
- CI didn’t run: Confirm the workflow file exists in the split repo (`.github/workflows/release.yml`) and the tag pattern matches (`mcfacetbox-v*.*.*` or `v*.*.*`).

## Notes
- These commands do not push anything to your GitLab remote. They only use local commits and push directly to GitHub.
- You can use your normal working branch instead of `mcfacetbox-export`. The key is committing locally before splitting.
