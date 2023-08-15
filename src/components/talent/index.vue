
<template>
    <el-row ref="viewerContainer" class="demo-viewer">
        <vc-viewer ref="vcViewer" :animation="animation" :base-layer-picker="baseLayerPicker" :timeline="timeline"
            :fullscreen-button="fullscreenButton" :fullscreen-element="fullscreenElement" :info-box="infoBox"
            :skyAtmosphere="false" :skyBox="false" :scene-mode-picker="true" :show-credit="showCredit"
            @cesium-ready="onCesiumReady" @ready="onViewerReady" @left-click="onLeftClick" @touch-end="onTouchEnd">
            <vc-navigation :offset="offset" @compass-evt="onNavigationEvt" :other-opts="otherOpts"
                @zoom-evt="onNavigationEvt"></vc-navigation>
            <vc-layer-imagery :sort-order="20" :alpha="1" :brightness="1" :contrast="1" :sortOrder="20">
                <vc-imagery-provider-tianditu map-style="img_c" token="436ce7e50d27eede2f2929307e6b33c0" :minimumLevel="0"
                    :maximumLevel="17"></vc-imagery-provider-tianditu>
            </vc-layer-imagery>
            <!-- 天地图注记 -->
            <vc-layer-imagery :sort-order="20">
                <vc-imagery-provider-tianditu map-style="cva_c"
                    token="436ce7e50d27eede2f2929307e6b33c0"></vc-imagery-provider-tianditu>
            </vc-layer-imagery>
        </vc-viewer>
        <canvas id="canvas-a" class="canvas" width="300" height="300"></canvas>
        <canvas id="canvas-b" class="canvas" width="300" height="300"></canvas>
        <el-row class="demo-toolbar">
            <el-row>
                <el-button type="danger" round @click="unload">销毁</el-button>
                <el-button type="danger" round @click="load">加载</el-button>
                <el-button type="danger" round @click="reload">重载</el-button>
                <el-select v-model="selectValue" placeholder="请选择" clearable @change="selectChange">
                    <el-option v-for="item in selectOption" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-row>
        </el-row>
    </el-row>
</template>

<script>
import { startup } from './js/radar.js'
import { initCustomMaterial } from './js/customMaterial.js'
import initSquare from './js/square.ts'
import { initPlane } from './js/plane.js'
import { initLine } from './js/line.js'
import { initFayLine } from './js/parabola.js'
import { initModel } from './js/model.js'
import { initRunModel } from './js/runModel.js'
import { initDynamicPoint } from './js/dynamicPoint.js'
import { initMoveImg } from './js/movingPicture.js'
import { initRadarScanning } from './js/radarScanning.js'
import { initDynamicWall } from './js/dynamicWall.js'
import { initFlowLine } from './js/flowLine.js'
import { initControlsModel } from './js/controlsModel.js'
export default {
    data() {
        return {
            loading: true,
            canvas: null,
            canvasLIst: [],
            _Cesium: null,
            _viewer: null,
            animation: true,
            timeline: true,
            baseLayerPicker: false,
            fullscreenButton: true,
            infoBox: true,
            showCredit: true,
            fullscreenElement: document.body,
            point: {
                pixelSize: 28,
                color: 'red'
            },
            label: {
                text: 'Hello World',
                pixelOffset: [0, 150]
            },
            billboard: {},
            offset: [50, 25],
            otherOpts: {
                offset: [0, 32],
                position: 'bottom-right'
            },
            selectValue: '',
            selectOption: [
                {
                    value: '正方形',
                    label: '正方形'
                },
                {
                    value: '自定义材质正方形',
                    label: '自定义材质正方形'
                },
                {
                    value: '雷达',
                    label: '雷达'
                },
                {
                    value: '平面',
                    label: '平面'
                },
                {
                    value: '线',
                    label: '线'
                },
                {
                    value: '抛物线',
                    label: '抛物线'
                },
                {
                    value: '模型',
                    label: '模型'
                },
                {
                    value: 'control模型',
                    label: 'control模型'
                },
                {
                    value: '运动的模型',
                    label: '运动的模型'
                },
                {
                    value: '动态扩散点',
                    label: '动态扩散点'
                },
                // {
                //     value: '动态图片',
                //     label: '动态图片'
                // },
                {
                    value: '雷达扫描',
                    label: '雷达扫描'
                },
                {
                    value: '墙体',
                    label: '墙体'
                },
                {
                    value: 'flowLine',
                    label: 'flowLine'
                },
            ]
        }
    },
    watch: {
        timeline(val) {
            this.otherOpts.offset = val ? [0, 30] : this.fullscreenButton ? [30, 5] : [0, 5]
        },
        fullscreenButton(val) {
            if (!this.timeline && !val) {
                this.otherOpts.offset = [0, 5]
            } else if (!this.timeline && val) {
                this.otherOpts.offset = [30, 5]
            }
        }
    },
    mounted() {
        this.canvas = document.getElementById("canvas-a");
        let canvas01 = document.getElementById("canvas-b");
        this.canvasLIst = [this.canvas, canvas01]
        this.$refs.vcViewer.creatingPromise.then(({ Cesium, viewer }) => {
            console.log('viewer is loaded.')

        })
    },
    methods: {
        onViewerReady({ Cesium, viewer }) {
            this.loading = false
            this._Cesium = Cesium
            this._viewer = viewer
            // viewer.scene.globe.enableLighting = true
        },
        clear() {
            // 清除所有实体
            // this._viewer.entities.removeAll(); // 移除所有实体对象

            // // 清除所有模型
            this._viewer.scene.primitives.removeAll(); // 移除所有模型对象
        },
        selectChange(e) {
            // this.clear()
            this.seletFunction(e)
            // setTimeout(() => {
            //     // 请求重新渲染场景
            //     this._viewer.scene.requestRender(); // 请求重新渲染场景
            // }, 500);
            console.log(e, 'e')

        },
        seletFunction(e) {
            switch (e) {
                case '正方形':
                    initSquare(this._Cesium, this._viewer)
                    break;
                case '自定义材质正方形':
                    initCustomMaterial(this._Cesium, this._viewer)
                    break;
                case '平面':
                    initPlane(this._Cesium, this._viewer)
                    break;
                case '线':
                    initLine(this._Cesium, this._viewer, 2)
                    break;
                case '抛物线':
                    initFayLine(this._Cesium, this._viewer)
                    break;
                case '模型':
                    initModel(this._Cesium, this._viewer)
                    break;
                case 'control模型':
                    initControlsModel(this._Cesium, this._viewer)
                    break;
                case '运动的模型':
                    initRunModel(this._Cesium, this._viewer)
                    break;
                case '动态扩散点':
                    initDynamicPoint(this._Cesium, this._viewer)
                    break;
                // case '动态图片':
                //     initMoveImg(this._Cesium, this._viewer, this.canvasLIst)
                //     break;
                case '雷达扫描':
                    initRadarScanning(this._Cesium, this._viewer, this.canvas)
                    break;
                case '墙体':
                    initDynamicWall(this._Cesium, this._viewer)
                    break;
                case 'flowLine':
                    initFlowLine(this._Cesium, this._viewer)
                    break;
                default:
                    startup(this._viewer)
                    break;
            }
        },
        onCesiumReady(e) {
            console.log(e)
        },
        onNavigationEvt(e) {
            console.log(e)
        },
        onEntityClick(e) {
            console.log(e)
        },
        onLeftClick(e) {
            console.log(e)
        },
        onTouchEnd(e) {
            console.log(e)
        },
        load() {
            this.$refs.vcViewer.load().then(e => {
                console.log(e)
                this.loading = false
            })
        },
        unload() {
            this.$refs.vcViewer.unload().then(e => {
                console.log(e)
                this.loading = true
            })
        },
        reload() {
            this.loading = true
            this.$refs.vcViewer.reload().then(e => {
                console.log(e)
                this.loading = false
            })
        }
    }
}
</script>
    
<style scoped>
.el-select {
    width: 160px;
    margin-left: 16px;
}

.canvas {
    position: absolute;
    left: 10px;
    top: 10px;
    display: none;
}

#canvas-a {
    top: 10px;
}

#canvas-b {
    top: 120px;
}
</style>
    