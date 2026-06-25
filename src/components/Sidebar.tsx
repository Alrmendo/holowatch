import { useState, useEffect, useRef } from "react";
import { Radio, Calendar, Search, Users, X } from "lucide-react";
import { motion } from "motion/react";
import { formatCount } from "../utils/holodexMappers";

interface ChannelResult {
  id: string;
  name: string;
  english_name?: string;
  org?: string;
  photo?: string;
  subscriber_count?: string;
}

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  liveCount?: number;
  apiKey: string;
  onChannelSelect: (channelId: string) => void;
}

export default function Sidebar({
  activeSection,
  setActiveSection,
  liveCount,
  apiKey,
  onChannelSelect,
}: SidebarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ChannelResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const searchWrapperRef = useRef<HTMLDivElement>(null);

  const showDropdown = dropdownOpen && query.trim().length >= 2;

  // Debounced channel search
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://holodex.net/api/v2/channels?org=Hololive&type=vtuber&limit=8&name=${encodeURIComponent(trimmed)}`,
          { headers: { "X-APIKEY": apiKey } }
        );
        if (!res.ok) throw new Error("fetch failed");
        const data: ChannelResult[] = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, apiKey]);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleSelect = (channelId: string) => {
    onChannelSelect(channelId);
    setQuery("");
    setResults([]);
    setDropdownOpen(false);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setDropdownOpen(false);
  };

  const menuItems = [
    { id: "live", label: "Live Now", icon: Radio, count: liveCount ? String(liveCount) : undefined },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "channels", label: "Spotlight", icon: Users },
    { id: "search", label: "Search", icon: Search },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <aside className="w-64 bg-brand-bg border-r border-[#1a1a24] h-screen flex flex-col justify-between fixed left-0 top-0 z-30 hidden md:flex">
      {/* Brand Header */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-coral flex items-center justify-center shadow-lg shadow-brand-coral/20">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-white tracking-wider flex items-center gap-2">
              HoloWatch
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-coral opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-coral"></span>
              </span>
            </h1>
            <p className="text-xs text-gray-400 font-sans mt-0.5">VTuber Hub</p>
          </div>
        </div>
      </div>

      {/* Navigation + Search */}
      <div className="px-4 py-2 flex-1 overflow-hidden flex flex-col">
        {/* Channel search */}
        <div className="mb-5" ref={searchWrapperRef}>
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-1 mb-3 font-mono">
            Search
          </p>
          <div className="relative">
            {/* Input row */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setDropdownOpen(true);
                }}
                onFocus={() => setDropdownOpen(true)}
                placeholder="Search talent..."
                className="w-full bg-[#1a1a24] border border-[#2a2a3a] text-white text-sm rounded-lg pl-9 pr-8 py-2.5 placeholder:text-gray-500 outline-none focus:border-[#7c5cbf] transition-colors font-sans"
              />
              {query && (
                <button
                  onClick={handleClear}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Results dropdown */}
            {showDropdown && (
              <div className="absolute top-full mt-1.5 left-0 right-0 z-50 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg shadow-lg overflow-hidden">
                {loading ? (
                  <div className="p-2 space-y-1">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="flex items-center gap-2.5 px-2 py-2 animate-pulse">
                        <div className="w-8 h-8 rounded-full bg-[#2a2a3a] shrink-0" />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-3 bg-[#2a2a3a] rounded w-3/4" />
                          <div className="h-2.5 bg-[#2a2a3a] rounded w-1/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : results.length === 0 ? (
                  <div className="py-6 text-center text-gray-500 text-xs font-sans">
                    No talents found
                  </div>
                ) : (
                  <div className="py-1 max-h-72 overflow-y-auto custom-scrollbar">
                    {results.map((ch) => (
                      <button
                        key={ch.id}
                        onClick={() => handleSelect(ch.id)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#2a2a3a] transition-colors text-left cursor-pointer"
                      >
                        {ch.photo ? (
                          <img
                            src={ch.photo}
                            alt={ch.english_name || ch.name}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#7c5cbf] flex items-center justify-center text-white text-xs font-bold font-display shrink-0">
                            {(ch.english_name || ch.name).charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-sans truncate">
                            {ch.english_name || ch.name}
                          </p>
                          {ch.subscriber_count && (
                            <p className="text-[10px] text-gray-500 font-mono">
                              {formatCount(ch.subscriber_count)}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation links */}
        <div>
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-3 mb-4 font-mono">
            Navigation
          </p>
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-left group relative ${
                    isActive
                      ? "bg-[#7c5cbf]/20 text-[#7c5cbf] font-semibold"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-3 bottom-3 w-1 bg-brand-coral rounded-r-md"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  <div className="flex items-center gap-3">
                    <IconComponent
                      className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                        isActive ? "text-[#7c5cbf]" : "text-gray-400 group-hover:text-brand-purple"
                      }`}
                    />
                    <span className="font-sans text-sm">{item.label}</span>
                  </div>

                  {item.count && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-brand-coral/10 text-brand-coral border border-brand-coral/20">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Stats Card */}
      <div className="p-4 mx-4 mb-6 rounded-xl bg-[#1a1a24] border border-white/5">
        <p className="text-xs text-gray-500 uppercase font-bold mb-2.5 font-mono tracking-wider">
          User Stats
        </p>
        <div className="space-y-2 text-xs font-sans">
          <div className="flex justify-between items-center text-gray-400">
            <span>Watch Time</span>
            <span className="text-[#7c5cbf] font-bold font-mono">128h</span>
          </div>
          <div className="flex justify-between items-center text-gray-400">
            <span>Favorites</span>
            <span className="text-brand-coral font-bold font-mono">Suisei, Gura</span>
          </div>
          <div className="flex justify-between items-center text-gray-400">
            <span>Status</span>
            <span className="text-emerald-400 font-bold">Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
