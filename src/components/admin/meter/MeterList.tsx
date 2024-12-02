import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Meter {
  id: string;
  secretWord: string;
  tableName: string;
  enabled: boolean;
  dateOfChange: string;
}

interface MeterListProps {
  meters: Meter[];
  onEdit: (meter: Meter) => void;
  onDelete: (meterId: string) => Promise<void>;
}

export const MeterList = ({ meters, onEdit, onDelete }: MeterListProps) => {
  const { toast } = useToast();

  const handleDelete = async (meterId: string) => {
    try {
      await onDelete(meterId);
      toast({
        title: "Meter deleted",
        description: "The meter has been removed from the system",
      });
    } catch (error) {
      toast({
        title: "Error deleting meter",
        description: "This meter might be in use by a consumer",
        variant: "destructive",
      });
    }
  };

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
        {meters.map((meter) => (
          <TableRow key={meter.id}>
            <TableCell>{meter.tableName}</TableCell>
            <TableCell>{meter.enabled ? "Enabled" : "Disabled"}</TableCell>
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
                onClick={() => handleDelete(meter.id)}
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