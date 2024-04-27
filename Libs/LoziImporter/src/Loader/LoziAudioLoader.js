export default class LoziAudioLoader
{ 
    static loadAudio(audioData,prefix,complete,progress,error)
    {
        var snd = {id:audioData.id,name:audioData.name,dataBuffer:null,loaded:false,loadProgress:0,isFromByteArray:true};

        if(snd)
        {
            var request = new XMLHttpRequest();
            request.onreadystatechange = ()=>
            {
                if (request.readyState == 4 && request.status == 200)
                {
                    let AContext = self.AudioContext || self.webkitAudioContext;

                    var context = new AContext();
                    
                    snd.loadProgress = 1;
                    context.decodeAudioData(request.response, function(buffer)
                    {
                        snd.dataBuffer = buffer;
                        snd.loaded     = true;
                        
                        if(complete)
                        {
                            complete();
                        }
                    },
                    function(e)
                    {
                        console.error("Couldn't decode audio!");
                    });
                }
            }
            request.onprogress = function(e)
            {
                if(e.lengthComputable)
                {
                    if(progress)
                    {
                        progress(snd.loadProgress);
                    } 
                }
            };
            request.onerror = error;
            
            request.open('GET', prefix+audioData.data , true );
            request.responseType = 'arraybuffer';
            request.send();
        }
        return snd;
    }

    static loadAudios(soundsData,prefix,complete,progress,error)
    {
        var sounds = [];
        if(soundsData.length>0)
        {
            for(var num = 0; num < soundsData.length; num++)
            {
                var sound = this.loadAudio(soundsData[num],prefix,complete,progress,error);
                sounds.push(sound);
            }
        }
        else
        {
            setTimeout(()=>
            {
                if(complete)
                {
                    complete();
                }
            },0);
        }
        return sounds;
    }
}