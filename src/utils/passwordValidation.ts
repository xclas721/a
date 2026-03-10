import zxcvbn from 'zxcvbn'

/**
 * Password validation shared function
 * @param password password to validate
 * @param pdParam password policy parameters
 * @param t i18n function
 * @returns Validation result
 */
export const validatePassword = async (
  password: string,
  pdParam: Record<string, any>,
  t: (key: string) => string
): Promise<{ isValid: boolean; message: string }> => {
  const errors: string[] = []

  // Check password length
  const minLength = Number.parseInt(pdParam.pdMinLength)
  const maxLength = Number.parseInt(pdParam.pdMaxLength)
  if (password.length < minLength || password.length > maxLength) {
    errors.push(pdParam.pdLengthError || pdParam.pdFormatError)
  }

  // Check password rules (execute directly)
  const contentRules = pdParam.pdContentRule.split(',')

  // Check required types
  // Check numbers
  if (contentRules.includes('0') && !/\d/.test(password)) {
    errors.push(pdParam.pdNumberError || pdParam.pdFormatError)
  }

  // Check uppercase letters
  if (contentRules.includes('1') && !/[A-Z]/.test(password)) {
    errors.push(pdParam.pdUpperCaseError || pdParam.pdFormatError)
  }

  // Check lowercase letters
  if (contentRules.includes('2') && !/[a-z]/.test(password)) {
    errors.push(pdParam.pdLowerCaseError || pdParam.pdFormatError)
  }

  // Check special symbols
  if (contentRules.includes('3') && !/[!@#$%^&*_-]/.test(password)) {
    errors.push(pdParam.pdSpecialCharError || pdParam.pdFormatError)
  }

  // Check disallowed types (unlisted types)
  // Check if disallowed numbers are included
  if (!contentRules.includes('0') && /\d/.test(password)) {
    errors.push(pdParam.pdNumberNotAllowedError || pdParam.pdFormatError)
  }

  // Check if disallowed uppercase letters are included
  if (!contentRules.includes('1') && /[A-Z]/.test(password)) {
    errors.push(pdParam.pdUpperCaseNotAllowedError || pdParam.pdFormatError)
  }

  // Check if disallowed lowercase letters are included
  if (!contentRules.includes('2') && /[a-z]/.test(password)) {
    errors.push(pdParam.pdLowerCaseNotAllowedError || pdParam.pdFormatError)
  }

  // Check if disallowed special symbols are included
  if (!contentRules.includes('3') && /[!@#$%^&*_-]/.test(password)) {
    errors.push(pdParam.pdSpecialCharNotAllowedError || pdParam.pdFormatError)
  }

  // If errors, return all error messages
  if (errors.length > 0) {
    return { isValid: false, message: errors.join('；') }
  }

  // Check password strength (if strong password restriction enabled)
  if (pdParam.pdRestrict === '1') {
    const passwordStrength = zxcvbn(password)
    if (passwordStrength.score < 2) {
      return { isValid: false, message: t('pwd.weak') }
    }
  }

  return { isValid: true, message: '' }
}

/**
 * Basic password validation (excluding strong password check)
 * @param newPassword new password
 * @param confirmPassword confirm password
 * @param oldPassword old password
 * @param account account
 * @param t i18n function
 * @returns Validation result
 */
export const validateBasicPassword = async (
  newPassword: string,
  confirmPassword: string,
  oldPassword: string,
  account: string,
  t: (key: string) => string
): Promise<{ isValid: boolean; message: string }> => {
  // New password != Confirm password
  if (newPassword !== confirmPassword) {
    return { isValid: false, message: t('warn.change-password.new-not-equals-confirm') }
  }

  // Password cannot be same as account
  if (newPassword === account) {
    return { isValid: false, message: t('warn.change-password.contain-account') }
  }

  // New password cannot be same as old password
  if (newPassword === oldPassword) {
    return { isValid: false, message: t('warn.change-password.old-equals-new') }
  }

  return { isValid: true, message: '' }
}
