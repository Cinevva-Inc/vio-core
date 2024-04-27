import { LineBasicMaterial, SpriteMaterial, TextureLoader } from "three";

export class VioEditorSettings
{
    // public materials = 
    // {
    //     panMaterialZ     : new SpriteMaterial   ( {depthTest:false, depthWrite:false, sizeAttenuation:false, transparent:true, map:new TextureLoader().load('/assets/tools/editor/icons/panZ.png' )}),
    //     panMaterial      : new SpriteMaterial   ( {depthTest:false, depthWrite:false, sizeAttenuation:false, transparent:true, map:new TextureLoader().load('/assets/tools/editor/icons/pan.png'  )}),
    //     rotationMaterial : new SpriteMaterial   ( {depthTest:false, depthWrite:false, sizeAttenuation:false, transparent:true, map:new TextureLoader().load('/assets/tools/editor/icons/rot.png'  )}),
    //     scaleMaterial    : new SpriteMaterial   ( {depthTest:false, depthWrite:false, sizeAttenuation:false, transparent:true, map:new TextureLoader().load('/assets/tools/editor/icons/scale.png')}),
    //     lightMaterial    : new SpriteMaterial   ( {depthTest:false, depthWrite:false, sizeAttenuation:true,  transparent:true, map:new TextureLoader().load('/assets/tools/editor/icons/light.png')}),
    //     gridMaterial     : new LineBasicMaterial( { color: 0xffffff,linewidth:1, depthTest:true,  depthWrite:false}),
    //     lineMaterial     : new LineBasicMaterial( { color: 0xffffff,linewidth:1, depthTest:false, depthWrite:false}),
    //     hudColor         : '#ff0000',
    //     gridColor        : '#555555'
    // }

    // public keys = 
    // {
    //     controlsUniversal:['T'],
    //     controlsSpace    :['Q'],
    //     controlsTranslate:['W'],
    //     controlsRotate   :['E'],
    //     controlsScale    :['R'],
    //     childSelect      :['ALTLEFT'],
    //     multiSelect      :['SHIFTLEFT'],
    //     setPivot         :['Z'],
    //     groupObjects     :[['CONTROLLEFT','G'],['METALEFT','G'],['OSLEFT','G']],
    //     delete           :[['BACKSPACE'],['DELETE']],
    //     undo             :[['CONTROLLEFT','Z'],['METALEFT','Z'],['OSLEFT','Z']],
    //     redo             :[['CONTROLLEFT','Y'],['METALEFT','Y'],['OSLEFT','Y']]
    // }

    // public spawnSize:{min:number,max:number};

    // constructor()
    // {
    //     this.hudColor  = this.hudColor;
    //     this.gridColor = this.gridColor;
    //     this.spawnSize = {min:10,max:50};
    // }

    // public get gridColor()
    // {
    //     return this.materials.gridColor;
    // }
    
    // public set gridColor(colorHex:string)
    // {
    //     let hex = parseInt(colorHex[0] == '#' ? colorHex.slice(1,7) : colorHex,16);

    //     this.materials.gridColor = colorHex;

    //     this.materials.gridMaterial.color.setHex(hex);
    // }

    // public get hudColor()
    // {
    //     return this.materials.hudColor;
    // }
    
    // public set hudColor(colorHex:string)
    // {
    //     let hex = parseInt(colorHex[0] == '#' ? colorHex.slice(1,7) : colorHex,16);

    //     this.materials.hudColor = colorHex;

    //     this.materials.panMaterialZ    .color.setHex(hex);
    //     this.materials.panMaterial     .color.setHex(hex);
    //     this.materials.rotationMaterial.color.setHex(hex);
    //     this.materials.scaleMaterial   .color.setHex(hex);
    //     this.materials.lineMaterial    .color.setHex(hex);
    // }

    // public static get data()
    // {
    //     const obj:Array<any> = [];

    //     return obj;
    // }
}