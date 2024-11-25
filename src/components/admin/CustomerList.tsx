import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserX, UserCheck, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const CustomerList = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await fetch('/api/customers');
      if (!response.ok) throw new Error('Failed to fetch customers');
      return response.json();
    }
  });

  const disableMutation = useMutation({
    mutationFn: async ({ userId, action }: { userId: number, action: 'disable' | 'enable' }) => {
      const response = await fetch(`/api/customers/${userId}/${action}`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error(`Failed to ${action} customer`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Customer status updated",
        description: "The customer's status has been updated successfully"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/customers/${userId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete customer');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Customer deleted",
        description: "The customer has been permanently deleted from the system"
      });
    }
  });

  const filteredCustomers = customers.filter(customer => 
    `${customer.givenName} ${customer.surname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canDelete = (disabledAt: Date | null) => {
    if (!disabledAt) return false;
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
    return new Date(disabledAt) <= fiveYearsAgo;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading customers...
                </TableCell>
              </TableRow>
            ) : filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{`${customer.givenName} ${customer.surname}`}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      customer.isEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {customer.isEnabled ? 'Active' : 'Disabled'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {customer.isEnabled ? (
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
                      {canDelete(customer.disabledAt) && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMutation.mutate(customer.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
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