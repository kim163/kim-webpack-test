let CryptoJS = require('crypto-js');
let key = CryptoJS.enc.Utf8.parse('smkldospdosldaaa');
let iv = CryptoJS.enc.Utf8.parse('0000000000000000');
let newKey = ''

export default {
  encrypt: (data,userDef = false) => {
    const useKey = newKey === '' ? key : (userDef ? key : newKey)
    let encrypted = CryptoJS.AES.encrypt(
      data,
      useKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })

    return encrypted.toString()
  },
  decrypt: (data,userDef = false) => {
   if(data){
    const useKey = newKey === '' ? key : (userDef ? key : newKey)
    let encrypted = data.toString().replace(/\r|\n/g, '')
    let decrypted = CryptoJS.AES.decrypt(encrypted, useKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7})

    return decrypted.toString(CryptoJS.enc.Utf8)
   }
  },
  updateKey(data){
    newKey = CryptoJS.enc.Utf8.parse(data)
  }

}
