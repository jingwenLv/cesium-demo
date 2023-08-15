export function initPlane(Cesium, viewer) {
    // 场景
    let scene = viewer.scene
    // 平面面积
    let dimensions = new Cesium.Cartesian3(400000.0, 300000.0, 1.0)
    // 平面的定位
    let positionOnEllipsoid = Cesium.Cartesian3.fromDegrees(116.3912, 39.920)
    // 位置
    let translateMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(positionOnEllipsoid)
    let scaleMatrix = Cesium.Matrix4.fromScale(dimensions)

    // 平面模型
    let planeModelMatrix = new Cesium.Matrix4()
    Cesium.Matrix4.multiply(translateMatrix, scaleMatrix, planeModelMatrix)

    // 创建平面对象
    let planeGeometry  = new Cesium.PlaneGeometry({
        // vertexFormat : Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
        vertexFormat :  Cesium.VertexFormat.POSITION_AND_NORMAL,
    })

    // 创建平面轮廓
    let planeOutlineGeometry  = new Cesium.PlaneOutlineGeometry({})

    // 设置平面样式
    let planeGeometryInstance = new Cesium.GeometryInstance({
        geometry : planeGeometry,
        modelMatrix : planeModelMatrix,
        attributes : {
            color : Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 0.0, 0.0, 0.5))
        },
       
    });
    
    // 将平面添加到场景
   scene.primitives.add(new Cesium.Primitive({
        geometryInstances : planeGeometryInstance,
        appearance : new Cesium.PerInstanceColorAppearance({
            closed: true,
        })
    }));

   
    // let planeOutlineGeometryInstance = new Cesium.GeometryInstance({
    //     geometry : planeOutlineGeometry,
    //     modelMatrix : planeModelMatrix,
    //     attributes : {
    //         color : Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 1.0, 1.0, 1.0))
    //     }
    // });
    
    // scene.primitives.add(new Cesium.Primitive({
    //     geometryInstances : planeOutlineGeometryInstance,
    //     appearance : new Cesium.PerInstanceColorAppearance({
    //         flat : true,
    //         renderState : {
    //             lineWidth : Math.min(2.0, scene.maximumAliasedLineWidth)
    //         }
    //     })
    // }));

    // 创建一个平面
    
    viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(positionOnEllipsoid, 300000));
}

export default {
    initPlane
}