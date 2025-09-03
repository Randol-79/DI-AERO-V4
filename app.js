// DI AERO - minimal app boot + secure Mapbox token usage
(function () {
  const byMeta = document.querySelector('meta[name="mapbox-token"]')?.content || "";
  const TOKEN = (typeof window !== "undefined" && window.MAPBOX_TOKEN) || byMeta || "";

  function initNav() {
    const buttons = document.querySelectorAll(".nav-btn");
    const pages = document.querySelectorAll(".page");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const id = btn.getAttribute("data-page");
        pages.forEach(p => p.classList.remove("active"));
        document.getElementById(id + "-page")?.classList.add("active");
        if (id === "flight-ops") initMap();
      });
    });
  }

  function initMap() {
    const el = document.getElementById("flight-map");
    if (!el) return;

    if (typeof mapboxgl === "undefined") {
      el.textContent = "Mapbox GL JS not available";
      return;
    }
    if (!TOKEN) {
      el.textContent = "Map temporarily unavailable (no token)";
      console.warn("Mapbox token missing – set MAPBOX_TOKEN in Vercel.");
      return;
    }

    mapboxgl.accessToken = TOKEN;
    const map = new mapboxgl.Map({
      container: "flight-map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-92.0198, 30.2241], // Lafayette, LA
      zoom: 12,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
  }

  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    // Optionally initialize map if Flight Ops is default page
    const active = document.querySelector(".nav-btn.active")?.getAttribute("data-page");
    if (active === "flight-ops") initMap();
  });
})();