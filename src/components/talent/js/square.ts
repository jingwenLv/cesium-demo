// 正方形
export default function (Cesium, viewer) {
    viewer.entities.add({
        name: 'Red box with black outline',
        position: Cesium.Cartesian3.fromDegrees(116.391378, 39.904638, 0),
        box: {
            dimensions: new Cesium.Cartesian3(100.0, 100.0, 100.0),
            // material: Cesium.Color.RED.withAlpha(0.5),
            material: 'http://oss.datalent.top/test/168766.png',
            outline: false,
            outlineColor: Cesium.Color(0, 0, 0, 0.4)
        }
    });

    //  viewer.zoomTo(viewer.entities);

    centerAtHome(Cesium, viewer)
}
function centerAtHome(Cesium, viewer) {
    var centeropt = { "y": 39.901107, "x": 116.397623, "z": 580, "heading": 312, "pitch": -40.5, "roll": 360 };
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(centeropt.x, centeropt.y, centeropt.z || 0), //经度、纬度、高度
        orientation: {
            heading: Cesium.Math.toRadians(centeropt.heading || 0), // 方位角
            pitch: Cesium.Math.toRadians(centeropt.pitch),      //倾角
            roll: Cesium.Math.toRadians(centeropt.roll || 0)    //旋转角
        },
        duration: 3,
    });
}
