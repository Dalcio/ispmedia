// ISPMedia - API Configuration and Client
// Handles all communication with the backend API

class ISPMediaAPI {
  constructor() {
    this.baseURL = 'http://localhost:3000/api';
    this.token = localStorage.getItem('ispmedia_token');
    this.user = JSON.parse(localStorage.getItem('ispmedia_user') || 'null');
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      
      // Handle 401 errors (token expired)
      if (error.message.includes('401') || error.message.includes('Token inválido')) {
        this.logout();
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
      
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    try {
      const response = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      this.setAuthData(response.token, response.user);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async login(credentials) {
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });

      this.setAuthData(response.token, response.user);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async verifyToken() {
    if (!this.token) return false;

    try {
      const response = await this.request('/auth/verify');
      this.user = response.user;
      localStorage.setItem('ispmedia_user', JSON.stringify(this.user));
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('ispmedia_token');
    localStorage.removeItem('ispmedia_user');
    window.location.href = '/web/index.html';
  }

  setAuthData(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('ispmedia_token', token);
    localStorage.setItem('ispmedia_user', JSON.stringify(user));
  }

  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  hasRole(...roles) {
    return this.user && roles.includes(this.user.role);
  }

  // User methods
  async getUserProfile() {
    return await this.request('/users/profile');
  }

  async updateUserProfile(profileData) {
    return await this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async getUsers() {
    return await this.request('/users');
  }

  // Music methods
  async getMusics(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return await this.request(`/musics?${queryParams}`);
  }

  async getMusicById(id) {
    return await this.request(`/musics/${id}`);
  }

  async createMusic(musicData) {
    return await this.request('/musics', {
      method: 'POST',
      body: JSON.stringify(musicData)
    });
  }

  async updateMusic(id, musicData) {
    return await this.request(`/musics/${id}`, {
      method: 'PUT',
      body: JSON.stringify(musicData)
    });
  }

  async deleteMusic(id) {
    return await this.request(`/musics/${id}`, {
      method: 'DELETE'
    });
  }

  async incrementPlayCount(musicId) {
    return await this.request(`/musics/${musicId}/play`, {
      method: 'POST'
    });
  }

  async getTopMusics(limit = 10) {
    return await this.request(`/musics/top?limit=${limit}`);
  }

  // Artist methods
  async getArtists(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return await this.request(`/artists?${queryParams}`);
  }

  async getArtistById(id) {
    return await this.request(`/artists/${id}`);
  }

  async createArtist(artistData) {
    return await this.request('/artists', {
      method: 'POST',
      body: JSON.stringify(artistData)
    });
  }

  async updateArtist(id, artistData) {
    return await this.request(`/artists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(artistData)
    });
  }

  async deleteArtist(id) {
    return await this.request(`/artists/${id}`, {
      method: 'DELETE'
    });
  }

  async getArtistAlbums(artistId) {
    return await this.request(`/artists/${artistId}/albums`);
  }

  async getArtistMusics(artistId) {
    return await this.request(`/artists/${artistId}/musics`);
  }

  // Album methods
  async getAlbums(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return await this.request(`/albums?${queryParams}`);
  }

  async getAlbumById(id) {
    return await this.request(`/albums/${id}`);
  }

  async createAlbum(albumData) {
    return await this.request('/albums', {
      method: 'POST',
      body: JSON.stringify(albumData)
    });
  }

  async updateAlbum(id, albumData) {
    return await this.request(`/albums/${id}`, {
      method: 'PUT',
      body: JSON.stringify(albumData)
    });
  }

  async deleteAlbum(id) {
    return await this.request(`/albums/${id}`, {
      method: 'DELETE'
    });
  }

  async getAlbumMusics(albumId) {
    return await this.request(`/albums/${albumId}/musics`);
  }

  // Playlist methods
  async getMyPlaylists() {
    return await this.request('/playlists/my');
  }

  async getPublicPlaylists(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return await this.request(`/playlists/public?${queryParams}`);
  }

  async getPlaylistById(id) {
    return await this.request(`/playlists/${id}`);
  }

  async createPlaylist(playlistData) {
    return await this.request('/playlists', {
      method: 'POST',
      body: JSON.stringify(playlistData)
    });
  }

  async updatePlaylist(id, playlistData) {
    return await this.request(`/playlists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(playlistData)
    });
  }

  async deletePlaylist(id) {
    return await this.request(`/playlists/${id}`, {
      method: 'DELETE'
    });
  }

  async addMusicToPlaylist(playlistId, musicId) {
    return await this.request(`/playlists/${playlistId}/musics`, {
      method: 'POST',
      body: JSON.stringify({ musicId })
    });
  }

  async removeMusicFromPlaylist(playlistId, musicId) {
    return await this.request(`/playlists/${playlistId}/musics/${musicId}`, {
      method: 'DELETE'
    });
  }

  async reorderPlaylistMusics(playlistId, musicIds) {
    return await this.request(`/playlists/${playlistId}/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ musicIds })
    });
  }

  // Review methods
  async getReviews(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return await this.request(`/reviews?${queryParams}`);
  }

  async getReviewById(id) {
    return await this.request(`/reviews/${id}`);
  }

  async createReview(reviewData) {
    return await this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  }

  async updateReview(id, reviewData) {
    return await this.request(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData)
    });
  }

  async deleteReview(id) {
    return await this.request(`/reviews/${id}`, {
      method: 'DELETE'
    });
  }

  async getItemStats(itemType, itemId) {
    const params = {};
    if (itemType === 'music') params.musicId = itemId;
    else if (itemType === 'album') params.albumId = itemId;
    else if (itemType === 'artist') params.artistId = itemId;
    
    const queryParams = new URLSearchParams(params);
    return await this.request(`/reviews/stats?${queryParams}`);
  }

  // Upload methods
  async uploadMusic(file, onProgress = null) {
    const formData = new FormData();
    formData.append('music', file);

    return await this.uploadFile('/upload/music', formData, onProgress);
  }

  async uploadImage(file, onProgress = null) {
    const formData = new FormData();
    formData.append('image', file);

    return await this.uploadFile('/upload/image', formData, onProgress);
  }

  async uploadMultiple(files, onProgress = null) {
    const formData = new FormData();
    
    Object.keys(files).forEach(fieldName => {
      if (files[fieldName]) {
        if (Array.isArray(files[fieldName])) {
          files[fieldName].forEach(file => {
            formData.append(fieldName, file);
          });
        } else {
          formData.append(fieldName, files[fieldName]);
        }
      }
    });

    return await this.uploadFile('/upload/multiple', formData, onProgress);
  }

  async uploadFile(endpoint, formData, onProgress = null) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            onProgress(percentComplete);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Resposta inválida do servidor'));
          }
        } else {
          try {
            const error = JSON.parse(xhr.responseText);
            reject(new Error(error.error || `HTTP ${xhr.status}`));
          } catch {
            reject(new Error(`Erro HTTP ${xhr.status}`));
          }
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Erro de rede'));
      });

      xhr.open('POST', `${this.baseURL}${endpoint}`);
      
      if (this.token) {
        xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
      }

      xhr.send(formData);
    });
  }

  async deleteFile(filename, type) {
    return await this.request(`/upload/files/${filename}?type=${type}`, {
      method: 'DELETE'
    });
  }

  async listFiles(type = null) {
    const params = type ? `?type=${type}` : '';
    return await this.request(`/upload/files${params}`);
  }

  async getFileInfo(filename, type) {
    return await this.request(`/upload/files/${filename}?type=${type}`);
  }

  // Health check
  async healthCheck() {
    return await this.request('/health');
  }
}

// Global API instance
window.ISPMediaAPI = new ISPMediaAPI();
