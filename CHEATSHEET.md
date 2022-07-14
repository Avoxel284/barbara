# Barbara Music Module Cheatsheet

## Authentication keys

Used in `getKey(<Key ID>)`, `setKey(<Key ID>, <value>)`, and `freeKey(<Key ID>)`.

\* = Required to be set if using service

### SoundCloud

- **\*Client ID** - `SOUNDCLOUD_CLIENTID`

### Spotify

- **API key** - `SPOTIFY_APIKEY`
- **\*Client ID** - `SPOTIFY_CLIENTID`
- **Client secret** - `SPOTIFY_CLIENTSECRET`
- **Authorization code** - `SPOTIFY_AUTHCODE`
- **Access token** - `SPOTIFY_ACCESSTOKEN`
- **Refresh token** - `SPOTIFY_REFRESHTOKEN`
- **Token type** - `SPOTIFY_TOKENTYPE`
- **Token expiry** - `SPOTIFY_EXPIRY` <br> Timestamp of when the token will expire
- **\*Market code** - `SPOTIFY_MARKETCODE` <br> An [ISO 3166-1 alpha-2 country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)

### YouTube

- **Cookie** - `YOUTUBE_COOKIE` <br> Provide a cookie string for accessing consent-required content
- **Invidious API URL** - `YOUTUBE_INVIDIOUSAPI` <br> Provide a different API URL for Invidious. Using `freeKey` is recommended.

### Configuration

- **Debug toggle** - `CONFIG_DEBUG` <br> A boolean that enables or disables debug console logging. Logs are prefixed with `[ Barbara Debug ]`
- **Config file** - `CONFIG_FILE` <br> <u>**To be added!**</u> Path to a JSON file that contains configuration data.
