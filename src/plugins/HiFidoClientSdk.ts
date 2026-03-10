import { ref } from 'vue'
import ApiUtil from '@/utils/apiUtils'
import i18n from '@/locales'

// Error message handling function
function getErrorMessage(key: string, variables?: Record<string, any>): string {
  return variables ? i18n.global.t(key, variables) : i18n.global.t(key)
}
export const challengeValue = ref('')
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const deviceName = ref('')
export function useDevice() {
  return { deviceName }
}

const FC_ERR_ATTESTATION_CREATE = 1003
const FC_ERR_ATTESTATION_RESULT_CANCEL = 1004
const FC_ERR_ATTESTATION_RESULT_NETWORK = 1006
const FC_ERR_ASSERTION_OPTIONS_STATUS = 1007
const FC_ERR_ASSERTION_OPTIONS_NETWORK = 1008
const FC_ERR_ASSERTION_OPTIONS_NO_DEVICE = 1009
const FC_ERR_ASSERTION_GET = 1010
const FC_ERR_ASSERTION_RESULT_CANCEL = 1011
const FC_ERR_ASSERTION_RESULT_NETWORK = 1013
const FC_ERR_USERNAME_INVALID = 1014
const FC_ERR_FIDO_DISABLE = 1040
// passkey
const FC_ERR_ASSERTION_PASSKEY = 1025

/*
 * Function : Read device type
 * Input : None
 * Output : deviceType
 */
function getDeviceType(deviceName: string) {
  if (deviceName) {
    return deviceName
  }

  const str = globalThis.navigator.userAgent

  if (str.includes('Win')) return 'Windows'
  else if (str.includes('iPhone')) return 'iPhone'
  else if (str.includes('iPad')) return 'iPad'
  else if (str.includes('Android')) return 'Android'
  else if (str.includes('Mac') || str.includes('Apple')) return 'Mac'
  else if (str.includes('Linux')) return 'Linux'
  else return 'Unknown'
}

/*
 * Function : Base64 -> ArrayBuffer
 * Input : base64
 * Output :
 */
function base64ToArrayBuffer(base64: any) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  const lookup = new Uint8Array(256)
  for (let i = 0; i < chars.length; i++) {
    lookup[chars.codePointAt(i)!] = i
  }

  const bufferLength = base64.length * 0.75,
    len = base64.length
  let p = 0,
    encoded1,
    encoded2,
    encoded3,
    encoded4

  const arraybuffer = new ArrayBuffer(bufferLength),
    bytes = new Uint8Array(arraybuffer)

  for (let j = 0; j < len; j += 4) {
    encoded1 = lookup[base64.codePointAt(j)!]
    encoded2 = lookup[base64.codePointAt(j + 1)!]
    encoded3 = lookup[base64.codePointAt(j + 2)!]
    encoded4 = lookup[base64.codePointAt(j + 3)!]

    bytes[p++] = (encoded1 << 2) | (encoded2 >> 4)
    bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2)
    bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63)
  }

  return arraybuffer
}

/*
 * Function : ArrayBuffer -> Base64
 * Input :
 * Output :
 */
function arrayBufferToBase64(arrayBuffer: any) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  const bytes = new Uint8Array(arrayBuffer),
    len = bytes.length
  let i,
    base64 = ''

  for (i = 0; i < len; i += 3) {
    base64 += chars[bytes[i] >> 2]
    base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)]
    base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)]
    base64 += chars[bytes[i + 2] & 63]
  }

  if (len % 3 === 2) {
    base64 = base64.substring(0, base64.length - 1)
  } else if (len % 3 === 1) {
    base64 = base64.substring(0, base64.length - 2)
  }

  return base64
}

/*
 * Function : Register options
 * Input : serverUrl - HiFIDO server location
 *       systemId - System Id
 *       username - User Name
 *       displayName - User Name
 *       useToken - Use FIDO token, or use built-in biometrics
 */
async function attestationOptions(
  serverUrl: string,
  systemId: string,
  username: string,
  displayName: string,
  extensions: any,
  useToken: boolean,
  deviceName: string,
  isPaymentFromRp: boolean,
  dsn: string
) {
  console.log('attestationOptions')
  let actExtensions: Record<string, string> = {}
  if (extensions !== null && extensions !== undefined) {
    actExtensions = extensions
  }
  actExtensions.systemId = systemId
  actExtensions.deviceType = useToken ? 'Token' : getDeviceType(deviceName)
  return new Promise((resolve, reject) => {
    const payload = {
      isPaymentFromRp: isPaymentFromRp,
      username: username,
      displayName: displayName,
      attestation: 'direct',
      extensions: actExtensions,
      dsn: dsn
    }
    console.log('payload:' + JSON.stringify(payload))
    // Connect to RP
    // fetch(serverUrl + '/fido2/attestation/options', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(payload)
    // })
    apiUtil
      .post('/fido2/attestation/options', JSON.stringify(payload), {}, false)
      .then((response) => {
        console.log('response.ok = ' + response.status)
        // console.log('response.statusText = ' + response.statusText)

        if (!response.status) throw new Error(response.statusText)
        // return response.json()
        return response
      })
      .then((jsonData) => {
        console.log('attestationOptions jsonData:' + JSON.stringify(jsonData))
        if (jsonData.status === 'ok') {
          const resultObject = {
            data: jsonData,
            deviceId: '',
            gCookie: ''
          }
          if (jsonData.headers !== null) {
            for (const entry of jsonData.headers.entries()) {
              for (const key in entry) {
                const jsonObject = entry[key]
                if (jsonObject['Set-Cookie'] != null) {
                  resultObject.gCookie = jsonObject['Set-Cookie']
                }
              }
            }
          }
          resolve(resultObject)
        } else {
          if (jsonData.returnCode === 1001) {
            console.log('Original Error: Registration failed: (Username is duplicated)')
            reject(getErrorMessage('fido.error.ERROR0001'))
          } else {
            console.log(
              'Original Error: Registration failed:' + jsonData.errorMessage + '(' + jsonData.returnCode + ')'
            )
            reject(
              getErrorMessage('fido.error.ERROR0002', {
                errorMessage: jsonData.errorMessage,
                returnCode: jsonData.returnCode
              })
            )
          }
        }
      })
      .catch(() => {
        console.log('attestationOptions error')
        console.log(
          'Original Error: Registration failed: Please check the network connection status or try again later.'
        )
        reject(getErrorMessage('fido.error.ERROR0003'))
      })
    console.log('attestationOptions end...')
  })
}

/*
 * Function : webAuth Register
 * Input : resolve, reject -
 *       serverUrl - HiFIDO server location
 *       systemId - System Id
 *       username - User Name
 *       displayName - User Name
 *       useToken - Use FIDO token, or use built-in biometrics
 *       useTokenPwd - Use FIDO token requires password
 *       resultObject - Response result of attestationOptions
 */
async function makeCredentials(
  resolve: any,
  reject: any,
  serverUrl: string,
  systemId: string,
  username: string,
  displayName: string,
  useToken: boolean,
  useTokenPwd: boolean,
  isPayment: boolean,
  resultObject: any,
  dsn: string
) {
  console.log('makeCredentials')
  const id = Uint8Array.from(window.btoa(username), (c) => c.charCodeAt(0))
  console.log('resultObject.data.challenge : ' + resultObject.data.challenge)
  console.log('resultObject.data.rp.id : ' + resultObject.data.rp.id)
  console.log('resultObject.data.rp.name : ' + resultObject.data.rp.name)
  console.log('resultObject.data.rpTxId : ' + resultObject.data.rpTxId)
  console.log('resultObject.data.txId : ' + resultObject.data.txId)
  let publicKeyCredentialCreationOptions: any = null
  publicKeyCredentialCreationOptions = {
    attestation: 'direct',
    authenticatorSelection: {
      requireResidentKey: true,
      residentKey: 'required',
      userVerification: 'required',
      authenticatorAttachment: useToken ? 'cross-platform' : 'platform'
    },
    challenge: base64ToArrayBuffer(resultObject.data.challenge),
    excludeCredentials: [],
    pubKeyCredParams: [
      {
        alg: -7,
        type: 'public-key'
      },
      {
        alg: -257,
        type: 'public-key'
      }
    ],
    rp: {
      id: resultObject.data.rp.id,
      name: resultObject.data.rp.name
    },
    timeout: resultObject.data.timeout,
    user: {
      id: id,
      name: username,
      displayName: displayName
    }
  }
  if (isPayment) {
    publicKeyCredentialCreationOptions.extensions = {
      payment: {
        isPayment: true
      }
    }
    publicKeyCredentialCreationOptions.authenticatorSelection.residentKey = 'preferred'
    publicKeyCredentialCreationOptions.attestation = 'none'
  }
  console.log('publicKeyCredentialCreationOptions = ' + JSON.stringify(publicKeyCredentialCreationOptions))
  try {
    console.log('credential create...')
    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions
    })
    console.log('credential = ' + JSON.stringify(credential))
    if (credential !== undefined && credential !== null) {
      console.log('attestationResult send...')
      attestationResult(
        serverUrl,
        credential,
        systemId,
        username,
        displayName,
        useToken,
        useTokenPwd,
        resultObject.gCookie,
        isPayment,
        resultObject.data.rpTxId,
        resultObject.data.txId,
        dsn
      ).then(
        () => {
          console.log('Registration successful')
          resolve('Registration successful')
        },
        (errorMsg) => {
          console.log('Registration failed, errorMsg:' + errorMsg)
          console.log('Original Error: Registration failed: (' + errorMsg + ')')
          reject(getErrorMessage('fido.error.ERROR0004', { errorMsg: errorMsg }))
        }
      )
    } else {
      console.log('Original Error: Registration failed: (' + FC_ERR_ATTESTATION_CREATE + ')')
      reject(getErrorMessage('fido.error.ERROR0005', { errorCode: FC_ERR_ATTESTATION_CREATE }))
    }
  } catch (exception: any) {
    console.log(exception)
    // Check if user cancelled operation (NotAllowedError)
    const isNotAllowedError =
      exception?.name === 'NotAllowedError' ||
      exception?.message?.includes('NotAllowedError') ||
      exception?.message?.includes('operation') ||
      exception?.message?.includes('timeout') ||
      exception?.message?.includes('not allowed')

    if (isNotAllowedError) {
      if (getDeviceType('') === 'Windows') {
        console.log(
          'Original Error: Registration failed: Operation cancelled, or start Windows Hello service and try again. (' +
            FC_ERR_ATTESTATION_RESULT_CANCEL +
            ')'
        )
        reject(getErrorMessage('fido.error.ERROR0006', { errorCode: FC_ERR_ATTESTATION_RESULT_CANCEL }))
      } else {
        console.log(
          'Original Error: Registration failed: Operation cancelled (' + FC_ERR_ATTESTATION_RESULT_CANCEL + ')'
        )
        reject(getErrorMessage('fido.error.ERROR0007', { errorCode: FC_ERR_ATTESTATION_RESULT_CANCEL }))
      }
    } else {
      // Other error types
      const errorMsg = exception?.message || String(exception)
      console.log('Original Error: Registration failed: (' + errorMsg + ')')
      reject(getErrorMessage('fido.error.ERROR0004', { errorMsg: errorMsg }))
    }
  }
}

/*
 * Function : Register result
 * Input : serverUrl - HiFIDO server location
 *       systemId - System Id
 *       credential -
 *       username - User Name
 *       displayName - User Name
 *       useToken - Use FIDO token, or use built-in biometrics
 *       useTokenPwd - Use FIDO token requires password
 *       gCookie - Connection record of attestationOptions
 * Output :
 */
function attestationResult(
  serverUrl: string,
  credential: any,
  systemId: string,
  username: string,
  displayName: string,
  useToken: boolean,
  useTokenPwd: boolean,
  gCookie: any,
  isPayment: boolean,
  rpTxId: string,
  txId: string,
  dsn: string
) {
  console.log('attestationResult')
  return new Promise((resolve, reject) => {
    const credentialId = credential === null ? '' : arrayBufferToBase64(credential.rawId)
    const clientDataJSON = credential === null ? '' : arrayBufferToBase64(credential.response.clientDataJSON)
    const attestationObject = credential === null ? '' : arrayBufferToBase64(credential.response.attestationObject)
    const payload = {
      isPayment: isPayment,
      isPaymentFromRp: isPayment,
      rpTxId: rpTxId,
      txId: txId,
      id: credentialId,
      type: credential.type,
      response: {
        clientDataJSON: clientDataJSON,
        attestationObject: attestationObject
      },
      systemId: systemId,
      username: username,
      displayName: displayName,
      password: '',
      fido2Auth: useToken,
      fido2AuthPwd: useTokenPwd,
      dsn: dsn
    }
    console.log('attestationResult payload:' + JSON.stringify(payload))
    // Connect to RP
    const headers = {
      'Content-Type': 'application/json',
      AuthToken: gCookie
    }
    // fetch(serverUrl + '/fido2/attestation/result', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'AuthToken': gCookie
    //     },
    //     body: JSON.stringify(payload)
    // })
    apiUtil
      .post('/fido2/attestation/result', JSON.stringify(payload), headers, false)
      .then((response) => {
        if (!response.status) throw new Error(response.statusText)
        return response
      })
      .then((jsonData) => {
        console.log('attestationResult jsonData:' + JSON.stringify(jsonData))
        if (jsonData.status === 'ok') {
          console.log('[attestation/result]: ' + jsonData.status)
          resolve(jsonData)
        } else {
          //reject(FC_ERR_ATTESTATION_RESULT_STATUS, 'Registration failed (' + FC_ERR_ATTESTATION_RESULT_STATUS + ')');
          console.log(
            'Original Error: Registration failed: ' + jsonData.errorMessage + '(' + jsonData.returnCode + ') '
          )
          reject(
            getErrorMessage('fido.error.ERROR0008', {
              errorMessage: jsonData.errorMessage,
              returnCode: jsonData.returnCode
            })
          )
        }
      })
      .catch(() => {
        console.log(
          'Original Error: Registration failed: Please check the network connection status or try again later. (' +
            FC_ERR_ATTESTATION_RESULT_NETWORK +
            ')'
        )
        reject(getErrorMessage('fido.error.ERROR0009', { errorCode: FC_ERR_ATTESTATION_RESULT_NETWORK }))
      })
  })
}

/*
 * Function : FIDO Authentication
 * Input : * serverUrl - HiFIDO server location
 *       * systemId - System Id
 *       * username - User Name
 *       deviceType - Device Type
 *       extensions - Extension data
 * Output : resolve -> userData User Data
 *       reject -> errorMsg Error Message
 */
export function HiFidoAssertion(
  serverUrl: string,
  systemId: string,
  username: string,
  deviceType: string,
  extensions: any,
  dsn: string
) {
  return new Promise((resolve, reject) => {
    // General
    if (username !== null && username !== '') {
      assertionOptions(serverUrl, systemId, username, deviceType, extensions, null, dsn).then(
        (jsonData) => {
          resolve(jsonData)
        },
        (errorMsg) => {
          reject(errorMsg)
        }
      )
    }
    //Passkey
    else {
      assertionOptionsPasskey(serverUrl, systemId, deviceType, extensions, '', null, dsn).then(
        (jsonData) => {
          console.log('[assertionOptionsPasskey success!]: ' + JSON.stringify(jsonData, null, 2))
          assertionPasskey(jsonData.challenge).then(
            (credential) => {
              console.log('[assertionPasskey success!]: ' + JSON.stringify(credential, null, 2))
              const sessionId = jsonData.challenge
              assertionResult(
                resolve,
                reject,
                serverUrl,
                systemId,
                extensions,
                jsonData,
                sessionId,
                credential,
                true,
                username,
                dsn
              ).then(
                (jsonData) => {
                  console.log('[Passkey assertionResult success!]: ' + JSON.stringify(jsonData, null, 2))
                  resolve(jsonData)
                },
                (errorMsg) => {
                  reject(errorMsg)
                }
              )
            },
            (errorMsg) => {
              reject(errorMsg)
            }
          )
        },
        (errorMsg) => {
          reject(errorMsg)
        }
      )
    }
  })
}

export function HiFidoAssertionByPassKey(
  serverUrl: string,
  systemId: string,
  username: string,
  deviceType: string,
  extensions: any,
  dsn: string
) {
  return new Promise((resolve, reject) => {
    assertionOptionsPasskey(serverUrl, systemId, deviceType, extensions, username, null, dsn).then(
      (jsonData) => {
        assertionPasskey(jsonData.challenge).then(
          (credential) => {
            const sessionId = jsonData.challenge
            assertionResult(
              resolve,
              reject,
              serverUrl,
              systemId,
              extensions,
              jsonData,
              sessionId,
              credential,
              false,
              username,
              dsn
            ).then(
              (jsonData) => {
                console.log('[Passkey assertionResult success!]: ' + JSON.stringify(jsonData, null, 2))
                resolve(jsonData)
              },
              (errorMsg) => {
                reject(errorMsg)
              }
            )
          },
          (errorCode) => {
            reject(errorCode)
          }
        )
      },
      (errorCode) => {
        reject(errorCode)
      }
    )
  })
}

interface AssertionOptionsResponse {
  status?: string
  errorMessage?: string
  timeout?: number
  returnCode?: string
  challenge?: string
  extensions?: any
  userVerification?: string
  rpId?: string
  allowCredentials?: any
  headers?: any
  rpTxId?: string
  txId?: string
}

/*
 * Function : Authentication options for Passkey
 * Input : serverUrl - HiFIDO server location
 *       systemId - System Id
 *       deviceType - Device Type, Windows/Mac/Token
 *       extensions - Extension data
 */
function assertionOptionsPasskey(
  serverUrl: string,
  systemId: string,
  deviceType: string,
  extensions: any,
  username: string,
  credential: any,
  dsn: string
): Promise<AssertionOptionsResponse> {
  console.log('[assertionOptionsPasskey!]:')
  if (deviceType === null || deviceType === undefined || deviceType === '') {
    deviceType = getDeviceType('windows-HP-op1-hosted')
    // deviceType = getDeviceType('')
  }
  console.log('[deviceType!]:' + deviceType)
  let actExtensions: Record<string, string> = {}
  if (extensions !== null && extensions !== undefined) {
    actExtensions = extensions
  }
  actExtensions.systemId = systemId
  actExtensions.deviceType = deviceType
  return new Promise((resolve, reject) => {
    const payload = {
      username: username,
      extensions: actExtensions,
      dsn: dsn
    }
    if (credential !== null && credential !== undefined) {
      payload.extensions.credentialsId = credential.id
    }
    console.log('[assertionOptionsPasskey!][payload]: :' + JSON.stringify(payload, null, 2))
    // fetch(serverUrl + '/fido2/assertion/options', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(payload)
    // })
    apiUtil
      .post('/fido2/assertion/options', JSON.stringify(payload), {}, false)
      // .then((response) => response.json())
      .then((jsonData) => {
        if (jsonData.status === 'ok') {
          resolve(jsonData)
        } else {
          let errorMessage = jsonData.errorMessage
          let retCode = FC_ERR_ASSERTION_OPTIONS_STATUS
          if (jsonData.returnCode !== null && jsonData.returnCode !== undefined) {
            const returnCode = jsonData.returnCode
            if (returnCode === '1007') {
              retCode = FC_ERR_ASSERTION_OPTIONS_NO_DEVICE
              errorMessage = 'There is no corresponding device information.'
            } else if (returnCode === '9996') {
              retCode = FC_ERR_ASSERTION_OPTIONS_NETWORK
              errorMessage = 'Server exception, please try again later.'
            } else if (returnCode === '1040') {
              retCode = FC_ERR_FIDO_DISABLE
            }
          }
          console.log('Original Error: Authentication failed: ' + errorMessage + ' (' + retCode + ')')
          if (retCode === FC_ERR_FIDO_DISABLE) {
            reject(getErrorMessage('fido.error.ERROR0040', { errorCode: retCode }))
          } else {
            reject(
              getErrorMessage('fido.error.ERROR0010', {
                errorMessage: errorMessage,
                retCode: retCode
              })
            )
          }
        }
      })
      .catch(() => {
        console.log(
          'Original Error: Authentication failed: Please check the network connection status or try again later. (' +
            FC_ERR_ASSERTION_OPTIONS_NETWORK +
            ')'
        )
        reject(getErrorMessage('fido.error.ERROR0011', { errorCode: FC_ERR_ASSERTION_OPTIONS_NETWORK }))
      })
  })
}

/*
 * Function : Get existing credentialsId to lookup corresponding username
 * Input : serverUrl - HiFIDO server location
 *       systemId - System Id
 *       challenge -
 * Output : resolve ->
 *       reject -> errorCode Error Code
 */
async function assertionPasskey(challenge: any) {
  const publicKeyCredentialRequestOptions = {
    challenge: base64ToArrayBuffer(challenge),
    // rpId: rpId,
    userVerification: 'required' as const
  }
  try {
    const credential = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions
    })
    if (credential !== undefined && credential !== null) {
      return credential
    } else {
      console.log('Original Error: Passkey authentication failed:  (' + FC_ERR_ASSERTION_PASSKEY + ')')
      throw getErrorMessage('fido.error.ERROR0012', { errorCode: FC_ERR_ASSERTION_PASSKEY })
    }
  } catch (exception: any) {
    // Check if user cancelled operation (NotAllowedError)
    const isNotAllowedError =
      exception?.name === 'NotAllowedError' ||
      exception?.message?.includes('NotAllowedError') ||
      exception?.message?.includes('operation') ||
      exception?.message?.includes('timeout') ||
      exception?.message?.includes('not allowed')

    if (isNotAllowedError) {
      console.log('Original Error: Authentication failed: Operation cancelled (' + FC_ERR_ASSERTION_RESULT_CANCEL + ')')
      throw getErrorMessage('fido.error.ERROR0032', { errorCode: FC_ERR_ASSERTION_RESULT_CANCEL })
    } else {
      console.log('Original Error: Passkey authentication failed:  (' + FC_ERR_ASSERTION_PASSKEY + ')')
      throw getErrorMessage('fido.error.ERROR0013', { errorCode: FC_ERR_ASSERTION_PASSKEY })
    }
  }
}

/*
 * Function : Authentication options
 * Input : serverUrl - HiFIDO server location
 *       systemId - System Id
 *       username - User Name
 *       deviceType - Device Type, Windows/Mac/Token
 *       extensions - Extension data
 *       credential -
 */
function assertionOptions(
  serverUrl: string,
  systemId: string,
  username: string,
  deviceType: string,
  extensions: any,
  credential: any,
  dsn: string
) {
  console.log('assertionOptions username = ' + username)
  if (deviceType === null || deviceType === undefined || deviceType === '') {
    deviceType = getDeviceType('')
  }
  let actExtensions: Record<string, string> = {}
  if (extensions !== null && extensions !== undefined) {
    actExtensions = extensions
  }
  actExtensions.systemId = systemId
  actExtensions.deviceType = deviceType
  return new Promise((resolve, reject) => {
    const payload = {
      username: username,
      extensions: actExtensions,
      dsn: dsn
    }
    if (credential !== null && credential !== undefined) {
      payload.extensions.credentialsId = credential.id
    }
    // console.log('payload:' + JSON.stringify(payload))
    console.log('payload:' + JSON.stringify(payload, null, 2))
    // Connect to RP
    // fetch(serverUrl + '/fido2/assertion/options', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(payload)
    // })
    apiUtil
      .post('/fido2/assertion/options', JSON.stringify(payload), {}, false)
      // .then((response) => response.json())
      .then((jsonData) => {
        // console.log('jsonData:' + JSON.stringify(jsonData))
        console.log('jsonData:' + JSON.stringify(jsonData, null, 2))
        if (jsonData.status === 'ok') {
          let gCookie = ''
          if (jsonData.headers !== null) {
            for (const entry of jsonData.headers.entries()) {
              for (const key in entry) {
                const jsonObject = entry[key]
                if (jsonObject['Set-Cookie'] != null) {
                  gCookie = jsonObject['Set-Cookie']
                }
              }
            }
          }
          console.log('send assertionResult, gCookie = ' + gCookie)
          // Write back to login page storage
          challengeValue.value = gCookie
          // $('#challenge').val(gCookie);
          assertionResult(
            resolve,
            reject,
            serverUrl,
            systemId,
            extensions,
            jsonData,
            gCookie,
            credential,
            false,
            username,
            dsn
          )
        } else {
          let errorMessage = jsonData.errorMessage
          //let retCode = FC_ERR_ASSERTION_OPTIONS_STATUS;
          let retCode = jsonData.returnCode
          if (jsonData.returnCode !== null && jsonData.returnCode !== undefined) {
            const returnCode = jsonData.returnCode
            if (returnCode === 1007) {
              retCode = FC_ERR_ASSERTION_OPTIONS_NO_DEVICE
              errorMessage = 'No corresponding device data.'
            } else if (returnCode === 9996) {
              retCode = FC_ERR_ASSERTION_OPTIONS_NETWORK
              errorMessage = 'Server abnormal, please try again later.'
            }
          }
          console.log('Original Error: Authentication failed: ' + errorMessage + ' (' + retCode + ')')
          reject(
            getErrorMessage('fido.error.ERROR0024', {
              errorMessage: errorMessage,
              retCode: retCode
            })
          )
        }
      })
      .catch(() => {
        console.log(
          'Original Error: Authentication failed: Please check the network connection status or try again later. (' +
            FC_ERR_ASSERTION_OPTIONS_NETWORK +
            ')'
        )
        reject(getErrorMessage('fido.error.ERROR0025', { errorCode: FC_ERR_ASSERTION_OPTIONS_NETWORK }))
      })
  })
}

/*
 * Function : Authentication result
 * Input : resolve, reject -
 *       serverUrl - HiFIDO server location
 *       systemId - System Id
 *       extensions - Extension data
 *       jsonData - Response Data
 *       gCookie - Connection record of assertionOptions
 *       credential -
 * Output :
 */
async function assertionResult(
  resolve: any,
  reject: any,
  serverUrl: string,
  systemId: string,
  extensions: any,
  jsonData: any,
  gCookie: any,
  credential: any,
  isPaymentFromRp: boolean,
  username: string,
  dsn: string
) {
  //console.log('assertionResult! gCookie = ' + gCookie);
  //console.log('assertionResult! rpTxId = '+ jsonData.rpTxId);
  //console.log('assertionResult! txId = '+ jsonData.txId);
  console.log('assertionResult! credential.id = ' + credential.id)
  console.log('assertionResult! credential.rawId = ' + credential.rawId)
  console.log('assertionResult! credential.response = ' + credential.response)
  console.log('assertionResult! credential.response.clientDataJSON = ' + credential.response.clientDataJSON)
  console.log('assertionResult! credential.response.authenticatorData = ' + credential.response.authenticatorData)
  console.log('assertionResult! credential.response.signature = ' + credential.response.signature)
  console.log('assertionResult! credential.response.userHandle = ' + credential.response.userHandle)
  console.log('assertionResult! credential.type = ' + credential.type)
  console.log('[Into assertionResult!]')
  let matchCredential = false
  const newAllowCredentials = []

  if (jsonData.allowCredentials) {
    console.log('Credential size = ' + jsonData.allowCredentials.length)
    for (let i = 0; i < jsonData.allowCredentials.length; i++) {
      const credentialsObj = jsonData.allowCredentials[i]
      console.log('assertionResult! Allow credential.id = ' + credentialsObj.id)

      // Check passkey obtained credential, check if matches AllowCredentials content obtained from username
      if (credential !== undefined && credential !== null) {
        console.log('assertionResult! credential.id = ' + credential.id)
        if (credential.id === credentialsObj.id) {
          console.log('match Credential!!')
          matchCredential = true
        }
      }

      credentialsObj.id = base64ToArrayBuffer(credentialsObj.id)
      newAllowCredentials.push(credentialsObj)
    }

    if (credential !== undefined && credential !== null && !matchCredential) {
      // Reply credential mismatch
      console.log(
        'Original Error: Authentication failed: passkey credential does not match. (' + FC_ERR_ASSERTION_GET + ')'
      )
      reject(getErrorMessage('fido.error.ERROR0028', { errorCode: FC_ERR_ASSERTION_GET }))
    }
  }
  console.log('assertionResult rpId:' + jsonData.rpId)
  const publicKeyCredentialRequestOptions = {
    challenge: base64ToArrayBuffer(jsonData.challenge),
    rpId: jsonData.rpId,
    allowCredentials: newAllowCredentials,
    timeout: jsonData.timeout,
    userVerification: jsonData.userVerification
  }
  try {
    console.log('assertionResult credential 1:' + credential)
    let actCredential = credential
    if (actCredential == null) {
      actCredential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      })
    }
    console.log('assertionResult credential 2:' + credential)
    if (actCredential !== undefined && actCredential !== null) {
      const responseObject = {
        clientDataJSON: arrayBufferToBase64(actCredential.response.clientDataJSON),
        authenticatorData: arrayBufferToBase64(actCredential.response.authenticatorData),
        signature: arrayBufferToBase64(actCredential.response.signature)
      }
      const payload = {
        isPaymentFromRp: isPaymentFromRp,
        rpTxId: jsonData.rpTxId,
        txId: jsonData.txId,
        username: username,
        id: actCredential.id,
        type: 'public-key',
        response: responseObject,
        extensions: extensions,
        dsn: dsn
      }

      console.log('[assertionResult][payload]: :' + JSON.stringify(payload, null, 2))
      // Connect to RP
      const headers = {
        'Content-Type': 'application/json',
        AuthToken: gCookie
      }
      // fetch(serverUrl + '/fido2/assertion/result', {
      //     method: 'POST',
      //     headers: {
      //         'Content-Type': 'application/json',
      //         'AuthToken': gCookie
      //     },
      //     body: JSON.stringify(payload)
      // })
      try {
        const jsonData = await apiUtil.post('/fido2/assertion/result', JSON.stringify(payload), headers, false)
        console.log('assertionResult jsonData:' + JSON.stringify(jsonData))
        if (jsonData.status === 'ok') {
          // resolve(jsonData)
          return jsonData
        } else {
          //reject('Authentication failed (' + FC_ERR_ASSERTION_RESULT_STATUS + ')');
          console.log(
            'Original Error: Authentication failed: ' + jsonData.errorMessage + ', (' + jsonData.returnCode + ')'
          )
          reject(
            getErrorMessage('fido.error.ERROR0029', {
              errorMessage: jsonData.errorMessage,
              returnCode: jsonData.returnCode
            })
          )
        }
      } catch {
        console.log(
          'Original Error: Authentication failed: Please check the network connection status or try again later. (' +
            FC_ERR_ASSERTION_RESULT_NETWORK +
            ')'
        )
        reject(getErrorMessage('fido.error.ERROR0030', { errorCode: FC_ERR_ASSERTION_RESULT_NETWORK }))
      }
    } else {
      console.log(
        'Original Error: Authentication failed: Unable to obtain authentication information. (' +
          FC_ERR_ASSERTION_GET +
          ')'
      )
      reject(getErrorMessage('fido.error.ERROR0031', { errorCode: FC_ERR_ASSERTION_GET }))
    }
  } catch (exception: any) {
    // Check if user cancelled operation (NotAllowedError)
    const isNotAllowedError =
      exception?.name === 'NotAllowedError' ||
      exception?.message?.includes('NotAllowedError') ||
      exception?.message?.includes('operation') ||
      exception?.message?.includes('timeout') ||
      exception?.message?.includes('not allowed')

    if (isNotAllowedError) {
      console.log('Original Error: Authentication failed: Operation cancelled (' + FC_ERR_ASSERTION_RESULT_CANCEL + ')')
      reject(getErrorMessage('fido.error.ERROR0032', { errorCode: FC_ERR_ASSERTION_RESULT_CANCEL }))
    } else {
      // Other error types, use generic error message
      console.log(
        'Original Error: Authentication failed: Unable to obtain authentication information. (' +
          FC_ERR_ASSERTION_GET +
          ')'
      )
      reject(getErrorMessage('fido.error.ERROR0031', { errorCode: FC_ERR_ASSERTION_GET }))
    }
  }
}

/*
 * Function : FIDO Registration
 * Input : * serverUrl - HiFIDO server location
 *       * systemId - System Id
 *       * username - User Name
 *       displayName - User Name, default = username
 *       extensions - Extension data
 *       useToken - Use FIDO token, or use built-in biometrics, default = false
 *       useTokenPwd - Use FIDO token requires password, default = false
 * Output : resolve -> msg Message
 *       reject -> errorCode Error Code, errorMsg Error Message
 */
export function HiFidoAttestation(
  serverUrl: string,
  systemId: string,
  username: string,
  displayName: string,
  dsn: string,
  extensions: any,
  useToken: boolean,
  deviceName: string,
  useTokenPwd: boolean
) {
  return new Promise((resolve, reject) => {
    if ('admin'.toUpperCase() === username.toUpperCase()) {
      console.log('Original Error: The name "admin" cannot be used. (' + FC_ERR_USERNAME_INVALID + ')')
      reject(getErrorMessage('fido.error.ERROR0033', { errorCode: FC_ERR_USERNAME_INVALID }))
    } else {
      if (displayName === undefined || displayName === null) displayName = username
      if (useToken === undefined || useToken === null) useToken = false
      if (useTokenPwd === undefined || useTokenPwd === null) useTokenPwd = false
      attestationOptions(serverUrl, systemId, username, displayName, extensions, useToken, deviceName, false, dsn).then(
        (resultObject) => {
          makeCredentials(
            resolve,
            reject,
            serverUrl,
            systemId,
            username,
            displayName,
            useToken,
            useTokenPwd,
            false,
            resultObject,
            dsn
          ).then(
            (jsonData) => {
              resolve(jsonData)
            },
            (errorMsg) => {
              reject(errorMsg)
            }
          )
        },
        (errorMsg) => {
          reject(errorMsg)
        }
      )
    }
  })
}
