import React from 'react'
import { ViewProps } from 'react-native'

export type Space = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type Alignment =
  | 'start'
  | 'center'
  | 'end'
  | 'between'
  | 'around'
  | 'evenly'

export interface StyledLayoutProps extends ViewProps {
  $space?: Space
  $align?: Alignment
  $justify?: Alignment
  $wrap?: boolean
  $reverse?: boolean
  $flex?: boolean | number
}

export interface LayoutProps extends Omit<ViewProps, 'children'> {
  children?: React.ReactNode
  space?: Space
  align?: Alignment
  justify?: Alignment
  wrap?: boolean
  reverse?: boolean
  flex?: boolean | number
  className?: string
}
