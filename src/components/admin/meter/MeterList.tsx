import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Meter } from "@/types/meter";

interface MeterListProps {
  meters: Meter[];
  onEdit: (meter: Meter) => void;
  onDelete: (meterId: string) => Promise<void>;
  isLoading: boolean;
}

export const MeterList = ({ meters, onEdit, onDelete, isLoading }: MeterListProps) => {
  if (isLoading) {
    return <div className="text-center py-4">Loading meters...</div>;
  }

  if (meters.length === 0) {
    return <div className="text-center py-4">No meters found</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>QR Code</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Unit Rate</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Consumer</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {meters.map((meter) => (
          <TableRow key={meter.id}>
            <TableCell>{meter.qr_code}</TableCell>
            <TableCell>
              {meter.longitude.toFixed(6)}, {meter.latitude.toFixed(6)}
            </TableCell>
            <TableCell>${meter.unit_rate.toFixed(2)}/unit</TableCell>
            <TableCell>
              <Badge variant={meter.is_enabled ? "default" : "secondary"}>
                {meter.is_enabled ? "Active" : "Disabled"}
              </Badge>
            </TableCell>
            <TableCell>
              {meter.consumer_id ? "Assigned" : "Unassigned"}
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(meter)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(meter.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};