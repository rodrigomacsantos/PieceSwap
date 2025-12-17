import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Crown, Star, Zap, ArrowUp, Sparkles, Users, Building } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";

const Premium = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const monthlyPrice = 14.99;
  const yearlyPrice = 119.99;
  const currentPrice = billingCycle === 'monthly' ? monthlyPrice : yearlyPrice;
  const savings = billingCycle === 'yearly' ? Math.round((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12) * 100) : 0;

  const features = [
    {
      icon: Star,
      title: "1 Superlike por dia",
      description: "Mostra interesse especial e aumenta as tuas chances de match em 3x",
    },
    {
      icon: ArrowUp,
      title: "Destaque no Marketplace",
      description: "Os teus anúncios aparecem no topo das pesquisas",
    },
    {
      icon: Zap,
      title: "Prioridade no Swap",
      description: "Apareces primeiro para outros utilizadores no swipe-to-match",
    },
    {
      icon: Sparkles,
      title: "Swipes ilimitados",
      description: "Sem limite diário de 20 swipes para utilizadores gratuitos",
    },
  ];

  const comparisonFeatures = [
    { name: "Swipes diários", free: "20", premium: "Ilimitados" },
    { name: "Superlikes", free: "0", premium: "1 por dia" },
    { name: "Destaque de anúncios", free: "Não", premium: "Sim" },
    { name: "Prioridade no Swap", free: "Não", premium: "Sim" },
    { name: "Trocas gratuitas", free: "Sim", premium: "Sim" },
    { name: "Mensagens ilimitadas", free: "Sim", premium: "Sim" },
  ];

  const handleSubscribe = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/checkout', { state: { billingCycle, price: currentPrice } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/30 rounded-full mb-4">
              <Crown className="w-5 h-5 text-secondary-foreground" />
              <span className="text-sm font-medium text-secondary-foreground">PieceSwap Premium</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Leva as tuas trocas ao{" "}
              <span className="text-gradient">próximo nível</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Desbloqueia funcionalidades exclusivas e aumenta as tuas chances de encontrar as peças LEGO perfeitas.
            </p>
          </motion.div>

          {/* Pricing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 p-1 bg-muted rounded-xl">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  billingCycle === 'yearly'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Anual
                {savings > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    -{savings}%
                  </Badge>
                )}
              </button>
            </div>
          </motion.div>

          {/* Pricing Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-md mx-auto mb-16"
          >
            <Card className="relative overflow-hidden border-2 border-secondary/50">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-secondary-foreground" />
                </div>
                <CardTitle className="text-2xl">Premium</CardTitle>
                <CardDescription>Todas as funcionalidades desbloqueadas</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <span className="text-5xl font-display font-bold text-foreground">
                    €{currentPrice.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground">
                    /{billingCycle === 'monthly' ? 'mês' : 'ano'}
                  </span>
                </div>

                <ul className="space-y-3 mb-8 text-left">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-lego-green/20 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-lego-green" />
                      </div>
                      <span className="text-sm text-foreground">{feature.title}</span>
                    </li>
                  ))}
                </ul>

                {isPremium ? (
                  <Button disabled className="w-full" size="lg">
                    Já és Premium
                  </Button>
                ) : (
                  <Button onClick={handleSubscribe} className="w-full" size="lg">
                    Começar agora
                  </Button>
                )}

                <p className="text-xs text-muted-foreground mt-4">
                  Cancela a qualquer momento. Sem compromissos.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-display font-bold text-center mb-8">
              O que inclui o Premium?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-2xl font-display font-bold text-center mb-8">
              Compara os planos
            </h2>
            <Card>
              <CardContent className="p-0">
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-t-lg">
                  <div className="font-semibold">Funcionalidade</div>
                  <div className="text-center font-semibold">Gratuito</div>
                  <div className="text-center font-semibold text-primary">Premium</div>
                </div>
                {comparisonFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-3 gap-4 p-4 ${
                      index !== comparisonFeatures.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <div className="text-sm text-foreground">{feature.name}</div>
                    <div className="text-center text-sm text-muted-foreground">{feature.free}</div>
                    <div className="text-center text-sm font-medium text-primary">{feature.premium}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Commissions Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-muted/30 rounded-2xl p-8 mb-16"
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                Modelo de Comissões
              </h2>
              <p className="text-muted-foreground mb-6">
                O PieceSwap cobra uma comissão de <strong>5%</strong> apenas nas vendas diretas no marketplace.
                As trocas entre utilizadores são sempre <strong>100% gratuitas</strong>!
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-display font-bold text-lego-green mb-2">0%</div>
                    <div className="font-semibold text-foreground">Trocas</div>
                    <p className="text-sm text-muted-foreground">Totalmente gratuitas</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-display font-bold text-primary mb-2">5%</div>
                    <div className="font-semibold text-foreground">Vendas</div>
                    <p className="text-sm text-muted-foreground">Comissão sobre o valor</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>

          {/* Partnerships CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">
              Parcerias Educativas e Comerciais
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Escolas, lojas e marcas podem integrar-se na plataforma de forma colaborativa.
              Contacta-nos para saber mais sobre oportunidades de parceria.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/partnerships">
                <Button variant="outline" size="lg">
                  <Building className="w-4 h-4 mr-2" />
                  Parcerias Comerciais
                </Button>
              </Link>
              <Link to="/partnerships">
                <Button variant="outline" size="lg">
                  <Users className="w-4 h-4 mr-2" />
                  Parcerias Educativas
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Premium;
