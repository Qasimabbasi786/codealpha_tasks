import React, { useState, useEffect, useMemo } from 'react';
import { Music } from 'lucide-react';
import { Track, Playlist, Theme } from './types/music';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { FileUpload } from './components/FileUpload';
import { SearchBar } from './components/SearchBar';
import { TrackList } from './components/TrackList';
import { PlaylistManager } from './components/PlaylistManager';
import { MusicPlayer } from './components/MusicPlayer';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  const [tracks, setTracks] = useLocalStorage<Track[]>('musicTracks', []);
  const [playlists, setPlaylists] = useLocalStorage<Playlist[]>('musicPlaylists', []);
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [activeTab, setActiveTab] = useState<'library' | 'playlists'>('library');

  const {
    audioRef,
    playerState,
    loadTrack,
    togglePlayPause,
    setVolume,
    toggleMute,
    seekTo,
    skipToNext,
    skipToPrevious,
    toggleShuffle,
    toggleRepeat,
    resetPlayer,
  } = useAudioPlayer();

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Filter tracks based on search query
  const filteredTracks = useMemo(() => {
    if (!searchQuery) return tracks;
    
    const query = searchQuery.toLowerCase();
    return tracks.filter(track =>
      track.title.toLowerCase().includes(query) ||
      track.artist.toLowerCase().includes(query) ||
      track.album?.toLowerCase().includes(query) ||
      track.genre?.toLowerCase().includes(query)
    );
  }, [tracks, searchQuery]);

  // Get current display tracks
  const displayTracks = selectedPlaylist ? selectedPlaylist.tracks : filteredTracks;

  const handleTracksAdded = (newTracks: Track[]) => {
    setTracks(prev => [...prev, ...newTracks]);
  };

  const handleTrackSelect = (track: Track, index: number) => {
    const playlist = selectedPlaylist || {
      id: 'library',
      name: 'Library',
      tracks: filteredTracks,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    loadTrack(track, playlist, index);
    togglePlayPause();
  };

  const handleDeleteTrack = (trackId: string) => {
    // Remove from main tracks array
    setTracks(prev => prev.filter(track => track.id !== trackId));
    
    // Remove from all playlists
    setPlaylists(prev => prev.map(playlist => ({
      ...playlist,
      tracks: playlist.tracks.filter(track => track.id !== trackId),
      updatedAt: new Date()
    })));
    
    // If the deleted track is currently playing, stop playback
    if (playerState.currentTrack?.id === trackId) {
      resetPlayer();
    }
  };

  const handleCreatePlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: crypto.randomUUID(),
      name,
      tracks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setPlaylists(prev => [...prev, newPlaylist]);
  };

  const handleDeletePlaylist = (playlistId: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
    if (selectedPlaylist?.id === playlistId) {
      setSelectedPlaylist(null);
    }
  };

  const handleRenamePlaylist = (playlistId: string, newName: string) => {
    setPlaylists(prev => prev.map(p => 
      p.id === playlistId 
        ? { ...p, name: newName, updatedAt: new Date() }
        : p
    ));
  };

  const handleSelectPlaylist = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setActiveTab('playlists');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-all duration-300">
      <audio ref={audioRef} />
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">MusicFlow</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your personal music experience</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                className="w-64"
              />
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-1.5 border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex space-x-1">
                <button
                  onClick={() => {
                    setActiveTab('library');
                    setSelectedPlaylist(null);
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    activeTab === 'library'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                  }`}
                >
                  Library
                </button>
                <button
                  onClick={() => setActiveTab('playlists')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    activeTab === 'playlists'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                  }`}
                >
                  Playlists
                </button>
              </div>
            </div>

            {/* Playlist Manager */}
            {activeTab === 'playlists' && (
              <PlaylistManager
                playlists={playlists}
                onCreatePlaylist={handleCreatePlaylist}
                onDeletePlaylist={handleDeletePlaylist}
                onRenamePlaylist={handleRenamePlaylist}
                onSelectPlaylist={handleSelectPlaylist}
                selectedPlaylist={selectedPlaylist}
              />
            )}

            {/* Music Player */}
            <MusicPlayer
              playerState={playerState}
              onTogglePlayPause={togglePlayPause}
              onSkipNext={skipToNext}
              onSkipPrevious={skipToPrevious}
              onVolumeChange={setVolume}
              onToggleMute={toggleMute}
              onSeek={seekTo}
              onToggleShuffle={toggleShuffle}
              onToggleRepeat={toggleRepeat}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              {/* Content Header */}
              <div className="p-8 border-b border-gray-200/50 dark:border-gray-700/50">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedPlaylist ? selectedPlaylist.name : 'Music Library'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {displayTracks.length} tracks
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>

              {/* File Upload */}
              {!selectedPlaylist && (
                <div className="p-8 border-b border-gray-200/50 dark:border-gray-700/50">
                  <FileUpload onTracksAdded={handleTracksAdded} />
                </div>
              )}

              {/* Track List */}
              <div className="p-8">
                <TrackList
                  tracks={displayTracks}
                  currentTrack={playerState.currentTrack}
                  isPlaying={playerState.isPlaying}
                  onTrackSelect={handleTrackSelect}
                  onTrackDelete={handleDeleteTrack}
                  showDelete={!selectedPlaylist}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;