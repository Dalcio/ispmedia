// ISP Media - Playlist Manager
// Simulates playlist functionality with localStorage

class PlaylistManager {
  static init() {
    this.loadPlaylists();
    this.setupEventListeners();
  }
  static loadPlaylists() {
    const stored = localStorage.getItem("ispmedia_playlists");
    this.playlists = stored ? JSON.parse(stored) : [];

    // Create default playlists if none exist
    if (this.playlists.length === 0) {
      this.playlists = [
        {
          id: "fav-" + Date.now(),
          name: "Favorites",
          description: "Your favorite tracks",
          isPublic: false,
          isDefault: true,
          createdBy: "system",
          createdAt: new Date().toISOString(),
          media: [],
        },
        {
          id: "recent-" + Date.now(),
          name: "Recently Played",
          description: "Recently played media",
          isPublic: false,
          isDefault: true,
          createdBy: "system",
          createdAt: new Date().toISOString(),
          media: [],
        },
      ];
      this.savePlaylists();
    }
  }

  static savePlaylists() {
    localStorage.setItem("ispmedia_playlists", JSON.stringify(this.playlists));
  }

  static createPlaylist(name, description, isPublic = false) {
    if (!AuthManager.isAuthenticated) {
      NotificationManager.show("Please log in to create playlists", "warning");
      return null;
    }

    const playlist = {
      id:
        "playlist-" +
        Date.now() +
        "-" +
        Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      description: description.trim(),
      isPublic: isPublic,
      isDefault: false,
      createdBy: AuthManager.currentUser?.username || "anonymous",
      createdAt: new Date().toISOString(),
      media: [],
    };

    this.playlists.push(playlist);
    this.savePlaylists();
    NotificationManager.show(
      `Playlist "${name}" created successfully`,
      "success"
    );
    return playlist;
  }

  static deletePlaylist(playlistId) {
    const playlist = this.getPlaylist(playlistId);
    if (!playlist) return false;

    if (playlist.isDefault) {
      NotificationManager.show("Cannot delete default playlists", "error");
      return false;
    }

    if (playlist.createdBy !== AuthManager.currentUser?.username) {
      NotificationManager.show(
        "You can only delete your own playlists",
        "error"
      );
      return false;
    }

    this.playlists = this.playlists.filter((p) => p.id !== playlistId);
    this.savePlaylists();
    NotificationManager.show(`Playlist "${playlist.name}" deleted`, "info");
    return true;
  }

  static addToPlaylist(playlistId, mediaItem) {
    const playlist = this.getPlaylist(playlistId);
    if (!playlist) return false;

    // Check if media already exists in playlist
    if (playlist.media.find((m) => m.id === mediaItem.id)) {
      NotificationManager.show("Media already in playlist", "warning");
      return false;
    }

    playlist.media.push({
      id: mediaItem.id,
      title: mediaItem.title,
      artist: mediaItem.artist,
      duration: mediaItem.duration,
      type: mediaItem.type,
      thumbnail: mediaItem.thumbnail,
      addedAt: new Date().toISOString(),
    });

    this.savePlaylists();
    NotificationManager.show(`Added to "${playlist.name}"`, "success");
    return true;
  }

  static removeFromPlaylist(playlistId, mediaId) {
    const playlist = this.getPlaylist(playlistId);
    if (!playlist) return false;

    playlist.media = playlist.media.filter((m) => m.id !== mediaId);
    this.savePlaylists();
    NotificationManager.show("Removed from playlist", "info");
    return true;
  }

  static getPlaylist(playlistId) {
    return this.playlists.find((p) => p.id === playlistId);
  }

  static getUserPlaylists() {
    if (!AuthManager.isAuthenticated) return [];
    return this.playlists.filter(
      (p) => p.createdBy === AuthManager.currentUser?.username || p.isDefault
    );
  }

  static getPublicPlaylists() {
    return this.playlists.filter((p) => p.isPublic);
  }

  static getAllPlaylists() {
    return this.playlists;
  }

  static updatePlaylist(playlistId, updates) {
    const playlist = this.getPlaylist(playlistId);
    if (!playlist) return false;

    if (
      playlist.createdBy !== AuthManager.currentUser?.username &&
      !playlist.isDefault
    ) {
      NotificationManager.show("You can only edit your own playlists", "error");
      return false;
    }

    // Don't allow editing default playlist properties
    if (
      playlist.isDefault &&
      (updates.name || updates.isPublic !== undefined)
    ) {
      NotificationManager.show(
        "Cannot modify default playlist properties",
        "error"
      );
      return false;
    }

    Object.assign(playlist, updates);
    this.savePlaylists();
    NotificationManager.show("Playlist updated", "success");
    return true;
  }

  static setupEventListeners() {
    // Listen for media player events to update "Recently Played"
    document.addEventListener("mediaPlayed", (e) => {
      this.addToRecentlyPlayed(e.detail.media);
    });
  }

  static addToRecentlyPlayed(mediaItem) {
    const recentPlaylist = this.playlists.find(
      (p) => p.name === "Recently Played"
    );
    if (!recentPlaylist) return;

    // Remove if already exists
    recentPlaylist.media = recentPlaylist.media.filter(
      (m) => m.id !== mediaItem.id
    );

    // Add to beginning
    recentPlaylist.media.unshift({
      id: mediaItem.id,
      title: mediaItem.title,
      artist: mediaItem.artist,
      duration: mediaItem.duration,
      type: mediaItem.type,
      thumbnail: mediaItem.thumbnail,
      addedAt: new Date().toISOString(),
    });

    // Keep only last 50 items
    if (recentPlaylist.media.length > 50) {
      recentPlaylist.media = recentPlaylist.media.slice(0, 50);
    }

    this.savePlaylists();
  }

  static renderPlaylistModal() {
    return `
      <div id="playlistModal" class="modal hidden">
        <div class="modal-content" style="max-width: 600px;">
          <div class="modal-header">
            <h2>Create New Playlist</h2>
            <button onclick="closePlaylistModal()" class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            <form id="playlistForm">
              <div class="form-group">
                <label for="playlistName">Playlist Name</label>
                <input type="text" id="playlistName" class="form-input" required maxlength="100">
                <div class="form-error" id="playlistNameError"></div>
              </div>
              <div class="form-group">
                <label for="playlistDescription">Description</label>
                <textarea id="playlistDescription" class="form-input" rows="3" maxlength="500"></textarea>
              </div>
              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" id="playlistPublic">
                  <span class="checkmark"></span>
                  Make this playlist public
                </label>
                <small class="text-muted">Public playlists can be viewed by other users</small>
              </div>
              <div class="form-actions">
                <button type="button" onclick="closePlaylistModal()" class="btn btn-ghost">Cancel</button>
                <button type="submit" class="btn btn-primary">Create Playlist</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  static renderPlaylistGrid() {
    const userPlaylists = this.getUserPlaylists();
    const publicPlaylists = this.getPublicPlaylists();

    return `
      <div class="playlist-section">
        <div class="flex justify-between items-center mb-6">
          <h2>My Playlists</h2>
          <button onclick="openPlaylistModal()" class="btn btn-primary">
            <span>+</span> New Playlist
          </button>
        </div>
        <div class="playlist-grid">
          ${userPlaylists
            .map((playlist) => this.renderPlaylistCard(playlist))
            .join("")}
        </div>
      </div>
      
      ${
        publicPlaylists.length > 0
          ? `
        <div class="playlist-section">
          <h2 class="mb-6">Public Playlists</h2>
          <div class="playlist-grid">
            ${publicPlaylists
              .map((playlist) => this.renderPlaylistCard(playlist, false))
              .join("")}
          </div>
        </div>
      `
          : ""
      }
    `;
  }

  static renderPlaylistCard(playlist, showActions = true) {
    const mediaCount = playlist.media.length;
    const isOwner = playlist.createdBy === AuthManager.currentUser?.username;

    return `
      <div class="playlist-card" onclick="openPlaylist('${playlist.id}')">
        <div class="playlist-thumbnail">
          ${
            playlist.media.length > 0
              ? `<img src="${
                  playlist.media[0].thumbnail || "/images/default-thumbnail.jpg"
                }" alt="${playlist.name}">`
              : `<div class="playlist-empty">🎵</div>`
          }
          <div class="playlist-overlay">
            <button class="play-btn" onclick="event.stopPropagation(); playPlaylist('${
              playlist.id
            }')">▶</button>
          </div>
        </div>
        <div class="playlist-info">
          <h3 class="playlist-name">${playlist.name}</h3>
          <p class="playlist-meta">${mediaCount} song${
      mediaCount !== 1 ? "s" : ""
    }</p>
          ${
            playlist.description
              ? `<p class="playlist-description">${playlist.description}</p>`
              : ""
          }
          <div class="playlist-badges">
            ${
              playlist.isPublic
                ? '<span class="badge badge-success">Public</span>'
                : '<span class="badge badge-secondary">Private</span>'
            }
            ${
              playlist.isDefault
                ? '<span class="badge badge-primary">Default</span>'
                : ""
            }
          </div>
        </div>
        ${
          showActions && isOwner && !playlist.isDefault
            ? `
          <div class="playlist-actions">
            <button onclick="event.stopPropagation(); editPlaylist('${playlist.id}')" class="btn btn-ghost btn-sm">Edit</button>
            <button onclick="event.stopPropagation(); deletePlaylistConfirm('${playlist.id}')" class="btn btn-ghost btn-sm text-danger">Delete</button>
          </div>
        `
            : ""
        }
      </div>
    `;
  }
}

// Global functions for playlist management
function openPlaylistModal() {
  if (!AuthManager.isAuthenticated) {
    NotificationManager.show("Please log in to create playlists", "warning");
    AuthManager.openAuthModal();
    return;
  }
  ModalManager.open("playlistModal");
}

function closePlaylistModal() {
  ModalManager.close("playlistModal");
  document.getElementById("playlistForm").reset();
}

function createPlaylist() {
  const form = document.getElementById("playlistForm");
  const name = document.getElementById("playlistName").value;
  const description = document.getElementById("playlistDescription").value;
  const isPublic = document.getElementById("playlistPublic").checked;

  if (!FormValidator.validatePlaylistForm(form)) {
    return;
  }

  const playlist = PlaylistManager.createPlaylist(name, description, isPublic);
  if (playlist) {
    closePlaylistModal();
    // Refresh playlist view if on playlists page
    if (
      window.location.pathname.includes("playlists") ||
      document.getElementById("playlistContainer")
    ) {
      renderPlaylists();
    }
  }
}

function openPlaylist(playlistId) {
  // Navigate to playlist detail view
  window.location.href = `/app/playlists/playlist-detail.html?id=${playlistId}`;
}

function playPlaylist(playlistId) {
  const playlist = PlaylistManager.getPlaylist(playlistId);
  if (!playlist || playlist.media.length === 0) {
    NotificationManager.show("Playlist is empty", "info");
    return;
  }

  // Start playing the first song in the playlist
  MediaPlayer.playPlaylist(playlist);
  NotificationManager.show(`Playing "${playlist.name}"`, "success");
}

function editPlaylist(playlistId) {
  // Open edit modal (implementation would be similar to create)
  console.log("Edit playlist:", playlistId);
  NotificationManager.show("Edit functionality coming soon", "info");
}

function deletePlaylistConfirm(playlistId) {
  const playlist = PlaylistManager.getPlaylist(playlistId);
  if (!playlist) return;

  if (confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
    if (PlaylistManager.deletePlaylist(playlistId)) {
      // Refresh playlist view
      if (document.getElementById("playlistContainer")) {
        renderPlaylists();
      }
    }
  }
}

function renderPlaylists() {
  const container = document.getElementById("playlistContainer");
  if (container) {
    container.innerHTML = PlaylistManager.renderPlaylistGrid();
  }
}

// Initialize playlist manager when page loads
document.addEventListener("DOMContentLoaded", () => {
  PlaylistManager.init();
});
