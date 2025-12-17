import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingBag, Repeat, User, Search, MessageCircle, LogIn, Crown } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { isPremium } = useSubscription();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-xl">P</span>
            </div>
            <span className="font-display font-bold text-xl text-foreground">PieceSwap</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/marketplace" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ShoppingBag className="w-4 h-4" />
              <span>Marketplace</span>
            </Link>
            <Link to="/swap" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Repeat className="w-4 h-4" />
              <span>Trocar</span>
            </Link>
            <Link to="/premium" className={cn(
              "flex items-center gap-2 transition-colors",
              isPremium ? "text-secondary-foreground" : "text-muted-foreground hover:text-foreground"
            )}>
              <Crown className={cn("w-4 h-4", isPremium && "text-secondary-foreground")} />
              <span>Premium</span>
              {isPremium && (
                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-secondary text-secondary-foreground rounded">
                  ATIVO
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Search className="w-5 h-5" />
            </Button>
            {user && (
              <Link to="/chats">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
                  <MessageCircle className="w-5 h-5" />
                </Button>
              </Link>
            )}
            {user ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/sell">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Vender
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/auth">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            isOpen ? "max-h-80 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-4 pt-4">
            <Link to="/marketplace" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ShoppingBag className="w-4 h-4" />
              <span>Marketplace</span>
            </Link>
            <Link to="/swap" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Repeat className="w-4 h-4" />
              <span>Trocar</span>
            </Link>
            <Link to="/premium" className={cn(
              "flex items-center gap-2 transition-colors",
              isPremium ? "text-secondary-foreground" : "text-muted-foreground hover:text-foreground"
            )}>
              <Crown className="w-4 h-4" />
              <span>Premium</span>
              {isPremium && (
                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-secondary text-secondary-foreground rounded ml-2">
                  ATIVO
                </span>
              )}
            </Link>
            {user && (
              <Link to="/chats" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>Mensagens</span>
              </Link>
            )}
            <div className="flex gap-2 pt-2">
              {user ? (
                <>
                  <Link to="/profile" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <User className="w-4 h-4 mr-2" />
                      Perfil
                    </Button>
                  </Link>
                  <Link to="/sell" className="flex-1">
                    <Button className="w-full bg-primary text-primary-foreground">
                      Vender
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/auth" className="flex-1">
                  <Button className="w-full bg-primary text-primary-foreground">
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
