import { create } from "zustand";

export const useDistrictStore = create((set) => ({
  selectedDistrict: null,
  districts: [],
  setSelectedDistrict: (district) => set({ selectedDistrict: district }),
  setDistricts: (districts) => set({ districts }),
}));
