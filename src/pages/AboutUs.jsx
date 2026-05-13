import { AboutUs } from "@/features/home/components/AboutUs";
import heroBg from "@/assets/about-hero-bg.png";

export default function AboutUsPage() {
  return (
    <>
      {/* Page hero banner — company image background */}
      <div className="relative overflow-hidden min-h-[500px] flex items-center justify-center">
        {/* Background image */}
        <img
          src={heroBg}
          alt="Polyus Vault precious metals facility"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />

        {/* Layer 1: overall dark tint */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Layer 2: cinema vignette — dark edges, cleaner center */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 90% at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* Layer 3: bottom fade for smooth transition into white content below */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#837b7b] to-transparent" />

        {/* Hero text — no card, just clean glowing text */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 py-16 max-w-3xl w-full">

          {/* Glowing label */}
          <p
            className="text-[11px] uppercase tracking-[0.35em] font-bold mb-5"
            style={{
              color: "#f6c752",
              textShadow:
                "0 0 12px rgba(246,199,82,1), 0 0 30px rgba(246,199,82,0.6), 0 0 60px rgba(246,199,82,0.3)",
            }}
          >
            Our Company
          </p>

          {/* Main heading */}
          <h1
            className="font-display font-bold tracking-tight leading-[1.1]"
            style={{
              fontSize: "clamp(3rem, 6.5vw, 5rem)",
              color: "#ffffff",
              textShadow:
                "0 2px 6px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.4)",
            }}
          >
            About{" "}
            <span
              style={{
                color: "#f6c752",
                textShadow:
                  "0 0 14px rgba(246,199,82,0.8), 0 2px 6px rgba(0,0,0,0.7)",
              }}
            >
              Polyus Vault
            </span>
          </h1>

          {/* Gold shimmer divider */}
          <div className="my-6 flex items-center gap-3">
            <div
              className="h-px w-16 rounded-full"
              style={{ background: "linear-gradient(90deg, transparent, #f6c752)" }}
            />
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "#f6c752", boxShadow: "0 0 8px rgba(246,199,82,0.9)" }}
            />
            <div
              className="h-px w-16 rounded-full"
              style={{ background: "linear-gradient(90deg, #f6c752, transparent)" }}
            />
          </div>

          {/* Subtitle */}
          <p
            className="text-lg leading-relaxed max-w-xl"
            style={{
              color: "rgba(255,255,255,0.90)",
              textShadow: "0 1px 8px rgba(0,0,0,0.7)",
            }}
          >
            A leading investment-grade precious metals dealer, combining institutional access
            with unmatched security — empowering every investor to own real gold and silver.
          </p>
        </div>
      </div>

      {/* Main about content */}
      <AboutUs compact={false} />
    </>
  );
}
