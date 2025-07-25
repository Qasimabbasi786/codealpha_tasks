import React, { useCallback, useState } from 'react';
import { Upload, Music, X } from 'lucide-react';
import { Track } from '../types/music';

interface FileUploadProps {
  onTracksAdded: (tracks: Track[]) => void;
  className?: string;
}

export function FileUpload({ onTracksAdded, className = '' }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFiles = useCallback(async (files: FileList) => {
    setIsProcessing(true);
    const tracks: Track[] = [];

    for (const file of Array.from(files)) {
      if (file.type.startsWith('audio/')) {
        const track: Track = {
          id: crypto.randomUUID(),
          title: file.name.replace(/\.[^/.]+$/, ''),
          artist: 'Unknown Artist',
          duration: 0,
          file,
          url: URL.createObjectURL(file),
        };

        // Try to extract metadata
        try {
          const audio = new Audio(track.url);
          await new Promise((resolve, reject) => {
            audio.addEventListener('loadedmetadata', resolve);
            audio.addEventListener('error', reject);
          });
          track.duration = audio.duration;
        } catch (error) {
          console.warn('Could not load metadata for', file.name);
        }

        tracks.push(track);
      }
    }

    onTracksAdded(tracks);
    setIsProcessing(false);
  }, [onTracksAdded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  }, [processFiles]);

  return (
    <div className={className}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 shadow-lg'
            : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-gray-50 dark:hover:bg-gray-800/30'
        }`}
      >
        <input
          type="file"
          accept="audio/*"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />
        
        <div className="space-y-4">
          {isProcessing ? (
            <>
              <div className="relative">
                <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-purple-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Processing audio files...</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This may take a moment</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-2">
                {isDragOver ? (
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <Music className="w-10 h-10 text-white animate-bounce" />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200">
                    <Upload className="w-10 h-10 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  {isDragOver ? 'Drop your music files here' : 'Upload Music Files'}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Drag & drop audio files or click to browse
                </p>
                <div className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                  Supports MP3, WAV, OGG, M4A and other audio formats
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}