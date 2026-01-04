import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Wallet = () => {
  const { user, swapcoins, refreshBalance } = useAuth();
  const { products, loading } = useProducts();
  const { toast } = useToast();

  const handlePurchase = async (product: Product) => {
    if (!user) {
      toast({ title: "Erro", description: "Tens de estar autenticado para comprar.", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ swap_coins: swapcoins + product.swapcoins_amount })
        .eq('id', user.id);

      if (error) throw error;

      await refreshBalance();
      toast({ title: "Compra efetuada!", description: `Adicionaste ${product.swapcoins_amount} SwapCoins à tua carteira.` });
    } catch (error) {
      console.error("Error purchasing SwapCoins:", error);
      toast({ title: "Erro", description: "Não foi possível completar a compra.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            A tua Carteira
          </h1>
          <div className="bg-card p-6 rounded-xl mb-8">
            <h2 className="text-lg font-medium text-muted-foreground">O teu Saldo</h2>
            <p className="text-4xl font-bold font-display text-primary">
              {swapcoins} SwapCoins
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold font-display text-foreground mb-6">
              Comprar SwapCoins
            </h2>
            {loading && <p>A carregar pacotes...</p>}
            {!loading && products.length === 0 && <p>Não há pacotes de SwapCoins disponíveis.</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((pkg) => (
                <div key={pkg.id} className="bg-card rounded-xl p-6 text-center">
                  <img src={pkg.image_url} alt={pkg.name} className="mx-auto mb-4 h-24" />
                  <h3 className="text-xl font-bold font-display">{pkg.name}</h3>
                  <p className="text-muted-foreground mb-4">€{pkg.price_eur.toFixed(2)}</p>
                  <Button className="w-full" onClick={() => handlePurchase(pkg)}>Comprar</Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wallet;
