import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { User, Coins, Package, History, Settings, Star, MapPin, Calendar, Edit2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Mock data
const mockUser = {
  name: "João Silva",
  username: "@joaosilva",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
  location: "Lisboa, Portugal",
  joinDate: "Membro desde Jan 2024",
  swapCoins: 1250,
  rating: 4.8,
  reviews: 47,
  bio: "Colecionador de LEGO há 15 anos. Especializado em Star Wars e Technic.",
};

const mockListings = [
  {
    id: "1",
    name: "Millennium Falcon UCS",
    price: 450,
    image: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=400&h=400&fit=crop",
    condition: "como novo" as const,
    status: "active",
    views: 234,
    favorites: 18,
  },
  {
    id: "2",
    name: "Minifigura Darth Vader Chrome",
    price: 85,
    image: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400&h=400&fit=crop",
    condition: "novo" as const,
    status: "active",
    views: 156,
    favorites: 12,
  },
  {
    id: "3",
    name: "Technic Porsche 911 GT3",
    price: 280,
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop",
    condition: "usado" as const,
    status: "sold",
    views: 89,
    favorites: 5,
  },
];

const mockHistory = [
  { id: "1", type: "sale", item: "LEGO City Police Station", amount: 45, date: "15 Nov 2024", user: "Maria Santos" },
  { id: "2", type: "swap", item: "Minifigura Batman", amount: 120, date: "10 Nov 2024", user: "Pedro Costa" },
  { id: "3", type: "purchase", item: "Peças Technic (50 un)", amount: -25, date: "5 Nov 2024", user: "Ana Silva" },
];

const conditionColors = {
  novo: "bg-lego-green text-white",
  usado: "bg-lego-orange text-white",
  "como novo": "bg-lego-blue text-white",
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState("listings");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-6 md:p-8 mb-8 card-shadow"
          >
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-primary">
                  <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                  <AvatarFallback className="text-2xl font-display bg-primary text-primary-foreground">
                    {mockUser.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-display font-bold mb-1">{mockUser.name}</h1>
                    <p className="text-muted-foreground">{mockUser.username}</p>
                  </div>
                  <Button variant="outline" className="self-start">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar Perfil
                  </Button>
                </div>

                <p className="text-foreground mb-4">{mockUser.bio}</p>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {mockUser.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {mockUser.joinDate}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-lego-yellow fill-lego-yellow" />
                    {mockUser.rating} ({mockUser.reviews} avaliações)
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border">
              <div className="text-center p-4 bg-muted/50 rounded-xl">
                <Coins className="w-6 h-6 text-lego-yellow mx-auto mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">{mockUser.swapCoins}</p>
                <p className="text-xs text-muted-foreground">SwapCoins</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-xl">
                <Package className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">{mockListings.filter(l => l.status === "active").length}</p>
                <p className="text-xs text-muted-foreground">Anúncios Ativos</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-xl">
                <History className="w-6 h-6 text-lego-green mx-auto mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">23</p>
                <p className="text-xs text-muted-foreground">Transações</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-xl">
                <Star className="w-6 h-6 text-lego-yellow mx-auto mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">{mockUser.rating}</p>
                <p className="text-xs text-muted-foreground">Avaliação</p>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-8 h-auto p-1 bg-muted">
              <TabsTrigger value="listings" className="py-3 data-[state=active]:bg-card">
                <Package className="w-4 h-4 mr-2" />
                Meus Anúncios
              </TabsTrigger>
              <TabsTrigger value="history" className="py-3 data-[state=active]:bg-card">
                <History className="w-4 h-4 mr-2" />
                Histórico
              </TabsTrigger>
              <TabsTrigger value="settings" className="py-3 data-[state=active]:bg-card">
                <Settings className="w-4 h-4 mr-2" />
                Definições
              </TabsTrigger>
            </TabsList>

            {/* My Listings */}
            <TabsContent value="listings">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-display font-bold">Meus Anúncios</h2>
                <Link to="/sell">
                  <Button className="bg-primary text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Anúncio
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockListings.map((listing) => (
                  <Link to={`/product/${listing.id}`} key={listing.id}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="bg-card rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-all"
                    >
                      <div className="relative aspect-square">
                        <img src={listing.image} alt={listing.name} className="w-full h-full object-cover" />
                        <Badge className={`absolute top-3 left-3 ${conditionColors[listing.condition]}`}>
                          {listing.condition}
                        </Badge>
                        {listing.status === "sold" && (
                          <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                            <Badge variant="secondary" className="text-lg px-4 py-2">Vendido</Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-2 line-clamp-1">{listing.name}</h3>
                        <p className="text-xl font-display font-bold text-primary mb-2">€{listing.price}</p>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{listing.views} visualizações</span>
                          <span>{listing.favorites} favoritos</span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </TabsContent>

            {/* History */}
            <TabsContent value="history">
              <h2 className="text-xl font-display font-bold mb-6">Histórico de Transações</h2>
              <div className="space-y-4">
                {mockHistory.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.type === "sale" ? "bg-lego-green/20 text-lego-green" :
                          item.type === "swap" ? "bg-lego-blue/20 text-lego-blue" :
                          "bg-lego-red/20 text-lego-red"
                        }`}>
                          {item.type === "sale" ? "€" : item.type === "swap" ? "↔" : "🛒"}
                        </div>
                        <div>
                          <p className="font-medium">{item.item}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.type === "sale" ? "Vendido a" : item.type === "swap" ? "Trocado com" : "Comprado de"} {item.user}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-display font-bold ${item.amount > 0 ? "text-lego-green" : "text-lego-red"}`}>
                          {item.amount > 0 ? "+" : ""}{item.amount} SwapCoins
                        </p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings">
              <h2 className="text-xl font-display font-bold mb-6">Definições da Conta</h2>
              <div className="space-y-4 max-w-2xl">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Informações Pessoais</p>
                          <p className="text-sm text-muted-foreground">Nome, email, telefone</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Editar</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Morada de Envio</p>
                          <p className="text-sm text-muted-foreground">Gerir moradas guardadas</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Editar</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Coins className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">SwapCoins</p>
                          <p className="text-sm text-muted-foreground">Comprar ou transferir SwapCoins</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Gerir</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
