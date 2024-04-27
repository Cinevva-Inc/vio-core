import { AnimationClip, NumberKeyframeTrack, QuaternionKeyframeTrack, VectorKeyframeTrack } from "three";

export class VioAnimationGenerator
{
    static _parseClipData(name:string,clipData:any)
    {
        let obj:any             = {};
        let times:Array<number> = [];
        let keyArr              = Object.keys(clipData).sort();
        
        for(var num = 0; num < keyArr.length; num++)
        {
            let time = keyArr[num];
            let item = clipData[time];
            
            if(item.blendShape)
            {
                if(!obj.morphTargetInfluences)
                {
                    obj.morphTargetInfluences = {};
                }
                for(var keyItem in item.blendShape)
                {
                    if(!obj.morphTargetInfluences[keyItem])
                    {
                        obj.morphTargetInfluences[keyItem] = {times:[],arr:[],class:NumberKeyframeTrack};
                    }
                    obj.morphTargetInfluences[keyItem].arr  .push(item.blendShape[keyItem]/100);
                    obj.morphTargetInfluences[keyItem].times.push(Number.parseFloat(time));
                }
            }
            if(item.m_LocalPosition)
            {
                if(!obj.position)
                { 
                    obj.position = {times:[],arr:[],class:VectorKeyframeTrack};
                }
                obj.position.arr  .push(item.m_LocalPosition.x,item.m_LocalPosition.y,item.m_LocalPosition.z);
                obj.position.times.push(Number.parseFloat(time));
            } 
            if(item.m_LocalRotation)
            {
                if(!obj.quaternion)
                {
                    obj.quaternion = {times:[],arr:[],class:QuaternionKeyframeTrack};
                }
                obj.quaternion.arr  .push(item.m_LocalRotation.x,item.m_LocalRotation.y,item.m_LocalRotation.z,item.m_LocalRotation.w);
                obj.quaternion.times.push(Number.parseFloat(time));
            }
            if(item.m_LocalScale)
            {
                if(!obj.scale)
                { 
                    obj.scale = {times:[],arr:[],class:VectorKeyframeTrack};
                }
                obj.scale.arr  .push(item.m_LocalScale.x,item.m_LocalScale.y,item.m_LocalScale.z);
                obj.scale.times.push(Number.parseFloat(time));
            }
            times.push(Number.parseFloat(time));
        }
        
        for(var key in obj)
        {
            if(obj[key].class)
            {
                obj[key] = new obj[key].class(name+'.'+key,obj[key].times,obj[key].arr);
            }
        }
        return {time:times[times.length-1],obj:obj};
    }

    static generateAnimationClip(clipData:any,bindings:Record<string,string>|null)
    {
        var arr:Array<any> = [];
        for(var num = 0; num < clipData.hierarchy.length; num++)
        {
            var index      = clipData.hierarchy[num].index;
            var objectName = bindings && bindings[clipData.hierarchy[num].name] ? bindings[clipData.hierarchy[num].name] : clipData.hierarchy[num].name;
            // console.log("Key Name",clipData.name,objectName,bindings);
                objectName = objectName.toLowerCase().replace(':','').replace('mixamorig','');
            if(index>=0)
            {
                var data = this._parseClipData(objectName,clipData.hierarchy[num].keys);
                arr = arr.concat(Object.values(data.obj));
            }
        }

        let generated  = new AnimationClip(clipData.name, clipData.length, arr);

        return generated;
    }

    static updateAnimationClipBindings(clip:AnimationClip,bindings:Record<string,string>|null)
    {
        clip = clip.clone();
        for(var num = 0; num < clip.tracks.length; num++)
        {
            // console.log("Key Name",clip.tracks[num].name);
            clip.tracks[num].name = clip.tracks[num].name.toLowerCase().replace(':','').replace('mixamorig','')
            clip.tracks[num].name = bindings && bindings[clip.tracks[num].name] ? bindings[clip.tracks[num].name] : clip.tracks[num].name;
        }
        return clip;
    }
}