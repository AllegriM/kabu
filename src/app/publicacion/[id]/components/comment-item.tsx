import { LoadingSpinner } from "@/app/components/Loading";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Comment, Create_Comment, SupabaseUserData } from "@/lib/types";
import { createPublicationComment } from "@/utils/supabase/fetchsClient";
import { AnimatePresence, motion } from "framer-motion";
import { Reply, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CommentItemProps {
  comment: Comment;
  allComments: Comment[];
  user: SupabaseUserData | null;
  sightingId: string;
  replyingTo: number | null;
  setReplyingTo: (id: number | null) => void;
}

export const CommentItem = ({
  comment,
  allComments,
  user,
  sightingId,
  replyingTo,
  setReplyingTo,
}: CommentItemProps) => {
  const router = useRouter();

  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const isReplying = replyingTo === comment.id;

  const replies = allComments.filter((c) => c.parent_id === comment.id);

  const handleSubmitReply = async () => {
    if (!user?.id) return toast.error("Debes iniciar sesión para responder");
    if (replyText.trim().length === 0) return;

    setIsSubmittingReply(true);

    const replyData: Create_Comment = {
      user_id: user.id,
      sighting_id: sightingId,
      parent_id: comment.id,
      body: replyText,
    };

    try {
      await createPublicationComment(replyData);
      setReplyText("");
      setReplyingTo(null);
      toast.success("Respuesta publicada");
      router.refresh();
    } catch (error) {
      toast.error("No se pudo enviar la respuesta.");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      <div className="flex gap-3">
        <div className="flex-1 space-y-2">
          {/* Caja del comentario */}
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">
                {comment.user_id || "Anónimo"}
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {comment.body}
            </p>
          </div>

          {user && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={() => setReplyingTo(isReplying ? null : comment.id)}
            >
              <Reply className="h-3 w-3" />
              {isReplying ? "Cancelar" : "Responder"}
            </Button>
          )}

          {/* Formulario de Respuesta */}
          <AnimatePresence>
            {isReplying && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-3 pt-2"
              >
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder={`Respondiendo a ${comment.id || "Anónimo"}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    maxLength={2000}
                    className="min-h-[60px] resize-none text-sm"
                    disabled={isSubmittingReply}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {replyText.length}/2000
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyingTo(null)}
                        disabled={isSubmittingReply}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSubmitReply}
                        disabled={
                          isSubmittingReply || replyText.trim().length === 0
                        }
                        size="sm"
                        className="gap-2"
                      >
                        {isSubmittingReply ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <Send className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- RECURSIÓN Y HILO --- */}
      {replies.length > 0 && (
        <div className="ml-8 pl-5 border-l-2 border-muted/80 space-y-4">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              allComments={allComments}
              user={user}
              sightingId={sightingId}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};
