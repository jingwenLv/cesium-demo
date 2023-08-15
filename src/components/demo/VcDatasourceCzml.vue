<!-- 卫星轨道 -->
<template>
    <el-row ref="viewerContainer" class="demo-viewer">
        <vc-viewer shouldAnimate>
            <!-- 卫星轨道 >>>>>>>>>>>> -->
            <vc-datasource-czml ref="datasourceRef" czml="https://zouyaoji.top/vue-cesium/SampleData/simple.czml"
                @ready="onDatasourceReady" :show="show" @click="onClicked"></vc-datasource-czml>
            <vc-datasource-czml :czml="czml"></vc-datasource-czml>

            <vc-layer-imagery :sort-order="20">
                <vc-imagery-provider-tianditu map-style="cva_c"
                    token="436ce7e50d27eede2f2929307e6b33c0"></vc-imagery-provider-tianditu>
            </vc-layer-imagery>
            <vc-layer-imagery :sort-order="10">
                <vc-imagery-provider-tianditu map-style="img_c"
                    token="436ce7e50d27eede2f2929307e6b33c0"></vc-imagery-provider-tianditu>
            </vc-layer-imagery>
            <!-- 卫星轨道 >>>>>>>>>>>> -->

            <!-- 正方形 -->
            <vc-entity ref="entity1" :position="options.position1" :description="options.description" @click="onEntityEvt"
                @mouseover="onEntityEvt" @mouseout="onEntityEvt">
                <vc-graphics-box :dimensions="options.dimensions1" :material="options.material1"></vc-graphics-box>
            </vc-entity>
            <vc-entity ref="entity2" :position="options.position2" :description="options.description">
                <vc-graphics-box :dimensions="options.dimensions2" :material="options.material2"
                    :outline-color="options.outlineColor2" :outline="true"></vc-graphics-box>
            </vc-entity>
            <vc-entity ref="entity3" :position="options.position3" :description="options.description">
                <vc-graphics-box :dimensions="options.dimensions3" :outline-color="options.outlineColor3" :fill="false"
                    :outline="true"></vc-graphics-box>
            </vc-entity>
            <!-- 正方形 -->
        </vc-viewer>
        <el-row class="demo-toolbar">
            <el-button type="danger" round @click="unload">销毁</el-button>
            <el-button type="danger" round @click="load">加载</el-button>
            <el-button type="danger" round @click="reload">重载</el-button>
            <el-switch v-model="show" active-color="#13ce66" inactive-text="显示/隐藏"> </el-switch>
        </el-row>
    </el-row>
</template>
    
<script>
import { ref, reactive, getCurrentInstance, onMounted, watch } from 'vue'
export default {
    setup() {
        // 卫星轨道 >>>>>>>>>>>>
        // state
        const show = ref(true)
        const datasourceRef = ref(null)

        const onClicked = e => {
            console.log(e)
        }
        const unload = () => {
            datasourceRef.value.unload()
        }
        const reload = () => {
            datasourceRef.value.reload()
        }
        const load = () => {
            datasourceRef.value.load()
        }
        const onDatasourceReady = ({ Cesium, viewer, cesiumObject }) => {
            // viewer.zoomTo(cesiumObject)
            viewer.camera.flyHome(0)
        }
        const czml = [
            {
                id: 'document',
                name: 'CZML Geometries: Polyline',
                version: '1.0'
            },
            {
                id: 'redLine',
                name: 'Red line clamped to terain',
                polyline: {
                    positions: {
                        cartographicDegrees: [-75, 35, 0, -125, 35, 0]
                    },
                    material: {
                        solidColor: {
                            color: {
                                rgba: [255, 0, 0, 255]
                            }
                        }
                    },
                    width: 5,
                    clampToGround: true
                }
            },
            {
                id: 'blueLine',
                name: 'Glowing blue line on the surface',
                polyline: {
                    positions: {
                        cartographicDegrees: [-75, 37, 0, -125, 37, 0]
                    },
                    material: {
                        polylineGlow: {
                            color: {
                                rgba: [0, 0, 255, 255]
                            },
                            glowPower: 0.2
                        }
                    },
                    width: 10
                }
            },
            {
                id: 'orangeLine',
                name: 'Orange line with black outline at height and following the surface',
                polyline: {
                    positions: {
                        cartographicDegrees: [-75, 39, 250000, -125, 39, 250000]
                    },
                    material: {
                        polylineOutline: {
                            color: {
                                rgba: [255, 165, 0, 255]
                            },
                            outlineColor: {
                                rgba: [0, 0, 0, 255]
                            },
                            outlineWidth: 2
                        }
                    },
                    width: 5
                }
            },
            {
                id: 'purpleLine',
                name: 'Purple arrow at height',
                polyline: {
                    positions: {
                        cartographicDegrees: [-75, 43, 500000, -125, 43, 500000]
                    },
                    material: {
                        polylineArrow: {
                            color: {
                                rgba: [148, 0, 211, 255]
                            }
                        }
                    },
                    followSurface: false,
                    width: 10
                }
            },
            {
                id: 'dashedLine',
                name: 'Blue dashed line',
                polyline: {
                    positions: {
                        cartographicDegrees: [-75, 45, 500000, -125, 45, 500000]
                    },
                    material: {
                        polylineDash: {
                            color: {
                                rgba: [0, 255, 255, 255]
                            }
                        }
                    },
                    width: 4
                }
            }
        ]
        // 卫星轨道 >>>>>>>>>>>>

        // 正方形 >>>>>>>>>>
        const options = {
            description: 'Hello VueCesium',

            position1: { lng: 105.0, lat: 40.0, height: 300000.0 },
            dimensions1: { x: 400000.0, y: 300000.0, z: 500000.0 },
            material1: 'BLUE',

            position2: { lng: 110.0, lat: 40.0, height: 300000.0 },
            dimensions2: { x: 400000.0, y: 300000.0, z: 500000.0 },
            material2: 'RED',
            outlineColor2: 'BLACK',

            position3: { lng: 100.0, lat: 40.0, height: 300000.0 },
            dimensions3: { x: 400000.0, y: 300000.0, z: 500000.0 },
            outlineColor3: 'YELLOW'
        }
        const entity1 = ref(null)
        const entity2 = ref(null)
        const entity3 = ref(null)

        // methods
        const onEntityEvt = e => {
            console.log(e)
        }

        onMounted(() => {
            // Promise.all([entity1.value.creatingPromise, entity2.value.creatingPromise, entity3.value.creatingPromise]).then(instances => {
            //     instances[0].viewer.zoomTo(instances[0].viewer.entities)
            // })
        })
        // 正方形 >>>>>>>>>>


        return {
            // 卫星轨道 >>>>>>>>>>>>
            czml,
            unload,
            reload,
            load,
            show,
            onClicked,
            onDatasourceReady,
            datasourceRef,
            // 卫星轨道 >>>>>>>>>>>>
            // 正方形 >>>>>>>>>>
            onEntityEvt,
            entity1,
            entity2,
            entity3,
            options
            // 正方形 >>>>>>>>>>
        }
    }
}
</script>
    
<style></style>
    