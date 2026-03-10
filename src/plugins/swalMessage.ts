import Swal, { type SweetAlertOptions } from 'sweetalert2'
import i18n from '@/locales/index'

/**
 * 成功 / 錯誤 / 警告 / 提示 使用準則：
 * - success：操作完成、API 成功（如儲存成功、刪除成功）
 * - error：API 失敗、驗證失敗、例外（如網路錯誤、必填未填、後端回傳錯誤）
 * - warning：需注意但非錯誤（如後端回傳業務警示、即將過期、待覆核提醒）
 * - info：一般說明、中性資訊（如操作說明、提示文字）
 * - confirm：需使用者二選一（確定/取消）的操作確認（如刪除前確認）
 */
/** Shared SweetAlert2 options: 按鈕使用企業色 (btn-primary / btn-outline-primary) */
const DEFAULT_OPTIONS = {
  heightAuto: false,
  buttonsStyling: false,
  customClass: {
    confirmButton: 'btn btn-primary',
    cancelButton: 'btn btn-outline-primary'
  }
} as SweetAlertOptions

/** Confirm button text for alerts (OK / 確定) */
const CONFIRM_LABEL = () => i18n.global.t('btn.ok')

export default {
  /** 成功：操作完成、API 成功（標題「成功」） */
  success(msg: string = '', title: string = i18n.global.t('ui.message.success')) {
    return Swal.fire({
      ...DEFAULT_OPTIONS,
      title,
      text: msg,
      icon: 'success',
      confirmButtonText: CONFIRM_LABEL(),
      timer: 3000
    })
  },

  /** 錯誤：API 失敗、驗證失敗、例外（標題「錯誤」） */
  error(msg: string = '', title: string = i18n.global.t('ui.message.error'), callback: () => void = () => {}) {
    return Swal.fire({
      ...DEFAULT_OPTIONS,
      title,
      text: msg,
      icon: 'error',
      confirmButtonText: CONFIRM_LABEL()
    }).then((result) => {
      if (result.isConfirmed) {
        callback()
      }
    })
  },

  /** 警告：需注意但非錯誤，如業務警示、待覆核提醒（標題「警告」） */
  warning(msg: string = '', title: string = i18n.global.t('ui.message.warn')) {
    return Swal.fire({
      ...DEFAULT_OPTIONS,
      title,
      text: msg,
      icon: 'warning',
      confirmButtonText: CONFIRM_LABEL()
    })
  },

  /** 提示：一般說明、中性資訊（標題「提示」） */
  info(msg: string = '', title: string = i18n.global.t('ui.message.info')) {
    return Swal.fire({
      ...DEFAULT_OPTIONS,
      title,
      text: msg,
      icon: 'info',
      confirmButtonText: CONFIRM_LABEL(),
      timer: 3000
    })
  },

  /** 詢問：問號圖示，一般說明用（標題「提示」） */
  question(msg: string = '', title: string = i18n.global.t('ui.message.info')) {
    return Swal.fire({
      ...DEFAULT_OPTIONS,
      title,
      text: msg,
      icon: 'question',
      confirmButtonText: CONFIRM_LABEL(),
      timer: 3000
    })
  },

  /** 操作確認：確定/取消二選一（標題「操作確認」） */
  confirm(msg: string = '', title: string = i18n.global.t('ui.message.confirm'), callback: () => void) {
    const titleText = title || i18n.global.t('ui.message.confirm')
    return Swal.fire({
      ...DEFAULT_OPTIONS,
      title: titleText,
      icon: 'warning',
      text: msg,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: i18n.global.t('btn.ok'),
      cancelButtonText: i18n.global.t('btn.cancel')
    }).then((result) => {
      if (result.isConfirmed) {
        callback()
      }
    })
  },

  /**
   * Custom alert with optional html/width. Pass-through to Swal.fire with i18n confirmButtonText and default title.
   */
  fire(options: SweetAlertOptions) {
    return Swal.fire({
      ...DEFAULT_OPTIONS,
      ...options,
      title: options.title ?? i18n.global.t('ui.message.info'),
      confirmButtonText: options.confirmButtonText ?? CONFIRM_LABEL()
    } as SweetAlertOptions)
  }
}
