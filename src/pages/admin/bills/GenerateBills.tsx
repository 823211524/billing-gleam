import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileText } from "lucide-react";
import { BillDownloadLink } from "@/utils/pdfGenerator";

const GenerateBills = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: validatedReadings = [], isLoading } = useQuery({
    queryKey: ['readings', 'validated'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('readings')
        .select(`
          *,
          bills (*)
        `)
        .eq('validated', true)
        .is('bills', null);
      
      if (error) throw error;
      return data || [];
    }
  });

  const generateBillMutation = useMutation({
    mutationFn: async (readingId: number) => {
      // Simple bill calculation logic - can be enhanced
      const reading = validatedReadings.find(r => r.id === readingId);
      if (!reading) throw new Error("Reading not found");

      const amount = reading.reading * 0.15; // Example rate
      const consumption = reading.reading;

      const { error } = await supabase
        .from('bills')
        .insert({
          reading_id: readingId,
          amount,
          consumption,
          pdf_url: '#', // This would be generated and stored
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          user_id: reading.user_id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readings'] });
      toast({
        title: "Success",
        description: "Bill generated successfully"
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
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Generate Bills</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Meter ID</TableHead>
                <TableHead>Reading</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Loading readings...
                  </TableCell>
                </TableRow>
              ) : validatedReadings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No readings ready for billing
                  </TableCell>
                </TableRow>
              ) : (
                validatedReadings.map((reading) => (
                  <TableRow key={reading.id}>
                    <TableCell>{reading.meter_id}</TableCell>
                    <TableCell>{reading.reading}</TableCell>
                    <TableCell>{`${reading.month}/${reading.year}`}</TableCell>
                    <TableCell>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => generateBillMutation.mutate(reading.id)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Bill
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default GenerateBills;