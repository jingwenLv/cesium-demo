export function initMoveImg(Cesium, viewer, canvasLIst) {
    const position = new Cesium.Cartesian3.fromDegrees(-75.0, 30.0)
    //开启深度检测
    viewer.scene.globe.depthTestAgainstTerrain = true;

    let curCanvas = 'a';
    let i = 0;
    function drawCanvasImage() {
        let canvas = null;
        curCanvas === 'a' ? canvas = canvasLIst[0] : canvas = canvasLIst[1];
        let cwidth = 700;
        let cheight = 100;
        let ctx = canvas.getContext("2d");
        let img = new Image();
        img.src = "http://oss.datalent.top/test/cesium/arrow.png";
        ctx.clearRect(0, 0, cwidth, cheight);
        img.onload = function () {
            if (i <= cwidth) {
                ctx.drawImage(img, i, 0);
            } else
                i = 0;
            i += 3;
        }
        curCanvas = curCanvas === 'a' ? 'b' : 'a';
        return canvas;
    }

    viewer.entities.add({
        name: 'Rotating rectangle with rotating texture coordinate',
        rectangle: {
            coordinates: Cesium.Rectangle.fromDegrees(-90.0, 30.0, -70.0, 35.0),
            height: 100000,
            material: new Cesium.ImageMaterialProperty({
                image: new Cesium.CallbackProperty(drawCanvasImage, false),
                transparent: true
            })
        }
    });

    viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(position, 1000000))

}

export default {
    initMoveImg
}