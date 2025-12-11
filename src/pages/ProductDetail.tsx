import { useState } from "react";
import { useParams, Link } from "react-router-dom";
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

// Mock data
const mockProduct = {
  id: "1",
  name: "LEGO Star Wars Millennium Falcon UCS 75192",
  description: `Set completo com todas as 7541 peças e manual de instruções original. Nunca montado, mantido em ambiente controlado.

Este é o maior e mais detalhado LEGO Millennium Falcon alguma vez criado, medindo mais de 20cm de altura, 84cm de comprimento e 56cm de largura.

Inclui:
- 7541 peças
- 7 minifiguras (Han Solo, Chewbacca, Princesa Leia, C-3PO, BB-8, e mais 2)
- Manual de instruções completo
- Caixa original (ligeiramente danificada num canto)

Perfeito para colecionadores ou para quem quer construir o set mais icónico de Star Wars.`,
  price: 450,
  swapCoins: 4500,
  images: [
    "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop",
  ],
  condition: "como novo" as const,
  category: "Sets Completos",
  setNumber: "75192",
  quantity: 1,
  views: 234,
  favorites: 18,
  postedDate: "12 Nov 2024",
  isSwapEnabled: true,
  seller: {
    id: "user1",
    name: "João Silva",
    username: "@joaosilva",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    location: "Lisboa, Portugal",
    rating: 4.8,
    reviews: 47,
    memberSince: "Jan 2024",
    responseTime: "< 1 hora",
  },
};

const relatedProducts = [
  { id: "2", name: "AT-AT Walker UCS", price: 380, image: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400", seller: "Maria", condition: "novo" as const, category: "Sets Completos" },
  { id: "3", name: "X-Wing Starfighter", price: 120, image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400", seller: "Pedro", condition: "como novo" as const, category: "Sets Completos" },
  { id: "4", name: "Imperial Star Destroyer", price: 550, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", seller: "Ana", condition: "usado" as const, category: "Sets Completos" },
];

const conditionColors = {
  novo: "bg-lego-green text-white",
  usado: "bg-lego-orange text-white",
  "como novo": "bg-lego-blue text-white",
};

const ProductDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mockProduct.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + mockProduct.images.length) % mockProduct.images.length);
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: isFavorited ? "O artigo foi removido da tua lista." : "Podes ver os teus favoritos no perfil.",
    });
  };

  const handleContact = () => {
    toast({
      title: "Funcionalidade em breve",
      description: "O sistema de mensagens está em desenvolvimento.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 pt-4">
            <Link to="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link>
            <span>/</span>
            <Link to="/marketplace" className="hover:text-foreground transition-colors">{mockProduct.category}</Link>
            <span>/</span>
            <span className="text-foreground">{mockProduct.name}</span>
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
                    src={mockProduct.images[currentImageIndex]}
                    alt={mockProduct.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {/* Navigation Arrows */}
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

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {mockProduct.images.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                {mockProduct.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? "border-primary" : "border-transparent hover:border-muted-foreground"
                    }`}
                  >
                    <img src={img} alt={`${mockProduct.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
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
                  <Badge className={conditionColors[mockProduct.condition]}>
                    {mockProduct.condition}
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
                <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">{mockProduct.name}</h1>
                <p className="text-muted-foreground">{mockProduct.category} • Set #{mockProduct.setNumber}</p>
              </div>

              {/* Price */}
              <div className="bg-muted/50 rounded-xl p-6">
                <div className="flex items-end gap-4 mb-4">
                  <span className="text-4xl font-display font-bold text-primary">€{mockProduct.price}</span>
                  {mockProduct.isSwapEnabled && (
                    <span className="text-lg text-muted-foreground flex items-center gap-1">
                      ou <Coins className="w-5 h-5 text-lego-yellow" /> {mockProduct.swapCoins} SwapCoins
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
                {mockProduct.isSwapEnabled && (
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
                    <p className="text-xs text-muted-foreground">{mockProduct.postedDate}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Seller Info */}
              <Card>
                <CardContent className="p-4">
                  <Link to={`/profile/${mockProduct.seller.id}`} className="flex items-center gap-4 mb-4">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={mockProduct.seller.avatar} />
                      <AvatarFallback>{mockProduct.seller.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium hover:text-primary transition-colors">{mockProduct.seller.name}</h3>
                      <p className="text-sm text-muted-foreground">{mockProduct.seller.username}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-lego-yellow">
                        <Star className="w-4 h-4 fill-lego-yellow" />
                        <span className="font-medium">{mockProduct.seller.rating}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{mockProduct.seller.reviews} avaliações</p>
                    </div>
                  </Link>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {mockProduct.seller.location}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      Responde em {mockProduct.seller.responseTime}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <div>
                <h2 className="font-display font-bold text-lg mb-3">Descrição</h2>
                <p className="text-muted-foreground whitespace-pre-line">{mockProduct.description}</p>
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          <section>
            <h2 className="text-2xl font-display font-bold mb-6">Artigos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <Link to={`/product/${product.id}`} key={product.id}>
                  <ProductCard {...product} />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
