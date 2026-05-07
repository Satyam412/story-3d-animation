import { create } from 'zustand';

export const useStore = create((set) => ({
  activePage: '/',
  setActivePage: (page) => set({ activePage: page }),
  cameraTarget: [0, 0, 0],
  setCameraTarget: (target) => set({ cameraTarget: target }),
}));
