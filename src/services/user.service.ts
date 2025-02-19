import Utility from '../helpers/utility'
import constants from '../types/constants'
import {LoggedInUserData, Response} from '../types/types'

const loginOauth = async (authToken: string, callbackUrl: string, vendorId: string): Promise<LoggedInUserData> => {
  const postData = {
    appId: Utility.getAppId(),
    vendorId,
    authToken,
    callbackUrl,
  }
  const result = await Utility.callEndpoint<LoggedInUserData>(constants.endpoints.oauthSignIn, 'POST', postData)
  if (!result.data.synapseUserId) {
    throw Error('Synapse user id is missing')
  }
  const resultFromSynapse = await getUserInfoFromSynapse(result.data.synapseUserId)

  return {...result.data, isVerified: resultFromSynapse.data.isVerified}
}

async function getUserInfo(token: string): Promise<Response<LoggedInUserData>> {
  const result = await Utility.callEndpoint<LoggedInUserData>(constants.endpoints.selfInfo, 'GET', {}, token)
  return result
}

async function getUserInfoFromSynapse(synapseUserId: string): Promise<Response<any>> {
  const profile = await Utility.callEndpoint<any>(
    constants.endpoints.synapseGetUserProfile.replace(':id', synapseUserId),
    'GET',
    {MASK: 0x31},
    undefined,
    true
  )

  return profile
}

const UserService = {
  loginOauth,
  getUserInfo,
  getUserInfoFromSynapse,
}

export default UserService
