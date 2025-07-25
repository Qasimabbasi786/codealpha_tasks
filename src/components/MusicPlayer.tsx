import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Shuffle, 
  Repeat, 
  Repeat1 
} from 'lucide-react';
import { PlayerState } from '../types/music';

interface MusicPlayerProps {
  playerState: PlayerState;
  onTogglePlayPause: () => void;
  onSkipNext: () => void;
  onSkipPrevious: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onSeek: (time: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
}

export function MusicPlayer({
  playerState,
  onTogglePlayPause,
  onSkipNext,
  onSkipPrevious,
  onVolumeChange,
  onToggleMute,
  onSeek,
  onToggleShuffle,
  onToggleRepeat
}: MusicPlayerProps) {
  const { 
    currentTrack, 
    isPlaying, 
    currentTime, 
    duration, 
    volume, 
    isMuted, 
    isShuffled, 
    repeatMode 
  } = playerState;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    onSeek(percentage * duration);
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one':
        return <Repeat1 className="w-5 h-5" />;
      default:
        return <Repeat className="w-5 h-5" />;
    }
  };

  if (!currentTrack) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-10 h-10 text-purple-500 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Ready to play</h3>
          <p className="text-gray-500 dark:text-gray-400">Select a track to start playing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
      
      {/* Track Info */}
      <div className="flex items-center mb-8 relative z-10">
        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-5 flex-shrink-0 shadow-lg">
          <div className="w-16 h-16 bg-gradient-to-br from-white/30 to-white/10 rounded-xl flex items-center justify-center">
            {isPlaying ? (
              <div className="flex space-x-1">
                <div className="w-1 h-6 bg-white rounded-full animate-pulse"></div>
                <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1 h-8 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <div className="w-1 h-5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
              </div>
            ) : (
              <Play className="w-8 h-8 text-white/90 ml-1" />
            )}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-xl truncate mb-1">{currentTrack.title}</h3>
          <p className="text-white/90 truncate text-lg">{currentTrack.artist}</p>
          {currentTrack.album && (
            <p className="text-white/70 truncate mt-1">{currentTrack.album}</p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 relative z-10">
        <div 
          className="w-full h-3 bg-white/20 backdrop-blur-sm rounded-full cursor-pointer group shadow-inner"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-gradient-to-r from-white to-white/90 rounded-full transition-all duration-150 group-hover:shadow-lg relative"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          >
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>
        <div className="flex justify-between text-white/90 mt-3 font-medium">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-8 mb-8 relative z-10">
        <button
          onClick={onToggleShuffle}
          className={`p-3 rounded-xl transition-all duration-200 ${
            isShuffled ? 'bg-white/20 backdrop-blur-sm text-white shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <Shuffle className="w-5 h-5" />
        </button>

        <button
          onClick={onSkipPrevious}
          className="p-3 text-white/80 hover:text-white transition-all duration-200 hover:bg-white/10 rounded-xl"
        >
          <SkipBack className="w-6 h-6" />
        </button>

        <button
          onClick={onTogglePlayPause}
          className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-purple-600 hover:scale-110 transition-all duration-200 shadow-2xl hover:shadow-3xl"
        >
          {isPlaying ? (
            <Pause className="w-9 h-9" />
          ) : (
            <Play className="w-9 h-9 ml-1" />
          )}
        </button>

        <button
          onClick={onSkipNext}
          className="p-3 text-white/80 hover:text-white transition-all duration-200 hover:bg-white/10 rounded-xl"
        >
          <SkipForward className="w-6 h-6" />
        </button>

        <button
          onClick={onToggleRepeat}
          className={`p-3 rounded-xl transition-all duration-200 ${
            repeatMode !== 'none' ? 'bg-white/20 backdrop-blur-sm text-white shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          {getRepeatIcon()}
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-center space-x-4 relative z-10">
        <button
          onClick={onToggleMute}
          className="p-2 text-white/80 hover:text-white transition-all duration-200 hover:bg-white/10 rounded-lg"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
        
        <div className="w-32 relative">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-white/20 backdrop-blur-sm rounded-lg appearance-none cursor-pointer slider shadow-inner"
          />
        </div>
      </div>
    </div>
  );
}