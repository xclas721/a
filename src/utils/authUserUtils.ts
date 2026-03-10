import { userStateStore } from '@/stores/user'
import ApiUtil from '@/utils/apiUtils'

export async function login(loginForm: Record<string, any>, organ: string): Promise<Record<string, any>> {
  const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
  const result = await apiUtil.post(`/${organ}/index/login-submit`, loginForm, {}, false)

  return result
}

export async function loginFido(loginForm: Record<string, any>, organ: string): Promise<Record<string, any>> {
  const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
  const qs = new URLSearchParams()
  qs.set('challenge', loginForm.challenge ?? '')
  qs.set('userName', loginForm.account ?? '')
  if (loginForm.bankId) qs.set('bankId', loginForm.bankId)
  if (loginForm.isFailure) qs.set('isFailure', 'true')

  const result = await apiUtil.post(`/${organ}/index/fido-login-submit?${qs.toString()}`, loginForm, {}, false)

  return result
}

export function logout() {
  const userState = userStateStore()
  userState.resetState()
}
