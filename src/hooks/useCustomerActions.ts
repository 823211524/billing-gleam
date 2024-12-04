import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useCustomerActions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const disableMutation = useMutation({
    mutationFn: async ({ userId, action }: { userId: number, action: 'disable' | 'enable' }) => {
      const { error } = await supabase
        .from('users')
        .update({ 
          is_enabled: action === 'enable',
          disabled_at: action === 'disable' ? new Date().toISOString() : null
        })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Success",
        description: "Customer status updated successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return { disableMutation };
};