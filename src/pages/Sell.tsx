import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, Camera, Info, Coins, Tag, Package, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const categories = [
  "Minifiguras",
  "Peças Básicas",
  "Peças Técnicas",
  "Sets Completos",
  "Sets Incompletos",
  "Peças Raras",
  "Acessórios",
  "Placas Base",
];

const conditions = [
  { value: "new", label: "Novo", description: "Nunca usado, na embalagem original" },
  { value: "like-new", label: "Como Novo", description: "Usado mas em perfeitas condições" },
  { value: "good", label: "Bom", description: "Pequenos sinais de uso" },
  { value: "fair", label: "Razoável", description: "Sinais visíveis de uso" },
];

const Sell = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<string[]>([]);
  const [isSwapEnabled, setIsSwapEnabled] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    price: "",
    swapCoins: "",
    quantity: "1",
    setNumber: "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newImages].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Anúncio criado com sucesso!",
      description: "O teu anúncio está agora visível no marketplace.",
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
                Criar Anúncio
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Vende ou troca as tuas peças LEGO com a comunidade PieceSwap
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Images Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-primary" />
                    Fotografias
                  </CardTitle>
                  <CardDescription>
                    Adiciona até 5 fotografias. A primeira será a imagem principal.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-2 border-border bg-muted">
                        <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <Badge className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs">
                            Principal
                          </Badge>
                        )}
                      </div>
                    ))}
                    {images.length < 5 && (
                      <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary bg-muted/50 hover:bg-muted flex flex-col items-center justify-center cursor-pointer transition-colors">
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-xs text-muted-foreground">Adicionar</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Details Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Detalhes do Artigo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título do Anúncio *</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Minifigura Star Wars Darth Vader"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição *</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreve o artigo em detalhe. Inclui informações sobre o estado, peças incluídas, etc."
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      required
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Categoria *</Label>
                      <Select value={formData.category} onValueChange={(v) => handleChange("category", v)}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Seleciona uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat.toLowerCase()}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Condição *</Label>
                      <Select value={formData.condition} onValueChange={(v) => handleChange("condition", v)}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Seleciona a condição" />
                        </SelectTrigger>
                        <SelectContent>
                          {conditions.map((cond) => (
                            <SelectItem key={cond.value} value={cond.value}>
                              <div className="flex flex-col">
                                <span>{cond.label}</span>
                                <span className="text-xs text-muted-foreground">{cond.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="setNumber">Número do Set (opcional)</Label>
                      <Input
                        id="setNumber"
                        placeholder="Ex: 75192"
                        value={formData.setNumber}
                        onChange={(e) => handleChange("setNumber", e.target.value)}
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantidade *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) => handleChange("quantity", e.target.value)}
                        required
                        className="h-12"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary" />
                    Preço e SwapCoins
                  </CardTitle>
                  <CardDescription>
                    Define o preço em euros e/ou permite trocas com SwapCoins
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="price">Preço (€) *</Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={formData.price}
                          onChange={(e) => handleChange("price", e.target.value)}
                          required
                          className="h-12 pl-8"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="swapCoins" className="flex items-center gap-2">
                        Valor em SwapCoins
                        <Coins className="w-4 h-4 text-lego-yellow" />
                      </Label>
                      <div className="relative">
                        <Input
                          id="swapCoins"
                          type="number"
                          min="0"
                          placeholder="100"
                          value={formData.swapCoins}
                          onChange={(e) => handleChange("swapCoins", e.target.value)}
                          disabled={!isSwapEnabled}
                          className="h-12 pr-24"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          SwapCoins
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">Disponível para Trocas</p>
                        <p className="text-xs text-muted-foreground">
                          Permite que outros utilizadores proponham trocas
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={isSwapEnabled}
                      onCheckedChange={setIsSwapEnabled}
                    />
                  </div>

                  {/* Info Box */}
                  <div className="flex gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                    <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">Como funcionam os SwapCoins?</p>
                      <p>
                        SwapCoins é a moeda da comunidade PieceSwap. Ganhas SwapCoins ao vender ou trocar peças, 
                        e podes usá-los para comprar de outros membros. 1€ ≈ 10 SwapCoins.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Button type="button" variant="outline" className="h-12 px-8">
                  Guardar Rascunho
                </Button>
                <Button type="submit" className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90">
                  Publicar Anúncio
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sell;
