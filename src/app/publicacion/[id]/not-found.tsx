import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Publicación no encontrada
            </h1>
            <p className="text-muted-foreground">
              La publicación que buscas no existe o ha sido eliminada.
            </p>
          </div>
          <div className="flex gap-2 justify-center pt-4">
            <Button asChild>
              <Link href="/mascotas">Ver todas las mascotas</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Ir al inicio</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
