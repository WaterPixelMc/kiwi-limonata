
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lemon, Sparkles } from 'lucide-react';
import { generateShortId } from '@/utils/idGenerator';

interface Order {
  id: string;
  name: string;
  timestamp: string;
}

const CustomerForm = () => {
  const [name, setName] = useState('');
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    
    // Simulate a brief loading time for better UX
    setTimeout(() => {
      const shortId = generateShortId();
      const order: Order = {
        id: shortId,
        name: name.trim(),
        timestamp: new Date().toISOString()
      };

      // Save to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('lemonadeOrders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('lemonadeOrders', JSON.stringify(existingOrders));

      setGeneratedId(shortId);
      setIsLoading(false);
      console.log('Order created:', order);
    }, 800);
  };

  const handleNewOrder = () => {
    setName('');
    setGeneratedId(null);
  };

  if (generatedId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-300 to-lime-300 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Order Confirmed!</CardTitle>
            <CardDescription className="text-gray-600">
              Your fresh lemonade is being prepared
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-gradient-to-r from-yellow-100 to-lime-100 p-6 rounded-lg border border-yellow-200">
              <p className="text-sm text-gray-600 mb-2">Your Order ID</p>
              <p className="text-3xl font-bold text-gray-800 tracking-wider">{generatedId}</p>
            </div>
            <p className="text-gray-600">
              Thanks <span className="font-semibold text-gray-800">{name}</span>! 
              Please keep this ID for your order.
            </p>
            <Button 
              onClick={handleNewOrder}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-200"
            >
              Place Another Order
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-300 to-lime-300 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
            <Lemon className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800">Sunny's Lemonade</CardTitle>
          <CardDescription className="text-gray-600">
            Fresh, cold, and perfectly sweet! 🍋
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                What's your name?
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={!name.trim() || isLoading}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 rounded-lg transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Preparing your order...</span>
                </div>
              ) : (
                'Order My Lemonade! 🍋'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerForm;
