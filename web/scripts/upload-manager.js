// ISP Media - Enhanced Upload Manager with Drag & Drop and Validation
// Real upload functionality with backend API

class UploadManager {
  static init() {
    console.log("📤 Initializing UploadManager...");
    this.api = window.ISPMediaAPI;
    this.uploadQueue = [];
    this.isUploading = false;
    this.supportedTypes = {
      image: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
      ],
      video: ["video/mp4", "video/webm", "video/avi", "video/mov", "video/wmv"],
      audio: ["audio/mp3", "audio/wav", "audio/ogg", "audio/m4a", "audio/flac"],
      document: [
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
    };
    this.maxFileSize = 100 * 1024 * 1024; // 100MB
    this.maxQueueSize = 20;
    this.setupEventListeners();
    this.loadStoredUploads();
    console.log("✅ UploadManager initialized successfully");
  }

  static setupEventListeners() {
    // Global drag and drop
    document.addEventListener("dragover", this.handleDragOver.bind(this));
    document.addEventListener("drop", this.handleDrop.bind(this));
    document.addEventListener("dragleave", this.handleDragLeave.bind(this));

    // File input changes
    document.addEventListener("change", (e) => {
      if (
        e.target.type === "file" &&
        e.target.classList.contains("upload-input")
      ) {
        this.handleFileSelect(e);
      }
    });

    // Upload zone events
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("upload-zone")) {
        const fileInput = e.target.querySelector('input[type="file"]');
        if (fileInput) fileInput.click();
      }
    });
  }

  static handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();

    // Only handle drag over upload areas
    const uploadArea = e.target.closest(".upload-area, .upload-zone");
    if (uploadArea) {
      uploadArea.classList.add("drag-over");
      e.dataTransfer.dropEffect = "copy";
    }
  }

  static handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();

    const uploadArea = e.target.closest(".upload-area, .upload-zone");
    if (uploadArea && !uploadArea.contains(e.relatedTarget)) {
      uploadArea.classList.remove("drag-over");
    }
  }

  static handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    const uploadArea = e.target.closest(".upload-area, .upload-zone");
    if (uploadArea) {
      uploadArea.classList.remove("drag-over");
      const files = Array.from(e.dataTransfer.files);
      this.addFiles(files);
    }
  }

  static handleFileSelect(e) {
    const files = Array.from(e.target.files);
    this.addFiles(files);
  }

  static addFiles(files) {
    if (!AuthManager.isAuthenticated) {
      NotificationManager.show("Please log in to upload files", "warning");
      AuthManager.openAuthModal();
      return;
    }

    if (this.uploadQueue.length >= this.maxQueueSize) {
      NotificationManager.show(
        `Maximum ${this.maxQueueSize} files allowed in queue`,
        "warning"
      );
      return;
    }

    const validFiles = [];
    const errors = [];

    for (let file of files) {
      const validation = this.validateFile(file);
      if (validation.valid) {
        const uploadItem = {
          id:
            "upload-" +
            Date.now() +
            "-" +
            Math.random().toString(36).substr(2, 9),
          file: file,
          name: file.name,
          size: file.size,
          type: file.type,
          status: "pending",
          progress: 0,
          thumbnail: null,
          uploadedAt: null,
          error: null,
        };

        // Generate thumbnail for images
        if (file.type.startsWith("image/")) {
          this.generateThumbnail(file, uploadItem);
        }

        validFiles.push(uploadItem);
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    }

    if (errors.length > 0) {
      NotificationManager.show(
        `Upload errors:\n${errors.join("\n")}`,
        "error",
        8000
      );
    }

    if (validFiles.length > 0) {
      this.uploadQueue.push(...validFiles);
      this.updateQueueDisplay();
      NotificationManager.show(
        `${validFiles.length} file(s) added to upload queue`,
        "success"
      );
    }
  }

  static validateFile(file) {
    // Check file size
    if (file.size > this.maxFileSize) {
      return {
        valid: false,
        error: `File size exceeds ${this.formatFileSize(
          this.maxFileSize
        )} limit`,
      };
    }

    // Check file type
    const isSupported = Object.values(this.supportedTypes)
      .flat()
      .includes(file.type);
    if (!isSupported) {
      return {
        valid: false,
        error: `File type ${file.type} is not supported`,
      };
    }

    // Check filename
    if (file.name.length > 255) {
      return {
        valid: false,
        error: "Filename is too long (max 255 characters)",
      };
    }

    // Check for malicious extensions
    const dangerousExtensions = [
      ".exe",
      ".bat",
      ".cmd",
      ".scr",
      ".pif",
      ".vbs",
      ".js",
    ];
    const extension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));
    if (dangerousExtensions.includes(extension)) {
      return {
        valid: false,
        error: "File type not allowed for security reasons",
      };
    }

    return { valid: true };
  }

  static generateThumbnail(file, uploadItem) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Calculate thumbnail size (max 200x200)
        const maxSize = 200;
        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        uploadItem.thumbnail = canvas.toDataURL("image/jpeg", 0.8);
        this.updateQueueDisplay();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  static async startUpload() {
    if (this.isUploading) {
      NotificationManager.show("Upload already in progress", "warning");
      return;
    }

    if (this.uploadQueue.length === 0) {
      NotificationManager.show("No files to upload", "info");
      return;
    }

    this.isUploading = true;
    const pendingFiles = this.uploadQueue.filter(
      (item) => item.status === "pending"
    );

    NotificationManager.show(
      `Starting upload of ${pendingFiles.length} file(s)`,
      "info"
    );

    // Upload files sequentially
    for (let uploadItem of pendingFiles) {
      await this.uploadFile(uploadItem);
    }

    this.isUploading = false;
    this.saveUploadHistory();
    NotificationManager.show("All uploads completed", "success");

    // Auto-close modal if all uploads successful
    const hasErrors = this.uploadQueue.some((item) => item.status === "error");
    if (!hasErrors) {
      setTimeout(() => {
        this.clearQueue();
        if (document.getElementById("uploadModal")) {
          closeUploadModal();
        }
      }, 2000);
    }
  }
  static async uploadFile(uploadItem) {
    if (!window.SessionManager?.isAuthenticated) {
      uploadItem.status = "error";
      uploadItem.error = "Please log in to upload files";
      this.updateQueueDisplay();
      return;
    }

    uploadItem.status = "uploading";
    uploadItem.error = null;
    this.updateQueueDisplay();

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', uploadItem.file);
      formData.append('title', uploadItem.title || uploadItem.name);
      formData.append('description', uploadItem.description || '');
      formData.append('category', uploadItem.category || 'media');

      // Upload to backend
      const response = await this.api.uploadFile(formData, (progress) => {
        uploadItem.progress = progress;
        this.updateQueueDisplay();
      });

      uploadItem.status = "completed";
      uploadItem.progress = 100;
      uploadItem.uploadedAt = new Date().toISOString();
      uploadItem.fileId = response.file?.id;
      uploadItem.fileUrl = response.file?.url;

      // Add to media library
      this.addToMediaLibrary(uploadItem);

      document.dispatchEvent(
        new CustomEvent("uploadCompleted", {
          detail: { fileName: uploadItem.name, uploadItem },
        })
      );
      
      NotificationManager.show(`File "${uploadItem.name}" uploaded successfully`, "success");
    } catch (error) {
      uploadItem.status = "error";
      uploadItem.error = error.message;

      document.dispatchEvent(
        new CustomEvent("uploadFailed", {
          detail: { fileName: uploadItem.name, error: error.message },
        })
      );
      
      NotificationManager.show(`Upload failed: ${error.message}`, "error");
    }

    this.updateQueueDisplay();
  }

  static async simulateUpload(uploadItem) {
    const totalSteps = 100;
    const stepDelay = 50; // 50ms per step = ~5 seconds total

    for (let step = 1; step <= totalSteps; step++) {
      await new Promise((resolve) => setTimeout(resolve, stepDelay));

      uploadItem.progress = step;
      this.updateQueueDisplay();

      // Simulate random upload failures (5% chance)
      if (step === 50 && Math.random() < 0.05) {
        throw new Error("Network error during upload");
      }
    }
  }
  static addToMediaLibrary(uploadItem) {
    // The media item is already created by the backend
    // We just need to dispatch the event for other components
    if (uploadItem.fileId) {
      const mediaItem = {
        id: uploadItem.fileId,
        title: uploadItem.title || uploadItem.name.replace(/\.[^/.]+$/, ""),
        filename: uploadItem.name,
        type: uploadItem.type,
        size: uploadItem.size,
        thumbnail: uploadItem.thumbnail,
        url: uploadItem.fileUrl,
        uploadedBy: window.SessionManager.currentUser?.username || "anonymous",
        uploadedAt: uploadItem.uploadedAt,
        description: uploadItem.description || "",
        tags: [],
        views: 0,
        likes: 0,
        downloads: 0,
        isPublic: false,
      };

      // Dispatch event for other components
      document.dispatchEvent(
        new CustomEvent("mediaAdded", {
          detail: { media: mediaItem },        })
      );
    }
  }

  static removeFromQueue(uploadId) {
    this.uploadQueue = this.uploadQueue.filter((item) => item.id !== uploadId);
    this.updateQueueDisplay();
    NotificationManager.show("File removed from queue", "info");
  }

  static clearQueue() {
    this.uploadQueue = [];
    this.updateQueueDisplay();
  }

  static retryUpload(uploadId) {
    const uploadItem = this.uploadQueue.find((item) => item.id === uploadId);
    if (uploadItem) {
      uploadItem.status = "pending";
      uploadItem.progress = 0;
      uploadItem.error = null;
      this.updateQueueDisplay();
      NotificationManager.show("File queued for retry", "info");
    }
  }

  static updateQueueDisplay() {
    const container = document.getElementById("uploadQueue");
    if (!container) return;

    if (this.uploadQueue.length === 0) {
      container.innerHTML =
        '<p class="text-muted text-center">No files in queue</p>';
      return;
    }

    container.innerHTML = this.uploadQueue
      .map((item) => this.renderUploadItem(item))
      .join("");

    // Update progress summary
    const summary = document.getElementById("uploadSummary");
    if (summary) {
      const completed = this.uploadQueue.filter(
        (item) => item.status === "completed"
      ).length;
      const total = this.uploadQueue.length;
      const inProgress = this.uploadQueue.filter(
        (item) => item.status === "uploading"
      ).length;

      summary.innerHTML = `
        <div class="upload-summary">
          <span>Progress: ${completed}/${total} completed</span>
          ${
            inProgress > 0
              ? `<span class="text-primary">${inProgress} uploading...</span>`
              : ""
          }
        </div>
      `;
    }
  }

  static renderUploadItem(item) {
    const statusIcons = {
      pending: "⏳",
      uploading: "📤",
      completed: "✅",
      error: "❌",
    };

    const statusColors = {
      pending: "text-muted",
      uploading: "text-primary",
      completed: "text-success",
      error: "text-danger",
    };

    return `
      <div class="upload-item" data-upload-id="${item.id}">
        <div class="upload-thumbnail">
          ${
            item.thumbnail
              ? `<img src="${item.thumbnail}" alt="${item.name}">`
              : `<div class="file-icon">${this.getFileIcon(item.type)}</div>`
          }
        </div>
        <div class="upload-info">
          <h4 class="upload-name">${item.name}</h4>
          <p class="upload-meta">${this.formatFileSize(item.size)} • ${
      item.type
    }</p>
          ${
            item.status === "uploading"
              ? `
            <div class="upload-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${item.progress}%"></div>
              </div>
              <span class="progress-text">${item.progress}%</span>
            </div>
          `
              : ""
          }
          ${item.error ? `<p class="upload-error">${item.error}</p>` : ""}
        </div>
        <div class="upload-status">
          <span class="status-icon ${statusColors[item.status]}">
            ${statusIcons[item.status]}
          </span>
          <div class="upload-actions">
            ${
              item.status === "error"
                ? `
              <button onclick="UploadManager.retryUpload('${item.id}')" class="btn btn-ghost btn-sm">Retry</button>
            `
                : ""
            }
            ${
              item.status !== "uploading"
                ? `
              <button onclick="UploadManager.removeFromQueue('${item.id}')" class="btn btn-ghost btn-sm text-danger">Remove</button>
            `
                : ""
            }
          </div>
        </div>
      </div>
    `;
  }

  static getFileIcon(type) {
    if (type.startsWith("image/")) return "🖼️";
    if (type.startsWith("video/")) return "🎥";
    if (type.startsWith("audio/")) return "🎵";
    if (type.includes("pdf")) return "📄";
    if (type.includes("text")) return "📝";
    return "📁";
  }

  static formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  static saveUploadHistory() {
    const completedUploads = this.uploadQueue.filter(
      (item) => item.status === "completed"
    );
    const history = JSON.parse(
      localStorage.getItem("ispmedia_upload_history") || "[]"
    );

    completedUploads.forEach((upload) => {
      history.push({
        name: upload.name,
        size: upload.size,
        type: upload.type,
        uploadedAt: upload.uploadedAt,
        uploadedBy: AuthManager.currentUser?.username,
      });
    });

    // Keep only last 100 uploads
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }

    localStorage.setItem("ispmedia_upload_history", JSON.stringify(history));
  }

  static loadStoredUploads() {
    // This would typically load incomplete uploads from localStorage
    // For now, we just ensure the queue is empty on page load
    this.uploadQueue = [];
  }

  static getUploadHistory() {
    return JSON.parse(localStorage.getItem("ispmedia_upload_history") || "[]");
  }

  static renderUploadZone() {
    return `
      <div class="upload-zone" ondrop="UploadManager.handleDrop(event)" 
           ondragover="UploadManager.handleDragOver(event)"
           ondragleave="UploadManager.handleDragLeave(event)">
        <div class="upload-icon">📤</div>
        <h3>Drag & Drop Files Here</h3>
        <p>or click to browse</p>
        <input type="file" class="upload-input" multiple 
               accept="image/*,video/*,audio/*,.pdf,.txt,.doc,.docx">
        <div class="upload-info">
          <small>Max file size: ${this.formatFileSize(this.maxFileSize)}</small>
          <small>Supported: Images, Videos, Audio, Documents</small>
        </div>
      </div>
    `;
  }
}

// Global functions
function startUpload() {
  UploadManager.startUpload();
}

function clearQueue() {
  UploadManager.clearQueue();
}

// Initialize upload manager
document.addEventListener("DOMContentLoaded", () => {
  UploadManager.init();
});
