import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ImageCapture } from "./ImageCapture";
import { OCRProcessor } from "./OCRProcessor";
import { validateMeterLocation } from "@/utils/meterValidation";
import { supabase } from "@/integrations/supabase/client";

export const ReadingSubmission = () => {
  const [reading, setReading] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const ocrProcessor = new OCRProcessor();

  const handleImageCapture = async (file: File, preview: string) => {
    setIsProcessing(true);
    try {
      // Get image location
      const location = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      // Process image with OCR
      const detectedReading = await ocrProcessor.processImage(file);
      if (detectedReading) {
        setReading(detectedReading);
        setImageUrl(preview);
        
        toast({
          title: "Reading detected",
          description: `Detected reading: ${detectedReading}. Please verify this value.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const readingValue = parseFloat(reading);
      if (isNaN(readingValue)) {
        throw new Error("Invalid reading value");
      }

      const { error } = await supabase.from('readings').insert({
        reading: readingValue,
        image_url: imageUrl,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        user_id: parseInt(user.id),
        manual_input: false,
        validated: false
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reading submitted successfully",
      });

      // Reset form
      setReading("");
      setImageUrl("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Meter Reading</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageCapture
            onImageCapture={handleImageCapture}
            isUploading={false}
            isProcessing={isProcessing}
          />

          {imageUrl && (
            <div className="mt-4">
              <img
                src={imageUrl}
                alt="Meter reading"
                className="max-w-sm mx-auto rounded-lg shadow-lg"
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="reading" className="text-sm font-medium">
              Meter Reading
            </label>
            <Input
              id="reading"
              type="number"
              step="0.01"
              value={reading}
              onChange={(e) => setReading(e.target.value)}
              placeholder="Enter meter reading"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isProcessing || !reading || !imageUrl}
          >
            Submit Reading
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};