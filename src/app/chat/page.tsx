// src/app/chat/page.tsx
import Link from "next/link";
import { createClient } from "@/utils/supabase/server"; // ¡Cliente de SERVIDOR!
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/geiInitials";
import { formatTimeAgo } from "@/lib/formatTimeAgo";

export interface ChatRoom {
  room_id: string;
  other_user_id: string;
  other_user_name: string;
  last_message_body: string;
  last_message_at: string;
}

export default async function ChatHistoryPage() {
  const supabase = await createClient();

  const { data: rooms, error } = await supabase.rpc("get_my_chat_rooms");

  if (error) {
    console.error(error);
    return <p>Error al cargar tus chats.</p>;
  }

  if (!rooms || rooms.length === 0) {
    return (
      <div className="text-center p-10">
        <h1 className="text-2xl font-bold mb-4">Mis Chats</h1>
        <p className="text-muted-foreground">Aún no tienes conversaciones.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold p-4 border-b">Mis Chats</h1>
      <div className="flex flex-col">
        {rooms.map((room: ChatRoom) => (
          <Link
            key={room.room_id}
            href={`/chat/${room.room_id}`}
            className="flex items-center gap-4 p-4 border-b hover:bg-muted/50 transition-colors"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={room.other_user_avatar || ""} />
              <AvatarFallback>
                {getInitials(room.other_user_name || "U")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold truncate">
                  {room.other_user_name}
                </h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatTimeAgo(room.last_message_at)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {room.last_message_body || "..."}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
