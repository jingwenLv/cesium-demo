
<!-- 绘制 -->
<template>
    <el-row ref="viewerContainer" class="demo-viewer">
      <vc-viewer>
        <!-- 修改定位 和 位置偏移 -->
        <vc-drawings
          ref="drawingsRef"
          position="bottom-left"
          :main-fab-opts="mainFabOpts"
          :offset="[10, 65]"
          :editable="editable"
          :clamp-to-ground="clampToGround"
          @draw-evt="drawEvt"
          @active-evt="activeEvt"
          @editor-evt="editorEvt"
          @mouse-evt="mouseEvt"
          @clear-evt="clearEvt"
          @ready="drawingsReadyDefault"
          :pin-drawing-opts="pinDrawingOpts"
          :point-drawing-opts="pointDrawingOpts"
          :polygon-drawing-opts="polygonDrawingOpts"
          :polyline-drawing-opts="polylineDrawingOpts"
          :regular-drawing-opts="regularDrawingOpts"
        ></vc-drawings>
        <!-- 结合 slot 改变默认 UI，自定义绘制方法 -->
        <vc-drawings
          ref="drawingsCustomRef"
          position="bottom-left"
          :main-fab-opts="mainFabOpts"
          :offset="[10, 30]"
          :editable="editable"
          :clamp-to-ground="clampToGround"
          :polyline-drawing-opts="polylineDrawingOpts"
          :pin-drawing-opts="pinDrawingOpts"
          :rectangle-drawing-opts="rectangleDrawingOpts"
        >
          <template #body="drawingActionInstances">
            <div class="custom-drawings">
              <el-row>
                <vc-btn
                  v-for="(drawingActionInstance, index) in drawingActionInstances"
                  :key="index"
                  :color="drawingActionInstance.isActive ? 'positive' : 'primary'"
                  rounded
                  @click="toggle(drawingActionInstance)"
                  >{{drawingActionInstance.tip.replace('绘制', '')}}</vc-btn
                >
                <vc-btn color="red" rounded @click="clear">清除</vc-btn>
              </el-row>
            </div>
          </template>
        </vc-drawings>
        <vc-primitive-tileset
          url="https://zouyaoji.top/vue-cesium/SampleData/Cesium3DTiles/Tilesets/dayanta/tileset.json"
          @ready-promise="onTilesetReady"
        ></vc-primitive-tileset>
        <vc-layer-imagery>
          <vc-imagery-provider-tianditu map-style="img_c" :maximum-level="17" token="436ce7e50d27eede2f2929307e6b33c0"></vc-imagery-provider-tianditu>
        </vc-layer-imagery>
        <vc-terrain-provider-cesium v-if="addTerrain"></vc-terrain-provider-cesium>
        <!-- <vc-selection-indicator ref="selectionIndicator" @pick-evt="pickEvt"></vc-selection-indicator> -->
      </vc-viewer>
      <el-row class="demo-toolbar">
        <el-button type="danger" round @click="unload">销毁</el-button>
        <el-button type="danger" round @click="load">加载</el-button>
        <el-button type="danger" round @click="reload">重载</el-button>
        <el-checkbox v-model="editable">可编辑</el-checkbox>
        <el-checkbox v-model="addTerrain">地形</el-checkbox>
        <el-checkbox v-model="clampToGround">贴地</el-checkbox>
      </el-row>
    </el-row>
    </template>
    
    <script>
      let viewer = undefined
      export default {
        data() {
          return {
            addTerrain: false,
            editable: false,
            clampToGround: false,
            mainFabOpts: {
              direction: 'right'
            },
            polylineDrawingOpts: {
              // loop: true,
              onClick(e) {
                console.log(e)
              }
            },
            rectangleDrawingOpts: {
              regular: false
            },
            pinDrawingOpts: {
              billboardOpts: {
                image: 'https://zouyaoji.top/vue-cesium/images/grepin.png',
                onClick(e) {
                  console.log(e)
                }
              },
              labelOpts: {
                text: '图标点',
                pixelOffset: [0, -60],
                onClick(e) {
                  console.log(e)
                }
              }
            },
            pointDrawingOpts: {
              preRenderDatas: [
                [108.96018, 34.21948, 50],
                [108.9602, 34.21895, 100]
              ],
              pointOpts: {
                color: 'red',
                onClick(e) {
                  console.log(e)
                }
              }
            },
            polygonDrawingOpts: {
              preRenderDatas: [
                [
                  [108.95808, 34.21955, 30],
                  [108.95948, 34.22039, 20],
                  [108.9595, 34.21914, 25]
                ],
                [
                  [108.955, 34.21857],
                  [108.95573, 34.21856],
                  [108.95573, 34.21761],
                  [108.95499, 34.21761]
                ]
              ]
            },
            regularDrawingOpts: {
              preRenderDatas: [
                [
                  [108.95474, 34.22204],
                  [108.95564, 34.22166]
                ]
              ],
              onClick(e) {
                console.log(e)
              }
            }
          }
        },
        methods: {
          drawingsReadyDefault({ Cesium, viewer, cesiumObject }) {
            console.log('绘制选项参数：', cesiumObject)
            window.vm = this
            window.viewer = viewer
          },
          clear() {
            this.$refs.drawingsCustomRef.clearAll()
          },
          toggle(drawingActionInstance) {
            this.$refs.drawingsCustomRef.toggleAction(drawingActionInstance.name)
          },
          onTilesetReady(tileset, viewer) {
            const cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center)
            const surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height)
            const offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 5)
            const translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3())
            tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
            viewer.zoomTo(tileset)
            viewer.scene.globe.depthTestAgainstTerrain = true
            this.restoreCursorMove = 'auto'
            this.drawing = false
          },
          drawEvt(e, viewer) {
            const restoreCursor = getComputedStyle(viewer.canvas).cursor
            if (e.finished) {
              if (e.type === 'move') {
                viewer.canvas.setAttribute('style', `cursor: ${this.restoreCursorMove}`)
              }
              this.drawing = false
            } else {
              this.drawing = true
              if (e.type === 'move') {
                viewer.canvas.setAttribute('style', 'cursor: move')
              }
              if (e.type === 'new') {
                viewer.canvas.setAttribute('style', 'cursor: crosshair')
              }
            }
          },
          activeEvt(e, viewer) {
            console.log(e)
            viewer.canvas.setAttribute('style', `cursor: ${e.isActive ? 'crosshair' : 'auto'}`)
            if (!e.isActive) {
              this.drawing = false
              this.restoreCursorMove = 'auto'
            }
          },
          editorEvt(e, viewer) {
            if (e.type === 'move') {
              viewer.canvas.setAttribute('style', 'cursor: move')
              this.drawing = true
            } else {
              viewer.canvas.setAttribute('style', 'cursor: auto')
            }
          },
          mouseEvt(e, viewer) {
            const restoreCursor = getComputedStyle(viewer.canvas).cursor
            if (!this.drawing) {
              console.log(e)
              if (e.type === 'onmouseover') {
                this.restoreCursorMove = restoreCursor
                viewer.canvas.setAttribute('style', 'cursor: pointer')
              } else {
                viewer.canvas.setAttribute('style', `cursor: ${this.restoreCursorMove || 'auto'}`)
              }
            }
          },
          clearEvt(e, viewer) {
            console.log(e)
          },
          unload() {
            this.$refs.drawingsRef.unload()
          },
          load() {
            this.$refs.drawingsRef.load()
          },
          reload() {
            this.$refs.drawingsRef.reload()
          },
          pickEvt(e) {
            console.log(e)
          }
        }
      }
    </script>
    
    <style>
    
    </style>
    