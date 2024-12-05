import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MeterSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const MeterSelect = ({ value, onChange }: MeterSelectProps) => {
  const { data: meters = [], isLoading } = useQuery({
    queryKey: ['userMeters'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('meters')
        .select('*')
        .eq('consumer_id', parseInt(user.id))
        .eq('is_enabled', true);
      
      if (error) throw error;
      return data || [];
    }
  });

  return (
    <FormItem>
      <FormLabel>Select Meter</FormLabel>
      <FormControl>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a meter" />
          </SelectTrigger>
          <SelectContent>
            {meters.map((meter) => (
              <SelectItem key={meter.id} value={meter.id}>
                {meter.qr_code} - {meter.table_name || 'Unnamed Meter'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};