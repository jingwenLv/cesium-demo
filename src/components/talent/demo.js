export function initDynamicWall(Cesium, viewer) {
    const position = new Cesium.Cartesian3.fromDegrees(112.200384, 26.541969, 100)


    viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(position, 10000))
}

export default {
    initDynamicWall
}