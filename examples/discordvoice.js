// const Barbara = require("barbara-music");
const Barbara = require("../dist");
const Discord = require("discord.js");
const DiscordVoice = require("@discordjs/voice");
require("dotenv").config({ path: require("path").join(__dirname, ".env") });

// Set up our Discord client
const client = new Discord.Client({
	intents: [
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_VOICE_STATES,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
	],
	partials: ["CHANNEL"],
});

client.on("ready", async (client) => {
	console.log(`Logged in as ${client.user.tag}!`);

	// Set our keys
	Barbara.setKey("CONFIG_DEBUG", true);
	Barbara.setKey("SOUNDCLOUD_CLIENTID", await Barbara.freeKeys("SOUNDCLOUD_CLIENTID"));
	console.log(Barbara.getKey("SOUNDCLOUD_CLIENTID"));
});

client.on("messageCreate", async (msg) => {
	if (msg.content.toLowerCase().startsWith("!search ")) {
		if (!msg.member.voice?.channel) return msg.reply("Connect to a VC first!");

		// Create a new voice connection from the bot to the users VC
		const connection = DiscordVoice.joinVoiceChannel({
			channelId: msg.member.voice.channel.id,
			guildId: msg.guild.id,
			adapterCreator: msg.guild.voiceAdapterCreator,
		});

		// Get the search parameters from the message
		const params = msg.content.split("!search ")[1];

		// Search for the track on YouTube
		const search = await Barbara.search(params, {
			service: "soundcloud",
			limit: 1,
			type: "tracks",
		});

		// console.log(params);
		// console.log(search);
		// return;
		// If no results were found, return
		if (search.length == 0) return msg.reply("No results were found");

		// Get the first track from the search results
		const track = search[0];

		const v = await track.resource(1, ["-report", "-f", "opus"]).catch(console.log);

		// Create a new audio resource from the track
		const resource = await DiscordVoice.createAudioResource(v);

		// Create a new audio player
		const player = DiscordVoice.createAudioPlayer({
			behaviors: {
				noSubscriber: DiscordVoice.NoSubscriberBehavior.Play,
			},
		});

		// console.log(resource);
		// console.log(player);

		// Play the audio resource
		player.play(resource);

		// Subscribe the player to the voice connection
		connection.subscribe(player);
	}

	if (msg.content.toLowerCase().startsWith("!play ")) {
		if (!msg.member.voice?.channel) return msg.reply("Connect to a VC first!");

		// Create a new voice connection from the bot to the users VC
		const connection = DiscordVoice.joinVoiceChannel({
			channelId: msg.member.voice.channel.id,
			guildId: msg.guild.id,
			adapterCreator: msg.guild.voiceAdapterCreator,
		});

		// Get the search parameters from the message
		const params = msg.content.split("!play ")[1];

		const track = await Barbara.info(params);

		track
			.resource(1, ["-report"])
			.then(async (r) => {
				// Create a new audio resource from the track
				const resource = await DiscordVoice.createAudioResource(r);

				// Create a new audio player
				const player = DiscordVoice.createAudioPlayer({
					behaviors: {
						noSubscriber: DiscordVoice.NoSubscriberBehavior.Play,
					},
				});

				// console.log(resource);
				// console.log(player);

				// Play the audio resource
				player.play(resource);

				// Subscribe the player to the voice connection
				connection.subscribe(player);
			})
			.catch(console.log);
	}

	if (msg.content.toLowerCase() === "!np") {
	}
});

// Login our bot
client.login(process.env.DISCORD_TOKEN);
