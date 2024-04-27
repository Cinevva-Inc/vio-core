import Libraries from "../../Libraries";

export default class ThreeAudio
{
    static createListener(obj)
    {
        let listener = new Libraries.ThreeObject.AudioListener();
        if(obj)
        {
            obj.add(listener);
        }
        return listener;
    }
				
    static createSource(listener,data,obj)
    {
        var source = new Libraries.ThreeObject.PositionalAudio(listener);
        source.setBuffer(data.clip.dataBuffer);
        source.setRefDistance(data.spread);
        source.loop     = data.loop;
        source.sourceID = data.id;
        source.name     = data.clip.name;
        source.autoplay = data.autoPlay;
        source.setVolume((data.mute == true) ? 0 : 1);
        
        if(data.autoPlay == true)
        {
            source.play();
        }
        
        obj.sound = source;
        obj.add(obj.sound);
        
        return source;
    }
				
    static disposeSoundSource(obj)
    {
        if(obj.isPlaying == true)
        {
            obj.stop();
        }
        if(obj.parent)
        {
            obj.parent.remove(obj);
        }
    }
				
    static disposeSoundListener(obj)
    {
        if(obj.parent)
        {
            obj.parent.remove(obj);
        }
    }
}