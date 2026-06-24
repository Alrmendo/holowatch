import { Channel, LiveStream, ScheduleItem, VideoSearchResult } from "./types";

// Realistic Hololive Channels Data
export const channels: Channel[] = [
  {
    id: "gura",
    channelName: "Gawr Gura Ch. hololive-EN",
    englishName: "Gawr Gura",
    avatar: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=150&auto=format&fit=crop&q=80", // cute gaming/blue vibe
    banner: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=1200&auto=format&fit=crop&q=80", // beautiful blue sea waves
    subscribers: "4.43M",
    videoCount: 412,
    org: "Hololive English -Myth-",
    twitter: "@gawrgura",
    bio: "A descendant of the Lost City of Atlantis, who swam to Earth while saying, 'It's so boring down there lolol!' Gura brought her favorite clothes (and her shark hat) with her, and she loves gaming, music, and sharks!"
  },
  {
    id: "suisei",
    channelName: "Suisei Channel",
    englishName: "Hoshimachi Suisei",
    avatar: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80", // celestial starry space vibe
    banner: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1200&auto=format&fit=crop&q=80", // purple starry sky
    subscribers: "2.12M",
    videoCount: 520,
    org: "Hololive Japan -Gen 0-",
    twitter: "@suisei_hosimati",
    bio: "A forever-18 VTuber who loves singing and stellar performances. Suisei is incredibly passionate about music, tetris, and is known for her beautiful vocals and occasional psychopathic tendencies in games!"
  },
  {
    id: "marine",
    channelName: "Marine Ch. 宝鐘マリン",
    englishName: "Houshou Marine",
    avatar: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&auto=format&fit=crop&q=80", // crimson artistic watercolor
    banner: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200&auto=format&fit=crop&q=80", // deep red dramatic library/study
    subscribers: "3.24M",
    videoCount: 840,
    org: "Hololive Japan -3rd Gen-",
    twitter: "@houshoumarine",
    bio: "Ahoy! Houshou Pirate Captain Marine here! Her dream is to buy a pirate ship and sail the seas, but for now she's streaming on land. Marine is highly energetic, creative, and loves retro games, illustration, and talking!"
  },
  {
    id: "calliope",
    channelName: "Mori Calliope Ch. hololive-EN",
    englishName: "Mori Calliope",
    avatar: "https://images.unsplash.com/photo-1563089145-599997674d42?w=150&auto=format&fit=crop&q=80", // pink/dark synthwave neon
    banner: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&auto=format&fit=crop&q=80", // sleek red-black dark grid
    subscribers: "2.35M",
    videoCount: 650,
    org: "Hololive English -Myth-",
    twitter: "@moricalliope",
    bio: "The Grim Reaper's first apprentice. Due to modern medical advancements, reaper business has been slow, so she decided to become a VTuber/rapper. Calli is a powerhouse of hip hop, writing her own hard-hitting tracks!"
  },
  {
    id: "pekora",
    channelName: "Pekora Ch. 兎田ぺこら",
    englishName: "Usada Pekora",
    avatar: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=150&auto=format&fit=crop&q=80", // playful sky blue/white
    banner: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80", // playful warm sky pastel
    subscribers: "2.56M",
    videoCount: 1120,
    org: "Hololive Japan -3rd Gen-",
    twitter: "@usadapekora",
    bio: "Allo-peko! Usada Pekora is a rabbit-eared girl from Pekoland who loves pulling pranks and playing games. She's famous for her chaotic laughter 'HA-HA-HA-HA' and her incredibly entertaining gaming streams!"
  }
];

// Live Now Stream Data
export const liveStreams: LiveStream[] = [
  {
    id: "live_suisei_1",
    channelName: "Hoshimachi Suisei",
    channelId: "suisei",
    avatar: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=80&auto=format&fit=crop&q=80",
    title: "【3D LIVE】STELLAR STELLAR 2026 - Major Birthday Concert & New Album Announcement!",
    viewerCount: 64200,
    topic: "Singing",
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80", // concert stage, colorful lights
    startedAt: "45m ago",
    videoUrl: "https://youtube.com/watch?v=stellar"
  },
  {
    id: "live_gura_1",
    channelName: "Gawr Gura",
    channelId: "gura",
    avatar: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=80&auto=format&fit=crop&q=80",
    title: "BACK FROM THE DEEP! Cute Minecraft server exploration & building a giant shark shrine 🦈✨",
    viewerCount: 38500,
    topic: "Minecraft",
    thumbnail: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&auto=format&fit=crop&q=80", // voxel block art minecraft style
    startedAt: "1h 12m ago",
    videoUrl: "https://youtube.com/watch?v=gura-mc"
  },
  {
    id: "live_marine_1",
    channelName: "Houshou Marine",
    channelId: "marine",
    avatar: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=80&auto=format&fit=crop&q=80",
    title: "【Drawing/Chat】Making retro-style pirate fanart and chatting about recent Holo-Fes events! 🏴‍☠️",
    viewerCount: 29800,
    topic: "Art",
    thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80", // painting and brush layout
    startedAt: "2h ago",
    videoUrl: "https://youtube.com/watch?v=marine-draw"
  },
  {
    id: "live_pekora_1",
    channelName: "Usada Pekora",
    channelId: "pekora",
    avatar: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=80&auto=format&fit=crop&q=80",
    title: "【APEX LEGENDS】Road to Diamond with Solo Queue! Can I survive this peko? 🐰🔥",
    viewerCount: 24300,
    topic: "Apex Legends",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80", // esports game setup red light
    startedAt: "15m ago",
    videoUrl: "https://youtube.com/watch?v=pekora-apex"
  }
];

// Upcoming Schedule Timeline
export const scheduleItems: ScheduleItem[] = [
  {
    id: "sched_calli_1",
    channelName: "Mori Calliope",
    channelId: "calliope",
    avatar: "https://images.unsplash.com/photo-1563089145-599997674d42?w=80&auto=format&fit=crop&q=80",
    title: "【GUILTY GEAR STRIVE】Reaper is back for vengeance! Fighting games with viewers!",
    startTime: "in 1h 15m",
    topic: "Guilty Gear",
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "sched_gura_2",
    channelName: "Gawr Gura",
    channelId: "gura",
    avatar: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=80&auto=format&fit=crop&q=80",
    title: "【UNBOXING】Showing off some awesome ocean goods and custom fan gifts! 📦💙",
    startTime: "in 3h 45m",
    topic: "Unboxing",
    thumbnail: "https://images.unsplash.com/photo-1530811751254-e557b3b27b3e?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "sched_suisei_2",
    channelName: "Hoshimachi Suisei",
    channelId: "suisei",
    avatar: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=80&auto=format&fit=crop&q=80",
    title: "【TETRIS EFFECT】Late night Zen tetris and soft talks about life and universe ☄️🌌",
    startTime: "in 5h 20m",
    topic: "Tetris",
    thumbnail: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "sched_marine_2",
    channelName: "Houshou Marine",
    channelId: "marine",
    avatar: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=80&auto=format&fit=crop&q=80",
    title: "【COLLAB】Holo JP 3rd Gen Mario Kart Tournament! Captain's Pride is on the line!",
    startTime: "in 8h 10m",
    topic: "Mario Kart",
    thumbnail: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "sched_pekora_2",
    channelName: "Usada Pekora",
    channelId: "pekora",
    avatar: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=80&auto=format&fit=crop&q=80",
    title: "【RESIDENT EVIL 4 REMAKE】Defeating the final bosses with maximum rabbit power!",
    startTime: "in 12h 00m",
    topic: "Resident Evil",
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80"
  }
];

// Spotlight Member
export const spotlightChannel: Channel = channels[1]; // Suisei is our initial spotlight member!

// Interactive Video / Clip Search Data
export const videoSearchList: VideoSearchResult[] = [
  {
    id: "vid_1",
    title: "【CLIP】Suisei hits an unbelievable T-Spin Double to win regional finals in 5 seconds flat!",
    channelName: "Suisei Channel",
    channelId: "suisei",
    avatar: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=80&auto=format&fit=crop&q=80",
    type: "Clip",
    topic: "Tetris",
    duration: "2:15",
    date: "1 day ago",
    thumbnail: "https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=400&auto=format&fit=crop&q=80", // neon gaming console
    views: "185K"
  },
  {
    id: "vid_2",
    title: "【CLIP】Gawr Gura tries to speak Japanese but ends up making cute noises instead 🦈🇯🇵",
    channelName: "Gawr Gura Ch. hololive-EN",
    channelId: "gura",
    avatar: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=80&auto=format&fit=crop&q=80",
    type: "Clip",
    topic: "Chatting",
    duration: "4:32",
    date: "3 days ago",
    thumbnail: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=400&auto=format&fit=crop&q=80", // blue waves neon
    views: "340K"
  },
  {
    id: "vid_3",
    title: "Hoshimachi Suisei - Stellar Stellar / THE FIRST TAKE Live Recording Performance",
    channelName: "Suisei Channel",
    channelId: "suisei",
    avatar: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=80&auto=format&fit=crop&q=80",
    type: "Stream",
    topic: "Singing",
    duration: "5:12",
    date: "1 year ago",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80", // retro microphone
    views: "14M"
  },
  {
    id: "vid_4",
    title: "【CLIP】Marine explains why she refuses to wear standard pirate shoes during warm weather",
    channelName: "Marine Ch. 宝鐘マリン",
    channelId: "marine",
    avatar: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=80&auto=format&fit=crop&q=80",
    type: "Clip",
    topic: "Chatting",
    duration: "6:20",
    date: "4 days ago",
    thumbnail: "https://images.unsplash.com/photo-1520038410233-7141be7e6f97?w=400&auto=format&fit=crop&q=80", // red/pink lipstick, elegant
    views: "210K"
  },
  {
    id: "vid_5",
    title: "【MINECRAFT COLLAB】Pekora and Gura create the ultimate traps for unsuspecting visitors!",
    channelName: "Pekora Ch. 兎田ぺこら",
    channelId: "pekora",
    avatar: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=80&auto=format&fit=crop&q=80",
    type: "Stream",
    topic: "Minecraft",
    duration: "2:45:30",
    date: "1 week ago",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80", // cute block pastel abstract
    views: "520K"
  },
  {
    id: "vid_6",
    title: "【CLIP】Mori Calliope absolutely destroys a fast rap verse during her latest 3D rehearsal!",
    channelName: "Mori Calliope Ch. hololive-EN",
    channelId: "calliope",
    avatar: "https://images.unsplash.com/photo-1563089145-599997674d42?w=80&auto=format&fit=crop&q=80",
    type: "Clip",
    topic: "Singing",
    duration: "3:40",
    date: "2 weeks ago",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80", // DJ turntable dark club
    views: "295K"
  },
  {
    id: "vid_7",
    title: "【APEX LEGENDS】Suisei, Calli, and Baelz competitive scrims training for the VTuber Cup!",
    channelName: "Suisei Channel",
    channelId: "suisei",
    avatar: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=80&auto=format&fit=crop&q=80",
    type: "Stream",
    topic: "Apex Legends",
    duration: "3:12:40",
    date: "3 weeks ago",
    thumbnail: "https://images.unsplash.com/photo-1553481187-be93c21490a9?w=400&auto=format&fit=crop&q=80", // retro game controller
    views: "430K"
  }
];
