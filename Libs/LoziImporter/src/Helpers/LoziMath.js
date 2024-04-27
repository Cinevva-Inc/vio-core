export default class LoziMath
{
    static radians(deg)
    {
      return deg * Math.PI / 180;
    }

    static degrees(rad)
    {
      return rad * 180 / Math.PI;
    }
}