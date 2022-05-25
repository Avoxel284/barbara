<img src="./images/Banner.png">

<b> [Documentation](https://avoxel284.github.io/barbara)</b>

## WORK IN PROGRESS!

Library is nowhere near finished! Please do not use.

## Backstory

In the past, I coded a Discord bot named norikobot which used [play-dl](https://github.com/play-dl/play-dl). However, while play-dl was a great library for streaming music, it was archived and is no longer maintained. Thus, I created the Barbara Music module. Barbara Music was also a good opportunity for me to properly learn TypeScript.

## Features

Barbara features a unified `MusicTrack` class with intuitive methods to make music-streaming Discord bots easier.

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
don't ask why i picked a genshin character as the mascot
