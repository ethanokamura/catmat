"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, GripVertical, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  uploadProductImage,
  deleteFileByUrl,
  validateImageFile,
  UploadProgress,
} from "@/lib/services/storage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  productSlug: string;
  maxImages?: number;
}

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  preview: string;
}

export function ImageUpload({
  images,
  onChange,
  productSlug,
  maxImages = 10,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const remainingSlots = maxImages - images.length - uploading.length;
      if (remainingSlots <= 0) {
        toast.error(`Maximum ${maxImages} images allowed`);
        return;
      }

      const filesToUpload = Array.from(files).slice(0, remainingSlots);
      const newUploading: UploadingFile[] = [];

      for (const file of filesToUpload) {
        const validation = validateImageFile(file);
        if (!validation.valid) {
          toast.error(validation.error);
          continue;
        }

        const id = Math.random().toString(36).substring(7);
        const preview = URL.createObjectURL(file);
        newUploading.push({ id, file, progress: 0, preview });
      }

      if (newUploading.length === 0) return;

      setUploading((prev) => [...prev, ...newUploading]);

      // Upload files
      for (const uploadingFile of newUploading) {
        try {
          const result = await uploadProductImage(
            uploadingFile.file,
            productSlug || "temp",
            (progress: UploadProgress) => {
              setUploading((prev) =>
                prev.map((u) =>
                  u.id === uploadingFile.id
                    ? { ...u, progress: progress.progress }
                    : u
                )
              );
            }
          );

          // Add to images array
          onChange([...images, result.url]);

          // Remove from uploading
          setUploading((prev) => prev.filter((u) => u.id !== uploadingFile.id));
          URL.revokeObjectURL(uploadingFile.preview);
        } catch (error) {
          console.error("Upload error:", error);
          toast.error(`Failed to upload ${uploadingFile.file.name}`);
          setUploading((prev) => prev.filter((u) => u.id !== uploadingFile.id));
          URL.revokeObjectURL(uploadingFile.preview);
        }
      }
    },
    [images, onChange, productSlug, maxImages, uploading.length]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleRemove = async (index: number) => {
    const url = images[index];
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);

    // Try to delete from storage (will fail silently for external URLs)
    await deleteFileByUrl(url);
  };

  // Drag and drop reordering
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDragOverImage = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const [removed] = newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, removed);
    onChange(newImages);
    setDraggedIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            fileInputRef.current?.click();
          }
        }}
        aria-label="Upload images. Click or drag and drop files here."
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          aria-hidden="true"
        />
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Upload className="h-10 w-10" aria-hidden="true" />
          <p className="text-sm font-medium">
            Drop images here or click to upload
          </p>
          <p className="text-xs">
            JPEG, PNG, WebP, or GIF • Max 5MB each • Up to {maxImages} images
          </p>
        </div>
      </div>

      {/* Uploading progress */}
      {uploading.length > 0 && (
        <div className="space-y-2">
          {uploading.map((file) => (
            <Card key={file.id} className="p-3">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={file.preview}
                    alt="Uploading"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.file.name}</p>
                  <Progress value={file.progress} className="h-2 mt-1" />
                </div>
                <Loader2
                  className="h-5 w-5 animate-spin text-muted-foreground"
                  aria-label="Uploading"
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <Card
              key={url}
              className={cn(
                "relative group overflow-hidden",
                draggedIndex === index && "opacity-50"
              )}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOverImage(e, index)}
            >
              <div className="aspect-square relative">
                <Image
                  src={url}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 cursor-grab active:cursor-grabbing"
                    aria-label={`Drag to reorder image ${index + 1}`}
                  >
                    <GripVertical className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRemove(index)}
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
                {/* First image badge */}
                {index === 0 && (
                  <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                    Main
                  </span>
                )}
              </div>
            </Card>
          ))}

          {/* Add more button */}
          {images.length < maxImages && (
            <Card
              className="aspect-square flex items-center justify-center cursor-pointer border-dashed hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  fileInputRef.current?.click();
                }
              }}
              aria-label="Add more images"
            >
              <div className="text-center text-muted-foreground">
                <ImagePlus className="h-8 w-8 mx-auto mb-2" aria-hidden="true" />
                <p className="text-xs">Add more</p>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Empty state */}
      {images.length === 0 && uploading.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No images uploaded yet. Upload your first image above.
        </p>
      )}
    </div>
  );
}

