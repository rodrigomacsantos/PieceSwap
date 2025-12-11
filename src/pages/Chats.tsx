import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Send, ArrowLeft, MoreVertical, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

// Mock data for conversations
const mockConversations = [
  {
    id: "1",
    user: {
      name: "Carlos P.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      online: true,
    },
    item: {
      name: "LEGO Architecture Taj Mahal",
      image: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=100",
    },
    lastMessage: "Olá! Vi que tens interesse na troca. Que peças tens para oferecer?",
    time: "2 min",
    unread: 2,
  },
  {
    id: "2",
    user: {
      name: "Sofia M.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      online: false,
    },
    item: {
      name: "Minifiguras Marvel",
      image: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=100",
    },
    lastMessage: "Perfeito! Podemos combinar a entrega para sábado?",
    time: "1 hora",
    unread: 0,
  },
  {
    id: "3",
    user: {
      name: "Miguel A.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      online: true,
    },
    item: {
      name: "NASA Apollo Saturn V",
      image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=100",
    },
    lastMessage: "Combinado! 🚀",
    time: "Ontem",
    unread: 0,
  },
];

const mockMessages = [
  { id: "1", senderId: "other", text: "Olá! Vi que tens interesse na troca.", time: "14:30" },
  { id: "2", senderId: "other", text: "Que peças tens para oferecer?", time: "14:30" },
  { id: "3", senderId: "me", text: "Olá Carlos! Tenho um set LEGO Technic Ferrari que poderia interessar-te.", time: "14:35" },
  { id: "4", senderId: "other", text: "Muito interessante! Podes enviar fotos?", time: "14:36" },
  { id: "5", senderId: "me", text: "Claro! Está em excelente condição, praticamente novo.", time: "14:38" },
  { id: "6", senderId: "other", text: "Olá! Vi que tens interesse na troca. Que peças tens para oferecer?", time: "14:40" },
];

const Chats = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const selectedConversation = mockConversations.find(c => c.id === selectedChat);

  const filteredConversations = mockConversations.filter(c =>
    c.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16 h-screen">
        <div className="container mx-auto px-0 md:px-4 h-[calc(100vh-4rem)]">
          <div className="flex h-full bg-card md:rounded-2xl md:mt-4 overflow-hidden card-shadow">
            {/* Conversations List */}
            <div className={cn(
              "w-full md:w-96 border-r border-border flex flex-col",
              selectedChat && "hidden md:flex"
            )}>
              {/* Header */}
              <div className="p-4 border-b border-border">
                <h1 className="text-xl font-display font-bold mb-4">Mensagens</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar conversas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-muted/50 border-0"
                  />
                </div>
              </div>

              {/* Conversations */}
              <ScrollArea className="flex-1">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Nenhuma conversa encontrada</p>
                    <Link to="/swap">
                      <Button variant="link" className="mt-2 text-primary">
                        Fazer trocas para começar
                      </Button>
                    </Link>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <motion.button
                      key={conversation.id}
                      onClick={() => setSelectedChat(conversation.id)}
                      className={cn(
                        "w-full p-4 flex gap-3 hover:bg-muted/50 transition-colors text-left border-b border-border/50",
                        selectedChat === conversation.id && "bg-muted/50"
                      )}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={conversation.user.avatar} />
                          <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {conversation.user.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-lego-green rounded-full border-2 border-card" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium truncate">{conversation.user.name}</span>
                          <span className="text-xs text-muted-foreground">{conversation.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                        <p className="text-xs text-primary truncate mt-1">{conversation.item.name}</p>
                      </div>
                      {conversation.unread > 0 && (
                        <Badge className="bg-primary text-primary-foreground h-5 w-5 flex items-center justify-center p-0 text-xs">
                          {conversation.unread}
                        </Badge>
                      )}
                    </motion.button>
                  ))
                )}
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className={cn(
              "flex-1 flex flex-col",
              !selectedChat && "hidden md:flex"
            )}>
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => setSelectedChat(null)}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedConversation.user.avatar} />
                      <AvatarFallback>{selectedConversation.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h2 className="font-medium">{selectedConversation.user.name}</h2>
                      <p className="text-xs text-muted-foreground">
                        {selectedConversation.user.online ? "Online" : "Offline"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/product/${selectedConversation.id}`}>
                        <Button variant="outline" size="sm">
                          <Package className="w-4 h-4 mr-2" />
                          Ver Artigo
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {/* Item Card */}
                      <div className="bg-muted/50 rounded-xl p-3 flex gap-3 max-w-sm mx-auto">
                        <img
                          src={selectedConversation.item.image}
                          alt={selectedConversation.item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-xs text-muted-foreground">Troca sobre</p>
                          <p className="font-medium text-sm">{selectedConversation.item.name}</p>
                        </div>
                      </div>

                      {mockMessages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex",
                            message.senderId === "me" ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[70%] rounded-2xl px-4 py-2",
                              message.senderId === "me"
                                ? "bg-primary text-primary-foreground rounded-br-md"
                                : "bg-muted rounded-bl-md"
                            )}
                          >
                            <p className="text-sm">{message.text}</p>
                            <p className={cn(
                              "text-xs mt-1",
                              message.senderId === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                            )}>
                              {message.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Input */}
                  <div className="p-4 border-t border-border">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Escreve uma mensagem..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} className="bg-primary text-primary-foreground">
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="font-display font-bold text-lg mb-2">Seleciona uma conversa</h3>
                    <p className="text-muted-foreground">
                      Escolhe uma conversa para ver as mensagens
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chats;
