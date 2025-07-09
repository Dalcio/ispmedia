// ISP Media - Mock Data Setup
// Creates sample users, playlists, and media for testing

class MockDataManager {
  static init() {
    this.createMockUsers();
    this.createSamplePlaylists();
    this.createSampleMedia();
    this.createSampleReviews();
  }

  static createMockUsers() {
    const existingUsers = JSON.parse(
      localStorage.getItem("ispmedia_users") || "[]"
    );

    if (existingUsers.length === 0) {
      const mockUsers = [
        {
          id: "user-1",
          username: "testuser",
          email: "test@example.com",
          password: "Test123!",
          name: "Test User",
          avatar: null,
          bio: "I love discovering new music!",
          createdAt: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 days ago
        },
        {
          id: "user-2",
          username: "admin",
          email: "admin@ispmedia.com",
          password: "Admin123!",
          name: "Admin User",
          avatar: null,
          bio: "Platform administrator",
          createdAt: new Date(Date.now() - 86400000 * 90).toISOString(), // 90 days ago
        },
        {
          id: "user-3",
          username: "musiclover",
          email: "music@lover.com",
          password: "Music123!",
          name: "Music Lover",
          avatar: null,
          bio: "Music is my passion. Always looking for new artists!",
          createdAt: new Date(Date.now() - 86400000 * 60).toISOString(), // 60 days ago
        },
        {
          id: "user-4",
          username: "demo",
          email: "demo@test.com",
          password: "Demo123!",
          name: "Demo User",
          avatar: null,
          bio: "Demo account for testing features",
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
        },
        {
          id: "user-5",
          username: "producer",
          email: "producer@studio.com",
          password: "Prod123!",
          name: "Studio Producer",
          avatar: null,
          bio: "Professional music producer and sound engineer",
          createdAt: new Date(Date.now() - 86400000 * 120).toISOString(), // 120 days ago
        },
        {
          id: "user-6",
          username: "tester",
          email: "tester@ispmedia.com",
          password: "Tester123!",
          name: "QA Tester",
          avatar: null,
          bio: "Quality assurance tester for ISP Media platform",
          createdAt: new Date(Date.now() - 86400000 * 14).toISOString(), // 14 days ago
        },
      ];

      localStorage.setItem("ispmedia_users", JSON.stringify(mockUsers));
      console.log("✅ Mock users created!");
      console.log("🔑 Available test accounts:");
      mockUsers.forEach((user) => {
        console.log(
          `   📧 ${user.email} | 🔒 ${user.password} | 👤 ${user.name}`
        );
      });
    }
  }

  static createSampleMedia() {
    const existingMedia = JSON.parse(
      localStorage.getItem("ispmedia_library") || "[]"
    );

    if (existingMedia.length === 0) {
      const sampleMedia = [
        {
          id: "media-1",
          title: "Awesome Electronic Beat",
          filename: "electronic-beat.mp3",
          type: "audio/mp3",
          size: 4500000, // 4.5MB
          thumbnail: null,
          uploadedBy: "producer",
          uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          description: "A catchy electronic beat perfect for dancing!",
          tags: ["electronic", "dance", "beat"],
          views: 156,
          likes: 23,
          downloads: 8,
          isPublic: true,
          duration: 180, // 3 minutes
        },
        {
          id: "media-2",
          title: "Chill Acoustic Guitar",
          filename: "acoustic-chill.mp3",
          type: "audio/mp3",
          size: 3200000, // 3.2MB
          thumbnail: null,
          uploadedBy: "musiclover",
          uploadedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
          description: "Relaxing acoustic guitar melody for peaceful moments",
          tags: ["acoustic", "chill", "guitar"],
          views: 89,
          likes: 15,
          downloads: 5,
          isPublic: true,
          duration: 240, // 4 minutes
        },
        {
          id: "media-3",
          title: "Uplifting Piano Piece",
          filename: "piano-uplifting.mp3",
          type: "audio/mp3",
          size: 5100000, // 5.1MB
          thumbnail: null,
          uploadedBy: "testuser",
          uploadedAt: new Date(Date.now() - 86400000 * 8).toISOString(),
          description: "Beautiful piano composition that lifts your spirits",
          tags: ["piano", "classical", "uplifting"],
          views: 203,
          likes: 31,
          downloads: 12,
          isPublic: true,
          duration: 195, // 3:15 minutes
        },
        {
          id: "media-4",
          title: "Demo Video Tutorial",
          filename: "tutorial-demo.mp4",
          type: "video/mp4",
          size: 15000000, // 15MB
          thumbnail: null,
          uploadedBy: "demo",
          uploadedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          description: "Sample video showing platform features",
          tags: ["tutorial", "demo", "educational"],
          views: 45,
          likes: 7,
          downloads: 2,
          isPublic: true,
          duration: 120, // 2 minutes
        },
      ];

      localStorage.setItem("ispmedia_library", JSON.stringify(sampleMedia));
      console.log("✅ Sample media library created!");
    }
  }

  static createSamplePlaylists() {
    // This will be called after users are created, so playlists can reference real users
    const existingPlaylists = JSON.parse(
      localStorage.getItem("ispmedia_playlists") || "[]"
    );

    // Only create if no playlists exist (besides default ones)
    if (existingPlaylists.filter((p) => !p.isDefault).length === 0) {
      const samplePlaylists = [
        {
          id: "playlist-sample-1",
          name: "Electronic Vibes",
          description: "Best electronic tracks for your workout",
          isPublic: true,
          isDefault: false,
          createdBy: "producer",
          createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
          media: [
            {
              id: "media-1",
              title: "Awesome Electronic Beat",
              artist: "Studio Producer",
              duration: 180,
              type: "audio/mp3",
              thumbnail: null,
              addedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
            },
          ],
        },
        {
          id: "playlist-sample-2",
          name: "Chill Zone",
          description: "Relaxing music for study and work",
          isPublic: true,
          isDefault: false,
          createdBy: "musiclover",
          createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
          media: [
            {
              id: "media-2",
              title: "Chill Acoustic Guitar",
              artist: "Music Lover",
              duration: 240,
              type: "audio/mp3",
              thumbnail: null,
              addedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
            },
            {
              id: "media-3",
              title: "Uplifting Piano Piece",
              artist: "Test User",
              duration: 195,
              type: "audio/mp3",
              thumbnail: null,
              addedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
            },
          ],
        },
      ];

      // Add to existing playlists (which might include default ones)
      const allPlaylists = [...existingPlaylists, ...samplePlaylists];
      localStorage.setItem("ispmedia_playlists", JSON.stringify(allPlaylists));
      console.log("✅ Sample playlists created!");
    }
  }

  static createSampleReviews() {
    const existingReviews = JSON.parse(
      localStorage.getItem("ispmedia_reviews") || "[]"
    );

    if (existingReviews.length === 0) {
      const sampleReviews = [
        {
          id: "review-1",
          mediaId: "media-1",
          userId: "musiclover",
          rating: 5,
          comment:
            "Absolutely amazing! This beat gets me pumped up every time. Perfect for my morning workouts!",
          createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
          likes: 3,
          dislikes: 0,
          likedBy: ["testuser", "demo", "admin"],
          dislikedBy: [],
        },
        {
          id: "review-2",
          mediaId: "media-1",
          userId: "testuser",
          rating: 4,
          comment:
            "Really good production quality! Could use a bit more bass but overall excellent work.",
          createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
          likes: 1,
          dislikes: 0,
          likedBy: ["producer"],
          dislikedBy: [],
        },
        {
          id: "review-3",
          mediaId: "media-2",
          userId: "admin",
          rating: 5,
          comment:
            "Perfect for relaxation! The guitar work is incredibly soothing. This is going straight to my chill playlist.",
          createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
          likes: 2,
          dislikes: 0,
          likedBy: ["musiclover", "demo"],
          dislikedBy: [],
        },
        {
          id: "review-4",
          mediaId: "media-3",
          userId: "demo",
          rating: 4,
          comment:
            "Beautiful composition! The melody really does lift your spirits. Great for background music while working.",
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
          likes: 1,
          dislikes: 0,
          likedBy: ["testuser"],
          dislikedBy: [],
        },
      ];

      localStorage.setItem("ispmedia_reviews", JSON.stringify(sampleReviews));
      console.log("✅ Sample reviews created!");
    }
  }

  static resetMockData() {
    // Clear all mock data
    localStorage.removeItem("ispmedia_users");
    localStorage.removeItem("ispmedia_library");
    localStorage.removeItem("ispmedia_playlists");
    localStorage.removeItem("ispmedia_reviews");
    localStorage.removeItem("ispmedia_upload_history");

    // Recreate fresh mock data
    this.init();
    console.log("🔄 Mock data reset and recreated!");
  }

  static showTestCredentials() {
    const users = JSON.parse(localStorage.getItem("ispmedia_users") || "[]");
    console.log("🔑 Available test accounts:");
    users.forEach((user) => {
      console.log(
        `   📧 ${user.email} | 🔒 ${user.password} | 👤 ${user.name}`
      );
    });
  }
}

// Add to global scope for easy testing
window.MockDataManager = MockDataManager;

// Initialize mock data when page loads
document.addEventListener("DOMContentLoaded", () => {
  MockDataManager.init();
});
