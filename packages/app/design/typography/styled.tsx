import React, { useMemo } from 'react'
import { Text, TextProps } from 'react-native'

// export const StyledTypography = Text

type Props = {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
} & TextProps
export function StyledTypography({ children, size = 'md', ...props }: Props) {
  const { className } = props
  const fontSize = useMemo(() => {
    let fontSize = 14
    if (!className) return fontSize
    if (className.includes('text-5xl')) fontSize = 34
    if (className.includes('text-4xl')) fontSize = 30
    if (className.includes('text-3xl')) fontSize = 26
    if (className.includes('text-2xl')) fontSize = 22
    if (className.includes('text-1.5xl')) fontSize = 21
    if (className.includes('text-xl')) fontSize = 18
    if (className.includes('text-lg')) fontSize = 16
    if (className.includes('text-base')) fontSize = 14
    if (className.includes('text-sm')) fontSize = 12
    if (className.includes('text-xs')) fontSize = 10
    if (size === 'sm') fontSize -= 2
    if (size === 'lg') fontSize += 2
    return fontSize
  }, [className, size])

  return (
    // @ts-ignore
    <Text {...props} style={{ fontSize, ...props.style }}>
      {children}
    </Text>
  )
}
