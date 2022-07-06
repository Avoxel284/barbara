<img src="./media/Banner.png">

<b>[Documentation](https://avoxel284.github.io/barbara) | [Examples](https://github.com/Avoxel284/barbara/examples)</b>

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
Authentication can be done very easily:

```js
const barbara = require("barbara-music");

// Get a free SoundCloud client ID and set it
barbara.setKey("SOUNDCLOUD_CLIENTID", await barbara.freeKey("SOUNDCLOUD_CLIENTID"));
```

Further documentation will be added later

```js
const barbara = require("barbara-music");

barbara.searchTrack("never gonna give you up", barbara.yt).then(async (track) => {
	const resource = discordVoice.createAudioResource(await track.sing());
});
```

## Cheatsheet

### Key identifiers

- **SOUNDCLOUD_CLIENTID**
SoundCloud Client ID for use in API. Obtainable via SoundCloud Developer program or web scraping.

- **SPOTIFY_APIKEY**
Spotify API key. Obtainable via signing up on Spotify Developer dashboard.

- **SPOTIFY**