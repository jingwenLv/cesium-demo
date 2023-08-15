<!-- 自定义元素 -->

<template>
    <el-row ref="viewerContainer" class="demo-viewer">
        <vc-viewer @ready="ready">
            <vc-overlay-html ref="html" :position="[117.186419, 45.66446, 20]" :show="show">
                <div class="vc-box">aa</div>
            </vc-overlay-html>
            <vc-entity :position="[117.186419, 45.66446, 20]">
                <vc-graphics-point color="red" :pixel-size="8"></vc-graphics-point>
            </vc-entity>
            <vc-overlay-html :position="{ lng: 104.04, lat: 30.40 }">
                <div class="label-container label-container-var">
                    <div class="label-animate-marker_border">
                        <span class="label-animate-marker_text">成都欢迎您</span>
                    </div>
                </div>
            </vc-overlay-html>
            <!-- 热力图 -->
            <!-- <vc-overlay-heatmap v-if="data.length" ref="heatmap" :data="data" :rectangle="rectangle" :max="max" :min="min"
                :show="show" :options="options" @ready="onHeatmapReady" type="primitive" :segments="segments">
            </vc-overlay-heatmap> -->
            <vc-layer-imagery :sort-order="20">
                <vc-imagery-provider-tianditu map-style="cva_c"
                    token="436ce7e50d27eede2f2929307e6b33c0"></vc-imagery-provider-tianditu>
            </vc-layer-imagery>
            <vc-layer-imagery :sort-order="10">
                <vc-imagery-provider-tianditu map-style="img_c"
                    token="436ce7e50d27eede2f2929307e6b33c0"></vc-imagery-provider-tianditu>
            </vc-layer-imagery>
        </vc-viewer>
        <el-row class="demo-toolbar">
            <el-button type="danger" round @click="unload">销毁</el-button>
            <el-button type="danger" round @click="load">加载</el-button>
            <el-button type="danger" round @click="reload">重载</el-button>
            <el-button type="danger" round @click="toggle">显/隐</el-button>
        </el-row>
    </el-row>
</template>
    
<script>
export default {
    data() {
        return {
            show: true,
            data: [],
            max: 346.05413818359375,
            min: 0.5259535908699036,
            rectangle: [0, 0, 0, 0],
            segments: [
                [10, '#4A90C3'],
                [20, '#81AAAC'],
                [40, '#B2C899'],
                [60, '#E5EA84'],
                [100, '#F8DE6D'],
                [150, '#EFA451'],
                [200, '#E46C38'],
                [346, '#D53127']
            ],
            options: {
                backgroundColor: 'rgba(0,0,0,0)',
                // gradient: {
                //   // enter n keys between 0 and 1 here
                //   // for gradient color customization
                //   0.0289017: '#4A90C3', // 0-10
                //   0.0578035: '#81AAAC', // 11-20
                //   0.1156069: '#B2C899', // 21-40
                //   0.1734104: '#E5EA84', // 41-60
                //   0.2890173: '#F8DE6D', // 61-100
                //   0.433526: '#EFA451', // 101-150
                //   0.5780347: '#E46C38', // 151-200
                //   1: '#D53127' // 201-346
                // },
                opacity: 0.8,
                radius: 10,
                maxOpacity: 0.6,
                minOpacity: 0.3,
                blur: 0.75
            }
        }
    },
    methods: {
        ready({ Cesium, viewer }) {
            Cesium.Resource.fetchJson({ url: 'https://zouyaoji.top/vue-cesium/SampleData/heatmap/pop.json' }).then(res => {
                this.rectangle = res.bounds
                this.min = res.min
                this.max = res.max
                this.data = res.data
            })
        },
        onHeatmapReady({ Cesium, viewer, cesiumObject }) {
            this.$refs.heatmap.childRef.value.creatingPromise.then(({ Cesium, viewer, cesiumObject }) => {
                console.log(cesiumObject)
                if (cesiumObject instanceof Cesium.GroundPrimitive) {
                    const geometry = cesiumObject.geometryInstances.geometry.constructor.createGeometry(cesiumObject.geometryInstances.geometry)
                    viewer.scene.camera.flyToBoundingSphere(geometry.boundingSphere)
                } else if (cesiumObject instanceof Cesium.Entity) {
                    viewer.flyTo(cesiumObject)
                } else {
                    viewer.camera.flyTo({ destination: cesiumObject.imageryProvider.rectangle })
                }
            })
        },
        unload() {
            this.$refs.html.unload()
        },
        load() {
            this.$refs.html.load()
        },
        reload() {
            this.$refs.html.reload()
        },
        toggle() {
            this.show = !this.show
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
    