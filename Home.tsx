import { useDesigners } from "@/hooks/use-designers";
import { WinnerHero } from "@/components/WinnerHero";
import { DesignerCard } from "@/components/DesignerCard";
import { AddDesignerDialog } from "@/components/AddDesignerDialog";
import { Loader2, Users } from "lucide-react";

export default function Home() {
  const { data: designers, isLoading, error } = useDesigners();

  return (
    <div className="min-h-screen animated-gradient-bg px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Soft background noise overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3">
              <span className="text-2xl text-primary-foreground font-bold">🏅</span>
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground leading-tight">Diseñador de la Semana</h1>
              <p className="text-muted-foreground text-sm font-medium">Reconocimiento por exploración en código</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <AddDesignerDialog />
          </div>
        </header>

        {/* Hero Section */}
        <section>
          <WinnerHero />
        </section>

        {/* Roster Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="bg-white/60 dark:bg-black/20 p-2 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-3xl font-display font-bold text-foreground">The Roster</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-destructive/10 text-destructive p-6 rounded-2xl border border-destructive/20 text-center font-medium">
              Failed to load designers. Please try refreshing the page.
            </div>
          ) : !designers?.length ? (
            <div className="text-center py-24 glass-panel rounded-3xl">
              <div className="text-6xl mb-4">👻</div>
              <h3 className="text-xl font-bold font-display text-foreground mb-2">No designers found</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Your roster is looking a bit empty! Add your first instructional designer to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {designers.map((designer, index) => (
                <DesignerCard 
                  key={designer.id} 
                  designer={designer} 
                  index={index} 
                />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
