import { AnimationAction, AnimationMixer, BufferGeometry, Matrix4, Mesh, Object3D, SkeletonHelper, SkinnedMesh, Vector3, MeshPhysicalMaterial, TextureLoader, Texture, BufferAttribute, EulerOrder, Box3 } from "three";
import { IvioModel       } from "../Interfaces/IvioModel";
import { ExposedPropertiesObject, ExposedProperty } from "../Exposables/Types/ExposableProperties";
import { VioObject       } from "../Objects/VioObject/VioObject";
import { VioScene        } from "../Objects/VioScene/VioScene";
import { VioResources    } from "../Singletons/Resources/VioResources";
import { VioComponent    } from "./Base/VioComponent";
import { AnimationComponent } from "./AnimationComponent";
import { VioRender       } from "../Singletons/Render/VioRender";
// import { StaticGeometryGenerator } from "three-mesh-bvh";
import { VioHelpers } from "./../Helpers/VioHelpers";

export type MeshComponentArgs = {
    modelURL: string,
    castShadow: boolean,
    receiveShadow: boolean,
    createInstance: boolean,
    position?: { x:number, y:number, z:number },
    rotation?: { x:number, y:number, z:number, order:EulerOrder },
    scale?: { x:number, y:number, z:number },
    materials: Record<string, any>,
    settings: Array<any>,
    geometries: Map<string, any>,
    meshData?: IvioModel,
    resources?: Record<string,string>,
};

export class MeshComponent extends VioComponent
{
    protected _model:IvioModel | null = null;
    protected _args: MeshComponentArgs | null = null;
    protected _initialized = false;

    protected static textureCache: Map<string, Promise<Texture>> = new Map();

    constructor()
    {
        super('MeshComponent');
        this._initialized = false;
    }

    get initialized()  { return this._initialized }

    async _loadModelData() {
        let searchParams = new URLSearchParams(window.location.search)
        let textureLoader = new TextureLoader()
        if (this._args!.meshData)
            this._model = await new Promise(resolve => setTimeout(() => resolve(this._args!.meshData!), 0));
        else
            this._model = await VioResources.getModel(this._args!.modelURL, this._args!.createInstance, this._args!.resources ?? {});
        if (this._args!.settings) {
            let applySettings = (object:Object3D, settings:any) => {
                if (settings.visible !== undefined)
                    object.visible = settings.visible
                if (settings.children !== undefined) {
                    for (let i=0; i<settings.children.length; ++i)
                        applySettings(object.children[i], settings.children[i])
                }
            }
            applySettings(this.model.object, this._args!.settings)
        }
        for (let material of this._model!.materials) {
            let i = this._model!.materials.indexOf(material)
            let props = (this._args!.materials ?? {})[i] ?? (this._args!.materials ?? {})[material.name || '_'];
            if (props) {
                if (props.type && props.type != material.type) {
                    // console.log('need to convert material type!', props)
                }
                for (let key in props) {
                    if ((material as any)[key] !== undefined) {
                        if (searchParams.get('nomatdata'))
                            continue
                        if (key == 'map' || key.endsWith('Map')) {
                            // console.log('texture', key);
                            let image = props[key]
                            let url = image.url ?? image.src ?? image
                            if (typeof url == 'string' && url) {
                                if (url.startsWith('.') || url.startsWith('/'))
                                    url = `https://app.cinevva.com/${url.slice(1)}`
                                let loadTexture = async (url:string, opts:any={}) => {
                                    // console.log('loadTexture', url, opts);
                                    let texture = await new Promise<Texture>(
                                        (resolve, reject) =>
                                            textureLoader.load(url, resolve, undefined, reject));
                                    texture.anisotropy = opts.anisotropy ?? 4;
                                    texture.flipY = opts.flipY ?? image.flipY ?? false;
                                    texture.wrapT = opts.wrapT ?? image.wrapT ?? 1000;
                                    texture.wrapS = opts.wrapS ?? image.wrapS ?? 1000;
                                    texture.colorSpace = opts.colorSpace ?? image.colorSpace ?? 'srgb';
                                    texture.channel = opts.channel ?? image.channel ?? 0;
                                    texture.repeat.set(
                                        opts.repeat?.x ?? image.repeat?.x ?? 1,
                                        opts.repeat?.y ?? image.repeat?.y ?? 1);
                                    texture.offset.set(
                                        opts.offset?.x ?? image.offset?.x ?? 0,
                                        opts.offset?.y ?? image.offset?.y ?? 0);
                                    if (typeof image == 'object')
                                        texture.userData = image;
                                    texture.needsUpdate = true
                                    VioRender.renderer.initTexture(texture);
                                    return texture;
                                }
                                let getTexture = async (url:string, opts:any={}) => {
                                    let key = JSON.stringify({image, url, opts});
                                    let texture = MeshComponent.textureCache.get(key)
                                    if (!texture) {
                                        texture = loadTexture(url);
                                        MeshComponent.textureCache.set(key, texture);
                                    }
                                    else {
                                        // console.log('texture', url, 'loaded from cache')
                                    }
                                    return await texture
                                }
                                (material as any)[key] = await getTexture(url)
                                // let lowresURL = image.lowres
                                // if (!lowresURL) {
                                    // lowresURL = `https://app.cinevva.com/images/resize?url=${encodeURIComponent(url)}&size=64`;
                                // }
                                // let lowresTexture = await getTexture(lowresURL);
                                // (material as any)[key] = lowresTexture;
                                // setTimeout(async () => {
                                //     let hiresURL = url
                                //     let maxSize = parseFloat(searchParams.get('maxtexsize') ?? '1024')
                                //     if (image.width && image.width > maxSize) {
                                //         hiresURL = `https://app.cinevva.com/images/resize?url=${encodeURIComponent(url)}&size=${maxSize}`;
                                //         hiresURL = `https://app.cinevva.com` + (await (await fetch(hiresURL, {headers:{accept:'application/json'}})).json()).location;
                                //     }
                                //     if (searchParams.get('ktx2') && key == 'map') {
                                //         hiresURL = `https://app.cinevva.com/images/encode?url=${encodeURIComponent(hiresURL)}`;
                                //         hiresURL = `https://app.cinevva.com` + (await (await fetch(hiresURL, {headers:{accept:'application/json'}})).json()).location;
                                //     }
                                //     let hiresTexture = await getTexture(hiresURL);
                                //     (material as any)[key] = hiresTexture;
                                //     material.needsUpdate = true;
                                // }, 1000)
                            }
                            else {
                                if (image.colorSpace && (material as any)[key])
                                    (material as any)[key].colorSpace = image.colorSpace;
                            }
                        }
                        else if ((material as any)[key]?.isColor) {
                            if (typeof props[key] == 'string')
                                (material as any)[key].set('#'+props[key]);
                            else
                                (material as any)[key].setRGB(
                                    props[key].r,
                                    props[key].g,
                                    props[key].b);
                        }
                        else
                            (material as any)[key] = props[key];
                    }
                }
                if ((material as any).emissive !== undefined && (
                    (material as any).emissive.r > 1 ||
                    (material as any).emissive.g > 1 ||
                    (material as any).emissive.b > 1))
                {
                    let scale = Math.max(
                        (material as any).emissive.r,
                        (material as any).emissive.g,
                        (material as any).emissive.b);

                    (material as any).emissive.set(
                        (material as any).emissive.r / scale,
                        (material as any).emissive.g / scale,
                        (material as any).emissive.b / scale);

                    (material as any).emissiveIntensity *= scale;
                }
                material.needsUpdate = true;
            }
        }

        if (this._args!.position)
            this._model!.object.position.set(
                this._args!.position.x,
                this._args!.position.y,
                this._args!.position.z)

        if (this._args!.rotation)
            this._model!.object.rotation.set(
                this._args!.rotation.x,
                this._args!.rotation.y,
                this._args!.rotation.z,
                this._args!.rotation.order)

        if (this._args!.scale)
            this._model!.object.scale.set(
                this._args!.scale.x,
                this._args!.scale.y,
                this._args!.scale.z)

        if (this.object) {
            this.object.add(this._model!.object);
            this.object.updateMatrixWorld(true);
            this.updateShadowProps();
        }

        this.object?.resetBounds()
        this._initialized = true;
    }

    public get model(): IvioModel {
        return this._model!
    }

    public setData(data:any)
    {
        let oldData = this._args;

        this._args = data;

        if(!oldData || (oldData && oldData.modelURL != this._args!.modelURL) || (oldData.meshData != this._args!.meshData))
        {
            if (this._args!.modelURL || this._args!.meshData)
                this._loadModelData();
            else {
                this._initialized = true;
                this.object?.resetBounds()
            }
        }

        super.setData(data);
    }

    public getData():any
    {
        let obj             = super.getData() as any;

        obj.modelURL        = this._args!.modelURL;
        // obj.modelSize       = this.params!.modelSize;
        obj.position        = this._args!.position;
        obj.rotation        = this._args!.rotation;
        obj.scale           = this._args!.scale;
        obj.createInstance  = this._args!.createInstance;
        obj.resources       = this._args!.resources;
        obj.castShadow      = this._args!.castShadow;
        obj.receiveShadow   = this._args!.receiveShadow;

        let makeSettings = (object:Object3D):any => {
            return {
                visible: !object.visible ? false : undefined,
                children: object.children.length > 0 ? object.children.map(makeSettings) : undefined,
            }
        }

        obj.settings = makeSettings(this.model.object);

        let materials = {} as Record<string,any>
        for (let material of this.materials || []) {
            if (true) {
                let m1 = material;
                let m2 = {} as any;
                m2.type = m1.type
                for (let key of Object.keys(m1)) {
                    if (key.startsWith('_') || ['uuid', 'type'].includes(key))
                        continue;
                    if (key == 'map' || key.endsWith('Map')) {
                        let texture = (m1 as any)[key];
                        if (texture) {
                            if (texture.userData && Object.keys(texture.userData).length && texture.userData.url) {
                                m2[key] = texture.userData;
                            }
                            else {
                                m2[key] = {
                                    colorSpace: texture.colorSpace,
                                };
                                let image = texture.source?.data
                                // console.log('MeshComponent', {image})
                                if (false && image) {
                                    let url = image.url ?? image.src
                                    if (url === undefined && texture.name.startsWith('https://app.cinevva.com/uploads/')) {
                                        url = texture.name
                                    }
                                    // console.log('MeshComponent', {url})
                                    if (url !== undefined && !url.startsWith('blob:') && image.width && image.height) {
                                        let canvas = document.createElement('canvas');
                                        let ctx = canvas.getContext('2d');
                                        canvas.width = 64;
                                        canvas.height = 64;
                                        ctx!.drawImage(image, 0, 0, 64, 64);
                                        let lowres:string
                                        if (key == 'alphaMap' || m1.transparent && key == 'map') {
                                            lowres = canvas.toDataURL('image/png')
                                        }
                                        else {
                                            lowres = canvas.toDataURL('image/jpeg', 0.5)
                                        }
                                        Object.assign(m2[key], {
                                            url,
                                            width: image.width,
                                            height: image.height,
                                            lowres,
                                            flipY: texture.flipY,
                                            wrapS: texture.wrapS,
                                            wrapT: texture.wrapT,
                                            channel: texture.channel,
                                            offset: {
                                                x: texture.offset.x,
                                                y: texture.offset.y,
                                            },
                                            repeat: {
                                                x: texture.repeat.x,
                                                y: texture.repeat.y,
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                    if (typeof (m1 as any)[key] == 'number' ||
                        typeof (m1 as any)[key] == 'boolean' ||
                        typeof (m1 as any)[key] == 'string')
                    {
                        m2[key] = (m1 as any)[key];
                    }
                    if ((m1 as any)[key]?.isColor) {
                        m2[key] = {
                            r: (m1 as any)[key].r,
                            g: (m1 as any)[key].g,
                            b: (m1 as any)[key].b,
                        }
                    }
                }
                let i = this.materials!.indexOf(material)
                materials[i] = m2;
            }
        }
        obj.materials = materials;

        let geometries = {} as any;

        this.model?.object?.traverse((object:Object3D) => {
            if ((object as any).isMesh) {
                let mesh = object as Mesh;
                let index = mesh.geometry.index;
                if (index && (index as any).original && index.array.length != (index as any).original.length) {
                  geometries[object.name || '_'] = { index: [...index.array] };
                }
            }
        })


        obj.geometries = geometries;

        return obj;
    }

    updateShadowProps() {
      this._model!.object?.traverse(object => {
        let mesh = object as THREE.Mesh;
        if (mesh.isMesh) {
          if (this.object!.meta.castShadow !== undefined)
            mesh.castShadow = this.object!.meta.castShadow
          if (this.object!.meta.receiveShadow !== undefined)
            mesh.receiveShadow = this.object!.meta.receiveShadow
        }
      })
    }

    get object() { return super.object }
    public set object(object: VioObject|null) {
        if (this.object && this._model) {
            this.object.remove(this._model.object)
            this.object.resetBounds()
        }
        super.object = object
        if (this.object && this._model) {
            this.object.add(this._model.object)
            this.object.updateMatrixWorld(true)
            this.updateShadowProps()
            this.object.resetBounds()
        }
    }

    get meshObject() { return this._model?.object }
    get animationMixer() {
        if (this._model && !this._model.mixer)
            this._model.mixer = new AnimationMixer(this._model.object)
        return this._model?.mixer
    }
    get materials() { return this._model?.materials }
    get animations() { return this._model?.actions }

    update(delta: number): void {
        super.update(delta);
        this._model?.mixer?.update(delta);
    }
}
