export function initFayLine(Cesium, viewer) {
    const twoPoints = [114.3698, 22.6139, 114.2135, 22.6127];
    const twoPoints1 = [114.3698, 22.6139, 114.333210, 22.508452];
    const twoPoints2 = [114.3698, 22.6139, 114.521609, 22.669505];
    const position = new Cesium.Cartesian3.fromDegrees(114.3698, 22.6139, 100)
    // animatedParabola(Cesium, viewer, twoPoints);
    parabola(Cesium, viewer, twoPoints);
    parabola(Cesium, viewer, twoPoints1);
    parabola(Cesium, viewer, twoPoints2);
    viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(position, 100));
}

// 两点之间抛物线绘制函数，twoPoints是一个数组：[lon1,lat1,lon2,lat2]
function animatedParabola( Cesium, viewer, twoPoints) {  // 动态抛物线绘制
    const startPoint = [twoPoints[0],twoPoints[1],0]; // 起点的经度、纬度
    const step = 80;  // 自定义线段的数量，越多则越平滑
    const heightProportion = 0.325; // 自定义最高点和总距离的比值(即图中H比上AB的值)，值越大则抛物线越弯曲
    const dLon = (twoPoints[2] - startPoint[0]) / step;  // 经度差值
    const dLat = (twoPoints[3] - startPoint[1]) / step;  // 纬度差值
    const deltaLon = dLon * Math.abs(111000*Math.cos(twoPoints[1]));  // 经度差(米级)
    const deltaLat = dLat * 111000;  // 纬度差(米),1纬度相差约111000米
    const endPoint = [0,0,0];  // 定义一个端点(后面将进行startPoint和endPoint两点画线)
    const heigh = Math.floor(step * Math.sqrt(deltaLon*deltaLon+deltaLat*deltaLat) * heightProportion);
    const x2 = 10000*Math.sqrt(dLon*dLon+dLat*dLat); // 小数点扩大10000倍，提高精确度
    const a = heigh / (x2*x2);  // 抛物线函数中的a
    function y(x, height) {  // 模拟抛物线函数，求高度H
        // 此处模拟的函数为y = H - a*x^2 (H为高度常数)，取整后返回
        return Math.floor(height - a*x*x);
    }
    for(let i = 1;i <= step; i++){  // 逐“帧”画线
        endPoint[0] = startPoint[0] + dLon; // 更新end点纬度
        endPoint[1] = startPoint[1] + dLat; // 更新end点纬度
        const x = x2*(2*i/step-1);  // 求抛物线函数x
        endPoint[2] = y(x,heigh);  // 求end点高度
        viewer.clock.currentTime = Cesium.JulianDate.now(); // 将时钟指针移到当前时间
        // 这里的viewer是容器初始化时new Cesium.Viewer构造的: var viewer = new Cesium.Viewer('mapContainer', {...});
        const IsoTime = Cesium.JulianDate.now(); // 获取当前时间
        viewer.entities.add({  // 添加动态线
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(startPoint.concat(endPoint)),
                width: 4,
                material: new Cesium.PolylineOutlineMaterialProperty({
                    color: Cesium.Color.GOLD,
                    outlineWidth: 0.3,
                })
            },
            availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({ // 设置显示的时间区间
                start: {
                    dayNumber: IsoTime.dayNumber,
                    secondsOfDay: IsoTime.secondsOfDay+((i-1)*300),
                },
                stop: {
                    dayNumber: IsoTime.dayNumber,
                    secondsOfDay: IsoTime.secondsOfDay+(i*300),
                },
            })]),
        });
        viewer.entities.add({  // 添加静态线
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(startPoint.concat(endPoint)),
                width: 4,
                material: new Cesium.PolylineGlowMaterialProperty({
                    color: Cesium.Color.AQUA.withAlpha(0.9),
                    outlineWidth: 0.3,
                    glowPower : 0.3,
                })
            },
        });
        // end点变为start点
        startPoint[0] = endPoint[0];
        startPoint[1] = endPoint[1];
        startPoint[2] = endPoint[2];
    }
    viewer.clock.shouldAnimate = true;  // 启动时钟开始转动
    viewer.clock.multiplier = 1600;  // 设置时钟转动速度
}

function parabola(Cesium, viewer, twoPoints) {  // 抛物线绘制
    const startPoint = [twoPoints[0],twoPoints[1],0]; // 起点的经度、纬度
    const step = 80;  // 自定义线段的数量，越多则越平滑(但过多浏览器缓存也会占用越多)
    const heightProportion = 0.325; // 最高点和总距离的比值
    const dLon = (twoPoints[2] - startPoint[0])/step;  // 经度差值
    const dLat = (twoPoints[3] - startPoint[1])/step;  // 纬度差值
    const deltaLon = dLon * Math.abs(111000*Math.cos(twoPoints[1]));  // 经度差(米级)
    const deltaLat = dLat * 111000;  // 纬度差(米),1纬度相差约111000米
    const endPoint = [0,0,0];  // 定义一个端点（后面将进行startPoint和endPoint两点画线）
    const heigh = Math.floor(step * Math.sqrt(deltaLon*deltaLon+deltaLat*deltaLat) * heightProportion);
    const x2 = (1000000*Math.sqrt(dLon*dLon+dLat*dLat)); // 小数点扩大10000倍，提高精确度
    const a = (heigh/(x2*x2));
    function y(x, height) { return Math.floor(height - a*x*x); }
    for(let i = 1;i <= step; i++){  // 逐“帧”画线
        endPoint[0] = startPoint[0] + dLon; // 更新end点经度
        endPoint[1] = startPoint[1] + dLat; // 更新end点纬度
        const x = x2*(2*i/step-1);  // 求抛物线函数x
        endPoint[2] = y(x,heigh);  // 求end点高度
        viewer.entities.add({  // 添加静态线
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(startPoint.concat(endPoint)),
                width: 4,
                arcType: Cesium.ArcType.NONE,
                material: new Cesium.PolylineArrowMaterialProperty(
                    Cesium.Color.AQUA
                ),
                // material: new Cesium.PolylineGlowMaterialProperty({
                //     color: Cesium.Color.AQUA,
                //     outlineWidth: 0,
                //     glowPower : 0.1,
                // })
            },
        });
        // end点变为start点
        startPoint[0] = endPoint[0];
        startPoint[1] = endPoint[1];
        startPoint[2] = endPoint[2];
    }
}


export default {
    initFayLine
}