import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Filter, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";
import SwipeCard, { SwipeActions } from "@/components/SwipeCard";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const swipeItems = [
  {
    id: "1",
    name: "LEGO Architecture Taj Mahal",
    image: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=400&h=600&fit=crop",
    owner: "Carlos P.",
    wantsToTrade: ["Star Wars", "Technic", "Creator Expert"],
  },
  {
    id: "2",
    name: "Minifiguras Marvel - Coleção Completa",
    image: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=400&h=600&fit=crop",
    owner: "Sofia M.",
    wantsToTrade: ["DC Comics", "Harry Potter", "Ninjago"],
  },
  {
    id: "3",
    name: "LEGO Ideas NASA Apollo Saturn V",
    image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=400&h=600&fit=crop",
    owner: "Miguel A.",
    wantsToTrade: ["Space", "City", "Technic"],
  },
  {
    id: "4",
    name: "LEGO Technic Porsche 911 GT3 RS",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=600&fit=crop",
    owner: "João M.",
    wantsToTrade: ["Technic", "Speed Champions", "Creator"],
  },
  {
    id: "5",
    name: "LEGO Star Wars Millennium Falcon UCS",
    image: "https://images.unsplash.com/photo-1518946222227-364f22132616?w=400&h=600&fit=crop",
    owner: "Ana L.",
    wantsToTrade: ["Star Wars", "Architecture", "Ideas"],
  },
];

const Swap = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedItems, setSwipedItems] = useState<string[]>([]);
  const [matches, setMatches] = useState<string[]>([]);

  const handleSwipe = (direction: "left" | "right") => {
    const currentItem = swipeItems[currentIndex];
    if (currentItem) {
      setSwipedItems([...swipedItems, currentItem.id]);
      
      if (direction === "right") {
        // Simulate 30% chance of match
        if (Math.random() > 0.7) {
          setMatches([...matches, currentItem.id]);
          toast({
            title: "🎉 É um Match!",
            description: `Tu e ${currentItem.owner} querem trocar! Começa a conversa.`,
          });
        }
      }
      
      setCurrentIndex((prev) => Math.min(prev + 1, swipeItems.length));
    }
  };

  const handleUndo = () => {
    if (swipedItems.length > 0) {
      setSwipedItems(swipedItems.slice(0, -1));
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const resetCards = () => {
    setCurrentIndex(0);
    setSwipedItems([]);
    setMatches([]);
  };

  const visibleCards = swipeItems.slice(currentIndex, currentIndex + 2);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-secondary-foreground" />
              <span className="text-sm font-medium text-secondary-foreground">Swipe para trocar</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Encontra trocas perfeitas
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Desliza para a direita nas peças que te interessam. Se o outro utilizador também gostar das tuas, é match!
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center gap-8 mb-8"
          >
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-foreground">{swipedItems.length}</div>
              <div className="text-sm text-muted-foreground">Vistos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-lego-green">{matches.length}</div>
              <div className="text-sm text-muted-foreground">Matches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-foreground">{swipeItems.length - currentIndex}</div>
              <div className="text-sm text-muted-foreground">Restantes</div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-4 mb-8"
          >
            <Button variant="outline" className="rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar categorias
            </Button>
          </motion.div>

          {/* Swipe Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-full max-w-[360px] h-[520px]">
              <AnimatePresence>
                {visibleCards.map((item, index) => (
                  <SwipeCard
                    key={item.id}
                    {...item}
                    onSwipe={handleSwipe}
                    isTop={index === 0}
                  />
                ))}
              </AnimatePresence>
              
              {currentIndex >= swipeItems.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-card rounded-3xl card-shadow"
                >
                  <div className="text-center p-8">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                      <RefreshCw className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-foreground mb-2">
                      Viste tudo!
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {matches.length > 0 
                        ? `Fizeste ${matches.length} match${matches.length > 1 ? 'es' : ''}! Vai ver as tuas conversas.`
                        : "Não há mais peças para ver de momento."}
                    </p>
                    <Button onClick={resetCards} className="bg-primary text-primary-foreground">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Recomeçar
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
            
            {currentIndex < swipeItems.length && (
              <SwipeActions onSwipe={handleSwipe} onUndo={handleUndo} />
            )}

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-muted-foreground">
                Arrasta o card para a <span className="text-lego-green font-medium">direita</span> para mostrar interesse
                ou para a <span className="text-primary font-medium">esquerda</span> para passar
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Swap;