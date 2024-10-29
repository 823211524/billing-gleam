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

export const ReadingValidation = () => {
  const { toast } = useToast();
  const [readings] = useState<Reading[]>([]); // TODO: Replace with actual API data

  const handleValidate = (readingId: number, validated: boolean) => {
    // TODO: Implement actual validation
    toast({
      title: validated ? "Reading validated" : "Reading rejected",
      description: validated ? "The reading has been approved" : "The reading has been rejected"
    });
  };

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
            {readings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No readings pending validation
                </TableCell>
              </TableRow>
            ) : (
              readings.map((reading) => (
                <TableRow key={reading.id}>
                  <TableCell>{reading.meterId}</TableCell>
                  <TableCell>{reading.reading}</TableCell>
                  <TableCell>{`${reading.month}/${reading.year}`}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Image className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleValidate(reading.id, true)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleValidate(reading.id, false)}
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