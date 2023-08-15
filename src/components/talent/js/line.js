export function initLine(Cesium, viewer) {
    initEntityLine(Cesium, viewer)
}

function initEntityLine(Cesium, viewer) {
    const entities = viewer.entities
    const position = new Cesium.Cartesian3.fromDegrees(112.200384, 26.541969, 100)

    // 创建两个点的位置
    let startPoint = Cesium.Cartesian3.fromDegrees(112.200384, 26.541969);
    let endPoint = Cesium.Cartesian3.fromDegrees(112.200384, 26.551969);

    // 创建线的实体
    entities.add({
        polyline: {
            positions: [startPoint, endPoint],
            width: 5,
            material: Cesium.Color.RED
        }
    });

    let threePoint = Cesium.Cartesian3.fromDegrees(112.210989, 26.552195)

    entities.add({
        polyline: {
            positions: [startPoint, threePoint],
            width: 5,
            material: Cesium.Color.RED
        }
    });

    entities.add({
        polyline: {
            positions: [endPoint, threePoint],
            width: 5,
            material: Cesium.Color.RED
        }
    });


    viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(position, 100));
}

function initAnyLine(Cesium, viewer) {
    const redLine = viewer.entities.add({
        name: "Red line on terrain",
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray([-75, 35, -125, 35]),
            width: 5,
            material: Cesium.Color.RED,
            clampToGround: true,
        },
    });

    const greenRhumbLine = viewer.entities.add({
        name: "Green rhumb line",
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray([-75, 35, -125, 35]),
            width: 5,
            arcType: Cesium.ArcType.RHUMB,
            material: Cesium.Color.GREEN,
        },
    });

    const glowingLine = viewer.entities.add({
        name: "Glowing blue line on the surface",
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray([-75, 37, -125, 37]),
            width: 10,
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.2,
                taperPower: 0.5,
                color: Cesium.Color.CORNFLOWERBLUE,
            }),
        },
    });

    const orangeOutlined = viewer.entities.add({
        name:
            "Orange line with black outline at height and following the surface",
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                -75,
                39,
                250000,
                -125,
                39,
                250000,
            ]),
            width: 5,
            material: new Cesium.PolylineOutlineMaterialProperty({
                color: Cesium.Color.ORANGE,
                outlineWidth: 2,
                outlineColor: Cesium.Color.BLACK,
            }),
        },
    });

    const purpleArrow = viewer.entities.add({
        name: "Purple straight arrow at height",
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                -75,
                43,
                500000,
                -125,
                43,
                500000,
            ]),
            width: 10,
            arcType: Cesium.ArcType.NONE,
            material: new Cesium.PolylineArrowMaterialProperty(
                Cesium.Color.PURPLE
            ),
        },
    });

    const dashedLine = viewer.entities.add({
        name: "Blue dashed line",
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                -75,
                45,
                500000,
                290,
                320,
                500000,
            ]),
            width: 4,
            material: new Cesium.PolylineDashMaterialProperty({
                color: Cesium.Color.CYAN,
            }),
        },
    });

    const orbitEntity = viewer.entities.add({
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                -180, 0, 0,
                0, 90, 0,
                180, 0, 0,
                0, -90, 0,
                -180, 0, 0,
            ]),
            width: 2,
            material: Cesium.Color.RED
        }
    });

    viewer.zoomTo(viewer.entities);

}

export default {
    initLine
}