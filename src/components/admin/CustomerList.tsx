import { useState } from "react";
import { CustomerTable } from "./customer/CustomerTable";
import { CustomerSearch } from "./customer/CustomerSearch";
import { useCustomers } from "@/hooks/useCustomers";

export const CustomerList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { customers, isLoading, error } = useCustomers();

  const filteredCustomers = customers?.filter(customer => 
    `${customer.given_name} ${customer.surname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? [];

  return (
    <div className="space-y-4">
      <CustomerSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <CustomerTable 
        customers={filteredCustomers}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};