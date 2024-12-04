import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserX, UserCheck } from "lucide-react";
import { useCustomerActions } from "@/hooks/useCustomerActions";

interface CustomerTableProps {
  customers: any[];
  isLoading: boolean;
  error: Error | null;
}

export const CustomerTable = ({ customers, isLoading, error }: CustomerTableProps) => {
  const { disableMutation } = useCustomerActions();

  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={5} className="text-center">
          Loading customers...
        </TableCell>
      </TableRow>
    );
  }

  if (error) {
    return (
      <TableRow>
        <TableCell colSpan={5} className="text-center text-red-500">
          Error loading customers: {error.message}
        </TableCell>
      </TableRow>
    );
  }

  if (customers.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={5} className="text-center">
          No customers found
        </TableCell>
      </TableRow>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{`${customer.given_name} ${customer.surname}`}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.address}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  customer.is_enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {customer.is_enabled ? 'Active' : 'Disabled'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {customer.is_enabled ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => disableMutation.mutate({ userId: customer.id, action: 'disable' })}
                    >
                      <UserX className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => disableMutation.mutate({ userId: customer.id, action: 'enable' })}
                    >
                      <UserCheck className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};