import { VioHudElement } from './VioHudElement';

export abstract class VioHudText extends VioHudElement {

    private _horizonalTextAlign: string = ''
    private _vericalTextAlign: string = ''
    private _textSize: number  = 12
    private _color: string = ''
    private _bold: boolean = false
    private _italic: boolean = false
    private _text: string = ''

    public get type(): string {
        return 'VioHudText'
    }

    public get props(): Array<string> {
        return super.props.concat([
            'horizonalTextAlign',
            'vericalTextAlign',
            'textSize',
            'color',
            'bold',
            'italic',
            'text',
        ])
    }

    constructor(id: string|null = null) {
        super(id)
        this._update()
    }

    protected _update() {
        const horizontal = this._horizonalTextAlign == 'left'   ? 'flex-start' :
                           this._horizonalTextAlign == 'right'  ? 'flex-end'   : 'center';

        const vertical   = this._vericalTextAlign   == 'top'    ? 'flex-start' :
                           this._vericalTextAlign   == 'bottom' ? 'flex-end'   : 'center';
                           
        this._updateStyle({
            'display': 'flex',
            'justify-content': horizontal,
            'align-items': vertical,
            'color': this._color,
            'font-size': `${this._textSize}px`,
            'font-weight': this._bold ? 'bold' : 'normal'
        })

        this.element.innerText = this._text
    }

    public get horizonalTextAlign(): string { return this._horizonalTextAlign }
    public get vericalTextAlign(): string   { return this._vericalTextAlign }
    public get textSize(): number           { return this._textSize }
    public get color(): string              { return this._color }
    public get bold(): boolean              { return this._bold }
    public get italic(): boolean            { return this._italic }
    public get text(): string               { return this._text }

    public set horizonalTextAlign(x:string) { this._horizonalTextAlign = x; this._update() }
    public set vericalTextAlign(x:string)   { this._vericalTextAlign = x; this._update() }
    public set textSize(x:number)           { this._textSize = x; this._update() }
    public set color(x:string)              { this._color = x; this._update() }
    public set bold(x:boolean)              { this._bold = x; this._update() }
    public set italic(x:boolean)            { this._italic = x; this._update() }
    public set text(x:string)               { this._text = x; this._update() }

}