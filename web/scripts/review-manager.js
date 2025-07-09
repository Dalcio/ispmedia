// ISP Media - Review and Rating System
// Handles review and rating functionality with real API

class ReviewManager {
  static init() {
    this.api = window.ISPMediaAPI;
    this.reviews = [];
    this.loadReviews();
    this.setupEventListeners();
  }

  static async loadReviews() {
    try {
      const response = await this.api.getReviews();
      this.reviews = response.reviews || [];
    } catch (error) {
      console.error('Erro ao carregar reviews:', error);
      this.reviews = [];
    }
  }
  static async addReview(mediaId, rating, comment) {
    if (!window.SessionManager?.isAuthenticated) {
      NotificationManager.show("Please log in to write reviews", "warning");
      return null;
    }

    try {
      const reviewData = {
        mediaId: mediaId,
        rating: parseInt(rating),
        comment: comment.trim()
      };
      
      const response = await this.api.createReview(reviewData);
      const review = response.review;
      
      this.reviews.push(review);
      NotificationManager.show("Review added successfully", "success");
      return review;
    } catch (error) {
      console.error('Erro ao adicionar review:', error);
      NotificationManager.show('Erro ao adicionar review: ' + error.message, 'error');
      return null;
    }
  }
  static async updateReview(reviewId, rating, comment) {
    try {
      const reviewData = {
        rating: parseInt(rating),
        comment: comment.trim()
      };
      
      await this.api.updateReview(reviewId, reviewData);
      
      // Update local review
      const review = this.getReview(reviewId);
      if (review) {
        Object.assign(review, reviewData);
        review.updatedAt = new Date().toISOString();
      }
      
      NotificationManager.show("Review updated successfully", "success");
      return true;
    } catch (error) {
      console.error('Erro ao atualizar review:', error);
      NotificationManager.show('Erro ao atualizar review: ' + error.message, 'error');
      return false;
    }
  }

  static async deleteReview(reviewId) {
    try {
      await this.api.deleteReview(reviewId);
      
      this.reviews = this.reviews.filter(r => r.id !== reviewId);
      NotificationManager.show("Review deleted successfully", "success");
      return true;
    } catch (error) {
      console.error('Erro ao deletar review:', error);
      NotificationManager.show('Erro ao deletar review: ' + error.message, 'error');
      return false;
    }  }

  static getReview(reviewId) {
    return this.reviews.find((r) => r.id === reviewId);
  }

  static getMediaReviews(mediaId) {
    return this.reviews
      .filter((r) => r.mediaId === mediaId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static getUserReviews(userId) {
    return this.reviews
      .filter((r) => r.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static getMediaRating(mediaId) {
    const mediaReviews = this.getMediaReviews(mediaId);
    if (mediaReviews.length === 0) return { average: 0, count: 0 };

    const sum = mediaReviews.reduce((acc, review) => acc + review.rating, 0);
    return {
      average: Math.round((sum / mediaReviews.length) * 10) / 10,
      count: mediaReviews.length,
    };
  }
  static async likeReview(reviewId) {
    if (!window.SessionManager?.isAuthenticated) {
      NotificationManager.show("Please log in to like reviews", "warning");
      return false;
    }

    try {
      await this.api.likeReview(reviewId);
      
      // Update local review
      const review = this.getReview(reviewId);
      if (review) {
        const userId = window.SessionManager.currentUser?.username;
        
        // Remove from dislikes if present
        if (review.dislikedBy?.includes(userId)) {
          review.dislikedBy = review.dislikedBy.filter((id) => id !== userId);
          review.dislikes--;
        }

        // Toggle like
        if (review.likedBy?.includes(userId)) {
          review.likedBy = review.likedBy.filter((id) => id !== userId);
          review.likes--;
        } else {
          review.likedBy = review.likedBy || [];
          review.likedBy.push(userId);
          review.likes++;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao curtir review:', error);
      NotificationManager.show('Erro ao curtir review: ' + error.message, 'error');
      return false;
    }
  }
  static async dislikeReview(reviewId) {
    if (!window.SessionManager?.isAuthenticated) {
      NotificationManager.show("Please log in to dislike reviews", "warning");
      return false;
    }

    try {
      await this.api.dislikeReview(reviewId);
      
      // Update local review
      const review = this.getReview(reviewId);
      if (review) {
        const userId = window.SessionManager.currentUser?.username;
        
        // Remove from likes if present
        if (review.likedBy?.includes(userId)) {
          review.likedBy = review.likedBy.filter((id) => id !== userId);
          review.likes--;
        }

        // Toggle dislike
        if (review.dislikedBy?.includes(userId)) {
          review.dislikedBy = review.dislikedBy.filter((id) => id !== userId);
          review.dislikes--;
        } else {
          review.dislikedBy = review.dislikedBy || [];
          review.dislikedBy.push(userId);
          review.dislikes++;
        }
      }
      
      return true;    } catch (error) {
      console.error('Erro ao não curtir review:', error);
      NotificationManager.show('Erro ao não curtir review: ' + error.message, 'error');
      return false;
    }
  }

  static setupEventListeners() {
    // Form submission
    document.addEventListener("submit", (e) => {
      if (e.target.id === "reviewForm") {
        e.preventDefault();
        this.handleReviewSubmit(e.target);
      }
    });

    // Rating star clicks
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("rating-star")) {
        this.handleStarClick(e.target);
      }
    });
  }

  static handleReviewSubmit(form) {
    const mediaId = form.dataset.mediaId;
    const rating = form.querySelector('input[name="rating"]:checked')?.value;
    const comment = form.querySelector('textarea[name="comment"]').value;

    if (!rating) {
      NotificationManager.show("Please select a rating", "warning");
      return;
    }

    if (!FormValidator.validateReviewForm(form)) {
      return;
    }

    const review = this.addReview(mediaId, rating, comment);
    if (review) {
      form.reset();
      this.refreshReviewsDisplay(mediaId);
    }
  }

  static handleStarClick(star) {
    const rating = parseInt(star.dataset.rating);
    const container = star.closest(".rating-input");
    const input = container.querySelector(`input[value="${rating}"]`);

    if (input) {
      input.checked = true;
      this.updateStarDisplay(container, rating);
    }
  }

  static updateStarDisplay(container, rating) {
    const stars = container.querySelectorAll(".rating-star");
    stars.forEach((star, index) => {
      star.classList.toggle("active", index < rating);
    });
  }

  static refreshReviewsDisplay(mediaId) {
    const container = document.getElementById("reviewsContainer");
    if (container) {
      container.innerHTML = this.renderReviewsList(mediaId);
    }

    const ratingDisplay = document.getElementById("ratingDisplay");
    if (ratingDisplay) {
      ratingDisplay.innerHTML = this.renderRatingDisplay(mediaId);
    }
  }

  static renderReviewForm(mediaId) {
    if (!AuthManager.isAuthenticated) {
      return `
        <div class="review-form-placeholder">
          <p class="text-muted">Please <a href="#" onclick="AuthManager.openAuthModal()" class="text-primary">log in</a> to write a review</p>
        </div>
      `;
    }

    return `
      <div class="review-form-container">
        <h3>Write a Review</h3>
        <form id="reviewForm" data-media-id="${mediaId}">
          <div class="form-group">
            <label>Rating</label>
            <div class="rating-input">
              ${[1, 2, 3, 4, 5]
                .map(
                  (i) => `
                <input type="radio" name="rating" value="${i}" id="star${i}" hidden>
                <label for="star${i}" class="rating-star" data-rating="${i}">★</label>
              `
                )
                .join("")}
            </div>
            <div class="form-error" id="ratingError"></div>
          </div>
          <div class="form-group">
            <label for="reviewComment">Comment</label>
            <textarea name="comment" id="reviewComment" class="form-input" rows="4" 
                      placeholder="Share your thoughts about this media..." maxlength="1000"></textarea>
            <div class="form-error" id="commentError"></div>
          </div>
          <button type="submit" class="btn btn-primary">Submit Review</button>
        </form>
      </div>
    `;
  }

  static renderReviewsList(mediaId) {
    const reviews = this.getMediaReviews(mediaId);

    if (reviews.length === 0) {
      return `
        <div class="no-reviews">
          <p class="text-muted">No reviews yet. Be the first to review this media!</p>
        </div>
      `;
    }

    return `
      <div class="reviews-list">
        ${reviews.map((review) => this.renderReviewCard(review)).join("")}
      </div>
    `;
  }

  static renderReviewCard(review) {
    const isOwner = review.userId === AuthManager.currentUser?.username;
    const userId = AuthManager.currentUser?.username;
    const hasLiked = review.likedBy.includes(userId);
    const hasDisliked = review.dislikedBy.includes(userId);

    return `
      <div class="review-card">
        <div class="review-header">
          <div class="review-user">
            <div class="user-avatar">${review.userId
              .charAt(0)
              .toUpperCase()}</div>
            <div class="user-info">
              <h4>${review.userId}</h4>
              <p class="review-date">${this.formatDate(review.createdAt)}</p>
            </div>
          </div>
          <div class="review-rating">
            ${this.renderStars(review.rating)}
          </div>
        </div>
        <div class="review-content">
          <p>${review.comment}</p>
        </div>
        <div class="review-actions">
          <button onclick="likeReview('${review.id}')" 
                  class="btn btn-ghost btn-sm ${hasLiked ? "active" : ""}">
            👍 ${review.likes}
          </button>
          <button onclick="dislikeReview('${review.id}')" 
                  class="btn btn-ghost btn-sm ${hasDisliked ? "active" : ""}">
            👎 ${review.dislikes}
          </button>
          ${
            isOwner
              ? `
            <button onclick="editReview('${review.id}')" class="btn btn-ghost btn-sm">Edit</button>
            <button onclick="deleteReviewConfirm('${review.id}')" class="btn btn-ghost btn-sm text-danger">Delete</button>
          `
              : ""
          }
        </div>
      </div>
    `;
  }

  static renderRatingDisplay(mediaId) {
    const rating = this.getMediaRating(mediaId);

    return `
      <div class="rating-display">
        <div class="rating-stars">
          ${this.renderStars(rating.average)}
        </div>
        <div class="rating-info">
          <span class="rating-number">${rating.average}</span>
          <span class="rating-count">(${rating.count} review${
      rating.count !== 1 ? "s" : ""
    })</span>
        </div>
      </div>
    `;
  }

  static renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return `
      <div class="stars">
        ${"★".repeat(fullStars)}
        ${hasHalfStar ? "☆" : ""}
        ${"☆".repeat(emptyStars)}
      </div>
    `;
  }

  static formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
}

// Global functions
function likeReview(reviewId) {
  if (ReviewManager.likeReview(reviewId)) {
    // Refresh the review display
    const reviewCard = document.querySelector(`[data-review-id="${reviewId}"]`);
    if (reviewCard) {
      const mediaId = reviewCard.dataset.mediaId;
      ReviewManager.refreshReviewsDisplay(mediaId);
    }
  }
}

function dislikeReview(reviewId) {
  if (ReviewManager.dislikeReview(reviewId)) {
    // Refresh the review display
    const reviewCard = document.querySelector(`[data-review-id="${reviewId}"]`);
    if (reviewCard) {
      const mediaId = reviewCard.dataset.mediaId;
      ReviewManager.refreshReviewsDisplay(mediaId);
    }
  }
}

function editReview(reviewId) {
  // Implementation for editing reviews
  console.log("Edit review:", reviewId);
  NotificationManager.show("Edit functionality coming soon", "info");
}

function deleteReviewConfirm(reviewId) {
  if (confirm("Are you sure you want to delete this review?")) {
    if (ReviewManager.deleteReview(reviewId)) {
      // Refresh the review display
      const reviewCard = document.querySelector(
        `[data-review-id="${reviewId}"]`
      );
      if (reviewCard) {
        const mediaId = reviewCard.dataset.mediaId;
        ReviewManager.refreshReviewsDisplay(mediaId);
      }
    }
  }
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  ReviewManager.init();
});
