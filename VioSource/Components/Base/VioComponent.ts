import { damp } from "three/src/math/MathUtils";
import { VioObject } from "../../Objects/VioObject/VioObject";
import { VioScene } from "../../Objects/VioScene/VioScene";

export abstract class VioComponent {
    public _name: string;
    public _scene: VioScene|null = null;
    public _object: VioObject|null = null;
    protected _editMode: boolean = false;
    protected _editModeSelected: boolean = false;
    protected static _registry: Map<string,any> = new Map(); 

    public get initialized() { return true }

    constructor(name: string) {
        this._name = name
    }

    public isInitialized(onProgress?:(status:string)=>void): Promise<boolean> {
        return new Promise(resolve => {
            let timer = setInterval(() => {
                if (this.initialized) {
                    resolve(true)
                    clearInterval(timer)
                }
            }, 10)
        });
    }

    public get name() { return this._name }
    public get scene() { return this._scene }
    public set scene(scene: VioScene|null) { this._scene = scene }
    public get object() { return this._object }
    public set object(object: VioObject|null) { this._object = object }
    public get editMode() { return this._editMode }
    public set editMode(editMode: boolean) { this._editMode = editMode }
    public get editModeSelected() { return this._editModeSelected }
    public set editModeSelected(editModeSelected: boolean) { this._editModeSelected = editModeSelected }

    // backward compatibility
    public get componentName() { return this.name }
    
    update(delta: number) { }
    dispose() { }

    onComponentAdded(component: VioComponent) {}
    onComponentRemoved(component: VioComponent) {}

    public getData(): any {
        return { name: this._name }
    }

    public setData(data: any) { }

    static hasComponent(name: string) {
        return VioComponent._registry.has(name)
    }

    static createComponent(name: string, data: any = {}): VioComponent|null {
        let Component = VioComponent._registry.get(name)
        if (Component) {
            let component = new Component()
            component.setData(data)
            return component
        }
        else {
            console.warn(`Component ${name} is not registered in registry!`);
            return null
        }
    }

    static registerComponent(name: string, Component: any) {
        VioComponent._registry.set(name, Component)
    }

    static unregisterComponent(name: string) {
        VioComponent._registry.delete(name)
    }
}