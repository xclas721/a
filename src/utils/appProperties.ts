import { DateTime } from 'luxon'

const supportLocale = [
  { label: '繁體中文', value: 'zh-TW', backendValue: 'zh_TW' },
  { label: '简体中文', value: 'zh-CN', backendValue: 'zh_CN' },
  { label: 'English', value: 'en-US', backendValue: 'en-US' },
  { label: 'Tiếng Việt', value: 'vi-VN', backendValue: 'vi_VN' }
]

export function getSupportLocaleList() {
  // label: dropdown menu display name
  // value: dropdown menu display value
  // backendValue: springboot, vue-i18n corresponding file

  return supportLocale
}

// Check Locale, return locale in support list
export function getLocaleValue(localeValue: string) {
  // Handle 'en' language
  if (localeValue === 'en') {
    return 'en-US'
  }

  const retrunLocale = supportLocale.find((item) => item.value === localeValue)
  return retrunLocale ? retrunLocale.value : 'en-US'
}
// Check Locale, return backend locale in support list
export function getLocaleBackendValue(localeValue: string) {
  const retrunLocale = supportLocale.find((item) => item.value === localeValue)
  return retrunLocale ? retrunLocale.backendValue : 'en-US'
}

export function getLocaleLabel(localeValue: string) {
  const retrunLocale = supportLocale.find((item) => item.value === localeValue)
  return retrunLocale ? retrunLocale.label : 'English'
}
export function getTimezoneList() {
  // value corresponds to springboot timezone, add current existing client timezones first
  // DateTimeFormatter formatter = DateTimeFormatter.ofPattern("O");
  //       ZoneId.getAvailableZoneIds().stream()
  //           .sorted()
  //           .forEach(zoneId -> {
  //               ZonedDateTime now = ZonedDateTime.now(ZoneId.of(zoneId));
  //               String offset = now.format(formatter);
  //               System.out.println(zoneId + " -> " + offset);
  //           });

  // 時區列表，依照IANA時區列表
  const zoneValues = [
    { label: 'Asia/Singapore', value: 'Asia/Singapore' },
    { label: 'Asia/Hong_Kong', value: 'Asia/Hong_Kong' },
    { label: 'Asia/Shanghai', value: 'Asia/Shanghai' },
    { label: 'Asia/Taipei', value: 'Asia/Taipei' },
    { label: 'Asia/Jakarta', value: 'Asia/Jakarta' },
    { label: 'Asia/Bangkok', value: 'Asia/Bangkok' },
    { label: 'Asia/Ho_Chi_Minh', value: 'Asia/Ho_Chi_Minh' },
    { label: 'Asia/Phnom_Penh', value: 'Asia/Phnom_Penh' },
    { label: 'Asia/Aqtobe', value: 'Asia/Aqtobe' },
    { label: 'Europe/Rome', value: 'Europe/Rome' },
    { label: 'Europe/London', value: 'Europe/London' },
    { label: 'America/Los_Angeles', value: 'America/Los_Angeles' },
    { label: 'New Zealand/Auckland', value: 'Pacific/Auckland' },
    { label: 'Australia/Sydney', value: 'Australia/Sydney' }
  ]

  // 格式化時區偏移，解決部分地區(如羅馬時區，美國洛杉磯時區)，夏令/冬令時間問題
  const formatOffset = (offsetMinutes: number) => {
    const sign = offsetMinutes >= 0 ? '+' : '-'
    const absMinutes = Math.abs(offsetMinutes)
    const hours = Math.floor(absMinutes / 60)
      .toString()
      .padStart(2, '0')
    const minutes = (absMinutes % 60).toString().padStart(2, '0')
    return `UTC${sign}${hours}:${minutes}`
  }

  // 回傳時區列表
  return zoneValues.map(({ label, value }) => {
    const offsetMinutes = DateTime.now().setZone(value).offset
    return {
      label: `${label}(${formatOffset(offsetMinutes)})`,
      value
    }
  })
}
