import { VioResources } from '../../Singletons/Resources/VioResources';
import { VioHudElement } from './Elements/VioHudElement';
import { VioHudImage } from './Elements/VioHudImage';

export class VioHudInventory extends VioHudElement
{
    protected _items :Array<VioHudImage|null>;

    public get type(): string {
        return 'VioHudInventory'
    }

    constructor(id: string|null = null) {
        super(id)
        this._items = []
    }
    
    public show(items:Array<{icon:string}>) {
        for (let i=items.length; i<this._items.length; ++i)
            this._items[i]!.parent = null
        this._items.length = items.length
        for (let i=0; i<items.length; ++i) {
            if (items[i]) {
                if (!this._items[i]) {
                    let image = new VioHudImage()
                    image.shadow = true
                    image.parent = this
                    image.offset = {x:i * 60, y:0}
                    image.size = {width:50, height:50}
                    this._items[i] = image
                }
                this._items[i]!.image = items[i].icon
            }
            else {
                if (this._items[i]) {
                    this._items[i]!.parent = null
                    this._items[i] = null
                }
            }
        }
    }
}