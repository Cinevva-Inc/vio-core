import { AmbientLight, AnimationClip, AnimationMixer, AudioListener, AudioLoader, Bone, BoxGeometry, SphereGeometry, BufferAttribute, BufferGeometry, Color, CubeTexture, CubeTextureLoader, DirectionalLight, FrontSide, BackSide, DoubleSide, Float32BufferAttribute, Group, LoopOnce, LoopPingPong, LoopRepeat, Material, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshMatcapMaterial, MeshPhongMaterial, MeshStandardMaterial, NumberKeyframeTrack, Object3D, OrthographicCamera, PerspectiveCamera, PointLight, PositionalAudio, QuaternionKeyframeTrack, RepeatWrapping, Scene, Side, Skeleton, SkinnedMesh, SpotLight, Texture, TextureLoader, Uint16BufferAttribute, Vector3, VectorKeyframeTrack, NearestFilter, SRGBColorSpace, MeshPhysicalMaterial, ObjectLoader, LoaderUtils, FileLoader, LoadingManager } from 'three';
import { FBXLoader        } from "three/examples/jsm/loaders/FBXLoader";
import { OBJLoader        } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader        } from 'three/examples/jsm/loaders/MTLLoader.js';
import * as SkeletonUtils   from "three/examples/jsm/utils/SkeletonUtils";
import { VioHelpers       } from '../../Helpers/VioHelpers';
import { IvioModel        } from '../../Interfaces/IvioModel';
import { VioGenerator     } from './../../Helpers/VioGenerator';
import { VioAnimationGenerator } from '../../Helpers/VioAnimationGenerator';
import { VioRender } from '../../Singletons/Render/VioRender';
import { GLTFLoaderX } from './GLTFLoaderX';
import { FileCache } from '../../../VioCore';
//@ts-ignore
// import { lozi             } from 'D:/MyProjects/Libraries/Lozi/LoziImporter/dist/lozi';
// import { lozi             } from './../../../Libs/lozi';
import * as lozi from './../../../Libs/LoziImporter/src/index';

type FBXAnimationEntry = {clip:AnimationClip};

type AnimationEntry = {
    data:Array<any>,
    entries:Array<
        {bindings:Record<string,string>|null,
        clips:Array<AnimationClip>}>
};

type SkyBoxAssets = {
    object:Mesh,
    textures:Array<Texture>,
    materials:Array<MeshBasicMaterial|MeshStandardMaterial|MeshPhysicalMaterial>
};

export class VioResources
{
    private static _instance:VioResources;

    protected _urlPrefix    :string = '';
    protected _textureCache : Map<string,Texture>;
    protected _skyboxCache  : Map<string,SkyBoxAssets>;
    protected _modelCache   : Map<string,IvioModel|null>;
    protected _audioCache   : Map<string,AudioBuffer>;
    protected _animations   : Map<string,AnimationEntry>;
    protected _fbxAnimations: Map<string,FBXAnimationEntry>;

    private constructor()
    { 
        this._textureCache  = new Map<string,Texture>();
        this._skyboxCache   = new Map<string,SkyBoxAssets>();
        this._modelCache    = new Map<string,IvioModel|null>();
        this._audioCache    = new Map<string,AudioBuffer>();
        this._animations    = new Map<string,AnimationEntry>();
        this._fbxAnimations = new Map<string,FBXAnimationEntry>();
        this._setLoziDependancies();
    }

    private _setLoziDependancies()
    {
        lozi.setThreejsObject(
        {
            NumberKeyframeTrack:NumberKeyframeTrack,
            VectorKeyframeTrack:VectorKeyframeTrack,
            QuaternionKeyframeTrack:QuaternionKeyframeTrack,
            AnimationClip:AnimationClip,
            AnimationMixer:AnimationMixer,
            LoopOnce:LoopOnce,
            LoopPingPong:LoopPingPong,
            LoopRepeat:LoopRepeat,

            // AudioListener:AudioListener,
            // PositionalAudio:PositionalAudio,

            Vector3:Vector3,

            MeshBasicMaterial:MeshBasicMaterial,
            MeshMatcapMaterial:MeshMatcapMaterial,
            MeshStandardMaterial:MeshStandardMaterial,
            MeshPhysicalMaterial:MeshPhysicalMaterial,
            MeshPhongMaterial:MeshPhongMaterial,
            MeshLambertMaterial:MeshLambertMaterial,
            Color:Color,

            FrontSide:FrontSide,
            BackSide:BackSide,
            DoubleSide:DoubleSide,

            BufferGeometry:BufferGeometry,
            BufferAttribute:BufferAttribute,

            Mesh:Mesh,
            SkinnedMesh:SkinnedMesh,

            Float32BufferAttribute:Float32BufferAttribute,
            Uint16BufferAttribute:Uint16BufferAttribute,

            Bone:Bone,
            Skeleton:Skeleton,
            Object3D:Object3D,
            Scene:Scene,
            SpotLight:SpotLight,
            DirectionalLight:DirectionalLight,
            PointLight:PointLight,
            AmbientLight:AmbientLight,
            PerspectiveCamera:PerspectiveCamera,
            OrthographicCamera:OrthographicCamera,

            Texture:Texture,
            CubeTexture:CubeTexture,
            RepeatWrapping:RepeatWrapping,
        });
    }

    private static get instance():VioResources
    {
        if(!VioResources._instance)
        {
            VioResources._instance = new VioResources();
        }
        return VioResources._instance;
    }

    public static getUrl(val:string)
    {
        if(VioResources.urlPrefix && VioResources.urlPrefix.length > 0)
        {
            return new URL(val,VioResources.urlPrefix).href;
        }
        return val;
    }

    private static async getFbxAnimation(url:string, name:string, bindings:Record<string,string> | null=null):Promise<AnimationClip>
    {
        url = this.getUrl(url);

        let has:boolean = this.instance._fbxAnimations.has(url);
        
        if(has)
        {
            return this.instance._fbxAnimations.get(url)!.clip;
        }
        else
        {
            const model = await this._loadFBXModel(url);

            // fbx always has only one animation clip
            let newClip = VioAnimationGenerator.updateAnimationClipBindings(model.clips[0],bindings);
            newClip.name = name;

            this.instance._fbxAnimations.set(url,{clip:newClip});

            return newClip; 
        }
    }

    private static async getAnimationData(url:string, animation:string, bindings:Record<string,string> | null):Promise<AnimationClip|null>
    {
        url = this.getUrl(url);

        let has:boolean = this.instance._animations.has(url);
        
        if(has)
        {
            let entry = this.instance._animations.get(url)!;

            for(let num1 = 0; num1 < entry.entries.length; num1++)
            {
                let animData = entry.entries[num1];

                if(VioHelpers.object.equals(animData.bindings,bindings))
                {
                    for(let num2 = 0; num2 < animData.clips.length; num2++)
                    {
                        if(animData.clips[num2].name == animation)
                        {
                            return animData.clips[num2];
                        }
                    }
                    return null;
                }
                else
                {
                    let selected:any = null;
                    let clips:Array<AnimationClip> = [];
            
                    for(let num = 0; num < entry.data.length; num++)
                    {
                        let clip = VioAnimationGenerator.generateAnimationClip(entry.data[num],bindings);

                        clips.push(clip);
                        if(clip.name == animation)
                        {
                            selected = clip;
                        }
                    }
                    entry.entries.push({bindings:bindings,clips:clips});
                    
                    return selected;
                }

            }
            return null;
        }
        else
        {
            const resp = await VioHelpers.Ajax.getDataAsync(url,'GET');

            let clips:Array<AnimationClip> = [];
            let data :AnimationEntry = {data:resp.data, entries:[{bindings:bindings,clips:clips}]};
            let selected:any = null;
            
            for(let num = 0; num < data.data.length; num++)
            {
                let clip = VioAnimationGenerator.generateAnimationClip(data.data[num],bindings);

                clips.push(clip);
                if(clip.name == animation)
                {
                    selected = clip;
                }
            }
            this.instance._animations.set(url,data);
            
            return selected;
        }
    }

    public static async getAnimation(url:string, animation:string, json:any, bindings:Record<string,string> | null=null):Promise<AnimationClip|null>
    {
        // console.log("U",url,animation,bindings);
        let urlArr    = url.split('/');
        let file      = urlArr[urlArr.length-1];
        let clip: AnimationClip|null = null;

        if (json) {
            clip = AnimationClip.parse(json);
        }
        else if(file.includes('.fbx'))
        {
            clip = await this.getFbxAnimation(url,animation,bindings);
        }
        else
        {
            clip = await this.getAnimationData(url,animation,bindings);
        }
        return clip;
    }

    public static async getTexure(url:string):Promise<Texture>
    {
        if (url.startsWith('https://blockade-platform-production')) {
            let hash = new Uint8Array(await crypto.subtle.digest('SHA-1', new TextEncoder().encode(url)))
                .reduce((output, elem) => (output + ('0' + elem.toString(16)).slice(-2)), '')
            let vioUrl = `https://app.cinevva.com/uploads/${hash}.png`
            let res = await fetch(vioUrl, {method: "HEAD"})
            if (res.status == 404) {
                await FileCache.get(url)
                    .then(result =>
                        fetch(result as string)
                            .then(res => res.arrayBuffer())
                            .then(async buf => {
                                let type = (result as string).slice(5).split(';')[0]
                                let file = new File([buf], 'blockade.png', {type})
                                let link = await (window as any).app.saveFile(file)
                                console.log({url, link, hash, result, buf, type, file})
                                
                                var formData = new FormData()
                                formData.append('file', file)
                                await fetch(`https://app.cinevva.com/upload?hash=${hash}`, {
                                  method: 'POST',
                                  body: formData,
                                  credentials: 'include',
                                  redirect: 'manual',
                                })
                            }))
                    .catch(() => {})
            }
            url = vioUrl
            console.log({vioUrl})
        }

        url = this.getUrl(url);

        return new Promise(async resolve=>
        {
            if(!this.instance._textureCache.has(url))
            {
                const loader:TextureLoader = new TextureLoader();
                
                let texture = await loader.loadAsync(url);

                this.instance._textureCache.set(url,texture);
            }
            resolve(this.instance._textureCache.get(url)!);
        });
    }

    public static async getSkybox(url:string,type:'png' = 'png'):Promise<SkyBoxAssets>
    {
        url = this.getUrl(url);
        let key = url+'('+type+')'
        if(this.instance._skyboxCache.has(key))
        {
            return this.instance._skyboxCache.get(key)!;
        }
        let config = { type: 'box', load: url, depth_map: null };
        if (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png'))
        {
            config = { type: 'sphere', load: url, depth_map: null };
        }
        if (url.endsWith('.json'))
        {
            config = await (await fetch(url)).json()
        }
        // console.log({config})
        if (config.type == 'sphere')
        {
            const geometry = new SphereGeometry(1,256,256); 
            const material = new MeshStandardMaterial(); 
            material.side = BackSide;
            material.color.set('#000000');
            material.emissive.set('#ffffff');
            material.emissiveIntensity = 1;
            material.depthTest = false;
            material.depthWrite = false;
            const texture = await this.getTexure(config.load)
            // texture.colorSpace = SRGBColorSpace
            texture.minFilter = NearestFilter
            texture.generateMipmaps = false
            material.emissiveMap = texture
            if (config.depth_map) {
                const depth_map = await this.getTexure(config.depth_map)
                depth_map.minFilter = NearestFilter
                depth_map.generateMipmaps = false
                material.displacementMap = depth_map;
                material.displacementScale = -0.8;
            }
            const object = new Mesh(geometry, material);
            let materials = [material]
            let textures = [texture]
            let skybox = {object,materials,textures}
            this.instance._skyboxCache.set(key, skybox);
        }
        if (config.type == 'box')
        {
            let geometry = new BoxGeometry(1,1,1);
            let materials:Array<MeshBasicMaterial> = [];
            let textures :Array<Texture> = 
            [
                await this.getTexure(`${config.load}front.${type}`),
                await this.getTexure(`${config.load}back.${type}`),
                await this.getTexure(`${config.load}top.${type}`),
                await this.getTexure(`${config.load}bottom.${type}`),
                await this.getTexure(`${config.load}right.${type}`),
                await this.getTexure(`${config.load}left.${type}`),
            ];

            for(let num = 0; num < textures.length; num++)
            {
                let material = new MeshBasicMaterial({map:textures[num],side:BackSide})
                material.depthTest = false;
                material.depthWrite = false;
                // material.emissive.set('ffffff')
                materials.push(material);
            }

            var uvAttribute = geometry.attributes.uv;
        
            for ( var i = 0; i < uvAttribute.count; i ++ ) {
                    
                var u = uvAttribute.getX(i);
                var v = uvAttribute.getY(i);
                        
                if (i < 4) // front
                    uvAttribute.setXY( i, 1-u, v);
                else if (i < 8) // back
                    uvAttribute.setXY( i, 1-u, v);
                else if (i < 12) // top
                    uvAttribute.setXY( i, 1-v, 1-u);
                else if (i < 16) // bottom
                    uvAttribute.setXY( i, v, u);
                else if (i < 24) // right
                    uvAttribute.setXY( i, 1-u, v);
                else // left 
                    uvAttribute.setXY( i, 1-u, v);
            }

            let object = new Mesh(geometry, materials);
            let skybox = {object,materials,textures}
            this.instance._skyboxCache.set(key, skybox);
        }
        return this.instance._skyboxCache.get(key)!
    }

    private static _setModel(obj:any,clips:Array<AnimationClip>,clone:boolean = false)
    {
        const object:IvioModel = {object:obj, clips:clips, actions:null, mixer:null, materials:[], bones:{}};

        if(clips && clips.length>0)
        {
            const clonedObj   = clone ? SkeletonUtils.clone( obj) : obj;
            const mixer       = new AnimationMixer( clonedObj );
            const actions:any = {};

            object.object  = clonedObj;
            object.actions = actions;
            object.mixer   = mixer;

            clips.forEach(clip=>
            {
                actions[clip.name] = mixer.clipAction( clip );
            });
        }
        return object;
    }

    private static async _loadGLTFModel(url:string):Promise<IvioModel>
    {
        return new Promise(async resolve=>
        {
            // if(!this.instance._modelCache.has(url))
            {
                let model = await GLTFLoaderX.loadAsync(url)
                const object:IvioModel = this._setModel(model.scene, model.animations);
                
                model.scene.updateMatrixWorld(true);
                this.instance._modelCache.set(url,object);
            }
            resolve(this.instance._modelCache.get(url)!);
        }); 
    }

    private static async _loadFBXModel(url:string, resources:Record<string,string>={}):Promise<IvioModel>
    {
        return new Promise(async resolve=>
        {
            // if(!this.instance._modelCache.has(url))
            {
                const data = await new Promise<ArrayBuffer|string>((resolve, reject) =>
                    new FileLoader().setResponseType('arraybuffer').load(url, resolve, undefined, reject));
                const path = LoaderUtils.extractUrlBase(url);
                const manager = new LoadingManager();
                manager.resolveURL = url => {

                    console.log('resolveURL', {url})
                    let name = (url.split('/').pop() ?? url)?.toLowerCase()
                    return name ? resources[name] ?? url : url;
                }
                const group = new FBXLoader(manager).parse(data, path);
                const object:IvioModel = this._setModel(group, group.animations);
                
                // loader.scene.updateMatrixWorld(true);
                this.instance._modelCache.set(url, object);
            }
            resolve(this.instance._modelCache.get(url)!);
        });
    }

    private static async _loadOBJModel(url:string, resources:Record<string,string>={}):Promise<IvioModel>
    {
        return new Promise(async resolve=>
        {
            // if(!this.instance._modelCache.has(url))
            {
                const data = await new Promise<string>((resolve, reject) =>
                    new FileLoader().setResponseType('text').load(url, data => resolve(data as string), undefined, reject));
                const path = LoaderUtils.extractUrlBase(url);
                const manager = new LoadingManager();
                manager.resolveURL = url => {

                    console.log('resolveURL', {url})
                    let name = (url.split('/').pop() ?? url)?.toLowerCase()
                    return name ? resources[name] ?? url : url;
                }
                const objLoader = new OBJLoader(manager)
                const material = data.match(/mtllib (.*)/)?.[1]
                if (material) {
                    const materialsLoader = new MTLLoader(manager);
                    const materialsCreator =
                        await new Promise<MTLLoader.MaterialCreator>(
                            (resolve, reject) =>
                                materialsLoader.load(material, resolve, undefined, reject))
                    console.log({materialsCreator})
                    objLoader.setMaterials(materialsCreator)
                }
                const group = objLoader.parse(data);
                const object:IvioModel = this._setModel(group, group.animations);
                
                // loader.scene.updateMatrixWorld(true);
                this.instance._modelCache.set(url, object);
            }
            resolve(this.instance._modelCache.get(url)!);
        });
    }

    private static async _loadJSONModel(url:string):Promise<IvioModel>
    {
        return new Promise(async resolve=>
        {
            // if(!this.instance._modelCache.has(url))
            {
                const model = await new ObjectLoader().loadAsync(url);
                const object:IvioModel = this._setModel(model, []);
                
                // loader.scene.updateMatrixWorld(true);
                this.instance._modelCache.set(url, object);
            }
            resolve(this.instance._modelCache.get(url)!);
        });
    }

    private static async _getLoziModel(url:string,createInstance:boolean = false):Promise<IvioModel>
    {
        return new Promise(async resolve=>
        {
            // if(!this.instance._modelCache.has(url) || createInstance)
            {
                this.instance._modelCache.set(url,null);

                const data             = await lozi.loadAsync(url);
                const object:IvioModel = this._setModel(data.object,data.data.generatedAssets.animations);

                this.instance._modelCache.set(url,object);

                resolve(this.instance._modelCache.get(url)!);
            }

            if(!this.instance._modelCache.get(url))
            {
                await new Promise(res => 
                {
                    if(this.instance._modelCache.get(url))
                    {
                        res(true);
                    }
                });
            }

            // if(createInstance)
            // {
            //     const modelData               = this.instance._modelCache.get(url);
            //     const model                   = this._setModel(modelData.object,modelData.clips,true);
            //     (model.object as any).objects = lozi.LoziUtils.flattenHierarchy(model.object,'children');
            //     if(url.indexOf('Hunter')>-1)
            //     {
            //         console.log(model.object);
            //     }
            //     resolve(model);
            // }
            // else
            // {
            //     resolve(this.instance._modelCache.get(url));
            // }
        });
    }

    public static async getAudio(url:string):Promise<AudioBuffer>
    {
        url = this.getUrl(url);

        return new Promise(async resolve=>
        {
            if(!this.instance._audioCache.has(url))
            {
                const audio:AudioBuffer = await new AudioLoader().loadAsync(url);

                this.instance._audioCache.set(url,audio);
            }
            resolve(this.instance._audioCache.get(url)!);
        });
    }

    public static async getModel(url:string,createInstance:boolean = false, resources:Record<string,string>={}):Promise<IvioModel>
    {
        url = this.getUrl(url);
        
        let file = url.split('/').pop()!.split('?')[0]

        let modelData: IvioModel|null = null;
        if(file.endsWith('.gltf') || file.endsWith('.glb'))
        {
            modelData = await this._loadGLTFModel(url);
        }
        if(file.endsWith('.fbx'))
        {
            modelData = await this._loadFBXModel(url, resources);
        }
        if(file.endsWith('.obj'))
        {
            modelData = await this._loadOBJModel(url, resources);
        }
        if(file.endsWith('.json'))
        {
            modelData = await this._loadJSONModel(url);
        }
        if(file.endsWith('.lozi.js') || file.endsWith('.vio'))
        {
            modelData = await this._getLoziModel(url,createInstance);
        }

        modelData!.object.traverse(obj=>
        {
            //VioHelpers.Mesh.attachBakedGeometry(obj);
            if (obj.type == 'Bone') {
                modelData!.bones[obj.name] = (obj as Bone);
            }
            if (obj.type == 'Mesh' || obj.type == 'SkinnedMesh')
            {
                obj.castShadow    = true;
                obj.receiveShadow = true;

                this.updateMaterials(obj as Mesh); // testing only

                let material = (obj as any).material;

                if(Array.isArray(material))
                {
                    material.forEach((mat:Material)=>
                    {
                        //@ts-ignore
                        if(!modelData.materials.includes(mat))
                        {
                            //@ts-ignore
                            modelData.materials.push(mat);
                        }
                    });
                }
                else
                {
                    //@ts-ignore
                    if(!modelData.materials.includes(material))
                    {
                        //@ts-ignore
                        modelData.materials.push(material);
                    }
                }
            }
        });
        // console.log("MODELDATA",modelData);
        return modelData!;
    }

    private static updateMaterials(obj:Mesh | SkinnedMesh)
    {
        if(obj.type == 'Mesh' || obj.type == 'SkinnedMesh')
        {
            obj.castShadow    = true;
            obj.receiveShadow = true;

            let material = (obj as any).material;

            if(Array.isArray(material))
            {
                material.forEach((mat:any,index:number)=>
                {
                    if(
                        mat.type == "MeshMatcapMaterial" ||
                        mat.type == "MeshBasicMaterial"/* ||
                        mat.type == "MeshStandardMaterial"*/)
                    {
                        let newMat = new MeshPhysicalMaterial({
                            color: mat.color,
                            map: mat.map,
                            opacity: mat.opacity,
                            transparent: mat.transparent,
                            name: mat.name
                        });
				        (obj.material as any)[index] = newMat;
                    }
                    // fix for missing metalness sections in GLTF that results in metalness forced to 1 while loading
                    // if (mat.type == "MeshStandardMaterial") {
                        // mat.metalness = 0;
                    // }
                });
            }
            else
            {
                let mat:any   = obj.material;
                if(
                    mat.type == "MeshMatcapMaterial" ||
                    mat.type == "MeshBasicMaterial"/* ||
                    mat.type == "MeshStandardMaterial"*/)
                {
                    obj.material = new MeshPhysicalMaterial({
                        color: mat.color,
                        map: mat.map,
                        opacity: mat.opacity,
                        transparent: mat.transparent,
                        name: mat.name
                    });
                }
                // fix for missing metalness sections in GLTF that results in metalness forced to 1 while loading
                // if (mat.type == "MeshStandardMaterial" && mat.metalness == 1) {
                    // mat.metalness = 0;
                // }
            }
        }
    }

    public static async getAsset(url:string,progress?:(progress:number,status:string,canRender:boolean)=>void):Promise<any>
    {
        url = this.getUrl(url);
        
        const resp = await VioHelpers.Ajax.getDataAsync(url,'GET');

        return await VioGenerator.generateAsset(resp.data,progress);
    }

    public static set urlPrefix(val:string)
    {
        this.instance._urlPrefix = val;
    }

    public static get urlPrefix()
    {
        return this.instance._urlPrefix ? this.instance._urlPrefix : '';
    }
}