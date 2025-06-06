import { LAYOUT } from './constants'
import { PropsWithChildren } from 'react'
import { View, ViewProps } from 'react-native'

interface MobileLayoutProps extends ViewProps {
  withBackground?: boolean
}

export const MobileLayout = ({
  children,
  withBackground = true,
  className = '',
  ...props
}: PropsWithChildren<MobileLayoutProps>) => {
  return (
    <View className="min-h-screen w-full bg-gray-50">
      <View
        className={`mx-auto min-h-screen w-full shadow-sm ${
          withBackground ? 'bg-white' : ''
        } ${className}`}
        style={{
          maxWidth: LAYOUT.MOBILE_WIDTH,
          width: '100%',
        }}
        {...props}
      >
        {children}
      </View>
    </View>
  )
}
