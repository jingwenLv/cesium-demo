#### cesium简介 1.0

1.什么是Cesium？
Cesium是AGI公司计算机图形开发小组与2011年研发的三维地球和地图可视化开源JavaScript库，Cesium一词来源于化学元素铯，铯是制造原子钟的关键元素，研发小组通过命名强调Cesium产品精益求精，专注时间数据可视化。Cesium为三维GIS提供了一个高效的数据可视化平台。即：
（1）Cesium是一个跨平台、跨浏览器的展示三维地球和地图的JavaScript库
（2）Cesium使用WebGL来进行硬件加速图形，使用时不需要任何插件支持。
（3）Cesium是基于Apache2.0许可的开源程序，可以免费用于商业和非商业用途。

2.Cesium能做什么？

Cesium的知识体系，跨GIS、Web前端和图形学。
Cesium用于地理数据可视化。支持海量数据的高效渲染，支持时间序列动态数据的三维可视化，具备太阳、大气、云雾等地理环境要素的动态模拟和地形等要素的加载绘制。包含丰富的可用工具。即Cesium基本控件所提供的工具，如地理编码器，图层选择器等。
Cesium在项目中的定位如下图：

主要的功能有：
（1）使用3d tiles格式流式加载各种不同的3d数据，包含倾斜摄影模型、三维建筑物、CAD和BIM的外部和内部，点云数据。并支持样式配置和用户交互操作。
（2）全球高精度地形数据可视化，支持地形夸张效果、以及可编程实现的等高线和坡度分析效果。
（3）支持多种资源的图像图层，包括WMS，TMS，WMTS以及时序图像。图像支持透明度叠加、亮度、对比度、GAMMA、色调、饱和度都可以动态调整。支持图像的卷帘对比。
（4）支持标准的矢量格式KML、GeoJSON、TopoJSON、以及矢量的贴地效果。
（5）三维模型支持gltf2.0标准的PRB材质、动画、蒙皮和变形效果。贴地以及高亮效果。
（6）使用CZML支持动态时序数据的展示。
（7）支持各种几何体：点、线、面、标注、公告牌、立方体、球体、椭圆体、圆柱体、走廊、管径、墙体。
（8）可视化效果包括：基于太阳位置的阴影、自身阴影、柔和阴影。
（9）支持大气、雾、太阳、阳光、月亮、星星、水面。
（10）粒子特效：烟、火、火花。
（11）地形、模型、3d tiles模型的面裁剪。
（12）对象点选和地形点选。
（13）支持鼠标和触摸操作的缩放、渲染、惯性平移、飞行、任意视角、地形碰撞检测。
（14）支持3d地球、2d地图、2.5d哥伦布模式。3d视图可以使用透视和正视两种投影方式。
支持点、标注、公告牌的聚集效果。

3.Cesium的依赖性
①基于HTML5标准，无插件，跨平台
②无法独立运行，依赖于浏览器
③浏览器基于HTTP协议，Cesium正确运行必须有HTTP Server
④HTTP Server的实现不限于开发语言和服务器（可不学nodejs）

&#x20;原文链接：<https://blog.csdn.net/weixin_45782925/article/details/122687181>

cesium 常用单词

```javascript
entities // 实体
material // 材料
hierarchy // 层次结构
coordinates // 坐标
shape // 形狀
rotation // 旋转
degrees // 度
stripe // 条纹
volume // 体积
holes // 洞
polyline // 多段线
rectangle  // 矩形
polygon // 多边形
ellipse // 椭圆
ellipsoid // 椭球体
cylinder // 圆柱体
wall // 墙
corridor // 走廊

geometry // 几何
Instances // 实例
fabric // 结构
source // 源
translucent // 半透明的
```

## 1：数据模型

#### [cesium](https://so.csdn.net/so/search?q=cesium\&spm=1001.2101.3001.7020)-支持的数据格式

Cesium作为一个开源三维可视化JavaScript库，可以用来显示海量三维模型数据、影像数据、地形高程数据、空间要素、图片、视频等数据。

## 支持的主要数据格式与服务

影像服务

```markdown
| 数据格式/数据源	|   API
| ------------  | -----------
| WMS	   |   WebMapServiceImageryProvider
| TMS	   |   createTileMapServiceImageryProvider
| WMTS	    |   WebMapTileServiceImageryProvider
| ArcGIS	|   ArcGISMapServiceImageryProvider
| Bing Maps |	BingMapsImageryProvider
| Google Earth   |   	GoogleEarthEnterpriseMapsProvider
| Mapbox	|   MapboxImageryProvider
| OpenStreetMap	|   createOpenStreetMapImageryProvider
| 单张图片	|   SingleTileImageryProvider
| 瓦片地图	|   UrlTemplateImageryProvider
```

### 地形服务

```markdown
| 数据格式/数据源 |	API
| Cesium Terrain	|  CesiumTerrainProvider
| Google Earth Enterprise	|  GoogleEarthEnterpriseTerrainProvider
| VT MAK VR-TheWorld	|  VRTheWorldTerrainProvider
```

### 矢量数据

```markdown
| 数据格式/数据源	| API
| GeoJSON	| GeoJsonDataSource
| TopoJSON	| GeoJsonDataSource
| KML	| KmlDataSource
```

### 空间数据

```markdown
三维模型
| 数据格式/数据源 | 	API
| glTF/glb	|   ---
| 3D Tiles	| Cesium3D Tileset

CZML
| 数据格式/数据源  |   API
| CZML |   CzmlDataSource
```

## 2：实体entity

>  **Primitive接近底层，适合图形开发人员；而Entity是数据的抽象**
>
> ```javascript
> // 清除单个实体
> var entity = viewer.entities.getById('entityId'); // 根据实体ID获取实体对象
> viewer.entities.remove(entity); // 移除指定的实体对象
>
> // 清除单个模型
> var model = viewer.scene.primitives.getById('modelId'); // 根据模型ID获取模型对象
> viewer.scene.primitives.remove(model); // 移除指定的模型对象
>
> // 清除所有实体
> viewer.entities.removeAll(); // 移除所有实体对象
>
> // 清除所有模型
> viewer.scene.primitives.removeAll(); // 移除所有模型对象
> ```

## 3：图像imagery

## 4：地形Terrain

## 5：相机Camera

#### Cesium 飞入相关方法

##### 1. Camera的flyHome方法

&#x20;  默认位置 [Cesium](https://so.csdn.net/so/search?q=Cesium\&spm=1001.2101.3001.7020).Camera.DEFAULT\_VIEW\_RECTANGLE\
&#x20;  矩形框即视角范围	&#x9;

| Name       | Type   | Description                                                                                                                             |
| :--------- | :----- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| `duration` | Number | 可选飞行持续时间（以秒为单位）。如果省略，Cesium会尝试根据航班要行驶的距离来计算理想持续时间。请参见 [`Camera＃flyTo`](http://cesium.xin/cesium/cn/Documentation1.72/Camera.html#flyTo) |

```javascript
// 默认矩形框设置为亚洲
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(51.096847,9.98438,150.589429,70.671623);
// 将相机飞到主视图。使用 Camera＃.DEFAULT_VIEW_RECTANGLE 进行设置3D场景的默认视图。二维和哥伦布视图的主视图显示了整个地图。
let duration = 2;
viewer.camera.flyHome(duration)

```

#### 2. Camera的flyTo方法

flyTo (options)\
将相机从当前位置移动到新位置。

```javascript
// 1. Fly to a position with a top-down view
viewer.camera.flyTo({
    destination : Cesium.Cartesian3.fromDegrees(-117.16, 32.71, 15000.0)
});

// 2. Fly to a Rectangle with a top-down view
viewer.camera.flyTo({
    destination : Cesium.Rectangle.fromDegrees(west, south, east, north)
});

// 3. Fly to a position with an orientation using unit vectors.
viewer.camera.flyTo({
    destination : Cesium.Cartesian3.fromDegrees(-122.19, 46.25, 5000.0),
    orientation : {
        direction : new Cesium.Cartesian3(-0.04231243104240401, -0.20123236049443421, -0.97862924300734),
        up : new Cesium.Cartesian3(-0.47934589305293746, -0.8553216253114552, 0.1966022179118339)
    }
});

// 4. Fly to a position with an orientation using heading, pitch and roll.
viewer.camera.flyTo({
    destination : Cesium.Cartesian3.fromDegrees(-122.19, 46.25, 5000.0),
    orientation : {
        heading : Cesium.Math.toRadians(175.0),
        pitch : Cesium.Math.toRadians(-35.0),
        roll : 0.0
    }
});

```

#### 3. Camera的flyToBoundingSphere方法

flyToBoundingSphere (boundingSphere, options ) 将相机移到当前视图包含所提供的包围球的位置。 偏移是在以边界球的中心为中心的局部东-北-上参考系中的航向/俯仰/范围。航向角和俯仰角是在局部的东西向北参考系中定义的。航向是从y轴到x轴的角度。间距是从xy平面开始的旋转。正螺距角度在平面下方。负俯仰角在平面上方。范围是到中心的距离。如果范围是零，则将计算范围以使整个边界球都可见。 在2D和Columbus视图中，必须有一个俯视图。摄像机将被放置在目标上方并向下看。上方的高度目标将是范围。标题将与当地北部对齐。

```javascript
var boundingSphere = new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(116.4, 39.9, 100), 15000);
 
// Override behavior of home button
viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function(commandInfo) {
    // Fly to custom position
    viewer.camera.flyToBoundingSphere(boundingSphere);

    // Tell the home button not to do anything
    commandInfo.cancel = true;
});

// Set custom initial position
viewer.camera.flyToBoundingSphere(boundingSphere, {duration: 0});

```

#### 4. Viewer 的 zoomTo方法

```javascript
var viewer = new Cesium.Viewer('cesiumContainer');
var layerRectangle = Cesium.Rectangle.fromDegrees(15.2, 10.9, 15.3, 11.0);
var layer = new Cesium.ImageryLayer(new Cesium.ArcGisMapServerImageryProvider({
    url : 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
}), {
    rectangle : layerRectangle
});
viewer.zoomTo(layer);
//viewer.flyTo(layer);

```

## 6：几何与样式

样式

cesium颜色设置

```javascript
Cesium.Color(0, 0, 0, 0.4)

// 将red转换为rgba色透明度为0.9
Cesium.Color.RED.withAlpha(0.9)
```

## MaterialProperty类

MaterialProperty类专为**Entity**而生，它是一个抽象类，我们无法对它进行实例化。要使用该类对材质进行设置，需要实例化其子类。MaterialProperty类的继承类，如下图所示：

**ColorMaterialProperty 颜色材质**

```javascript
var color = Cesium.Color.BLUE.withAlpha(0.5);
    var colorMaterial = new Cesium.ColorMaterialProperty(color);
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(-55.0, 40.0, 100000.0),
      ellipse: {
        semiMajorAxis: 300000.0, // 长半轴距离
        semiMinorAxis: 200000.0, // 短半轴距离
        height: 20000.0,
        material: colorMaterial,
      },
    });
```

**ImageMaterialProperty 贴图材质**

```javascript
var imgUrl = "./images/bumpmap.png";
    var imgMaterial = new Cesium.ImageMaterialProperty({
      image: imgUrl,
      repeat: new Cesium.Cartesian2(4, 4),
      color: Cesium.Color.BLUE,
    });
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(-65.0, 40.0, 100000.0),
      ellipse: {
        semiMajorAxis: 300000.0, // 长半轴距离
        semiMinorAxis: 200000.0, // 短半轴距离
        height: 20000.0,
        material: imgMaterial,
      },
    });
```

**CheckerboardMaterialProperty 棋盘纹理**

```javascript
var checkerboardMaterial = new Cesium.CheckerboardMaterialProperty({
      evenColor: Cesium.Color.WHITE,
      oddColor: Cesium.Color.BLACK,
      repeat: new Cesium.Cartesian2(4, 4),
    });
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(-75.0, 40.0, 100000.0),
      ellipse: {
        semiMajorAxis: 300000.0, // 长半轴距离
        semiMinorAxis: 200000.0, // 短半轴距离
        height: 20000.0,
        material: checkerboardMaterial,
      },
    });
```

**StripeMaterialProperty 条纹纹理**

```javascript
var stripeMaterial = new Cesium.StripeMaterialProperty({
      orientation: Cesium.StripeOrientation.VERTICAL,
      evenColor: Cesium.Color.WHITE,
      oddColor: Cesium.Color.BLACK,
      repeat: 16,
    });
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(-85.0, 40.0, 100000.0),
      ellipse: {
        semiMajorAxis: 300000.0, // 长半轴距离
        semiMinorAxis: 200000.0, // 短半轴距离
        height: 20000.0,
        material: stripeMaterial,
      },
    });
```

**GridMaterialProperty 网格**

```javascript
 var gripMaterial = new Cesium.GridMaterialProperty({
      color: Cesium.Color.YELLOW,
      cellAlpha: 0.5,
      lineCount: new Cesium.Cartesian2(8, 8),
      lineThickness: new Cesium.Cartesian2(2.0, 2.0),
      lineOffset: new Cesium.Cartesian2(0.0, 0.0),
    });
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(-95.0, 40.0, 100000.0),
      ellipse: {
        semiMajorAxis: 300000.0, // 长半轴距离
        semiMinorAxis: 200000.0, // 短半轴距离
        height: 20000.0,
        material: gripMaterial,
      },
    });
```

**PolylineGlowMaterialProperty 发光材质**

```javascript
var glowingLine = viewer.entities.add({
      name: "Glowing blue line on the surface",
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray([-75, 37, -125, 37]),
        width: 10,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.8,
          taperPower: 0.5,
          color: Cesium.Color.CORNFLOWERBLUE,
        }),
      },
    });
```

**PolylineOutlineMaterialProperty 外轮廓材质**

```javascript
var orangeOutlined = viewer.entities.add({
      name:
        "Orange line with black outline at height and following the surface",
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
          -75,
          39,
          250000,
          -125,
          39,
          250000,
        ]),
        width: 5,
        material: new Cesium.PolylineOutlineMaterialProperty({
          color: Cesium.Color.ORANGE,
          outlineWidth: 5,
          outlineColor: Cesium.Color.BLACK,
        }),
      },
    });
```

**PolylineArrowMaterialProperty 带有箭头的线**

```javascript
var purpleArrow = viewer.entities.add({
      name: "Purple straight arrow at height",
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
          -75,
          43,
          500000,
          -125,
          43,
          500000,
        ]),
        width: 10,
        arcType: Cesium.ArcType.NONE,
        material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.PURPLE),
      },
    });
```

**PolylineDashMaterialProperty 虚线**

```javascript
var dashedLine = viewer.entities.add({
      name: "Blue dashed line",
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
          -75,
          45,
          500000,
          -125,
          45,
          500000,
        ]),
        width: 4,
        material: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.CYAN,
        }),
      },
    });
```

## 7：粒子系统
