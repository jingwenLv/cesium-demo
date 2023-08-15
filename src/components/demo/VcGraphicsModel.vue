<!-- 模型 -->
<template>
    <el-row ref="viewerContainer" class="demo-viewer">
        <vc-viewer @ready="onViewerReady">
            <vc-layer-imagery :sort-order="20">
                <vc-imagery-provider-tianditu map-style="cva_c"
                    token="436ce7e50d27eede2f2929307e6b33c0"></vc-imagery-provider-tianditu>
            </vc-layer-imagery>
            <vc-layer-imagery :sort-order="20" :alpha="1" :brightness="1" :contrast="1" :sortOrder="20">
                <vc-imagery-provider-tianditu map-style="img_c" token="436ce7e50d27eede2f2929307e6b33c0" :minimumLevel="0"
                    :maximumLevel="17"></vc-imagery-provider-tianditu>
            </vc-layer-imagery>
            <vc-entity :position="[114, 40, 1.0]" description="Hello VueCesium" @click="onEntityEvt"
                @mouseover="onEntityEvt" @mouseout="onEntityEvt">
                <vc-graphics-model ref="model" :uri="modelUrl" :scale="10"></vc-graphics-model>
            </vc-entity>
        </vc-viewer>
    </el-row>
</template>
    
<script>
import { ref, getCurrentInstance, onMounted } from 'vue'
export default {
    setup() {

        // const modelUrl = 'https://zouyaoji.top/vue-cesium/SampleData/models/GroundVehicle/GroundVehicle.glb'
        const modelUrl = 'https://zouyaoji.top/vue-cesium/SampleData/models/GroundVehicle/GroundVehicle.glb'
        // const modelUrl = 'https://mapv-data.oss-cn-hangzhou.aliyuncs.com/model/pyramid.glb'
        // methods
        const onEntityEvt = e => {
            console.log(e)
        }
        const onViewerReady = cesiumInstance => {
            console.log('viewer ready')
        }

        const model = ref(null)

        // life cycle
        onMounted(() => {
            model.value.creatingPromise.then(({ Cesium, viewer, cesiumObject }) => {
                // viewer.zoomTo(viewer.entities)
                viewer.zoomTo(cesiumObject._vcParent)
            })
        })

        return {
            onEntityEvt,
            onViewerReady,
            model,
            modelUrl
        }
    }
}
</script>
    
<style></style>
    