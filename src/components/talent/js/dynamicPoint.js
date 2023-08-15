// 动态扩散点
export function initDynamicPoint(Cesium, viewer) {
    const position = new Cesium.Cartesian3.fromDegrees(104.0, 30.0, 100.0)

    //取消双击事件
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    //开启深度检测
    // viewer.scene.globe.depthTestAgainstTerrain = true;


    /*
      流动纹理线
       color 颜色
       duration 持续时间 毫秒
    */
    function EllipsoidFadeMaterialProperty(color, duration) {
        this._definitionChanged = new Cesium.Event();
        this._color = undefined;
        this._colorSubscription = undefined;
        this.color = color;
        this.duration = duration;
        this._time = (new Date()).getTime();
    }
    Cesium.defineProperties(EllipsoidFadeMaterialProperty.prototype, {
        isConstant: {
            get: function () {
                return false;
            }
        },
        definitionChanged: {
            get: function () {
                return this._definitionChanged;
            }
        },
        color: Cesium.createPropertyDescriptor('color')
    });
    EllipsoidFadeMaterialProperty.prototype.getType = function (time) {
        return 'EllipsoidFade';
    }
    EllipsoidFadeMaterialProperty.prototype.getValue = function (time, result) {
        if (!Cesium.defined(result)) {
            result = {};
        }
        result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);

        result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
        return result;

        // return Cesium.defined(result) || (result = {}),
        //     result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color),
        //     void 0 === this._time && (this._time = time.secondsOfDay),
        //     result.time = time.secondsOfDay - this._time,
        //     result
    }
    EllipsoidFadeMaterialProperty.prototype.equals = function (other) {
        return this === other ||
            (other instanceof EllipsoidFadeMaterialProperty &&
                Property.equals(this._color, other._color))
    }
    Cesium.EllipsoidFadeMaterialProperty = EllipsoidFadeMaterialProperty;
    Cesium.Material.EllipsoidFadeType = 'EllipsoidFade';
    Cesium.Material.EllipsoidFadeSource =
        "czm_material czm_getMaterial(czm_materialInput materialInput)\n" +
        "{\n" +
        "czm_material material = czm_getDefaultMaterial(materialInput);\n" +
        "material.diffuse = 1.5 * color.rgb;\n" +
        "vec2 st = materialInput.st;\n" +
        "float dis = distance(st, vec2(0.5, 0.5));\n" +
        "float per = fract(time);\n" +
        "if(dis > per * 0.5){\n" +
        "material.alpha = 0.0;\n" +
        "discard;\n" +
        "}else {\n" +
        "material.alpha = color.a  * dis / per / 1.0;\n" +
        "}\n" +
        "return material;\n" +
        "}";
    Cesium.Material._materialCache.addMaterial(Cesium.Material.EllipsoidFadeType, {
        fabric: {
            type: Cesium.Material.EllipsoidFadeType,
            uniforms: {
                color: new Cesium.Color(1.0, 0.0, 0.0, 1),
                time: 0
            },
            source: Cesium.Material.EllipsoidFadeSource
        },
        translucent: function (material) {
            return true;
        }
    });

    viewer.entities.add({
        name: 'EllipsoidFade',
        position: Cesium.Cartesian3.fromDegrees(104.0, 30.0, 100.0),
        ellipse: {
            height: 0,
            semiMinorAxis: 300.0,
            semiMajorAxis: 300.0,
            material: new Cesium.EllipsoidFadeMaterialProperty(Cesium.Color.ORANGE, 2000)
        }
    });


    // viewer.zoomTo(viewer.entities);
    viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(position, 1000))
}

export default {

}