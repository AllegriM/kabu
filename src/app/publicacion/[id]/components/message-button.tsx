"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export function ContactOwnerButton({ sightingId }: { sightingId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleContact = async () => {
    setIsLoading(true);

    const { data: roomId, error } = await supabase.rpc(
      "get_or_create_chat_room",
      {
        p_sighting_id: sightingId,
      }
    );

    if (error) {
      console.error(error);
      toast.error("Error al iniciar el chat: " + error.message);
      setIsLoading(false);
      return;
    }

    if (roomId) {
      router.push(`/chat/${roomId}`);
    }
  };

  return (
    <Button
      onClick={handleContact}
      disabled={isLoading}
      className="w-full gap-2 border-2 hover:bg-primary/10 transition-all duration-200 bg-transparent"
    >
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <>
          <MessageCircle className="h-4 w-4" />
          Enviar mensaje
        </>
      )}
    </Button>
  );
}
