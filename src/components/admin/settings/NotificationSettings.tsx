import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { SystemSettingsFormData } from "./types";

interface NotificationSettingsProps {
  form: UseFormReturn<SystemSettingsFormData>;
}

export const NotificationSettings = ({ form }: NotificationSettingsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="enable_notifications"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between">
            <div>
              <FormLabel>Enable Notifications</FormLabel>
              <FormDescription>Send notifications to users</FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="enable_reading_reminders"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between">
            <div>
              <FormLabel>Enable Reading Reminders</FormLabel>
              <FormDescription>Send reminders for meter readings</FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};