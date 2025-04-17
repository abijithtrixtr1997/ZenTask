import { SignIn } from "../Components/Register/SignIn";
import { SignUp } from "../Components/Register/Signup";
import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  phase: number;
}

export const LogInSignUp = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasHeight = window.innerHeight;
  const canvasWidth = window.innerWidth;
  const points: Point[] = [];
  const numPointsX = canvasHeight / 8;
  const numPointsY = canvasWidth / 8;
  const spacing = 70;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize points
    for (let y = 0; y < numPointsY; y++) {
      for (let x = 0; x < numPointsX; x++) {
        points.push({
          x: x * spacing,
          y: y * spacing,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now() / 1000;

      points.forEach((point) => {
        const offsetY = Math.sin(time * 2 + point.phase) * 10;

        ctx.beginPath();
        ctx.arc(point.x, point.y + offsetY, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "#CAD2C5";
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="login-container"
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      <div className="login-page-logo"></div>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
      <div className="inner-login-container">
        <SignIn />
        <SignUp />
      </div>
    </div>
  );
};
