import type { BaseI18nSelect, BaseSelect } from '@/utils/select/baseSelect'
import i18n from '@/locales/index'
import ApiUtil from '@/utils/apiUtils'
import sha256 from 'sha256'
import sha1 from 'sha1'
import { computed } from 'vue'
import { DateTime } from 'luxon'
import swalMessage from '@/plugins/swalMessage'

const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })

/**
 * Set field to required
 * @param formConfig form configuration
 * @param idsToUpdate fields to update
 * @param required is required?
 */
export function requiredSet(formConfig: Record<string, any>, idsToUpdate: string[], required: boolean) {
  // Update readOnly attribute for corresponding ID in formConfig array
  for (const field of formConfig.value) {
    if (idsToUpdate.includes(field.ID)) {
      field.required = required
    }
  }
}

/**
 * Set field to readOnly
 * @param formConfig form configuration
 * @param idsToUpdate fields to update
 * @param readOnly whether readOnly
 */
export function readOnlySet(formConfig: Record<string, any>, idsToUpdate: string[], readOnly: boolean) {
  // Update readOnly attribute for corresponding ID in formConfig array
  for (const field of formConfig.value) {
    if (idsToUpdate.includes(field.ID)) {
      field.readOnly = readOnly
    }
  }
}

/**
 * Set field to readOnly
 * @param formConfig form configuration
 * @param readOnly whether readOnly
 * @param ignoreArrays ignored fields
 */
export function readOnlyALLSet(formConfig: Record<string, any>, readOnly: boolean, ignoreArrays: string[]) {
  // Update readOnly attribute for corresponding ID in formConfig array
  for (const field of formConfig.value) {
    if (!ignoreArrays.includes(field.model)) {
      field.readOnly = readOnly
    }
  }
}

/**
 * Set field hide
 * @param formConfig form configuration
 * @param hide whether hidden
 * @param idsToUpdate fields to update
 */
export function hideALLSet(formConfig: Record<string, any>, hide: boolean, idsToUpdate: string[]) {
  // Update hide attribute for corresponding ID in formConfig array
  for (const field of formConfig.value) {
    if (idsToUpdate.includes(field.model)) {
      field.hide = hide
    }
  }
}

/**
 * Popup Title I18N
 * @param val title
 */
export function conventTitle(val: string) {
  let title: string
  if (val === 'ADD') {
    title = 'btn.new'
  } else if (val === 'UPDATE') {
    title = 'btn.update'
  } else if (val === 'UPLOAD') {
    title = 'btn.upload'
  } else if (val === 'IMPORT') {
    title = 'btn.import'
  } else if (val === 'LOAD') {
    title = 'btn.load'
  } else {
    title = 'btn.detail'
  }
  return title
}

export function valOrNA(val: string | number | null) {
  if (val === 0) {
    return val
  }
  return val !== null && val !== undefined && val != '' ? val : 'N/A'
}

// Reactive get time calculation function
export const useTimeCalculations = () => {
  const getStartDate = computed(() => {
    return DateTime.now().startOf('day').toFormat('yyyy-MM-dd HH:mm:ss')
  })

  const getEndDate = computed(() => {
    return DateTime.now().endOf('day').toFormat('yyyy-MM-dd HH:mm:ss')
  })

  return { getStartDate, getEndDate }
}

/**
 * Date object to date string
 * @param value date object to format
 * @param timeZone timezone
 * @param fmt output format, default yyyy-MM-dd                         Year: y, Month: M, Day: d, Hour: h, Minute: m, Second: s
 * @example  dateFormat(new Date())                               "2017-02-28"
 * @example  dateFormat(new Date(),'yyyy-MM-dd')                  "2017-02-28"
 * @example  dateFormat(new Date(),'yyyy-MM-dd HH:mm:ss')         "2017-02-28 09:24:00"
 * @example  dateFormat(new Date(),'hh:mm')                       "09:24"
 * @example  dateFormat(new Date(),'yyyy-MM-ddThh:mm:ss+08:00')   "2017-02-28T09:24:00+08:00"
 * @returns {string}
 */
export const dateFormat = (
  value: unknown,
  fmt: string = 'yyyy-MM-dd HH:mm:ss',
  timeZone: string = DateTime.local().zoneName
): string | null => {
  if (value == null || value === '') return null

  // 1. Create DateTime based on type
  let dt: DateTime
  if (typeof value === 'number') {
    // Assume input is second-level timestamp
    dt = DateTime.fromSeconds(value, { zone: timeZone })
  } else if (value instanceof Date) {
    dt = DateTime.fromJSDate(value, { zone: timeZone })
  } else if (typeof value === 'string') {
    // Try ISO 8601 first, then fallback to local parsing
    dt = DateTime.fromISO(value, { zone: timeZone })
    if (!dt.isValid) {
      dt = DateTime.fromJSDate(new Date(value.replace(/-/g, '/')), { zone: timeZone })
    }
  } else {
    // Other types, try toString then parse
    dt = DateTime.fromISO(String(value), { zone: timeZone })
  }

  // 2. Validate legitimacy
  if (!dt.isValid) return null

  // 3. Format output
  return dt.toFormat(fmt)
}

/**
 * base64 to file
 * @param urlData base64
 * @param fileName filename
 */
export const base64ToFile = (urlData: string, fileName: string) => {
  const arr = urlData.split(',')
  // Check if arr[0] exists
  if (arr.length < 2 || !arr[0]) {
    throw new Error('Invalid Base64 string')
  }
  if (!arr[1]) {
    return null
  }
  // Get MIME type
  const mimeRegex = /:(.*?);/
  const mimeMatch = mimeRegex.exec(arr[0])
  const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream' // Provide default MIME type
  const bytes = atob(arr[1]) // Decode base64
  let n = bytes.length
  const ia = new Uint8Array(n)
  while (n--) {
    ia[n] = bytes.charCodeAt(n)
  }
  return new File([ia], fileName, { type: mime })
}
/**
 * file to base64
 * @param file file
 */
export const fileToBase64 = (file: any): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return null
    }
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      if (reader.result) {
        // Return base64 encoded string, excluding prefix "data:image/png;base64,"
        resolve(reader.result.toString().split(',')[1])
      } else {
        resolve(null)
      }
    }
    reader.onerror = (err) => {
      reject(err)
    }
  })
}

export function isBaseI18nSelect(option: BaseI18nSelect | BaseSelect): option is BaseI18nSelect {
  return (option as BaseI18nSelect).i18nText !== undefined
}

/**
 * Get val corresponding to option
 * @param val value
 * @param options corresponding dropdown options
 */
export function getIssuerOptionsByValue(val: string, options: (BaseSelect | BaseI18nSelect)[] | undefined) {
  if (!options) {
    return 'N/A'
  }

  const option = options.find((item) => item.value == val)
  if (!option) {
    return 'N/A' // If no matching option found, return 'N/A'
  }

  return isBaseI18nSelect(option) ? i18n.global.t(option.i18nText) : option.text
}
/**
 * Get val corresponding to option
 * @param val value
 * @param options corresponding dropdown options
 */
export function getOptionsByValue(val: any, options: (BaseSelect | BaseI18nSelect)[] | undefined) {
  if (options === undefined || options === null || options.length === 0) {
    return 'N/A'
  }
  if (val === null || val === undefined || val === '') {
    return 'N/A'
  }

  const option = options.find((item) => item.value == val)
  if (!option) {
    return 'N/A' // If no matching option found, return 'N/A'
  }

  return isBaseI18nSelect(option) ? i18n.global.t(option.i18nText) : option.text
}

/**
 * Check if two values are consistent
 * @param afterValue after modification
 * @param beforeValue before modification
 */
export const isDifferent = (afterValue: string, beforeValue: string) => {
  return afterValue !== beforeValue
}
/**
 * Upload file
 * @param msgTypes img Type
 * @param fields form file fields
 * @param fieldIds form fileId fields
 * @param form corresponding form
 * @param formDetails details obtained from query
 */
export const uploadFile = async (
  msgTypes: string[],
  fields: string[],
  fieldIds: string[],
  form: Record<string, any>,
  formDetails: Record<string, any>
) => {
  const files: any[] = []
  const fileMappings: {
    field: string
    fieldId: string
    msgType: string
    originalId: string
    change: boolean
  }[] = []

  // Filter out unchanged files, and keep files with their corresponding fields and field IDs
  for (let i = 0; i < fields.length; i++) {
    const val = fields[i]
    const originalId = formDetails[fieldIds[i]]
    if (!form[val]) {
      continue
    }
    const fileBase64 = await fileToBase64(form[val])

    const hasChanged = fileBase64 !== formDetails[val]
    if (hasChanged) {
      // File updated, save file and record
      files.push(form[val])
    }

    fileMappings.push({
      field: val,
      fieldId: fieldIds[i],
      msgType: msgTypes[i],
      originalId,
      change: hasChanged
    })
    form[fieldIds[i]] = formDetails[fieldIds[i]]
  }

  if (files.length === 0) {
    // If no files to upload, return original form directly
    return form
  }

  const formData = new FormData()

  // Add bizTypes parameter, for files that actually need uploading
  for (const mapping of fileMappings) {
    if (mapping.change) {
      formData.append('msgTypes', mapping.msgType)
    }
  }

  // Add file
  for (const file of files) {
    formData.append('files', file)
  }

  // Execute upload operation
  try {
    const uploadResult = await apiUtil.post('/upload-multi', formData, { 'content-type': 'multipart/form-data' }, true)
    if (!uploadResult.success || uploadResult.code != '0000') {
      await swalMessage.error(uploadResult.message)
      return new Error(uploadResult.message)
    }
    // Update form fields using uploadResult.data index
    for (const mapping of fileMappings) {
      if (mapping.change) {
        // If new file uploaded, use new file ID
        for (const val of uploadResult.data) {
          if (val.msgType == mapping.msgType) {
            form[mapping.fieldId] = val.fileId
          }
        }
      } else {
        // Otherwise continue using original ID
        form[mapping.fieldId] = mapping.originalId
      }
    }

    return form
  } catch (error) {
    console.error('文件上传失败', error)
    throw new Error('上传文件时发生错误')
  }
}

/**
 * Generate password
 * @param min min length
 * @param max max length
 * @param contentRules content rules, format: '0,1,2,3' (0=digit, 1=uppercase, 2=lowercase, 3=special symbol)
 */
export function createPd(min: number, max: number, contentRules: string) {
  console.log('createPd Parameters:', { min, max, contentRules })

  // Define character set
  const num = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  const english = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
  ]
  const ENGLISH = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
  ]
  const special = ['!', '@', '#', '$', '%', '^', '&', '*', '_', '-']

  // Parse content rules
  const rules = new Set(contentRules.split(',').map((rule) => rule.trim()))

  // Check required character types
  const needsNumbers = rules.has('0')
  const needsUppercase = rules.has('1')
  const needsLowercase = rules.has('2')
  const needsSpecial = rules.has('3')

  // Check disallowed character types
  const notAllowNumbers = !needsNumbers
  const notAllowUppercase = !needsUppercase
  const notAllowLowercase = !needsLowercase
  const notAllowSpecial = !needsSpecial

  let password = ''
  const maxTries = 1000
  let tries = 0

  while (tries < maxTries) {
    const arr: string[] = []

    // Decide length to generate
    const len = min + Math.floor(Math.random() * (max - min + 1))

    // Ensure at least one of each allowed character type is included
    if (needsNumbers) {
      arr.push(num[Math.floor(Math.random() * num.length)])
    }
    if (needsLowercase) {
      arr.push(english[Math.floor(Math.random() * english.length)])
    }
    if (needsUppercase) {
      arr.push(ENGLISH[Math.floor(Math.random() * ENGLISH.length)])
    }
    if (needsSpecial) {
      arr.push(special[Math.floor(Math.random() * special.length)])
    }

    // Build complete character set (only containing allowed character types)
    let allChars: string[] = []
    if (needsNumbers) allChars = allChars.concat(num)
    if (needsLowercase) allChars = allChars.concat(english)
    if (needsUppercase) allChars = allChars.concat(ENGLISH)
    if (needsSpecial) allChars = allChars.concat(special)

    // If no specific requirements, use all characters
    if (allChars.length === 0) {
      allChars = [...num, ...english, ...ENGLISH, ...special]
    }

    // Fill remaining length
    const remainingLength = len - arr.length
    for (let i = 0; i < remainingLength; i++) {
      arr.push(allChars[Math.floor(Math.random() * allChars.length)])
    }

    // Shuffle array
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }

    password = arr.join('')

    // Validate if password meets rules
    let isValid = true

    // Check required character types
    if (needsNumbers && !/\d/.test(password)) isValid = false
    if (needsLowercase && !/[a-z]/.test(password)) isValid = false
    if (needsUppercase && !/[A-Z]/.test(password)) isValid = false
    if (needsSpecial && !/[!@#$%^&*_-]/.test(password)) isValid = false

    // Check disallowed character types
    if (notAllowNumbers && /\d/.test(password)) isValid = false
    if (notAllowLowercase && /[a-z]/.test(password)) isValid = false
    if (notAllowUppercase && /[A-Z]/.test(password)) isValid = false
    if (notAllowSpecial && /[!@#$%^&*_-]/.test(password)) isValid = false

    // Check length
    if (password.length < min || password.length > max) isValid = false

    if (isValid) {
      console.log('Generated password:', password)
      return password
    }

    tries++
  }

  console.error('Unable to generate a valid password after ' + maxTries + ' tries.')
  return ''
}

/**
 * Encrypt password
 * @param account account
 * @param password password
 * @param hashAlgorithm algorithm
 */
export function encryptPd(account: string, password: string, hashAlgorithm: 'SHA-256' | 'SHA-1') {
  let encrypt = ''
  if (account === '' || password === '') {
    return encrypt
  }

  if (hashAlgorithm === 'SHA-256') {
    encrypt = sha256(account + password)
  } else if (hashAlgorithm === 'SHA-1') {
    encrypt = sha1(account + password)
  }

  return encrypt
}

/**
 * Login usage, encryption function
 * @param random8digits random 8 digits
 * @param account account
 * @param password password
 * @param hashAlgorithm algorithm
 */
export function encrypt(random8digits: string, account: string, password: string, hashAlgorithm: string) {
  let encrypt = ''
  if (account === '' || password === '') {
    return encrypt
  }
  if (hashAlgorithm === 'SHA-256') {
    const sha = sha256(account + password)
    encrypt = sha256(random8digits + sha)
  } else if (hashAlgorithm === 'SHA-1') {
    const sha = sha1(account + password)
    encrypt = sha1(random8digits + sha)
  }

  return encrypt
}

/**
 * Process password
 * @param str mask character
 * @param pwd password
 */
export function handlePwd(str: string, pwd: string) {
  if (!pwd) {
    return 'N/A'
  }
  let result = ''
  const length = pwd.length
  for (let i = 0; i < length; i++) {
    result += str
  }
  return result
}

/**
 * Format amount
 * @param {number} amount - Amount (integer part)
 * @param {number} exponent - Decimal places
 * @returns {string} Formatted amount
 */
export function formatAmount(amount: number, exponent: number) {
  // Calculate actual amount
  const actualAmount = amount / Math.pow(10, exponent)
  // Return formatted amount, keeping specified decimal places
  return actualAmount.toFixed(exponent)
}
