import { VioObject } from '../../Objects/VioObject/VioObject';
import { VioRender } from '../Render/VioRender';
import { SelectionManager } from './Selection/SelectionManager';

type OnUpdated = (()=>void);

export class VioEditMode {
    protected _enabled: boolean = false;
    protected _selection: SelectionManager;
    protected _onUpdated: OnUpdated|null = null;
    protected static _instance: VioEditMode;

    constructor() {
        this._selection = new SelectionManager();
    }

    public static get enabled() { return VioEditMode.instance._enabled; }
    public static set enabled(enabled:boolean) {
        if (VioEditMode.instance._enabled)
            VioRender.scene?.remove(VioEditMode.instance._selection)
        VioEditMode.instance._enabled = enabled
        if (VioEditMode.instance._enabled)
            VioRender.scene?.add(VioEditMode.instance._selection)
        VioRender.scene?.traverseObjects(object => object.editMode = enabled)
    }
    public static get selection() { return this.instance._selection; }
    public static get selectedObjects() { return this._instance._selection.selectedItems; }
    public static get onUpdated() { return this.instance._onUpdated; }
    public static set onUpdated(onUpdated: OnUpdated|null) { this.instance._onUpdated = onUpdated; }

    public static clearSelection() {
        this._instance._selection.clearSelection();
        if (this._instance._onUpdated)
            this._instance._onUpdated()
    }
    public static addToSelection(object: VioObject) {
        this._instance._selection.addToSelection(object);
        if (this._instance._onUpdated)
            this._instance._onUpdated()
    }
    public static removeFromSelection(object: VioObject) {
        this._instance._selection.removeFromSelection(object);
        if (this._instance._onUpdated)
            this._instance._onUpdated()
    }

    private static get instance() {
        return VioEditMode._instance ?? (VioEditMode._instance = new VioEditMode());
    }
}
