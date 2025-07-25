import React, { useState } from 'react';
import { Plus, FolderMinus as FolderMusic, Edit2, Trash2, Music } from 'lucide-react';
import { Playlist, Track } from '../types/music';

interface PlaylistManagerProps {
  playlists: Playlist[];
  onCreatePlaylist: (name: string) => void;
  onDeletePlaylist: (playlistId: string) => void;
  onRenamePlaylist: (playlistId: string, newName: string) => void;
  onSelectPlaylist: (playlist: Playlist) => void;
  selectedPlaylist: Playlist | null;
}

export function PlaylistManager({
  playlists,
  onCreatePlaylist,
  onDeletePlaylist,
  onRenamePlaylist,
  onSelectPlaylist,
  selectedPlaylist
}: PlaylistManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [editingPlaylist, setEditingPlaylist] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      onCreatePlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setShowCreateForm(false);
    }
  };

  const handleRenamePlaylist = (playlistId: string) => {
    if (editName.trim()) {
      onRenamePlaylist(playlistId, editName.trim());
      setEditingPlaylist(null);
      setEditName('');
    }
  };

  const startEditing = (playlist: Playlist) => {
    setEditingPlaylist(playlist.id);
    setEditName(playlist.name);
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <FolderMusic className="w-6 h-6 mr-2" />
          Playlists
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          New
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreatePlaylist} className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Playlist name..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl
                       bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
              autoFocus
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCreateForm(false);
                setNewPlaylistName('');
              }}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 shadow-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className={`group flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 border
                       ${selectedPlaylist?.id === playlist.id
                         ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700 shadow-lg'
                         : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:shadow-md'
                       }`}
            onClick={() => onSelectPlaylist(playlist)}
          >
            <div className="flex items-center flex-1 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 shadow-md">
                <Music className="w-5 h-5 text-white" />
              </div>
              {editingPlaylist === playlist.id ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => handleRenamePlaylist(playlist.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRenamePlaylist(playlist.id);
                    if (e.key === 'Escape') {
                      setEditingPlaylist(null);
                      setEditName('');
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg shadow-sm"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate text-lg">
                    {playlist.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {playlist.tracks.length} tracks
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing(playlist);
                }}
                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePlaylist(playlist.id);
                }}
                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {playlists.length === 0 && !showCreateForm && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Music className="w-8 h-8 text-purple-500 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No playlists yet</h3>
          <p className="text-gray-500 dark:text-gray-400">Create your first playlist to organize your music</p>
        </div>
      )}
    </div>
  );
}