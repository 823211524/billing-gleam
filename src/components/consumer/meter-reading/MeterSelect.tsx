import { Meter } from "@/types";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MeterSelectProps {
  value: string;
  onChange: (value: string) => void;
  meters: Meter[];
}

export const MeterSelect = ({ value, onChange, meters }: MeterSelectProps) => {
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