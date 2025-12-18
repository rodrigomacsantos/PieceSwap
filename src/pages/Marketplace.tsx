import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, Grid3X3, LayoutList } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useListings } from "@/hooks/useListings";

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

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const { listings, loading, fetchListings } = useListings();

  useEffect(() => {
    fetchListings();
  }, []);

  const filteredProducts = listings.filter((listing) => {
    const matchesCategory = selectedCategory === "Todos" || listing.category === selectedCategory;
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase());
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

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">A carregar anúncios...</p>
            </div>
          )}

          {/* Products Grid */}
          {!loading && (
            <div className={cn(
              "grid gap-6",
              viewMode === "grid" 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            )}>
              {filteredProducts.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * Math.min(index, 10) }}
                >
                  <Link to={`/product/${listing.id}`}>
                    <ProductCard
                      id={listing.id}
                      name={listing.title}
                      price={listing.price_swap_coins || 0}
                      image={listing.images?.[0] || "/placeholder.svg"}
                      seller={listing.seller?.username || listing.seller?.full_name || "Vendedor"}
                      condition={listing.condition as "novo" | "usado" | "como novo"}
                      category={listing.category}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
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