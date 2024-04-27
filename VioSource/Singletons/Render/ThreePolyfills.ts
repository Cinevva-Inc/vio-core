import * as three from "three";
// import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';

export class ThreePolyFills
{
    public static setPolyfills()
    {
        // this.setPivotPolyfill();
        // this.setBVH();
    }

    /*private static setBVH()
    {
        three.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
        three.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
        three.Mesh.prototype.raycast = acceleratedRaycast;
    }*/

    public static setPivotPolyfill()
    {
        (three.Object3D.prototype as any).pivot = null;

        three.Object3D.prototype.updateMatrix = function ()
        {
            this.matrix.compose( this.position, this.quaternion, this.scale );
        
            var pivot = (this as any).pivot;
        
            if ( pivot != null )
            {
                var px = pivot.x, py = pivot.y,  pz = pivot.z;
                var te = this.matrix.elements;
        
                te[ 12 ] += px - te[ 0 ] * px - te[ 4 ] * py - te[ 8  ] * pz;
                te[ 13 ] += py - te[ 1 ] * px - te[ 5 ] * py - te[ 9  ] * pz;
                te[ 14 ] += pz - te[ 2 ] * px - te[ 6 ] * py - te[ 10 ] * pz;
            }
            this.matrixWorldNeedsUpdate = true;
        };
    }
}