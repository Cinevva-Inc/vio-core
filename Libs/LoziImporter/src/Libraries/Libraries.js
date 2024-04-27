// let THREE = require("three");

import ThreeLibrary from './Three/ThreeLibrary';

export default class Libraries
{
    static setThreeJsObject(obj)
    {
        this._threeObject = obj;
    }

    static get ThreeObject()
    {
        if(window.THREE)
        {
            return window.THREE;
        }
        return this._threeObject;
    }

    static get object()
    {
        // THREE = THREE ? THREE : self.THREE;
        if(this.ThreeObject !== undefined)
        {
            return ThreeLibrary;
        }
        throw new Error("NO WEBGL LIBRARY INCLUDED!");
    }
}