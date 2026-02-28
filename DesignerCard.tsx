import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import type { Designer } from "@shared/schema";
import { useDeleteDesigner } from "@/hooks/use-designers";
import { AwardDialog } from "./AwardDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DesignerCardProps {
  designer: Designer;
  index: number;
}

export function DesignerCard({ designer, index }: DesignerCardProps) {
  const deleteMutation = useDeleteDesigner();
  
  const autoAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(designer.name)}&backgroundColor=e2e8f0`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 200, damping: 20 }}
      className={`relative group bg-card rounded-[2rem] p-6 border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        designer.isCurrentWinner ? "border-accent shadow-accent/10" : "border-transparent hover:border-primary/20 shadow-sm"
      }`}
    >
      {/* Decorative background shape */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity z-0" />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        
        <div className="relative mb-4">
          <Avatar className="w-24 h-24 border-4 border-background shadow-md">
            <AvatarImage src={designer.avatarUrl || autoAvatar} className="object-cover" />
            <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
              {designer.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {designer.isCurrentWinner && (
            <div className="absolute -top-2 -right-2 bg-accent text-white p-1.5 rounded-full shadow-md">
              <span className="text-xl leading-none">👑</span>
            </div>
          )}
        </div>

        <h3 className="text-xl font-display font-bold text-foreground mb-1 truncate w-full px-2">
          {designer.name}
        </h3>
        
        <div className="h-6 mb-6">
          {designer.isCurrentWinner ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent">
              Campeón Vigente
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
              Diseñador Instruccional
            </span>
          )}
        </div>

        <div className="w-full space-y-3">
          <AwardDialog designer={designer} />
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esto eliminará permanentemente a {designer.name} de la lista.
                  Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => deleteMutation.mutate(designer.id)}
                >
                  {deleteMutation.isPending ? "Eliminando..." : "Sí, Eliminar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </motion.div>
  );
}
