import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2, MessageCircle, ChevronLeft, ChevronRight, Star, MapPin, Shield, Coins, Package, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { useListings, Listing } from "@/hooks/useListings";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

const conditionColors: Record<string, string> = {
  novo: "bg-lego-green text-white",
  usado: "bg-lego-orange text-white",
  "como novo": "bg-lego-blue text-white",
};

interface ExtendedListing extends Listing {
  seller?: {
    id?: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    rating: number | null;
    location?: string | null;
    created_at?: string;
  } | null;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fetchListing, listings } = useListings();
  const { user } = useAuth();
  const [product, setProduct] = useState<ExtendedListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      setLoading(true);
      const data = await fetchListing(id);
      setProduct(data);
      setLoading(false);
    };
    loadProduct();
  }, [id]);

  const nextImage = () => {
    if (!product?.images?.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    if (!product?.images?.length) return;
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: isFavorited ? "O artigo foi removido da tua lista." : "Podes ver os teus favoritos no perfil.",
    });
  };

  const handleContact = () => {
    if (!user) {
      toast({
        title: "Inicia sessão",
        description: "Precisas de iniciar sessão para contactar o vendedor.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!product?.seller?.id) {
      toast({
        title: "Erro",
        description: "Não foi possível encontrar o vendedor.",
        variant: "destructive",
      });
      return;
    }

    if (product.seller.id === user.id) {
      toast({
        title: "Este é o teu anúncio",
        description: "Não podes contactar-te a ti próprio.",
      });
      return;
    }

    // Navigate to chats with seller and listing info
    navigate(`/chats?seller=${product.seller.id}&listing=${product.id}`);
  };

  // Get related products (same category, excluding current)
  const relatedProducts = listings
    .filter(l => l.category === product?.category && l.id !== product?.id)
    .slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">A carregar anúncio...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Anúncio não encontrado</h1>
            <p className="text-muted-foreground mb-6">Este anúncio pode ter sido removido ou não existe.</p>
            <Link to="/marketplace">
              <Button>Voltar ao Marketplace</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = product.images?.length ? product.images : ["/placeholder.svg"];
  const sellerName = product.seller?.full_name || product.seller?.username || "Vendedor";
  const sellerUsername = product.seller?.username ? `@${product.seller.username}` : "";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 pt-4">
            <Link to="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link>
            <span>/</span>
            <Link to="/marketplace" className="hover:text-foreground transition-colors">{product.category}</Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px]">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={images[currentImageIndex]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${
                        index === currentImageIndex ? "border-primary" : "border-transparent hover:border-muted-foreground"
                      }`}
                    >
                      <img src={img} alt={`${product.title} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Header */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <Badge className={conditionColors[product.condition] || "bg-muted"}>
                    {product.condition}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleFavorite}
                      className={isFavorited ? "text-lego-red border-lego-red" : ""}
                    >
                      <Heart className={`w-5 h-5 ${isFavorited ? "fill-lego-red" : ""}`} />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">{product.title}</h1>
                <p className="text-muted-foreground">
                  {product.category}
                  {product.set_number && ` • Set #${product.set_number}`}
                </p>
              </div>

              {/* Price */}
              <div className="bg-muted/50 rounded-xl p-6">
                <div className="flex items-end gap-4 mb-4">
                  {product.price_eur && (
                    <span className="text-4xl font-display font-bold text-primary">€{product.price_eur}</span>
                  )}
                  {product.price_swap_coins && (
                    <span className="text-lg text-muted-foreground flex items-center gap-1">
                      {product.price_eur ? "ou " : ""}
                      <Coins className="w-5 h-5 text-lego-yellow" /> {product.price_swap_coins} SwapCoins
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90">
                    Comprar Agora
                  </Button>
                  <Button variant="outline" className="flex-1 h-12" onClick={handleContact}>
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Contactar
                  </Button>
                </div>
                {product.accepts_trades && (
                  <Button variant="ghost" className="w-full mt-3 text-primary">
                    <Package className="w-4 h-4 mr-2" />
                    Propor Troca
                  </Button>
                )}
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Shield className="w-5 h-5 text-lego-green" />
                  <div>
                    <p className="text-sm font-medium">Proteção ao Comprador</p>
                    <p className="text-xs text-muted-foreground">Garantia PieceSwap</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Publicado</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(product.created_at), "d MMM yyyy", { locale: pt })}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Seller Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={product.seller?.avatar_url || undefined} />
                      <AvatarFallback>{sellerName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium">{sellerName}</h3>
                      {sellerUsername && (
                        <p className="text-sm text-muted-foreground">{sellerUsername}</p>
                      )}
                    </div>
                    {product.seller?.rating && (
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-lego-yellow">
                          <Star className="w-4 h-4 fill-lego-yellow" />
                          <span className="font-medium">{product.seller.rating}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {product.seller?.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {product.seller.location}
                      </div>
                    )}
                    {product.seller?.created_at && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-4 h-4" />
                        Membro desde {format(new Date(product.seller.created_at), "MMM yyyy", { locale: pt })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              {product.description && (
                <div>
                  <h2 className="font-display font-bold text-lg mb-3">Descrição</h2>
                  <p className="text-muted-foreground whitespace-pre-line">{product.description}</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section>
              <h2 className="text-2xl font-display font-bold mb-6">Artigos Relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {relatedProducts.map((listing) => (
                  <Link to={`/product/${listing.id}`} key={listing.id}>
                    <ProductCard
                      id={listing.id}
                      name={listing.title}
                      price={listing.price_eur || 0}
                      image={listing.images?.[0] || "/placeholder.svg"}
                      seller={listing.seller?.username || listing.seller?.full_name || "Vendedor"}
                      condition={listing.condition as "novo" | "usado" | "como novo"}
                      category={listing.category}
                    />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;