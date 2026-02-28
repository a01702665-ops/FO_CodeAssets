import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Paintbrush } from "lucide-react";
import { insertDesignerSchema, type InsertDesigner } from "@shared/schema";
import { useCreateDesigner } from "@/hooks/use-designers";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function AddDesignerDialog() {
  const [open, setOpen] = useState(false);
  const createMutation = useCreateDesigner();

  const form = useForm<InsertDesigner>({
    resolver: zodResolver(insertDesignerSchema),
    defaultValues: { 
      name: "", 
      avatarUrl: "",
      isCurrentWinner: false 
    },
  });

  const onSubmit = (data: InsertDesigner) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full shadow-lg shadow-primary/20 font-semibold px-6 hover:-translate-y-0.5 transition-transform">
          <Plus className="w-5 h-5 mr-2" />
          Add Designer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <Paintbrush className="w-6 h-6 text-primary" />
            Nuevo Miembro
          </DialogTitle>
          <DialogDescription>
            Añade un nuevo diseñador instruccional a la lista.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ej. Karina Cavazos" 
                      className="rounded-xl h-11 bg-muted/50 border-transparent focus-visible:bg-background"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL del Avatar (Opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://ejemplo.com/avatar.jpg" 
                      className="rounded-xl h-11 bg-muted/50 border-transparent focus-visible:bg-background"
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground mt-1">¡Deja en blanco para un avatar divertido generado automáticamente!</p>
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl text-md font-bold mt-4"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Añadiendo..." : "Añadir a la Lista"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
