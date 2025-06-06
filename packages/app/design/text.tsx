import { Text, View } from 'react-native'
import { Typography } from './typography'

interface TextLightGrayProps {
  value: string
  className?: string
  wrapperClassName?: string
}
export const TextLightGrayWrap = (props: TextLightGrayProps) => {
  const { value, className, wrapperClassName } = props
  return (
    <View className={`bg-background rounded-xl p-2.5 ${wrapperClassName}`}>
      <Typography
        variant="c2"
        weight="medium"
        className={`text-blue-gray-700 ${className}`}
      >
        {value}
      </Typography>
    </View>
  )
}
