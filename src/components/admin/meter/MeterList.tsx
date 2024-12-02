import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface Meter {
  id: string;
  secretWord: string;
  tableName: string;
  enabled: boolean;
  dateOfChange: string;
}

interface MeterListProps {
  meters: Meter[];
  isLoading: boolean;
  onEdit: (meter: Meter) => void;
  onDelete: (meterId: string) => Promise<void>;
}

export const MeterList = ({ meters, isLoading, onEdit, onDelete }: MeterListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Table Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Modified</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center">Loading meters...</TableCell>
          </TableRow>
        ) : meters.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center">No meters found</TableCell>
          </TableRow>
        ) : (
          meters.map((meter) => (
            <TableRow key={meter.id}>
              <TableCell>{meter.tableName}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  meter.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {meter.enabled ? "Enabled" : "Disabled"}
                </span>
              </TableCell>
              <TableCell>{new Date(meter.dateOfChange).toLocaleDateString()}</TableCell>
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
          ))
        )}
      </TableBody>
    </Table>
  );
};