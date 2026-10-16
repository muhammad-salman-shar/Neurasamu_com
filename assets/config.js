/* NeuraSaMu — Site Configuration
   ═══════════════════════════════════════════════════════════
   Yahan se poora website control karo:
   - EMAIL: form submissions
   - FORMSPREE: email dispatch endpoints (blank = mailto fallback)
   - LINKS.papers: har research paper ka download URL
   - LINKS.apps: har app ka download URL
   ═══════════════════════════════════════════════════════════ */

const SITE_CONFIG = {

  EMAIL: 'neurasamuai@gmail.com',   // form submissions yahan aati hain

  FORMSPREE: {
    apply: '',   // e.g. 'https://formspree.io/f/abcdwxyz'  (lab application wala form)
    intel: ''    // e.g. 'https://formspree.io/f/xyzwabcd'  (market intelligence wala)
  },

  LINKS: {
    papers: {
      cspm: 'https://www.kaggle.com/datasets/muhammadsalmanshar/cspm-by-muhammad-salman-shar',   // CSPM whitepaper PDF ka GitHub release link
      smg:  'https://www.kaggle.com/datasets/muhammadsalmanshar/ai-synapse-memory-graph-version-2-0',   // SMG v2 whitepaper PDF ka link
      abh:  'https://www.kaggle.com/datasets/muhammadsalmanshar/agi-anthropomorphic-breach-hypothesis',   // AGI Anthropomorphic Breach Hypothesis paper ka link
      aao:  'https://www.kaggle.com/datasets/muhammadsalmanshar/agi-and-asi-outlook-through-2031'    // AGI & ASI Outlook Through 2031 paper ka link
    },
    apps: {
      compiler:  'https://github.com/muhammad-salman-shar/Cpp_compiler/releases/download/C%2B%2BCompiler_lite_apk/C++.Compiler.lite.apk',   // NeuraSaMu C++ Compiler — APK link
      akira:     'UPLOAD',   // NeuraChat — APK link
      rem: 'UPLOAD',   // REM AI (Robotic Ear Model) — acquire link
      browser: 'https://github.com/muhammad-salman-shar/url-apk/releases/download/Neura_Browser/Neura.Browser.apk',   // Neura Browser — APK link
      neurachat: 'UPLOAD',   // NeuraChat — Release Soon
      samulab: 'https://github.com/neurasamu-ai/Samu-Lab/releases/download/SaMu_Lab/SaMu.Lab.apk',   // SaMu Lab — Local AI Server APK
      samuchat: 'https://github.com/neurasamu-ai/Samu-Chat/releases/download/SaMu_Chat/SaMu.Chat.apk'   // SaMu Chat — OpenAI-compatible client
    }
    /* PHOTOS / FUTURE ASSETS: jab zaroorat ho, repo mein assets/photos/
       folder bana kar files daalo aur yahan paths/links add kar do. */
  },

  /* ═══════════════════════════════════════════════════════════
     APPS_DATA — full app metadata for Store grid + detail modal
     Add new apps here; the Store renders them automatically.
     ═══════════════════════════════════════════════════════════ */
  APPS_DATA: [
    {
      id: 'neurachat',
      name: 'NeuraChat',
      tagline: 'Communication, Elevated',
      category: 'SMS · Calling · AI',
      platform: 'Android',
      status: 'released',
      iconSvg: '<path d="M21 12a8 8 0 0 1-11.7 7.1L4 21l1.9-5.3A8 8 0 1 1 21 12z"/><path d="M8 11h8M8 15h5"/>',
      short: 'SMS, native calling, and multiple AI providers in one premium interface — with privacy-first design.',
      about: 'NeuraChat brings messaging, native calling, and multiple AI ecosystems into one sophisticated interface. Supports SMS with multi-SIM, MMS, custom bubbles and backgrounds; a full-screen native calling experience with lock-screen support; and AI integration across OpenAI, Anthropic, Google, DeepSeek, xAI, Qwen, OpenRouter, Z.AI, and self-hosted OpenAI-compatible endpoints like Ollama and LM Studio. SMS and contact data stay on your device. API credentials are stored locally.',
      stats: { rating: 4.9, reviews: '1.5k', downloads: '6.8k+', shares: '520' }
    },
    {
      id: 'samulab',
      name: 'SaMu Lab',
      tagline: 'Local AI Server · On-Device',
      category: 'AI Server · Offline',
      platform: 'Android · ARM64',
      status: 'released',
      iconSvg: '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><rect x="8" y="8" width="8" height="8" rx="1.5"/><path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3M6.5 3.5v2M17.5 3.5v2M6.5 20.5v-2M17.5 20.5v-2"/>',
      short: 'Turn your phone into a personal AI server running GGUF & LiteRT models entirely on-device. OpenAI-compatible API.',
      about: 'SaMu Lab turns your Android phone into a personal AI server with no cloud, no subscription, and no data leaving your hands. Load GGUF or LiteRT models from phone storage and the app boots them into memory, exposing an OpenAI-compatible API on port 8080 over your local network. Any OpenAI-compatible client (PocketPal, PrivateLM, Cherry Studio, curl) can connect. The engine is llama.cpp compiled natively through JNI with flash attention and quantized KV cache enabled by default. Auto-detects CPU cores for MediaTek, Snapdragon, and Exynos chips. Supports multiple clients with separate API keys.',
      stats: { rating: 4.9, reviews: '1.1k', downloads: '5.2k+', shares: '380' }
    },
    {
      id: 'samuchat',
      name: 'SaMu Chat',
      tagline: 'OpenAI-Compatible Client',
      category: 'AI Chat · Native',
      platform: 'Android · ARM64',
      status: 'released',
      iconSvg: '<path d="M21 12a8 8 0 0 1-11.7 7.1L4 21l1.9-5.3A8 8 0 1 1 21 12z"/><path d="M8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01"/>',
      short: 'Lightweight Android client for any OpenAI-compatible endpoint. Streaming SSE, multi-API switching, live context chip.',
      about: 'SaMu Chat is a lightweight Android client for any OpenAI-compatible endpoint — your own SaMu Lab server, or any cloud API you prefer. Built with native Kotlin and Jetpack Compose, with Room for local storage and OkHttp for streaming. Add multiple APIs, switch between them with one tap, and each API keeps its own conversations. Live context chip shows token usage against the model window. Conversations stored locally with automatic titles. Attach any file type. Dark-orange theme matching SaMu Lab. No analytics, no background services.',
      stats: { rating: 4.8, reviews: '680', downloads: '3.4k+', shares: '240' }
    },
    {
      id: 'browser',
      name: 'Neura Browser',
      tagline: 'Fullscreen Browser',
      category: 'Browser · Ad-Block',
      platform: 'Android',
      status: 'released',
      iconSvg: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3 9h18"/><circle cx="7" cy="7" r=".5"/>',
      short: 'Fullscreen browser with a built-in 3-layer ad blocker and a custom OkHttp download engine.',
      about: 'Neura Browser is a fullscreen, no-UI Android browser with a single draggable pill that floats on screen. No tabs, no bookmarks bar, no dashboard — every pixel belongs to the site. Built-in 3-layer ad blocker neutralizes 140+ ad networks (Google Ads, Facebook Pixel, Taboola, Outbrain, PropellerAds) with no VPN or root required. Custom OkHttp-based download engine supports pause, resume, live speed, and ETA with notification controls. Persistent login across sessions. Follows system light/dark theme. ~5 MB APK, zero telemetry, zero analytics.',
      stats: { rating: 4.7, reviews: '842', downloads: '12k+', shares: '210' }
    },
    {
      id: 'compiler',
      name: 'C++ Compiler',
      tagline: 'Lite Build · On-Device',
      category: 'Developer Tool',
      platform: 'Android',
      status: 'released',
      iconSvg: '<path d="M9 7 4 12l5 5M15 7l5 5-5 5"/>',
      short: 'High-performance native client compiler for low-overhead mobile execution. Build on the device.',
      about: 'NeuraSaMu C++ Compiler is a high-performance native client compiler APK for low-overhead mobile execution. Compiles and runs C++ directly on-device without external toolchains — enabling native development in constrained environments. Optimized for Termux-style workflows and on-device learning. No cloud dependency, no IDE required.',
      stats: { rating: 4.6, reviews: '320', downloads: '8.7k+', shares: '156' }
    },
    {
      id: 'sltasker',
      name: 'SL Tasker',
      tagline: 'Release Soon',
      category: 'Productivity · Gamification',
      platform: 'Android',
      status: 'soon',
      iconSvg: '<path d="M8 21h8M12 17v4M17 4H7v5a5 5 0 0 0 10 0V4zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
      short: 'Solo Leveling-style quest system for daily tasks — earn EP, level up, and build real discipline.',
      about: 'SL Tasker turns your daily to-dos into a Solo Leveling-style quest system. Every task is a quest — Medium, Hard, or Critical — with rewards (HP & energy) for finishing and penalties for ignoring. Hard and Critical quests unlock focus timers, and the built-in Block System locks distracting apps until your work is done. Smart alarms with custom sounds, snooze, PIN-protected dismissal. Track your rank, health, streak, and activity history in a gamified profile.',
      stats: { rating: 4.8, reviews: '210', downloads: '1.2k+', shares: '89' }
    }
  ],

  /* SOCIAL — join links for /store/ Platforms tab
     Sirf wo entries rakho jinke accounts active hain. */
  SOCIALS: [
    { name: 'GitHub',   url: 'https://github.com/neurasamu-ai',                                                  handle: '@neurasamu-ai' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/muhammad-salman-shar-564bb5346',                       handle: 'Muhammad Salman Shar' },
    { name: 'Facebook', url: 'https://www.facebook.com/neurasamuai',                                             handle: '@neurasamuai' },
    { name: 'TikTok',   url: 'https://tiktok.com/@neurasamu',                                         handle: '@neurasamu' }
  ]
};
