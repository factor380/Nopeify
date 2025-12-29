

export const spotifyConfig = {
  clientId: '3837278983ad437abc2072c0617d5496',
  clientSecret: '0557dc203d564e168c9e86a77d5ddfbf',
  redirectUrl: 'nopeify://redirect',
  scopes: ["user-read-email",
    "user-read-private",
    "user-top-read",
    "user-modify-playback-state",
    "user-read-playback-state",
    "user-read-currently-playing"],
  serviceConfiguration: {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  },
  extraParams: {
    show_dialog: 'true',
  },
};