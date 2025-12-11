import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-xl">B</span>
              </div>
              <span className="font-display font-bold text-xl">BrickSwap</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6">
              A maior comunidade de compra, venda e troca de peças LEGO em Portugal.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: "Explorar",
              links: ["Marketplace", "Trocar", "Categorias", "Novidades"],
            },
            {
              title: "Suporte",
              links: ["Centro de Ajuda", "Segurança", "Regras", "Contacto"],
            },
            {
              title: "Legal",
              links: ["Termos de Uso", "Privacidade", "Cookies", "Licenças"],
            },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="font-display font-bold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-muted-foreground text-sm hover:text-background transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-muted/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 BrickSwap. Todos os direitos reservados.
          </p>
          <p className="text-muted-foreground text-sm">
            LEGO® é uma marca registada do LEGO Group. Este site não é afiliado ao LEGO Group.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;