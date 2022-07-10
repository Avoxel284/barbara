<img src="media://Banner.png">

<b> [GitHub Repo](https://github.com/Avoxel284/barbara) | [Examples](https://github.com/Avoxel284/barbara/examples) | [Cheatsheet](https://github.com/Avoxel284/barbara/cheatsheet.md)</b>

## WORK IN PROGRESS!

Library is nowhere near finished! Use at your own risk.

## Instant guide

**Install the NPM package**

```sh
npm install barbara-music
```

**Search for a track**

```js
const barbara = require("barbara-music");

barbara.search("never gonna give you up", { service: "youtube" }).then((track) => {
	const resource = discordVoice.createAudioResource(track.resource());
});
```
