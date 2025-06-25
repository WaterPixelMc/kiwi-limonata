
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Users, Clock, Trash2, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  customer_name: string;
  created_at: string;
}

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('lemonade_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading orders:', error);
        toast({
          title: "Error",
          description: "Failed to load orders from database.",
          variant: "destructive"
        });
        return;
      }

      setOrders(data || []);
      console.log('Loaded orders from database:', data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Kiko0811') {
      setIsAuthenticated(true);
      setError('');
      console.log('Admin authenticated successfully');
    } else {
      setError('Incorrect password');
      console.log('Authentication failed');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('lemonade_orders')
        .delete()
        .eq('id', orderId);

      if (error) {
        console.error('Error deleting order:', error);
        toast({
          title: "Error",
          description: "Failed to delete order.",
          variant: "destructive"
        });
        return;
      }

      const updatedOrders = orders.filter(order => order.id !== orderId);
      setOrders(updatedOrders);
      console.log('Deleted order:', orderId);
      
      toast({
        title: "Success",
        description: "Order deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: "Error",
        description: "Failed to delete order. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleBackToMain = () => {
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Admin Login</CardTitle>
            <CardDescription className="text-gray-600">
              Enter password to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg"
              >
                Login
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={handleBackToMain}
                className="w-full"
              >
                Back to Main
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-800">Admin Panel</CardTitle>
                  <CardDescription className="text-gray-600">
                    Lemonade Orders Management
                  </CardDescription>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={loadOrders}
                  variant="outline"
                  className="bg-blue-50 hover:bg-blue-100 border-blue-200"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Refresh'}
                </Button>
                <Button 
                  onClick={handleBackToMain}
                  variant="outline"
                >
                  Back to Main
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-green-400 to-green-500 p-4 rounded-lg text-white">
                  <h3 className="text-lg font-semibold">Total Orders</h3>
                  <p className="text-3xl font-bold">{orders.length}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-4 rounded-lg text-white">
                  <h3 className="text-lg font-semibold">Today's Orders</h3>
                  <p className="text-3xl font-bold">
                    {orders.filter(order => 
                      new Date(order.created_at).toDateString() === new Date().toDateString()
                    ).length}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-purple-400 to-purple-500 p-4 rounded-lg text-white">
                  <h3 className="text-lg font-semibold">Revenue</h3>
                  <p className="text-3xl font-bold">${(orders.length * 2.5).toFixed(2)}</p>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">No orders yet</h3>
                <p className="text-gray-400">Orders will appear here when customers place them</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Order ID</TableHead>
                      <TableHead className="font-semibold">Customer Name</TableHead>
                      <TableHead className="font-semibold">Order Time</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono font-semibold text-blue-600">
                          {order.id}
                        </TableCell>
                        <TableCell className="font-medium">{order.customer_name}</TableCell>
                        <TableCell className="text-gray-600">
                          {formatTimestamp(order.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={() => handleDeleteOrder(order.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
