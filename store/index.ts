import { create } from 'zustand';
import { createAuthSlice, AuthSlice } from './authSlice';
import { createUISlice, UISlice } from './uiSlice';

type StoreState = AuthSlice & UISlice;

export const useStore = create<StoreState>()((...a) => ({
  ...createAuthSlice(...a),
  ...createUISlice(...a),
}));