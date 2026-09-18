# Credits

## Artwork
Isometric art by **Kenney** (kenney.nl), CC0 1.0 public domain. No attribution is required;
credited here as good practice. Licence text ships beside the assets.

- *Isometric Tiles: Landscape*: ground, paths (`src/public/assets/iso/`)
- *Isometric Miniature Farm*: buildings, fences, planks, crops, props (`src/public/assets/farm/`, `fence/`)
- *Animal Pack Redux*: the goat (`src/public/assets/animals/`). No Kenney pack has a sheep.

## Type
**Fredoka** by Milena Brandão and the Fredoka Project Authors, SIL Open Font License 1.1
(`src/public/assets/fonts/`).

## Voice
Pip's fixed lines are audio clips generated once with a neural text-to-speech voice (the one
named in `src/public/assets/voice/VOICE`) by `scripts/voice_clips.mjs`, and included as files. With
a voice key on the server, lines the model writes at run time are spoken by that same voice; without
one, the browser's own voice reads them.

## Everything else
Game, classifier, hint layer, evaluation harness and application code: Manpreet Singh.
