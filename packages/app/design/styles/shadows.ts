import { ViewStyle } from 'react-native'

export const shadows = {
  sm: 'shadow-sm', // tailwindcss shadow-sm
  md: 'shadow', // tailwindcss shadow
  lg: 'shadow-lg', // tailwindcss shadow-lg
}

export const Shadow1: ViewStyle = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.2,
  shadowRadius: 1.41,
  elevation: 2,
}
