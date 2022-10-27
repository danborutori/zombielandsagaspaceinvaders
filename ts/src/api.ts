namespace zlsSpaceInvader {

    const secret = "ZTIwZmI0OTI3YmI1NjU4MjZlMjE5NDY0OTA1MjI5ZDA="

    async function sha256(message: string) {
        // encode as UTF-8
        const msgBuffer = new TextEncoder().encode(message);                    
    
        // hash the message
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    
        // convert ArrayBuffer to Array
        const hashArray = Array.from(new Uint8Array(hashBuffer));
    
        // convert bytes to hex string                  
        const hashHex = hashArray.map(b => (b.toString(16) as any).padStart(2, '0')).join('');
        return hashHex;
    }

    export class APIRequest {

        constructor(readonly url: string){}

        async get(){
            const request = await fetch(this.url)
            return request.json()
        }

        async post( body: any ){

            const payload = JSON.stringify(body)
            const salt = `${Math.random()+Date.now()}`
            const digest = await sha256(payload+salt+atob(secret))

            const request = await fetch(this.url, {
                method: "POST",
                body: JSON.stringify({
                    payload: payload,
                    digest: digest,
                    salt: salt
                })
            })
            const json = await request.json()
            if( json.state!="OK"){
                throw new Error( json )
            }

        }

    }

}