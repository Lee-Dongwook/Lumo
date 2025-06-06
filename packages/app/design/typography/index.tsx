import settingStore from 'app/store/setting'
import { StyledTypography } from './styled'
import type { TypographyProps } from './types'

const variantStyles = {
  // font size 22px
  t1: 'text-2xl leading-9 font-bold',
  // font size 20px
  t0: 'text-1.5xl leading-9 font-bold',
  // font size 18px
  t2: 'text-xl leading-8 font-bold',
  // font size 16px
  t3: 'text-lg leading-7 font-bold',
  // Font size 14px
  c1: 'text-base leading-6',
  // Font size 12px
  c2: 'text-sm leading-5',
  // Font size 10px
  c3: 'text-xs leading-4',
}

const weightStyles = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

const colorStyles = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  white: 'text-white',
  black: 'text-gray-900',
  gray: 'text-gray-500',
  'gray-300': 'text-gray-300',
  'gray-400': 'text-gray-400',
  'gray-700': 'text-gray-700',
  error: 'text-point-coral',
  success: 'text-point-green',
  blue: 'text-blue-500',
  'blue-gray-700': 'text-blue-gray-700',
}

const alignStyles = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

const MAPPING = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
}

/**
 * Typography component with variant, weight, color, and align style.
 *
 * @prop {TypographyVariant} variant - Typography variant. Default is 'c1'.
 * @prop {TypographyWeight} weight - Typography weight.
 * @prop {TypographyColor} color - Typography color. Default is 'black'.
 * @prop {TypographyAlign} align - Typography alignment. Default is 'left'.
 * @prop {ReactNode} children - Typography children.
 * @prop {string} className - Additional class name.
 * @prop {object} [props] - Additional props to pass through to StyledTypography.
 */
export function Typography({
  variant = 'c1',
  weight,
  color = 'black',
  align = 'left',
  children,
  className = '',
  ...props
}: TypographyProps) {
  const { fontSize } = settingStore()
  const size = MAPPING[fontSize as 'small' | 'medium' | 'large']
  const combinedClassName = `
    ${variantStyles[variant]}
    ${weight ? weightStyles[weight] : ''}
    ${colorStyles[color]}
    ${alignStyles[align]}
    ${className}
  `.trim()

  return (
    <StyledTypography
      className={combinedClassName}
      size={size as 'sm' | 'md' | 'lg'}
      {...props}
    >
      {children}
    </StyledTypography>
  )
}

export const CustomText = (props: TypographyProps) => {
  const { fontSize } = settingStore()
  const size = MAPPING[fontSize as 'small' | 'medium' | 'large']

  return (
    <StyledTypography
      className={props.className}
      size={size as 'sm' | 'md' | 'lg'}
      {...props}
    >
      {props.children}
    </StyledTypography>
  )
}
