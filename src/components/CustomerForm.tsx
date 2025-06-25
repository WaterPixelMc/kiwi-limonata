
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coffee, Sparkles, Settings } from 'lucide-react';
import { generateShortId } from '@/utils/idGenerator';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  customer_name: string;
  created_at: string;
}

const CustomerForm = () => {
  const [name, setName] = useState('');
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    
    try {
      const shortId = generateShortId();
      
      // Save to Supabase database
      const { error } = await supabase
        .from('lemonade_orders')
        .insert([
          {
            id: shortId,
            customer_name: name.trim()
          }
        ]);

      if (error) {
        console.error('Error saving order:', error);
        toast({
          title: "Error",
          description: "Failed to save order. Please try again.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      console.log('Order saved to database:', { id: shortId, name: name.trim() });
      setGeneratedId(shortId);
      setIsLoading(false);
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleNewOrder = () => {
    setName('');
    setGeneratedId(null);
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  if (generatedId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-300 to-lime-300 flex items-center justify-center p-4">
        <Button
          onClick={handleAdminClick}
          variant="outline"
          size="sm"
          className="absolute top-4 right-4 bg-white/80 hover:bg-white"
        >
          <Settings className="w-4 h-4 mr-2" />
          Admin
        </Button>
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Sipariş Onaylandı!</CardTitle>
            <CardDescription className="text-gray-600">
              Taze limonatanız hazırlanıyor
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-gradient-to-r from-yellow-100 to-lime-100 p-6 rounded-lg border border-yellow-200">
              <p className="text-sm text-gray-600 mb-2">Sipariş Numaranız</p>
              <p className="text-3xl font-bold text-gray-800 tracking-wider">{generatedId}</p>
            </div>
            <p className="text-gray-600">
              Teşekkürler <span className="font-semibold text-gray-800">{name}</span>! 
              Lütfen bu numarayı siparişiniz için saklayın.
            </p>
            <Button 
              onClick={handleNewOrder}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-200"
            >
              Başka Sipariş Ver
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-300 to-lime-300 flex items-center justify-center p-4">
      <Button
        onClick={handleAdminClick}
        variant="outline"
        size="sm"
        className="absolute top-4 right-4 bg-white/80 hover:bg-white"
      >
        <Settings className="w-4 h-4 mr-2" />
        Admin
      </Button>
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
            <Coffee className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800">Kiwi'nin Limonatası</CardTitle>
          <CardDescription className="text-gray-600">
            Taze, soğuk ve mükemmel tatlılıkta! 🍋
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Adınız nedir?
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Adınızı girin"
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
                  <span>Siparişiniz hazırlanıyor...</span>
                </div>
              ) : (
                'Limonatamı Sipariş Et! 🍋'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerForm;
