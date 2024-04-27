import { VioHudElement } from './VioHudElement';

export class VioHudImage extends VioHudElement {
    private _image: string = ''

    public get type(): string {
        return 'VioHudImage'
    }

    public get props(): Array<string> {
        return super.props.concat(['image'])
    }

    constructor(id: string|null = null) {
        super(id)
        this._updateStyle({
            'background-size': '100% 100%'
        })
    }
    public get image(): string {
        return this._image
    }
    public set image(image: string) {
        this._image = image
        this._updateStyle({
            'background-image': image ? `url(${image})` : ''
        })
    }
}
