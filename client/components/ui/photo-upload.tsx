import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Upload, X, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoUploadProps {
  value?: string;
  onChange: (photo: string | undefined) => void;
  className?: string;
}

export function PhotoUpload({ value, onChange, className }: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileSelect(file);
          }
        }}
        className="hidden"
      />

      <Card
        className={cn(
          "relative group cursor-pointer border-2 border-dashed transition-all duration-200 hover:border-companion-purple",
          isDragging && "border-companion-purple bg-companion-light/20",
          value ? "border-solid border-gray-200" : "border-gray-300",
        )}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="aspect-square w-full max-w-xs mx-auto p-4">
          {value ? (
            // Photo Preview
            <div className="relative w-full h-full">
              <img
                src={value}
                alt="Profile preview"
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 rounded-lg flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 text-gray-800 hover:bg-white"
                    onClick={handleClick}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="bg-red-500/90 hover:bg-red-500"
                    onClick={handleRemove}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // Upload Placeholder
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-20 h-20 bg-gradient-to-br from-companion-purple to-companion-pink rounded-full flex items-center justify-center mb-4">
                <User className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Add Your Photo
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Show your personality with a great profile picture
              </p>
              <div className="flex items-center gap-2 text-companion-purple">
                <Upload className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Click to upload or drag & drop
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 5MB</p>
            </div>
          )}
        </div>
      </Card>

      {value && (
        <div className="text-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClick}
            className="border-companion-purple text-companion-purple hover:bg-companion-light"
          >
            <Camera className="h-4 w-4 mr-2" />
            Change Photo
          </Button>
        </div>
      )}
    </div>
  );
}
