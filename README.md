<img src="./images/Banner.png">

## Backstory

In the past, I coded a Discord bot named norikobot which used [play-dl](https://github.com/play-dl/play-dl). However, while play-dl was a great library for streaming music, it was archived and is no longer maintained. Thus, I created the Barbara Music module. Barbara Music was also a good opportunity for me to properly learn TypeScript.

## Features

Barbara features a unified `MusicTrack` class with intuitive methods to make music-streaming Discord bots easier.

## Examples

```js
const barbara = require("barbara-music");

barbara.searchTrack("never gonna give you up", barbara.yt).then((track) => {
	const resource = discordVoice.createAudioResource(track.resource());
});
```
