export function initModel(Cesium, viewer) {
  // initPrimitiveModel(Cesium, viewer)
  initEntityModel(Cesium, viewer)
}

function initEntityModel(Cesium, viewer) {
  const position = new Cesium.Cartesian3.fromDegrees(114, 40, 1.0)

  let lat = 114
  let lng = 40
  let rotate = 0
  // let url = 'https://zouyaoji.top/vue-cesium/SampleData/models/GroundVehicle/GroundVehicle.glb'
  let url = 'https://jdvop.oss-cn-qingdao.aliyuncs.com/mapv-data/model/2099city/scene.gltf'
  //模型加载 by entity
  const gltfModel = viewer.entities.add({
    orientation: Cesium.Transforms.headingPitchRollQuaternion(
      new Cesium.Cartesian3.fromDegrees(lat, lng),
      new Cesium.HeadingPitchRoll(
        Cesium.Math.toRadians(rotate), //顺时针旋转的角度值
        Cesium.Math.toRadians(0),
        Cesium.Math.toRadians(0)
      )
    ),
    position: Cesium.Cartesian3.fromDegrees(lat, lng), //模型的加载位置,
    model: {
      uri: url, //模型的地址 
      scale: 1, //模型缩放比例
      // minimumPixelSize: 128, // 最小像素大小
      maximumScale: 20000, // 模型的最大比例尺大小。 minimumPixelSize的上限
      incrementallyLoadTextures: true, // 加载模型后纹理是否可以继续流入
      runAnimations: true, // 是否应启动模型中指定的glTF动画
      clampAnimations: true, // 指定glTF动画是否应在没有关键帧的持续时间内保持最后一个姿势
      eyeOffset: new Cesium.Cartesian3(0, 0, -10000), //设置模型的可见度
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      // 指定模型是否投射或接收来自光源的阴影 type:ShadowMode
      // DISABLED 对象不投射或接收阴影;ENABLED 对象投射并接收阴影;CAST_ONLY  对象仅投射阴影;RECEIVE_ONLY  对象仅接收阴影
      shadows: Cesium.ShadowMode.ENABLED,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND //设置模型贴地,
    }
  })

  viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(position, 100000));
}


function initPrimitiveModel(Cesium, viewer) {
  const position = new Cesium.Cartesian3.fromDegrees(114, 40, 1.0)

  let url = 'https://zouyaoji.top/vue-cesium/SampleData/models/GroundVehicle/GroundVehicle.glb'
  let option = {
    scale: 10,
    name: '模型',
    rotationz: 0
  }

  const origin = position
  const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin) //加载坐标
  let modelPrimitive = null
  modelPrimitive = viewer.scene.primitives.add(
    Cesium.Model.fromGltf({
      url: url,
      modelMatrix: modelMatrix,
      show: true, // default
      scale: option.scale || 1,
      // minimumPixelSize : 128,  // never smaller than 128 pixels
      maximumScale: 20000, // never larger than 20000 * model size (overrides minimumPixelSize)
      allowPicking: true,
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
      scene: viewer.scene,
    })
  )
  modelPrimitive.name = option.name
  modelPrimitive.type = 'model'
  if (option.rotationz) {
    const mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(option.rotationz))
    const rotationz = Cesium.Matrix4.fromRotationTranslation(mz)
    //旋转、平移矩阵相乘
    Cesium.Matrix4.multiply(modelMatrix, rotationz, modelMatrix)
    modelPrimitive.modelMatrix = modelMatrix //模型旋转
  }
  modelPrimitive.readyPromise.then(function (model) {
    // 模型加载完毕后加载模型的动画
    model.activeAnimations.addAll({
      speedup: 1,
      loop: Cesium.ModelAnimationLoop.REPEAT,
    })
  })

  viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(position, 100))
}

export default {
  initModel
}