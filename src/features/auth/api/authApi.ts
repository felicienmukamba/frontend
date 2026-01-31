import { api } from '@/services/api';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types';
import { setCredentials, updateToken, logout } from '../slices/authSlice';

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            transformResponse: (response: any) => response.data || response,
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials({
                        user: data.user,
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken
                    }));
                } catch {
                    // Failures handled by UI/baseQueryWithReauth
                }
            },
        }),
        register: builder.mutation<AuthResponse, RegisterRequest>({
            query: (credentials) => ({
                url: '/auth/register',
                method: 'POST',
                body: credentials,
            }),
            transformResponse: (response: any) => response.data || response
        }),
        refresh: builder.mutation<AuthResponse, { refreshToken: string }>({
            query: (body) => ({
                url: '/auth/refresh',
                method: 'POST',
                body,
            }),
            transformResponse: (response: any) => response.data || response,
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(updateToken({
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken
                    }));
                } catch {
                    // Failures handled by baseQueryWithReauth
                }
            },
        }),
        getProfile: builder.query<AuthResponse['user'], void>({
            query: () => '/auth/me',
            transformResponse: (response: any) => response.data || response
        }),
        // Forgot password: POST /api/v1/auth/forgot-password { email }
        forgotPassword: builder.mutation<void, { email: string }>({
            query: (body) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body,
            }),
        }),
        // Reset password: POST /api/v1/auth/reset-password { resetToken, newPassword }
        resetPassword: builder.mutation<void, { resetToken: string; newPassword: string }>({
            query: (body) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body,
            }),
        }),
        // Logout: POST /api/v1/auth/logout (invalidates refresh token server-side)
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                } finally {
                    dispatch(logout());
                }
            },
        }),
        updateProfile: builder.mutation<AuthResponse['user'], Partial<AuthResponse['user']> & { password?: string }>({
            query: (body) => ({
                url: '/auth/profile',
                method: 'PATCH',
                body,
            }),
            transformResponse: (response: any) => response.data || response,
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials({
                        user: data,
                    } as any)); // partial update handled in slice or we might need a specific action
                } catch {
                    // Failures handled by UI
                }
            },
        }),
    }),
});

export const {
    useLoginMutation,
    useRefreshMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useLogoutMutation,
    useUpdateProfileMutation,
    useGetProfileQuery,
} = authApi;
