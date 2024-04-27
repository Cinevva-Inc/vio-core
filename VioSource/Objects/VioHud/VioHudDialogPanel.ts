import { VioHudElement } from './Elements/VioHudElement';
import { VioHudLabel } from './VioHudLabel';
import { VioHudImage } from './Elements/VioHudImage';
import { VioRender } from '../../Singletons/Render/VioRender';

export class VioHudDialogPanel extends VioHudElement {
    // private _panel: VioHudImage
    // private _speaker: VioHudLabel
    // private _text: VioHudLabel
    private _hideTimeout: any

    public get type(): string {
        return 'VioHudDialogPanel'
    }

    public get props(): Array<string> {
        return super.props.concat(['panel', 'speaker', 'text'])
    }

    constructor(id:string | null = null) {
        super(id)

        this.size = {width:986, height:257}
        this.origin = {top: null, left:'50%', right: null, bottom:'0'}
        this.offset = {x:'-50%', y:-20}
        this.visible = false

        this.element.className = "dialogue-panel"
        this.element.innerHTML = `
            <label></label>
            <p></p>`



        // this._panel = new VioHudImage()
        // this._panel.shadow = true
        // this._panel.parent = this
        // this._panel.size = {width:'100%', height:'100%'}
        // this._panel.image = '/assets/images/panel.png'

        // this._speaker = new VioHudLabel()
        // this._speaker.shadow = true
        // this._speaker.parent = this
        // this._speaker.offset = {x:50,y:60}
        // this._speaker.size = {width:'90%',height:'10%'}
        // this._speaker.text = ''
        // this._speaker.textSize = 20
        // this._speaker.color = '#fff'

        // this._text = new VioHudLabel()
        // this._text.shadow = true
        // this._text.parent = this
        // this._text.offset = {x:50,y:90}
        // this._text.size = {width:'90%',height:'50%'}
        // this._text.text = ''
        // this._text.textSize = 16
        // this._text.color = '#fff'
    }

    public get speaker(): string {
        return this.element.querySelector("label")!.innerText
    }

    public get text(): string {
        return this.element.querySelector("p")!.innerText
    }

    public set speaker(speaker: string) {
        // this._speaker.text = speaker
        this.element.querySelector("label")!.innerText = speaker
    }

    public set text(text: string) {
        this.element.querySelector("p")!.innerText = text
        // this._text.text = text
    }

    public get panel(): string {
        return ''
        // return this._panel.image
    }

    public set panel(panel:string) {
        // this._panel.image = panel
    }

    public show(
        speaker: string,
        text: string,
        hideIn: number = -1,
        speakerColor: string = '#fff',
        textColor: string = '#fff',
        onHide: (() => void) | null = null)
    {
        this.speaker  = speaker
        this.text     = text
        // this._speaker.color = speakerColor
        // this._text.color    = textColor
        // let width = parseFloat(`${this.size.width}`)
        // let height = parseFloat(`${this.size.height}`)
        // let scale = 1
        // let y = -20
        // if (width > VioRender.screenSize.width) {
            // scale = VioRender.screenSize.width / width
            // y = (height - height * scale) / 2
        // }
        // this.scale = {x:scale, y:scale}
        // this.offset = {x:'-50%', y}

        this.visible = true

        if (hideIn > 0)
            this._hideTimeout = setTimeout(() => this.hide(false, onHide), hideIn * 1000)
    }

    public hide(
        animate: boolean = true,
        onHide: (() => void) | null = null)
    {
        clearTimeout(this._hideTimeout)

        this.visible = false

        if (onHide)
            setTimeout(onHide, 0)
    }
}