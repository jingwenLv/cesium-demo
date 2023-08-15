
<template>
    <el-row ref="viewerContainer" class="demo-viewer">
        <vc-viewer :shouldAnimate="true" :animation="true" :timeline="true" :scene-mode-picker="true" :show-credit="true"
            :base-layer-picker="true" @ready="onViewerReady">
            <vc-navigation :offset="offset"></vc-navigation>
            <!-- <vc-entity ref="entity" :availability="availability" :position="position" :orientation="orientation"
                description="Hello VueCesium">
                <vc-graphics-model ref="model"
                    uri="https://zouyaoji.top/vue-cesium/SampleData/models/CesiumAir/Cesium_Air.glb"
                    :minimumPixelSize="128"></vc-graphics-model>
            </vc-entity> -->
            <vc-layer-imagery :sort-order="20" :alpha="1" :brightness="1" :contrast="1" :sortOrder="20">
                <vc-imagery-provider-tianditu map-style="img_c" token="436ce7e50d27eede2f2929307e6b33c0" :minimumLevel="0"
                    :maximumLevel="17"></vc-imagery-provider-tianditu>
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
        const offset = [50, 150]
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
            viewer.entities.add({
                name: 'Red box with black outline',
                position: Cesium.Cartesian3.fromDegrees(-107.0, 40.0, 10000.0),
                box: {
                    dimensions: new Cesium.Cartesian3(40000.0, 30000.0, 50000.0),
                    material: Cesium.Color.RED.withAlpha(0.5),
                    outline: false,
                    outlineColor: Cesium.Color(0, 0, 0, 0.4)
                }
            });

            // viewer.zoomTo(viewer.entities);
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
            offset,
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
    
<style scoped></style>
    