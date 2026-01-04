import { useState, useEffect } from "react";

export interface Product {
  id: string;
  name: string;
  image_url: string;
  price_eur: number;
  swapcoins_amount: number;
}

// Static products for SwapCoins packages since there's no products table
const SWAPCOINS_PACKAGES: Product[] = [
  {
    id: "1",
    name: "Pacote Inicial",
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop",
    price_eur: 4.99,
    swapcoins_amount: 50,
  },
  {
    id: "2",
    name: "Pacote Popular",
    image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=200&fit=crop",
    price_eur: 9.99,
    swapcoins_amount: 120,
  },
  {
    id: "3",
    name: "Pacote Premium",
    image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&h=200&fit=crop",
    price_eur: 19.99,
    swapcoins_amount: 300,
  },
  {
    id: "4",
    name: "Pacote Mega",
    image_url: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=200&h=200&fit=crop",
    price_eur: 49.99,
    swapcoins_amount: 800,
  },
];

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for better UX
    const timer = setTimeout(() => {
      setProducts(SWAPCOINS_PACKAGES);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return { products, loading };
};
