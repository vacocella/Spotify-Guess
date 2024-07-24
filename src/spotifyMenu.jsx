import React, { useState, useEffect } from 'react';

const SpotifyPlayer = ({ track }) => {
  if (!track) {
    return <div>No track playing</div>;
  }

  return (
    <div>
      <h3>Now Playing</h3>
      <p>Song: {track.name}</p>
      <p>Artist: {track.artists.map((artist) => artist.name).join(', ')}</p>
    </div>
  );
};

const SpotifyMenu = ({ token }) => {
  const [playlists, setPlaylists] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);

  const fetchCurrentlyPlaying = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data; // This will be the currently playing track information
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  useEffect(() => {
    const fetchPlaylists = async () => {
      const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      setPlaylists(data.items);
    };

    fetchPlaylists();
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchCurrentlyPlaying();
    }, 1000);

    return () => clearInterval(interval);
  }, [token]);

  const handlePlaylistSelection = async (uri) => {
    await playSong(uri);
  };

  const playSong = async (uri) => {
    const deviceResponse = await fetch('https://api.spotify.com/v1/me/player/devices', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const { devices } = await deviceResponse.json();
    const activeDevice = devices.find((device) => device.is_active);

    if (activeDevice) {
      await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ context_uri: uri })
      });
    } else {
      console.log('No active device found');
    }
  };

  if (!token) return null;

  return (
    <div>
      <h2>Select a Playlist</h2>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id} onClick={() => handlePlaylistSelection(playlist.uri)}>
            {playlist.name}
          </li>
        ))}
      </ul>

      {/* Use SpotifyPlayer to display the current track */}
      <SpotifyPlayer track={currentTrack} />
    </div>
  );
};

export default SpotifyMenu;
