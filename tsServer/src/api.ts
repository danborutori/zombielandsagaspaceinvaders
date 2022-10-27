const _crypto = require('crypto')

const secret = "e20fb4927bb565826e219464905229d0"

function sha256(message: string) {
    return _crypto.createHash('sha256').update(message).digest('hex')
}

class API {

    static async getBody( body: {
        payload: string
        digest: string
        salt: string
    }){
        const digest = sha256(body.payload+body.salt+secret)
        if( digest==body.digest ){
            return JSON.parse( body.payload )
        }
    }

}