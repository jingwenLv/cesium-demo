export function initDynamicWall(Cesium, viewer) {
    const position = new Cesium.Cartesian3.fromDegrees(117.154815, 31.853495, 100)

     /*
          流动纹理线
           color 颜色
           duration 持续时间 毫秒
        */
           function PolylineTrailLinkMaterialProperty(color, duration) {
            this._definitionChanged = new Cesium.Event();
            this._color = undefined;
            this._colorSubscription = undefined;
            this.color = color;
            this.duration = duration;
            this._time = (new Date()).getTime();
        }
        Cesium.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
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
        PolylineTrailLinkMaterialProperty.prototype.getType = function (time) {
            return 'PolylineTrailLink';
        }
        PolylineTrailLinkMaterialProperty.prototype.getValue = function (time, result) {
            if (!Cesium.defined(result)) {
                result = {};
            }
            result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
            result.image = Cesium.Material.PolylineTrailLinkImage;
            result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
            return result;
        }
        PolylineTrailLinkMaterialProperty.prototype.equals = function (other) {
            return this === other ||
                (other instanceof PolylineTrailLinkMaterialProperty &&
                    Property.equals(this._color, other._color))
        }
        Cesium.PolylineTrailLinkMaterialProperty = PolylineTrailLinkMaterialProperty;
        Cesium.Material.PolylineTrailLinkType = 'PolylineTrailLink';
        Cesium.Material.PolylineTrailLinkImage = "http://oss.datalent.top/test/cesium/colors.png";
        Cesium.Material.PolylineTrailLinkSource = "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                                                      {\n\
                                                           czm_material material = czm_getDefaultMaterial(materialInput);\n\
                                                           vec2 st = materialInput.st;\n\
                                                           vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
                                                           material.alpha = colorImage.a * color.a;\n\
                                                           material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
                                                           return material;\n\
                                                       }";
        Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkType, {
            fabric: {
                type: Cesium.Material.PolylineTrailLinkType,
                uniforms: {
                    color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
                    image: Cesium.Material.PolylineTrailLinkImage,
                    time: 0
                },
                source: Cesium.Material.PolylineTrailLinkSource
            },
            translucent: function (material) {
                return true;
            }
        });

        viewer.entities.add({
            name: "动态立体墙",
            wall: {
                positions: Cesium.Cartesian3.fromDegreesArray([117.154815, 31.853495, 117.181255, 31.854257, 117.182284, 31.848255, 117.184748, 31.840141, 117.180557, 31.835556, 117.180023, 31.833741, 117.166846, 31.833737, 117.155531, 31.833151, 117.154787, 31.835978, 117.151994, 31.839036, 117.150691, 31.8416, 117.151215, 31.844734, 117.154457, 31.848152, 117.154815, 31.853495]),
                maximumHeights: [600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600],
                minimumHeights: [43.9, 49.4, 38.7, 40, 54, 51, 66.7, 44.6, 41.2, 31.2, 50.1, 53.8, 46.9, 43.9],
                material: new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.ORANGE, 3000)
            }
        })

    viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(position, 10000))
}

export default {
    initDynamicWall
}