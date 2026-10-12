import { create } from "zustand";

/** Placeholder client store. Registry filters will live here. */
type ExampleState = {
  ready: boolean;
  setReady: (ready: boolean) => void;
};

export const useExampleStore = create<ExampleState>((set) => ({
  ready: true,
  setReady: (ready) => set({ ready }),
}));
