import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Search, Send, ArrowLeft, MoreVertical, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { useMessages, Conversation, Message } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import { format, isToday, isYesterday } from "date-fns";
import { pt } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

const Chats = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    conversations, 
    loading, 
    fetchMessages, 
    sendMessage, 
    createConversation,
    markAsRead,
    fetchConversations 
  } = useMessages();
  
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle starting new conversation from listing page
  useEffect(() => {
    const handleNewConversation = async () => {
      const sellerId = searchParams.get('seller');
      const listingId = searchParams.get('listing');
      
      if (sellerId && listingId && user) {
        // Check if conversation already exists
        const existingConv = conversations.find(conv => 
          conv.listing_id === listingId &&
          conv.participants?.some(p => p.user_id === sellerId)
        );

        if (existingConv) {
          setSelectedChatId(existingConv.id);
        } else {
          // Create new conversation
          const newConv = await createConversation(sellerId, listingId);
          if (newConv) {
            await fetchConversations();
            setSelectedChatId(newConv.id);
          }
        }
        // Clear params after handling
        navigate('/chats', { replace: true });
      }
    };

    if (!loading) {
      handleNewConversation();
    }
  }, [searchParams, user, conversations, loading]);

  // Load messages when chat is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChatId) return;
      
      setLoadingMessages(true);
      const msgs = await fetchMessages(selectedChatId);
      setMessages(msgs);
      setLoadingMessages(false);
      
      // Mark messages as read
      await markAsRead(selectedChatId);
    };

    loadMessages();
  }, [selectedChatId]);

  // Subscribe to realtime messages for selected conversation
  useEffect(() => {
    if (!selectedChatId) return;

    const channel = supabase
      .channel(`messages-${selectedChatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedChatId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages(prev => [...prev, newMsg]);
          
          // Mark as read if not from current user
          if (newMsg.sender_id !== user?.id) {
            markAsRead(selectedChatId);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChatId, user?.id]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectedConversation = conversations.find(c => c.id === selectedChatId);
  const otherParticipant = selectedConversation?.participants?.[0];

  const filteredConversations = conversations.filter(c => {
    const participant = c.participants?.[0];
    const name = participant?.profile?.full_name || participant?.profile?.username || '';
    const listing = c.listing?.title || '';
    const query = searchQuery.toLowerCase();
    return name.toLowerCase().includes(query) || listing.toLowerCase().includes(query);
  });

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChatId || sendingMessage) return;
    
    setSendingMessage(true);
    const sent = await sendMessage(selectedChatId, newMessage.trim());
    if (sent) {
      setNewMessage("");
    }
    setSendingMessage(false);
  };

  const formatMessageTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, 'HH:mm', { locale: pt });
  };

  const formatConversationTime = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) {
      return format(date, 'HH:mm', { locale: pt });
    } else if (isYesterday(date)) {
      return 'Ontem';
    }
    return format(date, 'd MMM', { locale: pt });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Inicia sessão para ver as tuas mensagens</h1>
            <Link to="/auth">
              <Button className="bg-primary text-primary-foreground">Entrar</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16 h-screen">
        <div className="container mx-auto px-0 md:px-4 h-[calc(100vh-4rem)]">
          <div className="flex h-full bg-card md:rounded-2xl md:mt-4 overflow-hidden card-shadow">
            {/* Conversations List */}
            <div className={cn(
              "w-full md:w-96 border-r border-border flex flex-col",
              selectedChatId && "hidden md:flex"
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
                {loading ? (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">A carregar...</p>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Nenhuma conversa encontrada</p>
                    <Link to="/marketplace">
                      <Button variant="link" className="mt-2 text-primary">
                        Explorar anúncios
                      </Button>
                    </Link>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => {
                    const participant = conversation.participants?.[0];
                    const participantName = participant?.profile?.full_name || participant?.profile?.username || 'Utilizador';
                    const avatarUrl = participant?.profile?.avatar_url;
                    
                    return (
                      <motion.button
                        key={conversation.id}
                        onClick={() => setSelectedChatId(conversation.id)}
                        className={cn(
                          "w-full p-4 flex gap-3 hover:bg-muted/50 transition-colors text-left border-b border-border/50",
                          selectedChatId === conversation.id && "bg-muted/50"
                        )}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={avatarUrl || undefined} />
                            <AvatarFallback>{participantName.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium truncate">{participantName}</span>
                            <span className="text-xs text-muted-foreground">
                              {conversation.lastMessage?.created_at 
                                ? formatConversationTime(conversation.lastMessage.created_at)
                                : ''}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage?.content || 'Nenhuma mensagem'}
                          </p>
                          {conversation.listing && (
                            <p className="text-xs text-primary truncate mt-1">
                              {conversation.listing.title}
                            </p>
                          )}
                        </div>
                        {(conversation.unreadCount || 0) > 0 && (
                          <Badge className="bg-primary text-primary-foreground h-5 w-5 flex items-center justify-center p-0 text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </motion.button>
                    );
                  })
                )}
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className={cn(
              "flex-1 flex flex-col",
              !selectedChatId && "hidden md:flex"
            )}>
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => setSelectedChatId(null)}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={otherParticipant?.profile?.avatar_url || undefined} />
                      <AvatarFallback>
                        {(otherParticipant?.profile?.full_name || otherParticipant?.profile?.username || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h2 className="font-medium">
                        {otherParticipant?.profile?.full_name || otherParticipant?.profile?.username || 'Utilizador'}
                      </h2>
                      {selectedConversation.listing && (
                        <p className="text-xs text-muted-foreground truncate">
                          {selectedConversation.listing.title}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedConversation.listing_id && (
                        <Link to={`/product/${selectedConversation.listing_id}`}>
                          <Button variant="outline" size="sm">
                            <Package className="w-4 h-4 mr-2" />
                            Ver Artigo
                          </Button>
                        </Link>
                      )}
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {/* Item Card */}
                      {selectedConversation.listing && (
                        <div className="bg-muted/50 rounded-xl p-3 flex gap-3 max-w-sm mx-auto">
                          <img
                            src={selectedConversation.listing.images?.[0] || "/placeholder.svg"}
                            alt={selectedConversation.listing.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <p className="text-xs text-muted-foreground">Conversa sobre</p>
                            <p className="font-medium text-sm">{selectedConversation.listing.title}</p>
                          </div>
                        </div>
                      )}

                      {loadingMessages ? (
                        <div className="text-center py-8 text-muted-foreground">
                          A carregar mensagens...
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          Começa a conversa!
                        </div>
                      ) : (
                        messages.map((message) => (
                          <div
                            key={message.id}
                            className={cn(
                              "flex",
                              message.sender_id === user?.id ? "justify-end" : "justify-start"
                            )}
                          >
                            <div
                              className={cn(
                                "max-w-[70%] rounded-2xl px-4 py-2",
                                message.sender_id === user?.id
                                  ? "bg-primary text-primary-foreground rounded-br-md"
                                  : "bg-muted rounded-bl-md"
                              )}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className={cn(
                                "text-xs mt-1",
                                message.sender_id === user?.id ? "text-primary-foreground/70" : "text-muted-foreground"
                              )}>
                                {formatMessageTime(message.created_at)}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Input */}
                  <div className="p-4 border-t border-border">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Escreve uma mensagem..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                        className="flex-1"
                        disabled={sendingMessage}
                      />
                      <Button 
                        onClick={handleSendMessage} 
                        className="bg-primary text-primary-foreground"
                        disabled={sendingMessage || !newMessage.trim()}
                      >
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
