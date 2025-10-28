"use client";

import { useEffect, useState, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";

// Define el tipo de tus mensajes
type ChatMessage = {
  id: number;
  room_id: string;
  user_id: string;
  body: string;
  created_at: string;
  // Añade aquí los datos del JOIN si los traes (ej: user_nombre)
};

export default function ChatRoomPage({ userName }: { userName: string }) {
  const params = useParams();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const roomId = params.id as string;

  // 1. Cargar mensajes iniciales y obtener el usuario
  useEffect(() => {
    const fetchInitialData = async () => {
      // Obtener usuario
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      // Obtener mensajes
      const { data: initialMessages, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setMessages(initialMessages || []);
      }
    };
    fetchInitialData();
  }, [roomId, supabase]);

  // 2. Suscribirse a Supabase Realtime
  useEffect(() => {
    const channel = supabase
      .channel(`chat_room_${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((currentMessages) => [
            ...currentMessages,
            payload.new as ChatMessage,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, supabase]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !user) return;

    const body = newMessage;
    setNewMessage("");

    const { error } = await supabase.from("chat_messages").insert({
      room_id: roomId,
      user_id: user.id,
      body: body,
    });

    if (error) {
      console.error("Error sending message:", error);
      setNewMessage(body);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-2xl mx-auto">
      {/* Área de Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 mt-4 border">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${
              msg.user_id === user?.id ? "justify-end" : "justify-start"
            }`}
          >
            <span className="text-xs text-muted-foreground/70">
              {new Date(msg.created_at).toLocaleTimeString()}
            </span>
            <div
              className={`p-3 rounded-lg max-w-xs ${
                msg.user_id === user?.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p className="text-sm">{msg.body}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de Mensaje */}
      <form onSubmit={handleSendMessage} className="p-4 flex gap-2 border-t">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <Button type="submit" className="gap-2">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
