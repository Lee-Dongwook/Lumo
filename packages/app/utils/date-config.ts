import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  isSameMonth,
  Locale,
  parse,
  startOfMonth,
  subDays,
  subMonths,
  format as dateFnsFormat,
  type FormatOptions,
  fromUnixTime,
  getUnixTime,
} from 'date-fns'
import { ko, enUS } from 'date-fns/locale'
import { create } from 'zustand'

export type SupportedLocales = 'ko' | 'en'

interface DateConfigState {
  locale: SupportedLocales
  dateLocale: Locale
  setLocale: (locale: SupportedLocales) => void
}

const localeMap: Record<SupportedLocales, Locale> = {
  ko,
  en: enUS,
}

export const useDateConfig = create<DateConfigState>((set) => ({
  locale: 'ko',
  dateLocale: localeMap.ko,
  setLocale: (locale: SupportedLocales) =>
    set({ locale, dateLocale: localeMap[locale] }),
}))

export const toUnixTime = (date: Date): number => {
  return getUnixTime(date)
}

export const fromUnix = (unixTime: number): Date => {
  return fromUnixTime(unixTime)
}

export function format(
  date: Date | number,
  formatStr: string,
  options?: Omit<FormatOptions, 'locale'>,
) {
  const { dateLocale } = useDateConfig.getState()
  const dateToFormat = typeof date === 'number' ? fromUnix(date) : date
  return dateFnsFormat(dateToFormat, formatStr, {
    ...options,
    locale: dateLocale,
  })
}

export function convertGoalDate2Api(date: string): string {
  const _date = parse(date, 'dd/MM/yyyy', new Date())
  return dateFnsFormat(_date, 'yyyy-MM-dd')
}

export function convertDateApi2Goal(date: string): string {
  return dateFnsFormat(date, 'dd/MM/yyyy')
}

export function getTime2Digit(time: number) {
  return String(time).padStart(2, '0')
}

export function addDaysUnix(unixTime: number, amount: number): number {
  const date = fromUnix(unixTime)
  return toUnixTime(addDays(date, amount))
}

export function subDaysUnix(unixTime: number, amount: number): number {
  const date = fromUnix(unixTime)
  return toUnixTime(subDays(date, amount))
}

export function addMonthsUnix(unixTime: number, amount: number): number {
  const date = fromUnix(unixTime)
  return toUnixTime(addMonths(date, amount))
}

export function subMonthsUnix(unixTime: number, amount: number): number {
  const date = fromUnix(unixTime)
  return toUnixTime(subMonths(date, amount))
}

export function startOfMonthUnix(unixTime: number): number {
  const date = fromUnix(unixTime)
  return toUnixTime(startOfMonth(date))
}

export function endOfMonthUnix(unixTime: number): number {
  const date = fromUnix(unixTime)
  return toUnixTime(endOfMonth(date))
}

export function isSameMonthUnix(unixTime1: number, unixTime2: number): boolean {
  return isSameMonth(fromUnix(unixTime1), fromUnix(unixTime2))
}

export function eachDayOfIntervalUnix({
  start,
  end,
}: {
  start: number
  end: number
}): number[] {
  const dates = eachDayOfInterval({
    start: fromUnix(start),
    end: fromUnix(end),
  })
  return dates.map(toUnixTime)
}

export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}

export function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

export {
  addDays,
  subDays,
  addMonths,
  subMonths,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  endOfWeek,
  startOfWeek,
} from 'date-fns'
