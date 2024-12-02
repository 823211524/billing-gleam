import { useState } from "react";
import { Camera, Upload, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  meterReading: z.string().min(1, "Meter reading is required"),
});

const MeterReadingUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      meterReading: "",
    },
  });

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>, meterReading: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if the device supports geolocation
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

      // Get location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      // Upload photo to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('meter-readings')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL of the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('meter-readings')
        .getPublicUrl(fileName);

      // TODO: Save reading to database with location and image URL
      console.log("Photo:", publicUrl);
      console.log("Location:", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      console.log("Meter Reading:", meterReading);

      toast({
        title: "Success",
        description: "Meter reading uploaded successfully. Once validated, your bill will be sent to your email.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload meter reading",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      form.reset();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Meter Reading</CardTitle>
        <CardDescription>
          Take a clear photo of your electricity meter and enter the reading
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-yellow-50 p-4 rounded-lg flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
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

            <div className="flex justify-center">
              <Button
                disabled={isUploading}
                className="relative"
                size="lg"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.capture = 'environment';
                  input.onchange = (e) => handlePhotoUpload(e as any, form.getValues('meterReading'));
                  input.click();
                }}
              >
                {isUploading ? (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Take Meter Photo
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MeterReadingUpload;