
<template>
    <el-row ref="viewerContainer" class="demo-viewer">
        <vc-viewer @ready="onViewerReady">
            <vc-primitive :appearance="appearance" @click="onClicked">
                <vc-geometry-instance :attributes="attributes">
                    <vc-geometry-frustum ref="geometryRef" :frustum="frustum" :origin="{ lng: 105, lat: 35 }"
                        :orientation="{ x: 0, y: 0, z: 0, w: 5 }" :vertexFormat="vertexFormat"></vc-geometry-frustum>
                </vc-geometry-instance>
            </vc-primitive>
            <vc-primitive :appearance="appearance" @click="onClicked" v-if="outline">
                <vc-geometry-instance :attributes="attributesOutline">
                    <vc-geometry-frustum-outline ref="geometryOutlineRef" :frustum="frustum" :origin="{ lng: 105, lat: 35 }"
                        :orientation="{ x: 0, y: 0, z: 0, w: 5 }"></vc-geometry-frustum-outline>
                </vc-geometry-instance>
            </vc-primitive>

            <vc-layer-imagery :sort-order="20" :alpha="1" :brightness="1" :contrast="1" :sortOrder="20">
                <vc-imagery-provider-tianditu map-style="img_c" token="436ce7e50d27eede2f2929307e6b33c0" :minimumLevel="0"
                    :maximumLevel="17"></vc-imagery-provider-tianditu>
            </vc-layer-imagery>
        </vc-viewer>
        <el-row class="demo-toolbar">
            <el-button type="danger" round @click="unload">销毁</el-button>
            <el-button type="danger" round @click="load">加载</el-button>
            <el-button type="danger" round @click="reload">重载</el-button>
            <el-switch v-model="outline" active-color="#13ce66" inactive-text="边框"> </el-switch>
        </el-row>
    </el-row>
</template>
    
<script>
import { ref, reactive, getCurrentInstance, onMounted, watch } from 'vue'
export default {
    setup() {
        // state
        const instance = getCurrentInstance()
        const geometryRef = ref(null)
        const geometryOutlineRef = ref(null)
        const appearance = ref(null)
        const attributes = ref(null)
        const attributesOutline = ref(null)
        const outline = ref(true)
        const frustum = ref(null)
        const vertexFormat = ref(null)
        // methods
        const onClicked = e => {
            console.log(e)
        }
        const unload = () => {
            geometryRef.value.unload()
            geometryOutlineRef.value.unload()
        }
        const reload = () => {
            geometryRef.value.reload()
            geometryOutlineRef.value.reload()
        }
        const load = () => {
            geometryRef.value.load()
            geometryOutlineRef.value.load()
        }
        const onViewerReady = ({ Cesium, viewer }) => {
            console.log('onViewerReady')
            const { ColorGeometryInstanceAttribute, PerInstanceColorAppearance, Matrix4, Cartesian3, PerspectiveFrustum } = Cesium
            attributes.value = {
                color: new ColorGeometryInstanceAttribute(Math.random(), Math.random(), Math.random(), 0.5)
            }
            attributesOutline.value = {
                color: new ColorGeometryInstanceAttribute(Math.random(), Math.random(), Math.random())
            }
            appearance.value = new PerInstanceColorAppearance({
                flat: true
            })
            vertexFormat.value = PerInstanceColorAppearance.VERTEX_FORMAT
            frustum.value = new PerspectiveFrustum({
                fov: Cesium.Math.toRadians(30.0),
                aspectRatio: 1920.0 / 1080.0,
                near: 1.0,
                far: 500000
            })
        }
        // lifecycle
        onMounted(() => {
            Promise.all([geometryRef.value.creatingPromise, geometryOutlineRef.value.creatingPromise]).then(geometries => {
                const { BoundingSphere } = Cesium
                const boundingSphereUnion = geometries.reduce((prev, cur) => {
                    const geometry = cur.cesiumObject.constructor.createGeometry(cur.cesiumObject)
                    const boundingSphere = cur.vm.proxy.$parent.modelMatrix
                        ? BoundingSphere.transform(geometry.boundingSphere, cur.vm.proxy.$parent.modelMatrix)
                        : geometry.boundingSphere
                    return prev === null ? boundingSphere : BoundingSphere.union(prev, boundingSphere)
                }, null)
                geometries[0].viewer.scene.camera.flyToBoundingSphere(boundingSphereUnion)
                console.log('All geometries are loaded.')
            })
        })
        return {
            unload,
            reload,
            load,
            onClicked,
            onViewerReady,
            geometryRef,
            geometryOutlineRef,
            appearance,
            attributes,
            attributesOutline,
            outline,
            frustum,
            vertexFormat
        }
    }
}
</script>
    
<style></style>
    