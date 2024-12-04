import { useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ImageCaptureProps {
  onImageCapture: (file: File, preview: string) => void;
  isUploading: boolean;
  isProcessing: boolean;
}

export const ImageCapture = ({ onImageCapture, isUploading, isProcessing }: ImageCaptureProps) => {
  const { toast } = useToast();

  const handlePhotoCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const preview = URL.createObjectURL(file);
      onImageCapture(file, preview);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      type="button"
      disabled={isUploading || isProcessing}
      className="w-full md:w-auto"
      onClick={() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        input.onchange = (e) => handlePhotoCapture(e as any);
        input.click();
      }}
    >
      <Camera className="w-4 h-4 mr-2" />
      {isUploading ? "Uploading..." : isProcessing ? "Processing..." : "Take Meter Photo"}
    </Button>
  );
};