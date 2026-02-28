import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type Designer, type InsertDesigner } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useDesigners() {
  return useQuery({
    queryKey: [api.designers.list.path],
    queryFn: async () => {
      const res = await fetch(api.designers.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch designers");
      const data = await res.json();
      return api.designers.list.responses[200].parse(data);
    },
  });
}

export function useWinners() {
  return useQuery({
    queryKey: [api.designers.getWinners.path],
    queryFn: async () => {
      const res = await fetch(api.designers.getWinners.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch winners");
      const data = await res.json();
      return api.designers.getWinners.responses[200].parse(data);
    },
  });
}

export function useCreateDesigner() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertDesigner) => {
      const validated = api.designers.create.input.parse(data);
      const res = await fetch(api.designers.create.path, {
        method: api.designers.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create designer");
      }
      return api.designers.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.designers.list.path] });
      toast({ title: "Designer Added!", description: "They're ready to win." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useAwardDesigner() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason?: string }) => {
      const url = buildUrl(api.designers.award.path, { id });
      const res = await fetch(url, {
        method: api.designers.award.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to award designer");
      }
      return api.designers.award.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.designers.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.designers.getWinners.path] });
      toast({ 
        title: "Medal Awarded! 🏅", 
        description: `${data.name} is now a Designer of the Week!`,
      });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteDesigner() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.designers.delete.path, { id });
      const res = await fetch(url, {
        method: api.designers.delete.method,
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete designer");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.designers.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.designers.getWinners.path] });
      toast({ title: "Designer Removed", description: "They have been removed from the roster." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useRemoveAward() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.designers.removeAward.path, { id });
      const res = await fetch(url, {
        method: api.designers.removeAward.method,
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to remove award");
      }
      return api.designers.removeAward.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.designers.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.designers.getWinners.path] });
      toast({ 
        title: "Reconocimiento retirado", 
        description: `${data.name} ya no está en el podio.`,
      });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}
