import Libraries from '../../Libraries';
import LoziUtils from './../../../Helpers/LoziUtils';
import ParallaxEnv from './ParallaxEnv';

export default class ThreeMaterial
{
    static generateMaterials(materialData,data)
    {
        var materials = [];
        for(var num = 0; num < materialData.length; num++)
        {
            let matData = materialData[num]
            if (matData.type == 0 ||
                matData.type == 1)
                matData.type = 2;
            if (matData._SpecColor !== undefined && matData.type == 2)
                matData.type = 3;
            var material = this.generateMaterial(matData,data);
            if(material)
            {
                materials.push(material);
            }
        }
        return materials;
    }

    static generateMaterial(matData,data)
    {
        var material;

        switch(matData.type)
        {
            case 0:{material = new Libraries.ThreeObject.MeshBasicMaterial   (); break;}
            case 1:{material = new Libraries.ThreeObject.MeshMatcapMaterial  (); break;}
            case 2:{material = new Libraries.ThreeObject.MeshStandardMaterial(); break;}
            case 3:{material = new Libraries.ThreeObject.MeshPhysicalMaterial(); break;}
            case 4:{material = new Libraries.ThreeObject.MeshPhongMaterial   (); break;}
            case 5:{material = new Libraries.ThreeObject.MeshLambertMaterial (); break;}
        }
        
        if(material)
        {

            material.matId 		  = matData.id;
            material.name  		  = matData.name;
            material.materialSide = matData.side;
            material.userData     = matData;

            material.side = (material.materialSide == 0) ? Libraries.ThreeObject.FrontSide  :
                            (material.materialSide == 1) ? Libraries.ThreeObject.BackSide   :
                            (material.materialSide == 2) ? Libraries.ThreeObject.DoubleSide :  Libraries.ThreeObject.FrontSide;

            if(matData.properties)
            {
                let offset = new Libraries.ThreeObject.Vector2(0,0)
                let repeat = new Libraries.ThreeObject.Vector2(1,1)

                if (matData.properties.mainTextureOffsetX !== undefined) {
                    offset.set(
                        matData.properties.mainTextureOffsetX,
                        matData.properties.mainTextureOffsetY)
                    repeat.set(
                        matData.properties.mainTextureScaleX,
                        matData.properties.mainTextureScaleY)
                }

                let loadMap = (dst, src) => {
                    if (material[dst] !== undefined && matData.properties[src]) {
                        material[dst] = LoziUtils.getObjectByProperty(
                            data.generatedAssets.textures,
                            'texID',
                            matData.properties[src]);
                        return true;
                    }
                    else return false;
                }

                let loadColor = (dst, src) => {
                    if (material[dst] !== undefined && matData.properties[src] !== undefined) {
                        material[dst] = new Libraries.ThreeObject.Color(
                            matData.properties[src][0],
                            matData.properties[src][1],
                            matData.properties[src][2]);
                        return true;
                    }
                    else return false;
                }

                let loadFloat = (dst, src) => {
                    if (material[dst] !== undefined && matData.properties[src] !== undefined) {
                        material[dst] = matData.properties[src];
                        return true;
                    }
                    else return false;
                }

                let loadCustom = (src, f) => {
                    if (matData.properties[src] !== undefined) {
                        f(matData.properties[src]);
                        return true;
                    }
                    else return false;
                }


                loadColor('color', '_Color')

                loadMap('map', '_MainTex')

                loadMap('lightMap', '_LightMap')

                loadMap('aoMap', '_OcclusionMap')
                loadFloat('aoMapIntensity', '_OcclusionStrength')

                if (loadMap('emissiveMap', '_Illum') ||
                    loadMap('emissiveMap',  '_EmissionMap'))
                {
                    material.emissive = new Libraries.ThreeObject.Color(1,1,1);
                }

                loadColor('emissive', '_EmissionColor')

                loadMap('normalMap', '_BumpMap')
                loadCustom('_BumpScale', (x) => {
                    material.normalScale.set(x,x);
                })

                loadMap('normalMap', '_NormalMap')

                if (loadMap('metalnessMap', '_MetallicGlossMap')) {
                    material.metalness = 1;
                }
                else {
                    loadFloat('metalness', '_Metallic')
                }

                loadMap('roughnessMap', '_RoughnessMap')

                if (loadMap('lightMap', 'lightMap') || loadMap('lightMap', '_LightMap')) {
                    if (matData.properties.lightMapOffsetX !== undefined) {
                        material.lightMap.offset.set(
                            matData.properties.lightMapOffsetX,
                            matData.properties.lightMapOffsetY);
                        material.lightMap.repeat.set(
                            matData.properties.lightMapScaleX,
                            matData.properties.lightMapScaleY);
                    }
                    material.lightMap.channel = 2;
                    material.lightMapIntensity = 2;
                }

                loadFloat('lightMapIntensity', '_LightMapIntensity')

                if (loadFloat('opacity', 'transparency')) {
                }
                else if (material.name.startsWith('Glass')) {
                    material.opacity = 0.5;
                }
                material.transparent = material.opacity < 1;

                loadMap('transparentMap', 'transparentMap')

                loadMap('specularMap', 'specularMap')
                loadColor('specularColor', '_SpecColor')

                loadFloat('bumpMapScale', '_BumpScale')

                loadMap('matcap', '_MatCap')

                loadCustom('_Smoothness', x => {
                    material.roughness = 1 - x;
                })



                /*if(matData.type!=0)
                {
                    if(matData.properties._useParallaxMapping == 1)
                    {
                        ParallaxEnv.setMaterialAsParallax(material);
                    }
                    if(matData.properties._LightMap)
                    {
                        material.lightMap = LoziUtils.getObjectByProperty(data.generatedAssets.textures,'texID',matData.properties._LightMap);
                    }
                    if(matData.properties._OcclusionMap)
                    {
                        material.aoMap = LoziUtils.getObjectByProperty(data.generatedAssets.textures,'texID',matData.properties._OcclusionMap);
                    }
                    if(matData.properties._EmissionMap)
                    {
                        material.emissiveMap = LoziUtils.getObjectByProperty(data.generatedAssets.textures,'texID',matData.properties._EmissionMap);
                    }
                    if(matData.properties._EmissionColor)
                    {
                        material.emissive = new Libraries.ThreeObject.Color(
                            matData.properties._EmissionColor[0],
                            matData.properties._EmissionColor[1],
                            matData.properties._EmissionColor[2]);
                    }
                    if(matData.properties._BumpMap)
                    {
                        material.normalMap    = LoziUtils.getObjectByProperty(data.generatedAssets.textures,'texID',matData.properties._BumpMap);
                    }
                    if(matData.properties._Illum)
                    {
                        material.emissiveMap = LoziUtils.getObjectByProperty(data.generatedAssets.textures,'texID',matData.properties._Illum);
                        material.emissive = new Libraries.ThreeObject.Color(1,1,1);
                    }
                    if(matData.properties._MetallicGlossMap)
                    { 
                        material.metalnessMap = LoziUtils.getObjectByProperty(data.generatedAssets.textures,'texID',matData.properties._MetallicGlossMap);
                    }
                    if(matData.properties._MetalnessMap)
                    { 
                        material.metalnessMap = LoziUtils.getObjectByProperty(data.generatedAssets.textures,'texID',matData.properties._MetalnessMap);
                    }
                    if(matData.properties._RoughnessMap)
                    { 
                        material.roughnessMap = LoziUtils.getObjectByProperty(data.generatedAssets.textures,'texID',matData.properties._RoughnessMap);
                    }
                    if(matData.properties._NormalMap)
                    {
                        material.normalMap = LoziUtils.getObjectByProperty(data.generatedAssets.textures,'texID',matData.properties._NormalMap);
                    }
                    if(matData.properties.lightMap)
                    {
                        material.lightMap = LoziUtils.getObjectByProperty(data.generatedAssets.textures,'texID',matData.properties.lightMap);
                        if (matData.properties.lightMapOffsetX !== undefined) {
                            material.lightMap.offset.set(
                                matData.properties.lightMapOffsetX,
                                matData.properties.lightMapOffsetY);
                            material.lightMap.repeat.set(
                                matData.properties.lightMapScaleX,
                                matData.properties.lightMapScaleY);
                        }
                        material.lightMap.channel = 2;
                        material.lightMapIntensity = 2;
                    }
                    // if(matData.properties._LightMap)
                    // {
                    //     material.lightMap = LoziUtils.getObjectByProperty(data.generatedAssets.textures,'texID',matData.properties._LightMap);
                    // }
                    // if(matData.properties._LightMapIntensity)
                    // {
                    //     material.lightMapIntensity = matData.properties._LightMapIntensity;
                    // }
                }
                if(matData.properties._Cube)
                {
                    material.envMap = LoziUtils.getObjectByProperty(data.generatedAssets.textures,'texID',matData.properties._Cube);
                    material.metalness = 1;
                }
                if(matData.properties._ReflectColor)
                {
                    material.envMapIntensity = matData.properties._ReflectColor[3];
                }
                if(matData.properties._Color)
                {
                    material.color = new Libraries.ThreeObject.Color(matData.properties._Color[0],matData.properties._Color[1],matData.properties._Color[2]);
                }
                if(matData.properties._Metallic)
                {
                    material.metalness = matData.properties._Metallic;
                }
                if (material.metalnessMap) {
                    material.metalness = 1; 
                }
                if(matData.properties._Smoothness !== undefined)
                {
                    material.roughness = 1 - matData.properties._Smoothness;
                }
                if(matData.properties._MainTex)
                {
                    material.map = LoziUtils.getObjectByProperty(data.generatedAssets.textures,'texID',matData.properties._MainTex);
                }
                if(matData.properties.transparency)
                {
                    material.transparent = matData.properties.transparency<1;
                    material.opacity = matData.properties.transparency;
                }
                if(matData.properties.transparentMap)
                {
                    material.transparent = true;
                    material.alphaMap = LoziUtils.getObjectByProperty(data.generatedAssets.textures,'texID',matData.properties.transparentMap);
                }
                if(matData.properties.specularMap)
                {
                    material.specularMap = LoziUtils.getObjectByProperty(data.generatedAssets.textures,'texID',matData.properties.specularMap);
                    // material.specular = LoziUtils.getObjectByProperty(data.generatedAssets.textures,'texID',matData.properties.specularMap);
                }
                if(matData.properties._BumpScale)
                {
                    material.bumpMapScale = matData.properties._BumpScale;
                }
                if(matData.properties._MatCap)
                {
                    material.matcap = LoziUtils.getObjectByProperty(data.generatedAssets.textures,'texID',matData.properties._MatCap);
                }
                // console.log(matData.properties);
                */
                material.morphTargets = true;

                for (let key of Object.keys(material)) {
                    if ((key == 'map' || key.endsWith('Map')) && key != 'lightMap' && material[key]) {
                        material[key].offset.copy(offset)
                        material[key].repeat.copy(repeat)
                    }
                }
            }
            return material;
        }
    }

    static disposeMaterial(obj)
    {
        if(obj.dispose && obj.constructor === Function)
        {
            obj.dispose();
        }
    }
}