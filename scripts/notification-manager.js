// ISP Media - Enhanced Notification System
// Local notifications with different types and animations

class NotificationManager {
  static init() {
    this.notifications = [];
    this.createNotificationContainer();
    this.setupEventListeners();
  }

  static createNotificationContainer() {
    // Remove existing container if it exists
    const existing = document.getElementById("notificationContainer");
    if (existing) {
      existing.remove();
    }

    const container = document.createElement("div");
    container.id = "notificationContainer";
    container.className = "notification-container";
    document.body.appendChild(container);
  }

  static setupEventListeners() {
    // Listen for system events
    document.addEventListener("userLoggedIn", () => {
      this.show("Welcome back!", "success");
    });

    document.addEventListener("userLoggedOut", () => {
      this.show("You have been logged out", "info");
    });

    document.addEventListener("uploadStarted", () => {
      this.show("Upload started", "info");
    });

    document.addEventListener("uploadCompleted", (e) => {
      this.show(`Upload completed: ${e.detail.fileName}`, "success");
    });

    document.addEventListener("uploadFailed", (e) => {
      this.show(`Upload failed: ${e.detail.error}`, "error");
    });

    document.addEventListener("mediaPlayed", (e) => {
      this.show(`Now playing: ${e.detail.media.title}`, "info");
    });

    document.addEventListener("playlistCreated", (e) => {
      this.show(`Playlist "${e.detail.name}" created`, "success");
    });

    document.addEventListener("reviewAdded", (e) => {
      this.show("Review added successfully", "success");
    });
  }

  static show(message, type = "info", duration = 5000, options = {}) {
    const notification = {
      id:
        "notification-" +
        Date.now() +
        "-" +
        Math.random().toString(36).substr(2, 9),
      message,
      type,
      duration,
      persistent: options.persistent || false,
      actions: options.actions || [],
      progress: options.progress || null,
      timestamp: new Date(),
    };

    this.notifications.push(notification);
    this.renderNotification(notification);

    if (!notification.persistent && duration > 0) {
      setTimeout(() => {
        this.hide(notification.id);
      }, duration);
    }

    return notification.id;
  }

  static hide(notificationId) {
    const element = document.getElementById(notificationId);
    if (element) {
      element.classList.add("notification-exit");
      setTimeout(() => {
        element.remove();
        this.notifications = this.notifications.filter(
          (n) => n.id !== notificationId
        );
      }, 300);
    }
  }

  static hideAll() {
    const notifications = document.querySelectorAll(".notification");
    notifications.forEach((notification) => {
      this.hide(notification.id);
    });
  }

  static renderNotification(notification) {
    const container = document.getElementById("notificationContainer");
    const element = document.createElement("div");
    element.id = notification.id;
    element.className = `notification notification-${notification.type}`;

    element.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">
          ${this.getIcon(notification.type)}
        </div>
        <div class="notification-message">
          <p>${notification.message}</p>
          ${
            notification.progress !== null
              ? `
            <div class="notification-progress">
              <div class="progress-bar" style="width: ${notification.progress}%"></div>
            </div>
          `
              : ""
          }
        </div>
        <div class="notification-actions">
          ${notification.actions
            .map(
              (action) => `
            <button class="notification-action" onclick="${action.callback}">${action.label}</button>
          `
            )
            .join("")}
          <button class="notification-close" onclick="NotificationManager.hide('${
            notification.id
          }')">&times;</button>
        </div>
      </div>
    `;

    container.appendChild(element);

    // Trigger animation
    setTimeout(() => {
      element.classList.add("notification-show");
    }, 10);
  }

  static getIcon(type) {
    const icons = {
      success: "✅",
      error: "❌",
      warning: "⚠️",
      info: "ℹ️",
      upload: "📤",
      download: "📥",
      play: "▶️",
      pause: "⏸️",
      loading: "⏳",
    };
    return icons[type] || icons.info;
  }

  static showUploadProgress(fileName, progress) {
    const existingId = this.findNotificationByType("upload");
    if (existingId) {
      this.updateProgress(existingId, progress);
    } else {
      return this.show(`Uploading: ${fileName}`, "upload", 0, {
        persistent: true,
        progress: progress,
      });
    }
  }

  static updateProgress(notificationId, progress) {
    const element = document.getElementById(notificationId);
    if (element) {
      const progressBar = element.querySelector(".progress-bar");
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }

      const notification = this.notifications.find(
        (n) => n.id === notificationId
      );
      if (notification) {
        notification.progress = progress;

        if (progress >= 100) {
          setTimeout(() => {
            this.hide(notificationId);
          }, 1000);
        }
      }
    }
  }

  static findNotificationByType(type) {
    const notification = this.notifications.find((n) => n.type === type);
    return notification ? notification.id : null;
  }

  static showConfirmation(message, onConfirm, onCancel) {
    return this.show(message, "warning", 0, {
      persistent: true,
      actions: [
        {
          label: "Confirm",
          callback: `NotificationManager.handleConfirmation('${onConfirm}', true)`,
        },
        {
          label: "Cancel",
          callback: `NotificationManager.handleConfirmation('${onCancel}', false)`,
        },
      ],
    });
  }

  static handleConfirmation(callback, result) {
    // Execute callback function
    if (typeof callback === "function") {
      callback(result);
    } else if (typeof callback === "string") {
      // If callback is a string, evaluate it as a function name
      window[callback](result);
    }
  }

  static showSystemNotification(title, message, options = {}) {
    // Browser notification (requires permission)
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body: message,
        icon: options.icon || "/images/logo.png",
        tag: options.tag || "ispmedia",
        ...options,
      });
    } else {
      // Fallback to in-app notification
      this.show(`${title}: ${message}`, options.type || "info");
    }
  }

  static requestNotificationPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          this.show("Browser notifications enabled", "success");
        }
      });
    }
  }

  // Specific notification types
  static showSuccess(message, duration = 3000) {
    return this.show(message, "success", duration);
  }

  static showError(message, duration = 7000) {
    return this.show(message, "error", duration);
  }

  static showWarning(message, duration = 5000) {
    return this.show(message, "warning", duration);
  }

  static showInfo(message, duration = 4000) {
    return this.show(message, "info", duration);
  }

  static showLoading(message) {
    return this.show(message, "loading", 0, { persistent: true });
  }

  static showNetworkError() {
    return this.show(
      "Network error. Please check your connection.",
      "error",
      10000
    );
  }

  static showMaintenanceMode() {
    return this.show(
      "System is under maintenance. Some features may be unavailable.",
      "warning",
      0,
      {
        persistent: true,
      }
    );
  }

  // Bulk operations
  static showBulkOperation(operation, total) {
    return this.show(`${operation}: 0/${total}`, "info", 0, {
      persistent: true,
      progress: 0,
    });
  }

  static updateBulkOperation(notificationId, current, total) {
    const progress = Math.round((current / total) * 100);
    const element = document.getElementById(notificationId);
    if (element) {
      const messageElement = element.querySelector(".notification-message p");
      if (messageElement) {
        messageElement.textContent = `Processing: ${current}/${total}`;
      }
      this.updateProgress(notificationId, progress);
    }
  }

  // Toast-style notifications for quick feedback
  static toast(message, type = "info") {
    const toastContainer =
      document.getElementById("toastContainer") || this.createToastContainer();
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${this.getIcon(type)}</span>
      <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast-show");
    }, 10);

    setTimeout(() => {
      toast.classList.add("toast-hide");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 2000);
  }

  static createToastContainer() {
    const container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
    return container;
  }

  // Debug mode for development
  static enableDebugMode() {
    this.debugMode = true;
    console.log("NotificationManager: Debug mode enabled");
  }

  static debug(message) {
    if (this.debugMode) {
      console.log(`NotificationManager: ${message}`);
    }
  }
}

// Initialize notification manager
document.addEventListener("DOMContentLoaded", () => {
  NotificationManager.init();

  // Request notification permission on first visit
  if (localStorage.getItem("notificationPermissionRequested") !== "true") {
    setTimeout(() => {
      NotificationManager.requestNotificationPermission();
      localStorage.setItem("notificationPermissionRequested", "true");
    }, 5000);
  }
});
