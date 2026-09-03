"use client";

import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { useEffect, useRef } from "react";

import { subscribeTicker } from "@/lib/hero/ticker";
import {
    atmoFragment,
    atmoVertex,
    finalFragment,
    finalVertex,
    helixFragment,
    helixVertex,
    inkFragment,
    inkVertex,
} from "@/lib/hero/shaders";

const CFG = {
    bgColor: "#EBF8FF",
    atmoColor: "#14508A",
    atmoCount: 1500,
    atmoSize: 0,
    atmoSpeed: 0.6,
    helixColorA: "#0B3A6B",
    helixColorB: "#3DB4E6",
    inkCore: "#7EC8F0",
    inkMid: "#D4EEF9",
    inkEdge: "#14508A",
    helixCount: 40000,
    inkCount: 160000,
    camDist: 12,
    helixSize: 1.55,
    inkSize: 5,
    brightness: 0.52,
    helixOpacity: 1.85,
    inkOpacity: 0.72,
    inkGrow: 1.45,
    radius: 2.05,
    height: 7.2,
    twist: 0.58,
    strandThick: 0.55,
    wave: 0.42,
    spin: 0.62,
    tilt: -0.28,
    emitRate: 0.19,
    spread: 0.48,
    rise: -0.16,
    turbulence: 1.35,
    noiseFreq: 1.05,
    noiseEvolve: 0.1,
    parallax: 3,
    pointerRadius: 5,
    pointerStrength: 1.55,
    maxPixelRatio: 1.5,
    fov: 45,
    near: 0.1,
    far: 200,
    fogFar: 22,
};

const REFERENCE_BUFFER_HEIGHT = 1600;
const MAX_FRAME_DELTA = 0.05;
const APPEAR_DELAY = 0.2;
const APPEAR_DURATION = 1.6;
const POINTER_EASE = 0.05;
const CURSOR_EASE = 0.15;
const ACTIVITY_EASE = 0.08;
const POINTER_IDLE_SECONDS = 3;

function rawColor(hex: string) {
    const n = parseInt(hex.slice(1), 16);
    const color = new THREE.Color();
    color.r = ((n >> 16) & 255) / 255;
    color.g = ((n >> 8) & 255) / 255;
    color.b = (n & 255) / 255;
    return color;
}

function seedGeometry(count: number) {
    const seeds = new Float32Array(count * 3);
    for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random() * 64;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(seeds, 3)
    );
    return geometry;
}

function pointMaterial(
    vertexShader: string,
    fragmentShader: string,
    uniforms: Record<string, THREE.IUniform>
) {
    const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.MultiplyBlending,
        premultipliedAlpha: true,
    });
    return material;
}

export default function DnaInkScene() {
    const wrapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const wrap = wrapRef.current;
        if (!wrap) return;

        const bg = rawColor(CFG.bgColor);

        const renderer = new THREE.WebGLRenderer({
            antialias: false,
            alpha: true,
            premultipliedAlpha: true,
            powerPreference: "high-performance",
        });
        renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
        renderer.toneMapping = THREE.NoToneMapping;
        renderer.setClearColor(bg, 1);
        wrap.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        scene.background = bg;
        scene.fog = new THREE.Fog(bg.clone(), 0.1, CFG.fogFar);

        const camera = new THREE.PerspectiveCamera(
            CFG.fov,
            1,
            CFG.near,
            CFG.far
        );
        camera.position.set(0, 0, CFG.camDist);
        camera.lookAt(0, 0, 0);
        scene.add(camera);

        const tiltGroup = new THREE.Group();
        tiltGroup.rotation.x = CFG.tilt;
        scene.add(tiltGroup);

        const spinner = new THREE.Group();
        spinner.rotation.y = CFG.spin;
        tiltGroup.add(spinner);

        const sharedCursor = {
            uCursor: { value: new THREE.Vector3() },
            uRepelRadius: { value: CFG.pointerRadius },
            uRepelStrength: { value: CFG.pointerStrength },
            uActivity: { value: 0 },
        };

        const helixUniforms = {
            uTime: { value: 0 },
            uHelixSize: { value: CFG.helixSize },
            uTwist: { value: CFG.twist },
            uRadius: { value: CFG.radius },
            uHeight: { value: CFG.height },
            uThick: { value: CFG.strandThick },
            uWave: { value: CFG.wave },
            uPixelScale: { value: 1 },
            uHelixA: { value: rawColor(CFG.helixColorA) },
            uHelixB: { value: rawColor(CFG.helixColorB) },
            uBrightness: { value: CFG.brightness },
            uHelixOpacity: { value: CFG.helixOpacity },
            uAppear: { value: 0 },
            ...sharedCursor,
        };

        const inkUniforms = {
            uTime: { value: 0 },
            uInkSize: { value: CFG.inkSize },
            uTwist: { value: CFG.twist },
            uRadius: { value: CFG.radius },
            uHeight: { value: CFG.height },
            uThick: { value: CFG.strandThick },
            uWave: { value: CFG.wave },
            uEmitRate: { value: CFG.emitRate },
            uSpread: { value: CFG.spread },
            uRise: { value: CFG.rise },
            uTurb: { value: CFG.turbulence },
            uNoiseFreq: { value: CFG.noiseFreq },
            uNoiseEvolve: { value: CFG.noiseEvolve },
            uInkGrow: { value: CFG.inkGrow },
            uPixelScale: { value: 1 },
            uInkCore: { value: rawColor(CFG.inkCore) },
            uInkMid: { value: rawColor(CFG.inkMid) },
            uInkEdge: { value: rawColor(CFG.inkEdge) },
            uBrightness: { value: CFG.brightness },
            uInkOpacity: { value: CFG.inkOpacity },
            uAppear: { value: 0 },
            ...sharedCursor,
        };

        const helixGeo = seedGeometry(CFG.helixCount);
        const helixMat = pointMaterial(helixVertex, helixFragment, helixUniforms);
        const helixPoints = new THREE.Points(helixGeo, helixMat);
        helixPoints.frustumCulled = false;
        spinner.add(helixPoints);

        const inkGeo = seedGeometry(CFG.inkCount);
        const inkMat = pointMaterial(inkVertex, inkFragment, inkUniforms);
        const inkPoints = new THREE.Points(inkGeo, inkMat);
        inkPoints.frustumCulled = false;
        spinner.add(inkPoints);

        const atmoGeo = new THREE.BufferGeometry();
        const atmoPos = new Float32Array(CFG.atmoCount * 3);
        const atmoSize = new Float32Array(CFG.atmoCount);
        const atmoSeed = new Float32Array(CFG.atmoCount);
        for (let i = 0; i < CFG.atmoCount; i++) {
            atmoPos[i * 3] = Math.random() * 2 - 1;
            atmoPos[i * 3 + 1] = Math.random() * 2 - 1;
            atmoPos[i * 3 + 2] = Math.random() * 2 - 1;
            atmoSize[i] = CFG.atmoSize;
            atmoSeed[i] = Math.random() * 64;
        }
        atmoGeo.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(atmoPos, 3)
        );
        atmoGeo.setAttribute(
            "size",
            new THREE.Float32BufferAttribute(atmoSize, 1)
        );
        atmoGeo.setAttribute(
            "seed",
            new THREE.Float32BufferAttribute(atmoSeed, 1)
        );

        const atmoMat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uRes: { value: new THREE.Vector2(1, 1) },
                uColor: { value: rawColor(CFG.atmoColor) },
            },
            vertexShader: atmoVertex,
            fragmentShader: atmoFragment,
            transparent: true,
            depthWrite: false,
            depthTest: false,
            blending: THREE.MultiplyBlending,
            premultipliedAlpha: true,
        });
        const atmoPoints = new THREE.Points(atmoGeo, atmoMat);
        atmoPoints.frustumCulled = false;
        camera.add(atmoPoints);

        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        composer.addPass(
            new ShaderPass({
                uniforms: { tDiffuse: { value: null } },
                vertexShader: finalVertex,
                fragmentShader: finalFragment,
            })
        );

        let lastW = -1;
        let lastH = -1;
        let pixelRatio = 1;

        const applySize = () => {
            const rect = wrap.getBoundingClientRect();
            const w = Math.round(rect.width);
            const h = Math.round(rect.height);
            if (w < 1 || h < 1) return;
            if (w === lastW && h === lastH) return;
            lastW = w;
            lastH = h;
            pixelRatio = Math.min(window.devicePixelRatio || 1, CFG.maxPixelRatio);
            renderer.setPixelRatio(pixelRatio);
            renderer.setSize(w, h, false);
            composer.setPixelRatio(pixelRatio);
            composer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            const uPixelScale = (h * pixelRatio) / REFERENCE_BUFFER_HEIGHT;
            helixUniforms.uPixelScale.value = uPixelScale;
            inkUniforms.uPixelScale.value = uPixelScale;
            atmoMat.uniforms.uRes.value.set(w * pixelRatio, h * pixelRatio);
            renderer.domElement.style.width = "100%";
            renderer.domElement.style.height = "100%";
        };

        applySize();

        let elapsed = 0;
        let lastFrame = performance.now();
        let startedAt = performance.now();
        let appearFrozen: number | null = null;
        let wasOnScreen = false;

        const pointerNdc = { x: 0, y: 0 };
        const pointerEased = { x: 0, y: 0 };
        const cursorEased = new THREE.Vector3();
        let activity = 0;
        let activityTarget = 0;
        let lastPointerMove = performance.now();
        const coarse =
            typeof window !== "undefined" &&
            window.matchMedia("(pointer: coarse)").matches;

        const ndcVec = new THREE.Vector3();
        const worldCursor = new THREE.Vector3();

        const resetClock = () => {
            elapsed = 0;
            lastFrame = performance.now();
            spinner.rotation.y = CFG.spin;
            pointerNdc.x = 0;
            pointerNdc.y = 0;
            pointerEased.x = 0;
            pointerEased.y = 0;
            cursorEased.set(0, 0, 0);
            activity = 0;
            activityTarget = 0;
            sharedCursor.uActivity.value = 0;
            sharedCursor.uCursor.value.set(0, 0, 0);
            camera.position.set(0, 0, CFG.camDist);
            camera.lookAt(0, 0, 0);
        };

        const onPointerMove = (event: PointerEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
            pointerNdc.x = THREE.MathUtils.clamp(x, -1, 1);
            pointerNdc.y = THREE.MathUtils.clamp(y, -1, 1);
            lastPointerMove = performance.now();
            activityTarget = 1;
        };

        if (!coarse) {
            wrap.addEventListener("pointermove", onPointerMove);
        }

        const unsub = subscribeTicker((now) => {
            applySize();

            const rect = wrap.getBoundingClientRect();
            const onScreen =
                rect.bottom > 0 &&
                rect.top < window.innerHeight &&
                rect.right > 0 &&
                rect.left < window.innerWidth;

            if (!onScreen) {
                if (wasOnScreen) resetClock();
                wasOnScreen = false;
                return;
            }

            if (!wasOnScreen) {
                lastFrame = now;
            }
            wasOnScreen = true;

            const wallDt = Math.min(
                MAX_FRAME_DELTA,
                Math.max(0, (now - lastFrame) / 1000)
            );
            lastFrame = now;
            elapsed += wallDt;

            if (appearFrozen === null) {
                const appear = THREE.MathUtils.clamp(
                    ((now - startedAt) / 1000 - APPEAR_DELAY) /
                        APPEAR_DURATION,
                    0,
                    1
                );
                helixUniforms.uAppear.value = appear;
                inkUniforms.uAppear.value = appear;
                if (appear >= 1) appearFrozen = 1;
            }

            helixUniforms.uTime.value = elapsed;
            inkUniforms.uTime.value = elapsed;
            atmoMat.uniforms.uTime.value = elapsed * CFG.atmoSpeed;

            if (!coarse) {
                pointerEased.x += (pointerNdc.x - pointerEased.x) * POINTER_EASE;
                pointerEased.y += (pointerNdc.y - pointerEased.y) * POINTER_EASE;

                if ((now - lastPointerMove) / 1000 > POINTER_IDLE_SECONDS) {
                    activityTarget = 0;
                }
                activity += (activityTarget - activity) * ACTIVITY_EASE;
                sharedCursor.uActivity.value = activity;

                camera.position.set(
                    pointerEased.x * CFG.parallax,
                    pointerEased.y * CFG.parallax,
                    CFG.camDist
                );
                camera.lookAt(0, 0, 0);

                ndcVec.set(pointerEased.x, pointerEased.y, 0.5);
                ndcVec.unproject(camera);
                ndcVec.sub(camera.position).normalize();
                const dist = -camera.position.z / ndcVec.z;
                worldCursor.copy(camera.position).addScaledVector(ndcVec, dist);
                cursorEased.lerp(worldCursor, CURSOR_EASE);
                sharedCursor.uCursor.value.copy(cursorEased);
            }

            composer.render();
        });

        return () => {
            unsub();
            if (!coarse) {
                wrap.removeEventListener("pointermove", onPointerMove);
            }
            helixGeo.dispose();
            inkGeo.dispose();
            atmoGeo.dispose();
            helixMat.dispose();
            inkMat.dispose();
            atmoMat.dispose();
            composer.dispose();
            renderer.dispose();
            renderer.domElement.remove();
        };
    }, []);

    return <div ref={wrapRef} className="hero_scene" aria-hidden="true" />;
}
