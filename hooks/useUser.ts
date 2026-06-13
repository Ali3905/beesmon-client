import { useQuery } from '@tanstack/react-query';
import { userService, UserDetail } from '@/api/services/userService';

export const useUserDetail = () =>
    useQuery<UserDetail>({
        queryKey: ['user', 'detail'],
        queryFn: userService.getDetail,
        staleTime: 1000 * 60 * 10,
    });
