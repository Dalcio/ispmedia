"use client";

import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/ui-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { X, Save, Loader2 } from "lucide-react";

interface Track {
  id: string;
  title: string;
  genre: string;
  audioUrl: string;
  fileName: string;
  fileSize: number;
  duration?: number;
  createdAt: any;
  mimeType: string;
  isPublic?: boolean;
}

interface EditTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track | null;
  onTrackUpdated?: (updatedTrack: Track) => void;
}

export function EditTrackModal({
  isOpen,
  onClose,
  track,
  onTrackUpdated,
}: EditTrackModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
  });
  const toast = useToast();

  useEffect(() => {
    if (track) {
      setFormData({
        title: track.title || "",
        genre: track.genre || "",
      });
    }
  }, [track]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!track) return;

    if (!formData.title.trim()) {
      toast.error("Track title is required");
      return;
    }

    try {
      setLoading(true);

      const trackRef = doc(db, "tracks", track.id);
      const updateData = {
        title: formData.title.trim(),
        genre: formData.genre.trim() || "Unknown",
        updatedAt: new Date(),
      };

      await updateDoc(trackRef, updateData);
      const updatedTrack = { ...track, ...updateData };
      onTrackUpdated?.(updatedTrack);

      toast.success(`"${formData.title}" has been updated successfully`);

      onClose();
    } catch (error) {
      console.error("Error updating track:", error);
      toast.error("Failed to update track. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div
        className="bg-white dark:bg-neutral-900 rounded-2xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Edit Track
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={loading}
            className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Track Title *
            </label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter track title"
              disabled={loading}
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Genre
            </label>
            <Input
              type="text"
              value={formData.genre}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, genre: e.target.value }))
              }
              placeholder="Enter genre (optional)"
              disabled={loading}
              className="w-full"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
