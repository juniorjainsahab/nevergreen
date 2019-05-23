import {testThunk} from '../testHelpers'
import {encryptPassword} from '../../../src/client/actions/PasswordThunkActionCreators'
import * as securityGateway from '../../../src/client/gateways/SecurityGateway'
import * as gateway from '../../../src/client/gateways/Gateway'
import * as passwordActionCreators from '../../../src/client/actions/PasswordActionCreators'
import * as nevergreenThunkActionCreators from '../../../src/client/actions/NevergreenThunkActionCreators'
import {SuperAgentRequest} from 'superagent'

describe('PasswordThunkActionCreators', () => {

  describe('encryptPassword', () => {

    test('should abort pending request', async () => {
      jest.spyOn(gateway, 'send').mockResolvedValue({password: ''})
      jest.spyOn(nevergreenThunkActionCreators, 'abortPendingRequest')
      await testThunk(encryptPassword('some-tray-id', 'irrelevant'))
      expect(nevergreenThunkActionCreators.abortPendingRequest).toBeCalledWith('some-tray-id')
    })

    test('should dispatch encrypting password action', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const request = {} as any as SuperAgentRequest
      jest.spyOn(securityGateway, 'encryptPassword').mockReturnValue(request)
      jest.spyOn(gateway, 'send').mockResolvedValue({password: ''})
      jest.spyOn(passwordActionCreators, 'encryptingPassword')

      await testThunk(encryptPassword('some-tray-id', 'some-password'))
      expect(passwordActionCreators.encryptingPassword).toBeCalledWith('some-tray-id', 'some-password', request)
    })

    test('should dispatch password encrypted action', async () => {
      jest.spyOn(gateway, 'send').mockResolvedValue({password: 'some-encrypted-password'})
      jest.spyOn(passwordActionCreators, 'passwordEncrypted')
      await testThunk(encryptPassword('some-tray-id', 'irrelevant'))
      expect(passwordActionCreators.passwordEncrypted).toBeCalledWith('some-tray-id', 'some-encrypted-password')
    })

    test('should dispatch password encrypted action on success', async () => {
      jest.spyOn(gateway, 'send').mockResolvedValue({password: 'some-encrypted-password'})
      jest.spyOn(passwordActionCreators, 'passwordEncrypted')
      await testThunk(encryptPassword('some-tray-id', 'irrelevant'))
      expect(passwordActionCreators.passwordEncrypted).toBeCalledWith('some-tray-id', 'some-encrypted-password')
    })

    test('should dispatch password encrypted action if password is blank without calling the gateway', async () => {
      jest.spyOn(passwordActionCreators, 'passwordEncrypted')
      jest.spyOn(gateway, 'send')
      await testThunk(encryptPassword('some-tray-id', ''))
      expect(passwordActionCreators.passwordEncrypted).toBeCalledWith('some-tray-id', '')
      expect(gateway.send).not.toBeCalled()
    })

    test('should return a blank string if password is blank because add tray needs to use it', async () => {
      jest.spyOn(passwordActionCreators, 'passwordEncrypted')
      await testThunk(encryptPassword('some-tray-id', ''))
      expect(passwordActionCreators.passwordEncrypted).toBeCalledWith('some-tray-id', '')
    })

    test('should dispatch password encrypt error action if the request fails', async () => {
      jest.spyOn(gateway, 'send').mockRejectedValue(new Error('some-error'))
      jest.spyOn(passwordActionCreators, 'passwordEncryptError')
      await testThunk(encryptPassword('some-tray-id', 'irrelevant'))
      expect(passwordActionCreators.passwordEncryptError).toBeCalledWith('some-tray-id', ['some-error'])
    })
  })
})
