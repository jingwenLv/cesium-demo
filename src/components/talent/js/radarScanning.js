export function initRadarScanning(Cesium, viewer, canvas) {
    const position = new Cesium.Cartesian3.fromDegrees(-75.0, 30.0)
    //开启深度检测
    viewer.scene.globe.depthTestAgainstTerrain = true;

    let rotation = Cesium.Math.toRadians(30);

    function getRotationValue() {
        rotation -= 0.02;
        return rotation;
    }

    function drawCanvas() {
        let context = canvas.getContext('2d');
        let grd = context.createLinearGradient(175, 100, canvas.width, 150);
        grd.addColorStop(0, "rgba(0,255,0,0)");
        grd.addColorStop(1, "rgba(0,255,0,1)");
        context.fillStyle = grd;
        context.beginPath();
        context.moveTo(150, 150);
        context.arc(150, 150, 140, -90 / 180 * Math.PI, 0 / 180 * Math.PI);//context.arc(x,y,r,sAngle,eAngle,counterclockwise);
        context.fill();
        return canvas;
    }

    let i=0;
    viewer.entities.add({
        name: 'Rotating rectangle with rotating texture coordinate',
        rectangle: {
            coordinates: new Cesium.CallbackProperty(function(){
                return Cesium.Rectangle.fromDegrees(-75.0, 30.0, -70.0, 35.0)
            },false),
            material: new Cesium.ImageMaterialProperty({
                image: new Cesium.CallbackProperty(drawCanvas, false),
                transparent: true
            }),
            rotation: new Cesium.CallbackProperty(getRotationValue, false),
            stRotation: new Cesium.CallbackProperty(getRotationValue, false)
        }
    });

    viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(position, 1000000))

}

export default {
    initRadarScanning
}