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
      neurachat: 'https://github.com/neurasamu-ai/NeuraChat/releases/download/NeuraChat/NeuraChat.Pro.apk',   // NeuraChat — Released
      samulab: 'https://github.com/neurasamu-ai/Samu-Lab/releases/download/SaMu_Lab/SaMu.Lab.apk',   // SaMu Lab — Local AI Server APK
      samuchat: 'https://github.com/neurasamu-ai/Samu-Chat/releases/download/SaMu_Chat/SaMu.Chat.apk',   // SaMu Chat — OpenAI-compatible client
      nsmvb: 'https://github.com/neurasamu-ai/NSM-VB/releases/download/NSM-VB/NSM-VB.apk'   // NSM VB — Virtual Brain (Cognitive Architecture)
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
      id: 'nsmvb',
      name: 'NSM VB — Virtual Brain',
      tagline: 'Cognitive Architecture · On-Device',
      category: 'Neuro-Symbolic AI',
      platform: 'Android',
      status: 'released',
      iconSvg: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="5" r="2"/><circle cx="18.5" cy="8.5" r="2"/><circle cx="18.5" cy="15.5" r="2"/><circle cx="12" cy="19" r="2"/><circle cx="5.5" cy="15.5" r="2"/><circle cx="5.5" cy="8.5" r="2"/><path d="M12 7v2M15 7.5l-1 2M17.5 10l-2 1M17.5 14l-2-1M15 16.5l-1-2M12 17v-2M9 16.5l1-2M6.5 14l2-1M6.5 10l2 1M9 7.5l1 2"/>',
      short: 'A developmental cognitive architecture — infinite memory, knowledge graph reasoning, and a curiosity loop. 100% on-device. No cloud, no APIs.',
      about: 'NSM VB is not another LLM wrapper. It is a Developmental Cognitive Architecture built from scratch — a brain that learns, reasons, and remembers like a human child, running entirely on your Android device. Instead of relying on massive GPUs and expensive APIs, it combines a Neuro-Symbolic engine with infinite episodic and semantic memory stored in SQLite. It reasons through forward-chaining inference over a knowledge graph (teach it "Dog is Animal" and "Animal can Breathe" — it infers "Dog can Breathe"), asks you when it encounters a word it does not know (curiosity loop), and ships with an 86,000-word English dictionary built in. You can teach it new facts, tell it to forget specific things, and its responses remain explainable — no black box. Optional Teacher Mode lets it connect to a lightweight local LLM (SmolLM, Llama-3.2) to polish grammar, but the core brain remains fully independent. No API keys. No internet required. No data ever leaves your phone.',
      stats: { rating: 4.9, reviews: '340', downloads: '2.1k+', shares: '180' }
    },
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
,

  /* ═══════════════════════════════════════════════════════════
     POSTS_DATA — updates from the lab (rendered on /post/)
     Add new posts at the top. Date format: YYYY-MM-DD
     ═══════════════════════════════════════════════════════════ */
  POSTS_DATA: [
    {
      id: 'nsm-vb-launch',
      date: '2026-10-19',
      dateLabel: 'October 19, 2026',
      category: 'Release',
      title: 'NSM VB — Virtual Brain',
      subtitle: 'A developmental cognitive architecture, running entirely on-device.',
      excerpt: 'A neuro-symbolic brain that learns, reasons, and remembers — no cloud, no APIs, no LLMs required. Infinite memory, knowledge-graph reasoning, and a built-in 86,000-word dictionary.',
      body: '<p>Today we are releasing <strong>NSM VB</strong> — the NeuraSaMu Virtual Brain. It is not another LLM wrapper. It is a Developmental Cognitive Architecture built from scratch.</p><p>Most modern LLMs suffer from three structural problems: they hallucinate facts, they forget you between sessions, and they cannot explain why they said something. NSM VB flips the model.</p><ul><li><strong>Infinite memory</strong> — facts, relations, and conversations are stored in SQLite with episodic and semantic separation. You can ask it to forget specific things.</li><li><strong>Logical reasoning</strong> — teach it "Dog is Animal" and "Animal can Breathe," and it will infer "Dog can Breathe" through forward-chaining over a knowledge graph.</li><li><strong>Curiosity loop</strong> — when it encounters a word it does not know, it asks you.</li><li><strong>Zero API costs and 100% privacy</strong> — the entire brain runs locally on your Android device.</li><li><strong>86,000-word English dictionary</strong> — built in, ready from first launch.</li><li><strong>Optional Teacher Mode</strong> — connect a lightweight local LLM (SmolLM, Llama-3.2) to polish grammar, but the core brain remains independent.</li></ul><p>Built with Python via Chaquopy, SQLite, forward-chaining inference, and Construction Grammar for language generation. All wrapped in a custom HTML/JS interface built for mobile.</p><p>Download it from the Store — free, no signup, no telemetry.</p>',
      tags: ['AI', 'Neuro-Symbolic', 'On-Device', 'Release'],
      downloadUrl: 'https://github.com/neurasamu-ai/NSM-VB/releases/download/NSM-VB/NSM-VB.apk',
      downloadLabel: 'Download APK',
      seed: { likes: 247, shares: 89 }
    },
    {
      id: 'google-recognition',
      date: '2026-10-14',
      dateLabel: 'October 14, 2026',
      category: 'Milestone',
      title: 'Google AI Overview recognizes NeuraSaMu',
      subtitle: 'A public benchmark of the lab's research visibility.',
      excerpt: 'Google's AI Overview now cites NeuraSaMu as Pakistan's first frontier AGI laboratory, referencing all four published research papers as primary sources.',
      body: '<p>This week, <strong>Google's AI Overview</strong> began citing NeuraSaMu as Pakistan's first frontier laboratory dedicated to artificial general intelligence, superintelligence, and autonomous robotics — referencing all four of our published research papers as primary sources.</p><p>This is not the result of a marketing campaign. It is the result of publishing openly, structuring research for machine readability, and maintaining the corpus as a living document over years.</p><p>The four cited papers:</p><ul><li><strong>CSPM</strong> — Continuous Subconscious Processing Model</li><li><strong>SMG v2</strong> — Synapse AI Memory Graph</li><li><strong>ABH</strong> — AGI Anthropomorphic Breach Hypothesis</li><li><strong>AAO</strong> — AGI &amp; ASI Outlook Through 2031</li></ul><p>All four remain free and publicly available. We believe frontier research should be inspectable by anyone.</p>',
      tags: ['Recognition', 'Research', 'Milestone'],
      seed: { likes: 412, shares: 156 }
    },
    {
      id: 'smg-v2-published',
      date: '2026-09-28',
      dateLabel: 'September 28, 2026',
      category: 'Research',
      title: 'SMG v2 — Synapse AI Memory Graph',
      subtitle: 'Pointer-virtualized long-term memory for large language models.',
      excerpt: 'Version 2.0 of the Synapse AI Memory Graph introduces a dual-tier architecture for episodic memory: a bounded active buffer, a semantic keyword box, and an encrypted virtual vault.',
      body: '<p>We have published <strong>SMG v2</strong> — the second version of the Synapse AI Memory Graph, our architecture for episodic, pointer-virtualized long-term memory in LLMs.</p><p>The core insight is simple: do not make the context window carry the entire memory system. Make the context window a bounded execution surface, and make long-term memory a searchable, addressable external system.</p><p>Three pillars:</p><ul><li><strong>L1 Active Buffer</strong> — a strictly capped four-turn sliding window in the model's volatile memory.</li><li><strong>L2 Keyword Box</strong> — a semantic index of atomic keywords, each mapped to a unique identifier.</li><li><strong>L2 Chat Store</strong> — an encrypted virtual vault holding the raw conversation payloads.</li></ul><p>Retrieval is demand-paged: a query resolves to a semantic identifier, which then resolves against the vault to load only the micro-context required at inference time. The full paper is available on Kaggle.</p>',
      tags: ['Research', 'LLM', 'Memory', 'Architecture'],
      seed: { likes: 183, shares: 67 }
    },
    {
      id: 'neura-browser-release',
      date: '2026-09-26',
      dateLabel: 'September 26, 2026',
      category: 'Release',
      title: 'Neura Browser — fullscreen, ad-free',
      subtitle: 'A browser that gets out of the way.',
      excerpt: 'A fullscreen Android browser with no tabs, no bookmarks bar, no dashboard — just a single draggable pill and the entire screen for the site.',
      body: '<p>Neura Browser is now live on the Store. It is a fullscreen Android browser with a single draggable pill — no tabs, no bookmarks bar, no dashboard, no news feed.</p><p>Features:</p><ul><li><strong>100% fullscreen</strong> — every pixel belongs to the site.</li><li><strong>One floating button</strong> — URL entry, navigation, history, downloads, desktop toggle, all inside one compact card.</li><li><strong>Built-in 3-layer ad blocker</strong> — neutralizes 140+ ad networks including Google Ads, Facebook Pixel, Taboola, and PropellerAds. No VPN, no root.</li><li><strong>Custom download engine</strong> — OkHttp-based, with live speed, ETA, pause, resume, and notification controls.</li><li><strong>Persistent logins</strong> — cookies are flushed to disk properly.</li><li><strong>~5 MB APK</strong> — zero telemetry, zero analytics, zero ads.</li></ul><p>Free, forever. Download from the Store.</p>',
      tags: ['Release', 'Android', 'Browser'],
      downloadUrl: 'https://github.com/muhammad-salman-shar/url-apk/releases/download/Neura_Browser/Neura.Browser.apk',
      downloadLabel: 'Download APK',
      seed: { likes: 226, shares: 94 }
    }
  ]
};
