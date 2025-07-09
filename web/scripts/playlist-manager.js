// ISP Media - Playlist Manager
// Handles playlist functionality with real API

class PlaylistManager {
  static init() {
    this.api = window.ISPMediaAPI;
    this.playlists = [];
    this.loadPlaylists();
    this.setupEventListeners();
  }
  
  static async loadPlaylists() {
    try {
      if (!window.SessionManager?.isAuthenticated) {
        this.playlists = [];
        return;
      }
      
      const response = await this.api.getPlaylists();
      this.playlists = response.playlists || [];
    } catch (error) {
      console.error('Erro ao carregar playlists:', error);
      this.playlists = [];
      NotificationManager.show('Erro ao carregar playlists', 'error');
    }
  }
  static async createPlaylist(name, description, isPublic = false) {
    if (!window.SessionManager?.isAuthenticated) {
      NotificationManager.show("Please log in to create playlists", "warning");
      return null;
    }

    try {
      const playlistData = {
        name: name.trim(),
        description: description.trim(),
        isPublic: isPublic
      };
      
      const response = await this.api.createPlaylist(playlistData);
      const playlist = response.playlist;
      
      this.playlists.push(playlist);
      NotificationManager.show(`Playlist "${name}" created successfully`, "success");
      return playlist;
    } catch (error) {
      console.error('Erro ao criar playlist:', error);
      NotificationManager.show('Erro ao criar playlist: ' + error.message, 'error');
      return null;
    }
  }
  static async deletePlaylist(playlistId) {
    try {
      await this.api.deletePlaylist(playlistId);
      
      this.playlists = this.playlists.filter(p => p.id !== playlistId);
      NotificationManager.show("Playlist deleted successfully", "success");
      return true;
    } catch (error) {
      console.error('Erro ao deletar playlist:', error);
      NotificationManager.show('Erro ao deletar playlist: ' + error.message, 'error');
      return false;
    }  }
  static async addToPlaylist(playlistId, mediaItem) {
    try {
      await this.api.addToPlaylist(playlistId, mediaItem.id);
      
      // Update local playlist
      const playlist = this.getPlaylist(playlistId);
      if (playlist) {
        playlist.media.push({
          id: mediaItem.id,
          title: mediaItem.title,
          artist: mediaItem.artist,
          duration: mediaItem.duration,
          type: mediaItem.type,
          thumbnail: mediaItem.thumbnail,
          addedAt: new Date().toISOString(),
        });
      }
      
      NotificationManager.show(`Added to "${playlist?.name || 'playlist'}"`, "success");
      return true;
    } catch (error) {
      console.error('Erro ao adicionar à playlist:', error);
      NotificationManager.show('Erro ao adicionar à playlist: ' + error.message, 'error');
      return false;
    }
  }

  static async removeFromPlaylist(playlistId, mediaId) {
    try {
      await this.api.removeFromPlaylist(playlistId, mediaId);
      
      // Update local playlist
      const playlist = this.getPlaylist(playlistId);
      if (playlist) {
        playlist.media = playlist.media.filter((m) => m.id !== mediaId);
      }
      
      NotificationManager.show("Removed from playlist", "info");
      return true;
    } catch (error) {
      console.error('Erro ao remover da playlist:', error);
      NotificationManager.show('Erro ao remover da playlist: ' + error.message, 'error');
      return false;
    }
  }

  static getPlaylist(playlistId) {
    return this.playlists.find((p) => p.id === playlistId);
  }
  static getUserPlaylists() {
    if (!window.SessionManager?.isAuthenticated) return [];
    return this.playlists.filter(
      (p) => p.createdBy === window.SessionManager.currentUser?.username
    );
  }

  static getPublicPlaylists() {
    return this.playlists.filter((p) => p.isPublic);
  }

  static getAllPlaylists() {
    return this.playlists;
  }
  static async updatePlaylist(playlistId, updates) {
    try {
      await this.api.updatePlaylist(playlistId, updates);
      
      // Update local playlist
      const playlist = this.getPlaylist(playlistId);
      if (playlist) {
        Object.assign(playlist, updates);
      }
      
      NotificationManager.show("Playlist updated", "success");
      return true;
    } catch (error) {
      console.error('Erro ao atualizar playlist:', error);
      NotificationManager.show('Erro ao atualizar playlist: ' + error.message, 'error');
      return false;
    }
  }

  static setupEventListeners() {
    // Listen for media player events to update "Recently Played"
    document.addEventListener("mediaPlayed", (e) => {
      this.addToRecentlyPlayed(e.detail.media);
    });
  }
  static addToRecentlyPlayed(mediaItem) {
    // For now, we'll just store recently played in memory
    // Later this could be stored in user's session or sent to backend
    if (!this.recentlyPlayed) {
      this.recentlyPlayed = [];
    }

    // Remove if already exists
    this.recentlyPlayed = this.recentlyPlayed.filter(
      (m) => m.id !== mediaItem.id
    );

    // Add to beginning
    this.recentlyPlayed.unshift({
      id: mediaItem.id,
      title: mediaItem.title,
      artist: mediaItem.artist,
      duration: mediaItem.duration,
      type: mediaItem.type,
      thumbnail: mediaItem.thumbnail,
      addedAt: new Date().toISOString(),
    });    // Keep only last 50 items
    if (this.recentlyPlayed.length > 50) {
      this.recentlyPlayed = this.recentlyPlayed.slice(0, 50);
    }
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
