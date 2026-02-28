import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trophy, Sparkles } from "lucide-react";
import { useAwardDesigner } from "@/hooks/use-designers";
import type { Designer } from "@shared/schema";

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
import { Textarea } from "@/components/ui/textarea";

const awardSchema = z.object({
  reason: z.string().max(200, "Reason must be less than 200 characters").optional(),
});

type AwardFormValues = z.infer<typeof awardSchema>;

interface AwardDialogProps {
  designer: Designer;
}

export function AwardDialog({ designer }: AwardDialogProps) {
  const [open, setOpen] = useState(false);
  const awardMutation = useAwardDesigner();

  const form = useForm<AwardFormValues>({
    resolver: zodResolver(awardSchema),
    defaultValues: { reason: "" },
  });

  const onSubmit = (data: AwardFormValues) => {
    awardMutation.mutate(
      { id: designer.id, reason: data.reason },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={designer.isCurrentWinner ? "secondary" : "default"} 
          className="w-full font-semibold shadow-md hover:shadow-lg transition-all"
          disabled={designer.isCurrentWinner}
        >
          {designer.isCurrentWinner ? (
            <>
              <Trophy className="w-4 h-4 mr-2 text-primary" />
              Ganador Actual
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Premiar
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-2 border-primary/20 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <Trophy className="w-6 h-6 text-accent" />
            Premiar Ganador
          </DialogTitle>
          <DialogDescription className="text-base">
            Estás a punto de premiar a <strong className="text-foreground">{designer.name}</strong> como el Diseñador de la Semana.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">¿Por qué ganó? (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Ej. Por su excelente exploración de código y apoyo al equipo..." 
                      className="resize-none rounded-xl bg-muted/50 border-transparent focus-visible:bg-background focus-visible:border-primary focus-visible:ring-primary/20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl text-lg font-bold bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/25 transition-all"
              disabled={awardMutation.isPending}
            >
              {awardMutation.isPending ? "Premiando..." : "Dar Medalla 🏅"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
