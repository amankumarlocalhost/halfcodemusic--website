"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { loadYouTubeApi } from "@/lib/loadYouTubeApi";

const PlayerContext = createContext(null);

const HIDDEN_PLAYER_ID = "hcm-youtube-engine";

/**
 * Global playback engine. Renders one hidden YouTube IFrame Player that
 * every "Play" button across the site controls — persistent playback while
 * navigating, without loading the API or any video until first interaction.
 */
export function PlayerProvider({ children }) {
  const [track, setTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(80);

  const playerRef = useRef(null);
  const pollRef = useRef(null);
  const pendingTrackRef = useRef(null);

  const clearPoll = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const startPoll = useCallback(() => {
    clearPoll();
    pollRef.current = setInterval(() => {
      const p = playerRef.current;
      if (!p?.getCurrentTime) return;
      setCurrentTime(p.getCurrentTime() || 0);
      const d = p.getDuration ? p.getDuration() : 0;
      if (d) setDuration(d);
    }, 500);
  }, [clearPoll]);

  const ensurePlayer = useCallback(async () => {
    if (playerRef.current) return playerRef.current;
    const YT = await loadYouTubeApi();
    if (!YT) return null;

    return new Promise((resolve) => {
      const instance = new YT.Player(HIDDEN_PLAYER_ID, {
        height: "0",
        width: "0",
        playerVars: { playsinline: 1, controls: 0, disablekb: 1 },
        events: {
          onReady: () => {
            instance.setVolume(volume);
            playerRef.current = instance;
            resolve(instance);
          },
          onStateChange: (e) => {
            // 1 = playing, 2 = paused, 0 = ended, 3 = buffering
            setIsBuffering(e.data === 3);
            if (e.data === 1) {
              setIsPlaying(true);
              startPoll();
            }
            if (e.data === 2) {
              setIsPlaying(false);
              clearPoll();
            }
            if (e.data === 0) {
              setIsPlaying(false);
              clearPoll();
              setCurrentTime(0);
            }
          },
        },
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startPoll, clearPoll]);

  const play = useCallback(
    async (nextTrack, nextQueue = []) => {
      if (!nextTrack?.youtubeId) return;
      setQueue(nextQueue);

      if (track?.slug === nextTrack.slug && playerRef.current) {
        playerRef.current.playVideo();
        return;
      }

      setTrack(nextTrack);
      setDuration(0);
      setCurrentTime(0);
      pendingTrackRef.current = nextTrack.youtubeId;
      setIsBuffering(true);

      const player = await ensurePlayer();
      if (!player || pendingTrackRef.current !== nextTrack.youtubeId) return;
      player.loadVideoById(nextTrack.youtubeId);
      player.setVolume(volume);
    },
    [ensurePlayer, track, volume]
  );

  const toggle = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    isPlaying ? p.pauseVideo() : p.playVideo();
  }, [isPlaying]);

  const seekTo = useCallback((fraction) => {
    const p = playerRef.current;
    if (!p || !duration) return;
    const time = fraction * duration;
    p.seekTo(time, true);
    setCurrentTime(time);
  }, [duration]);

  const setVolume = useCallback((v) => {
    setVolumeState(v);
    playerRef.current?.setVolume(v);
  }, []);

  const step = useCallback(
    (direction) => {
      if (!queue.length || !track) return;
      const i = queue.findIndex((t) => t.slug === track.slug);
      if (i === -1) return;
      const next = queue[(i + direction + queue.length) % queue.length];
      play(next, queue);
    },
    [queue, track, play]
  );

  useEffect(() => clearPoll, [clearPoll]);

  const value = useMemo(
    () => ({
      track,
      isPlaying,
      isBuffering,
      currentTime,
      duration,
      volume,
      hasQueue: queue.length > 1,
      play,
      toggle,
      seekTo,
      setVolume,
      next: () => step(1),
      prev: () => step(-1),
    }),
    [track, isPlaying, isBuffering, currentTime, duration, volume, queue, play, toggle, seekTo, setVolume, step]
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <div id={HIDDEN_PLAYER_ID} className="pointer-events-none fixed -bottom-2 -left-2 h-0 w-0 opacity-0" aria-hidden />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
