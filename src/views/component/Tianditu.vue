<!--
 * @Description: 天地图
 * @Author: 吕景文
 * @Date: 2023-05-24 13:45:18
-->
<template>
    <vc-layer-imagery :sort-order="20">
        <vc-imagery-provider-tianditu map-style="cva_c"
            token="436ce7e50d27eede2f2929307e6b33c0"></vc-imagery-provider-tianditu>
    </vc-layer-imagery>
    <vc-layer-imagery :sort-order="10">
        <vc-imagery-provider-tianditu map-style="img_c"
            token="436ce7e50d27eede2f2929307e6b33c0"></vc-imagery-provider-tianditu>
    </vc-layer-imagery>
    <vc-layer-imagery ref="layerText">
        <vc-imagery-provider-tianditu map-style="cia_c"
            token="436ce7e50d27eede2f2929307e6b33c0"></vc-imagery-provider-tianditu>
    </vc-layer-imagery>
</template>

<script>
export default {
    name: 'Tianditu',
}
</script>
<style scoped></style>
