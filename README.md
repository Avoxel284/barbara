<img src="./media/Banner.png">

<b>[Documentation](https://avoxel284.github.io/barbara) | [Examples](https://github.com/Avoxel284/barbara/examples) | [Cheatsheet](https://github.com/Avoxel284/barbara/cheatsheet.md)</b>

## **WORK IN PROGRESS!**

Library is in development, use at your own risk.

<br>
<br>

## About

Unified MusicTrack and MusicPlaylist objects for use in Discord bots for playing music. Uses Prism Media to create **FFmpeg** streams.

Currently only supports SoundCloud.

## Installation

```
npm install barbara-music
```

## Examples

Note: Barbara must be authenticated before use!
Authentication can be performed like below:

```js
const barbara = require("barbara-music");

// Get a free SoundCloud client ID and set it
barbara.setKey("SOUNDCLOUD_CLIENTID", await barbara.freeKey("SOUNDCLOUD_CLIENTID"));
```

Refer to the cheatsheet for auth key identifiers.

```js
const barbara = require("barbara-music");

barbara.search("never gonna give you up", { service: "youtube" }).then(async (tracks) => {
	const track = tracks[0];
	const resource = discordVoice.createAudioResource(await track.resource());
});
```

## Documentation

Barbara Music was made with being straight-forward and easy to use in mind. Thus, a cheatsheet can be found [here](https://github.com/Avoxel284/barbara/CHEATSHEET.md), and reference documentation can be found [here](https://avoxel284.github.io/barbara).
