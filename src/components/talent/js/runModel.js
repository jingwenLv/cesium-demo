export function initRunModel(Cesium, viewer) {
    initRunModel1(Cesium, viewer)
    // let url = 'https://zouyaoji.top/vue-cesium/SampleData/models/GroundVehicle/GroundVehicle.glb'
    let url = 'https://jdvop.oss-cn-qingdao.aliyuncs.com/mapv-data/model/2099city/scene.gltf'
    // initRunModel2(Cesium, viewer)
}

export function initRunModel1(Cesium, viewer) {
    //Make sure viewer is at the desired time.
    const start = Cesium.JulianDate.fromDate(new Date(2023, 7, 12, 15));
    const totalSeconds = 10;
    const stop = Cesium.JulianDate.addSeconds(
        start,
        totalSeconds,
        new Cesium.JulianDate()
    );
    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = start.clone();
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    viewer.timeline.zoomTo(start, stop);

    // Create a path for our vehicle by lerping between two positions.
    const position = new Cesium.SampledPositionProperty();
    const startPosition = new Cesium.Cartesian3.fromDegrees(105.680324, 32.388253)
    const endPosition = new Cesium.Cartesian3.fromDegrees(105.707821, 32.392738)
    // A velocity vector property will give us the entity's speed and direction at any given time.
    const velocityVectorProperty = new Cesium.VelocityVectorProperty(
        position,
        false
    );
    const velocityVector = new Cesium.Cartesian3();
    // Store the wheel's rotation over time in a SampledProperty.
    const wheelAngleProperty = new Cesium.SampledProperty(Number);
    let wheelAngle = 0;

    const numberOfSamples = 100;
    for (let i = 0; i <= numberOfSamples; ++i) {
        const factor = i / numberOfSamples;
        const time = Cesium.JulianDate.addSeconds(
            start,
            factor * totalSeconds,
            new Cesium.JulianDate()
        );

        // Lerp using a non-linear factor so that the vehicle accelerates.
        const locationFactor = Math.pow(factor, 2);
        const location = Cesium.Cartesian3.lerp(
            startPosition,
            endPosition,
            locationFactor,
            new Cesium.Cartesian3()
        );
        position.addSample(time, location);
        // Rotate the wheels based on how fast the vehicle is moving at each timestep.
        velocityVectorProperty.getValue(time, velocityVector);
        const metersPerSecond = Cesium.Cartesian3.magnitude(velocityVector);
        const wheelRadius = 0.52; //in meters.
        const circumference = Math.PI * wheelRadius * 2;
        const rotationsPerSecond = metersPerSecond / circumference;

        wheelAngle +=
            ((Math.PI * 2 * totalSeconds) / numberOfSamples) *
            rotationsPerSecond;
        wheelAngleProperty.addSample(time, wheelAngle);
    }

    function updateSpeedLabel(time, result) {
        velocityVectorProperty.getValue(time, velocityVector);
        const metersPerSecond = Cesium.Cartesian3.magnitude(velocityVector);
        const kmPerHour = Math.round(metersPerSecond * 3.6);

        return `${kmPerHour} km/hr`;
    }

    const rotationProperty = new Cesium.CallbackProperty(function (
        time,
        result
    ) {
        return Cesium.Quaternion.fromAxisAngle(
            Cesium.Cartesian3.UNIT_X,
            wheelAngleProperty.getValue(time),
            result
        );
    }, false);

    const wheelTransformation = new Cesium.NodeTransformationProperty({
        rotation: rotationProperty,
    });

    const nodeTransformations = {
        Wheels: wheelTransformation,
        Wheels_mid: wheelTransformation,
        Wheels_rear: wheelTransformation,
    };

    // Add our vehicle model.
    const vehicleEntity = viewer.entities.add({
        position: position,
        orientation: new Cesium.VelocityOrientationProperty(position), // Automatically set the vehicle's orientation to the direction it's facing.
        model: {
            uri: "https://jdvop.oss-cn-qingdao.aliyuncs.com/mapv-data/model/2099city/scene.gltf",
            runAnimations: false,
            nodeTransformations: nodeTransformations,
            scale: 0.001,
        },
        label: {
            text: new Cesium.CallbackProperty(updateSpeedLabel, false),
            font: "20px sans-serif",
            showBackground: true,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                0.0,
                100.0
            ),
            eyeOffset: new Cesium.Cartesian3(0, 3.5, 0),
        },
    });

    viewer.trackedEntity = vehicleEntity;
    vehicleEntity.viewFrom = new Cesium.Cartesian3(-10.0, 7.0, 4.0);

    //  const ciewPosition = new Cesium.Cartesian3.fromDegrees(105.694214, 32.389207)
    //  viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(ciewPosition, 100))
}

export function initRunModel2(Cesium, viewer) {
    const position = new Cesium.Cartesian3.fromDegrees(105.694214, 32.389207)
    const startPosition = new Cesium.Cartesian3.fromDegrees(105.680324, 32.388253)
    const endPosition = new Cesium.Cartesian3.fromDegrees(105.707821, 32.392738)
    let factor = 0;

    // 添加模型
    const vehicleEntity = viewer.entities.add({
        orientation: Cesium.Transforms.headingPitchRollQuaternion(
            new Cesium.Cartesian3.fromDegrees(105.680324, 32.388253),
            new Cesium.HeadingPitchRoll(
                Cesium.Math.toRadians(-10), //顺时针旋转的角度值
                Cesium.Math.toRadians(0),
                Cesium.Math.toRadians(0)
            )
        ),
        position: new Cesium.CallbackProperty(function () {
            if (factor > 3000) {
                factor = 0;
            }
            factor++;
            // 动态更新位置
            return Cesium.Cartesian3.lerp(startPosition, endPosition, factor / 3000.0, new Cesium.Cartesian3());
        }, false),
        model: {
            uri: "https://jdvop.oss-cn-qingdao.aliyuncs.com/mapv-data/model/2099city/scene.gltf",
            scale: 0.001,
        },
    });

    viewer.trackedEntity = vehicleEntity;

    // viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(position, 100))
}

export default {
    initRunModel
}