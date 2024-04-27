import ThreeMaterial from './Material/ThreeMaterial';
import ThreeMesh     from './Mesh/ThreeMesh';
import ThreeTexture  from './Texture/ThreeTexture';
import ThreeObject  from './Object/ThreeObject';
import ThreeMeshSkin from './Mesh/ThreeMeshSkin';
import ThreeSkinAnimations from './Animations/ThreeSkinAnimations';
import ThreeAudio from './Audio/ThreeAudio';
import ThreeAnimations from './Animations/ThreeAnimations';

export default class ThreeLibrary
{
    static get Material()
    {
        return ThreeMaterial;
    }

    static get Animations()
    {
        return ThreeAnimations;
    }

    static get SkinAnimations()
    {
        return ThreeSkinAnimations;
    }

    static get Mesh()
    {
        return ThreeMesh;
    }

    static get SkinnedMesh()
    {
        return ThreeMeshSkin;
    }

    static get Texture()
    {
        return ThreeTexture;
    }

    static get Audio()
    {
        return ThreeAudio;
    }

    static get Object()
    {
        return ThreeObject;
    }
}