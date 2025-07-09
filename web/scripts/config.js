// ISP Media - Application Configuration
// Central configuration for the application

const AppConfig = {
  // Application info
  name: "ISP Media",
  version: "1.0.0",
  description: "Media sharing and management platform",

  // Features toggle
  features: {
    playlists: true,
    reviews: true,
    mediaPlayer: true,
    notifications: true,
    advancedUpload: true,
    userProfiles: true,
    socialFeatures: true,
  },

  // File upload settings
  upload: {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    maxQueueSize: 20,
    allowedTypes: {
      image: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
      ],
      video: ["video/mp4", "video/webm", "video/avi", "video/mov", "video/wmv"],
      audio: ["audio/mp3", "audio/wav", "audio/ogg", "audio/m4a", "audio/flac"],
      document: ["application/pdf", "text/plain", "application/msword"],
    },
    uploadSimulationDelay: 50, // milliseconds per progress step
  },

  // Media player settings
  mediaPlayer: {
    defaultVolume: 1.0,
    enableKeyboardShortcuts: true,
    autoplay: false,
    enableVisualization: false,
    enableEqualizer: false,
  },

  // Notification settings
  notifications: {
    defaultDuration: 5000,
    enableBrowserNotifications: true,
    enableSounds: false,
    position: "top-right",
  },

  // Playlist settings
  playlists: {
    maxNameLength: 100,
    maxDescriptionLength: 500,
    maxPlaylistsPerUser: 50,
    enablePublicPlaylists: true,
  },

  // Review system settings
  reviews: {
    maxCommentLength: 1000,
    minCommentLength: 5,
    enableLikes: true,
    enableDislikes: true,
    enableReviewEditing: true,
  },

  // UI settings
  ui: {
    theme: "light", // 'light' or 'dark'
    enableAnimations: true,
    compactMode: false,
    showThumbnails: true,
  },

  // Storage keys for localStorage
  storageKeys: {
    auth: "ispmedia_auth",
    user: "ispmedia_user",
    playlists: "ispmedia_playlists",
    reviews: "ispmedia_reviews",
    library: "ispmedia_library",
    uploadHistory: "ispmedia_upload_history",
    settings: "ispmedia_settings",
  },

  // API endpoints (for future backend integration)
  api: {
    baseUrl: "",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      media: "/api/media",
      playlists: "/api/playlists",
      reviews: "/api/reviews",
      upload: "/api/upload",
    },
  },

  // Development settings
  development: {
    enableDebugMode: false,
    enableMockData: true,
    logLevel: "info", // 'debug', 'info', 'warn', 'error'
  },
};

// Method to get configuration value with fallback
AppConfig.get = function (path, defaultValue = null) {
  const keys = path.split(".");
  let value = this;

  for (let key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = value[key];
    } else {
      return defaultValue;
    }
  }

  return value;
};

// Method to check if feature is enabled
AppConfig.isFeatureEnabled = function (feature) {
  return this.get(`features.${feature}`, false);
};

// Method to update configuration
AppConfig.set = function (path, value) {
  const keys = path.split(".");
  const lastKey = keys.pop();
  let obj = this;

  for (let key of keys) {
    if (!(key in obj) || typeof obj[key] !== "object") {
      obj[key] = {};
    }
    obj = obj[key];
  }

  obj[lastKey] = value;
};

// Load user settings from localStorage
AppConfig.loadUserSettings = function () {
  const saved = localStorage.getItem(this.storageKeys.settings);
  if (saved) {
    try {
      const settings = JSON.parse(saved);
      Object.assign(this.ui, settings.ui || {});
      Object.assign(this.notifications, settings.notifications || {});
      Object.assign(this.mediaPlayer, settings.mediaPlayer || {});
    } catch (e) {
      console.warn("Failed to load user settings:", e);
    }
  }
};

// Save user settings to localStorage
AppConfig.saveUserSettings = function () {
  const settings = {
    ui: this.ui,
    notifications: this.notifications,
    mediaPlayer: this.mediaPlayer,
  };

  try {
    localStorage.setItem(this.storageKeys.settings, JSON.stringify(settings));
  } catch (e) {
    console.warn("Failed to save user settings:", e);
  }
};

// Initialize configuration
AppConfig.init = function () {
  this.loadUserSettings();

  // Enable debug mode if in development
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    this.development.enableDebugMode = true;
    this.development.logLevel = "debug";
  }
};

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = AppConfig;
}
