<!-- echarts -->

<template>
    <el-row ref="viewerContainer" class="demo-viewer">
        <vc-viewer :camera="camera">
            <vc-overlay-echarts ref="echartOverlay" :options="options"> </vc-overlay-echarts>
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
        </el-row>
    </el-row>
</template>
    
<script>
import { ref } from 'vue'
export default {
    setup() {
        const camera = ref({
            position: [107.033, 26.976, 5725046.53],
            heading: 14,
            pitch: -79,
            roll: 0.06
        })
        const echartOverlay = ref(null)
        const datas = [
            {
                level: 1,
                name: '北京',
                label: 'beijing',
                value: [116.4551, 40.2539],
                symbol: '',
                symbolSize: [30, 30]
            },
            {
                level: 1,
                symbol: '',
                name: '廊坊',
                label: 'langfang',
                category: 0,
                active: !0,
                speed: 6,
                value: [116.521, 39.0509],
                belong: '北京'
            },
            {
                level: 1,
                symbol: '',
                name: '乌鲁木齐',
                category: 0,
                active: !0,
                speed: 6,
                value: [87.9236, 43.5883],
                belong: '北京'
            },
            {
                level: 1,
                symbol: '',
                name: '兰州',
                category: 0,
                active: !0,
                speed: 6,
                value: [103.5901, 36.3043],
                belong: '北京'
            },
            {
                level: 1,
                symbol: '',
                name: '杭州',
                category: 0,
                active: !0,
                speed: 6,
                value: [119.5313, 29.8773],
                belong: '北京'
            },
            {
                level: 1,
                symbol: '',
                name: '四川',
                category: 0,
                active: !0,
                speed: 6,
                value: [103.9526, 30.7617],
                belong: '北京'
            },
            {
                level: 2,
                symbol: '',
                name: '重庆',
                category: 0,
                active: !0,
                speed: 6,
                value: [107.7539, 30.1904],
                belong: '四川'
            },
            {
                level: 1,
                symbol: '',
                name: '厦门',
                category: 0,
                active: !0,
                speed: 6,
                value: [118.1689, 24.6478],
                belong: '北京'
            },
            {
                level: 1,
                symbol: '',
                name: '包头',
                category: 0,
                active: !0,
                speed: 6,
                value: [110.3467, 41.4899],
                belong: '北京'
            },
            {
                level: 1,
                symbol: '',
                name: '温州',
                category: 0,
                active: !0,
                speed: 6,
                value: [120.498, 27.8119],
                belong: '杭州'
            },
            {
                level: 2,
                symbol: '',
                name: '舟山',
                category: 0,
                active: !0,
                speed: 6,
                value: [122.2559, 30.2234],
                belong: '杭州'
            }
        ]

        const lineColors = ['#fff', '#f6fb05', '#00fcff']
        const stationSymbols = [
            'image://https://zouyaoji.top/vue-cesium/images/station-blue.png',
            'image://https://zouyaoji.top/vue-cesium/images/station-yellow.png'
        ]
        const lineSymbols = [
            'image://https://zouyaoji.top/vue-cesium/images/symbol-white.png',
            'image://https://zouyaoji.top/vue-cesium/images/symbol-yellow.png'
        ]
        datas.forEach(data => {
            data.symbol = stationSymbols[data.level - 1]
        })

        const arrs = [[], [], []]

        datas.forEach(data => {
            if (data.belong) {
                const belongs = Array.isArray(data.belong) ? data.belong : [data.belong]
                belongs.forEach(belong => {
                    datas.forEach(item => {
                        if (belong === item.name) {
                            arrs[data.level - 1].push([
                                {
                                    coord: item.value
                                },
                                {
                                    coord: data.value
                                }
                            ])
                        }
                    })
                })
            }
        })

        const seriesEffectScatter = [
            {
                type: 'effectScatter',
                coordinateSystem: 'cesium',
                symbolSize: [20, 20],
                symbolOffset: [0, -10],
                z: 3,
                circular: { rotateLabel: !0 },
                label: {
                    normal: {
                        show: !0,
                        position: 'right',
                        formatter: '{b}',
                        fontSize: 24,
                        color: '#fff',
                        textBorderColor: '#2aa4e8',
                        textBorderWidth: 2,
                        offset: [0, 20]
                    }
                },
                itemStyle: { normal: { shadowColor: 'none' } },
                data: datas
            }
        ]
        const seriesLines = []
        arrs.forEach((arr, index) => {
            console.log(arr)
            seriesLines.push({
                name: '',
                type: 'lines',
                coordinateSystem: 'cesium',
                z: 1,
                effect: {
                    show: !0,
                    smooth: !1,
                    trailLength: 0,
                    symbol: lineSymbols[index],
                    symbolSize: [10, 30],
                    period: 4
                },
                lineStyle: { width: 2, color: lineColors[index], curveness: -0.2 },
                data: arr
            })
        })

        const options = { animation: !0, series: [...seriesEffectScatter, ...seriesLines] }
        console.log(options)
        const unload = () => {
            echartOverlay.value.unload()
        }
        const load = () => {
            echartOverlay.value.load()
        }
        const reload = () => {
            echartOverlay.value.reload()
        }
        return {
            camera,
            options,
            unload,
            load,
            reload,
            echartOverlay
        }
    }
}
</script>
    
<style></style>
    