namespace zlsSpaceInvader {

    export class ImageButton{

        private _down = false
        get down(){ return this._down }
        set down( b: boolean ){
            this._down = b
            if( b )
                this.input.src = this.downSrc
            else
                this.input.src = this.upSrc
        }

        constructor(
            readonly input: HTMLInputElement,
            readonly upSrc: string,
            readonly downSrc: string
        ){
            input.src = upSrc
        }

    }

}