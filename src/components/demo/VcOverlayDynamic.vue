<!-- 动态对象 -->
<template>
  <el-row ref="viewerContainer" class="demo-viewer">
    <vc-viewer timeline animation :info-box="true" :scene-mode-picker="true" @ready="onViewerReady" fullscreenButton>
      <vc-overlay-dynamic ref="dynamicOverlayRef" v-model:current-time="currentTime" v-model:start-time="startTime"
        v-model:stop-time="stopTime" :dynamic-overlays="dynamicOverlays" :clock-range="clockRange"
        :multiplier="multiplier" :should-animate="shouldAnimate" @update:should-animate="shouldAnimate = $event"
        @stop-arrived="stopArrived" @ready="ready">
      </vc-overlay-dynamic>
      <vc-layer-imagery :sort-order="10">
        <vc-imagery-provider-tianditu map-style="vec_c"
          token="436ce7e50d27eede2f2929307e6b33c0"></vc-imagery-provider-tianditu>
      </vc-layer-imagery>
      <vc-collection-point v-if="showStop" :points="stops"></vc-collection-point>
    </vc-viewer>
    <el-row class="demo-toolbar">
      <el-button type="danger" round @click="unload">销毁</el-button>
      <el-button type="danger" round @click="load">加载</el-button>
      <el-button type="danger" round @click="reload">重载</el-button>
      <el-button type="danger" round @click="viewTopDown">俯视</el-button>
      <el-button type="danger" round @click="viewSide">侧视</el-button>
      <el-button type="danger" round @click="trackOverlay('TRACKED')">默认跟随</el-button>
      <el-button type="danger" round @click="trackOverlay('TP')">俯视跟随</el-button>
      <el-button type="danger" round @click="trackOverlay('FP')">第一人称跟随</el-button>
      <el-button type="danger" round @click="trackOverlay('FREE')">取消跟随</el-button>
      <el-radio-group v-model="radio" @change="onRadioChanged">
        <el-radio :label="0">实时轨迹</el-radio>
        <el-radio :label="1">历史轨迹</el-radio>
      </el-radio-group>
      <el-checkbox v-if="radio === 1" v-model="showStop" style="padding-left: 15px;">显示站点</el-checkbox>
    </el-row>
  </el-row>
</template>
    
<script>
import { ref, nextTick, onMounted, onUnmounted, computed } from 'vue'
export default {
  setup() {
    const dynamicOverlays = ref([])
    const dynamicOverlayRef = ref(null)
    const currentTime = ref(null)
    const startTime = ref(null)
    const stopTime = ref(null)
    const clockRange = ref(0)
    const radio = ref(1)
    const multiplier = ref(1.0)
    const text = ref('yeah')
    const showStop = ref(false)
    const shouldAnimate = ref(false)
    const stops = computed(() => {
      return dynamicOverlays.value.map(v => {
        return v.sampledPositions.map(v => ({ position: v.position, color: 'rgb(255,229,0)' }))
      })?.[0]
    })

    const makeRealTimeTrajectory = () => {
      multiplier.value = 1
      clockRange.value = Cesium.ClockRange.UNBOUNDED
      const start = Cesium.JulianDate.fromDate(new Date())
      const stop = Cesium.JulianDate.addHours(start, 8, new Cesium.JulianDate())
      stopTime.value = stop.clone()
      currentTime.value = start.clone()
      startTime.value = start.clone()

      const overlays = []
      for (let i = 0; i < 50; i++) {
        overlays.push({
          id: i,
          maxCacheSize: 10, // 最大缓存点位数，实时轨迹不要设置太大；历史轨迹要设置得大于总点位数，不然要丢失数据。
          model: {
            uri: 'https://zouyaoji.top/vue-cesium/SampleData/models/Car/Car.gltf',
            scale: 0.5
          },
          // 轨迹
          path: {
            leadTime: 0,
            trailTime: 0.5,
            resolution: 1,
            width: 3,
            material: { fabric: { type: 'PolylineGlow', uniforms: { glowPower: 0.1, color: 'yellow' } } }
          },
          // 采样位置
          sampledPositions: [
            {
              position: generatePosition(1, 0.05)[0], // 给一个初始位置 ready 事件才能定位 否则要延后
              interval: 3,
              id: Cesium.createGuid()
            }
          ]
        })
      }
      return overlays
    }

    const makeHistoryTrajectory = async () => {
      const datas = await Cesium.Resource.fetchJson('../../SampleData/json/trajectory.json')
      const overlays = []
      const sampledPositions = []
      const positions = []
      startTime.value = new Date(datas[0].time)
      currentTime.value = new Date(datas[0].time)
      stopTime.value = new Date(datas[datas.length - 1].time)
      multiplier.value = 10
      clockRange.value = Cesium.ClockRange.LOOP_STOP
      const totalSeconds = Cesium.JulianDate.fromDate(stopTime.value).secondsOfDay - Cesium.JulianDate.fromDate(startTime.value).secondsOfDay
      // Store the wheel's rotation over time in a SampledProperty.
      const wheelAngleProperty = new Cesium.SampledProperty(Number)
      let wheelAngle = 0

      for (let i = 0; i < datas.length; i++) {
        const data = datas[i]
        sampledPositions.push({
          position: [data.lon, data.lat],
          time: data.time,
          id: data.id
        })
        positions.push([data.lon, data.lat])

        const metersPerSecond = Number(data.speed)
        const wheelRadius = 0.52 //in meters.
        const circumference = Math.PI * wheelRadius * 2
        const rotationsPerSecond = metersPerSecond / circumference
        const time = Cesium.JulianDate.fromIso8601(data.time.replace(' ', 'T'))

        wheelAngle += ((Math.PI * 2 * totalSeconds) / datas.length) * rotationsPerSecond
        wheelAngleProperty.addSample(time, wheelAngle)
      }

      const rotationProperty = new Cesium.CallbackProperty(function (time, result) {
        const wheelAngle = wheelAngleProperty.getValue(time)
        return Cesium.defined(wheelAngle) ? Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_X, wheelAngle, result) : new Cesium.Quaternion()
      }, false)

      const wheelTransformation = new Cesium.NodeTransformationProperty({
        rotation: rotationProperty
      })

      const nodeTransformations = {
        Wheels: wheelTransformation,
        Wheels_mid: wheelTransformation,
        Wheels_rear: wheelTransformation
      }

      overlays.push({
        maxCacheSize: datas.length, // 最大缓存点位数，实时轨迹不要设置太大；历史轨迹要设置得大于总点位数，不然要丢失数据。
        model: {
          uri: 'https://zouyaoji.top/vue-cesium/SampleData/models/GroundVehicle/GroundVehicle.glb',
          scale: 5,
          runAnimations: false,
          nodeTransformations: nodeTransformations
        },
        // 尾迹
        path: {
          leadTime: 0,
          trailTime: 25,
          resolution: 1,
          width: 10,
          material: { fabric: { type: 'PolylineGlow', uniforms: { glowPower: 0.1, color: 'yellow' } } }
        },
        // 标签
        label: {
          text: new Cesium.CallbackProperty(time => {
            if (dynamicOverlayRef.value.getOverlays().length) {
              const velocityVector = dynamicOverlayRef.value.getOverlays()[0]._velocityVectorProperty.getValue(time, {})
              var metersPerSecond = Cesium.Cartesian3.magnitude(velocityVector)
              var kmPerHour = Math.round(metersPerSecond * 3.6)

              return kmPerHour + ' km/h'
            }
            return 'hello'
          }, false),
          verticalOrigin: 1,
          showBackground: true,
          font: '20px sans-serif',
          distanceDisplayCondition: [0, 3000],
          eyeOffset: { x: 0, y: 25, z: 0 }
        },
        // 轨迹
        polyline: {
          positions,
          width: 3,
          material: '#69B273',
          depthFailMaterial: '#69B273',
          clampToGround: true
        },
        // rectangle: {
        //   material: 'red',
        //   coordinates: () => {
        //     return Cesium.Rectangle.fromDegrees(121, 32, 121.5, 32.5)
        //   }
        //   // coordinates: [102, 32, 104, 34]
        // },
        sampledPositions
      })
      return overlays
    }

    const generatePosition = (num, range) => {
      let list = []
      for (let i = 0; i < num; i++) {
        let lng = 120.65276089 + Math.random() * range
        let lat = 31.310530293 + Math.random() * range
        list.push([lng, lat])
      }
      return list
    }

    const unload = () => {
      dynamicOverlayRef.value.unload()
    }
    const load = () => {
      dynamicOverlayRef.value.load()
    }
    const reload = () => {
      dynamicOverlayRef.value.reload()
    }
    let timer, _viewer

    const ready = ({ viewer, cesiumObject }) => {
      var scene = viewer.scene
      scene.debugShowFramesPerSecond = true
      shouldAnimate.value = true
      viewer.flyTo(cesiumObject, {
        duration: 3
      })
    }

    const onRadioChanged = async e => {
      timer && clearInterval(timer)
      if (e === 0) {
        dynamicOverlays.value = makeRealTimeTrajectory()
        timer = setInterval(() => {
          // dynamicOverlayRef.value.getOverlays().forEach(v => v.addPosition(generatePosition(1, 0.05)[0], 3))
          dynamicOverlays.value.forEach(v => {
            v.sampledPositions.push({
              position: generatePosition(1, 0.05)[0],
              time: Cesium.JulianDate.addSeconds(Cesium.JulianDate.now(), 3, new Cesium.JulianDate()),
              id: Cesium.createGuid()
            })
            v.sampledPositions.length > 10 && v.sampledPositions.splice(0, 1)
          })
        }, 3000)
        nextTick(() => {
          dynamicOverlayRef.value.cesiumObject && _viewer?.flyTo(dynamicOverlayRef.value.cesiumObject, { duration: 3 })
          _viewer.timeline.zoomTo(_viewer.clock.startTime, _viewer.clock.stopTime)
        })
      } else {
        dynamicOverlays.value = await makeHistoryTrajectory()

        nextTick(() => {
          const sampledPositions = dynamicOverlayRef.value.cesiumObject.entities.values[0].sampledPositions
          const positions = sampledPositions.map(v => {
            return Cesium.Cartesian3.fromDegrees(v.position[0], v.position[1])
          })
          _viewer.timeline.zoomTo(_viewer.clock.startTime, _viewer.clock.stopTime)
          viewTopDown()
        })
      }
    }

    const onViewerReady = ({ viewer }) => {
      _viewer = viewer
      onRadioChanged(radio.value)
    }

    const viewTopDown = () => {
      if (radio.value === 0) {
        dynamicOverlayRef.value.zoomToOverlay()
      } else {
        dynamicOverlayRef.value.zoomToOverlay([], [0, -90, 1500])
      }
    }

    const viewSide = () => {
      if (radio.value === 0) {
        dynamicOverlayRef.value.zoomToOverlay([], [-50, -20, 8000])
      } else {
        dynamicOverlayRef.value.zoomToOverlay([], [-50, -20, 1800])
      }
    }

    const trackOverlay = mode => {
      console.log(mode, 'mode')
      dynamicOverlayRef.value.trackOverlay(0, {
        mode,
        viewFrom: [0, 0, 1800]
      })
    }

    const stopArrived = (overlay, stop) => {
      console.log('到达站点：', overlay, stop)
    }

    onUnmounted(() => {
      clearInterval(timer)
    })

    return {
      dynamicOverlays,
      dynamicOverlayRef,
      currentTime,
      startTime,
      stopTime,
      clockRange,
      onViewerReady,
      unload,
      load,
      reload,
      ready,
      radio,
      onRadioChanged,
      multiplier,
      viewTopDown,
      viewSide,
      trackOverlay,
      stops,
      showStop,
      stopArrived,
      shouldAnimate
    }
  }
}
</script>
    
<style scoped>
::v-deep .demo-toolbar {
  position: absolute;
  z-index: 99999;
  top: 16px;
  left: 16px;
}
</style>
        
    