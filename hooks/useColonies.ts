import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { colonyService } from '../api/services/colonyService';

export const useColonies = (params?: any) =>
  useQuery({
    queryKey: ['colony', params],
    queryFn: () => colonyService.getAll(params),
  });

// export const useUpdateColony = () => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, data }) => colonyService.update(id, data),
//     onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
//   });
// };