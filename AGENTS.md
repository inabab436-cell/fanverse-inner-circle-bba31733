<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The product is a portrait-only 2D pixel-art world: each area (plaza, cafe, concert, rooms, shop) is its own route rendering the shared Scene component (background image + sprites in % coordinates); keep legacy database tables untouched while their UI is retired, to avoid destructive data loss.
