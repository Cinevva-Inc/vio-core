import { LineBasicMaterial, SpriteMaterial, TextureLoader } from "three";
import { VioEditorSettings } from './VioEditorSettings';

export class VioSettings
{
    private static _instance:VioSettings;

    private editMode:VioEditorSettings;

    private constructor()
    {
        this.editMode = new VioEditorSettings();
    }

    public static get editMode()
    {
        return this.instance.editMode;
    }

    public static get data()
    {
        const obj:Array<any> = [];

        return obj;
    }

    private static get instance():VioSettings
    {
        if(!VioSettings._instance)
        {
            VioSettings._instance = new VioSettings();
        }
        return VioSettings._instance;
    }
}