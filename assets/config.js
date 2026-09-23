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
      smg:  'https://www.kaggle.com/datasets/muhammadsalmanshar/ai-synapse-memory-graph-by-muhammad-salman-shar',   // SMG whitepaper PDF ka link
      abh:  'https://www.kaggle.com/datasets/muhammadsalmanshar/agi-anthropomorphic-breach-hypothesis',   // AGI Anthropomorphic Breach Hypothesis paper ka link
      aao:  'https://www.kaggle.com/datasets/muhammadsalmanshar/agi-and-asi-outlook-through-2031'    // AGI & ASI Outlook Through 2031 paper ka link
    },
    apps: {
      compiler:  'https://github.com/muhammad-salman-shar/Cpp_compiler/releases/download/C%2B%2BCompiler_lite_apk/C++.Compiler.lite.apk',   // NeuraSaMu C++ Compiler — APK link
      akira:     'UPLOAD',   // NeuraChat — APK link
      rem: 'UPLOAD',   // REM AI (Robotic Ear Model) — acquire link
      browser: 'https://github.com/muhammad-salman-shar/url-apk/releases/download/Neura_Browser/Neura.Browser.apk',   // Neura Browser — APK link
      neurachat: 'UPLOAD'   // NeuraChat — Release Soon
    }
    /* PHOTOS / FUTURE ASSETS: jab zaroorat ho, repo mein assets/photos/
       folder bana kar files daalo aur yahan paths/links add kar do. */
  },

  /* SOCIAL — join links for /store/ Platforms tab
     Sirf wo entries rakho jinke accounts active hain. */
  SOCIALS: [
    { name: 'GitHub',   url: 'https://github.com/neurasamu-ai',                                                  handle: '@neurasamu-ai' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/muhammad-salman-shar-564bb5346',                       handle: 'Muhammad Salman Shar' },
    { name: 'Facebook', url: 'https://www.facebook.com/neurasamuai',                                             handle: '@neurasamuai' },
    { name: 'TikTok',   url: 'https://tiktok.com/@muhammad_salman_shar',                                         handle: '@muhammad_salman_shar' }
  ]
};
