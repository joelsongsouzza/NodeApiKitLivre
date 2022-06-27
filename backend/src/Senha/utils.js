function generatePassword(){
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var pass = ''
    for(var i=0; i< 5; i++)
      pass += chars.charAt(Math.random() * 7)
    return pass
} //criar senha aleatória para enviar por e-mail para depois ocorrer alteração futura, conforme o gosto do usuário

module.export = {generatePassword}