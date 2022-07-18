# Barbara Music Module Cheatsheet

## Authentication keys

Used in `getKey(<Key ID>)`, `setKey(<Key ID>, <value>)`, and `freeKey(<Key ID>)`.

\* = Required to be set if using service <br>
^ = Can be provided via `freeKey()`

### SoundCloud

- **\*^Client ID** - `SOUNDCLOUD_CLIENTID`<br> SoundCloud's developer program is currently closed, thus using `freeKey()` is recommended.

### Spotify

<u>To be implemented</u>

- **\*Client ID** - `SPOTIFY_CLIENTID`
- **\*Client secret** - `SPOTIFY_CLIENTSECRET` <br> Set client secret and ID and Barbara will automatically fill in the below (except market code)
- **Access token** - `SPOTIFY_ACCESSTOKEN`
- **Refresh token** - `SPOTIFY_REFRESHTOKEN`
- **Token type** - `SPOTIFY_TOKENTYPE`
- **Token expiry** - `SPOTIFY_EXPIRY` <br> Timestamp of when the token will expire
- **\*Market code** - `SPOTIFY_MARKETCODE` <br> An [ISO 3166-1 alpha-2 country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)

### YouTube

- **Cookie** - `YOUTUBE_COOKIE` <br> Provide a cookie string for accessing consent-required content
- **^Invidious site URL** - `YOUTUBE_INVIDIOUSSITE` <br> Provide a different Invidous site URL. Using `freeKey()` is recommended.

### Genius

- **Token** - `GENIUS_TOKEN` <br> A token obtainable via creating a new app on [Genius API clients dashboard](https://genius.com/api-clients)
- **Cache lyrics?** - `GENIUS_LYRICSCACHING` <br> Cache lyrics in an internal object to make fetching lyrics faster? (Enabled by default)

### Configuration

- **Debug toggle** - `CONFIG_DEBUG` <br> A boolean that enables or disables debug console logging. Logs are prefixed with `[ Barbara Debug ]`
- **Config file** - `CONFIG_FILE` <br> Path to a JSON file that contains configuration data. Will soon include a tool for generating config file.
