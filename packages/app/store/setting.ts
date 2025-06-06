import { create } from 'zustand'

interface SettingState {
  fontSize: string
  setFontSize: (fontSize: string) => void
}

const settingStore = create<SettingState>((set) => ({
  fontSize: 'medium',
  setFontSize: (fontSize: string) => set({ fontSize }),
}))

export default settingStore
