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
import { Reading } from "@/types";
import { Check, X, Image } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const ReadingValidation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: readings = [], isLoading } = useQuery({
    queryKey: ['readings', 'unvalidated'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('readings')
        .select('*')
        .eq('validated', false);
      
      if (error) throw error;
      return data || [];
    }
  });

  const validateMutation = useMutation({
    mutationFn: async ({ readingId, validated }: { readingId: number, validated: boolean }) => {
      const { error } = await supabase
        .from('readings')
        .update({ 
          validated,
          validated_by_admin: validated,
          updated_at: new Date().toISOString()
        })
        .eq('id', readingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readings'] });
      toast({
        title: "Success",
        description: "Reading status updated successfully"
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
              <TableHead>Date</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading readings...
                </TableCell>
              </TableRow>
            ) : readings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No readings pending validation
                </TableCell>
              </TableRow>
            ) : (
              readings.map((reading) => (
                <TableRow key={reading.id}>
                  <TableCell>{reading.meter_id}</TableCell>
                  <TableCell>{reading.reading}</TableCell>
                  <TableCell>{`${reading.month}/${reading.year}`}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={reading.image_url} target="_blank" rel="noopener noreferrer">
                        <Image className="h-4 w-4" />
                      </a>
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => validateMutation.mutate({ readingId: reading.id, validated: true })}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => validateMutation.mutate({ readingId: reading.id, validated: false })}
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