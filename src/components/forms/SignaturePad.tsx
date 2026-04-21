"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

interface SignaturePadProps {
  value: string;
  onChange: (nextValue: string) => void;
}

export function SignaturePad({ value, onChange }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (!value) {
      clearCanvas();
      return;
    }

    if (!value.startsWith("data:image/")) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const image = new Image();
    image.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = value;
  }, [value]);

  function withCanvasPoint(event: ReactPointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) {
      return { x: 0, y: 0, canvas: null };
    }

    const rect = canvas.getBoundingClientRect();
    return {
      canvas,
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height
    };
  }

  function startDraw(event: ReactPointerEvent<HTMLCanvasElement>) {
    const { canvas, x, y } = withCanvasPoint(event);
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    canvas.setPointerCapture(event.pointerId);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  }

  function continueDraw(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!drawing) {
      return;
    }

    const { canvas, x, y } = withCanvasPoint(event);
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function endDraw(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!drawing) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    canvas.releasePointerCapture(event.pointerId);
    setDrawing(false);
    onChange(canvas.toDataURL("image/png"));
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function clearAndReset() {
    clearCanvas();
    onChange("");
  }

  return (
    <div className="space-y-3">
      <canvas
        ref={canvasRef}
        width={900}
        height={220}
        className="h-[170px] w-full touch-none rounded-xl border border-black/20 bg-white"
        onPointerDown={startDraw}
        onPointerMove={continueDraw}
        onPointerUp={endDraw}
        onPointerLeave={endDraw}
      />

      <button
        type="button"
        onClick={clearAndReset}
        className="rounded-full border border-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-black/75 transition hover:bg-black/5"
      >
        Clear Signature
      </button>
    </div>
  );
}
