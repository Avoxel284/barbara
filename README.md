<img src="./media/Banner.png">

<b>[Documentation](https://avoxel284.github.io/barbara) | [Examples](https://github.com/Avoxel284/barbara/examples)</b>

## WORK IN PROGRESS!

Library is nowhere near finished! Please do not use.

<br>
<br>

## About

In the past, I coded a Discord bot named norikobot which used [play-dl](https://github.com/play-dl/play-dl). However, while play-dl was a great library for streaming music, it was archived and is no longer maintained. Thus, I created Barbara Music. Barbara features a unified `MusicTrack` class with intuitive methods and properties to stream FFmpeg audio. Barbara was built with music-playing Discord bots in mind, especially as I use it for one of my own Discord bots, norikobot.

## Installation

```
npm install barbara-music
```

## Examples

```js
const barbara = require("barbara-music");

barbara.searchTrack("never gonna give you up", barbara.yt).then((track) => {
	const resource = discordVoice.createAudioResource(track.resource());
});
```

<br>
don't ask why i picked a genshin character as the name
