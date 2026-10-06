'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { UploadCloud, X, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { ReferenceFile } from '@/types/commission';

interface FileUploaderProps {
  files: ReferenceFile[];
  onFilesChange: (files: ReferenceFile[]) => void;
  maxFiles?: number;
  maxSizeMb?: number;
  label?: string;
  hint?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSizeMb = 10,
  label = 'Reference Images & Inspiration',
  hint = 'Upload interior space photos, wall measurements, sketches, or color swatches (PNG, JPG, WebP up to 10MB each)',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles || incomingFiles.length === 0) return;
    setErrorMessage(null);

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSizeBytes = maxSizeMb * 1024 * 1024;
    const newFiles: ReferenceFile[] = [];

    if (files.length + incomingFiles.length > maxFiles) {
      setErrorMessage(`You can upload a maximum of ${maxFiles} reference files.`);
      return;
    }

    for (let i = 0; i < incomingFiles.length; i++) {
      const file = incomingFiles[i];

      if (!allowedTypes.includes(file.type)) {
        setErrorMessage(`"${file.name}" is not a supported image format (JPEG, PNG, or WebP only).`);
        return;
      }

      if (file.size > maxSizeBytes) {
        setErrorMessage(`"${file.name}" exceeds the ${maxSizeMb}MB maximum file size.`);
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      newFiles.push({
        id: `ref-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        url: objectUrl,
        size: file.size,
        type: file.type,
      });
    }

    onFilesChange([...files, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = (idToRemove: string) => {
    const fileToRemove = files.find((f) => f.id === idToRemove);
    if (fileToRemove && fileToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(fileToRemove.url);
    }
    onFilesChange(files.filter((f) => f.id !== idToRemove));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs uppercase tracking-gallery font-medium text-charcoal">
            {label}
          </label>
          <span className="text-[11px] text-charcoal-muted">
            {files.length}/{maxFiles} uploaded
          </span>
        </div>
      )}

      {/* Drop Zone */}
      {files.length < maxFiles && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-sm p-6 text-center cursor-pointer transition-colors duration-200 ${
            isDragging
              ? 'border-accent bg-accent/5'
              : 'border-canvas-border hover:border-charcoal/50 bg-canvas-subtle/50'
          }`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          aria-label="Upload reference files"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-canvas flex items-center justify-center border border-canvas-border text-charcoal shadow-sm">
              <UploadCloud className="w-5 h-5 text-charcoal-muted" />
            </div>
            <div>
              <p className="text-xs font-medium text-charcoal tracking-wide">
                <span className="underline decoration-accent underline-offset-4">Click to upload</span> or drag & drop files here
              </p>
              <p className="text-[11px] text-charcoal-muted mt-1">{hint}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error alert */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-red-50/70 border border-red-200 text-red-700 text-xs rounded-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Thumbnail Previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="group relative aspect-square bg-canvas-subtle border border-canvas-border rounded-sm overflow-hidden flex flex-col justify-end p-2"
            >
              {file.url ? (
                <Image
                  src={file.url}
                  alt={file.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized={file.url.startsWith('blob:')}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-canvas-muted text-charcoal-muted">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}
              {/* Overlay with file name & size */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
              <div className="relative z-10 text-[10px] text-canvas">
                <p className="font-medium truncate drop-shadow-sm">{file.name}</p>
                <p className="text-canvas-muted opacity-80 text-[9px]">
                  {formatFileSize(file.size)}
                </p>
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(file.id);
                }}
                className="absolute top-1.5 right-1.5 z-20 w-6 h-6 rounded-full bg-charcoal/80 text-canvas hover:bg-charcoal flex items-center justify-center transition-colors shadow-sm"
                aria-label={`Remove file ${file.name}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
