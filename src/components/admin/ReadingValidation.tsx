import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Check, X, Image } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const ReadingValidation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: readings = [], isLoading, error } = useQuery({
    queryKey: ['readings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('readings')
        .select(`
          *,
          meter:meters(id, qr_code),
          user:users(given_name, surname)
        `)
        .eq('validated', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const validationMutation = useMutation({
    mutationFn: async ({ readingId, validated, validationErrors = [] }: { readingId: number, validated: boolean, validationErrors?: string[] }) => {
      const { error } = await supabase
        .from('readings')
        .update({ 
          validated,
          validated_by_admin: true,
          validation_errors: validationErrors
        })
        .eq('id', readingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readings'] });
      toast({
        title: "Success",
        description: "Reading validation status updated"
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

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Meter ID</TableHead>
              <TableHead>Reading</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading readings...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-red-500">
                  Error loading readings
                </TableCell>
              </TableRow>
            ) : readings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No readings pending validation
                </TableCell>
              </TableRow>
            ) : (
              readings.map((reading) => (
                <TableRow key={reading.id}>
                  <TableCell>{reading.meter?.qr_code}</TableCell>
                  <TableCell>{reading.reading}</TableCell>
                  <TableCell>{`${reading.user?.given_name} ${reading.user?.surname}`}</TableCell>
                  <TableCell>{`${reading.month}/${reading.year}`}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => window.open(reading.image_url, '_blank')}
                    >
                      <Image className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => validationMutation.mutate({ readingId: reading.id, validated: true })}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => validationMutation.mutate({ 
                          readingId: reading.id, 
                          validated: false,
                          validationErrors: ['Reading rejected by admin']
                        })}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};