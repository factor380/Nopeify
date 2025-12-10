import React, { useEffect, useState } from 'react';
import { Button, View, Text } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { spotifyConfig } from '../spotifyConfig';

const REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: "nopeify", // מותר לשנות
  path: 'redirect'
});

export default function SpotifyLogin({ onLogin }: { onLogin: (token: string) => void }) {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: spotifyConfig.clientId,
      scopes: spotifyConfig.scopes,
      redirectUri: REDIRECT_URI,
      responseType: "code",
      usePKCE: true,
    },
    {
      authorizationEndpoint: spotifyConfig.serviceConfiguration.authorizationEndpoint,
      tokenEndpoint: spotifyConfig.serviceConfiguration.tokenEndpoint,
    }
  );

  useEffect(() => {
    // Debug: show the full response in the console to diagnose auth issues
    console.log('Spotify auth response:', response);

    // With PKCE we receive an authorization `code` which must be exchanged
    // for an access token using the token endpoint and the original code_verifier.
    const exchangeCodeForToken = async (code: string) => {
      try {
        console.log('Exchanging code for token:', code);
        const codeVerifier = (request as any)?.codeVerifier;
        const body = new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
          client_id: spotifyConfig.clientId,
          code_verifier: codeVerifier || '',
        }).toString();

        const tokenResponse = await fetch(spotifyConfig.serviceConfiguration.tokenEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body,
        });

        const tokenData = await tokenResponse.json();
        console.log('Spotify token response:', tokenData);

        if (tokenData.access_token) {
          onLogin(tokenData.access_token);
        } else {
          console.error('No access token returned from Spotify', tokenData);
        }
      } catch (err) {
        console.error('Error exchanging code for token:', err);
      }
    };

    if (response?.type === 'success') {
      const code = (response as any).params?.code;
      if (code) {
        (async () => {
          await exchangeCodeForToken(code);
        })();
      } else {
        console.error('Auth response had no code param:', response);
      }
    }
  }, [response]);

  

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button 
        title="Login with Spotify" 
        onPress={() => promptAsync()}
        disabled={!request}
      />
    </View>
  );
}


