import { LAYOUT } from './constants'
import { PixelRatio } from 'react-native'

export const getGridItemWidth = (
  containerWidth: number = LAYOUT.MOBILE_WIDTH,
  columns: number = LAYOUT.COLUMN_NUM,
  padding: number = LAYOUT.PADDING,
  gap: number = LAYOUT.GAP,
) => {
  return (containerWidth - padding * 2 - gap * (columns - 1)) / columns
}

export const getMobileContainerStyle = () => ({
  maxWidth: LAYOUT.MOBILE_WIDTH,
  width: '100%',
})

export const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: any) => {
  const paddingToBottom = 20
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  )
}

export const COMMON_CLASSES = {
  MOBILE_CONTAINER: 'mx-auto h-full w-full bg-white',
  GRID_ITEM_BASE: 'items-center justify-center rounded-2xl p-4',
  SELECTED_ITEM: 'border-2 border-[#00B4D8] bg-blue-50',
  UNSELECTED_ITEM: 'border-2 border-gray-100 bg-gray-50',
  SELECTED_TEXT: 'text-[#00B4D8]',
  UNSELECTED_TEXT: 'text-gray-500',
} as const

export interface GridItemStyle {
  width: number
  marginRight: number
  marginBottom: number
  height?: number
}

export const getGridItemStyle = (
  itemWidth: number,
  gap: number = LAYOUT.GAP,
  isLastItem: boolean = false,
  isSquare: boolean = true,
): GridItemStyle => ({
  width: itemWidth,
  height: isSquare ? itemWidth : undefined,
  marginRight: isLastItem ? 0 : gap,
  marginBottom: gap,
})

/**
 * Convert a string from snake_case to camelCase.
 *
 * @param {string} str
 * @returns {string}
 *
 *
 * @example:
 * transformToCamelCase('hello_world') // 'helloWorld'
 * transformToCamelCase('snake_case_string') // 'snakeCaseString'
 */
export const transformToCamelCase = (str: string) => {
  return str
    .toLowerCase()
    .split('_')
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join('')
}

export const dpToPixel = (dp: number) => {
  return PixelRatio.getPixelSizeForLayoutSize(dp)
}
