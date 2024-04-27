import { VioResources } from '../../../Singletons/Resources/VioResources';
import { VioHudElement } from './VioHudElement';

export abstract class VioHudElementBox extends VioHudElement
{
    /*private _imageStates :State;

    constructor(type:string, name:string = '', id:string | null = null)
    {
        super(type,name,id);
        this._imageStates = {normal:'',hover:'',active:''};
    }

    protected _updateColors()
    {
        this._element.style.setProperty('background-size' ,'100% 100%');
        this._element.style.setProperty('background-image',(this.currentImage.length>0 ? 'url('+ VioResources.getUrl(this.currentImage)+')' : ''));
        this._element.style.setProperty('background-color',(this.currentColor.length>0 ? this.currentColor : 'transparent'));
        this._element.style.setProperty('color'           ,(this.currentColor.length>0 ? this.currentColor : '#000000'));
    }

    protected _generateData():any
    {
        let obj  :any   = super._generateData();
        obj.image       = this.image;
        obj.hoverImage  = this.hoverImage;
        obj.activeImage = this.activeImage;

        return obj;
    }
    
    public setData(data:any)
    {
        super.setData(data);
        this.image         = data.image       !== undefined ? data.image       : this.image;
        this.hoverImage    = data.hoverImage  !== undefined ? data.hoverImage  : this.hoverImage;
        this.activeImage   = data.activeImage !== undefined ? data.activeImage : this.activeImage;
    }

    public get currentImage()
    {
        return this._currentState == 'active' ? this._imageStates.active :
               this._currentState == 'hover'  ? this._imageStates.hover  :
               this._imageStates.normal;
    }

    public get image()
    {
        return this._imageStates.normal;
    }

    public set image(val:string)
    {
        this._imageStates.normal = val;
        this._updateElement();
    }

    public get hoverImage()
    {
        return this._imageStates.hover;
    }

    public set hoverImage(val:string)
    {
        this._imageStates.hover = val;
        this._updateElement();
    }

    public get activeImage()
    {
        return this._imageStates.active;
    }

    public set activeImage(val:string)
    {
        this._imageStates.active = val;
        this._updateElement();
    }
    */
}