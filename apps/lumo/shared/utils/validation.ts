/**
 * Common validation utilities
 */

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPassword = (password: string): boolean => {
  // 최소 8자, 영문/숫자/특수문자 조합
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
  return passwordRegex.test(password)
}

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10,11}$/
  return phoneRegex.test(phone.replace(/[^0-9]/g, ''))
}

export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0
} 