<img src="./media/Banner.png">

<b>[Documentation](https://avoxel284.github.io/barbara) | [Examples](https://github.com/Avoxel284/barbara/tree/master/examples) | [Cheatsheet](https://github.com/Avoxel284/barbara/blob/master/CHEATSHEET.md)</b>

## **WORK IN PROGRESS!**

Library is in development, use at your own risk. **Will finish working on this once I have the chance**

<br>
<br>

## About

Unified MusicTrack and MusicPlaylist objects for use in Discord bots for playing music. Uses Prism Media to create **FFmpeg** streams.

Utilizes the [Invidious](https://invidious.io/) API for streaming YouTube videos.

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

// Get the best Invidious API URL and set it
barbara.freeKey("YOUTUBE_INVIDIOUSSITE").then((key) => {
	barbara.setKey("YOUTUBE_INVIDIOUSSITE", key);
});

// Set Spotify credentials.
// When setting any keys that require authentication (only Spotify atm), Barbara will automatically
// authenticate them and set other keys such as SPOTIFY_ACCESSTOKEN.
barbara.setKeys({
	SPOTIFY: {
		CLIENTID: process.env.SPOTIFY_CLIENT_ID,
		CLIENTSECRET: process.env.SPOTIFY_CLIENT_SECRET,
	},
});

// Barbara will also automatically refresh authenticated keys when they are about to expire...
barbara.setKey("CONFIG_REFRESHTOKENS", true)

// ... however, you can also turn this off by setting CONFIG_REFRESHTOKENS to false.
// A refreshTokens() function is provided for manually refreshing tokens. Provide true for the first parameter
// and it will force refreshing the tokens rather than automatically checking if they are about to expire.
```

Refer to the cheatsheet for auth key identifiers.

```js
const barbara = require("barbara-music");

barbara.search("never gonna give you up", { service: "youtube", limit: 5 }).then(async (tracks) => {
	const track = tracks[0];
	const resource = discordVoice.createAudioResource(await track.resource());
});
```

## Documentation

Barbara Music was made with being straight-forward and easy to use in mind. Thus, a cheatsheet can be found [here](https://github.com/Avoxel284/barbara/blob/master/CHEATSHEET.md), and reference documentation can be found [here](https://avoxel284.github.io/barbara).
