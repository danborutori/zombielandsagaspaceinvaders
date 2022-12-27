namespace zlsSpaceInvader {

    async function getUrl( src: string ){
        const blob = await (await fetch(src)).blob()
        return URL.createObjectURL(blob)
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