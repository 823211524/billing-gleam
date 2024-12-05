import { FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Meter } from "@/types";

export interface MeterSelectProps {
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
                {meter.table_name || meter.id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
    </FormItem>
  );
};