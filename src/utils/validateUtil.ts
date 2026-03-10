/**
 * Popup validation regex
 * @param val input value
 * @param regexp regular expression
 * @param msg prompt message
 */
export function validatePattern(val: string, regexp: string, msg: string) {
  const validate: Record<string, any> = {}
  const valPattern = new RegExp(`^${regexp}$`)
  if (valPattern.test(val)) {
    validate['result'] = true
  } else {
    validate['result'] = false
    validate['message'] = msg ?? 'javax.validation.constraints.Pattern.message'
    validate['messagePattern'] = msg ? '' : [regexp]
  }
  return validate
}

/**
 * Popup validation size
 * @param val input value
 * @param minVal min value
 */
export function validateDecimalMin(val: string, minVal: string) {
  const validate: Record<string, any> = {}
  if (Number(val) > Number(minVal)) {
    validate['result'] = true
  } else {
    validate['result'] = false
    validate['message'] = 'javax.validation.constraints.DecimalMin.message'
    validate['messagePattern'] = [minVal]
  }
  return validate
}

/**
 * Validate number
 * @param val input value
 */
export const validateNumber = (val: string) => {
  const validate: Record<string, any> = {}
  const emailPattern = /^\d+$/
  if (emailPattern.test(val)) {
    validate['result'] = true
  } else {
    validate['result'] = false
    validate['message'] = 'warn.num-only'
  }
  return validate
}

/**
 * Validate phone
 * @param val input value
 */
export const validateTel = (val: string) => {
  const validate: Record<string, any> = {}
  // Improved regex: supports international numbers, area codes, extensions etc. common formats
  const telPattern = /^(?:\+\d{1,4})?(?:[\d\-()\s]{6,20}|(?:\d{3,4}-)?\d{7,8}(?:-\d{1,6})?)$/
  if (telPattern.test(val)) {
    validate['result'] = true
  } else {
    validate['result'] = false
    validate['message'] = 'warn.user.tel.error'
  }
  return validate
}

/**
 * Validate email
 * @param email email
 */
export const validateEmail = (email: string) => {
  const validate: Record<string, any> = {}
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (emailPattern.test(email)) {
    validate['result'] = true
  } else {
    validate['result'] = false
    validate['message'] = 'warn.invalid-email'
  }
  return validate
}

/**
 * Bank parameter validation IP
 * @param formData form data
 * @param formatError form error prompt
 * @param field field
 */
export const validateIpFormat = (formData: Record<string, any>, formatError: Record<string, any>, field: string) => {
  const value = formData[field]
  if (!value) {
    formatError[field] = false
    return
  }

  // 1. Extract hostname (supports full URL and pure domain)
  let hostname = value

  try {
    if (value.includes('://')) {
      const urlObj = new URL(value)
      hostname = urlObj.hostname
    } else if (value.includes('.') || value.includes(':') || value.includes('/')) {
      const urlObj = new URL('http://' + value)
      hostname = urlObj.hostname
    }
  } catch (e) {
    // URL parse failed, log error and keep original value
    if (e instanceof Error) {
      console.debug('URL parsing failed for value:', value, 'Error:', e.message)
    } else {
      console.debug('URL parsing failed for value:', value, 'Unknown error:', e)
    }
  }

  // 2. Clean hostname (remove port, path, extra spaces)
  hostname = hostname.split(':')[0].split('/')[0].trim()

  // 3. Special handling for IPv6 [::1]
  if (hostname.startsWith('[') && hostname.endsWith(']')) {
    hostname = hostname.slice(1, -1)
  }

  // 4. Regex definition
  const ipv4Regex = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/

  const ipv6Regex =
    /^(([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}|([\da-fA-F]{1,4}:){1,7}:|([\da-fA-F]{1,4}:){1,6}:[\da-fA-F]{1,4}|([\da-fA-F]{1,4}:){1,5}(:[\da-fA-F]{1,4}){1,2}|([\da-fA-F]{1,4}:){1,4}(:[\da-fA-F]{1,4}){1,3}|([\da-fA-F]{1,4}:){1,3}(:[\da-fA-F]{1,4}){1,4}|([\da-fA-F]{1,4}:){1,2}(:[\da-fA-F]{1,4}){1,5}|[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,6})|:((:[\da-fA-F]{1,4}){1,7}|:)|fe80:(:[\da-fA-F]{0,4}){0,4}%[\da-zA-Z]+|::(ffff(:0{1,4})?:)?((25[0-5]|(2[0-4]|1?\d)?\d)\.){3}(25[0-5]|(2[0-4]|1?\d)?\d)|([\da-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1?\d)?\d)\.){3}(25[0-5]|(2[0-4]|1?\d)?\d))$/

  // Improved domain regex (supports multi-level subdomains and internationalized domains)
  const domainRegex =
    /^(?=.{1,253}$)(?:[a-z0-9\u00a1-\uffff](?:[a-z0-9\u00a1-\uffff-]{0,61}[a-z0-9\u00a1-\uffff])?\.)+[a-z\u00a1-\uffff]{2,}$/i

  // 5. Validation
  const isIpv4 = ipv4Regex.test(hostname)
  const isIpv6 = ipv6Regex.test(hostname)
  const isDomain = domainRegex.test(hostname)

  const isValid = isIpv4 || isIpv6 || isDomain

  formatError[field] = !isValid
}
