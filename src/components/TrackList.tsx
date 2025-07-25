import React from 'react';
import { Play, Pause, Music, Clock, Trash2, AlertTriangle } from 'lucide-react';
import { Track } from '../types/music';

interface TrackListProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onTrackSelect: (track: Track, index: number) => void;
  onTrackDelete?: (trackId: string) => void;
  showDelete?: boolean;
}

export function TrackList({ 
  tracks, 
  currentTrack, 
  isPlaying, 
  onTrackSelect, 
  onTrackDelete,
  showDelete = false 
}: TrackListProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (tracks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Music className="w-12 h-12 text-purple-500 dark:text-purple-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No tracks available</h3>
        <p className="text-gray-500 dark:text-gray-400">Upload some music to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tracks.map((track, index) => {
        const isCurrentTrack = currentTrack?.id === track.id;
        
        return (
          <div
            key={track.id}
            className={`group flex items-center p-5 rounded-2xl transition-all duration-300 cursor-pointer border
                       ${isCurrentTrack 
                         ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700 shadow-lg' 
                         : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/80 hover:shadow-md hover:border-purple-200 dark:hover:border-purple-700'
                       }`}
          >
            <div 
              className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group-hover:scale-105"
              onClick={() => onTrackSelect(track, index)}
            >
              {isCurrentTrack && isPlaying ? (
                <Pause className="w-7 h-7 text-white" />
              ) : (
                <Play className="w-7 h-7 text-white ml-0.5" />
              )}
            </div>
            
            <div 
              className="flex-1 min-w-0 cursor-pointer"
              onClick={() => onTrackSelect(track, index)}
            >
              <h3 className={`font-semibold truncate ${
                isCurrentTrack ? 'text-purple-700 dark:text-purple-300' : 'text-gray-900 dark:text-white'
              }`}>
                {track.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 truncate mt-1">
                {track.artist} {track.album && `• ${track.album}`}
              </p>
              {track.genre && (
                <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                  {track.genre}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{formatDuration(track.duration)}</span>
              </div>
              
              {showDelete && onTrackDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Are you sure you want to delete "${track.title}"?`)) {
                      onTrackDelete(track.id);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Delete track"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}