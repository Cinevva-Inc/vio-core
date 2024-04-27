import LoziUtils from "../../../Helpers/LoziUtils";
import Libraries from "../../Libraries";

export default class ThreeAnimations
{
    static setAnimationData(obj,data)
    {
        if(data && obj)
        {
            var animData = LoziUtils.getObjectByProperty(data.assets.animations,'id',obj.animationID);

            if(animData)
            {
                obj.objects = LoziUtils.flattenHierarchy(obj,'children');
                var anim    = this.generateAnimation(obj,animData);
                
                if(anim)
                {
                    if(anim.clips && anim.clips.length>0)
                    {

                        var mixer   = this.setAnimation(obj,anim);
                        mixer.id    = anim.id;

                        return {mixer:mixer,clips:anim.clips}; 
                    }
                }
            }
        }
        return null;
    }
    
    static generateAnimation(obj,anim)
    {
        if(anim.clips)
        {
            var generated = {id:anim.id,clips:[]};
            for(var num = 0; num < anim.clips.length; num++)
            {
                generated.clips.push(this.generateAnimationClip(obj,anim.clips[num]));
            }
            return generated;
        }
    }

    static parseClipData(name,subName,clipData)
    {
        var obj    = {};
        var times  = [];
        var keyArr = Object.keys(clipData).sort();

        for(var num = 0; num < keyArr.length; num++)
        {
            var item = clipData[keyArr[num]];
            
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
                        obj.morphTargetInfluences[keyItem] = {times:[],arr:[],class:Libraries.ThreeObject.NumberKeyframeTrack};
                    }
                    obj.morphTargetInfluences[keyItem].arr  .push(item.blendShape[keyItem]/100);
                    obj.morphTargetInfluences[keyItem].times.push(Number.parseFloat(keyArr[num]));
                }
            }
            if(item.m_LocalPosition)
            {
                if(!obj.position)
                { 
                    obj.position = {times:[],arr:[],class:Libraries.ThreeObject.VectorKeyframeTrack};
                }
                obj.position.arr  .push(item.m_LocalPosition.x,item.m_LocalPosition.y,item.m_LocalPosition.z);
                obj.position.times.push(Number.parseFloat(keyArr[num]));
            } 
            if(item.m_LocalRotation)
            {
                if(!obj.quaternion)
                {
                    obj.quaternion = {times:[],arr:[],class:Libraries.ThreeObject.QuaternionKeyframeTrack};
                }
                obj.quaternion.arr  .push(item.m_LocalRotation.x,item.m_LocalRotation.y,item.m_LocalRotation.z,item.m_LocalRotation.w);
                obj.quaternion.times.push(Number.parseFloat(keyArr[num]));
            }
            if(item.m_LocalScale)
            {
                if(!obj.scale)
                { 
                    obj.scale = {times:[],arr:[],class:Libraries.ThreeObject.VectorKeyframeTrack};
                }
                obj.scale.arr  .push(item.m_LocalScale.x,item.m_LocalScale.y,item.m_LocalScale.z);
                obj.scale.times.push(Number.parseFloat(keyArr[num]));
            }
            times.push(Number.parseFloat(keyArr[num]));
        }
        
        for(var key in obj)
        {
            if(obj[key].class)
            {
                obj[key] = new obj[key].class(name+'.'+key,obj[key].times,obj[key].arr);
            }
            else
            {
                for(var subKey in obj[key])
                {
                    if(obj[key][subKey])
                    {
                        obj[key] = new obj[key][subKey].class(subName+'.'+key+'['+subKey+']',obj[key][subKey].times,obj[key][subKey].arr);
                    }
                }
            } 
        }
        
        return {time:times[times.length-1],obj:obj};
    }

    static generateAnimationClip(obj,clip)
    {
        var arr = [];
        for(var num = 0; num < clip.hierarchy.length; num++)
        {
            var index         = obj.objects[clip.hierarchy[num].index].name == clip.hierarchy[num].name ? clip.hierarchy[num].index : LoziUtils.getObjectIndex(obj.objects,'name',clip.hierarchy[num].name);
            var objectName    = '.objects[' + index + ']'; 
            
            if(index>=0)
            {
                var subObjectName = clip.hierarchy[num].name;
    
                var data = this.parseClipData(objectName,subObjectName,clip.hierarchy[num].keys);
                arr = arr.concat(Object.values(data.obj));
            }
        }
        var generated  = new Libraries.ThreeObject.AnimationClip( clip.name, clip.length, arr);
        generated.id   = clip.id;
        generated.mode = clip.mode;

        return generated;
    }

    static setAnimation(obj,anim)
    {
        var mixer = new Libraries.ThreeObject.AnimationMixer(obj);

        if(anim.clips && anim.clips.length>0)
        {
            mixer.clips = {};
            for(var num = 0; num < anim.clips.length; num++)
            {
                if(anim.clips[num])
                {
                    mixer.clips[anim.clips[num].name]		   = mixer.clipAction(anim.clips[num], obj);
                    mixer.clips[anim.clips[num].name].id 	   = anim.clips[num].id;
                    mixer.clips[anim.clips[num].name].name 	   = anim.clips[num].name;
                    mixer.clips[anim.clips[num].name].mode 	   = this.loopMode(anim.clips[num].mode);
                    mixer.clips[anim.clips[num].name].duration = anim.clips[num].duration;
                    mixer.clips[anim.clips[num].name].setEffectiveWeight(1);
                }
            }
        }
        return mixer;
    }

    static loopMode(type)
    {
        if(type == "Once")
        {
            return Libraries.ThreeObject.LoopOnce;
        }
        if(type == "PingPong")
        {
            return Libraries.ThreeObject.LoopPingPong
        }
        return Libraries.ThreeObject.LoopRepeat;
    }

				// disposeAnimation:function(obj)

}