import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddCustomerForm } from "@/components/admin/AddCustomerForm";
import { CustomerList } from "@/components/admin/CustomerList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ManageUsers = () => {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Manage Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="space-y-4">
            <TabsList>
              <TabsTrigger value="list">User List</TabsTrigger>
              <TabsTrigger value="add">Add User</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <CustomerList />
            </TabsContent>
            <TabsContent value="add">
              <AddCustomerForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageUsers;