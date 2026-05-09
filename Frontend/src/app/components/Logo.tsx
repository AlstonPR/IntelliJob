/**
 * IntelliJob Logo Component
 *
 * UPLOAD LOGO HERE — Replace the SVG import below with the official IntelliJob brand asset.
 * Current file: /src/imports/Screenshot_2026-05-08_142413.svg  (placeholder)
 *
 * Usage:
 *   <Logo size={36} />            — just the mark
 *   <Logo size={36} showText />   — mark + "IntelliJob" wordmark
 */

import logoSvg from "../../imports/Screenshot_2026-05-08_142413.svg";

interface LogoProps {
  /** Height in pixels for the logo mark */
  size?: number;
  /** Show the "IntelliJob" text next to the mark */
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 36, showText = false, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`} style={{ flexShrink: 0 }}>
      {/* UPLOAD LOGO HERE — swap logoSvg with actual brand asset when ready */}
      <div
        style={{
          width: size,
          height: size,
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <img
          src={logoSvg}
          alt="IntelliJob"
          style={{
            // mix-blend-mode: screen makes the dark SVG background invisible on our dark UI
            // and renders the bright logo cut-outs as white/glowing marks
            mixBlendMode: "screen",
            filter: "brightness(1.4) contrast(1.1)",
            position: "absolute",
            // Crop to show just the main symbol (top ~80% of the SVG)
            width: "auto",
            height: `${size * 1.7}px`,
            top: `-${size * 0.05}px`,
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {showText && (
        <span
          style={{
            color: "#fff",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: `${size * 0.45}px`,
            letterSpacing: "0.08em",
            whiteSpace: "nowrap",
          }}
        >
          IntelliJob
        </span>
      )}
    </div>
  );
}
