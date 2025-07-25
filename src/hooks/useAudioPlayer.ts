import { useState, useRef, useEffect, useCallback } from 'react';
import { Track, PlayerState, Playlist } from '../types/music';

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    isShuffled: false,
    repeatMode: 'none',
    currentPlaylist: null,
    currentTrackIndex: -1,
  });

  const updatePlayerState = useCallback((updates: Partial<PlayerState>) => {
    setPlayerState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetPlayer = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    updatePlayerState({
      currentTrack: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      currentPlaylist: null,
      currentTrackIndex: -1,
    });
  }, [updatePlayerState]);

  const loadTrack = useCallback((track: Track, playlist?: Playlist, trackIndex?: number) => {
    if (audioRef.current) {
      audioRef.current.src = track.url;
      updatePlayerState({
        currentTrack: track,
        currentPlaylist: playlist || null,
        currentTrackIndex: trackIndex ?? -1,
        isPlaying: false,
      });
    }
  }, [updatePlayerState]);

  const play = useCallback(() => {
    if (audioRef.current && playerState.currentTrack) {
      audioRef.current.play();
      updatePlayerState({ isPlaying: true });
    }
  }, [playerState.currentTrack, updatePlayerState]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      updatePlayerState({ isPlaying: false });
    }
  }, [updatePlayerState]);

  const togglePlayPause = useCallback(() => {
    if (playerState.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [playerState.isPlaying, play, pause]);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      updatePlayerState({ volume, isMuted: volume === 0 });
    }
  }, [updatePlayerState]);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMuted = !playerState.isMuted;
      audioRef.current.muted = newMuted;
      updatePlayerState({ isMuted: newMuted });
    }
  }, [playerState.isMuted, updatePlayerState]);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      updatePlayerState({ currentTime: time });
    }
  }, [updatePlayerState]);

  const skipToNext = useCallback(() => {
    if (!playerState.currentPlaylist || playerState.currentTrackIndex === -1) return;

    const playlist = playerState.currentPlaylist;
    let nextIndex = playerState.currentTrackIndex + 1;

    if (playerState.isShuffled) {
      nextIndex = Math.floor(Math.random() * playlist.tracks.length);
    } else if (nextIndex >= playlist.tracks.length) {
      if (playerState.repeatMode === 'all') {
        nextIndex = 0;
      } else {
        return;
      }
    }

    loadTrack(playlist.tracks[nextIndex], playlist, nextIndex);
    if (playerState.isPlaying) {
      setTimeout(play, 100);
    }
  }, [playerState, loadTrack, play]);

  const skipToPrevious = useCallback(() => {
    if (!playerState.currentPlaylist || playerState.currentTrackIndex === -1) return;

    const playlist = playerState.currentPlaylist;
    let prevIndex = playerState.currentTrackIndex - 1;

    if (prevIndex < 0) {
      if (playerState.repeatMode === 'all') {
        prevIndex = playlist.tracks.length - 1;
      } else {
        return;
      }
    }

    loadTrack(playlist.tracks[prevIndex], playlist, prevIndex);
    if (playerState.isPlaying) {
      setTimeout(play, 100);
    }
  }, [playerState, loadTrack, play]);

  const toggleShuffle = useCallback(() => {
    updatePlayerState({ isShuffled: !playerState.isShuffled });
  }, [playerState.isShuffled, updatePlayerState]);

  const toggleRepeat = useCallback(() => {
    const modes: PlayerState['repeatMode'][] = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(playerState.repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    updatePlayerState({ repeatMode: nextMode });
  }, [playerState.repeatMode, updatePlayerState]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      updatePlayerState({ currentTime: audio.currentTime });
    };

    const handleDurationChange = () => {
      updatePlayerState({ duration: audio.duration });
    };

    const handleEnded = () => {
      if (playerState.repeatMode === 'one') {
        audio.currentTime = 0;
        play();
      } else {
        skipToNext();
      }
    };

    const handleLoadedMetadata = () => {
      updatePlayerState({ duration: audio.duration });
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [playerState.repeatMode, play, skipToNext, updatePlayerState]);

  return {
    audioRef,
    playerState,
    loadTrack,
    play,
    pause,
    togglePlayPause,
    setVolume,
    toggleMute,
    seekTo,
    skipToNext,
    skipToPrevious,
    toggleShuffle,
    toggleRepeat,
    resetPlayer,
  };
}