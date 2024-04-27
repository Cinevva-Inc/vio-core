import { GLTFLoader } from "../../../three/GLTFLoader.js";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { KTXLoader } from "three/examples/jsm/loaders/KTXLoader";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { VioRender } from '../../Singletons/Render/VioRender';

export class GLTFLoaderX {
    private _loader: GLTFLoader;
    private _ktxLoader: KTXLoader;
    private _ktx2Loader: KTX2Loader;
    private _dracoLoader: DRACOLoader;
    private static _instance: GLTFLoaderX|null = null;

    constructor() {
        this._loader = new GLTFLoader();
        // this._loader.withCredentials = true;
        this._dracoLoader = new DRACOLoader();
        this._dracoLoader.setDecoderPath('/assets/draco/');
        this._loader.setDRACOLoader(this._dracoLoader);
        this._ktxLoader = new KTXLoader();
        this._ktx2Loader = new KTX2Loader();
        this._ktx2Loader.setTranscoderPath('/assets/basis/');
        this._ktx2Loader.detectSupport(VioRender.renderer);
        this._loader.setKTX2Loader(this._ktx2Loader);
        this._loader.setMeshoptDecoder(MeshoptDecoder);
    }

    public static get instance(): GLTFLoaderX {
        if (this._instance == null)
            this._instance = new GLTFLoaderX()
        return this._instance
    }

    public static loadAsync(path:string) {
        return this.instance._loader.loadAsync(path)
    }

    public static parseAsync(data:any, path:string) {
        return this.instance._loader.parseAsync(data, path)
    }

    public static get ktxLoader(): KTXLoader {
        return this.instance._ktxLoader;
    }

    public static get ktx2Loader(): KTX2Loader {
        return this.instance._ktx2Loader;
    }

    public static get dracoLoader(): DRACOLoader {
        return this.instance._dracoLoader;
    }
}