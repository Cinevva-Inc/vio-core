import { VioHudElementBox } from './Elements/VioHudElementBox';
import { VioHudLabel } from './VioHudLabel';

export type DialogOption = {label:string, scenarioID:string, color:string};

export class VioHudSelectionDialogPanel extends VioHudElementBox
{
    /*protected _question         :VioHudLabel;
    protected _selections       :Array<VioHudLabel>;
    private   _hideTimeout      :any = -1;
    private   _transitionTimeout:any = -1;

    constructor(name:string = '', id:string | null = null)
    {
        super('SelectionDialogPanel',name,id); 
        
        this.size             = {x:986,y:257,type:'px'};
        this.anchorX          = 0.5;
        this.anchorY          = 1.05;
        this.position         = {x:50,y:100,type:"%"};
        this.stateTransition  = 0.5;
        this.interactable     = false;
        this._selections      = [];

        // this.hide(false);
    }

    private _getLabel()
    {
        for(let num = 0; num < this._selections.length; num++)
        {
            if(!this._selections[num].parent)
            {
                return this._selections[num];
            }
        }

        let label = new VioHudLabel('Text');
        label.interactable = false;
        label.size         = {x:90,y:10,type:'%'};
        label.text         = '';
        label.textSize     = 16;
        label.color        = '#fff';

        this._selections.push(label);
        
        return label;
    }

    private _clearSelections()
    {
        for(let num = 0; num < this._selections.length; num++)
        {
            if(this._selections[num].parent)
            {
                this._selections[num].parent.removeChild(this._selections[num]);
            }
        }
    }

    private _clearTimeouts()
    {
        if(this._transitionTimeout>-1)
        {
            clearTimeout(this._transitionTimeout);
            this._transitionTimeout = -1;
        }
        if(this._hideTimeout>-1)
        {
            clearTimeout(this._hideTimeout);
            this._hideTimeout = -1;
        }
    }

    public hide(animate:boolean = true, onHide?:()=>void)
    {
        this._clearTimeouts();

        this.stateTransition  = animate ? 0.5 : 0;
        this._element.style.setProperty('opacity','0');
        
        this._transitionTimeout = setTimeout(()=>
        {
            this._element.style.setProperty('visibility','hidden');
            this.stateTransition  = 0;

            if(onHide)
            {
                setTimeout(()=>
                {
                    onHide();
                },0);
            }
        },this.stateTransition * 1000);
    }

    public show(title:string, options:Array<DialogOption>, onSelect:(selected:DialogOption)=>void)
    {
        this._clearSelections();
        this._clearTimeouts();

        for(let num = 0; num < options.length; num++)
        {
            let label = this._getLabel();
            label.text        = options[num].label;
            label.color       = options[num].color ? options[num].color : '#ffffff';
            label.hoverColor  = options[num].color ? options[num].color : '#ffffff';
            label.position = {x:50,y:(num * 40) + 70,type:'px'};
            label.interactable = true;
            label.buttonMode   = true;
            label.onClick      = ()=>onSelect(options[num]);
            this.addChild(label);
        }

        this.stateTransition  = 0;
        this._element.style.setProperty('visibility','visible');
        this._element.style.setProperty('opacity','0');
        this.stateTransition  = 0.5;
        this._element.style.setProperty('opacity','1');
    }
    */
}