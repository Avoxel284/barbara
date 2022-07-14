<img src="media://Banner.png">

<b> [GitHub Repo](https://github.com/Avoxel284/barbara) | [Examples](https://github.com/Avoxel284/barbara/tree/master/examples) | [Cheatsheet](https://github.com/Avoxel284/barbara/blob/master/CHEATSHEET.md)</b>

## WORK IN PROGRESS!

Library is in development, use at your own risk.

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
