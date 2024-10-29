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
import { Search, UserX } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/types";

export const CustomerList = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [customers] = useState<User[]>([]); // TODO: Replace with actual API data

  const handleDeactivate = (userId: number) => {
    // TODO: Implement actual deactivation
    toast({
      title: "Customer deactivated",
      description: "The customer has been deactivated successfully"
    });
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
              <TableHead>Meter ID</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{`${customer.givenName} ${customer.surname}`}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>{"MET-" + customer.id}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeactivate(customer.id)}
                    >
                      <UserX className="h-4 w-4" />
                    </Button>
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