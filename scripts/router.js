// SPA Router for ISP Media
class SPARouter {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.contentContainer = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;

    this.contentContainer =
      document.getElementById("app-content") || document.body;
    this.setupRoutes();
    this.setupEventListeners();
    this.handleInitialRoute();
    this.isInitialized = true;
  }

  setupRoutes() {
    // Define all routes for the SPA
    this.routes.set("/", {
      title: "Home - ISP Media",
      component: "home",
      path: "/index.html",
      requiresAuth: false,
    });

    this.routes.set("/dashboard", {
      title: "Dashboard - ISP Media",
      component: "dashboard",
      path: "/app/home/home.html",
      requiresAuth: true,
    });

    this.routes.set("/files", {
      title: "File Manager - ISP Media",
      component: "files",
      path: "/app/files/file-manager.html",
      requiresAuth: true,
    });

    this.routes.set("/admin", {
      title: "Admin Panel - ISP Media",
      component: "admin",
      path: "/app/admin/admin.html",
      requiresAuth: true,
    });

    // Media detail routes
    this.routes.set("/media/:id", {
      title: "Media Detail - ISP Media",
      component: "media-detail",
      path: "/app/media/media-detail.html",
      requiresAuth: true,
    });

    this.routes.set("/album/:id", {
      title: "Album - ISP Media",
      component: "album-detail",
      path: "/app/media/album-detail.html",
      requiresAuth: true,
    });

    this.routes.set("/artist/:id", {
      title: "Artist - ISP Media",
      component: "artist-detail",
      path: "/app/media/artist-detail.html",
      requiresAuth: true,
    });
  }

  setupEventListeners() {
    // Handle browser back/forward
    window.addEventListener("popstate", (e) => {
      this.handleRoute(window.location.pathname, false);
    });

    // Intercept navigation clicks
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a[data-route]");
      if (link && !link.hasAttribute("data-external")) {
        e.preventDefault();
        const route = link.getAttribute("data-route");
        this.navigateTo(route);
      }
    });

    // Handle navbar updates
    document.addEventListener("routeChanged", (e) => {
      this.updateNavigation(e.detail.route);
    });
  }

  navigateTo(route, addToHistory = true) {
    // Check authentication if required
    const routeConfig = this.routes.get(route) || this.findDynamicRoute(route);

    if (!routeConfig) {
      console.warn(`Route not found: ${route}`);
      return;
    }

    if (routeConfig.requiresAuth && !AuthManager.isAuthenticated) {
      AuthManager.showToast("Please log in to access this page.", "warning");
      AuthManager.openAuthModal();
      return;
    }

    this.handleRoute(route, addToHistory);
  }

  findDynamicRoute(route) {
    // Handle dynamic routes like /media/:id
    for (const [pattern, config] of this.routes) {
      if (pattern.includes(":")) {
        const regex = new RegExp(
          "^" + pattern.replace(/:[^\s/]+/g, "([^/]+)") + "$"
        );
        if (regex.test(route)) {
          return { ...config, params: this.extractParams(pattern, route) };
        }
      }
    }
    return null;
  }

  extractParams(pattern, route) {
    const patternParts = pattern.split("/");
    const routeParts = route.split("/");
    const params = {};

    patternParts.forEach((part, index) => {
      if (part.startsWith(":")) {
        const paramName = part.substring(1);
        params[paramName] = routeParts[index];
      }
    });

    return params;
  }

  async handleRoute(route, addToHistory = true) {
    try {
      const routeConfig =
        this.routes.get(route) || this.findDynamicRoute(route);

      if (!routeConfig) {
        this.handle404();
        return;
      }

      // Update browser history
      if (addToHistory) {
        window.history.pushState({ route }, routeConfig.title, route);
      }

      // Update page title
      document.title = routeConfig.title;

      // Load and render content
      await this.renderRoute(routeConfig, route);

      // Update navigation
      this.updateNavigation(route);

      // Dispatch route change event
      document.dispatchEvent(
        new CustomEvent("routeChanged", {
          detail: { route, config: routeConfig },
        })
      );

      this.currentRoute = route;
    } catch (error) {
      console.error("Error handling route:", error);
      this.handle404();
    }
  }

  async renderRoute(routeConfig, route) {
    // Show loading state
    this.showLoadingState();

    try {
      let content = "";

      if (routeConfig.component === "home") {
        content = await this.loadHomePage();
      } else if (routeConfig.component === "media-detail") {
        content = await this.loadMediaDetail(routeConfig.params);
      } else if (routeConfig.component === "album-detail") {
        content = await this.loadAlbumDetail(routeConfig.params);
      } else if (routeConfig.component === "artist-detail") {
        content = await this.loadArtistDetail(routeConfig.params);
      } else {
        // Load existing pages
        content = await this.loadExistingPage(routeConfig.path);
      }
      // Update content container with smooth transition
      this.contentContainer.style.opacity = "0";
      this.contentContainer.style.transform = "translateY(10px)";

      setTimeout(() => {
        this.contentContainer.innerHTML = content;
        this.contentContainer.style.opacity = "1";
        this.contentContainer.style.transform = "translateY(0)";
      }, 150);

      // Initialize any page-specific JavaScript
      setTimeout(() => {
        this.initializePageScripts(routeConfig.component);
      }, 200);
    } catch (error) {
      console.error("Error rendering route:", error);
      this.contentContainer.innerHTML =
        '<div class="error">Error loading page</div>';
    } finally {
      this.hideLoadingState();
    }
  }
  async loadHomePage() {
    // Load home page content from template
    const homeTemplate = document.getElementById("home-content-template");
    if (homeTemplate) {
      return homeTemplate.innerHTML;
    } else {
      // Fallback - load from index.html
      const response = await fetch("/index.html");
      const html = await response.text();

      // Extract content between main tags or body
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const template = doc.getElementById("home-content-template");

      if (template) {
        return template.innerHTML;
      } else {
        // Final fallback - get everything except navbar
        const content = doc.querySelector("body").innerHTML;
        return content.replace(/<div id="navbar-container"><\/div>/, "");
      }
    }
  }

  async loadExistingPage(path) {
    const response = await fetch(path);
    const html = await response.text();

    // Extract content from the page
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const main = doc.querySelector("main") || doc.querySelector("body");

    return main.innerHTML.replace(/<div id="navbar-container"><\/div>/, "");
  }

  async loadMediaDetail(params) {
    const mediaId = params.id;
    // Generate dynamic media detail page
    return `
      <div class="container" style="padding: var(--space-8) var(--space-6)">
        <div class="flex items-center gap-4 mb-6">
          <button onclick="router.goBack()" class="btn btn-ghost">
            ← Back
          </button>
          <h1>Media Detail</h1>
        </div>
        
        <div class="grid" style="grid-template-columns: 1fr 2fr; gap: var(--space-8)">
          <div class="card">
            <div class="media-preview" style="aspect-ratio: 16/9; background: var(--surface-secondary); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-4)">
              <span style="font-size: 4rem; opacity: 0.5">🎵</span>
            </div>
            <div class="text-center">
              <h3 class="mb-2">Sample Media ${mediaId}</h3>
              <p class="text-gray mb-4">Sample Artist</p>
              <div class="flex justify-center gap-2">
                <button class="btn btn-primary">Play</button>
                <button class="btn btn-secondary">Download</button>
              </div>
            </div>
          </div>
          
          <div class="card">
            <h4 class="mb-4">Media Information</h4>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray">Title:</span>
                <span>Sample Media ${mediaId}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray">Artist:</span>
                <span>Sample Artist</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray">Duration:</span>
                <span>3:45</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray">Size:</span>
                <span>8.5 MB</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray">Format:</span>
                <span>MP3</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray">Upload Date:</span>
                <span>Dec 10, 2024</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-8">
          <h4 class="mb-4">Related Media</h4>
          <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4)">
            ${this.generateRelatedMedia(3)}
          </div>
        </div>
      </div>
    `;
  }

  async loadAlbumDetail(params) {
    const albumId = params.id;
    return `
      <div class="container" style="padding: var(--space-8) var(--space-6)">
        <div class="flex items-center gap-4 mb-6">
          <button onclick="router.goBack()" class="btn btn-ghost">
            ← Back
          </button>
          <h1>Album Detail</h1>
        </div>
        
        <div class="grid" style="grid-template-columns: 300px 1fr; gap: var(--space-8)">
          <div class="card text-center">
            <div class="album-cover" style="aspect-ratio: 1; background: var(--surface-secondary); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-4)">
              <span style="font-size: 4rem; opacity: 0.5">💿</span>
            </div>
            <h3 class="mb-2">Sample Album ${albumId}</h3>
            <p class="text-gray mb-4">Sample Artist • 2024</p>
            <div class="flex justify-center gap-2">
              <button class="btn btn-primary">Play All</button>
              <button class="btn btn-secondary">Download</button>
            </div>
          </div>
          
          <div class="card">
            <h4 class="mb-4">Track List</h4>
            <div class="space-y-2">
              ${this.generateTrackList(8)}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async loadArtistDetail(params) {
    const artistId = params.id;
    return `
      <div class="container" style="padding: var(--space-8) var(--space-6)">
        <div class="flex items-center gap-4 mb-6">
          <button onclick="router.goBack()" class="btn btn-ghost">
            ← Back
          </button>
          <h1>Artist Detail</h1>
        </div>
        
        <div class="grid" style="grid-template-columns: 300px 1fr; gap: var(--space-8)">
          <div class="card text-center">
            <div class="artist-photo" style="aspect-ratio: 1; background: var(--surface-secondary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-4)">
              <span style="font-size: 4rem; opacity: 0.5">🎤</span>
            </div>
            <h3 class="mb-2">Sample Artist ${artistId}</h3>
            <p class="text-gray mb-4">Electronic, Pop</p>
            <div class="flex justify-center gap-2">
              <button class="btn btn-primary">Play Top Songs</button>
              <button class="btn btn-secondary">Follow</button>
            </div>
          </div>
          
          <div class="space-y-6">
            <div class="card">
              <h4 class="mb-4">Top Songs</h4>
              <div class="space-y-2">
                ${this.generateTrackList(5)}
              </div>
            </div>
            
            <div class="card">
              <h4 class="mb-4">Albums</h4>
              <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--space-4)">
                ${this.generateAlbumGrid(3)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  generateRelatedMedia(count) {
    let html = "";
    for (let i = 1; i <= count; i++) {
      html += `
        <div class="card interactive" onclick="router.navigateTo('/media/${
          i + 10
        }')">
          <div class="media-thumb" style="aspect-ratio: 16/9; background: var(--surface-secondary); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-3)">
            <span style="font-size: 2rem; opacity: 0.5">🎵</span>
          </div>
          <h5 class="mb-1">Related Media ${i}</h5>
          <p class="text-gray text-sm">Sample Artist</p>
        </div>
      `;
    }
    return html;
  }

  generateTrackList(count) {
    let html = "";
    for (let i = 1; i <= count; i++) {
      html += `
        <div class="flex items-center justify-between p-3 rounded hover:bg-surface-secondary cursor-pointer" onclick="router.navigateTo('/media/${i}')">
          <div class="flex items-center gap-3">
            <span class="text-gray text-sm" style="width: 20px">${i}</span>
            <div>
              <h5 class="mb-1">Track ${i}</h5>
              <p class="text-gray text-sm">Sample Artist</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-gray text-sm">3:${String(i * 7).padStart(
              2,
              "0"
            )}</span>
            <button class="btn btn-ghost btn-sm">Play</button>
          </div>
        </div>
      `;
    }
    return html;
  }

  generateAlbumGrid(count) {
    let html = "";
    for (let i = 1; i <= count; i++) {
      html += `
        <div class="card interactive" onclick="router.navigateTo('/album/${i}')">
          <div class="album-thumb" style="aspect-ratio: 1; background: var(--surface-secondary); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-3)">
            <span style="font-size: 2rem; opacity: 0.5">💿</span>
          </div>
          <h5 class="mb-1">Album ${i}</h5>
          <p class="text-gray text-sm">2024</p>
        </div>
      `;
    }
    return html;
  }

  initializePageScripts(component) {
    // Initialize page-specific functionality
    switch (component) {
      case "home":
        this.initializeHomePage();
        break;
      case "media-detail":
      case "album-detail":
      case "artist-detail":
        this.initializeMediaPages();
        break;
      default:
        // Initialize common scripts
        this.initializeCommonScripts();
    }
  }
  initializeHomePage() {
    // Reinitialize home page functionality
    window.handleUploadClick = () => {
      if (AuthManager.isAuthenticated) {
        if (window.uploadManager) {
          ModalManager.open("uploadModal");
        } else {
          AuthManager.showToast("Upload system not ready", "error");
        }
      } else {
        AuthManager.showToast("Please log in to upload files.", "warning");
        AuthManager.openAuthModal();
      }
    };

    // Initialize media navigation functions
    window.navigateToMedia = (mediaId) => {
      this.navigateTo(`/media/${mediaId}`);
    };

    window.navigateToAlbum = (albumId) => {
      this.navigateTo(`/album/${albumId}`);
    };

    window.navigateToArtist = (artistId) => {
      this.navigateTo(`/artist/${artistId}`);
    };
  }

  initializeMediaPages() {
    // Initialize media page functionality
    // This would include media player controls, etc.
  }

  initializeCommonScripts() {
    // Initialize common functionality across pages
    if (typeof AuthManager !== "undefined") {
      AuthManager.updateNavigation();
    }
  }

  updateNavigation(currentRoute) {
    // Update active navigation state
    const navLinks = document.querySelectorAll("[data-route]");
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("data-route") === currentRoute) {
        link.classList.add("active");
      }
    });
  }

  showLoadingState() {
    if (this.contentContainer) {
      this.contentContainer.innerHTML = `
        <div class="loading-container" style="display: flex; align-items: center; justify-content: center; height: 50vh;">
          <div class="loading-spinner" style="width: 40px; height: 40px; border: 3px solid var(--surface-secondary); border-top: 3px solid var(--primary); border-radius: 50%; animation: spin 1s linear infinite;"></div>
        </div>
      `;
    }
  }

  hideLoadingState() {
    // Loading state is replaced by actual content
  }

  goBack() {
    window.history.back();
  }

  handleInitialRoute() {
    const currentPath = window.location.pathname;

    // Map current paths to SPA routes
    let route = "/";
    if (currentPath.includes("/app/home/")) route = "/dashboard";
    else if (currentPath.includes("/app/files/")) route = "/files";
    else if (currentPath.includes("/app/admin/")) route = "/admin";

    this.handleRoute(route, false);
  }

  handle404() {
    this.contentContainer.innerHTML = `
      <div class="container text-center" style="padding: var(--space-20) var(--space-6)">
        <h1 class="mb-4">404 - Page Not Found</h1>
        <p class="text-gray mb-6">The page you're looking for doesn't exist.</p>
        <button onclick="router.navigateTo('/')" class="btn btn-primary">Go Home</button>
      </div>
    `;
  }
}

// Initialize router
const router = new SPARouter();

// Export for global use
window.router = router;
