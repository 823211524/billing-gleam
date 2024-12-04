import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ImageCapture } from "./meter-reading/ImageCapture";
import { OCRProcessor } from "./meter-reading/OCRProcessor";

const formSchema = z.object({
  meterReading: z.string().min(1, "Meter reading is required"),
  meterId: z.string().min(1, "Meter selection is required")
});

export const MeterReadingForm = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const ocrProcessor = new OCRProcessor();

  const { data: meters = [] } = useQuery({
    queryKey: ['userMeters'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('meters')
        .select('*')
        .eq('consumer_id', user.id);
      
      if (error) throw error;
      return data;
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      meterReading: "",
      meterId: ""
    },
  });

  const handleImageCapture = async (file: File, preview: string) => {
    setIsProcessing(true);
    setImagePreview(preview);

    try {
      const reading = await ocrProcessor.processImage(file);
      
      if (reading) {
        form.setValue('meterReading', reading);
        toast({
          title: "Reading detected",
          description: `Detected reading: ${reading}. Please verify this value.`,
        });
      } else {
        toast({
          title: "No reading detected",
          description: "Please enter the reading manually",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error processing image",
        description: "Failed to extract reading from image",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      await ocrProcessor.cleanup();
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('readings')
        .insert({
          meter_id: data.meterId,
          reading: parseFloat(data.meterReading),
          image_url: imagePreview || '',
          user_id: user.id,
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reading submitted successfully",
      });

      form.reset();
      setImagePreview(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit reading",
        variant: "destructive",
      });
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="meterId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Meter</FormLabel>
                <FormControl>
                  <select
                    className="w-full p-2 border rounded"
                    {...field}
                  >
                    <option value="">Select a meter</option>
                    {meters.map((meter) => (
                      <option key={meter.id} value={meter.id}>
                        {meter.qr_code}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col items-center gap-4">
            <ImageCapture
              onImageCapture={handleImageCapture}
              isUploading={isUploading}
              isProcessing={isProcessing}
            />

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

          <Button 
            type="submit" 
            className="w-full"
            disabled={isUploading || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Submit Reading
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};