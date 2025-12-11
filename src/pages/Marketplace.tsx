import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, Grid3X3, LayoutList } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const categories = [
  "Todos",
  "Technic",
  "Star Wars",
  "City",
  "Creator Expert",
  "Marvel",
  "Harry Potter",
  "Ninjago",
  "Architecture",
  "Minifiguras",
];

const products = [
  {
    id: "1",
    name: "LEGO Technic Bugatti Chiron 42083 - Peças Avulsas",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop",
    seller: "João M.",
    condition: "como novo" as const,
    category: "Technic",
  },
  {
    id: "2",
    name: "Minifiguras Star Wars - Lote de 5 Personagens",
    price: 24.50,
    image: "https://images.unsplash.com/photo-1518946222227-364f22132616?w=400&h=400&fit=crop",
    seller: "Maria S.",
    condition: "usado" as const,
    category: "Star Wars",
  },
  {
    id: "3",
    name: "LEGO City - Estação de Polícia Completa",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1560961911-ba7ef651a56c?w=400&h=400&fit=crop",
    seller: "Pedro R.",
    condition: "novo" as const,
    category: "City",
  },
  {
    id: "4",
    name: "Peças Raras LEGO Creator Expert - Modular",
    price: 32.00,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    seller: "Ana L.",
    condition: "como novo" as const,
    category: "Creator Expert",
  },
  {
    id: "5",
    name: "LEGO Architecture - Estátua da Liberdade",
    price: 89.00,
    image: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=400&h=600&fit=crop",
    seller: "Carlos P.",
    condition: "novo" as const,
    category: "Architecture",
  },
  {
    id: "6",
    name: "Minifiguras Marvel - Vingadores",
    price: 38.00,
    image: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=400&h=400&fit=crop",
    seller: "Sofia M.",
    condition: "usado" as const,
    category: "Marvel",
  },
  {
    id: "7",
    name: "LEGO Harry Potter - Castelo de Hogwarts",
    price: 120.00,
    image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=400&h=400&fit=crop",
    seller: "Miguel A.",
    condition: "como novo" as const,
    category: "Harry Potter",
  },
  {
    id: "8",
    name: "LEGO Ninjago - Dragão Dourado",
    price: 28.00,
    image: "https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=400&h=400&fit=crop",
    seller: "Rita C.",
    condition: "usado" as const,
    category: "Ninjago",
  },
];

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Marketplace
            </h1>
            <p className="text-muted-foreground">
              Encontra peças e sets LEGO de outros colecionadores
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Pesquisar peças, sets, minifiguras..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl bg-card border-border"
              />
            </div>
            <Button variant="outline" className="h-12 px-6 rounded-xl">
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Filtros
            </Button>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-12 w-12 rounded-xl", viewMode === "grid" && "bg-muted")}
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-12 w-12 rounded-xl", viewMode === "list" && "bg-muted")}
                onClick={() => setViewMode("list")}
              >
                <LayoutList className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Results Count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-muted-foreground mb-6"
          >
            {filteredProducts.length} resultados encontrados
          </motion.p>

          {/* Products Grid */}
          <div className={cn(
            "grid gap-6",
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          )}>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link to={`/product/${product.id}`}>
                  <ProductCard {...product} />
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Nenhum produto encontrado</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;