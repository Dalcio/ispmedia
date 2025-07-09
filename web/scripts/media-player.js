// ISP Media - Media Player with Controls
// Audio and video player with full control functionality

class MediaPlayer {
  static init() {
    this.player = null;
    this.currentMedia = null;
    this.playlist = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.volume = 1.0;
    this.isShuffled = false;
    this.isLooped = false;
    this.setupEventListeners();
    this.createPlayerInterface();
  }

  static createPlayerInterface() {
    // Check if player interface already exists
    if (document.getElementById("mediaPlayerInterface")) return;

    const playerHTML = `
      <div id="mediaPlayerInterface" class="media-player hidden">
        <div class="player-controls">
          <div class="player-main-controls">
            <button id="prevBtn" class="control-btn" onclick="MediaPlayer.previous()">⏮</button>
            <button id="playPauseBtn" class="control-btn main-control" onclick="MediaPlayer.togglePlayPause()">▶</button>
            <button id="nextBtn" class="control-btn" onclick="MediaPlayer.next()">⏭</button>
          </div>
          
          <div class="player-progress">
            <span id="currentTime" class="time">0:00</span>
            <div class="progress-container">
              <div id="progressBar" class="progress-bar">
                <div id="progressFill" class="progress-fill"></div>
                <div id="progressHandle" class="progress-handle"></div>
              </div>
            </div>
            <span id="totalTime" class="time">0:00</span>
          </div>
          
          <div class="player-secondary-controls">
            <button id="shuffleBtn" class="control-btn" onclick="MediaPlayer.toggleShuffle()">🔀</button>
            <button id="loopBtn" class="control-btn" onclick="MediaPlayer.toggleLoop()">🔁</button>
            <div class="volume-control">
              <button id="volumeBtn" class="control-btn" onclick="MediaPlayer.toggleMute()">🔊</button>
              <div class="volume-slider">
                <input type="range" id="volumeSlider" min="0" max="100" value="100" 
                       onchange="MediaPlayer.setVolume(this.value / 100)">
              </div>
            </div>
            <button id="fullscreenBtn" class="control-btn" onclick="MediaPlayer.toggleFullscreen()">⛶</button>
          </div>
        </div>
        
        <div class="player-info">
          <div class="media-thumbnail">
            <img id="mediaThumbnail" src="" alt="Media thumbnail">
          </div>
          <div class="media-details">
            <h4 id="mediaTitle">No media loaded</h4>
            <p id="mediaArtist">Unknown artist</p>
          </div>
          <button class="player-close" onclick="MediaPlayer.closePlayer()">&times;</button>
        </div>
        
        <div class="player-playlist hidden" id="playerPlaylist">
          <div class="playlist-header">
            <h3>Now Playing</h3>
            <button onclick="MediaPlayer.togglePlaylist()" class="btn btn-ghost btn-sm">Hide</button>
          </div>
          <div class="playlist-items" id="playlistItems">
            <!-- Playlist items will be rendered here -->
          </div>
        </div>
      </div>
      
      <audio id="audioPlayer" preload="metadata"></audio>
      <video id="videoPlayer" preload="metadata" style="display: none;"></video>
    `;

    document.body.insertAdjacentHTML("beforeend", playerHTML);
  }

  static setupEventListeners() {
    document.addEventListener("DOMContentLoaded", () => {
      // Progress bar click
      document.addEventListener("click", (e) => {
        if (
          e.target.id === "progressBar" ||
          e.target.parentElement.id === "progressBar"
        ) {
          this.seekTo(e);
        }
      });

      // Keyboard shortcuts
      document.addEventListener("keydown", (e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
          return;

        switch (e.code) {
          case "Space":
            e.preventDefault();
            this.togglePlayPause();
            break;
          case "ArrowLeft":
            this.seekRelative(-10);
            break;
          case "ArrowRight":
            this.seekRelative(10);
            break;
          case "ArrowUp":
            e.preventDefault();
            this.adjustVolume(0.1);
            break;
          case "ArrowDown":
            e.preventDefault();
            this.adjustVolume(-0.1);
            break;
          case "KeyM":
            this.toggleMute();
            break;
          case "KeyF":
            this.toggleFullscreen();
            break;
        }
      });
    });
  }

  static loadMedia(media, autoplay = false) {
    this.currentMedia = media;

    // Determine media type and get appropriate player
    if (media.type.startsWith("audio/")) {
      this.player = document.getElementById("audioPlayer");
      document.getElementById("videoPlayer").style.display = "none";
    } else if (media.type.startsWith("video/")) {
      this.player = document.getElementById("videoPlayer");
      this.player.style.display = "block";
    } else {
      NotificationManager.show("Unsupported media type", "error");
      return false;
    }

    // Set media source (simulated)
    this.player.src = media.url || this.generateMediaUrl(media);

    // Update UI
    this.updatePlayerInfo();
    this.showPlayer();

    if (autoplay) {
      this.play();
    }

    // Dispatch event
    document.dispatchEvent(
      new CustomEvent("mediaLoaded", {
        detail: { media: media },
      })
    );

    return true;
  }

  static generateMediaUrl(media) {
    // Simulate media URL generation
    return `https://example.com/media/${media.id}.${media.type.split("/")[1]}`;
  }

  static loadPlaylist(playlist, startIndex = 0) {
    if (!playlist || playlist.media.length === 0) {
      NotificationManager.show("Playlist is empty", "warning");
      return false;
    }

    this.playlist = playlist.media;
    this.currentIndex = startIndex;
    this.loadMedia(this.playlist[this.currentIndex], true);
    this.renderPlaylist();

    document.dispatchEvent(
      new CustomEvent("playlistLoaded", {
        detail: { playlist: playlist },
      })
    );

    return true;
  }

  static play() {
    if (!this.player || !this.currentMedia) {
      NotificationManager.show("No media loaded", "warning");
      return;
    }

    this.player
      .play()
      .then(() => {
        this.isPlaying = true;
        this.updatePlayButton();

        document.dispatchEvent(
          new CustomEvent("mediaPlayed", {
            detail: { media: this.currentMedia },
          })
        );
      })
      .catch((error) => {
        console.error("Playback failed:", error);
        NotificationManager.show("Playback failed", "error");
      });
  }

  static pause() {
    if (this.player) {
      this.player.pause();
      this.isPlaying = false;
      this.updatePlayButton();

      document.dispatchEvent(
        new CustomEvent("mediaPaused", {
          detail: { media: this.currentMedia },
        })
      );
    }
  }

  static togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  static previous() {
    if (this.playlist.length === 0) {
      this.seekTo(0);
      return;
    }

    this.currentIndex =
      this.currentIndex > 0 ? this.currentIndex - 1 : this.playlist.length - 1;
    this.loadMedia(this.playlist[this.currentIndex], this.isPlaying);
    this.updatePlaylistHighlight();
  }

  static next() {
    if (this.playlist.length === 0) return;

    if (this.isShuffled) {
      this.currentIndex = Math.floor(Math.random() * this.playlist.length);
    } else {
      this.currentIndex =
        this.currentIndex < this.playlist.length - 1
          ? this.currentIndex + 1
          : 0;
    }

    this.loadMedia(this.playlist[this.currentIndex], this.isPlaying);
    this.updatePlaylistHighlight();
  }

  static seekTo(event) {
    if (!this.player) return;

    const progressBar = document.getElementById("progressBar");
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const seekTime = percentage * this.player.duration;

    this.player.currentTime = seekTime;
  }

  static seekRelative(seconds) {
    if (!this.player) return;

    this.player.currentTime = Math.max(
      0,
      Math.min(this.player.duration, this.player.currentTime + seconds)
    );
  }

  static setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));

    if (this.player) {
      this.player.volume = this.volume;
    }

    this.updateVolumeUI();
  }

  static adjustVolume(delta) {
    this.setVolume(this.volume + delta);
  }

  static toggleMute() {
    if (this.player) {
      this.player.muted = !this.player.muted;
      this.updateVolumeUI();
    }
  }

  static toggleShuffle() {
    this.isShuffled = !this.isShuffled;
    const btn = document.getElementById("shuffleBtn");
    btn.classList.toggle("active", this.isShuffled);
    NotificationManager.toast(
      `Shuffle ${this.isShuffled ? "on" : "off"}`,
      "info"
    );
  }

  static toggleLoop() {
    this.isLooped = !this.isLooped;
    const btn = document.getElementById("loopBtn");
    btn.classList.toggle("active", this.isLooped);
    NotificationManager.toast(`Loop ${this.isLooped ? "on" : "off"}`, "info");
  }

  static toggleFullscreen() {
    if (this.currentMedia && this.currentMedia.type.startsWith("video/")) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        this.player.requestFullscreen().catch((err) => {
          console.error("Fullscreen failed:", err);
        });
      }
    }
  }

  static togglePlaylist() {
    const playlist = document.getElementById("playerPlaylist");
    playlist.classList.toggle("hidden");
  }

  static showPlayer() {
    const player = document.getElementById("mediaPlayerInterface");
    player.classList.remove("hidden");

    // Setup media event listeners
    this.setupMediaEventListeners();
  }

  static closePlayer() {
    const player = document.getElementById("mediaPlayerInterface");
    player.classList.add("hidden");

    if (this.player) {
      this.player.pause();
      this.player.src = "";
    }

    this.currentMedia = null;
    this.isPlaying = false;
  }

  static setupMediaEventListeners() {
    if (!this.player) return;

    // Remove existing listeners
    this.player.onloadedmetadata = null;
    this.player.ontimeupdate = null;
    this.player.onended = null;

    this.player.onloadedmetadata = () => {
      document.getElementById("totalTime").textContent = this.formatTime(
        this.player.duration
      );
    };

    this.player.ontimeupdate = () => {
      this.updateProgress();
    };

    this.player.onended = () => {
      if (this.isLooped) {
        this.player.currentTime = 0;
        this.play();
      } else if (this.playlist.length > 0) {
        this.next();
      } else {
        this.isPlaying = false;
        this.updatePlayButton();
      }
    };

    this.player.onplay = () => {
      this.isPlaying = true;
      this.updatePlayButton();
    };

    this.player.onpause = () => {
      this.isPlaying = false;
      this.updatePlayButton();
    };

    this.player.onvolumechange = () => {
      this.updateVolumeUI();
    };
  }

  static updatePlayerInfo() {
    if (!this.currentMedia) return;

    document.getElementById("mediaTitle").textContent =
      this.currentMedia.title || "Unknown Title";
    document.getElementById("mediaArtist").textContent =
      this.currentMedia.artist || "Unknown Artist";

    const thumbnail = document.getElementById("mediaThumbnail");
    thumbnail.src =
      this.currentMedia.thumbnail || "/images/default-thumbnail.jpg";
    thumbnail.alt = this.currentMedia.title || "Media thumbnail";
  }

  static updatePlayButton() {
    const btn = document.getElementById("playPauseBtn");
    btn.textContent = this.isPlaying ? "⏸" : "▶";
  }

  static updateProgress() {
    if (!this.player) return;

    const current = this.player.currentTime;
    const duration = this.player.duration;
    const percentage = duration ? (current / duration) * 100 : 0;

    document.getElementById("currentTime").textContent =
      this.formatTime(current);
    document.getElementById("progressFill").style.width = `${percentage}%`;
    document.getElementById("progressHandle").style.left = `${percentage}%`;
  }

  static updateVolumeUI() {
    if (!this.player) return;

    const volumeBtn = document.getElementById("volumeBtn");
    const volumeSlider = document.getElementById("volumeSlider");

    if (this.player.muted || this.player.volume === 0) {
      volumeBtn.textContent = "🔇";
    } else if (this.player.volume < 0.5) {
      volumeBtn.textContent = "🔉";
    } else {
      volumeBtn.textContent = "🔊";
    }

    volumeSlider.value = this.player.volume * 100;
  }

  static renderPlaylist() {
    const container = document.getElementById("playlistItems");
    if (!container || this.playlist.length === 0) return;

    container.innerHTML = this.playlist
      .map(
        (media, index) => `
      <div class="playlist-item ${index === this.currentIndex ? "active" : ""}" 
           onclick="MediaPlayer.playFromPlaylist(${index})">
        <div class="playlist-item-info">
          <h4>${media.title}</h4>
          <p>${media.artist}</p>
        </div>
        <div class="playlist-item-duration">
          ${this.formatTime(media.duration)}
        </div>
      </div>
    `
      )
      .join("");
  }

  static updatePlaylistHighlight() {
    const items = document.querySelectorAll(".playlist-item");
    items.forEach((item, index) => {
      item.classList.toggle("active", index === this.currentIndex);
    });
  }

  static playFromPlaylist(index) {
    if (index >= 0 && index < this.playlist.length) {
      this.currentIndex = index;
      this.loadMedia(this.playlist[index], true);
      this.updatePlaylistHighlight();
    }
  }

  static formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  // Playback speed control
  static setPlaybackSpeed(speed) {
    if (this.player) {
      this.player.playbackRate = speed;
      NotificationManager.toast(`Speed: ${speed}x`, "info");
    }
  }

  // Audio visualization (basic)
  static toggleVisualization() {
    // Basic visualization toggle - would require Web Audio API for full implementation
    NotificationManager.toast("Visualization feature coming soon", "info");
  }

  // Equalizer (basic)
  static toggleEqualizer() {
    // Basic equalizer toggle - would require Web Audio API for full implementation
    NotificationManager.toast("Equalizer feature coming soon", "info");
  }
}

// Global functions for media player
function playMedia(media) {
  MediaPlayer.loadMedia(media, true);
}

function playPlaylist(playlist) {
  MediaPlayer.loadPlaylist(playlist);
}

// Initialize media player
document.addEventListener("DOMContentLoaded", () => {
  MediaPlayer.init();
});
