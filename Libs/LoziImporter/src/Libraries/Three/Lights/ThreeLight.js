import LoziUtils from '../../../Helpers/LoziUtils';
import LoziMath  from '../../../Helpers/LoziMath';
import Libraries from '../../Libraries';

export default class ThreeLight
{
    static setLightData(targetLight,data)
    {
        targetLight.color 	   = new Libraries.ThreeObject.Color(data.color[0],data.color[1],data.color[2]);
        targetLight.intensity  = data.intensity;
        targetLight.distance   = data.range * 100;
        targetLight.angle      = LoziMath.radians(data.angle);
        targetLight.castShadow = data.shadow;
        targetLight.lightID    = data.lightID;
    }
}