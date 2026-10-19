"use client";

import React, { useEffect, useRef, useState } from "react";

export interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className = "" }: SplineSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isDisposed = false;
    let app: { dispose?: () => void } | null = null;

    async function loadSpline() {
      if (!canvasRef.current) return;
      try {
        const { Application } = await import("@splinetool/runtime");
        if (isDisposed || !canvasRef.current) return;
        const splineApp = new Application(canvasRef.current);
        app = splineApp;
        await splineApp.load(scene);
        if (!isDisposed) {
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to load Spline scene:", err);
        if (!isDisposed) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    }

    loadSpline();

    return () => {
      isDisposed = true;
      if (app && typeof app.dispose === "function") {
        app.dispose();
      }
    };
  }, [scene]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10 transition-opacity">
          <div className="w-9 h-9 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
        </div>
      )}
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center text-neutral-500 text-xs">
          3D interactive scene
        </div>
      ) : null}
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

export default SplineScene;
