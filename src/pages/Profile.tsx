import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { User, Coins, Package, History, Settings, Star, MapPin, Calendar, Edit2, Plus, Camera, Save, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useListings } from "@/hooks/useListings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const conditionColors: Record<string, string> = {
  novo: "bg-lego-green text-white",
  usado: "bg-lego-orange text-white",
  "como novo": "bg-lego-blue text-white",
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { fetchUserListings } = useListings();
  const [listings, setListings] = useState<any[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("listings");
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    username: "",
    bio: "",
    location: "",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !profileLoading) {
      navigate("/auth");
    }
  }, [user, profileLoading, navigate]);

  // Fetch user's listings
  useEffect(() => {
    const loadListings = async () => {
      if (user) {
        setListingsLoading(true);
        const userListings = await fetchUserListings(user.id);
        setListings(userListings);
        setListingsLoading(false);
      }
    };
    loadListings();
  }, [user, fetchUserListings]);

  // Initialize edit form when profile loads
  useEffect(() => {
    if (profile) {
      setEditForm({
        full_name: profile.full_name || "",
        username: profile.username || "",
        bio: profile.bio || "",
        location: profile.location || "",
      });
    }
  }, [profile]);

  const handleEditChange = (field: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    await updateProfile(editForm);
    setIsEditing(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('listings_images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('listings_images')
        .getPublicUrl(filePath);

      await updateProfile({ avatar_url: publicUrl });
      toast.success("Foto de perfil atualizada!");
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error("Erro ao carregar imagem");
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // User's listings stats
  const activeListings = listings.filter(l => l.status === "active");
  const userListings = listings;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' });
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const displayName = profile?.full_name || profile?.username || user.email?.split('@')[0] || "Utilizador";
  const displayUsername = profile?.username ? `@${profile.username}` : user.email;

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
              {/* Avatar with upload */}
              <div className="flex-shrink-0 relative">
                <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-primary">
                  <AvatarImage src={profile?.avatar_url || ''} alt={displayName} />
                  <AvatarFallback className="text-2xl font-display bg-primary text-primary-foreground">
                    {displayName.split(" ").map(n => n[0]).join("").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  {uploading ? (
                    <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4 text-primary-foreground" />
                  )}
                </label>
              </div>

              {/* User Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Nome Completo</Label>
                        <Input
                          id="full_name"
                          value={editForm.full_name}
                          onChange={(e) => handleEditChange("full_name", e.target.value)}
                          placeholder="O teu nome"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={editForm.username}
                          onChange={(e) => handleEditChange("username", e.target.value)}
                          placeholder="o_teu_username"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Localização</Label>
                      <Input
                        id="location"
                        value={editForm.location}
                        onChange={(e) => handleEditChange("location", e.target.value)}
                        placeholder="Lisboa, Portugal"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Biografia</Label>
                      <Textarea
                        id="bio"
                        value={editForm.bio}
                        onChange={(e) => handleEditChange("bio", e.target.value)}
                        placeholder="Conta-nos um pouco sobre ti e a tua coleção de LEGO..."
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} className="gap-2">
                        <Save className="w-4 h-4" />
                        Guardar
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)} className="gap-2">
                        <X className="w-4 h-4" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <div>
                        <h1 className="text-2xl md:text-3xl font-display font-bold mb-1">{displayName}</h1>
                        <p className="text-muted-foreground">{displayUsername}</p>
                      </div>
                      <Button variant="outline" className="self-start" onClick={() => setIsEditing(true)}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Editar Perfil
                      </Button>
                    </div>

                    {profile?.bio ? (
                      <p className="text-foreground mb-4">{profile.bio}</p>
                    ) : (
                      <p className="text-muted-foreground italic mb-4">
                        Ainda não tens biografia. 
                        <button onClick={() => setIsEditing(true)} className="text-primary hover:underline ml-1">
                          Adiciona uma agora!
                        </button>
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {profile?.location ? (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {profile.location}
                        </div>
                      ) : (
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-1 text-primary hover:underline">
                          <MapPin className="w-4 h-4" />
                          Adicionar localização
                        </button>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Membro desde {profile?.created_at ? formatDate(profile.created_at) : 'hoje'}
                      </div>
                      {profile?.rating && profile.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-lego-yellow fill-lego-yellow" />
                          {profile.rating} ({profile.total_ratings || 0} avaliações)
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
              <div className="text-center p-4 bg-muted/50 rounded-xl">
                <Package className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">{activeListings.length}</p>
                <p className="text-xs text-muted-foreground">Anúncios Ativos</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-xl">
                <History className="w-6 h-6 text-lego-green mx-auto mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">0</p>
                <p className="text-xs text-muted-foreground">Transações</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-xl">
                <Star className="w-6 h-6 text-lego-yellow mx-auto mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">{profile?.rating || '-'}</p>
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

              {listingsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : userListings.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Ainda não tens anúncios</h3>
                    <p className="text-muted-foreground mb-4">
                      Começa a vender ou trocar as tuas peças LEGO!
                    </p>
                    <Link to="/sell">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Primeiro Anúncio
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userListings.map((listing) => (
                    <Link to={`/product/${listing.id}`} key={listing.id}>
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="bg-card rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-all"
                      >
                        <div className="relative aspect-square">
                          <img 
                            src={listing.images?.[0] || '/placeholder.svg'} 
                            alt={listing.title} 
                            className="w-full h-full object-cover" 
                          />
                          <Badge className={`absolute top-3 left-3 ${conditionColors[listing.condition] || 'bg-muted'}`}>
                            {listing.condition}
                          </Badge>
                          {listing.status === "sold" && (
                            <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                              <Badge variant="secondary" className="text-lg px-4 py-2">Vendido</Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium mb-2 line-clamp-1">{listing.title}</h3>
                          <div className="flex items-center gap-2">
                            {listing.price_eur && (
                              <p className="text-xl font-display font-bold text-primary">€{listing.price_eur}</p>
                            )}
                            {listing.price_swap_coins && (
                              <p className="text-sm text-muted-foreground">/ {listing.price_swap_coins} SC</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* History */}
            <TabsContent value="history">
              <h2 className="text-xl font-display font-bold mb-6">Histórico de Transações</h2>
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Sem transações ainda</h3>
                  <p className="text-muted-foreground">
                    As tuas vendas, compras e trocas aparecerão aqui.
                  </p>
                </CardContent>
              </Card>
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
                          <p className="text-sm text-muted-foreground">Nome, email, biografia</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>Editar</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Localização</p>
                          <p className="text-sm text-muted-foreground">{profile?.location || 'Não definida'}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>Editar</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-destructive/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-destructive">Terminar Sessão</p>
                        <p className="text-sm text-muted-foreground">Sair da tua conta</p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={handleSignOut}>
                        Sair
                      </Button>
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
