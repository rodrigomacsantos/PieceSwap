import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingBag, Repeat, User, Search, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Search className="w-5 h-5" />
            </Button>
            <Link to="/chats">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
                <MessageCircle className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </Button>
            </Link>
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
            isOpen ? "max-h-64 pb-4" : "max-h-0"
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
            <Link to="/chats" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>Mensagens</span>
            </Link>
            <div className="flex gap-2 pt-2">
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
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;