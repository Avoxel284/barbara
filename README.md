<img src="./media/Banner.png">

<b>[Documentation](https://avoxel284.github.io/barbara) | [Examples](https://github.com/Avoxel284/barbara/examples)</b>

## WORK IN PROGRESS!

Library is in development, use at your own risk.

<br>
<br>

## About

In the past, I coded a Discord bot named norikobot which used [play-dl](https://github.com/play-dl/play-dl). However, while play-dl was a great library for streaming music, it was archived and is no longer maintained. Thus, I created Barbara Music. Barbara features a unified `MusicTrack` class with intuitive methods and properties to stream audio. Barbara was built with music-playing Discord bots in mind, especially as I use it for one of my own Discord bots, norikobot.

Since Barbara Music uses Prism Media, Barbara creates a Prism FFmpeg object that can be used as a DiscordVoice audio resource. Because of this, audio filters can be added by passing extra arguments to FFmpeg.

Currently Barbara only streams from SoundCloud, however other services are planned.

## Installation

```
npm install barbara-music
```

## Examples

```js
const barbara = require("barbara-music");

barbara.searchTrack("never gonna give you up", barbara.yt).then(async (track) => {
	const resource = discordVoice.createAudioResource(await track.sing());
});
```

## License & legal

"Barbara Music" isn’t endorsed by Hoyoverse and doesn’t reflect the views or opinions of Hoyoverse or anyone officially involved in producing or managing Genshin Impact. Genshin Impact and Hoyoverse are trademarks or registered trademarks of Hoyoverse.

I chose the name "Barbara" since the character, Barbara, from the video game, Genshin Impact, likes to sing. The [image](https://www.gensh.in/fileadmin/Database/Characters/Barbara/charPortrait_Barbara_XL.png) used in the banner is official Genshin Impact art and is the property of its respective owners.

<br>
<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a>

The code in this package is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.

<br>
<br>
<br>
<br>
don't ask why i picked a genshin character as the name
