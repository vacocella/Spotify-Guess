import { useEffect, useState } from 'react';
import SpotifyMenu from './spotifyMenu';

const CLIENT_ID = '53531ffe75e2485c9d53bace8cf36ab9'; // Replace with your Spotify Client ID
const REDIRECT_URI = 'http://localhost:5173/'; // Replace with your redirect URI
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';

export default function SpotifyAuth() {
  const [token, setToken] = useState('');

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem('token');

    if (!token && hash) {
      token = hash
        .substring(1)
        .split('&')
        .find((elem) => elem.startsWith('access_token'))
        .split('=')[1];
      window.location.hash = '';
      window.localStorage.setItem('token', token);
    }

    setToken(token);
  }, []);

  const handleLogin = () => {
    window.location = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`;
  };

  return <div>{!token ? <button onClick={handleLogin}>Login to Spotify</button> : <SpotifyMenu token={token} />}</div>;
}
