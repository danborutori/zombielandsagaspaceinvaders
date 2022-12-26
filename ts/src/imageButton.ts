namespace zlsSpaceInvader {

    function getUrl( src: string ){
        return new Promise<string>(resolve=>{
            const img = new Image()
            img.src = src
            img.onload = ()=>{
                const canvas = document.createElement("canvas")
                canvas.width = img.width
                canvas.height = img.height
                const ctx = canvas.getContext("2d")!
                ctx.drawImage(img,0,0)
                resolve( canvas.toDataURL("png") )
            }
        })
    }

    export class ImageButton{
        private upImgUrl: Promise<string>
        private downImgUrl: Promise<string>

        private _down = false
        get down(){ return this._down }
        set down( b: boolean ){
            this._down = b
            if( b )
                this.downImgUrl.then(s=>this.input.src = s)
            else
                this.upImgUrl.then(s=>this.input.src = s)
        }

        constructor(
            readonly input: HTMLInputElement,
            upSrc: string,
            downSrc: string
        ){
            this.upImgUrl = getUrl(upSrc)
            this.downImgUrl = getUrl(downSrc)
            this.upImgUrl.then(s=>input.src = s)            
        }

    }

}