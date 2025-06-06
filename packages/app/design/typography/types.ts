import { TextProps } from 'react-native'
import React from 'react'

export type TypographyVariant = 't1' | 't0' | 't2' | 't3' | 'c1' | 'c2' | 'c3'
export type TypographyWeight = 'regular' | 'medium' | 'semibold' | 'bold'
export type TypographyColor =
  | 'primary'
  | 'secondary'
  | 'white'
  | 'black'
  | 'gray'
  | 'error'
  | 'success'
  | 'blue'
  | 'gray-300'
  | 'gray-400'
  | 'blue-gray-700'
  | 'gray-700'
export type TypographyAlign = 'left' | 'center' | 'right'

export interface StyledTypographyProps extends TextProps {
  $variant?: TypographyVariant
  $weight?: TypographyWeight
  $color?: TypographyColor
  $align?: TypographyAlign
}

export interface TypographyProps extends Omit<TextProps, 'children'> {
  variant?: TypographyVariant
  weight?: TypographyWeight
  color?: TypographyColor
  align?: TypographyAlign
  children?: React.ReactNode
  className?: string
}
