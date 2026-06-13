import { employeeService } from "@/api/services/employeeService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useEmployeeById = (id: string) => {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeeService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useEmployees = () => {
  return useQuery({
    queryKey: ['employee'],
    queryFn: () => employeeService.getAll(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateEmployee = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: employeeService.create,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['employee'] }),
    });
};

export const useUpdateEmployee = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof employeeService.update>[1] }) =>
            employeeService.update(id, payload),
        onSuccess: (_data, variables) => {
            qc.invalidateQueries({ queryKey: ['employee'] });
            qc.invalidateQueries({ queryKey: ['employee', variables.id] });
        },
    });
};

export const useDeleteEmployee = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => employeeService.delete(id),
        onSuccess: (_data, id) => {
            qc.invalidateQueries({ queryKey: ['employee'] });
            qc.invalidateQueries({ queryKey: ['employee', id] });
        },
    });
};
