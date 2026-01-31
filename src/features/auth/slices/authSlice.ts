import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';
import { RootState } from '@/store';
import Cookies from 'js-cookie';

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    selectedBranchId: number | null;
    isAuthenticated: boolean;
}

// Hydrate state from cookies only in browser
const getInitialState = (): AuthState => {
    if (typeof window === 'undefined') {
        return { user: null, token: null, refreshToken: null, selectedBranchId: null, isAuthenticated: false };
    }

    const token = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');
    const userJson = Cookies.get('userData');
    const branchId = Cookies.get('selectedBranchId');

    let user = null;
    if (userJson) {
        try {
            user = JSON.parse(userJson);
        } catch (e) {
            console.error('Failed to parse user data from cookies', e);
        }
    }

    return {
        user,
        token: token || null,
        refreshToken: refreshToken || null,
        selectedBranchId: branchId ? Number(branchId) : (user?.branchId || null),
        isAuthenticated: !!token,
    };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.selectedBranchId = null;
            state.isAuthenticated = false;

            // Clear cookies
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            Cookies.remove('userData');
            Cookies.remove('selectedBranchId');
        },
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>
        ) => {
            const { user, accessToken, refreshToken } = action.payload;
            state.user = user;
            state.token = accessToken;
            state.refreshToken = refreshToken;
            state.isAuthenticated = true;

            // Default to user's assigned branch if not already set
            if (!state.selectedBranchId) {
                state.selectedBranchId = user.branchId || null;
                if (state.selectedBranchId) {
                    Cookies.set('selectedBranchId', String(state.selectedBranchId), { expires: 7, secure: true, sameSite: 'strict' });
                }
            }

            // Set cookies with appropriate security options
            Cookies.set('accessToken', accessToken, { expires: 1 / 24, secure: true, sameSite: 'strict' }); // 1 hour
            Cookies.set('refreshToken', refreshToken, { expires: 7, secure: true, sameSite: 'strict' }); // 7 days
            Cookies.set('userData', JSON.stringify(user), { expires: 7, secure: true, sameSite: 'strict' });
        },
        updateToken: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
            state.token = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;

            Cookies.set('accessToken', action.payload.accessToken, { expires: 1 / 24, secure: true, sameSite: 'strict' });
            Cookies.set('refreshToken', action.payload.refreshToken, { expires: 7, secure: true, sameSite: 'strict' });
        },
        setSelectedBranchId: (state, action: PayloadAction<number | null>) => {
            state.selectedBranchId = action.payload;
            if (action.payload) {
                Cookies.set('selectedBranchId', String(action.payload), { expires: 7, secure: true, sameSite: 'strict' });
            } else {
                Cookies.remove('selectedBranchId');
            }
        }
    }
});

export const { logout, setCredentials, updateToken, setSelectedBranchId } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectSelectedBranchId = (state: RootState) => state.auth.selectedBranchId;
