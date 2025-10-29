"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/app/components/Loading";
import { MessageCircle, Send } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { createPublicationComment } from "@/utils/supabase/fetchsClient";
import { CommentItem } from "./comment-item";
import { Create_Comment, SupabaseUserData } from "@/lib/types";

interface Comment {
  id: number;
  user_id: string;
  sighting_id: string;
  parent_id: number | null;
  body: string;
  created_at: string;
}

interface CommentsSectionProps {
  sightingId: string;
  comments: Comment[];
  user: SupabaseUserData | null;
}

export function CommentsSection({
  sightingId,
  comments,
  user,
}: CommentsSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  // --- Lógica de handlers ---

  const handleSubmitComment = async () => {
    if (!user?.id) return toast.error("Debes iniciar sesión para comentar");
    if (newComment.trim().length === 0)
      return toast.error("El comentario no puede estar vacio");
    if (newComment.length > 2000)
      return toast.error("El comentario no puede exceder los 2000 caracteres");

    setSubmitting(true);

    const commentData: Create_Comment = {
      user_id: user.id,
      sighting_id: sightingId,
      parent_id: null,
      body: newComment,
    };

    await createPublicationComment(commentData);
    setNewComment("");
    setSubmitting(false);
    toast.success("Comentario publicado");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comentarios ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formulario de comentario nuevo */}
        {user?.id ? (
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={user.user_metadata?.picture || ""} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(user.user_metadata?.name || "U")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Escribe un comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                maxLength={2000}
                className="min-h-[80px] resize-none"
                disabled={submitting}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {newComment.length}/2000 caracteres
                </span>
                <Button
                  onClick={handleSubmitComment}
                  disabled={submitting || newComment.trim().length === 0}
                  size="sm"
                  className="gap-2"
                >
                  {submitting ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Comentar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Debes iniciar sesión para comentar
            </p>
          </div>
        )}

        {/* Lista de Comentarios */}
        {comments.filter((c) => c.parent_id === null).length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">
              No hay comentarios aún. Sé el primero en comentar!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {comments
                .filter((c) => c.parent_id === null)
                .map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    allComments={comments}
                    user={user}
                    sightingId={sightingId}
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                  />
                ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
