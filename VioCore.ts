export { VioScene                   } from "./VioSource/Objects/VioScene/VioScene";
export { VioObject                  } from "./VioSource/Objects/VioObject/VioObject";
export { VioRender                  } from "./VioSource/Singletons/Render/VioRender";
export { VioEditMode                } from "./VioSource/Singletons/EditMode/VioEditMode";
export { VioInput                   } from "./VioSource/Singletons/Input/VioInput";
export { VioEvents                  } from "./VioSource/Singletons/Events/VioEvents";
export { VioPathFinding             } from "./VioSource/Singletons/Pathfinding/VioPathFinding";
export * from "./VioSource/Singletons/PostProcessing/VioPostProcessing";
export { VioRaycast                 } from "./VioSource/Singletons/Raycast/VioRaycast";
export { VioSettings                } from "./VioSource/Singletons/Settings/VioSettings";
export { VioScenario                } from "./VioSource/Singletons/Scenarios/Scenario/VioScenario";
export { VioScenarioActionBase      } from "./VioSource/Singletons/Scenarios/Scenario/_Base/VioScenarioActionBase";
export { VioScenarioTriggerBase     } from "./VioSource/Singletons/Scenarios/Scenario/_Base/VioScenarioTriggerBase";
export { VioScenarioConditionBase   } from "./VioSource/Singletons/Scenarios/Scenario/_Base/VioScenarioConditionBase";
export { VioResources               } from "./VioSource/Singletons/Resources/VioResources";
import { GLTFLoaderX                } from "./VioSource/Singletons/Resources/GLTFLoaderX";
export { GLTFLoaderX                } from "./VioSource/Singletons/Resources/GLTFLoaderX";
export { VioScenarioRegistry        } from "./VioSource/Singletons/Registry/VioScenarioRegistry";
export { VioComponent               } from "./VioSource/Components/Base/VioComponent";
export { VioComponentRegistry       } from "./VioSource/Singletons/Registry/VioComponentRegistry";
export { VioCameraComponentRegistry } from "./VioSource/Singletons/Registry/VioCameraComponentRegistry";
export { VioTasksRegistry           } from "./VioSource/Singletons/Registry/VioTasksRegistry";
export { VioHudElementsRegistry     } from "./VioSource/Singletons/Registry/VioHudElementsRegistry";
export { VioHud                     } from "./VioSource/Singletons/Hud/VioHud";
export { VioScenarios               } from "./VioSource/Singletons/Scenarios/VioScenarios";
export { VioIconGenerator           } from "./VioSource/Singletons/Render/VioIconGenerator";
export { VioCamera                  } from "./VioSource/Singletons/Render/Camera/VioCamera";
export { VioHelpers                 } from "./VioSource/Helpers/VioHelpers";
export { VioGenerator               } from "./VioSource/Helpers/VioGenerator";
export { MeshComponent              } from "./VioSource/Components/MeshComponent";
export { DialogueComponent          } from "./VioSource/Components/DialogueComponent";
export { LightComponent             } from "./VioSource/Components/LightComponent";
export { ZoneComponent              } from "./VioSource/Components/ZoneComponent";
export { ExtensionComponent         } from "./VioSource/Components/ExtensionComponent";
export { AnimationComponent, ObjectBindings } from "./VioSource/Components/AnimationComponent";
export { AnimationStatesComponent   } from "./VioSource/Components/AnimationStatesComponent";
export { SelectionManager           } from "./VioSource/Singletons/EditMode/Selection/SelectionManager";
export { ObjectSelection            } from "./VioSource/Singletons/EditMode/Selection/ObjectSelection";
export { TriggerTask                } from "./VioSource/Objects/VioTasks/VioTask/TaskObject/TriggerTask";
export { VioHudElement              } from './VioSource/Objects/VioHud/Elements/VioHudElement';
export { VioHudImage                } from './VioSource/Objects/VioHud/Elements/VioHudImage';
export { VioHudText                 } from './VioSource/Objects/VioHud/Elements/VioHudText';
export { VioHudCursor               } from './VioSource/Objects/VioHud/VioHudCursor';
export { VioHudDialogPanel          } from './VioSource/Objects/VioHud/VioHudDialogPanel';
export { VioAnimationGenerator      } from './VioSource/Helpers/VioAnimationGenerator';

export * as Stats from "three/examples/jsm/libs/stats.module.js"
export { TransformControls          } from "./Libs/controls/TransformControls";
export { OrbitControls              } from "three/examples/jsm/controls/OrbitControls";
// export { GLTFLoader                 } from "./three/GLTFLoader";
export { FBXLoader                  } from "three/examples/jsm/loaders/FBXLoader";
export { OBJLoader                  } from "three/examples/jsm/loaders/OBJLoader";
export { OBJExporter                } from "three/examples/jsm/exporters/OBJExporter";
export { GLTFLoader                 } from "three/examples/jsm/loaders/GLTFLoader.js";
export { RGBELoader                 } from "three/examples/jsm/loaders/RGBELoader.js";
export { KTX2Loader                 } from "three/examples/jsm/loaders/KTX2Loader";
export { DRACOLoader                } from 'three/examples/jsm/loaders/DRACOLoader.js';
export { VRButton                   } from 'three/examples/jsm/webxr/VRButton.js';
export { ConvexObjectBreaker        } from 'three/examples/jsm/misc/ConvexObjectBreaker.js';
export { Gyroscope                  } from 'three/examples/jsm/misc/Gyroscope.js';
export { ConvexHull                 } from 'three/examples/jsm/math/ConvexHull.js';
export { Lut                        } from 'three/examples/jsm/math/Lut.js';
export { MeshSurfaceSampler         } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
export { OBB                        } from 'three/examples/jsm/math/OBB.js';
export { ConvexGeometry             } from 'three/examples/jsm/geometries/ConvexGeometry.js';
export { DecalGeometry              } from 'three/examples/jsm/geometries/DecalGeometry.js';


export * from 'three/examples/jsm/postprocessing/AfterimagePass';
export * from 'three/examples/jsm/postprocessing/CubeTexturePass';
export * from 'three/examples/jsm/postprocessing/GlitchPass';
export * from 'three/examples/jsm/postprocessing/MaskPass';
export * from 'three/examples/jsm/postprocessing/RenderPass';
export * from 'three/examples/jsm/postprocessing/SSAARenderPass';
export * from 'three/examples/jsm/postprocessing/ShaderPass';
export * from 'three/examples/jsm/postprocessing/BloomPass';
export * from 'three/examples/jsm/postprocessing/DotScreenPass';
export * from 'three/examples/jsm/postprocessing/HBAOPass';
export * from './Libs/postprocessing/OutlinePass';
export * from 'three/examples/jsm/postprocessing/RenderPixelatedPass';
export * from 'three/examples/jsm/postprocessing/SSAOPass';
export * from 'three/examples/jsm/postprocessing/TAARenderPass';
export * from 'three/examples/jsm/postprocessing/BokehPass';
export * from 'three/examples/jsm/postprocessing/EffectComposer';
export * from 'three/examples/jsm/postprocessing/HalftonePass';
export * from 'three/examples/jsm/postprocessing/OutputPass';
export * from 'three/examples/jsm/postprocessing/SAOPass';
export * from 'three/examples/jsm/postprocessing/SSRPass';
export * from 'three/examples/jsm/postprocessing/TexturePass';
export * from 'three/examples/jsm/postprocessing/ClearPass';
export * from 'three/examples/jsm/postprocessing/FilmPass';
export * from 'three/examples/jsm/postprocessing/LUTPass';
export * from 'three/examples/jsm/postprocessing/Pass';
export * from 'three/examples/jsm/postprocessing/SMAAPass';
export * from 'three/examples/jsm/postprocessing/SavePass';
export * from 'three/examples/jsm/postprocessing/UnrealBloomPass';


export * from 'three/examples/jsm/shaders/ACESFilmicToneMappingShader';
export * from 'three/examples/jsm/shaders/ColorifyShader';
export * from 'three/examples/jsm/shaders/FilmShader';
export * from 'three/examples/jsm/shaders/HueSaturationShader';
export * from 'three/examples/jsm/shaders/RGBShiftShader';
export * from 'three/examples/jsm/shaders/ToonShader';
export * from 'three/examples/jsm/shaders/AfterimageShader';
export * from 'three/examples/jsm/shaders/ConvolutionShader';
export * from 'three/examples/jsm/shaders/FocusShader';
export * from 'three/examples/jsm/shaders/KaleidoShader';
export * from 'three/examples/jsm/shaders/SAOShader';
export * from 'three/examples/jsm/shaders/TriangleBlurShader';
export * from 'three/examples/jsm/shaders/BasicShader';
export * from 'three/examples/jsm/shaders/CopyShader';
export * from 'three/examples/jsm/shaders/FreiChenShader';
export * from 'three/examples/jsm/shaders/LuminosityHighPassShader';
export * from 'three/examples/jsm/shaders/SMAAShader';
export * from 'three/examples/jsm/shaders/UnpackDepthRGBAShader';
export * from 'three/examples/jsm/shaders/BleachBypassShader';
export * from 'three/examples/jsm/shaders/DOFMipMapShader';
export * from 'three/examples/jsm/shaders/GammaCorrectionShader';
export * from 'three/examples/jsm/shaders/LuminosityShader';
export * from 'three/examples/jsm/shaders/SSAOShader';
export * from 'three/examples/jsm/shaders/VelocityShader';
export * from 'three/examples/jsm/shaders/BlendShader';
export * from 'three/examples/jsm/shaders/DepthLimitedBlurShader';
export * from 'three/examples/jsm/shaders/GodRaysShader';
export * from 'three/examples/jsm/shaders/MMDToonShader';
export * from 'three/examples/jsm/shaders/SSRShader';
export * from 'three/examples/jsm/shaders/VerticalBlurShader';
export * from 'three/examples/jsm/shaders/BokehShader';
export * from 'three/examples/jsm/shaders/DigitalGlitch';
export * from 'three/examples/jsm/shaders/HBAOShader';
export * from 'three/examples/jsm/shaders/MirrorShader';
export * from 'three/examples/jsm/shaders/SepiaShader';
export * from 'three/examples/jsm/shaders/VerticalTiltShiftShader';
// export * from 'three/examples/jsm/shaders/BokehShader2';
export * from 'three/examples/jsm/shaders/DotScreenShader';
export * from 'three/examples/jsm/shaders/HalftoneShader';
export * from 'three/examples/jsm/shaders/NormalMapShader';
export * from 'three/examples/jsm/shaders/SobelOperatorShader';
export * from 'three/examples/jsm/shaders/VignetteShader';
export * from 'three/examples/jsm/shaders/BrightnessContrastShader';
export * from 'three/examples/jsm/shaders/ExposureShader';
export * from 'three/examples/jsm/shaders/HorizontalBlurShader';
export * from 'three/examples/jsm/shaders/OutputShader';
export * from 'three/examples/jsm/shaders/SubsurfaceScatteringShader';
export * from 'three/examples/jsm/shaders/VolumeShader';
export * from 'three/examples/jsm/shaders/ColorCorrectionShader';
export * from 'three/examples/jsm/shaders/FXAAShader';
export * from 'three/examples/jsm/shaders/HorizontalTiltShiftShader';
export * from 'three/examples/jsm/shaders/PoissonDenoiseShader';
export * from 'three/examples/jsm/shaders/TechnicolorShader';
export * from 'three/examples/jsm/shaders/WaterRefractionShader';
export * from 'three/examples/jsm/csm/CSM';
export * from 'three/examples/jsm/csm/CSMHelper';
export {Text} from 'troika-three-text'

import { ConvexObjectBreaker        } from 'three/examples/jsm/misc/ConvexObjectBreaker.js';
// console.log({ConvexObjectBreaker})

export { LightningStrike } from './Libs/LightningStrike'
export { LightningStorm } from './Libs/LightningStorm'

// let initWebGPU = async () => {
//     let {WebGPU} = await require('three/examples/jsm/capabilities/WebGPU.js');
//     let {WebGPURenderer} = await require('three/examples/jsm/renderers/webgpu/WebGPURenderer.js');
//     return {WebGPU, WebGPURenderer}
// }

// export { initWebGPU }

// export { MeshoptDecoder             } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

export { Howl, Howler } from 'howler'

// export { MeshoptEncoder, MeshoptDecoder, MeshoptSimplifier } from './Libs/meshoptimizer/js/index'

// export { Lightmap } from './Lightmap'

export * as THREE from "three"
import * as THREE from "three"

console.log("THREE.REVISION", THREE.REVISION)

Object.defineProperty(THREE.Object3D, "_position", {
    get: function() {
        return this.position
    },
    set: function(position: THREE.Vector3) {
        this.position = position
    }
});

THREE.Skeleton.prototype.getBoneByName = function(name) {
    let stripPrefix = (name:string) =>
        name.startsWith('mixamorig:') ? name.slice('mixamorig:'.length) :
        name.startsWith('mixamorig') ? name.slice('mixamorig'.length) : name;
    return (
        this.bones.find(bone => bone.name == name) ??
        this.bones.find(bone => bone.name.toLowerCase() == name.toLowerCase()) ??
        this.bones.find(bone => stripPrefix(bone.name) == stripPrefix(name))
        );
}


class FileCache {
    private static _instance: FileCache ;
    public static get instance(): FileCache {
        if (FileCache._instance == null)
            FileCache._instance = new FileCache()
        return FileCache._instance
    }
    public static put(url:string, data:string | ArrayBuffer) {
        return FileCache.instance._put(url, data)
    }
    public static get(url:string): Promise<string | ArrayBuffer> {
        return FileCache.instance._get(url)
    }
    private _db: Promise<IDBDatabase>;
    private constructor() {
        this._db = new Promise((resolve, reject) => {
            // return reject('failed')
            let request = window.indexedDB.open('FileCache', 1)
            request.onerror = e => {
                console.warn('failed to open indexed db')
                reject(e)
            }
            request.onsuccess = e => {
                let db = (e.target as any).result
                resolve(db)
            }
            request.onupgradeneeded = e => {
                let db = (e.target as any).result
                db.createObjectStore('files')
            }
        })
    }
    private async _put(url:string, data:string | ArrayBuffer) {
        let db = await this._db
        return await new Promise((resolve, reject) => {
            let request = db
                .transaction(['files'], 'readwrite')
                .objectStore('files')
                .put(data, url)
            request.onerror = e => reject(e)
            request.onsuccess = e => resolve((e.target as any).result)
        })
    }
    private async _get(url:string):Promise<string | ArrayBuffer> {
        let db = await this._db
        return await new Promise((resolve, reject) => {
            let request = db
                .transaction(['files'], 'readonly')
                .objectStore('files')
                .get(url)
            request.onerror = e => reject(e)
            request.onsuccess = e => resolve((e.target as any).result)
        })
    }
}

export {FileCache}

function blobToDataURL(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = _e => resolve(reader.result as string);
        reader.onerror = _e => reject(reader.error);
        reader.onabort = _e => reject(new Error("Read aborted"));
        reader.readAsDataURL(blob);
    });
}

let FileLoaderLoad = THREE.FileLoader.prototype.load
THREE.FileLoader.prototype.load = function (url, onLoad, onProgress, onError) {
    if (url.startsWith('http://') || url.startsWith('https://'))
        FileCache.get(url)
            .then((data: string | ArrayBuffer) => {
                if (data === undefined) {
                    FileLoaderLoad.call(this, url, data => {
                        FileCache.put(url, data)
                        if (onLoad)
                            onLoad(data)
                    }, onProgress, onError)
                }
                else {
                    if (onLoad)
                        onLoad(data)
                }
            })
            .catch(e => {
                FileLoaderLoad.call(this, url, onLoad, onProgress, onError)
            })
    else
        FileLoaderLoad.call(this, url, onLoad, onProgress, onError)
}

let ImageLoaderLoad = THREE.ImageLoader.prototype.load
THREE.ImageLoader.prototype.load = function ( url, onLoad, onProgress, onError ) {
    // console.log("ImageLoader.load", url)
    url = this.manager.resolveURL(url) ?? url;
    if (window.location.hostname.endsWith('.discordsays.com')) {
        let prefix = 'https://app.cinevva.com/'
        if (url.startsWith(prefix))
            url = url.slice(prefix.length-1)
    }
    if (window.location.hostname == 'localhost') {
        let prefix = 'https://app.cinevva.com/'
        if (url.startsWith(prefix + 'sfx'))
            url = url.slice(prefix.length-1)
    }
    let image = document.createElement('img') as HTMLImageElement
    image.crossOrigin = 'anonymous';
    (image as any).url = url
    let onImageLoad = () => {
        removeEventListeners()
        if (onLoad) onLoad(image)
    }
    let onImageError = (event:Event) => {
        console.log('failed to load image', url)
        removeEventListeners()
        if (onError) onError(event)
    }
    let removeEventListeners = () => {
        image.removeEventListener('load', onImageLoad, false)
        image.removeEventListener('error', onImageError, false)
    }
    image.addEventListener('load', onImageLoad, false)
    image.addEventListener('error', onImageError, false)

    if (url.startsWith('http://') || url.startsWith('https://'))
        FileCache.get(url)
            .then(async (data:string|ArrayBuffer) => {
                if (data === undefined) {
                    try {
                        let res = await fetch(url)
                        let blob = await res.blob()
                        data = await blobToDataURL(blob)
                        try {
                            await FileCache.put(url, data)
                        }
                        catch(ex) {
                            console.log("failed to put", url, "to cache:", ex)
                        }
                        image.src = data as string
                    }
                    catch (ex) {
                        image.src = url    
                    }
                }
                else {
                    image.src = data as string
                }
            })
            .catch(e => image.src = url)
    else
        image.src = url
    return image
}

let TextureLoaderLoad = THREE.TextureLoader.prototype.load
THREE.TextureLoader.prototype.load = function (url, onLoad, onProgress, onError) {
    // console.log("TextureLoader.load", url)
    if (url.endsWith('.ktx2') || url.startsWith('data:image/ktx2;'))
        return GLTFLoaderX.ktx2Loader.load(url, onLoad, onProgress, onError)
    else if (url.endsWith('.ktx') || url.startsWith('data:image/ktx;'))
        return GLTFLoaderX.ktxLoader.load(url, onLoad, onProgress, onError)
    else
        return TextureLoaderLoad.call(this, url, onLoad, onProgress, onError)
};


let PropertyBindingFindNode = THREE.PropertyBinding.findNode
THREE.PropertyBinding.findNode = (root, nodeName) => {
    let target = PropertyBindingFindNode(root, nodeName)
    if (!target) {
        if (nodeName == 'root' || nodeName == 'Root')
            target = root
    }
    return target
}

let getAnimationClipData = async (clip: THREE.AnimationClip) => {
    let buffers = [] as Array<Float32Array>;
    let length = 0
    let pushBuffer = (buffer:Float32Array) => {
        buffers.push(buffer)
        length += buffer.length
    }
    let tracks = clip.tracks.map((track: THREE.KeyframeTrack) => {
        let offset = length
        pushBuffer(track.times)
        pushBuffer(track.values)
        return {
            type: track.ValueTypeName,
            name: track.name,
            offset,
            length: track.times.length
        }
    })
    let blob = new Blob(buffers, {type: 'application/octet-stream'})
    let data = await new Promise<string>(resolve => {
        let reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = () => resolve(reader.result as string)
    })
    return {
        name: clip.name,
        duration: clip.duration,
        tracks,
        buffers: data,
    }
}

let setAnimationClipDataData = async (clip: THREE.AnimationClip, data:any) => {
    clip.name = data.name
    clip.duration = data.duration
    let buffers = new Float32Array(await fetch(data.buffers).then(res => res.arrayBuffer()) as ArrayBuffer)
    // console.log(buffers)
    clip.tracks = []
    data.tracks.forEach((track:any) => {
        let name = track.name
        let type = track.type
        let length = track.length
        let buffer = buffers.slice(track.offset)
        let stride = 1
        switch (type) {
        case 'vector':      stride = 3; break
        case 'color':       stride = 4; break
        case 'quaternion':  stride = 4; break
        }
        let times = buffer.slice(0, length)
        let values = buffer.slice(length).slice(0, length * stride)
        switch (type) {
        case 'vector':
            clip.tracks.push(new THREE.VectorKeyframeTrack(name, times, values))
            break
        case 'color':
            clip.tracks.push(new THREE.ColorKeyframeTrack(name, times, values))
            break
        case 'quaternion':
            clip.tracks.push(new THREE.QuaternionKeyframeTrack(name, times, values))
            break
        }
    })
}

export {
    getAnimationClipData,
    setAnimationClipDataData
}