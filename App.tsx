import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './types';

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const mainRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Ensure window.customScrollProgress is initialized
  if (typeof window !== 'undefined' && typeof window.customScrollProgress === 'undefined') {
    window.customScrollProgress = 0;
  }

  useEffect(() => {
    // We use gsap.context to ensure proper cleanup in React 18+ strict mode
    const ctx = gsap.context(() => {
      
      // 1. Global Scroll Progress Tracker
      // This linearly tracks from 0.0 to 1.0 down the entire <main> container
      ScrollTrigger.create({
        trigger: mainRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          window.customScrollProgress = self.progress;
          // In the next phase, your Three.js / GLSL loop will read:
          // uniforms.u_scrollProgress.value = window.customScrollProgress;
        }
      });

      // 2. UI Micro-Animations based on Scroll Progress
      
      // Intro: Fade out and slide up as the user leaves the top
      gsap.to('.intro-text', {
        opacity: 0,
        y: -100,
        scrollTrigger: {
          trigger: '#intro',
          start: 'top top',
          end: 'bottom top',
          scrub: 1, // Add gentle smoothing
        }
      });

      // Act 1: Reveal smoothly, then fade out upon leaving
      gsap.fromTo('.act-1-text', 
        { opacity: 0, y: 100 },
        { 
          opacity: 1, 
          y: 0,
          scrollTrigger: {
            trigger: '#act-1-iris',
            start: 'top 80%',
            end: 'center center',
            scrub: 1,
          }
        }
      );
      gsap.to('.act-1-text', {
        opacity: 0,
        y: -100,
        scrollTrigger: {
          trigger: '#act-1-iris',
          start: 'center center',
          end: 'bottom top',
          scrub: 1,
        }
      });

      // Act 2: Emphasize asymmetrical grid placement (aligned right)
      gsap.fromTo('.act-2-text', 
        { opacity: 0, y: 100 },
        { 
          opacity: 1, 
          y: 0,
          scrollTrigger: {
            trigger: '#act-2-nebula',
            start: 'top 80%',
            end: 'center center',
            scrub: 1,
          }
        }
      );
      gsap.to('.act-2-text', {
        opacity: 0,
        y: -100,
        scrollTrigger: {
          trigger: '#act-2-nebula',
          start: 'center center',
          end: 'bottom top',
          scrub: 1,
        }
      });

      // Act 3: Dedication - Only reveal
      gsap.fromTo('.act-3-text',
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: '#act-3-dedication',
            start: 'top 80%',
            end: 'center center',
            scrub: 1,
          }
        }
      );
      
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* 
        ======================================================== 
        INJECTION POINT: THREE.JS / WEBGL CANVAS 
        ========================================================
        Fixed background canvas with z-index 0.
        All scrollytelling UI overlays float above this layer.
      */}
      <canvas
        id="webgl-canvas"
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      />

      <main ref={mainRef} className="ui-layer relative z-10 w-full">
        {/* Intro */}
        <section id="intro" className="min-h-[150vh] flex flex-col justify-center items-center px-6 md:px-12">
          <div className="intro-text text-center flex flex-col items-center">
            <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl tracking-wider font-normal text-ethereal mb-12 opacity-95">
              The Synesthesia <br /> of Salma
            </h1>
            <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.4em] opacity-60">
              [ SCROLL TO DIVE ]
            </p>
          </div>
        </section>

        {/* Act 1 */}
        <section id="act-1-iris" className="min-h-[150vh] flex flex-col justify-center items-start px-8 md:px-24">
          <div className="act-1-text max-w-2xl">
            <span className="font-sans text-[10px] md:text-xs uppercase tracking-widest opacity-40 block mb-8">
              ACT 01 // THE IRIS
            </span>
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl leading-tight text-ethereal opacity-90">
              A bloom of color in the void. An eye opening to a spectrum felt, not seen.
            </h2>
          </div>
        </section>

        {/* Act 2 */}
        <section id="act-2-nebula" className="min-h-[150vh] flex flex-col justify-center items-end px-8 md:px-24 text-right">
          <div className="act-2-text max-w-2xl">
            <span className="font-sans text-[10px] md:text-xs uppercase tracking-widest opacity-40 block mb-8">
              ACT 02 // THE NEBULA
            </span>
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl leading-tight text-ethereal opacity-90">
              Frequencies bleed into architecture. Sound collapsing into light.
            </h2>
          </div>
        </section>

        {/* Act 3 */}
        <section id="act-3-dedication" className="min-h-[150vh] flex flex-col justify-end pb-48 items-center px-6 text-center">
          <div className="act-3-text flex flex-col items-center">
            <h2 className="font-serif text-2xl md:text-4xl italic font-light text-ethereal opacity-80 mb-24">
              "For those who listen with their eyes."
            </h2>
            <div className="w-px h-24 bg-ethereal/20 mb-16"></div>
            <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-30">
              [ SYSTEM ONLINE :: WAITING FOR RENDERER :: PROGRESS: 100% ]
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

