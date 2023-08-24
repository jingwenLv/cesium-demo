export function initDynamicSquare(Cesium, viewer) {
    let position =  Cesium.Cartesian3.fromDegrees(107.174742, 22.278494, 300.0)
    // 创建盒子
    var blueBox = viewer.entities.add({
        name: 'Blue box',
        position: position,
        box: {
            dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
            material: Cesium.Color.BLUE,
            outline: true,
        }
    });

    var property = new Cesium.SampledProperty(Cesium.Cartesian3);

    property.addSample(Cesium.JulianDate.fromIso8601('2023-08-23T00:00:00.00Z'),
        new Cesium.Cartesian3(400000.0, 300000.0, 200000.0));

    property.addSample(Cesium.JulianDate.fromIso8601('2023-08-24T00:00:00.00Z'),
        new Cesium.Cartesian3(400000.0, 300000.0, 700000.0));

    blueBox.box.dimensions = property;

    viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(position, 0))
}