import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Trophy, Star, Calendar, XCircle } from "lucide-react";
import { format } from "date-fns";
import { useWinners, useRemoveAward } from "@/hooks/use-designers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function WinnerHero() {
  const { data: winners, isLoading } = useWinners();
  const removeAwardMutation = useRemoveAward();
  const [hasCelebrated, setHasCelebrated] = useState(false);

  useEffect(() => {
    if (winners && winners.length > 0 && !hasCelebrated) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults, particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults, particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      setHasCelebrated(true);
    }
  }, [winners, hasCelebrated]);

  // Reset celebration if a new winner is selected (detect by ID of latest winner)
  const latestId = winners?.[0]?.id;
  useEffect(() => {
    setHasCelebrated(false);
  }, [latestId]);

  if (isLoading) {
    return (
      <div className="w-full h-80 rounded-3xl animate-pulse bg-primary/5 border border-primary/10 flex items-center justify-center">
        <Trophy className="w-12 h-12 text-primary/20 animate-bounce" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {winners && winners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {winners.map((winner, idx) => (
              <motion.div
                key={winner.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ type: "spring", bounce: 0.4, duration: 0.8, delay: idx * 0.1 }}
                className={`relative overflow-hidden rounded-[2.5rem] glass-card p-6 border-2 ${
                  idx === 0 ? "border-primary/40 md:col-span-full lg:col-span-1" : "border-primary/20"
                }`}
              >
                {/* Decorative background blobs */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
                
                <div className="relative z-10 flex flex-col items-center gap-6">
                  {/* Remove button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 text-muted-foreground hover:text-destructive z-30"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAwardMutation.mutate(winner.id);
                    }}
                    disabled={removeAwardMutation.isPending}
                  >
                    <XCircle className="w-5 h-5" />
                  </Button>

                  <motion.div 
                    initial={{ rotate: -10, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 + idx * 0.1 }}
                    className="relative"
                  >
                    <div className="absolute -inset-4 bg-gradient-to-tr from-primary to-accent rounded-full opacity-20 blur-xl animate-pulse" />
                    <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-accent rounded-full opacity-50" />
                    <Avatar className="w-24 h-24 border-4 border-white shadow-2xl relative z-10 bg-white">
                      <AvatarImage src={winner.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(winner.name)}&backgroundColor=f8fafc`} />
                      <AvatarFallback className="text-2xl font-display font-bold text-primary">{winner.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-accent text-white p-2 rounded-full shadow-lg transform rotate-12 z-20">
                      <Trophy className="w-5 h-5" />
                    </div>
                  </motion.div>

                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-xs mb-1">
                      <Star className="w-3 h-3" />
                      <span>Diseñador de la Semana</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground truncate max-w-full px-2">
                      {winner.name}
                    </h2>
                    
                    {winner.winReason ? (
                      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed line-clamp-3">
                        "{winner.winReason}"
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        ¡Reconocido por su exploración de código!
                      </p>
                    )}

                    {winner.winDate && (
                      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-4 font-medium">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(winner.winDate), "dd/MM/yyyy")}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-64 rounded-[2.5rem] glass-card flex flex-col items-center justify-center text-center p-8 border-dashed border-2 border-primary/20 bg-primary/5"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-primary opacity-50" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">No winners selected yet</h2>
            <p className="text-muted-foreground max-w-md">
              The podium is empty! Review the incredible designers below and award someone the medal for this week.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
