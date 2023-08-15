export function initFlowLine(Cesium, viewer) {
    // const position = new Cesium.Cartesian3.fromDegrees(104, 30, 100)

    viewer.entities.add({
        name: 'PolylineTrail',
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights([104, 30, 1000,
                114, 30, 1000,
                114, 50, 1000,
                115, 20, 1000,
                118, 30, 1000,
                123, 10, 1000,
                125, 40, 1000,
                126, 30, 1000,
                128, 50, 1000,
            ]),
            width: 5,
            // material: new Cesium.FlowLineMaterialProperty(Cesium.Color.ORANGE, 3000)
            material: Cesium.Color.RED
        }
    });

   
    viewer.zoomTo(viewer.entities);

    // viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(position, 10000))
}



export default {
    initFlowLine
}