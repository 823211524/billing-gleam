import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Reading } from "@/types";
import { Badge } from "@/components/ui/badge";

interface ReadingsHistoryProps {
  readings: Reading[];
}

export const ReadingsHistory = ({ readings }: ReadingsHistoryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Readings History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Reading</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {readings.map((reading) => (
              <TableRow key={reading.id}>
                <TableCell>
                  {format(new Date(reading.created_at), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>{reading.reading}</TableCell>
                <TableCell>
                  <Badge variant={reading.validated ? "default" : "destructive"}>
                    {reading.validated ? "Validated" : "Pending"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {readings.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No readings found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};