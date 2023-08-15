
function initCustomMaterial(Cesium, viewer) {
    let myBox = {}, colorMaterial = {}, imageMaterial = {}, compositeMaterial = {}, customMaterial = {};
    
    let boxLength = 50.0;
    let position = Cesium.Cartesian3.fromDegrees(106.029982, 36.888942, 0.5 * boxLength);
    let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
    // 0 立方体顶点位置标号，以及坐标系示意图
    // 立方体
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    // 坐标系
    //  z
    //  | /y
    //  |/
    //  o------x
    // 1 定义位置数组
    let v0 = [0.5, -0.5, 0.5];
    let v1 = [-0.5, -0.5, 0.5];
    let v2 = [-0.5, -0.5, -0.5];
    let v3 = [0.5, -0.5, -0.5];
    let v4 = [0.5, 0.5, -0.5];
    let v5 = [0.5, 0.5, 0.5];
    let v6 = [-0.5, 0.5, 0.5];
    let v7 = [-0.5, 0.5, -0.5];
    let rawVertex = [
        // 下 -z
        ...v2, ...v3, ...v4, ...v7,
        // 前 -y
        ...v2, ...v3, ...v0, ...v1,
        // 后 +y
        ...v4, ...v7, ...v6, ...v5,
        // 左 -x
        ...v7, ...v2, ...v1, ...v6,
        // 右 +x
        ...v3, ...v4, ...v5, ...v0,
        // 上 +z
        ...v1, ...v0, ...v5, ...v6,
    ];
    // 乘上box的长度
    let boxVertex = rawVertex.map(function (v) {
        return v * boxLength;
    });
    let positions = new Float64Array(boxVertex);
    // 2 定义法向数组
    let npx = [1, 0, 0];
    let nnx = [-1, 0, 0];
    let npy = [0, 1, 0];
    let nny = [0, -1, 0];
    let npz = [0, 0, 1];
    let nnz = [0, 0, -1];
    let normals = new Float32Array([
        // 下 -z
        ...nnz, ...nnz, ...nnz, ...nnz,
        // 前 -y
        ...nny, ...nny, ...nny, ...nny,
        // 后 +y
        ...npy, ...npy, ...npy, ...npy,
        // 左 -x
        ...nnx, ...nnx, ...nnx, ...nnx,
        // 右 +x
        ...npx, ...npx, ...npx, ...npx,
        // 上 +z
        ...npz, ...npz, ...npz, ...npz,
    ]);
    // 3 定义纹理数组
    let sts = new Float32Array([
        0, 0, 1, 0, 1, 1, 0, 1,
        0, 0, 1, 0, 1, 1, 0, 1,
        0, 0, 1, 0, 1, 1, 0, 1,
        0, 0, 1, 0, 1, 1, 0, 1,
        0, 0, 1, 0, 1, 1, 0, 1,
        0, 0, 1, 0, 1, 1, 0, 1,
    ]);
    // 4 定义索引
    let indices = new Uint16Array([
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23,
    ]);
    // 5 创建Primitive
    myBox = viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
            geometry: new Cesium.Geometry({
                attributes: {
                    position: new Cesium.GeometryAttribute({
                        componentDatatype: Cesium.ComponentDatatype.DOUBLE,
                        componentsPerAttribute: 3,
                        values: positions
                    }),
                    normal: new Cesium.GeometryAttribute({
                        componentDatatype: Cesium.ComponentDatatype.FLOAT,
                        componentsPerAttribute: 3,
                        values: normals
                    }),
                    st: new Cesium.GeometryAttribute({
                        componentDatatype: Cesium.ComponentDatatype.FLOAT,
                        componentsPerAttribute: 2,
                        values: sts
                    }),
                },
                indices: indices,
                primitiveType: Cesium.PrimitiveType.TRIANGLES,
                boundingSphere: Cesium.BoundingSphere.fromVertices(positions)
            }),
            // attributes : {
            //     color : Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 1.0, 0.0, 1.0))
            // }
        }),
        // appearance: new Cesium.PerInstanceColorAppearance({
        //     flat : true,
        //     translucent : false
        // }),
        appearance: new Cesium.MaterialAppearance({
            material: Cesium.Material.fromType('Image', {
                image: 'http://oss.datalent.top/test/168766.png'
            }),
            //faceForward : true // 当绘制的三角面片法向不能朝向视点时，自动翻转法向，从而避免法向计算后发黑等问题
            closed: true // 是否为封闭体，实际上执行的是是否进行背面裁剪
        }),
        modelMatrix: modelMatrix,
        asynchronous: false
    }));
    
    viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(position, 100));
    
    // 6 创建material
    // 6.1 创建纯色material
    colorMaterial = new Cesium.Material({
        fabric: {
            type: 'Color',
            uniforms: {
                color: new Cesium.Color(1.0, 1.0, 0.0, 1.0)
            },
            components: {
                diffuse: 'color.bgr',
                alpha: 'color.a'
            }
        },
        translucent: false
    });
    // 6.2 创建图像material
    imageMaterial = new Cesium.Material({
        fabric: {
            type: 'Image',
            uniforms: {
                image: 'http://oss.datalent.top/test/168766.png',
                repeat: new Cesium.Cartesian2(1.0, 1.0),
                color: new Cesium.Color(1.0, 1.0, 1.0, 1.0)
            },
            components: {
                diffuse: 'texture2D(image, fract(repeat * materialInput.st)).rgb * color.rgb',
                alpha: 'texture2D(image, fract(repeat * materialInput.st)).a * color.a'
            }
        },
        translucent: false
    });
    // 6.3 创建组合material
    // Material创建几个material来组合使用，以下其写法
    compositeMaterial = new Cesium.Material({
        fabric: {
            type: 'OurMappedPlastic',
            materials: {
                diffuseMaterial: {
                    type: 'DiffuseMap',
                    uniforms: {
                        image: 'http://oss.datalent.top/test/168766.png'
                    }
                },
                alphaMap: {
                    type: 'AlphaMap',
                    uniforms: {
                        image: 'http://oss.datalent.top/test/166670.png',
                        channel: 'r'
                    }
                }
            },
            components: {
                diffuse: 'diffuseMaterial.diffuse',
                // specular: 'specularMaterial.specular',
                // alpha: 'diffuseMaterial.diffuse.g',
                alpha: 'alphaMap.alpha * 3.0',
            },
        },
        translucent: function (material) {
            // return material.uniforms.color.alpha < 1.0;
            return false;
        }
    });
    // 6.4 创建自定义shader的material
    // 模拟纯色到图像的过渡过程
    customMaterial = new Cesium.Material({
        fabric: {
            type: 'MyCustomShader1',
            uniforms: {
                image: 'http://oss.datalent.top/test/168766.png',
                color: new Cesium.Color(1.0, 1.0, 0.0, 1.0),
                cellAlpha: 0.3
            },
            source: `
                            uniform vec4 color;
                            uniform float cellAlpha;
                            czm_material czm_getMaterial(czm_materialInput materialInput)
                            {
                                czm_material material = czm_getDefaultMaterial(materialInput);
                                vec2 st = materialInput.st;
                                float aa = st.s * st.t;
                                vec3 halfColor = color.rgb * aa + texture2D(image, materialInput.st).rgb * (1.0 - aa);
                                halfColor *= 0.5;
                                material.diffuse = halfColor;
                                material.emission = halfColor;
                                // material.alpha = color.a * aa;
                                material.alpha = 1.0;
                                return material;
                            }
                        `
        },
        translucent: false
    });
    
    // 使用纯色材质
    // myBox.appearance.material = colorMaterial;
    // 使用图像材质
    // myBox.appearance.material = imageMaterial;
    // 使用组合材质
    // myBox.appearance.material = compositeMaterial;
    // 自定义Shader材质
    // myBox.appearance.material = customMaterial;
    
}

export { initCustomMaterial }