import { colonyService } from "@/api/services/colonyService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// hooks/useColonies.ts
export const useColonyById = (id: string) =>
  useQuery({
    queryKey: ['colony', id],  // ← same key = same cache
    queryFn: () => colonyService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // cache for 5 mins
  });

export const useCreateColony = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: colonyService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['colony'] }),
  });
};