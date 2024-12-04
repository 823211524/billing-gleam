import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bill, Meter, Reading } from "@/types";

export const useConsumerData = (userId: number) => {
  const { data: meters = [], isLoading: metersLoading } = useQuery({
    queryKey: ['consumer-meters', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meters')
        .select('*')
        .eq('consumer_id', userId)
        .eq('is_enabled', true);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: readings = [], isLoading: readingsLoading } = useQuery({
    queryKey: ['consumer-readings', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('readings')
        .select(`
          *,
          meter:meters(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: bills = [], isLoading: billsLoading } = useQuery({
    queryKey: ['consumer-bills', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bills')
        .select(`
          *,
          reading:readings(*)
        `)
        .eq('user_id', userId)
        .order('due_date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return {
    meters,
    readings,
    bills,
    isLoading: metersLoading || readingsLoading || billsLoading
  };
};