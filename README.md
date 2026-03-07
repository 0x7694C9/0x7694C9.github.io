# Aurora website

Static website for the Aurora Discord bot.

## Command docs workflow

The commands page can be generated from the bot source and then grouped manually:

1. From the bot repo (`Aurora`), run:
   - `npm run export:site-commands -- --out data/commands.generated.json`
2. Copy that file into website repo:
   - `../aurora.github.io/data/commands.generated.json`
3. Edit groups/order in:
   - `../aurora.github.io/data/command-groups.json`

Any command not listed in a manual group appears under `Uncategorized` automatically.
