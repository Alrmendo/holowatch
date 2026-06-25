import React, { useState, useEffect } from "react";
import { X, Youtube, Twitter, Tv2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  HolodexChannel,
  HolodexVideo,
  getChannelById,
  getChannelCollabs,
  getChannelVideos,
} from "../services/holodex";
import { formatCount, formatDuration, formatRelativeTime } from "../utils/holodexMappers";

interface ChannelModalProps {
  channelId: string | null;
  apiKey: string;
  onClose: () => void;
  onStreamClick: (stream: HolodexVideo) => void;
}

type TabKey = "VIDEOS" | "CLIPS" | "COLLABS" | "ABOUT";

const TABS: { key: TabKey; label: string }[] = [
  { key: "VIDEOS", label: "Videos" },
  { key: "CLIPS", label: "Clips" },
  { key: "COLLABS", label: "Collabs" },
  { key: "ABOUT", label: "About" },
];

// ——— Sub-components ———

const VideoCard: React.FC<{ video: HolodexVideo; onClick: () => void }> = ({
  video,
  onClick,
}) => (
  <button onClick={onClick} className="group text-left w-full cursor-pointer">
    <div className="relative rounded-xl overflow-hidden bg-[#13131a] mb-2 aspect-video">
      <img
        src={`https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
        alt={video.title}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      {video.duration != null && (
        <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
          {formatDuration(video.duration)}
        </span>
      )}
    </div>
    <p className="text-xs text-gray-200 font-sans font-medium leading-snug line-clamp-2 mb-1 group-hover:text-white transition-colors">
      {video.title}
    </p>
    <p className="text-[10px] text-gray-500 font-mono">
      {formatRelativeTime(video.available_at)}
    </p>
  </button>
);

const SkeletonCard: React.FC = () => (
  <div className="animate-pulse">
    <div className="aspect-video bg-brand-card rounded-xl mb-2" />
    <div className="h-3 bg-brand-card rounded w-full mb-1.5" />
    <div className="h-3 bg-brand-card rounded w-4/5 mb-1" />
    <div className="h-2 bg-brand-card rounded w-1/3" />
  </div>
);

const VideoGrid: React.FC<{
  videos: HolodexVideo[];
  loading: boolean;
  error: string | null;
  onVideoClick: (v: HolodexVideo) => void;
}> = ({ videos, loading, error, onVideoClick }) => {
  if (error) {
    return (
      <div className="flex items-center justify-center py-16 text-brand-coral text-sm font-sans">
        {error}
      </div>
    );
  }
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }
  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500 text-sm font-sans">
        No videos found.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {videos.map((v) => (
        <VideoCard key={v.id} video={v} onClick={() => onVideoClick(v)} />
      ))}
    </div>
  );
};

// ——— Main component ———

export default function ChannelModal({
  channelId,
  onClose,
  onStreamClick,
}: ChannelModalProps) {
  const [channel, setChannel] = useState<HolodexChannel | null>(null);
  const [channelLoading, setChannelLoading] = useState(false);
  const [channelError, setChannelError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabKey>("VIDEOS");

  const [videos, setVideos] = useState<HolodexVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [videosError, setVideosError] = useState<string | null>(null);
  const [videosFetched, setVideosFetched] = useState(false);

  const [clips, setClips] = useState<HolodexVideo[]>([]);
  const [clipsLoading, setClipsLoading] = useState(false);
  const [clipsError, setClipsError] = useState<string | null>(null);
  const [clipsFetched, setClipsFetched] = useState(false);

  const [collabs, setCollabs] = useState<HolodexVideo[]>([]);
  const [collabsLoading, setCollabsLoading] = useState(false);
  const [collabsError, setCollabsError] = useState<string | null>(null);
  const [collabsFetched, setCollabsFetched] = useState(false);

  // Reset all state and fetch channel info when channelId changes
  useEffect(() => {
    if (!channelId) return;

    setChannel(null);
    setChannelLoading(true);
    setChannelError(null);
    setActiveTab("VIDEOS");
    setVideos([]);
    setClips([]);
    setCollabs([]);
    setVideosFetched(false);
    setClipsFetched(false);
    setCollabsFetched(false);
    setVideosError(null);
    setClipsError(null);
    setCollabsError(null);
    setVideosLoading(false);
    setClipsLoading(false);
    setCollabsLoading(false);

    let cancelled = false;
    getChannelById(channelId)
      .then((data) => {
        if (!cancelled) {
          setChannel(data);
          setChannelLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setChannelError(err instanceof Error ? err.message : "Failed to load channel");
          setChannelLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [channelId]);

  // Lazy-fetch VIDEOS on first visit to that tab
  useEffect(() => {
    if (!channelId || activeTab !== "VIDEOS" || videosFetched) return;
    let cancelled = false;
    setVideosLoading(true);
    getChannelVideos(channelId, { type: "stream", status: "past", limit: 24 })
      .then((data) => {
        if (!cancelled) {
          setVideos(data);
          setVideosFetched(true);
          setVideosLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setVideosError(err instanceof Error ? err.message : "Failed to load videos");
          setVideosFetched(true);
          setVideosLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [channelId, activeTab, videosFetched]);

  // Lazy-fetch CLIPS
  useEffect(() => {
    if (!channelId || activeTab !== "CLIPS" || clipsFetched) return;
    let cancelled = false;
    setClipsLoading(true);
    getChannelVideos(channelId, { type: "clip", limit: 24 })
      .then((data) => {
        if (!cancelled) {
          setClips(data);
          setClipsFetched(true);
          setClipsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setClipsError(err instanceof Error ? err.message : "Failed to load clips");
          setClipsFetched(true);
          setClipsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [channelId, activeTab, clipsFetched]);

  // Lazy-fetch COLLABS
  useEffect(() => {
    if (!channelId || activeTab !== "COLLABS" || collabsFetched) return;
    let cancelled = false;
    setCollabsLoading(true);
    getChannelCollabs(channelId, 24)
      .then((data) => {
        if (!cancelled) {
          setCollabs(data);
          setCollabsFetched(true);
          setCollabsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setCollabsError(err instanceof Error ? err.message : "Failed to load collabs");
          setCollabsFetched(true);
          setCollabsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [channelId, activeTab, collabsFetched]);

  // Derived display values
  const displayName = channel ? (channel.english_name || channel.name) : "";
  const nativeName =
    channel?.english_name && channel.english_name !== channel.name
      ? channel.name
      : null;
  const orgLabel = channel
    ? [channel.org, channel.suborg].filter(Boolean).join(" / ")
    : "";
  const bannerSrc = channel?.banner
    ? channel.banner.startsWith("http")
      ? channel.banner
      : `https://yt3.googleusercontent.com/${channel.banner}`
    : null;
  const avatarInitial = displayName.charAt(0).toUpperCase() || "?";

  return (
    <AnimatePresence>
      {channelId && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 overflow-y-auto custom-scrollbar"
          onClick={onClose}
        >
          <div className="flex justify-center min-h-full py-8 px-4">
            <motion.div
              key={channelId}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
              className="bg-brand-bg border border-[#232333] rounded-2xl w-full max-w-5xl overflow-hidden self-start"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ——— Banner + Avatar ——— */}
              <div className="relative">
                <div className="h-48 bg-brand-card overflow-hidden">
                  {bannerSrc && (
                    <img
                      src={bannerSrc}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  )}
                  {/* contrast overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/70 to-transparent pointer-events-none" />
                </div>

                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-xl transition-colors cursor-pointer z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Avatar overlapping the banner bottom */}
                <div className="absolute left-6 -bottom-10 z-10">
                  {channel?.photo ? (
                    <img
                      src={channel.photo}
                      alt={displayName}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-full border-4 border-brand-bg object-cover ring-2 ring-brand-purple/30"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full border-4 border-brand-bg bg-brand-purple flex items-center justify-center text-white text-2xl font-display font-bold ring-2 ring-brand-purple/30">
                      {!channelLoading && avatarInitial}
                    </div>
                  )}
                </div>
              </div>

              {/* ——— Channel info ——— */}
              <div className="pt-14 px-6 pb-5 border-b border-[#232333]">
                {channelLoading ? (
                  <div className="animate-pulse space-y-2.5">
                    <div className="h-7 bg-brand-card rounded w-52" />
                    <div className="h-4 bg-brand-card rounded w-80" />
                    <div className="h-4 bg-brand-card rounded w-44" />
                    <div className="flex gap-2 pt-2">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="h-7 bg-brand-card rounded-lg w-24" />
                      ))}
                    </div>
                  </div>
                ) : channelError ? (
                  <p className="text-brand-coral text-sm font-sans">{channelError}</p>
                ) : channel ? (
                  <>
                    <h1 className="text-2xl font-display font-bold text-white leading-tight">
                      {displayName}
                    </h1>
                    {nativeName && (
                      <p className="text-sm text-gray-400 font-sans mt-0.5">{nativeName}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2">
                      {orgLabel && (
                        <span className="text-sm text-brand-purple font-sans font-semibold">
                          {orgLabel}
                        </span>
                      )}
                      {channel.subscriber_count && (
                        <>
                          {orgLabel && <span className="text-gray-600 text-sm">·</span>}
                          <span className="text-sm text-gray-400 font-mono">
                            {formatCount(channel.subscriber_count)} subscribers
                          </span>
                        </>
                      )}
                    </div>

                    {/* Social links */}
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      <a
                        href={`https://www.youtube.com/channel/${channel.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-card border border-[#232333] text-gray-400 hover:text-white hover:border-red-500/40 transition-colors text-xs font-sans"
                      >
                        <Youtube className="w-3.5 h-3.5 text-red-500" />
                        YouTube
                      </a>
                      {channel.twitter && (
                        <a
                          href={`https://twitter.com/${channel.twitter}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-card border border-[#232333] text-gray-400 hover:text-white hover:border-sky-400/40 transition-colors text-xs font-sans"
                        >
                          <Twitter className="w-3.5 h-3.5 text-sky-400" />
                          @{channel.twitter}
                        </a>
                      )}
                      {channel.twitch && (
                        <a
                          href={`https://www.twitch.tv/${channel.twitch}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-card border border-[#232333] text-gray-400 hover:text-white hover:border-purple-400/40 transition-colors text-xs font-sans"
                        >
                          <Tv2 className="w-3.5 h-3.5 text-purple-400" />
                          {channel.twitch}
                        </a>
                      )}
                    </div>
                  </>
                ) : null}
              </div>

              {/* ——— Tabs bar (sticky within the scroll container) ——— */}
              <div className="sticky top-0 z-10 bg-brand-card border-b border-[#232333]">
                <div className="flex">
                  {TABS.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-widest font-sans transition-colors cursor-pointer border-b-2 ${
                        activeTab === key
                          ? "text-white border-brand-purple"
                          : "text-gray-500 border-transparent hover:text-gray-300"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ——— Tab content ——— */}
              <div className="p-6">
                {activeTab === "VIDEOS" && (
                  <VideoGrid
                    videos={videos}
                    loading={videosLoading}
                    error={videosError}
                    onVideoClick={onStreamClick}
                  />
                )}

                {activeTab === "CLIPS" && (
                  <VideoGrid
                    videos={clips}
                    loading={clipsLoading}
                    error={clipsError}
                    onVideoClick={onStreamClick}
                  />
                )}

                {activeTab === "COLLABS" && (
                  <VideoGrid
                    videos={collabs}
                    loading={collabsLoading}
                    error={collabsError}
                    onVideoClick={onStreamClick}
                  />
                )}

                {activeTab === "ABOUT" && (
                  <div className="max-w-2xl">
                    {channelLoading ? (
                      <div className="animate-pulse space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          {[0, 1, 2].map((i) => (
                            <div key={i} className="h-20 bg-brand-card rounded-xl" />
                          ))}
                        </div>
                        <div className="h-20 bg-brand-card rounded-xl" />
                        <div className="space-y-2">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="h-4 bg-brand-card rounded"
                              style={{ width: `${90 - i * 15}%` }}
                            />
                          ))}
                        </div>
                      </div>
                    ) : channelError ? (
                      <p className="text-brand-coral text-sm font-sans">{channelError}</p>
                    ) : channel ? (
                      <div className="space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-brand-card rounded-xl p-4 text-center border border-[#232333]">
                            <p className="text-xl font-display font-bold text-white">
                              {formatCount(channel.view_count)}
                            </p>
                            <p className="text-[11px] text-gray-400 font-sans mt-1">
                              Total Views
                            </p>
                          </div>
                          <div className="bg-brand-card rounded-xl p-4 text-center border border-[#232333]">
                            <p className="text-xl font-display font-bold text-white">
                              {formatCount(channel.video_count)}
                            </p>
                            <p className="text-[11px] text-gray-400 font-sans mt-1">Videos</p>
                          </div>
                          <div className="bg-brand-card rounded-xl p-4 text-center border border-[#232333]">
                            <p className="text-xl font-display font-bold text-white">
                              {formatCount(channel.subscriber_count)}
                            </p>
                            <p className="text-[11px] text-gray-400 font-sans mt-1">
                              Subscribers
                            </p>
                          </div>
                        </div>

                        {/* Org / Subgroup */}
                        {(channel.org || channel.suborg) && (
                          <div className="bg-brand-card rounded-xl p-4 border border-[#232333]">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-sans mb-3">
                              Organization
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {channel.org && (
                                <span className="px-3 py-1 bg-brand-purple/10 text-brand-purple border border-brand-purple/20 rounded-full text-xs font-sans font-semibold">
                                  {channel.org}
                                </span>
                              )}
                              {channel.suborg && (
                                <span className="px-3 py-1 bg-[#0f0f14] text-gray-300 border border-[#232333] rounded-full text-xs font-sans">
                                  {channel.suborg}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Description */}
                        {channel.description && (
                          <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-sans mb-3">
                              About
                            </p>
                            <p className="text-sm text-gray-300 font-sans leading-relaxed whitespace-pre-line">
                              {channel.description}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
