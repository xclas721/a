import ApiUtil from '@/utils/apiUtils'

const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })

async function cardDataIsConfirming(
  accessId: string,
  dataOid: string,
  targetObject: string,
  cardDataOid: string
): Promise<boolean> {
  const result = await apiUtil.get(
    '/reconfirm/isConfirming',
    {
      accessId: accessId,
      dataOid: dataOid,
      targetObject: targetObject,
      cardDataOid: cardDataOid
    },
    {},
    true
  )

  return result.data
}

async function baseIsConfirming(accessId: string, dataOid: string) {
  const result = await apiUtil.get(
    '/reconfirm/isConfirming',
    {
      accessId: accessId,
      dataOid: dataOid
    },
    {},
    true
  )

  return result.data
}

async function isConfirmingAdd(accessId: string, issuerOid: string) {
  const result = await apiUtil.get(
    '/reconfirm/isConfirmingAdd',
    {
      accessId: accessId,
      issuerOid: issuerOid
    },
    {},
    true
  )

  return result.data
}

export { cardDataIsConfirming, baseIsConfirming, isConfirmingAdd }
