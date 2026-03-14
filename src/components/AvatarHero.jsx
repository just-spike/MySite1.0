import React, { lazy, Suspense } from 'react';

const PixelBlast = lazy(() => import('./PixelBlast'));

const AvatarHero = ({ mode = 'pixel' }) => {
  return (
    <section id="avatar-hero" className="w-full relative h-[60vh]">
      <div className="absolute inset-0 overflow-hidden">
        {mode === 'pixel' ? (
          <Suspense fallback={null}>
            <PixelBlast
              variant="square"
              pixelSize={4}
              color="#B19EEF"
              patternScale={2}
              patternDensity={1}
              pixelSizeJitter={0}
              enableRipples
              rippleSpeed={0.4}
              rippleThickness={0.12}
              rippleIntensityScale={1.5}
              liquid={false}
              liquidStrength={0.12}
              liquidRadius={1.2}
              liquidWobbleSpeed={5}
              speed={0.1}
              edgeFade={0.25}
              transparent
              antialias={false}
              maxDpr={1.5}
              maxFps={40}
            />
          </Suspense>
        ) : null}
      </div>
      <div className="max-w-content mx-auto px-6 h-full flex flex-col justify-end pb-12 relative pointer-events-none">
        <div className="flex items-baseline justify-start">
          <div className="font-semibold tracking-wide text-2xl">AvatarHero</div>
        </div>
      </div>
    </section>
  );
};

export default AvatarHero;
