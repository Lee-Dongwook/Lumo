export const spaceStyles = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
}

export const alignStyles = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  between: 'items-stretch',
  around: 'items-stretch',
  evenly: 'items-stretch',
}

export const justifyStyles = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
}

export const LAYOUT = {
  MOBILE_WIDTH: 430,
  PADDING: 16,
  GAP: 16,
  COLUMN_NUM: 2,
  BOTTOM_BUTTON_HEIGHT: 80, // 하단 버튼 영역 높이
  HEADER_HEIGHT: 56, // 헤더 높이
} as const
