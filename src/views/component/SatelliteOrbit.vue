<!--
 * @Description: 卫星轨道
 * @Author: 吕景文
 * @Date: 2023-05-24 13:45:18
-->
<template>
	<vc-datasource-czml ref="datasourceRef" czml="../../SampleData/czml/simple.czml" @ready="onDatasourceReady" :show="show"
		@click="onClicked"></vc-datasource-czml>
	<!-- <vc-datasource-czml :czml="czml"></vc-datasource-czml> -->
</template>

<script>
import { ref } from 'vue'
export default {
	name: 'DtCzml',
	setup() {
		const show = ref(true)
		const datasourceRef = ref(null)

		const onClicked = e => {
			console.log(e)
		}
		const onDatasourceReady = ({ Cesium, viewer, cesiumObject }) => {
			// viewer.zoomTo(cesiumObject)
			// viewer.camera.flyHome(0)
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

		return {
			czml,
			show,
			onClicked,
			onDatasourceReady,
			datasourceRef,
		}
	}
}
</script>
<style scoped></style>
