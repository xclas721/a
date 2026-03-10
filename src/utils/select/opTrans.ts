import type { BaseSelect } from '@/utils/select/baseSelect'

export const opCategoryOptionSelect: BaseSelect[] = [
  {
    value: '01',
    text: 'General'
  },
  {
    value: '02',
    text: 'Operational alert'
  },
  {
    value: '03',
    text: 'Public Key Certificate expiry'
  },
  {
    value: '04',
    text: 'LOA/AOC expiry'
  },
  {
    value: '05',
    text: 'Fraud'
  },
  {
    value: '06',
    text: 'Other'
  }
]

export const opSeverityOptionSelect: BaseSelect[] = [
  {
    value: '01',
    text: 'Critical'
  },
  {
    value: '02',
    text: 'Major'
  },
  {
    value: '03',
    text: 'Minor'
  },
  {
    value: '04',
    text: 'Informational'
  }
]
export const transIdTypeOptionSelect: BaseSelect[] = [
  {
    value: '01',
    text: '3DS Server'
  },
  {
    value: '02',
    text: 'DS'
  },
  {
    value: '03',
    text: 'ACS'
  }
]
export const opStatusOptionSelect: BaseSelect[] = [
  {
    value: '01',
    text: 'Successfully received messages'
  },
  {
    value: '02',
    text: 'Message sequence is broken'
  },
  {
    value: '03',
    text: 'Requested action is not supported or not executed by the 3DS Server or ACS when OReq message was received'
  }
]
