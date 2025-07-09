// ISP Media - Form Validation System
// Comprehensive form validation for all application forms

class FormValidator {
  static init() {
    this.setupGlobalValidation();
    this.setupRealTimeValidation();
  }

  static setupGlobalValidation() {
    // Prevent form submission if validation fails
    document.addEventListener("submit", (e) => {
      const form = e.target;
      if (form.classList.contains("validate-form")) {
        if (!this.validateForm(form)) {
          e.preventDefault();
        }
      }
    });
  }

  static setupRealTimeValidation() {
    // Real-time validation on input events
    document.addEventListener("input", (e) => {
      const input = e.target;
      if (input.classList.contains("validate-input")) {
        this.validateInput(input);
      }
    });

    // Validation on blur events
    document.addEventListener("blur", (e) => {
      const input = e.target;
      if (input.classList.contains("validate-input")) {
        this.validateInput(input);
      }
    });
  }

  static validateForm(form) {
    const inputs = form.querySelectorAll(".validate-input");
    let isValid = true;

    inputs.forEach((input) => {
      if (!this.validateInput(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  static validateInput(input) {
    const value = input.value.trim();
    const type = input.dataset.validateType || input.type;
    const rules = this.parseValidationRules(input);

    this.clearError(input);

    // Required validation
    if (rules.required && !value) {
      this.showError(input, "This field is required");
      return false;
    }

    // Skip other validations if field is empty and not required
    if (!value && !rules.required) {
      return true;
    }

    // Type-specific validation
    switch (type) {
      case "email":
        return this.validateEmail(input, value);
      case "password":
        return this.validatePassword(input, value, rules);
      case "username":
        return this.validateUsername(input, value, rules);
      case "confirm-password":
        return this.validateConfirmPassword(input, value);
      case "playlist-name":
        return this.validatePlaylistName(input, value);
      case "review-comment":
        return this.validateReviewComment(input, value);
      case "file-upload":
        return this.validateFileUpload(input);
      default:
        return this.validateGeneral(input, value, rules);
    }
  }

  static parseValidationRules(input) {
    const rules = {};

    // Built-in HTML5 validation attributes
    rules.required = input.required;
    rules.minLength = input.minLength || parseInt(input.dataset.minLength) || 0;
    rules.maxLength =
      input.maxLength || parseInt(input.dataset.maxLength) || Infinity;
    rules.pattern = input.pattern || input.dataset.pattern;

    // Custom validation rules
    rules.confirmTarget = input.dataset.confirmTarget;
    rules.allowedTypes = input.dataset.allowedTypes?.split(",");
    rules.maxSize = parseInt(input.dataset.maxSize);

    return rules;
  }

  static validateEmail(input, value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(value)) {
      this.showError(input, "Please enter a valid email address");
      return false;
    }

    // Check if email is already registered (simulated)
    if (this.isEmailTaken(value)) {
      this.showError(input, "This email is already registered");
      return false;
    }

    return true;
  }

  static validatePassword(input, value, rules) {
    if (value.length < 8) {
      this.showError(input, "Password must be at least 8 characters long");
      return false;
    }

    if (!/(?=.*[a-z])/.test(value)) {
      this.showError(
        input,
        "Password must contain at least one lowercase letter"
      );
      return false;
    }

    if (!/(?=.*[A-Z])/.test(value)) {
      this.showError(
        input,
        "Password must contain at least one uppercase letter"
      );
      return false;
    }

    if (!/(?=.*\d)/.test(value)) {
      this.showError(input, "Password must contain at least one number");
      return false;
    }

    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(value)) {
      this.showError(
        input,
        "Password must contain at least one special character"
      );
      return false;
    }

    return true;
  }

  static validateUsername(input, value, rules) {
    if (value.length < 3) {
      this.showError(input, "Username must be at least 3 characters long");
      return false;
    }

    if (value.length > 20) {
      this.showError(input, "Username cannot exceed 20 characters");
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      this.showError(
        input,
        "Username can only contain letters, numbers, and underscores"
      );
      return false;
    }

    if (this.isUsernameTaken(value)) {
      this.showError(input, "This username is already taken");
      return false;
    }

    return true;
  }

  static validateConfirmPassword(input, value) {
    const passwordInput = document.getElementById(input.dataset.confirmTarget);
    if (!passwordInput) return true;

    if (value !== passwordInput.value) {
      this.showError(input, "Passwords do not match");
      return false;
    }

    return true;
  }

  static validatePlaylistName(input, value) {
    if (value.length < 1) {
      this.showError(input, "Playlist name is required");
      return false;
    }

    if (value.length > 100) {
      this.showError(input, "Playlist name cannot exceed 100 characters");
      return false;
    }

    // Check for inappropriate content (basic filter)
    const inappropriateWords = ["spam", "fake", "scam"];
    if (inappropriateWords.some((word) => value.toLowerCase().includes(word))) {
      this.showError(input, "Playlist name contains inappropriate content");
      return false;
    }

    return true;
  }

  static validateReviewComment(input, value) {
    if (value.length < 5) {
      this.showError(
        input,
        "Review comment must be at least 5 characters long"
      );
      return false;
    }

    if (value.length > 1000) {
      this.showError(input, "Review comment cannot exceed 1000 characters");
      return false;
    }

    return true;
  }

  static validateFileUpload(input) {
    const files = input.files;
    if (!files || files.length === 0) {
      this.showError(input, "Please select at least one file");
      return false;
    }

    const allowedTypes = input.dataset.allowedTypes?.split(",") || [];
    const maxSize = parseInt(input.dataset.maxSize) || 10 * 1024 * 1024; // 10MB default
    const maxFiles = parseInt(input.dataset.maxFiles) || 10;

    if (files.length > maxFiles) {
      this.showError(input, `Maximum ${maxFiles} files allowed`);
      return false;
    }

    for (let file of files) {
      // Check file type
      if (allowedTypes.length > 0) {
        const fileType = file.type.split("/")[0];
        if (
          !allowedTypes.includes(fileType) &&
          !allowedTypes.includes(file.type)
        ) {
          this.showError(input, `File type ${file.type} is not allowed`);
          return false;
        }
      }

      // Check file size
      if (file.size > maxSize) {
        this.showError(
          input,
          `File "${file.name}" exceeds maximum size of ${this.formatFileSize(
            maxSize
          )}`
        );
        return false;
      }
    }

    return true;
  }

  static validateGeneral(input, value, rules) {
    // Min length validation
    if (rules.minLength && value.length < rules.minLength) {
      this.showError(input, `Minimum length is ${rules.minLength} characters`);
      return false;
    }

    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      this.showError(input, `Maximum length is ${rules.maxLength} characters`);
      return false;
    }

    // Pattern validation
    if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
      this.showError(input, "Please enter a valid value");
      return false;
    }

    return true;
  }

  static showError(input, message) {
    const errorElement = this.getErrorElement(input);
    errorElement.textContent = message;
    errorElement.classList.add("show");
    input.classList.add("invalid");
  }

  static clearError(input) {
    const errorElement = this.getErrorElement(input);
    errorElement.textContent = "";
    errorElement.classList.remove("show");
    input.classList.remove("invalid");
  }

  static getErrorElement(input) {
    let errorElement = input.parentElement.querySelector(".form-error");
    if (!errorElement) {
      errorElement = document.createElement("div");
      errorElement.className = "form-error";
      input.parentElement.appendChild(errorElement);
    }
    return errorElement;
  }

  static isEmailTaken(email) {
    // Check against mock users
    const users = JSON.parse(localStorage.getItem("ispmedia_users") || "[]");
    return users.some((user) => user.email === email);
  }

  static isUsernameTaken(username) {
    // Check against mock users
    const users = JSON.parse(localStorage.getItem("ispmedia_users") || "[]");
    return users.some((user) => user.username === username);
  }

  static validateCredentials(email, password) {
    // Validate login credentials against mock users
    const users = JSON.parse(localStorage.getItem("ispmedia_users") || "[]");
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    return user || null;
  }

  static formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Specific form validation methods
  static validateLoginForm(form) {
    const email = form.querySelector('input[name="email"]');
    const password = form.querySelector('input[name="password"]');

    let isValid = true;

    if (!email.value.trim()) {
      this.showError(email, "Email is required");
      isValid = false;
    } else if (!this.validateEmail(email, email.value)) {
      isValid = false;
    }

    if (!password.value.trim()) {
      this.showError(password, "Password is required");
      isValid = false;
    }

    return isValid;
  }

  static validateRegisterForm(form) {
    const username = form.querySelector('input[name="username"]');
    const email = form.querySelector('input[name="email"]');
    const password = form.querySelector('input[name="password"]');
    const confirmPassword = form.querySelector('input[name="confirmPassword"]');

    let isValid = true;

    if (!this.validateUsername(username, username.value.trim(), {})) {
      isValid = false;
    }

    if (!this.validateEmail(email, email.value.trim())) {
      isValid = false;
    }

    if (!this.validatePassword(password, password.value, {})) {
      isValid = false;
    }

    if (!this.validateConfirmPassword(confirmPassword, confirmPassword.value)) {
      isValid = false;
    }

    return isValid;
  }

  static validatePlaylistForm(form) {
    const name = form.querySelector('input[name="name"]');
    const description = form.querySelector('textarea[name="description"]');

    let isValid = true;

    if (!this.validatePlaylistName(name, name.value.trim())) {
      isValid = false;
    }

    if (description && description.value.trim().length > 500) {
      this.showError(description, "Description cannot exceed 500 characters");
      isValid = false;
    }

    return isValid;
  }

  static validateReviewForm(form) {
    const rating = form.querySelector('input[name="rating"]:checked');
    const comment = form.querySelector('textarea[name="comment"]');

    let isValid = true;

    if (!rating) {
      const ratingContainer = form.querySelector(".rating-input");
      this.showError(ratingContainer, "Please select a rating");
      isValid = false;
    }

    if (!this.validateReviewComment(comment, comment.value.trim())) {
      isValid = false;
    }

    return isValid;
  }

  static validateUploadForm(form) {
    const fileInput = form.querySelector('input[type="file"]');

    if (!this.validateFileUpload(fileInput)) {
      return false;
    }

    return true;
  }

  // Helper method to add validation classes to forms
  static setupFormValidation(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.classList.add("validate-form");

    const inputs = form.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => {
      input.classList.add("validate-input");
    });
  }

  // Method to validate all forms on page load
  static validateAllForms() {
    const forms = document.querySelectorAll("form");
    forms.forEach((form) => {
      form.classList.add("validate-form");
      const inputs = form.querySelectorAll("input, textarea, select");
      inputs.forEach((input) => {
        input.classList.add("validate-input");
      });
    });
  }
}

// Initialize form validation when page loads
document.addEventListener("DOMContentLoaded", () => {
  FormValidator.init();
  FormValidator.validateAllForms();
});
