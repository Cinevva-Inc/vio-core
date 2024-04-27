import LoziTextureLoader from './LoziTextureLoader';
import LoziAudioLoader   from './LoziAudioLoader';
import Libraries         from './../Libraries/Libraries';
import LoziEnumsTranslator from '../Enums/LoziEnumsTranslator';

export default class LoziAssetPreloader
{
    static isLoadComplete(data,complete)
    {
        var completed = true;
        if(data.generatedAssets.images)
        {
            for(var num = 0; num < data.generatedAssets.images.length; num++)
            {
                if(data.generatedAssets.images[num])
                {
                    // if(data.generatedAssets.images[num].loadProgress<1)
                    if(data.generatedAssets.images[num].loaded != true)
                    {
                        completed = false;
                    }
                }
            }
        }

        if(data.generatedAssets.sounds)
        {
            for(var num = 0; num < data.generatedAssets.sounds.length; num++)
            {
                if(!data.generatedAssets.sounds[num].loaded)
                {
                    completed = false;
                }
            }
        }

        if(completed == true)
        {
            complete();
        }
    }

    static updateProgress(data,onProgress)
    {
        var soundProgress = 0;
        var imageProgress = 0;
        var totalProgress = 0;
        var soundCount	  = 0;
        var imageCount 	  = 0;

        if(data.generatedAssets.sounds)
        {
            for(var num = 0; num < data.generatedAssets.sounds.length; num++)
            {
                var progress = data.generatedAssets.sounds[num].loadProgress;
                soundProgress += (progress) ? progress : 0;
            }
            soundCount = data.generatedAssets.sounds.length;
            soundProgress = soundProgress/soundCount;
        }

        if(data.generatedAssets.images)
        {
            for(var num = 0; num < data.generatedAssets.images.length; num++)
            {
                var progress = 0;
                if(data.generatedAssets.images[num])
                {
                    progress = data.generatedAssets.images[num].loadProgress;
                }
                
                imageProgress += (progress) ? progress : 0;
            }
            imageCount = data.generatedAssets.images.length;
            imageProgress = imageProgress/imageCount;
        }
        totalProgress = (imageProgress + soundProgress) / 2;

        if(soundCount>0)
        {
            totalProgress = soundProgress;
        }
        if(imageCount>0)
        {
            totalProgress = imageProgress;
        }
        if(imageCount>0 && soundCount>0)
        {
            totalProgress = (imageProgress + soundProgress) / 2;
        }

        if(onProgress)
        {
            onProgress(totalProgress);
        }
    }

    static preload(data,prefix,complete,progress,error)
    {
        if(data)
        {
            var hasTextures = false;
            var hasSounds   = false;
            data.generatedAssets = (!data.generatedAssets) ? {} : data.generatedAssets;

            if(data.assets && data.assets.textures && data.assets.textures.length>0)
            {
                hasTextures = true;
                this.isLoadComplete(data,complete);
                /*data.generatedAssets.images = LoziTextureLoader.loadImages(data.assets.textures,prefix,
                ()=>
                {
                    this.updateProgress(data,progress);
                    this.isLoadComplete(data,complete);
                },
                ()=>
                {
                    this.updateProgress(data,progress);
                },error);*/
            }
            if(data.assets && data.assets.sounds && data.assets.sounds.length>0)
            {
                let AContext = self.AudioContext || self.webkitAudioContext;
                if(AContext)
                {
                    hasSounds = true;
                    data.generatedAssets.sounds = LoziAudioLoader.loadAudios(data.assets.sounds,prefix,()=>
                    {
                        this.updateProgress(data,progress);
                        this.isLoadComplete(data,complete);
                    },
                    ()=>
                    {
                        this.updateProgress(data,progress);
                    },error);
                }
            }
            if(hasTextures == false && hasSounds == false)
            {
                complete();
            }
        }
    }

    static setAssets(prefix, data)
    {
        LoziEnumsTranslator.HierarchyEnumsToHumanReadable(data.objects);
        if(data.assets && data.assets.textures && data.assets.textures.length>0)
        {
            data.generatedAssets.textures = LoziTextureLoader.loadTextures(prefix, data.assets.textures);
        }
        if(data.assets && data.assets.bones && data.assets.bones.length>0)
        {
            // data.generatedAssets.bones = Libraries.object.SkinnedMesh.generateSkeletons(data.assets.bones);
        }
        if(data.assets && data.assets.materials && data.assets.materials.length>0)
        {
            data.generatedAssets.materials = Libraries.object.Material.generateMaterials(data.assets.materials,data);
        }
        if(data.assets && data.assets.meshes &&  data.assets.meshes.length>0)
        {
            data.generatedAssets.geometries = Libraries.object.Mesh.parseGeometries(data.assets.meshes,data);
        }
        if(data.assets && data.assets.animations && data.assets.animations.length>0)
        {
            // data.generatedAssets.animations = Libraries.object.SkinAnimations.generateSkinAnimations(data.assets.animations,data);
        }
        if(data.objects)
        {
            Libraries.object.Object.applyFlagsToObjects(data.objects,data);

            // window['gen'] = data.generatedAssets;
        }
    }; 

    static preloadData(data,prefix,onComplete,onprogress,error,generateObject)
    {
        generateObject = (generateObject == false) ? generateObject : true;

        if(data)
		{
			this.preload(data,prefix,()=>
			{
				this.setAssets(prefix, data);

				data.createObject = function(info,uniqueMaterials)
				{
					// return Lozi.Static.Object.generateLoziObject(data,info,uniqueMaterials);
				};

				data.dispose = function()
				{
					// Lozi.disposeData(data);
				};

				if(onComplete)
				{
                    setTimeout(()=>
                    {
                        var returnObj  = {};
                        // data.assets    = null;
                        // delete data.assets;
                        returnObj.data = data;
    
                        if(generateObject)// && returnObj.object)
                        {
                            returnObj.object = Libraries.object.Object.generateObject(data);
                            
                            if(returnObj.object.clips && returnObj.object.clips.length>0)
                            {
                                returnObj.data.generatedAssets.animations = returnObj.object.clips;
                            }
                        }
    
                        onComplete(returnObj);
                    },1000);
				}
			},onprogress,error);
		}
    }
}