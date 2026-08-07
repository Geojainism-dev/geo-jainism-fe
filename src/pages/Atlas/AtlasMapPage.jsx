import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { getAtlasStates } from "@/data/atlas";
import IndiaMap from "./components/IndiaMap";
import AtlasSidebar from "./components/AtlasSidebar";
import TempleDetail from "./components/TempleDetail";
import "@/styles/atlas.css";

const byName = new Map(getAtlasStates().map((s) => [s.name, s]));

function bbox(geom) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const walk = (c) => {
    if (typeof c[0] === "number") {
      if (c[0] < minX) minX = c[0];
      if (c[0] > maxX) maxX = c[0];
      if (c[1] < minY) minY = c[1];
      if (c[1] > maxY) maxY = c[1];
    } else c.forEach(walk);
  };
  walk(geom.coordinates);
  return { minX, minY, maxX, maxY };
}

function ringArea(ring) {
  let area = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    area += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
  }
  return Math.abs(area / 2);
}

function largestPolygonRing(geom) {
  if (!geom) return null;
  if (geom.type === "Polygon") return geom.coordinates?.[0] || null;
  if (geom.type === "MultiPolygon") {
    let best = null;
    let bestArea = -1;
    for (const poly of geom.coordinates || []) {
      const ring = poly?.[0];
      if (!ring) continue;
      const a = ringArea(ring);
      if (a > bestArea) {
        bestArea = a;
        best = ring;
      }
    }
    return best;
  }
  return null;
}

function labelPoint(geom) {
  const ring = largestPolygonRing(geom);
  if (ring?.length) {
    let sx = 0;
    let sy = 0;
    let n = 0;
    for (const pt of ring) {
      if (typeof pt?.[0] === "number" && typeof pt?.[1] === "number") {
        sx += pt[0];
        sy += pt[1];
        n += 1;
      }
    }
    if (n) return { lng: sx / n, lat: sy / n, area: ringArea(ring) };
  }
  const b = bbox(geom);
  return {
    lng: (b.minX + b.maxX) / 2,
    lat: (b.minY + b.maxY) / 2,
    area: Math.max(0, (b.maxX - b.minX) * (b.maxY - b.minY)),
  };
}

function computeLabels(geo) {
  const stateBox = {};
  const distByState = {};
  for (const f of geo.features) {
    const b = bbox(f.geometry);
    const st = f.properties.st_nm;
    const district = String(f.properties.district || "").trim();
    if (!st || !district) continue;

    const sb = (stateBox[st] ||= {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity,
    });
    sb.minX = Math.min(sb.minX, b.minX);
    sb.minY = Math.min(sb.minY, b.minY);
    sb.maxX = Math.max(sb.maxX, b.maxX);
    sb.maxY = Math.max(sb.maxY, b.maxY);

    const point = labelPoint(f.geometry);
    const list = (distByState[st] ||= []);
    const existing = list.find((d) => d.name === district);
    if (!existing) {
      list.push({ name: district, lat: point.lat, lng: point.lng, area: point.area });
    } else if (point.area > (existing.area || 0)) {
      existing.lat = point.lat;
      existing.lng = point.lng;
      existing.area = point.area;
    }
  }
  const stateLabels = Object.entries(stateBox).map(([name, b]) => ({
    name,
    lat: (b.minY + b.maxY) / 2,
    lng: (b.minX + b.maxX) / 2,
  }));
  return { stateLabels, distByState };
}

export default function AtlasMapPage() {
  const reducedMotion = useReducedMotion();
  const [geoData, setGeoData] = useState(null);
  const [level, setLevel] = useState("india");
  const [stateName, setStateName] = useState(null);
  const [districtName, setDistrictName] = useState(null);
  const [activeTemple, setActiveTemple] = useState(null);

  useEffect(() => {
    fetch("/atlas/india-districts.geojson")
      .then((r) => r.json())
      .then(setGeoData)
      .catch(() => {});
  }, []);

  const labels = useMemo(
    () => (geoData ? computeLabels(geoData) : { stateLabels: [], distByState: {} }),
    [geoData],
  );

  const currentState = stateName ? byName.get(stateName) : null;

  const templeDistricts = useMemo(() => {
    if (!currentState?.districts) return [];
    return currentState.districts
      .filter((d) => Array.isArray(d.temples) && d.temples.length > 0)
      .map((d) => ({
        name: d.name,
        count: d.temples.length,
        latitude: d.latitude,
        longitude: d.longitude,
      }));
  }, [currentState]);

  const templeDistrictNames = useMemo(
    () => new Set(templeDistricts.map((d) => d.name)),
    [templeDistricts],
  );
  const currentDistrict = useMemo(
    () => currentState?.districts?.find((d) => d.name === districtName) ?? null,
    [currentState, districtName],
  );
  const temples = currentDistrict?.temples ?? [];
  const districtLabels = stateName ? labels.distByState[stateName] ?? [] : [];

  function selectState(name) {
    setStateName(name);
    setDistrictName(null);
    setActiveTemple(null);
    setLevel("state");
  }
  function selectDistrict(name) {
    setDistrictName(name);
    setActiveTemple(null);
    setLevel("district");
  }
  function selectTemple(t) {
    setActiveTemple(t);
  }
  function back(target) {
    setActiveTemple(null);
    if (target === "india") {
      setLevel("india");
      setStateName(null);
      setDistrictName(null);
    } else if (target === "state") {
      setLevel("state");
      setDistrictName(null);
    }
  }

  function onFeatureClick(district, state) {
    if (level === "india") {
      selectState(state);
      return;
    }
    if (state !== stateName) {
      selectState(state);
      return;
    }
    if (level === "state") selectDistrict(district);
    else if (district !== districtName) selectDistrict(district);
  }

  return (
    <div
      className={`atlas-page ${level === "india" ? "is-map-only" : "has-sidebar"}${
        activeTemple ? " has-temple-sheet" : ""
      }`}
    >
      {level !== "india" && (
        <AtlasSidebar
          level={level}
          selectedStateName={stateName}
          selectedDistrictName={districtName}
          templeDistricts={templeDistricts}
          temples={temples}
          reducedMotion={reducedMotion}
          onSelectDistrict={selectDistrict}
          onSelectTemple={selectTemple}
          onBack={back}
        />
      )}

      <main className="atlas-map-area">
        {level === "india" && (
          <div className="atlas-map-brand" aria-label="GEO Jainism">
            <div className="atlas-map-brand__title">GEO JAINISM</div>
          </div>
        )}

        <div className="atlas-map-context">
          {level === "india" && <div className="atlas-map-context__title">Bharat</div>}
          <nav className="atlas-map-trail" aria-label="Map breadcrumb">
            {level === "india" ? (
              <span className="atlas-map-trail__current">Bharat</span>
            ) : (
              <>
                <button type="button" onClick={() => back("india")}>
                  Bharat
                </button>
                <span aria-hidden="true">›</span>
                {level === "district" ? (
                  <button type="button" onClick={() => back("state")}>
                    {stateName}
                  </button>
                ) : (
                  <span className="atlas-map-trail__current">{stateName}</span>
                )}
                {level === "district" && (
                  <>
                    <span aria-hidden="true">›</span>
                    <span className="atlas-map-trail__current">{districtName}</span>
                  </>
                )}
              </>
            )}
          </nav>
        </div>

        {level !== "india" && (
          <button
            className="atlas-home-btn"
            onClick={() => back("india")}
            type="button"
            aria-label="Back to Bharat"
            title="Back to Bharat"
          >
            <svg
              className="atlas-home-btn__icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M7.8 6.3H3.9V2.4" />
              <path d="M4.2 6.1A8.25 8.25 0 1 1 3.75 15" />
            </svg>
          </button>
        )}
        {!geoData && <div className="atlas-banner">Loading map…</div>}

        <IndiaMap
          geoData={geoData}
          level={level}
          selectedStateName={stateName}
          selectedDistrictName={districtName}
          templeDistrictNames={templeDistrictNames}
          flags={templeDistricts}
          temples={temples}
          stateLabels={labels.stateLabels}
          districtLabels={districtLabels}
          onFeatureClick={onFeatureClick}
          onSelectDistrict={selectDistrict}
          onTempleClick={selectTemple}
          onBack={back}
          reducedMotion={reducedMotion}
        />

        <AnimatePresence>
          {activeTemple && (
            <TempleDetail
              key={activeTemple.id}
              temple={activeTemple}
              reducedMotion={reducedMotion}
              onClose={() => setActiveTemple(null)}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
