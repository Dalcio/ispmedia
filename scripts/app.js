// ISP Media - Application JavaScript

// Global Modal Management
class ModalManager {
  static open(modalId) {
    console.log("🔓 Opening modal:", modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
      console.log("✅ Modal found, removing hidden class");
      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden"; // Prevent background scroll
    } else {
      console.log("❌ Modal not found:", modalId);
    }
  }

  static close(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("hidden");
      document.body.style.overflow = "auto"; // Restore background scroll
    }
  }

  static closeOnOverlay(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === this) {
          ModalManager.close(modalId);
        }
      });
    }
  }
}

// Authentication System
class AuthManager {
  static init() {
    this.isAuthenticated = this.getStoredAuthState();
    this.currentUser = this.getStoredUserData();
    this.setupEventListeners();
    this.updateNavigation();
    this.highlightActivePage();

    // If user is already logged in, update UI
    if (this.isAuthenticated && this.currentUser) {
      setTimeout(() => {
        this.updateUIForLoggedInUser(this.currentUser);
      }, 100);
      setTimeout(() => {
        this.updateUIForLoggedInUser(this.currentUser);
      }, 1000);
    }
  }
  static setupEventListeners() {
    // Use event delegation for form submissions since forms are loaded dynamically
    document.addEventListener("submit", (e) => {
      if (e.target.id === "loginForm") {
        e.preventDefault();
        this.handleLogin(e);
      } else if (e.target.id === "registerForm") {
        e.preventDefault();
        this.handleRegister(e);
      }
    });

    // Setup protected navigation
    this.setupProtectedNavigation();
  }
  static setupProtectedNavigation() {
    // Add click handlers to protected navigation links
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a.nav-protected");
      if (link && !this.isAuthenticated) {
        e.preventDefault();
        this.showToast("Please log in to access this page.", "warning");
        this.openAuthModal();
        return false;
      }

      // Handle SPA routing for protected links
      const routeLink = e.target.closest("a[data-route]");
      if (
        routeLink &&
        routeLink.classList.contains("nav-protected") &&
        !this.isAuthenticated
      ) {
        e.preventDefault();
        this.showToast("Please log in to access this page.", "warning");
        this.openAuthModal();
        return false;
      }
    });

    // Add tooltips to protected items
    const protectedLinks = document.querySelectorAll(".nav-protected");
    protectedLinks.forEach((link) => {
      if (!this.isAuthenticated) {
        const tooltip = document.createElement("span");
        tooltip.className = "nav-tooltip";
        tooltip.textContent = "Login required";
        link.style.position = "relative";
        link.appendChild(tooltip);
      }
    });
  }
  static highlightActivePage() {
    const currentPath = window.location.pathname;
    const currentRoute = window.router ? window.router.currentRoute : null;
    const navLinks = document.querySelectorAll(".navbar-nav a");

    navLinks.forEach((link) => {
      link.classList.remove("active");

      // For SPA routing, use data-route attribute
      const linkRoute = link.getAttribute("data-route");
      if (linkRoute && currentRoute) {
        if (linkRoute === currentRoute) {
          link.classList.add("active");
        }
      } else {
        // Fallback for non-SPA mode
        let linkPath = link.getAttribute("href");
        if (linkPath && linkPath.startsWith("/")) {
          linkPath = linkPath;
        } else {
          linkPath = "/" + linkPath;
        }

        // Check if current page matches the link
        if (
          currentPath === linkPath ||
          (currentPath === "/" && linkPath.includes("index.html")) ||
          (currentPath.includes("/index.html") &&
            linkPath.includes("index.html")) ||
          (currentPath.includes("/app/home/") &&
            linkPath.includes("/app/home/")) ||
          (currentPath.includes("/app/dashboard/") &&
            linkPath.includes("/app/dashboard/")) ||
          (currentPath.includes("/app/files/") &&
            linkPath.includes("/app/files/")) ||
          (currentPath.includes("/app/admin/") &&
            linkPath.includes("/app/admin/"))
        ) {
          link.classList.add("active");
        }
      }
    });
  }

  static updateNavigation() {
    const protectedLinks = document.querySelectorAll(".nav-protected");

    protectedLinks.forEach((link) => {
      if (!this.isAuthenticated) {
        link.classList.add("disabled");
        link.style.cursor = "not-allowed";

        // Add tooltip if it doesn't exist
        if (!link.querySelector(".nav-tooltip")) {
          const tooltip = document.createElement("span");
          tooltip.className = "nav-tooltip";
          tooltip.textContent = "Login required";
          link.style.position = "relative";
          link.appendChild(tooltip);
        }
      } else {
        link.classList.remove("disabled");
        link.style.cursor = "pointer";
        link.style.opacity = "1";
        link.style.pointerEvents = "auto";

        // Remove tooltip
        const tooltip = link.querySelector(".nav-tooltip");
        if (tooltip) {
          tooltip.remove();
        }
      }
    });
  }

  static openAuthModal() {
    ModalManager.open("authModal");
  }
  static handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    console.log("🔐 Login attempt:", { email });

    // Simulate API call
    this.showLoading(e.target);

    setTimeout(() => {
      // Check credentials against mock users
      const user = FormValidator.validateCredentials(email, password);

      if (user) {
        console.log("✅ Login successful:", { email, username: user.username });
        this.hideLoading(e.target);
        ModalManager.close("authModal");
        this.showToast(`Welcome back, ${user.name}!`, "success");

        // Set authentication state with full user data
        this.isAuthenticated = true;
        this.currentUser = {
          email: user.email,
          username: user.username,
          name: user.name,
          id: user.id,
        };
        this.setStoredAuthState(true);
        this.setStoredUserData(this.currentUser);

        // Update UI to show logged in state
        this.updateUIForLoggedInUser(this.currentUser);
        this.updateNavigation();

        // Retry navbar update after a delay (in case navbar loads async)
        setTimeout(() => {
          this.updateUIForLoggedInUser(this.currentUser);
        }, 500);
        setTimeout(() => {
          this.updateUIForLoggedInUser(this.currentUser);
        }, 1500);
      } else {
        console.log("❌ Login failed for:", email);
        this.hideLoading(e.target);
        this.showToast(
          "Invalid email or password. Try: test@example.com / Test123!",
          "error"
        );
      }
    }, 1500);
  }
  static handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    console.log("📝 Registration attempt:", { username, email });

    if (password !== confirmPassword) {
      this.showToast("Passwords do not match!", "error");
      return;
    }

    // Check if user already exists
    const existingUsers = JSON.parse(
      localStorage.getItem("ispmedia_users") || "[]"
    );
    if (existingUsers.some((u) => u.email === email)) {
      this.showToast("Email already registered!", "error");
      return;
    }
    if (existingUsers.some((u) => u.username === username)) {
      this.showToast("Username already taken!", "error");
      return;
    }

    // Simulate API call
    this.showLoading(e.target);

    setTimeout(() => {
      // Create new user
      const newUser = {
        id: "user-" + Date.now(),
        username: username,
        email: email,
        password: password, // In real app, this would be hashed
        name: username,
        avatar: null,
        createdAt: new Date().toISOString(),
      };

      // Add to mock database
      existingUsers.push(newUser);
      localStorage.setItem("ispmedia_users", JSON.stringify(existingUsers));

      console.log("Registration successful:", { username, email });
      this.hideLoading(e.target);
      ModalManager.close("authModal");
      this.showToast(
        `Account created successfully! Welcome, ${username}!`,
        "success"
      );

      // Set authentication state
      this.isAuthenticated = true;
      this.currentUser = {
        email: newUser.email,
        username: newUser.username,
        name: newUser.name,
        id: newUser.id,
      };
      this.setStoredAuthState(true);
      this.setStoredUserData(this.currentUser);

      // Update UI to show logged in state
      this.updateUIForLoggedInUser(this.currentUser);
      this.updateNavigation();
    }, 2000);
  }

  static showLoading(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = "<span>Loading...</span>";
    }
  }

  static hideLoading(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
      const isLogin = form.id === "loginForm";
      submitBtn.innerHTML = isLogin ? "Sign In" : "Create Account";
    }
  }
  static updateUIForLoggedInUser(user) {
    // Update navbar to show user info instead of login button
    const navActions = document.getElementById("navActions");
    if (navActions) {
      navActions.innerHTML = `
        <span class="text-sm text-muted">Welcome, ${user.name}</span>
        <button class="btn btn-ghost btn-sm" onclick="AuthManager.logout()">Logout</button>
      `;
      console.log("✅ Navbar updated for logged in user");
    } else {
      console.log("❌ navActions element not found");
      // Fallback - try to find any navbar actions area
      const navbar = document.querySelector(".navbar-content");
      if (navbar) {
        const actionsDiv = navbar.querySelector(".flex.items-center.gap-3");
        if (actionsDiv) {
          actionsDiv.innerHTML = `
            <span class="text-sm text-muted">Welcome, ${user.name}</span>
            <button class="btn btn-ghost btn-sm" onclick="AuthManager.logout()">Logout</button>
          `;
          console.log("✅ Navbar updated via fallback method");
        }
      }
    }
  }
  static logout() {
    // Reset authentication state
    this.isAuthenticated = false;
    this.currentUser = null;
    this.setStoredAuthState(false);
    this.setStoredUserData(null);

    // Reset UI to logged out state
    location.reload(); // Simple refresh for demo
  }

  static getStoredAuthState() {
    return localStorage.getItem("isAuthenticated") === "true";
  }

  static setStoredAuthState(isAuthenticated) {
    localStorage.setItem("isAuthenticated", isAuthenticated.toString());
  }

  static getStoredUserData() {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  }

  static setStoredUserData(userData) {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userData");
    }
  }

  static showToast(message, type = "info") {
    // Create toast notification
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${
              type === "success"
                ? "var(--success)"
                : type === "error"
                ? "var(--error)"
                : "var(--info)"
            };
            color: white;
            padding: var(--space-4) var(--space-6);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "slideOutRight 0.3s ease-out";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Page Guard System for Authentication
class PageGuard {
  static init() {
    // Check if current page requires authentication
    if (this.isProtectedPage()) {
      this.checkAuthentication();
    }
  }

  static isProtectedPage() {
    const currentPath = window.location.pathname;
    const protectedPaths = [
      "/app/home/",
      "/app/dashboard/",
      "/app/files/",
      "/app/admin/",
    ];
    return protectedPaths.some((path) => currentPath.includes(path));
  }
  static checkAuthentication() {
    // Check if user is authenticated (you can extend this with localStorage, sessionStorage, etc.)
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

    if (!isAuthenticated) {
      // Redirect to home page with login prompt
      window.location.href = "/index.html";
    }
  }
  static getStoredAuthState() {
    return localStorage.getItem("isAuthenticated") === "true";
  }

  static setStoredAuthState(isAuthenticated) {
    localStorage.setItem("isAuthenticated", isAuthenticated.toString());
  }
}

// ===============================
// Application Initialization
// ===============================

// Global instances
// uploadManager is now a static class

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize page guard first
  PageGuard.init();

  // Initialize mock data first
  if (typeof MockDataManager !== "undefined") {
    MockDataManager.init();
  }
  // Display test credentials in console
  console.log(
    "%c🔑 ISP Media - Test Credentials",
    "color: #d4af37; font-size: 16px; font-weight: bold;"
  );
  console.log(
    "%cQuick test login options:",
    "color: #2563eb; font-weight: bold;"
  );
  console.log("• testuser / test@example.com / Test123!");
  console.log("• admin / admin@ispmedia.com / Admin123!");
  console.log("• demo / demo@test.com / Demo123!");
  console.log("• tester / tester@ispmedia.com / Tester123!");
  console.log("• musiclover / music@lover.com / Music123!");
  console.log("• producer / producer@studio.com / Prod123!");
  console.log(
    "%cOr create a new account via registration form",
    "color: #64748b; font-style: italic;"
  );
  console.log(
    "%cUse debugAuth() to check authentication status",
    "color: #64748b; font-style: italic;"
  );
  // Initialize systems
  AuthManager.init();

  // Check for test login from test page
  const testLogin = sessionStorage.getItem("testLogin");
  if (testLogin) {
    const { email, password } = JSON.parse(testLogin);
    sessionStorage.removeItem("testLogin");

    // Auto-fill and submit login form
    setTimeout(() => {
      const emailInput = document.querySelector(
        '#loginForm input[type="email"]'
      );
      const passwordInput = document.querySelector(
        '#loginForm input[type="password"]'
      );

      if (emailInput && passwordInput) {
        emailInput.value = email;
        passwordInput.value = password;

        // Open modal and submit
        ModalManager.open("authModal");
        setTimeout(() => {
          document
            .getElementById("loginForm")
            .dispatchEvent(new Event("submit"));
        }, 500);
      }
    }, 1000);
  }
  // Initialize other managers if available
  if (typeof NotificationManager !== "undefined") NotificationManager.init();
  if (typeof FormValidator !== "undefined") FormValidator.init();
  if (typeof PlaylistManager !== "undefined") PlaylistManager.init();
  if (typeof ReviewManager !== "undefined") ReviewManager.init();
  if (typeof MediaPlayer !== "undefined") MediaPlayer.init();
  if (typeof UploadManager !== "undefined") UploadManager.init();

  // Setup modal overlay clicks
  ModalManager.closeOnOverlay("authModal");
  ModalManager.closeOnOverlay("uploadModal");

  // Re-highlight active page after navigation is loaded
  setTimeout(() => {
    AuthManager.highlightActivePage();
  }, 100);
});

// Handle Upload Button Click
function handleUploadClick() {
  console.log("🔄 Upload click triggered");
  console.log("📋 Auth status:", AuthManager.isAuthenticated);

  if (AuthManager.isAuthenticated) {
    console.log("✅ User authenticated, opening upload modal");
    // User is logged in, open upload modal
    openUploadModal();
  } else {
    console.log("❌ User not authenticated");
    // User is not logged in, show login prompt and open auth modal
    AuthManager.showToast("Please log in to upload files.", "warning");
    openAuthModal();
  }
}

// Global functions for modal management
function openAuthModal() {
  ModalManager.open("authModal");
}

function closeAuthModal() {
  ModalManager.close("authModal");
}

function openUploadModal() {
  console.log("📤 Opening upload modal");
  const modal = document.getElementById("uploadModal");
  if (modal) {
    console.log("✅ Upload modal found, opening");
    ModalManager.open("uploadModal");
  } else {
    console.log("❌ Upload modal not found in DOM");
    AuthManager.showToast("Upload modal not loaded", "error");
  }
}

function closeUploadModal() {
  ModalManager.close("uploadModal");
}

// Auth tab switching
function switchTab(tab) {
  document
    .getElementById("loginTab")
    .classList.toggle("active", tab === "login");
  document
    .getElementById("registerTab")
    .classList.toggle("active", tab === "register");
  document
    .getElementById("loginForm")
    .classList.toggle("hidden", tab !== "login");
  document
    .getElementById("registerForm")
    .classList.toggle("hidden", tab !== "register");
}

// Upload functions
function handleDrop(e) {
  e.preventDefault();
  document.getElementById("uploadArea").classList.remove("drag-over");
  UploadManager.addFiles(e.dataTransfer.files);
}

function handleDragOver(e) {
  e.preventDefault();
  document.getElementById("uploadArea").classList.add("drag-over");
}

function handleDragLeave(e) {
  e.preventDefault();
  document.getElementById("uploadArea").classList.remove("drag-over");
}

function handleFileSelect(e) {
  UploadManager.addFiles(e.target.files);
}

function startUpload() {
  console.log("🚀 Starting upload via global function");
  UploadManager.startUpload();
}

function clearQueue() {
  console.log("🗑️ Clearing upload queue via global function");
  UploadManager.clearQueue();
}

// Add CSS for toast animations
const style = document.createElement("style");
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Global helper functions for testing
window.testLogin = function (
  email = "test@example.com",
  password = "Test123!"
) {
  console.log(`🔑 Attempting login with: ${email}`);

  // Find the login form and fill it
  const emailInput = document.querySelector('#loginForm input[type="email"]');
  const passwordInput = document.querySelector(
    '#loginForm input[type="password"]'
  );

  if (emailInput && passwordInput) {
    emailInput.value = email;
    passwordInput.value = password;

    // Submit the form
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.dispatchEvent(new Event("submit"));
    }
  } else {
    console.log("❌ Login form not found. Make sure you are on the main page.");
  }
};

window.showTestCredentials = function () {
  console.log(
    "%c🔑 Available Test Accounts:",
    "color: #d4af37; font-size: 14px; font-weight: bold;"
  );
  const users = JSON.parse(localStorage.getItem("ispmedia_users") || "[]");
  if (users.length === 0) {
    console.log(
      "%c❌ No users found! Mock data not loaded.",
      "color: #ef4444;"
    );
    console.log("Try running: MockDataManager.init()");
  } else {
    users.forEach((user) => {
      console.log(`👤 ${user.name} | 📧 ${user.email} | 🔒 ${user.password}`);
    });
  }
  console.log(
    "%cUse testLogin('email', 'password') to login instantly",
    "color: #64748b; font-style: italic;"
  );
};

window.debugAuth = function () {
  console.log(
    "%c🔍 Authentication Debug:",
    "color: #2563eb; font-size: 14px; font-weight: bold;"
  );
  console.log("Is Authenticated:", AuthManager.isAuthenticated);
  console.log("Current User:", AuthManager.currentUser);
  console.log(
    "Mock Users Count:",
    JSON.parse(localStorage.getItem("ispmedia_users") || "[]").length
  );
  console.log("LocalStorage Auth:", localStorage.getItem("isAuthenticated"));
  console.log("LocalStorage User:", localStorage.getItem("userData"));
};

window.refreshNavbar = function () {
  if (AuthManager.isAuthenticated && AuthManager.currentUser) {
    AuthManager.updateUIForLoggedInUser(AuthManager.currentUser);
    console.log("🔄 Navbar refreshed for logged in user");
  } else {
    console.log("❌ No user logged in to refresh navbar");
  }
};
