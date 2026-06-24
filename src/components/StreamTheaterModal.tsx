import React, { useState, useEffect, useRef } from "react";
import { X, Users, MessageSquare, Send, Volume2, VolumeX, Play, Pause, Maximize, Heart, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LiveStream, VideoSearchResult } from "../types";

interface StreamTheaterModalProps {
  stream: LiveStream | null;
  onClose: () => void;
  favorites: string[];
  toggleFavorite: (channelId: string) => void;
  subscribedChannels: string[];
  toggleSubscribe: (channelId: string) => void;
}

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  color: string;
  isSuperchat?: boolean;
  superchatAmount?: string;
  avatarSeed?: number;
}

// Sample usernames for our rolling chat
const MOCK_USERNAMES = [
  "PekoFan_99",
  "Shrimp_3000",
  "StarGazer_Suisei",
  "Kroniichiwa",
  "Marine_Husband_46",
  "Calli_Deadbeat",
  "Takodachi_Ina",
  "Gura_Bait",
  "Kobo_Watermelon",
  "Baetastic",
  "HololiveEnthusiast",
  "Sora_Symphony",
  "Miko_Elite_Elite"
];

// Sample messages based on VTubers
const MOCK_MESSAGES = [
  "IKZ!!!!!!!!!!! 🎉🎉",
  "LET'S GOOOOOOOOOO!!!",
  "Suisei is literally a singing goddess ☄️✨",
  "GURA ACCENT IS SO CUTE HELP 😍",
  "HA-HA-HA-HA PEKO PEKO PEKO",
  "Ahoy!!!!! 🏴‍☠️🏴‍☠️",
  "This stream is exactly what I needed today, thank you!",
  "poggers in the chat boys!",
  "WAH! WAH! WAH!",
  "Wait, what is happening?? lol",
  "This BG music is absolute fire 🔥🔥🔥",
  "R.I.P ears, she screamed so loud haha",
  "Unbelievable gaming skills right here!",
  "My Oshi is the best!",
  "Is the stream lagging or is it just my internet?",
  "sasuga leader!!",
  "T-Spin double setup was incredible!",
  "Guuuuraaaaa can we get an album please? 💙"
];

// Chat colors
const HANDLE_COLORS = [
  "text-cyan-400",
  "text-pink-400",
  "text-emerald-400",
  "text-purple-400",
  "text-yellow-400",
  "text-sky-400",
  "text-rose-400",
  "text-orange-400",
  "text-blue-400"
];

const SUPERCHAT_TIERS = [
  { amount: "$5.00", color: "bg-sky-600/30 border-sky-500 text-sky-200" },
  { amount: "$10.00", color: "bg-emerald-600/30 border-emerald-500 text-emerald-200" },
  { amount: "$50.00", color: "bg-amber-600/30 border-amber-500 text-amber-200" },
  { amount: "$100.00", color: "bg-rose-600/30 border-rose-500 text-rose-200" }
];

export default function StreamTheaterModal({
  stream,
  onClose,
  favorites,
  toggleFavorite,
  subscribedChannels,
  toggleSubscribe,
}: StreamTheaterModalProps) {
  if (!stream) return null;

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [playProgress, setPlayProgress] = useState(35); // Initial percentage
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userChatInput, setUserChatInput] = useState("");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const isFav = favorites.includes(stream.channelId);
  const isSubscribed = subscribedChannels.includes(stream.channelId);

  // Initialize with some comments
  useEffect(() => {
    const initialChats: ChatMessage[] = [];
    for (let i = 0; i < 15; i++) {
      initialChats.push(generateRandomMessage());
    }
    setChatMessages(initialChats);
  }, [stream]);

  // Handle auto-scroll of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Simulate incoming live chat messages
  useEffect(() => {
    const interval = setInterval(() => {
      setChatMessages((prev) => {
        // Limit total chat list size to 80 messages for performance
        const list = prev.length > 80 ? prev.slice(prev.length - 60) : prev;
        return [...list, generateRandomMessage()];
      });
    }, 1500 + Math.random() * 2000); // random interval

    return () => clearInterval(interval);
  }, []);

  // Simulate progress bar movement if playing
  useEffect(() => {
    let playInterval: NodeJS.Timeout;
    if (isPlaying) {
      playInterval = setInterval(() => {
        setPlayProgress((prev) => (prev >= 100 ? 0 : prev + 0.1));
      }, 1000);
    }
    return () => clearInterval(playInterval);
  }, [isPlaying]);

  const generateRandomMessage = (): ChatMessage => {
    const username = MOCK_USERNAMES[Math.floor(Math.random() * MOCK_USERNAMES.length)];
    const message = MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)];
    const color = HANDLE_COLORS[Math.floor(Math.random() * HANDLE_COLORS.length)];
    const isSuperchat = Math.random() > 0.88; // 12% chance for superchat

    let superchatAmount = "";
    if (isSuperchat) {
      superchatAmount = SUPERCHAT_TIERS[Math.floor(Math.random() * SUPERCHAT_TIERS.length)].amount;
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      username,
      message,
      color,
      isSuperchat,
      superchatAmount,
      avatarSeed: Math.floor(Math.random() * 100)
    };
  };

  const handleSendUserChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim()) return;

    const newChat: ChatMessage = {
      id: "user_msg_" + Date.now(),
      username: "You (HoloFan)",
      message: userChatInput.trim(),
      color: "text-brand-coral font-bold",
    };

    setChatMessages((prev) => [...prev, newChat]);
    setUserChatInput("");
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3 }}
        className="bg-brand-bg border border-[#232333] rounded-2xl w-full max-w-6xl overflow-hidden flex flex-col h-[90vh] md:h-[82vh] lg:h-[85vh] relative"
      >
        {/* Modal Top Header Bar */}
        <div className="bg-brand-card px-6 py-4 border-b border-[#232333] flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            {stream.viewerCount > 0 ? (
              <span className="flex items-center gap-1.5 bg-brand-coral/10 text-brand-coral border border-brand-coral/20 px-2.5 py-0.5 rounded text-xs font-mono font-bold animate-pulse">
                🔴 LIVE THEATER
              </span>
            ) : (
              <span className="flex items-center gap-1.5 bg-brand-purple/10 text-brand-purple border border-brand-purple/20 px-2.5 py-0.5 rounded text-xs font-mono font-bold">
                🎬 STREAM REPLAY
              </span>
            )}
            <p className="text-xs text-gray-400 hidden sm:block truncate max-w-md">
              Watching: {stream.title}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 hover:bg-[#20202d] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split Screen layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Side: Video Player & Stream Details */}
          <div className="flex-1 flex flex-col bg-[#08080c] overflow-y-auto custom-scrollbar">
            {/* Mock Player Screen */}
            <div className="relative aspect-video bg-black w-full flex-shrink-0 group overflow-hidden">
              <img
                src={stream.thumbnail}
                alt={stream.title}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-all duration-300 ${
                  isPlaying ? "brightness-[0.95]" : "brightness-50 filter blur-sm"
                }`}
              />

              {/* Streaming Pulsing Sine Waves or Equalizer simulation when playing */}
              {isPlaying && (
                <div className="absolute top-4 right-4 flex items-end gap-1 h-6">
                  <div className="w-1 bg-brand-coral rounded-full animate-[bounce_0.8s_infinite] h-4" />
                  <div className="w-1 bg-brand-coral rounded-full animate-[bounce_1.1s_infinite_0.2s] h-6" />
                  <div className="w-1 bg-brand-coral rounded-full animate-[bounce_0.9s_infinite_0.4s] h-3" />
                  <div className="w-1 bg-brand-coral rounded-full animate-[bounce_1.3s_infinite_0.1s] h-5" />
                </div>
              )}

              {/* Playback Intermission overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="w-16 h-16 rounded-full bg-brand-purple hover:bg-brand-purple-hover text-white flex items-center justify-center shadow-lg transform transition-transform hover:scale-105"
                  >
                    <Play className="w-8 h-8 fill-white ml-1.5" />
                  </button>
                </div>
              )}

              {/* Bottom Custom Playback Bar Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-3">
                {/* Progress bar line */}
                <div className="w-full bg-gray-700/60 h-1.5 rounded-full overflow-hidden cursor-pointer relative">
                  <div
                    className="bg-brand-coral h-full rounded-full relative"
                    style={{ width: `${playProgress}%` }}
                  />
                </div>

                {/* Controls line */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-white hover:text-brand-coral transition-colors"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>

                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white hover:text-brand-purple transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>

                    <span className="text-xs text-gray-300 font-mono font-medium">
                      {stream.viewerCount > 0 ? "LIVE" : "15:24 / 45:30"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {stream.viewerCount > 0 && (
                      <div className="flex items-center gap-1 bg-brand-coral px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase">
                        {stream.viewerCount.toLocaleString()} Viewers
                      </div>
                    )}
                    <button className="text-white hover:text-brand-coral transition-colors">
                      <Maximize className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stream Detail Meta Descriptions */}
            <div className="p-6">
              <h2 className="text-lg font-display font-semibold text-white leading-snug mb-4">
                {stream.title}
              </h2>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-brand-card border border-[#232333]">
                <div className="flex items-center gap-3">
                  <img
                    src={stream.avatar}
                    alt={stream.channelName}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-purple/40"
                  />
                  <div>
                    <h3 className="font-sans font-bold text-sm text-white">
                      {stream.channelName}
                    </h3>
                    <p className="text-xs text-gray-400 font-sans">
                      Topic: <span className="text-brand-purple font-semibold">{stream.topic}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {/* Favorite Toggle */}
                  <button
                    onClick={() => toggleFavorite(stream.channelId)}
                    className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                      isFav
                        ? "bg-brand-coral/10 border-brand-coral/30 text-brand-coral"
                        : "bg-[#0f0f14] border-[#232333] text-gray-400 hover:text-white"
                    }`}
                  >
                    <Heart className={`w-4.5 h-4.5 ${isFav ? "fill-brand-coral" : ""}`} />
                  </button>

                  {/* Subscribe button */}
                  <button
                    onClick={() => toggleSubscribe(stream.channelId)}
                    className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                      isSubscribed
                        ? "bg-[#252535] text-gray-300 border border-gray-700"
                        : "bg-brand-purple hover:bg-brand-purple-hover text-white shadow-lg shadow-brand-purple/20"
                    }`}
                  >
                    {isSubscribed ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Subscribed</span>
                      </>
                    ) : (
                      <>
                        <span>Subscribe</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Holo Live Chat simulation */}
          <div className="w-full lg:w-80 bg-brand-card border-t lg:border-t-0 lg:border-l border-[#232333] flex flex-col justify-between h-[340px] lg:h-auto overflow-hidden">
            {/* Chat header panel */}
            <div className="px-4 py-3 bg-[#13131a] border-b border-[#232333] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-brand-purple" />
                <span className="text-xs font-bold text-white uppercase tracking-wider font-sans">
                  Holo Chat Room
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 font-mono text-[10px]">
                <Users className="w-3.5 h-3.5 text-brand-coral" />
                <span>{stream.viewerCount > 0 ? "LIVE" : "ARCHIVE"}</span>
              </div>
            </div>

            {/* Chat list scrolling messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="text-xs font-sans">
                  {msg.isSuperchat ? (
                    /* Super Chat Block */
                    <div className={`p-2 rounded-lg border my-1.5 text-left ${msg.color} ${
                      msg.superchatAmount === "$100.00"
                        ? "bg-rose-500/10 border-rose-500/30 text-rose-200"
                        : msg.superchatAmount === "$50.00"
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                        : "bg-sky-500/10 border-sky-500/30 text-sky-200"
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold font-mono text-[10px] uppercase tracking-wider">
                          ★ Super Chat {msg.superchatAmount}
                        </span>
                        <span className="font-bold font-mono">{msg.superchatAmount}</span>
                      </div>
                      <p className="font-medium text-gray-200">{msg.username}</p>
                      <p className="text-white font-medium mt-0.5">{msg.message}</p>
                    </div>
                  ) : (
                    /* Normal Chat message line */
                    <div className="flex items-start gap-2 leading-relaxed">
                      {/* Circle fallback seed avatar color */}
                      <div className="w-5 h-5 rounded-full bg-brand-purple/20 text-brand-purple text-[8px] flex items-center justify-center shrink-0 uppercase font-mono font-bold">
                        {msg.username.substring(0, 2)}
                      </div>
                      <div>
                        <span className={`font-semibold mr-1.5 ${msg.color}`}>
                          {msg.username}:
                        </span>
                        <span className="text-gray-200">{msg.message}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Send user input box */}
            <form
              onSubmit={handleSendUserChat}
              className="p-3 bg-[#13131a] border-t border-[#232333] flex items-center gap-2"
            >
              <input
                type="text"
                value={userChatInput}
                onChange={(e) => setUserChatInput(e.target.value)}
                placeholder="Send a message peko..."
                maxLength={150}
                className="flex-1 bg-[#0f0f14] border border-[#232333] focus:border-brand-purple rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none font-sans"
              />
              <button
                type="submit"
                className="p-2 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-lg transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
