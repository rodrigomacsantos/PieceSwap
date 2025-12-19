import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Filter, RefreshCw, Crown, Lock, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SwipeCard, { SwipeActions } from "@/components/SwipeCard";
import MatchModal from "@/components/MatchModal";
import { NearbyUsers } from "@/components/NearbyUsers";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSubscription } from "@/hooks/useSubscription";
import { useListings } from "@/hooks/useListings";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const FREE_SWIPE_LIMIT = 20;

// Categories for "wants to trade" - based on related categories
const relatedCategories: Record<string, string[]> = {
  "Technic": ["Speed Champions", "Creator Expert", "Architecture"],
  "Star Wars": ["Marvel", "DC Comics", "Ideas"],
  "City": ["Creator", "Friends", "Ninjago"],
  "Creator Expert": ["Architecture", "Technic", "Ideas"],
  "Marvel": ["DC Comics", "Star Wars", "Ninjago"],
  "Harry Potter": ["Ideas", "Creator Expert", "Architecture"],
  "Ninjago": ["City", "Marvel", "Star Wars"],
  "Architecture": ["Creator Expert", "Ideas", "Technic"],
  "Minifiguras": ["Star Wars", "Marvel", "Harry Potter"],
};

const Swap = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { listings, loading: listingsLoading, fetchListings } = useListings();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedItems, setSwipedItems] = useState<string[]>([]);
  const [matches, setMatches] = useState<string[]>([]);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedItem, setMatchedItem] = useState<any>(null);
  
  const { 
    isPremium, 
    swipesRemaining, 
    canSwipe, 
    canSuperlike,
    superlikesRemaining,
    recordSwipe, 
    useSuperlike,
    loading 
  } = useSubscription();

  useEffect(() => {
    fetchListings();
  }, []);

  // Transform listings to swipe items, excluding user's own listings
  const swipeItems = useMemo(() => {
    return listings
      .filter(listing => listing.user_id !== user?.id && listing.status === 'active')
      .map(listing => ({
        id: listing.id,
        name: listing.title,
        image: listing.images?.[0] || "/placeholder.svg",
        owner: listing.seller?.full_name || listing.seller?.username || "Vendedor",
        wantsToTrade: relatedCategories[listing.category] || ["Technic", "Star Wars", "City"],
      }));
  }, [listings, user?.id]);

  const handleSwipe = async (direction: "left" | "right") => {
    if (!canSwipe) {
      toast.error("Atingiste o limite diário de swipes!", {
        description: "Faz upgrade para Premium para swipes ilimitados.",
        action: {
          label: "Ver Premium",
          onClick: () => navigate("/premium"),
        },
      });
      return;
    }

    const currentItem = swipeItems[currentIndex];
    if (currentItem) {
      await recordSwipe();
      setSwipedItems([...swipedItems, currentItem.id]);

      if (direction === "right") {
        const { data, error } = await supabase.rpc("handle_swipe", {
          listing_id_swiped_on: currentItem.id,
          swipe_direction: "right",
        });

        if (error) {
          toast.error("Ocorreu um erro ao processar o teu swipe.", {
            description: error.message,
          });
        } else if (data.match) {
          setMatches([...matches, currentItem.id]);
          setMatchedItem(currentItem);
          setShowMatchModal(true);
        }
      }

      setCurrentIndex((prev) => Math.min(prev + 1, swipeItems.length));
    }
  };

  const handleSuperlike = async () => {
    if (!isPremium) {
      toast.error("Superlikes são exclusivos do Premium!", {
        action: {
          label: "Ver Premium",
          onClick: () => navigate("/premium"),
        },
      });
      return;
    }

    if (!canSuperlike) {
      toast.error("Já usaste o teu superlike de hoje!", {
        description: "Volta amanhã para mais um superlike.",
      });
      return;
    }

    const currentItem = swipeItems[currentIndex];
    if (currentItem) {
      const success = await useSuperlike(currentItem.id);
      if (success) {
        const { data, error } = await supabase.rpc("handle_swipe", {
          listing_id_swiped_on: currentItem.id,
          swipe_direction: "right",
        });

        if (error) {
          toast.error("Ocorreu um erro ao processar o teu superlike.", {
            description: error.message,
          });
        } else {
          toast.success("Superlike enviado!", {
            description: "As tuas chances de match aumentaram 3x!",
          });

          if (data.match) {
            setMatches([...matches, currentItem.id]);
            setMatchedItem(currentItem);
            setShowMatchModal(true);
          }
        }

        setSwipedItems([...swipedItems, currentItem.id]);
        setCurrentIndex((prev) => Math.min(prev + 1, swipeItems.length));
      }
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
  const swipeProgress = isPremium ? 100 : Math.min(((FREE_SWIPE_LIMIT - swipesRemaining) / FREE_SWIPE_LIMIT) * 100, 100);

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
              {isPremium && (
                <span className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-full flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Premium
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Encontra trocas perfeitas
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Desliza para a direita nas peças que te interessam. Se o outro utilizador também gostar das tuas, é match!
            </p>
          </motion.div>

          {/* Swipe Limit Progress (Free users only) */}
          {!isPremium && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="max-w-md mx-auto mb-6"
            >
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Swipes restantes hoje</span>
                <span className="font-medium text-foreground">{Math.max(0, swipesRemaining)}/{FREE_SWIPE_LIMIT}</span>
              </div>
              <Progress value={100 - swipeProgress} className="h-2" />
              {swipesRemaining <= 5 && swipesRemaining > 0 && (
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Quase a acabar! <Link to="/premium" className="text-primary underline">Faz upgrade</Link> para swipes ilimitados.
                </p>
              )}
              {swipesRemaining <= 0 && (
                <div className="mt-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-foreground flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    Limite diário atingido!
                  </p>
                  <Link to="/premium">
                    <Button size="sm" className="mt-2 w-full">
                      <Crown className="w-4 h-4 mr-2" />
                      Desbloquear swipes ilimitados
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          )}

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
              <div className="text-2xl font-display font-bold text-foreground">{Math.max(0, swipeItems.length - currentIndex)}</div>
              <div className="text-sm text-muted-foreground">Restantes</div>
            </div>
            {isPremium && (
              <div className="text-center">
                <div className="text-2xl font-display font-bold text-secondary-foreground flex items-center justify-center gap-1">
                  <Star className="w-5 h-5" />
                  {superlikesRemaining}
                </div>
                <div className="text-sm text-muted-foreground">Superlikes</div>
              </div>
            )}
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

          {/* Loading State */}
          {listingsLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground">A carregar anúncios...</p>
            </div>
          )}

          {/* No Listings State */}
          {!listingsLoading && swipeItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-2">
                Ainda não há anúncios
              </h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Sê o primeiro a criar um anúncio e começa a trocar LEGO com outros colecionadores!
              </p>
              <Link to="/sell">
                <Button className="bg-primary text-primary-foreground">
                  Criar Anúncio
                </Button>
              </Link>
            </motion.div>
          )}

          {/* Swipe Area */}
          {!listingsLoading && swipeItems.length > 0 && (
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
                          ? `Fizeste ${matches.length} match${matches.length > 1 ? 'es' : ''}!`
                          : "Não há mais peças para ver de momento."}
                      </p>
                      <div className="flex gap-3 justify-center">
                        {matches.length > 0 && (
                          <Link to="/chats">
                            <Button variant="outline">
                              Ver Conversas
                            </Button>
                          </Link>
                        )}
                        <Button onClick={resetCards} className="bg-primary text-primary-foreground">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Recomeçar
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              
              {currentIndex < swipeItems.length && (
                <SwipeActions 
                  onSwipe={handleSwipe} 
                  onUndo={handleUndo}
                  onSuperlike={handleSuperlike}
                  canSuperlike={canSuperlike}
                  isPremium={isPremium}
                />
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
                {isPremium && (
                  <p className="text-xs text-muted-foreground mt-2">
                    <Star className="w-3 h-3 inline-block mr-1 text-secondary-foreground" />
                    Usa o Superlike para aumentar as tuas chances de match!
                  </p>
                )}
              </motion.div>
            </motion.div>
          )}
        </div>

        <MatchModal
          isOpen={showMatchModal}
          onClose={() => setShowMatchModal(false)}
          matchedItem={matchedItem}
        />

        {/* Nearby Users Section */}
        <div className="container mx-auto px-4 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <NearbyUsers />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Swap;