import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer, EffectPass, RenderPass } from 'postprocessing';
import { createLiquidEffect, createNoiseEffect } from './pixelblast/effects';
import { FRAGMENT_SRC, MAX_CLICKS, SHAPE_MAP, VERTEX_SRC } from './pixelblast/shaders';
import { createTouchTexture } from './pixelblast/touchTexture';

const PixelBlast = ({
  variant = 'square',
  pixelSize = 3,
  color = '#B19EEF',
  className,
  style,
  antialias = true,
  patternScale = 2,
  patternDensity = 1,
  liquid = false,
  liquidStrength = 0.1,
  liquidRadius = 1,
  pixelSizeJitter = 0,
  enableRipples = true,
  rippleIntensityScale = 1,
  rippleThickness = 0.1,
  rippleSpeed = 0.3,
  liquidWobbleSpeed = 4.5,
  autoPauseOffscreen = true,
  speed = 0.5,
  transparent = true,
  edgeFade = 0.5,
  noiseAmount = 0,
  maxDpr = 2,
  maxFps = 60
}) => {
  const containerRef = useRef(null);
  const visibilityRef = useRef({ inView: true, docVisible: true });
  const speedRef = useRef(speed);

  const threeRef = useRef(null);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const disposeThree = (t, container) => {
    t.resizeObserver?.disconnect();
    t.intersectionObserver?.disconnect();
    if (t.onVisibilityChange && typeof document !== 'undefined')
      document.removeEventListener('visibilitychange', t.onVisibilityChange);
    if (t.listeners) {
      for (const [type, fn] of Object.entries(t.listeners)) t.renderer.domElement.removeEventListener(type, fn);
    }
    if (t.rafRef?.value) cancelAnimationFrame(t.rafRef.value);
    if (t.resizeRafRef?.value) cancelAnimationFrame(t.resizeRafRef.value);
    t.quad?.geometry.dispose();
    t.material.dispose();
    t.composer?.dispose();
    t.touch?.dispose?.();
    t.renderer.dispose();
    if (t.renderer.domElement.parentElement === container) container.removeChild(t.renderer.domElement);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (threeRef.current) {
      disposeThree(threeRef.current, container);
      threeRef.current = null;
    }

    visibilityRef.current.docVisible = typeof document !== 'undefined' ? !document.hidden : true;
    visibilityRef.current.inView = true;

    const canvas = document.createElement('canvas');
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    container.appendChild(renderer.domElement);

    const uniforms = {
      uResolution: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uClickPos: {
        value: Array.from({ length: MAX_CLICKS }, () => new THREE.Vector2(-1, -1))
      },
      uClickTimes: { value: new Float32Array(MAX_CLICKS) },
      uShapeType: { value: SHAPE_MAP[variant] ?? 0 },
      uPixelSize: { value: pixelSize * renderer.getPixelRatio() },
      uScale: { value: patternScale },
      uDensity: { value: patternDensity },
      uPixelJitter: { value: pixelSizeJitter },
      uEnableRipples: { value: enableRipples ? 1 : 0 },
      uRippleSpeed: { value: rippleSpeed },
      uRippleThickness: { value: rippleThickness },
      uRippleIntensity: { value: rippleIntensityScale },
      uEdgeFade: { value: edgeFade }
    };

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SRC,
      fragmentShader: FRAGMENT_SRC,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      glslVersion: THREE.GLSL3
    });
    const quadGeom = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(quadGeom, material);
    scene.add(quad);

    const setSize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height);
      if (threeRef.current?.composer)
        threeRef.current.composer.setSize(renderer.domElement.width, renderer.domElement.height);
      uniforms.uPixelSize.value = pixelSize * renderer.getPixelRatio();
    };
    setSize();

    const resizeRafRef = { value: 0 };
    const scheduleSetSize = () => {
      if (resizeRafRef.value) return;
      resizeRafRef.value = requestAnimationFrame(() => {
        resizeRafRef.value = 0;
        setSize();
      });
    };
    const ro = new ResizeObserver(scheduleSetSize);
    ro.observe(container);

    const randomFloat = () => {
      if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
        const u32 = new Uint32Array(1);
        window.crypto.getRandomValues(u32);
        return u32[0] / 0xffffffff;
      }
      return Math.random();
    };
    const timeOffset = randomFloat() * 1000;
    let time = 0;

    const timeUniforms = [];
    let composer;
    let touch;
    let liquidEffect;
    if (liquid) {
      touch = createTouchTexture();
      touch.radiusScale = liquidRadius;
      composer = new EffectComposer(renderer);
      const renderPass = new RenderPass(scene, camera);
      liquidEffect = createLiquidEffect(touch.texture, {
        strength: liquidStrength,
        freq: liquidWobbleSpeed
      });
      timeUniforms.push(liquidEffect.uniforms.get('uTime'));
      const effectPass = new EffectPass(camera, liquidEffect);
      effectPass.renderToScreen = true;
      composer.addPass(renderPass);
      composer.addPass(effectPass);
    }

    let noiseEffect;
    if (noiseAmount > 0) {
      if (!composer) {
        composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
      }
      noiseEffect = createNoiseEffect(noiseAmount);
      timeUniforms.push(noiseEffect.uniforms.get('uTime'));
      const noisePass = new EffectPass(camera, noiseEffect);
      noisePass.renderToScreen = true;
      if (composer && composer.passes.length > 0) composer.passes.forEach(p => (p.renderToScreen = false));
      composer.addPass(noisePass);
    }

    if (composer) composer.setSize(renderer.domElement.width, renderer.domElement.height);

    if (transparent) renderer.setClearAlpha(0);
    else renderer.setClearColor(0x000000, 1);

    let pointerActive = false;
    let pendingTouch = null;
    const mapToPixels = e => {
      const rect = renderer.domElement.getBoundingClientRect();
      const scaleX = renderer.domElement.width / rect.width;
      const scaleY = renderer.domElement.height / rect.height;
      const fx = (e.clientX - rect.left) * scaleX;
      const fy = (rect.height - (e.clientY - rect.top)) * scaleY;
      return { fx, fy, w: renderer.domElement.width, h: renderer.domElement.height };
    };
    const onPointerDown = e => {
      pointerActive = true;
      const { fx, fy, w, h } = mapToPixels(e);
      const ix = threeRef.current?.clickIx ?? 0;
      uniforms.uClickPos.value[ix].set(fx, fy);
      uniforms.uClickTimes.value[ix] = uniforms.uTime.value;
      if (threeRef.current) threeRef.current.clickIx = (ix + 1) % MAX_CLICKS;
      if (touch) pendingTouch = { x: fx / w, y: fy / h };
    };
    const onPointerMove = e => {
      if (!touch || !pointerActive) return;
      const { fx, fy, w, h } = mapToPixels(e);
      pendingTouch = { x: fx / w, y: fy / h };
    };
    const onPointerUp = () => {
      pointerActive = false;
    };
    const onPointerCancel = () => {
      pointerActive = false;
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown, { passive: true });
    renderer.domElement.addEventListener('pointermove', onPointerMove, { passive: true });
    renderer.domElement.addEventListener('pointerup', onPointerUp, { passive: true });
    renderer.domElement.addEventListener('pointercancel', onPointerCancel, { passive: true });

    const shouldRun = () => {
      if (!threeRef.current?.autoPauseOffscreen) return true;
      return visibilityRef.current.inView && visibilityRef.current.docVisible;
    };

    const rafRef = { value: 0 };
    let lastNow = performance.now();
    let lastRender = 0;
    const start = () => {
      if (rafRef.value) return;
      lastNow = performance.now();
      rafRef.value = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (!rafRef.value) return;
      cancelAnimationFrame(rafRef.value);
      rafRef.value = 0;
    };
    const loop = now => {
      if (!shouldRun()) {
        rafRef.value = 0;
        return;
      }
      const t = threeRef.current;
      if (!t) {
        rafRef.value = 0;
        return;
      }
      const dt = Math.max(0, (now - lastNow) / 1000);
      lastNow = now;

      const fps = t.maxFps ?? 60;
      const interval = fps > 0 ? 1000 / fps : 0;
      if (interval && now - lastRender < interval) {
        rafRef.value = requestAnimationFrame(loop);
        return;
      }
      lastRender = now;

      time += dt * speedRef.current;
      const uTime = timeOffset + time;
      uniforms.uTime.value = uTime;
      for (const u of timeUniforms) if (u) u.value = uTime;

      let didAddTouch = false;
      if (touch && pendingTouch) {
        touch.addTouch(pendingTouch);
        pendingTouch = null;
        didAddTouch = true;
      }

      if (composer) {
        if (touch && (didAddTouch || touch.hasTrail)) touch.update();
        composer.render();
      } else renderer.render(scene, camera);

      rafRef.value = requestAnimationFrame(loop);
    };

    let intersectionObserver;
    if (typeof IntersectionObserver !== 'undefined') {
      intersectionObserver = new IntersectionObserver(
        entries => {
          visibilityRef.current.inView = entries.some(e => e.isIntersecting && e.intersectionRatio > 0);
          if (shouldRun()) start();
          else stop();
        },
        { threshold: 0.01 }
      );
      intersectionObserver.observe(container);
    }

    const onVisibilityChange = () => {
      visibilityRef.current.docVisible = !document.hidden;
      if (shouldRun()) start();
      else stop();
    };
    document.addEventListener('visibilitychange', onVisibilityChange, { passive: true });

    const t = {
      renderer,
      scene,
      camera,
      material,
      clickIx: 0,
      uniforms,
      resizeObserver: ro,
      resizeRafRef,
      rafRef,
      quad,
      timeOffset,
      composer,
      touch,
      liquidEffect,
      noiseEffect,
      timeUniforms,
      maxFps,
      autoPauseOffscreen,
      setSize,
      start,
      stop,
      onVisibilityChange,
      intersectionObserver,
      listeners: {
        pointerdown: onPointerDown,
        pointermove: onPointerMove,
        pointerup: onPointerUp,
        pointercancel: onPointerCancel
      }
    };
    threeRef.current = t;

    if (shouldRun()) start();

    return () => {
      if (threeRef.current === t) {
        disposeThree(t, container);
        threeRef.current = null;
      }
    };
  }, [antialias, liquid, noiseAmount]);

  useEffect(() => {
    const t = threeRef.current;
    if (!t) return;

    t.maxFps = maxFps;
    t.autoPauseOffscreen = autoPauseOffscreen;

    t.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    t.setSize();

    t.uniforms.uShapeType.value = SHAPE_MAP[variant] ?? 0;
    t.uniforms.uPixelSize.value = pixelSize * t.renderer.getPixelRatio();
    t.uniforms.uColor.value.set(color);
    t.uniforms.uScale.value = patternScale;
    t.uniforms.uDensity.value = patternDensity;
    t.uniforms.uPixelJitter.value = pixelSizeJitter;
    t.uniforms.uEnableRipples.value = enableRipples ? 1 : 0;
    t.uniforms.uRippleIntensity.value = rippleIntensityScale;
    t.uniforms.uRippleThickness.value = rippleThickness;
    t.uniforms.uRippleSpeed.value = rippleSpeed;
    t.uniforms.uEdgeFade.value = edgeFade;

    if (transparent) t.renderer.setClearAlpha(0);
    else t.renderer.setClearColor(0x000000, 1);

    if (t.liquidEffect) {
      const uStrength = t.liquidEffect.uniforms.get('uStrength');
      if (uStrength) uStrength.value = liquidStrength;
      const uFreq = t.liquidEffect.uniforms.get('uFreq');
      if (uFreq) uFreq.value = liquidWobbleSpeed;
    }
    if (t.touch) t.touch.radiusScale = liquidRadius;

    if (t.autoPauseOffscreen && (!visibilityRef.current.inView || !visibilityRef.current.docVisible)) t.stop();
    else t.start();
  }, [
    variant,
    pixelSize,
    color,
    patternScale,
    patternDensity,
    pixelSizeJitter,
    enableRipples,
    rippleIntensityScale,
    rippleThickness,
    rippleSpeed,
    edgeFade,
    transparent,
    liquidStrength,
    liquidRadius,
    liquidWobbleSpeed,
    autoPauseOffscreen,
    maxDpr,
    maxFps
  ]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative overflow-hidden ${className ?? ''}`}
      style={style}
      aria-label="PixelBlast interactive background"
    />
  );
};

export default PixelBlast;
