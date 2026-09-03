"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";

const DnaDistortion = () => {
    const containerRef =
        useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container =
            containerRef.current;

        if (!container) return;

        // -----------------------------------------
        // Scene
        // -----------------------------------------

        const scene = new THREE.Scene();

        const camera =
            new THREE.OrthographicCamera(
                -1,
                1,
                1,
                -1,
                0.1,
                10
            );

        camera.position.z = 1;


        // -----------------------------------------
        // Renderer
        // -----------------------------------------

        const renderer =
            new THREE.WebGLRenderer({
                alpha: true,
                antialias: true,
            });

        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        );

        renderer.setSize(
            container.clientWidth,
            container.clientHeight
        );

        renderer.setClearColor(
            0x000000,
            0
        );

        container.appendChild(
            renderer.domElement
        );


        // -----------------------------------------
        // Texture
        // -----------------------------------------

        const textureLoader =
            new THREE.TextureLoader();

        const texture =
            textureLoader.load(
                "/images/hero-1.png",
                () => {
                    texture.colorSpace =
                        THREE.SRGBColorSpace;

                    renderer.render(
                        scene,
                        camera
                    );
                },
                undefined,
                (error) => {
                    console.error(
                        "DNA texture failed to load:",
                        error
                    );
                }
            );


        // -----------------------------------------
        // Shader
        // -----------------------------------------

        const material =
            new THREE.ShaderMaterial({
                transparent: true,

                uniforms: {
                    uTexture: {
                        value: texture,
                    },

                    uMouse: {
                        value:
                            new THREE.Vector2(
                                0.5,
                                0.5
                            ),
                    },

                    uRadius: {
                        value: 0.16,
                    },

                    uStrength: {
                        value: 0.75,
                    },

                    uDistortion: {
                        value: 0.025,
                    },
                },

                vertexShader: `
                    varying vec2 vUv;

                    void main() {
                        vUv = uv;

                        gl_Position =
                            projectionMatrix *
                            modelViewMatrix *
                            vec4(
                                position,
                                1.0
                            );
                    }
                `,

                fragmentShader: `
                    uniform sampler2D uTexture;
                    uniform vec2 uMouse;

                    uniform float uRadius;
                    uniform float uStrength;
                    uniform float uDistortion;

                    varying vec2 vUv;

                    void main() {

                        vec2 uv = vUv;

                        float distanceFromMouse =
                            distance(
                                uv,
                                uMouse
                            );

                        float influence =
                            1.0 -
                            smoothstep(
                                0.0,
                                uRadius,
                                distanceFromMouse
                            );

                        vec2 direction =
                            uv - uMouse;

                        uv =
                            uMouse +
                            direction *
                            (
                                1.0 -
                                influence *
                                uStrength
                            );

                        float distortion =
                            sin(
                                distanceFromMouse *
                                35.0
                            ) *
                            influence *
                            uDistortion;

                        uv +=
                            normalize(
                                direction +
                                vec2(0.0001)
                            ) *
                            distortion;

                        vec4 color =
                            texture2D(
                                uTexture,
                                uv
                            );

                        gl_FragColor =
                            color;
                    }
                `,
            });


        // -----------------------------------------
        // Geometry
        // -----------------------------------------

        const geometry =
            new THREE.PlaneGeometry(
                2,
                2
            );

        const mesh =
            new THREE.Mesh(
                geometry,
                material
            );

        scene.add(mesh);


        // -----------------------------------------
        // Mouse
        // -----------------------------------------

        const mouseX =
            gsap.quickTo(
                material.uniforms
                    .uMouse.value,
                "x",
                {
                    duration: 0.3,
                    ease: "power3.out",
                }
            );

        const mouseY =
            gsap.quickTo(
                material.uniforms
                    .uMouse.value,
                "y",
                {
                    duration: 0.3,
                    ease: "power3.out",
                }
            );

        const handleMouseMove = (
            event: MouseEvent
        ) => {
            const rect =
                container.getBoundingClientRect();

            const x =
                (event.clientX -
                    rect.left) /
                rect.width;

            const y =
                1 -
                (
                    (event.clientY -
                        rect.top) /
                    rect.height
                );

            mouseX(
                THREE.MathUtils.clamp(
                    x,
                    0,
                    1
                )
            );

            mouseY(
                THREE.MathUtils.clamp(
                    y,
                    0,
                    1
                )
            );
        };

        container.addEventListener(
            "mousemove",
            handleMouseMove
        );


        // -----------------------------------------
        // Render Loop
        // -----------------------------------------

        let animationFrameId: number;

        const render = () => {
            renderer.render(
                scene,
                camera
            );

            animationFrameId =
                requestAnimationFrame(
                    render
                );
        };

        render();


        // -----------------------------------------
        // Resize
        // -----------------------------------------

        const handleResize = () => {
            renderer.setSize(
                container.clientWidth,
                container.clientHeight
            );

            renderer.setPixelRatio(
                Math.min(
                    window.devicePixelRatio,
                    2
                )
            );
        };

        window.addEventListener(
            "resize",
            handleResize
        );


        // -----------------------------------------
        // Cleanup
        // -----------------------------------------

        return () => {
            cancelAnimationFrame(
                animationFrameId
            );

            container.removeEventListener(
                "mousemove",
                handleMouseMove
            );

            window.removeEventListener(
                "resize",
                handleResize
            );

            geometry.dispose();
            material.dispose();
            texture.dispose();
            renderer.dispose();

            renderer.domElement.remove();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="dna_distortion"
        />
    );
};

export default DnaDistortion;