import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  seller: string;
  condition: "novo" | "usado" | "como novo";
  category: string;
}

const conditionColors = {
  novo: "bg-lego-green text-accent-foreground",
  usado: "bg-lego-orange text-accent-foreground",
  "como novo": "bg-lego-blue text-accent-foreground",
};

const ProductCard = ({ name, price, image, seller, condition, category }: ProductCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group bg-card rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className={cn("px-2 py-1 text-xs font-medium rounded-full", conditionColors[condition])}>
            {condition}
          </span>
        </div>
        <button className="absolute top-3 right-3 w-8 h-8 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card">
          <Heart className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
        </div>
        
        <p className="text-xs text-muted-foreground mb-2">{category}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-display font-bold text-primary">
            €{price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs">{seller}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;