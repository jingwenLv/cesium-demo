
<template>
    <el-row ref="viewerContainer" class="demo-viewer">
        <vc-viewer shouldAnimate animation timeline @ready="onViewerReady">
            <vc-entity ref="entity" :availability="availability" :position="position" :orientation="orientation"
                description="Hello VueCesium">
                <!-- <vc-graphics-path ref="path" :resolution="1"
                    :material="{ fabric: { type: 'PolylineGlow', uniforms: { glowPower: 0.1, color: 'yellow' } } }"
                    :width="10"></vc-graphics-path> -->
                <vc-graphics-model ref="model"
                    uri="https://zouyaoji.top/vue-cesium/SampleData/models/CesiumAir/Cesium_Air.glb"
                    :minimumPixelSize="128"></vc-graphics-model>
            </vc-entity>
            <!-- <vc-entity :key="'entity' + index" :position="position" v-for="(position, index) of positions">
                <vc-graphics-point :pixel-size="8" color="TRANSPARENT" outlineColor="YELLOW"
                    :outlineWidth="3"></vc-graphics-point>
            </vc-entity> -->
            <vc-layer-imagery>
                <vc-imagery-provider-arcgis></vc-imagery-provider-arcgis>
            </vc-layer-imagery>
        </vc-viewer>
        <el-row class="demo-toolbar">
            <el-button type="danger" round @click="viewTopDown">俯视</el-button>
            <el-button type="danger" round @click="viewSide">侧视</el-button>
            <el-button type="danger" round @click="viewAircraft">跟随</el-button>
        </el-row>
    </el-row>
</template>
    
<script>
import { ref, getCurrentInstance, onMounted } from 'vue'
export default {
    setup() {
        // state
        const position = ref({})
        const positions = ref([])
        const model = ref(null)
        const availability = ref(null)
        const orientation = ref(null)
        const entity = ref(null)
        let _viewer = undefined

        // methods
        const onEntityEvt = e => {
            console.log(e)
        }
        const onViewerReady = ({ Cesium, viewer }) => {
            console.log('viewer ready')
            _viewer = viewer
            //Enable lighting based on sun/moon positions
            viewer.scene.globe.enableLighting = true
            //Enable depth testing so things behind the terrain disappear.
            viewer.scene.globe.depthTestAgainstTerrain = true
            //Set the random number seed for consistent results.
            Cesium.Math.setRandomNumberSeed(3)
            const start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16))
            const stop = Cesium.JulianDate.addSeconds(start, 360, new Cesium.JulianDate())
            viewer.clock.startTime = start.clone()
            viewer.clock.stopTime = stop.clone()
            viewer.clock.currentTime = start.clone()
            viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP //Loop at the end
            viewer.clock.multiplier = 10
            viewer.timeline.zoomTo(start, stop)
            position.value = computeCirclularFlight(-112.110693, 36.0994841, 0.03, start)
            availability.value = new Cesium.TimeIntervalCollection([
                new Cesium.TimeInterval({
                    start: start,
                    stop: stop
                })
            ])
            orientation.value = new Cesium.VelocityOrientationProperty(position.value)
        }

        const computeCirclularFlight = (lon, lat, radius, start) => {
            let property = new Cesium.SampledPositionProperty()
            for (let i = 0; i <= 360; i += 45) {
                let radians = Cesium.Math.toRadians(i)
                let time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate())
                let position = Cesium.Cartesian3.fromDegrees(
                    lon + radius * 1.5 * Math.cos(radians),
                    lat + radius * Math.sin(radians),
                    Cesium.Math.nextRandomNumber() * 500 + 1750
                )
                property.addSample(time, position)
                positions.value.push(position)
            }
            return property
        }

        const viewTopDown = () => {
            _viewer.trackedEntity = undefined
            _viewer.zoomTo(_viewer.entities, new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-90)))
        }
        const viewSide = () => {
            _viewer.trackedEntity = undefined
            _viewer.zoomTo(_viewer.entities, new Cesium.HeadingPitchRange(Cesium.Math.toRadians(-90), Cesium.Math.toRadians(-15), 7500))
        }
        const viewAircraft = () => {
            _viewer.trackedEntity = entity.value.getCesiumObject()
        }

        // life cycle
        onMounted(() => {
            model.value.creatingPromise.then(({ Cesium, viewer }) => {
                viewer.zoomTo(viewer.entities)
            })
        })

        return {
            onEntityEvt,
            onViewerReady,
            model,
            entity,
            positions,
            orientation,
            availability,
            position,
            viewTopDown,
            viewSide,
            viewAircraft
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
    