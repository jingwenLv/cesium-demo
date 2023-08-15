var fsBody = `
            // 可以修改的参数
            // 注意shader中写浮点数是，一定要带小数点，否则会报错，比如0需要写成0.0，1要写成1.0
            float _baseHeight = 0.0; // 物体的基础高度，需要修改成一个合适的建筑基础高度
            float _heightRange = 60.0; // 高亮的范围(_baseHeight ~ _baseHeight + _heightRange) 默认是 0-60米
            float _glowRange = 300.0; // 光环的移动范围(高度)

            // 建筑基础色
            float vtxf_height = v_elevationPos.z - _baseHeight;
            float vtxf_a11 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
            float vtxf_a12 = vtxf_height / _heightRange + sin(vtxf_a11) * 0.1;
            gl_FragColor *= vec4(vtxf_a12, vtxf_a12, vtxf_a12, 1.0);

            // 动态光环
            float vtxf_a13 = fract(czm_frameNumber / 360.0);
            float vtxf_h = clamp(vtxf_height / _glowRange, 0.0, 1.0);
            vtxf_a13 = abs(vtxf_a13 - 0.5) * 2.0;
            float vtxf_diff = step(0.005, abs(vtxf_h - vtxf_a13));
            gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - vtxf_diff);
            `;

function startup(earth) {
    earth.weather.atmosphere.enabled = false;
    const bloom = earth.postProcess.bloom;
    bloom.enabled = true;
    bloom.glowOnly = false;
    bloom.contrast = 119;
    bloom.brightness = -0.4;
    bloom.delta = 0.9;
    bloom.sigma = 3.78;
    bloom.stepSize = 5;
    bloom.isSelected = false;

    earth.sceneTree.root = {
        "children": [
            {
                "czmObject": {
                    "xbsjType": "Imagery",
                    "xbsjGuid": "0a74da9f-bff6-4eab-af64-d8cf95978145",
                    "name": "谷歌影像",
                    "brightness": 0.2,
                    "rectangle": null,
                    "xbsjImageryProvider": {
                        "XbsjImageryProvider": {
                            "url": "//server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                            "maximumLevel": 14,
                        }
                    }
                }
            },
            {
                "ref": "tileset",
                "czmObject": {
                    "xbsjType": "Tileset",
                    "xbsjGuid": "094b1984-4aae-4ac3-bb35-86d84e6a8204",
                    "name": "白模测试2",
                    "url": "https://lab.earthsdk.com/model/702aa950d03c11e99f7ddd77cbe22fea/tileset.json",
                    "xbsjStyle": "var style = {\n    color: \"vec4(0, 0.5, 1.0,1)\"\n}",
                    "xbsjClippingPlanes": {},
                    "xbsjCustomShader": {
                        "fsBody": fsBody,
                    }
                }
            },
            {
                "ref": "scaneline",
                "czmObject": {
                    "xbsjType": "Scanline",
                    "xbsjGuid": "c827bdc1-c14b-4452-81de-7b2ce427b786",
                    "name": "扫描线",
                    "position": [2.1201528021066163, 0.5451706303633767, 0],
                    "show": true,
                    "radius": 1000,
                    "timeDuration": "3",
                    "currentTime": 0,
                    "color": [0.5, 0.8, 1.0, 1.0],
                }
            }
        ]
    };

    var tileset = earth.sceneTree.$refs.tileset.czmObject;
    var scaneline = earth.sceneTree.$refs.scaneline.czmObject;
    window.tileset = tileset;
    window.scaneline = scaneline;

    scaneline.playing = true;

    var c = createCircle(earth);
    var b = createBillboard(earth);
    var cl = createCylinder(earth);
    var cl2 = createCylinder2(earth);
    var gc = createGroundCircle(earth);
    var t = createTetrahedron(earth);
    // var bp = createBasePoint(earth, [2.1208228652896737,0.545141073908163,1.4957427559874568], [1, 1, 0, 2]);

    [
        [[2.1202907282192385, 0.5450835546419367, 1.5], [0.5, 0.8, 1, 2], [50, 50, 1]],
        [[2.120125294340532, 0.5453135338319917, 1.5], [1, 1, 0, 2], [60, 60, 1.2]],
        [[2.120593634919066, 0.5455039098638930, 1.5], [0.4, 0.9, 1, 2], [40, 40, 0.8]],
        [[2.120633904525988, 0.54481413672139860, 1.5], [0.3, 1, 1, 2], [50, 50, 1.5]],
        [[2.1208228652896737, 0.545141073908163, 1.5], [1, 1, 0, 2], [50, 50, 1.0]],
        [[2.120461948038486, 0.5451830324218808, 1.5], [0.5, 0.8, 1, 2], [50, 50, 1]],
        [[2.1204975918398317, 0.5452978537884561, 1.5], [0.5, 0.8, 1, 2], [50, 50, 1]],
        [[2.1207024221200843, 0.5453525660588958, 1.5], [0.5, 0.8, 1, 2], [50, 50, 1]],
        [[2.1207404597752664, 0.5451854942212021, 1.5], [0.5, 0.8, 1, 2], [50, 50, 1]],
    ].forEach(([p, c, s]) => {
        createBasePoint(earth, p, c, s);
    });

    createODLines(earth);
    createODLines2(earth);
    createODLines3(earth);

    window.c = c;
    window.b = b;
    window.cl = cl;
    window.cl2 = cl2;
    window.gc = gc;
    window.t = t;

    // window.l = createLabel(earth);
    window.l = createLabel2(earth);

    // earth.camera.position = [2.1210391698749964, 0.544944336488856, 822.8789229124824];
    // earth.camera.rotation = [5.190679265289419, -0.41493986255762305, 6.280299562599916];
    // 环绕飞行
    earth.camera.flyAround([2.1206125026580582, 0.545178729438238, 15], 3000, [0, -Math.PI / 5, 0], 0, 3.14 / 50);
}

function createCircle(earth) {
    const evalString = `
                Cesium.Resource.createIfNeeded('./images/ht/circular_03.png').fetchImage().then(function(image) {
                    console.log('image loaded!');
                    p.canvasWidth = 512;
                    p.canvasHeight = 512;

                    p.drawCanvas(ctx => {
                        ctx.clearRect(0, 0, 512, 512);

                        ctx.beginPath();
                        ctx.strokeStyle = "rgb(128, 128, 128)";
                        // ctx.setLineDash([8, 8]);
                        ctx.lineWidth = 1;
                        ctx.arc(256, 256, 250, 0, Math.PI*2, true);
                        ctx.stroke();

                        ctx.drawImage(image, 0, 0);
                    });

                    p.color = [0.5, 0.8, 1, 2];
                });
            `;

    const preUpdateEvalString = `
                if (typeof p.xxxAngle === 'undefined') p.xxxAngle = 360.0;
                p.xxxAngle -= 1.0;
                if (p.xxxAngle < 0) {
                    p.xxxAngle = 360.0;
                }
                p.rotation[0] = p.xxxAngle / 180.0 * Math.PI;
            `;

    // p.positions = XE.Obj.CustomPrimitive.Geometry.unitSquare.positions;
    // p.sts = XE.Obj.CustomPrimitive.Geometry.unitSquare.sts;
    // p.indices = XE.Obj.CustomPrimitive.Geometry.unitSquare.indices;

    const config = {
        // xbsjType: "CustomPrimitive",
        evalString,
        preUpdateEvalString,
        position: [2.1206125026580582, 0.545178729438238, 14.721614698023599],
        scale: [500, 500, 1],
        positions: [-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0],
        sts: [0, 0, 1, 0, 1, 1, 0, 1],
        indices: [0, 1, 2, 0, 2, 3],
        renderState: XE.Obj.CustomPrimitive.getRenderState(true, true),
        color: [0.5, 0.8, 1, 2],
        canvasWidth: 512,
        canvasHeight: 512,
    }

    var p = new XE.Obj.CustomPrimitive(earth);
    p.xbsjFromJSON(config);

    return p;
}

function createBillboard(earth) {
    const evalString = `
                Cesium.Resource.createIfNeeded('./images/city/billboard.png').fetchImage().then(function(image) {
                    console.log('image loaded!');
                    p.drawCanvas(ctx => {
                        ctx.clearRect(0, 0, 512, 256);
                        ctx.drawImage(image, 0, 0);
                    });
                });
            `;

    // p.positions = XE.Obj.CustomPrimitive.Geometry.unitBillboard.positions;
    // p.sts = XE.Obj.CustomPrimitive.Geometry.unitBillboard.sts;
    // p.indices = XE.Obj.CustomPrimitive.Geometry.unitBillboard.indices;

    const config = {
        evalString,
        position: [2.1206401172802556, 0.5451803047331054, 302.99853825804723],
        scale: [1, 100, 50],
        positions: [0, -1, 0, 0, 1, 0, 0, 1, 2, 0, -1, 2],
        sts: [0, 0, 1, 0, 1, 1, 0, 1],
        indices: [0, 1, 2, 0, 2, 3],
        renderState: XE.Obj.CustomPrimitive.getRenderState(true, false),
        color: [0.5, 0.8, 1, 2],
        canvasWidth: 512,
        canvasHeight: 256,
    };

    var p = new XE.Obj.CustomPrimitive(earth);
    p.xbsjFromJSON(config);

    return p;
}

function createTetrahedron(earth) {
    const preUpdateEvalString = `
                if (typeof p.dAngle === 'undefined') p.dAngle = 0.0;
                p.dAngle += 10.0;
                if (p.dAngle > 360.0) {
                    p.dAngle = 0.0;
                }
                p.rotation[0] = p.dAngle / 180.0 * Math.PI;

                if (typeof p.dt === 'undefined') p.dt = 0.0;
                p.dt += 0.01;
                if (p.dt > 1.0) p.dt = 0.0;
                p.position[2] = 400 + 10 * Math.sin(p.dt*Math.PI*2.0);
            `;

    const baseConfig = {
        preUpdateEvalString,
        position: [2.120597930315031, 0.5451624300822016, 400],
        scale: [15, 15, 15],
        positions: [1, 0, 1.5, 0, 1, 1.5, -1, 0, 1.5, 0, -1, 1.5, 0, 0, 0],
        indices: [0, 1, 1, 2, 2, 3, 3, 0, 0, 4, 1, 4, 2, 4, 3, 4],
        renderState: XE.Obj.CustomPrimitive.getRenderState(true, true),
    };

    const config1 = Object.assign({}, baseConfig, {
        indices: [0, 1, 4, 1, 2, 4, 2, 3, 4, 3, 0, 4],
        color: [0.5, 0.8, 1, 0.5],
    });

    const config2 = Object.assign({}, baseConfig, {
        indices: [0, 1, 1, 2, 2, 3, 3, 0, 0, 4, 1, 4, 2, 4, 3, 4],
        primitiveType: Cesium.PrimitiveType.LINES,
        color: [1.0, 1.0, 0.0, 5],
    });

    var p = new XE.Obj.CustomPrimitive(earth);
    p.xbsjFromJSON(config1);

    var p2 = new XE.Obj.CustomPrimitive(earth);
    p2.xbsjFromJSON(config2);

    return p;
}

function createBasePoint(earth, position, color = [0.5, 0.8, 1, 2], scale = [50, 50, 1]) {
    // const position = [2.1208228652896737,0.545141073908163,1.4957427559874568];
    // const color = [0.5, 0.8, 1, 2];
    // const scale = [50, 50, 1];

    // 底面
    {
        const evalString = `
                    p.canvasWidth = 512;
                    p.canvasHeight = 512;
                    p.drawCanvas(ctx => {
                        var gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
                        gradient.addColorStop(0.1, "rgba(255, 255, 255, 1.0)");
                        gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.0)");
                        gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.9)");
                        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.0)");
                        gradient.addColorStop(0.9, "rgba(255, 255, 255, 0.2)");
                        gradient.addColorStop(1.0, "rgba(255, 255, 255, 1.0)");

                        ctx.clearRect(0, 0, 512, 512);
                        ctx.beginPath();
                        ctx.arc(256, 256, 256, 0, Math.PI * 2, true);
                        // ctx.fillStyle = "rgb(0, 155, 255)";
                        ctx.fillStyle = gradient;
                        ctx.fill();
                        ctx.restore();
                    });
                `;

        const config = {
            evalString,
            position: [...position],
            scale: [...scale],
            positions: [...XE.Obj.CustomPrimitive.Geometry.unitSquare.positions],
            sts: [...XE.Obj.CustomPrimitive.Geometry.unitSquare.sts],
            indices: [...XE.Obj.CustomPrimitive.Geometry.unitSquare.indices],
            renderState: XE.Obj.CustomPrimitive.getRenderState(true, true),
            color: [...color],
            canvasWidth: 512,
            canvasHeight: 512,
        };

        let p = new XE.Obj.CustomPrimitive(earth);
        p.xbsjFromJSON(config);
    }

    // 底面动态辐射波
    {
        const evalString = `
                    p.canvasWidth = 512;
                    p.canvasHeight = 512;
                    p.drawCanvas(ctx => {
                        ctx.clearRect(0, 0, 512, 512);

                        ctx.strokeStyle = "rgb(255, 255, 255)";
                        ctx.setLineDash([80, 80]);
                        ctx.lineWidth = 30;
                        ctx.arc(256, 256, 241, 0, Math.PI * 2, true);
                        ctx.stroke();
                    });
                `;

        const preUpdateEvalString = `
                    if (typeof p.dAngle === 'undefined') p.dAngle = 0.0;
                    if (typeof p.dt === 'undefined') p.dt = 0.01;

                    p.dAngle += 10.0;
                    if (p.dAngle > 360.0) {
                        p.dAngle = 0.0;
                    }
                    p.rotation[0] = p.dAngle / 180.0 * Math.PI;

                    p.dt += 0.02;
                    if (p.dt > 1.0) p.dt = 0.01;

                    p.scale[0] = 50 * p.dt;
                    p.scale[1] = 50 * p.dt;
                `;

        const config = {
            evalString,
            preUpdateEvalString,
            position: [...position],
            scale: [50, 50, 1],
            positions: [...XE.Obj.CustomPrimitive.Geometry.unitSquare.positions],
            sts: [...XE.Obj.CustomPrimitive.Geometry.unitSquare.sts],
            indices: [...XE.Obj.CustomPrimitive.Geometry.unitSquare.indices],
            renderState: XE.Obj.CustomPrimitive.getRenderState(true, true),
            color: [...color],
            canvasWidth: 512,
            canvasHeight: 512,
        };

        let p = new XE.Obj.CustomPrimitive(earth);
        p.xbsjFromJSON(config);
    }

    // 柱体
    {
        const fragmentShaderSource =
            `
                varying vec3 v_positionEC;
                varying vec3 v_normalEC;
                varying vec2 v_st;
                varying vec4 v_color;
                uniform sampler2D u_image;
                uniform vec4 u_color;
                void main()
                {
                    float powerRatio = fract(czm_frameNumber / 30.0) + 1.0;
                    float alpha = pow(1.0 - v_st.t, powerRatio);
                    gl_FragColor = vec4(u_color.rgb, alpha*u_color.a);
                }
                `;
        const renderState = XE.Obj.CustomPrimitive.getRenderState(true, true);
        renderState.cull.enabled = false;
        const cylinder = XE.Obj.CustomPrimitive.Geometry.createCylinder(0.3, 2.0, 1.0, 6);
        const config = {
            position: [...position],
            scale: [3 / 50 * scale[0], 3 / 50 * scale[1], 300 * scale[2]],
            positions: cylinder.positions,
            sts: cylinder.sts,
            indices: cylinder.indices,
            renderState,
            color: [...color],
            canvasWidth: 1.0,
            fragmentShaderSource,
        };

        let p = new XE.Obj.CustomPrimitive(earth);
        p.xbsjFromJSON(config);
    }

    // 柱体粒子
    {
        const fragmentShaderSource =
            `
                varying vec3 v_positionEC;
                varying vec3 v_normalEC;
                varying vec2 v_st;
                varying vec4 v_color;
                uniform sampler2D u_image;
                uniform vec4 u_color;
                void main()
                {
                    vec3 positionToEyeEC = -v_positionEC;
                    vec3 normalEC = normalize(v_normalEC);
                    normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);

                    float dt = fract(czm_frameNumber / 90.0);
                    vec2 st = fract(vec2(1.0) + v_st - vec2(dt, dt));
                    vec4 imageColor = texture2D(u_image, st);

                    vec3 diffuse = imageColor.rgb;
                    float alpha = imageColor.a;

                    diffuse *= v_color.rgb;
                    alpha *= v_color.a;

                    diffuse *= u_color.rgb;
                    alpha *= u_color.a;

                    gl_FragColor = vec4(diffuse, alpha * pow(1.0 - v_st.t, 2.0));
                }
                `;

        const evalString = `
                    p.canvasWidth = 32;
                    p.canvasHeight = 256;
                    Cesium.Resource.createIfNeeded('./images/city/particles.png').fetchImage().then(function(image) {
                        p.drawCanvas(ctx => {
                            ctx.clearRect(0, 0, 32, 256);
                            ctx.drawImage(image, 0, 0);
                        });
                    });
                `;

        const renderState = XE.Obj.CustomPrimitive.getRenderState(true, true);
        renderState.cull.enabled = false;
        const cylinder = XE.Obj.CustomPrimitive.Geometry.createCylinder(4.0, 4.0, 1.0, 6);
        const config = {
            fragmentShaderSource,
            evalString,
            position: [...position],
            scale: [3 / 50 * scale[0], 3 / 50 * scale[1], 300 * scale[2]],
            positions: cylinder.positions,
            sts: cylinder.sts,
            indices: cylinder.indices,
            color: [...color],
            canvasWidth: 32,
            canvasHeight: 256,
            renderState,
        };

        const p = new XE.Obj.CustomPrimitive(earth);
        p.xbsjFromJSON(config);
    }
}

function createCylinder(earth) {
    const renderState = XE.Obj.CustomPrimitive.getRenderState(true, true);
    renderState.cull.enabled = false;
    const cylinder = XE.Obj.CustomPrimitive.Geometry.createCylinder(1.0, 1.0, 1.0, 30);
    const evalString = `
                p.canvasWidth = 512;
                p.canvasHeight = 512;
                Cesium.Resource.createIfNeeded('./images/city/circular2.png').fetchImage().then(function(image) {
                    console.log('image loaded!');
                    p.canvasWidth = 512;
                    p.canvasHeight = 256;

                    p.drawCanvas(ctx => {
                        ctx.clearRect(0, 0, 512, 256);
                        ctx.drawImage(image, 0, 0);
                    });

                    p.color = [0.5, 0.8, 1, 2];
                });
            `;

    const preUpdateEvalString = `
                if (typeof p.dAngle === 'undefined') p.dAngle = 360.0;
                p.dAngle -= 1.0;
                if (p.dAngle < 0.0) {
                    p.dAngle = 360.0;
                }
                p.rotation[0] = p.dAngle / 180.0 * Math.PI;
            `;

    const config = {
        evalString,
        preUpdateEvalString,
        position: [2.120597930315031, 0.5451624300822016, 150],
        scale: [100, 100, 314],
        positions: cylinder.positions,
        sts: cylinder.sts,
        indices: cylinder.indices,
        renderState,
        canvasWidth: 512,
        canvasHeight: 512,
    };
    const p = new XE.Obj.CustomPrimitive(earth);
    p.xbsjFromJSON(config);

    return p;
}

function createCylinder2(earth) {
    const cylinder = XE.Obj.CustomPrimitive.Geometry.createCylinder(1.0, 1.0, 1.0, 30);
    const renderState = XE.Obj.CustomPrimitive.getRenderState(true, true);
    renderState.cull.enabled = false;
    const evalString = `
                p.canvasWidth = 1;
                p.canvasHeight = 256;
                p.drawCanvas(ctx => {
                    ctx.clearRect(0, 0, 1, 256);

                    var lingrad2 = ctx.createLinearGradient(0,0,0,256);
                    lingrad2.addColorStop(0, 'rgba(255,255,255,0)');
                    lingrad2.addColorStop(1, 'rgba(255,255,255,1)');

                    ctx.fillStyle = lingrad2;
                    ctx.fillRect(0, 0, 1, 256);
                }); 
            `;

    const preUpdateEvalString = `
                if (typeof p.dt === 'undefined') p.dt = 0.0;
                p.dt += 0.01 * 0.3;
                if (p.dt > 1.0) {
                    p.dt = 0.0;
                }

                const b = (1.0-Math.cos(p.dt*Math.PI*2.0))*0.5;
                p.scale[0] = p.scale[1] = 1000 * (1.0-Math.cos(p.dt*Math.PI))*0.5;
                p.scale[2] = 200 * b;
                p.color[3] = 2.0 * b;
            `;

    const config = {
        evalString,
        preUpdateEvalString,
        position: [2.1206125026580582, 0.545178729438238, 15],
        scale: [500, 500, 100],
        positions: cylinder.positions,
        sts: cylinder.sts,
        indices: cylinder.indices,
        renderState: renderState,
        canvasWidth: 1,
        canvasHeight: 256,
        color: [0.5, 0.8, 1, 2],
    }

    const p = new XE.Obj.CustomPrimitive(earth);
    p.xbsjFromJSON(config);

    return p;
}

function createGroundCircle(earth) {
    const evalString = `
                Cesium.Resource.createIfNeeded('./images/circle.png').fetchImage().then(function(image) {
                    console.log('image loaded!');
                    p._ctx_image = image;
                });
            `;

    const preUpdateEvalString = `
                if (typeof p.dAngle === 'undefined') p.dAngle = 360.0;
                p.dAngle -= 1.0;
                if (p.dAngle < 0.0) {
                    p.dAngle = 360.0;
                }
                const rotation = p.dAngle / 180.0 * Math.PI;

                p.drawCanvas(ctx => {
                    ctx.clearRect(0, 0, 512, 512);

                    ctx.beginPath();
                    ctx.strokeStyle = "rgb(128, 128, 128)";
                    // ctx.setLineDash([8, 8]);
                    ctx.lineWidth = 1;
                    ctx.arc(256, 256, 250, 0, Math.PI*2, true);
                    ctx.stroke();

                    if (p._ctx_image) {
                        ctx.save();
                        ctx.translate(256, 256);
                        ctx.rotate(rotation);
                        ctx.translate(-256, -256);
                        ctx.drawImage(p._ctx_image, 0, 0);
                        ctx.restore();
                    }
                });
            `;

    const config = {
        evalString,
        preUpdateEvalString,
        position: [2.1208980215153845, 0.5450726579947579, 41.369588015024185],
        width: 1000,
        height: 1000,
        canvasWidth: 512,
        canvasHeight: 512,
        color: [0.5, 0.8, 1, 2],
    };
    const p = new XE.Obj.CustomGroundRectangle(earth);
    p.xbsjFromJSON(config);

    return p;
}

function createODLines(earth) {
    const odlines = new XE.Obj.ODLines(earth);
    odlines.color = [1, 1, 1, 1];

    var busLines = [];

    var p = [
        [[2.120576951415724, 0.5453286305283411, 0], [2.1206180324809942, 0.5452742515355276, 0], [2.1206522870077222, 0.5452127930893627, 0], [2.1206589437154424, 0.5451630655115893, 0], [2.1207314498206467, 0.5450382941603948, 9.313225746154785e-10]],
        [[2.1209955007242574, 0.5452933880932761, 0], [2.1209282195105272, 0.545289825083161, 0], [2.1208692016474275, 0.5452876777088307, 0], [2.120819162511318, 0.5452826799554552, 0], [2.120783810274953, 0.5452697527668044, 0], [2.1207335742022293, 0.5452568892680687, 0], [2.1206962437670036, 0.5452449834073527, 9.313225746154785e-10], [2.120661134416048, 0.5452280242012201, 0], [2.120638649850512, 0.5452166875660143, 0], [2.120618096957342, 0.545213841975332, 0], [2.1205990690837795, 0.545215655029966, 0], [2.1205555448547644, 0.5452309724456519, 0], [2.120518239373133, 0.545245934727075, 0], [2.120487939951654, 0.5452532353559607, 0], [2.120453877869143, 0.5452771262379986, 0]],
        [[2.1207720402496113, 0.5447232254659223, 0], [2.120793937457453, 0.5447614096520289, 0], [2.120813924804299, 0.5447878347320643, 0], [2.120822805668622, 0.5448060918960522, 0], [2.1208257532307546, 0.5448322042009828, 0], [2.120829308604679, 0.5448854085667205, 9.313225746154785e-10], [2.120829710319531, 0.5449227070309821, -1.3969838619232178e-9], [2.1208166872422236, 0.544965451614071, 0], [2.1207970443299544, 0.5450225616224018, 0], [2.1207741955597377, 0.5450815697881131, 0], [2.1207472452404077, 0.5451390197693765, 0], [2.120715891711618, 0.5451913500871663, 0], [2.120686154707263, 0.5452393433291649, 0], [2.12063135560303, 0.5453206355916543, 0]],
        [[2.121160980714632, 0.5451757121823626, 0], [2.1210251435952436, 0.5451293851641247, 0], [2.1209452677709963, 0.5451042703034664, 9.313225746154785e-10], [2.1208610109812414, 0.5450787900247277, 0], [2.120760520282932, 0.5450446749446803, 0], [2.1207079872433443, 0.5450233097361727, 0], [2.120655050843051, 0.5450014714916114, 0]],
        [[2.120812500352057, 0.5453409107030308, 0], [2.120889078346998, 0.545195520436419, 0], [2.120932108701968, 0.5451150725145038, 0], [2.1209760848229955, 0.5450053244299348, 0], [2.12100809512331, 0.5449329288607905, 0], [2.1210103662286377, 0.5448484817861251, 0], [2.1209514513937577, 0.5447197092694818, 0], [2.120915420918161, 0.5446602609794765, 0]],
        [[2.1207306918664655, 0.5450365938435415, 9.313225746154785e-10], [2.1206990239651544, 0.5450969027142336, 0], [2.120677978213145, 0.5451274025996179, 0], [2.120658030989688, 0.5451591032035257, 0], [2.1206162009039806, 0.5451494731344788, 0], [2.1205521515380683, 0.5451454787671309, 0], [2.120523261544574, 0.5451764652644532, 0], [2.120513465572076, 0.545186828361311, 0], [2.1205064729532204, 0.5452286596830263, 0], [2.1205097293904305, 0.5452390289664278, 0], [2.1205155659504875, 0.5452579743863037, 0], [2.1205339607444076, 0.545278609470748, 0], [2.120560671532377, 0.5452975128166889, 0], [2.1205860070598015, 0.5453142541502414, 9.313225746154785e-10]],
        [[2.1207475456110645, 0.5447800539523988, 0], [2.120758418929566, 0.5448033612258552, 0], [2.120760641853426, 0.5448290569441138, 9.313225746154785e-10], [2.1207520812530873, 0.5448549639478996, 0], [2.120739040764019, 0.5448955019165921, 0], [2.1207330217222946, 0.5449114209250849, 0], [2.120718556398262, 0.5449340150779083, 0], [2.120713075825238, 0.544947520937067, 0], [2.120705542548285, 0.5449750973423848, 0], [2.1206999424341655, 0.5449955334381246, 0], [2.120687471724567, 0.5450193172680584, 0], [2.1206764015730624, 0.5450357466832338, 0], [2.120663102383312, 0.5450423671149535, 0], [2.1206448093335357, 0.5450499263807379, 9.313225746154785e-10], [2.120632844942622, 0.5450538781259359, 0], [2.120622060207328, 0.5450609589527403, 0], [2.1206155051610045, 0.5450684063880887, 0], [2.120607014920696, 0.5450806634111063, 0], [2.1205992267700324, 0.5450923313279744, 9.313225746154785e-10], [2.120584223402013, 0.5451085782187807, 0], [2.120576665442944, 0.5451174618031969, 0], [2.1205701463581166, 0.5451484523716619, 0], [2.1205668616484528, 0.5451880772265143, 0], [2.120564504835388, 0.5452216324909629, 0], [2.120566743584541, 0.5452398398463616, 0], [2.1205793907371806, 0.5452571562150061, 0], [2.1206001724906343, 0.5452746261479045, 0], [2.1206140688131194, 0.5452855227986639, 0], [2.1206437404304954, 0.545302603645019, 0], [2.120662464415334, 0.5453071556708504, 9.313225746154785e-10], [2.1206966046753832, 0.5453118255745306, 0], [2.120728244569391, 0.5453141431903682, 0], [2.1207790870639474, 0.5453081271451783, 0], [2.1207999960307644, 0.5453059696492232, 0], [2.1208412595933046, 0.5453064111342434, 0]],
        [[2.121158021864907, 0.5449751074159752, 9.313225746154785e-10], [2.1210824723034527, 0.5450174633121871, 0], [2.120992322328455, 0.5450701295875267, 9.313225746154785e-10], [2.1209337630351115, 0.5451036284263123, 9.313225746154785e-10], [2.1208609626501214, 0.5451304457577895, 9.313225746154785e-10], [2.1207686896794486, 0.5451607280138492, 9.313225746154785e-10], [2.1207276250972584, 0.5451726734688432, 0], [2.1206842408878455, 0.5451860277258503, 0], [2.1206261209699546, 0.5452008662996621, 0], [2.1205742546569972, 0.5452227902910405, 0], [2.120525926857736, 0.5452438874376151, 9.313225746154785e-10], [2.120511201654767, 0.5452494511671568, 0], [2.120490450284154, 0.5452515681283203, 0], [2.1204606323651403, 0.5452705556733306, 0]],
    ];

    p.push(...p, ...p); // 重复路径3次

    let timeDuration = 10.0;
    let moveBaseDuration = 4.0;

    busLines = p.map(e => {
        return {
            positions: e.map(ee => [ee[0], ee[1]]),
            color: [Math.random() * 0.5 + 0.5, Math.random() * 0.8 + 0.2, 0.0, 1.0],
            width: 2.0,
            startTime: timeDuration * Math.random(),
            duration: moveBaseDuration + 1.0 * Math.random()
        }
    });

    odlines.data = busLines;
    odlines.timeDuration = timeDuration;
    odlines.playing = true;

    return odlines;
}

function createODLines2(earth) {
    const odlines = new XE.Obj.ODLines(earth);
    odlines.color = [1, 1, 1, 1];

    var busLines = [];

    var p = [
        [[2.120576951415724, 0.5453286305283411, 0], [2.1206180324809942, 0.5452742515355276, 0], [2.1206522870077222, 0.5452127930893627, 0], [2.1206589437154424, 0.5451630655115893, 0], [2.1207314498206467, 0.5450382941603948, 9.313225746154785e-10]],
        [[2.1209955007242574, 0.5452933880932761, 0], [2.1209282195105272, 0.545289825083161, 0], [2.1208692016474275, 0.5452876777088307, 0], [2.120819162511318, 0.5452826799554552, 0], [2.120783810274953, 0.5452697527668044, 0], [2.1207335742022293, 0.5452568892680687, 0], [2.1206962437670036, 0.5452449834073527, 9.313225746154785e-10], [2.120661134416048, 0.5452280242012201, 0], [2.120638649850512, 0.5452166875660143, 0], [2.120618096957342, 0.545213841975332, 0], [2.1205990690837795, 0.545215655029966, 0], [2.1205555448547644, 0.5452309724456519, 0], [2.120518239373133, 0.545245934727075, 0], [2.120487939951654, 0.5452532353559607, 0], [2.120453877869143, 0.5452771262379986, 0]],
        [[2.1207720402496113, 0.5447232254659223, 0], [2.120793937457453, 0.5447614096520289, 0], [2.120813924804299, 0.5447878347320643, 0], [2.120822805668622, 0.5448060918960522, 0], [2.1208257532307546, 0.5448322042009828, 0], [2.120829308604679, 0.5448854085667205, 9.313225746154785e-10], [2.120829710319531, 0.5449227070309821, -1.3969838619232178e-9], [2.1208166872422236, 0.544965451614071, 0], [2.1207970443299544, 0.5450225616224018, 0], [2.1207741955597377, 0.5450815697881131, 0], [2.1207472452404077, 0.5451390197693765, 0], [2.120715891711618, 0.5451913500871663, 0], [2.120686154707263, 0.5452393433291649, 0], [2.12063135560303, 0.5453206355916543, 0]],
        [[2.121160980714632, 0.5451757121823626, 0], [2.1210251435952436, 0.5451293851641247, 0], [2.1209452677709963, 0.5451042703034664, 9.313225746154785e-10], [2.1208610109812414, 0.5450787900247277, 0], [2.120760520282932, 0.5450446749446803, 0], [2.1207079872433443, 0.5450233097361727, 0], [2.120655050843051, 0.5450014714916114, 0]],
        [[2.120812500352057, 0.5453409107030308, 0], [2.120889078346998, 0.545195520436419, 0], [2.120932108701968, 0.5451150725145038, 0], [2.1209760848229955, 0.5450053244299348, 0], [2.12100809512331, 0.5449329288607905, 0], [2.1210103662286377, 0.5448484817861251, 0], [2.1209514513937577, 0.5447197092694818, 0], [2.120915420918161, 0.5446602609794765, 0]],
        [[2.1207306918664655, 0.5450365938435415, 9.313225746154785e-10], [2.1206990239651544, 0.5450969027142336, 0], [2.120677978213145, 0.5451274025996179, 0], [2.120658030989688, 0.5451591032035257, 0], [2.1206162009039806, 0.5451494731344788, 0], [2.1205521515380683, 0.5451454787671309, 0], [2.120523261544574, 0.5451764652644532, 0], [2.120513465572076, 0.545186828361311, 0], [2.1205064729532204, 0.5452286596830263, 0], [2.1205097293904305, 0.5452390289664278, 0], [2.1205155659504875, 0.5452579743863037, 0], [2.1205339607444076, 0.545278609470748, 0], [2.120560671532377, 0.5452975128166889, 0], [2.1205860070598015, 0.5453142541502414, 9.313225746154785e-10]],
        [[2.1207475456110645, 0.5447800539523988, 0], [2.120758418929566, 0.5448033612258552, 0], [2.120760641853426, 0.5448290569441138, 9.313225746154785e-10], [2.1207520812530873, 0.5448549639478996, 0], [2.120739040764019, 0.5448955019165921, 0], [2.1207330217222946, 0.5449114209250849, 0], [2.120718556398262, 0.5449340150779083, 0], [2.120713075825238, 0.544947520937067, 0], [2.120705542548285, 0.5449750973423848, 0], [2.1206999424341655, 0.5449955334381246, 0], [2.120687471724567, 0.5450193172680584, 0], [2.1206764015730624, 0.5450357466832338, 0], [2.120663102383312, 0.5450423671149535, 0], [2.1206448093335357, 0.5450499263807379, 9.313225746154785e-10], [2.120632844942622, 0.5450538781259359, 0], [2.120622060207328, 0.5450609589527403, 0], [2.1206155051610045, 0.5450684063880887, 0], [2.120607014920696, 0.5450806634111063, 0], [2.1205992267700324, 0.5450923313279744, 9.313225746154785e-10], [2.120584223402013, 0.5451085782187807, 0], [2.120576665442944, 0.5451174618031969, 0], [2.1205701463581166, 0.5451484523716619, 0], [2.1205668616484528, 0.5451880772265143, 0], [2.120564504835388, 0.5452216324909629, 0], [2.120566743584541, 0.5452398398463616, 0], [2.1205793907371806, 0.5452571562150061, 0], [2.1206001724906343, 0.5452746261479045, 0], [2.1206140688131194, 0.5452855227986639, 0], [2.1206437404304954, 0.545302603645019, 0], [2.120662464415334, 0.5453071556708504, 9.313225746154785e-10], [2.1206966046753832, 0.5453118255745306, 0], [2.120728244569391, 0.5453141431903682, 0], [2.1207790870639474, 0.5453081271451783, 0], [2.1207999960307644, 0.5453059696492232, 0], [2.1208412595933046, 0.5453064111342434, 0]],
        [[2.121158021864907, 0.5449751074159752, 9.313225746154785e-10], [2.1210824723034527, 0.5450174633121871, 0], [2.120992322328455, 0.5450701295875267, 9.313225746154785e-10], [2.1209337630351115, 0.5451036284263123, 9.313225746154785e-10], [2.1208609626501214, 0.5451304457577895, 9.313225746154785e-10], [2.1207686896794486, 0.5451607280138492, 9.313225746154785e-10], [2.1207276250972584, 0.5451726734688432, 0], [2.1206842408878455, 0.5451860277258503, 0], [2.1206261209699546, 0.5452008662996621, 0], [2.1205742546569972, 0.5452227902910405, 0], [2.120525926857736, 0.5452438874376151, 9.313225746154785e-10], [2.120511201654767, 0.5452494511671568, 0], [2.120490450284154, 0.5452515681283203, 0], [2.1204606323651403, 0.5452705556733306, 0]],
    ];

    p = p.flatMap(e => e);

    let timeDuration = 10.0;
    let moveBaseDuration = 4.0;

    busLines = p.map(e => {
        return {
            positions: [e, [e[0], e[1], e[2] + Math.random() * 500.0]],
            color: [0.5, 0.8, 1.0, 1.0],
            width: 2.0,
            startTime: timeDuration * Math.random(),
            duration: moveBaseDuration + 1.0 * Math.random()
        }
    });

    odlines.data = busLines;
    odlines.timeDuration = timeDuration;
    odlines.playing = true;

    return odlines;
}

function createODLines3(earth) {
    const odlines = new XE.Obj.ODLines(earth);
    odlines.color = [1, 1, 1, 1];

    var busLines = [];

    var p = [
        [[2.120597930315031, 0.5451624300822016, 400], [2.1202907282192385, 0.5450835546419367, 1.5],],
        [[2.120597930315031, 0.5451624300822016, 400], [2.120125294340532, 0.5453135338319917, 1.5],],
        [[2.120597930315031, 0.5451624300822016, 400], [2.120593634919066, 0.5455039098638930, 1.5],],
        [[2.120597930315031, 0.5451624300822016, 400], [2.120633904525988, 0.54481413672139860, 1.5],],
        [[2.120597930315031, 0.5451624300822016, 400], [2.1208228652896737, 0.545141073908163, 1.5],],
        [[2.120597930315031, 0.5451624300822016, 400], [2.120461948038486, 0.5451830324218808, 1.5],],
        [[2.120597930315031, 0.5451624300822016, 400], [2.1204975918398317, 0.5452978537884561, 1.5],],
        [[2.120597930315031, 0.5451624300822016, 400], [2.1207024221200843, 0.5453525660588958, 1.5],],
        [[2.120597930315031, 0.5451624300822016, 400], [2.1207404597752664, 0.5451854942212021, 1.5],],
    ];

    var positionsCollection = p.map(e => {
        const toDegree = 180.0 / Math.PI;
        // Cesium.xbsjCreateTransmitPolyline 根据 首末端点生成弧线，
        // 参数有：
        // startPosition, 端点1
        // endPosition, 端点2
        // minDistance, 计算出的线段的最小间隔距离
        // heightRatio=1.0 弧线高度抬升程度，值越大，抬高得越明显
        // 返回值是cartesian类型的坐标数组
        const cartesians = Cesium.xbsjCreateTransmitPolyline(e[0], e[1], 50.0, 5.0);
        const poss = cartesians.map(ee => {
            const carto = Cesium.Cartographic.fromCartesian(ee);
            return [carto.longitude, carto.latitude, carto.height];
        });

        return poss;
    });

    positionsCollection.push(...positionsCollection);
    positionsCollection.push(...positionsCollection);

    let timeDuration = 10.0;
    let moveBaseDuration = 4.0;

    busLines = positionsCollection.map(e => {
        return {
            positions: e,
            color: [0.5, 0.8, 1.0, 5.0],
            width: 3.0,
            startTime: timeDuration * Math.random(),
            duration: moveBaseDuration + 1.0 * Math.random()
        }
    });

    odlines.data = busLines;
    odlines.timeDuration = timeDuration;
    odlines.playing = true;

    return odlines;
}

function createLabel(earth) {
    let p = new XE.Obj.Pin(earth);
    p.position = [2.1204918655649285, 0.5452743468087804, 209.94294540636682];
    p.show = false;

    const labelDiv = document.createElement('div');
    labelDiv.style = `
                // background: grey;
                width: 300px;
                height: 200px;
                position: absolute;
                pointer-events: none;
            `;
    earth.czm.viewer.container.appendChild(labelDiv);

    const labelCanvas = document.createElement('canvas');
    labelCanvas.style = `
                width: 100%;
                height: 100%;
            `;

    labelCanvas.width = 300;
    labelCanvas.height = 200;
    labelDiv.appendChild(labelCanvas);

    const ctx = labelCanvas.getContext('2d');
    ctx.strokeStyle = 'rgb(255, 255, 0)';
    ctx.beginPath();
    ctx.lineTo(0, 200);
    ctx.lineTo(100, 100);
    ctx.lineTo(250, 100);
    ctx.stroke();
    ctx.font = "16px console";
    // ctx.textBaseline = "middle";
    ctx.fillStyle = 'rgb(255, 255, 0)';
    ctx.fillText('西部世界总部基地', 110, 90);

    // p.winPos 为一个含有4个元素的数组，分别表示[left, top, right, bottom]
    XE.MVVM.watch(() => [...p.winPos], winPos => {
        // console.log(`winPos: ${winPos.toString()}`);
        labelDiv.style.left = `${winPos[0]}px`;
        labelDiv.style.bottom = `${winPos[3]}px`;
    });
}

function createLabel2(earth) {
    const evalString = `
            function createLabelCanvas(p) {
                const labelDiv = document.createElement('div');
                labelDiv.style = \`
                    // background: grey;
                    width: 300px;
                    height: 200px;
                    position: absolute;
                    pointer-events: none;
                \`;
                p._earth.czm.viewer.container.appendChild(labelDiv);
                p._labelDiv = labelDiv;
                // p.disposers是一堆会调用函数的数组，会在对象销毁时按照后进先出的顺序调用。
                p.disposers.push(() => {
                    if (p._labelDiv) {
                        p._earth.czm.viewer.container.removeChild(p._labelDiv);
                        p._labelDiv = undefined;
                    }
                });

                // 由enabled来控制可见性！
                p.disposers.push(XE.MVVM.watch(() => p.enabled, () => {
                    p._labelDiv.style.display = p.enabled ? 'block' : 'none';
                }));

                const labelCanvas = document.createElement('canvas');
                labelCanvas.style = \`
                    width: 100%;
                    height: 100%;
                \`;

                labelCanvas.width = 300;
                labelCanvas.height = 200;
                labelDiv.appendChild(labelCanvas);

                return labelCanvas;
            }

            function createDrawFunc(p) {
                const labelCanvas = createLabelCanvas(p);
                const ctx = labelCanvas.getContext('2d');
                function draw(w) {
                    ctx.clearRect(0, 0, 300, 200);

                    ctx.save();
                    ctx.beginPath();
                    ctx.rect((w-1)*300, 0, 300, 200);
                    ctx.clip();

                    ctx.strokeStyle = 'rgb(255, 255, 0)';
                    ctx.beginPath();
                    ctx.lineTo(0, 200);
                    ctx.lineTo(100, 100);
                    ctx.lineTo(250, 100);
                    ctx.stroke();
                    ctx.font = "16px console";
                    // ctx.textBaseline = "middle";
                    ctx.fillStyle = 'rgb(255, 255, 0)';
                    ctx.fillText('西部世界总部基地', 110, 90);
                    ctx.restore();
                }

                p._dDraw = draw;
            }

            createDrawFunc(p);

            let d = 0;
            let c = 0;
            p._dDraw(c);
            const preUpdateListener = earth.czm.scene.preUpdate.addEventListener(() => {
                if (d !== c) {
                    c += (d - c) * 0.1;
                    if (Math.abs(c - d) < 0.1) {
                        c = d;
                    }
                    p._dDraw(c);
                }
            });
            p.disposers.push(() => preUpdateListener && preUpdateListener());

            const container = p._earth.czm.viewer.container;
            const unwatch = XE.MVVM.watch(() => [...p.winPos], winPos => {
                if (p._labelDiv) {
                    p._labelDiv.style.left = \`\${winPos[0]}px\`;
                    p._labelDiv.style.bottom = \`\${winPos[3]}px\`;
                }

                // winPos 为一个包含4个元素的数组，分别代表 [left, top, right, bottom]
                if (winPos[0] > container.offsetWidth * 0.3 && winPos[0] < container.offsetWidth * 0.7 &&
                    winPos[3] > container.offsetHeight * 0.3 && winPos[3] < container.offsetHeight * 0.7) {
                    d = 1.0;
                } else {
                    d = 0.0;
                }
            });
            p.disposers.push(() => { unwatch && unwatch(); });
            `;

    // let p = new XE.Obj.Pin(earth);
    // p.position = [2.1204918655649285,0.5452743468087804,209.94294540636682];
    // p.show = false;
    // p.evalString = evalString;

    const p = new XE.Obj.Pin(earth);
    const config = {
        position: [2.1204918655649285, 0.5452743468087804, 209.94294540636682],
        show: false,
        evalString: evalString,
    };
    p.xbsjFromJSON(config);

    return p;
}


export { startup }