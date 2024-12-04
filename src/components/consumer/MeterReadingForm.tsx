import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  meterReading: z.string().min(1, "Meter reading is required"),
});

export const MeterReadingForm = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      meterReading: "",
    },
  });

  const handlePhotoCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Your device doesn't support location services",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Create preview
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);

      // Get location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      // TODO: Upload to storage
      console.log("Photo:", file);
      console.log("Location:", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      toast({
        title: "Success",
        description: "Photo captured successfully. Please enter the meter reading.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to capture photo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 p-4 rounded-lg flex items-start space-x-2">
        <div className="text-sm text-yellow-800">
          <p className="font-medium">Important:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Ensure the meter display is clearly visible</li>
            <li>Make sure the meter's QR code is visible in the photo</li>
            <li>Allow location access when prompted</li>
            <li>Photo must be taken within the submission window</li>
          </ul>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            <Button
              disabled={isUploading}
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
              {isUploading ? "Capturing..." : "Take Meter Photo"}
            </Button>

            {imagePreview && (
              <div className="w-full max-w-md">
                <img 
                  src={imagePreview} 
                  alt="Meter reading preview" 
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>

          <FormField
            control={form.control}
            name="meterReading"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meter Reading</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the meter reading" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the current reading shown on your meter
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Submit Reading
          </Button>
        </form>
      </Form>
    </div>
  );
};