const barbara = require("../dist");
const path = require("path");
const fs = require("fs");

// Set our YouTube cookie to the contents of the ytcookie.txt file
barbara.setKey(
	"YOUTUBE_COOKIE",
	fs.readFileSync(path.join(__dirname, "ytcookie.txt"), { encoding: "utf-8" })
);

// Set our Spotify API key to the SPOTIFY_API_KEY environment variable
barbara.setKey("SPOTIFY_APIKEY", process.env.SPOTIFY_API_KEY);

// Get a free SoundCloud Client ID key and set it
barbara.freeKeys("SOUNDCLOUD_CLIENTID").then((key) => {
	barbara.setKey("SOUNDCLOUD_CLIENTID", key);
});

// Set a JSON file as the keys file. We also specified not to overwrite any already set values.
barbara.setKeyFile(path.join(__dirname, "barbara keys.json"), false);
