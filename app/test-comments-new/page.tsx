'use client';

import { useAuth } from '@/contexts/auth-context';
import { TrackComments } from '@/components/comments/track-comments-new';
import { TrackModeration } from '@/components/comments/track-moderation-new';
import { useState } from 'react';

export default function TestCommentsNewPage() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'comments' | 'moderation'>('comments');
  
  // Test track ID
  const testTrackId = 'test-track-new-123';

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="glass-panel rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-primary-400 mb-4">
            New Comment System Test
          </h1>
          <p className="text-text-600">
            Please log in to test the new comment system
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-panel rounded-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-primary-400 mb-2">
            New Comment System Test
          </h1>
          <p className="text-text-600 mb-4">
            Simplified comment system using top-level Firestore collection
          </p>
          <div className="text-sm text-text-500 space-y-1">
            <p><strong>Test Track ID:</strong> {testTrackId}</p>
            <p><strong>Current User:</strong> {user.displayName || user.email}</p>
            <p><strong>User ID:</strong> {user.uid}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="glass-panel rounded-xl p-6">
          <div className="flex gap-4 mb-6 border-b border-glass-200">
            <button
              onClick={() => setSelectedTab('comments')}
              className={`px-4 py-2 font-medium transition-all duration-200 border-b-2 ${
                selectedTab === 'comments'
                  ? 'text-primary-400 border-primary-400'
                  : 'text-text-600 border-transparent hover:text-primary-300'
              }`}
            >
              Comments
            </button>
            <button
              onClick={() => setSelectedTab('moderation')}
              className={`px-4 py-2 font-medium transition-all duration-200 border-b-2 ${
                selectedTab === 'moderation'
                  ? 'text-primary-400 border-primary-400'
                  : 'text-text-600 border-transparent hover:text-primary-300'
              }`}
            >
              Moderation
            </button>
          </div>

          {/* Content */}
          <div className="min-h-[400px]">
            {selectedTab === 'comments' && (
              <TrackComments trackId={testTrackId} />
            )}
            {selectedTab === 'moderation' && (
              <TrackModeration trackId={testTrackId} />
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="glass-panel rounded-xl p-6 mt-6">
          <h2 className="text-xl font-semibold text-primary-400 mb-4">
            How to Test
          </h2>
          <div className="space-y-3 text-text-600">
            <div>
              <h3 className="font-medium text-text-400">1. Send Comments:</h3>
              <p>• Go to the "Comments" tab</p>
              <p>• Write a test comment and click "Send"</p>
              <p>• Comments start as "pending" status</p>
            </div>
            
            <div>
              <h3 className="font-medium text-text-400">2. Moderate Comments:</h3>
              <p>• Go to the "Moderation" tab</p>
              <p>• You'll see any pending comments</p>
              <p>• Click "Approve" or "Reject" to moderate them</p>
            </div>
            
            <div>
              <h3 className="font-medium text-text-400">3. Real-time Updates:</h3>
              <p>• Approved comments appear in the Comments tab instantly</p>
              <p>• Rejected comments are removed from pending</p>
              <p>• Open multiple browser tabs to see real-time sync</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-dark-800 rounded-lg">
            <h3 className="font-medium text-green-400 mb-2">✅ New Features:</h3>
            <ul className="text-sm text-text-500 space-y-1">
              <li>• Simplified Firestore structure (top-level "comments" collection)</li>
              <li>• No composite index requirements</li>
              <li>• Cleaner data model with fewer fields</li>
              <li>• Better error handling and logging</li>
              <li>• Real-time updates for both comments and moderation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
