

export const spotifyConfig = {
  clientId: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID.toString(),
  clientSecret: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET.toString(),
  redirectUrl: process.env.EXPO_PUBLIC_SPOTIFY_REDIRECT_URI.toString(),
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