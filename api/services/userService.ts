import apiClient from '../client';

export interface UserDetail {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    address: string;
    username?: string;
    date_joined?: string;
}

export const userService = {
    getDetail: async (): Promise<UserDetail> => {
        const { data } = await apiClient.get<UserDetail>('/account/user/detail/');
        return data;
    },
};
