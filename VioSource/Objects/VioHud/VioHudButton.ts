import { VioHudElementBox } from './Elements/VioHudElementBox';
import { VioHudLabel } from './VioHudLabel';

export class VioHudButton extends VioHudElementBox
{
    /*private _label:VioHudLabel;

    constructor(name:string = '', id:string | null = null)
    {
        super('Button',name,id);

        this._label                     = new VioHudLabel();
        this._label.position            = {x:0,y:0,type:'%'};
        this._label.size                = {x:100,y:100,type:'%'};
        this._label.horizontalTextAlign = 'center';
        this._label.verticalTextAlign   = 'center'; 

        this.addChild(this._label);

        this.interactable = true;
        this.buttonMode   = true;
    }

    protected _generateData():any
    {
        let obj  :any   = super._generateData();
        obj.label       = this.label;
        obj.labelColor  = this.labelColor;
        obj.labelSize   = this.labelSize;
        obj.boldLabel   = this.boldLabel;

        return obj;
    }
    
    public setData(data:any)
    {
        super.setData(data);
        this.label      = data.label      !== undefined ? data.label      : this.label;
        this.labelColor = data.labelColor !== undefined ? data.labelColor : this.labelColor;           
        this.labelSize  = data.labelSize  !== undefined ? data.labelSize  : this.labelSize;          
        this.boldLabel  = data.boldLabel  !== undefined ? data.boldLabel  : this.boldLabel;
    }

    public get label()
    {
        return this._label.text;
    }

    public set label(val:string)
    {
        this._label.text = val;
    }

    public get labelColor()
    {
        return this._label.color;
    }

    public set labelColor(val:string)
    {
        this._label.color = val;
    }

    public get labelSize()
    {
        return this._label.textSize;
    }

    public set labelSize(val:number)
    {
        this._label.textSize = val;
    }

    public get boldLabel()
    {
        return this._label.bold;
    }

    public set boldLabel(val:boolean)
    {
        this._label.bold = val;
    }
    */
} 