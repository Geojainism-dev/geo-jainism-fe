import { useEffect, useMemo, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const CONFIGURED_MAP_STYLE = (import.meta.env.VITE_MAP_STYLE_URL || '').trim();
const MAPTILER_KEY = (import.meta.env.VITE_MAPTILER_KEY || '').trim();
const MAPTILER_STYLE_ID = (import.meta.env.VITE_MAPTILER_STYLE_ID || 'streets-v2').trim();

const FALLBACK_MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

// MapTiler is optional. With a key we try its coloured topographic style.
// If the key/style fails, we automatically fall back to OpenFreeMap Liberty
// so the map never stays blank.
const PREFERRED_MAP_STYLE = CONFIGURED_MAP_STYLE || (MAPTILER_KEY
  ? `https://api.maptiler.com/maps/${encodeURIComponent(MAPTILER_STYLE_ID)}/style.json?key=${encodeURIComponent(MAPTILER_KEY)}`
  : FALLBACK_MAP_STYLE);

// Full Bharat footprint incl. islands / far NE — used when GeoJSON bounds unavailable.
const INDIA_BOUNDS = [
  [66.5, 5.5],
  [99.5, 37.5],
];

const EMPTY_FILTER = ['==', ['get', '__empty__'], '1'];

const STATE_LABEL_POINTS = {
  'Andaman and Nicobar Islands': [92.78, 11.55],
  'Andhra Pradesh': [80.20, 15.75],
  'Arunachal Pradesh': [94.55, 28.10],
  Assam: [92.90, 26.18],
  Bihar: [85.45, 25.65],
  Chandigarh: [76.78, 30.73],
  Chhattisgarh: [82.05, 21.35],
  'Dadra and Nagar Haveli and Daman and Diu': [72.92, 20.42],
  Delhi: [77.10, 28.64],
  Goa: [74.03, 15.32],
  Gujarat: [71.50, 22.70],
  Haryana: [76.12, 29.12],
  'Himachal Pradesh': [77.33, 31.88],
  'Jammu and Kashmir': [75.20, 33.75],
  Jharkhand: [85.60, 23.62],
  Karnataka: [76.50, 14.72],
  Kerala: [76.45, 10.25],
  Ladakh: [78.65, 34.45],
  Lakshadweep: [72.62, 10.55],
  'Madhya Pradesh': [78.02, 23.50],
  Maharashtra: [76.25, 19.25],
  Manipur: [93.95, 24.72],
  Meghalaya: [91.36, 25.58],
  Mizoram: [92.88, 23.32],
  Nagaland: [94.35, 26.10],
  Odisha: [84.60, 20.40],
  Puducherry: [79.78, 11.95],
  Punjab: [75.28, 31.02],
  Rajasthan: [73.80, 26.80],
  Sikkim: [88.50, 27.48],
  'Tamil Nadu': [78.60, 11.10],
  Telangana: [79.05, 17.88],
  Tripura: [91.72, 23.82],
  'Uttar Pradesh': [80.82, 26.88],
  Uttarakhand: [79.18, 30.08],
  'West Bengal': [87.85, 23.45],
};

const STATE_LABEL_DISPLAY = {
  'Dadra and Nagar Haveli and Daman and Diu': 'Dadra & Nagar Haveli\nDaman & Diu',
  'Andaman and Nicobar Islands': 'Andaman &\nNicobar Islands',
  'Jammu and Kashmir': 'Jammu & Kashmir',
};

const SMALL_STATE_LABELS = new Set([
  'Chandigarh', 'Delhi', 'Goa', 'Sikkim', 'Puducherry', 'Lakshadweep',
  'Dadra and Nagar Haveli and Daman and Diu', 'Andaman and Nicobar Islands',
  'Tripura', 'Mizoram', 'Manipur', 'Nagaland', 'Meghalaya',
]);

function withStateData(stateGeoData) {
  if (!stateGeoData?.features) return null;
  return {
    type: 'FeatureCollection',
    features: stateGeoData.features.map((feature) => {
      const stateName = feature.properties?.st_nm || feature.properties?.name || '';
      return {
        ...feature,
        properties: {
          ...feature.properties,
          st_nm: stateName,
        },
      };
    }),
  };
}

function withDistrictData(geoData, selectedStateName, templeDistrictNames) {
  if (!geoData?.features) return null;
  return {
    type: 'FeatureCollection',
    features: geoData.features.map((feature) => {
      const stateName = feature.properties?.st_nm || '';
      const districtName = feature.properties?.district || '';
      const isSelectedState = selectedStateName ? stateName === selectedStateName : false;
      return {
        ...feature,
        properties: {
          ...feature.properties,
          st_nm: stateName,
          district: districtName,
          hasTemples: isSelectedState && (templeDistrictNames?.has(districtName) || false),
        },
      };
    }),
  };
}

function walkCoords(coords, bounds) {
  if (!Array.isArray(coords)) return;
  if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
    const [lng, lat] = coords;
    bounds.minLng = Math.min(bounds.minLng, lng);
    bounds.maxLng = Math.max(bounds.maxLng, lng);
    bounds.minLat = Math.min(bounds.minLat, lat);
    bounds.maxLat = Math.max(bounds.maxLat, lat);
    bounds.count += 1;
    return;
  }
  coords.forEach((child) => walkCoords(child, bounds));
}

function featureBounds(features) {
  const bounds = { minLng: Infinity, minLat: Infinity, maxLng: -Infinity, maxLat: -Infinity, count: 0 };
  features.forEach((feature) => walkCoords(feature.geometry?.coordinates, bounds));
  if (!bounds.count) return null;
  if (bounds.minLng === bounds.maxLng || bounds.minLat === bounds.maxLat) return null;
  return [
    [bounds.minLng, bounds.minLat],
    [bounds.maxLng, bounds.maxLat],
  ];
}

function expandBounds(bounds, fraction = 0.08) {
  if (!bounds) return null;
  const [[west, south], [east, north]] = bounds;
  const padX = Math.max((east - west) * fraction, 0.02);
  const padY = Math.max((north - south) * fraction, 0.02);
  return [
    [west - padX, south - padY],
    [east + padX, north + padY],
  ];
}

function namesMatch(a, b) {
  return String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();
}

function bboxCenter(feature) {
  const bounds = featureBounds([feature]);
  if (!bounds) return null;
  return [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2];
}

/** Padding based on real overlay chrome + map container size. */
function getFitPadding(map, level = 'india') {
  const el = map?.getContainer?.();
  const area = el?.closest?.('.atlas-map-area') || el?.parentElement;
  const w = Math.max(el?.clientWidth || window.innerWidth || 320, 160);
  const h = Math.max(el?.clientHeight || window.innerHeight || 320, 160);

  const measureBottom = (node) => {
    if (!node || !(node instanceof HTMLElement)) return 0;
    if (getComputedStyle(node).display === 'none') return 0;
    return node.offsetTop + node.offsetHeight;
  };

  const brandBottom = measureBottom(area?.querySelector('.atlas-map-brand'));
  const homeBottom = measureBottom(area?.querySelector('.atlas-home-btn'));
  const contextBottom = measureBottom(area?.querySelector('.atlas-map-context'));
  const topChrome = Math.max(brandBottom, homeBottom, contextBottom, 24) + 10;

  const compact = w <= 720 || h <= 560;
  // Bharat: modest padding so the full country fits edge-to-edge of the usable area.
  if (level === 'india') {
    const top = Math.min(Math.max(topChrome, compact ? 52 : 64), Math.floor(h * 0.11));
    const side = compact ? 10 : 28;
    const bottom = compact ? 40 : 44;
    return { top, right: side, bottom, left: side };
  }

  // State / district: tight padding so the selected geography fills the frame.
  const homeOnlyTop = Math.max(homeBottom + 8, compact ? 48 : 56);
  const desired = {
    top: Math.min(homeOnlyTop, Math.floor(h * 0.12)),
    right: compact ? 10 : 16,
    bottom: compact ? 28 : 32,
    left: compact ? 10 : 16,
  };

  const maxX = Math.max(8, Math.floor(w * 0.12));
  const maxY = Math.max(8, Math.floor(h * 0.14));

  return {
    top: Math.min(desired.top, maxY),
    bottom: Math.min(desired.bottom, maxY),
    left: Math.min(desired.left, maxX),
    right: Math.min(desired.right, maxX),
  };
}

function cameraForLevel(level, bounds) {
  if (level === 'district') {
    return { maxZoom: 13.2, minZoom: 7.6 };
  }
  if (level === 'state') {
    const span = bounds
      ? Math.max(bounds[1][0] - bounds[0][0], bounds[1][1] - bounds[0][1])
      : 8;
    // Zoom in enough that the selected state fills the map (neighbors crop out).
    if (span > 8) return { maxZoom: 8.6, minZoom: 5.2 }; // RJ / MP class
    if (span > 5.5) return { maxZoom: 9.8, minZoom: 5.8 }; // TN / MH class
    return { maxZoom: 11.2, minZoom: 6.4 }; // smaller states / UTs
  }
  return { maxZoom: 5.2, minZoom: 1.8 };
}

/**
 * Resolve geographic bounds for the current navigation level.
 */
function resolveFitBounds(level, map, stateSourceData, districtSourceData, selectedStateName, selectedDistrictName) {
  let bounds = INDIA_BOUNDS;
  if (level === 'india' && stateSourceData?.features?.length) {
    // Full state polygons (incl. islands) so nothing is clipped on any screen.
    bounds = expandBounds(featureBounds(stateSourceData.features), 0.04) || INDIA_BOUNDS;
  }
  if (level === 'state' && selectedStateName && stateSourceData?.features) {
    const features = stateSourceData.features.filter((f) => namesMatch(f.properties?.st_nm, selectedStateName));
    // Minimal pad so the state fills the frame (neighbors crop away).
    bounds = expandBounds(featureBounds(features), 0.012) || INDIA_BOUNDS;
  }
  if (level === 'district' && selectedStateName && selectedDistrictName && districtSourceData?.features) {
    const features = districtSourceData.features.filter(
      (f) => namesMatch(f.properties?.st_nm, selectedStateName)
        && namesMatch(f.properties?.district, selectedDistrictName),
    );
    bounds = expandBounds(featureBounds(features), 0.06) || INDIA_BOUNDS;
  }
  return bounds;
}

/**
 * Fit camera so the target bounds are fully visible (contain) on this screen.
 */
function fitMapToBounds(map, bounds, { level, reducedMotion = false } = {}) {
  if (!map || !bounds) return;
  const { maxZoom, minZoom } = cameraForLevel(level, bounds);
  const padding = getFitPadding(map, level);
  const duration = reducedMotion ? 0 : 320;
  const easing = (t) => 1 - (1 - t) ** 2;

  try {
    map.resize();
    map.stop();
    map.fitBounds(bounds, {
      padding,
      duration,
      easing,
      maxZoom,
      minZoom,
      essential: true,
    });
  } catch {
    // Ignore transient fit errors during rapid layout changes.
  }
}

function setVisibility(map, ids, visible) {
  ids.forEach((id) => {
    if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none');
  });
}

function setFilter(map, ids, filter) {
  const layerIds = Array.isArray(ids) ? ids : [ids];
  layerIds.forEach((id) => {
    if (map.getLayer(id)) map.setFilter(id, filter || EMPTY_FILTER);
  });
}

function stateFilter(stateName) {
  return stateName ? ['==', ['get', 'st_nm'], stateName] : EMPTY_FILTER;
}

function districtFilter(stateName, districtName) {
  return stateName && districtName
    ? ['all', ['==', ['get', 'st_nm'], stateName], ['==', ['get', 'district'], districtName]]
    : EMPTY_FILTER;
}

function makeStateLabelData(stateSourceData) {
  if (!stateSourceData?.features) return { type: 'FeatureCollection', features: [] };

  return {
    type: 'FeatureCollection',
    features: stateSourceData.features
      .map((feature) => {
        const name = feature.properties?.st_nm || feature.properties?.name;
        if (!name) return null;
        const coords = STATE_LABEL_POINTS[name] || bboxCenter(feature);
        if (!coords) return null;
        const isSmall = SMALL_STATE_LABELS.has(name);
        return {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: coords },
          properties: {
            st_nm: name,
            label: STATE_LABEL_DISPLAY[name] || name,
            textSize: isSmall ? 9.2 : 11.0,
          },
        };
      })
      .filter(Boolean),
  };
}

function makeDistrictLabelData(districtLabels, selectedStateName) {
  if (!Array.isArray(districtLabels)) return { type: 'FeatureCollection', features: [] };

  // One label per district name (guards MultiPolygon / duplicate features).
  const byName = new Map();
  districtLabels.forEach((d) => {
    const name = String(d.name || '').trim();
    if (!name) return;
    const lng = Number(d.lng);
    const lat = Number(d.lat);
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;
    const prev = byName.get(name);
    // Prefer the entry with larger area hint when provided.
    if (!prev || Number(d.area || 0) > Number(prev.area || 0)) {
      byName.set(name, { name, lng, lat, area: Number(d.area || 0) });
    }
  });

  return {
    type: 'FeatureCollection',
    features: [...byName.values()].map((d) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [d.lng, d.lat] },
      properties: {
        st_nm: selectedStateName || '',
        district: d.name,
        label: d.name,
        sortKey: -d.area,
      },
    })),
  };
}

function makeFlagSourceData(flags) {
  if (!Array.isArray(flags)) return { type: 'FeatureCollection', features: [] };
  return {
    type: 'FeatureCollection',
    features: flags
      .map((flag) => ({
        ...flag,
        longitude: Number(flag.longitude),
        latitude: Number(flag.latitude),
      }))
      .filter((flag) => Number.isFinite(flag.longitude) && Number.isFinite(flag.latitude))
      .map((flag) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [flag.longitude, flag.latitude] },
        properties: {
          district: flag.name,
          name: flag.name,
          count: Number(flag.count || 0),
        },
      })),
  };
}

function makeTempleSourceData(temples) {
  if (!Array.isArray(temples)) return { type: 'FeatureCollection', features: [] };
  return {
    type: 'FeatureCollection',
    features: temples
      .map((temple) => ({
        ...temple,
        longitude: Number(temple.longitude),
        latitude: Number(temple.latitude),
      }))
      .filter((temple) => Number.isFinite(temple.longitude) && Number.isFinite(temple.latitude))
      .map((temple) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [temple.longitude, temple.latitude] },
        properties: {
          id: String(temple.id),
          name: temple.name,
        },
      })),
  };
}

// Official Jain flag cloth: Red → Yellow → White → Green → Black.
const JAIN_FLAG_STRIPES = ['#e30613', '#ffd100', '#ffffff', '#009639', '#000000'];
const JAIN_EMBLEM_URL = '/atlas/images/jain-emblem.png';

let jainEmblemPromise = null;

function punchBlackToAlpha(img) {
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  for (let i = 0; i < pixels.length; i += 4) {
    // Treat near-black as transparent so the emblem sits on flag stripes.
    if (pixels[i] < 36 && pixels[i + 1] < 36 && pixels[i + 2] < 36) {
      pixels[i + 3] = 0;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

function loadJainEmblem() {
  if (!jainEmblemPromise) {
    jainEmblemPromise = new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        try {
          resolve(punchBlackToAlpha(img));
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = JAIN_EMBLEM_URL;
    });
  }
  return jainEmblemPromise;
}

function drawCenteredEmblem(ctx, emblem, boxX, boxY, boxW, boxH, padRatio = 0.1) {
  if (!emblem) return;
  const padX = boxW * padRatio;
  const padY = boxH * padRatio;
  const maxW = Math.max(1, boxW - padX * 2);
  const maxH = Math.max(1, boxH - padY * 2);
  const scale = Math.min(maxW / emblem.width, maxH / emblem.height);
  const drawW = emblem.width * scale;
  const drawH = emblem.height * scale;
  const dx = boxX + (boxW - drawW) / 2;
  const dy = boxY + (boxH - drawH) / 2;
  ctx.drawImage(emblem, dx, dy, drawW, drawH);
}

function drawFlagCloth(ctx, x, y, clothWidth, clothHeight, emblem, { withEmblem = true } = {}) {
  const stripeHeight = clothHeight / JAIN_FLAG_STRIPES.length;
  JAIN_FLAG_STRIPES.forEach((color, index) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y + index * stripeHeight, clothWidth, stripeHeight + 0.5);
  });
  if (withEmblem) {
    drawCenteredEmblem(ctx, emblem, x, y, clothWidth, clothHeight, 0.08);
  }
  ctx.strokeStyle = 'rgba(42, 33, 24, 0.38)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, clothWidth, clothHeight);
}

async function addJainFlagImage(map) {
  const imageId = 'jain-flag-icon';
  if (map.hasImage(imageId)) return;

  const emblem = await loadJainEmblem();
  if (map.hasImage(imageId)) return;

  const pixelRatio = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const width = 54;
  const height = 62;
  const canvas = document.createElement('canvas');
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  const ctx = canvas.getContext('2d');
  ctx.scale(pixelRatio, pixelRatio);

  ctx.shadowColor = 'rgba(42, 33, 24, 0.28)';
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = 3;

  ctx.fillStyle = '#6b4f2a';
  ctx.fillRect(10, 6, 3, 48);
  ctx.beginPath();
  ctx.arc(11.5, 55, 3.4, 0, Math.PI * 2);
  ctx.fill();

  const x = 13;
  const y = 7;
  const clothWidth = 34;
  const clothHeight = 26;

  ctx.fillStyle = 'rgba(0,0,0,0.14)';
  ctx.fillRect(x - 1, y - 1, clothWidth + 2, clothHeight + 2);
  ctx.shadowColor = 'transparent';
  drawFlagCloth(ctx, x, y, clothWidth, clothHeight, emblem, { withEmblem: true });

  map.addImage(imageId, ctx.getImageData(0, 0, canvas.width, canvas.height), { pixelRatio });
}

async function addTempleImage(map) {
  const imageId = 'jain-temple-icon';
  if (map.hasImage(imageId)) return;

  const emblem = await loadJainEmblem();
  if (map.hasImage(imageId)) return;

  const pixelRatio = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const size = 72;
  const canvas = document.createElement('canvas');
  canvas.width = size * pixelRatio;
  canvas.height = size * pixelRatio;
  const ctx = canvas.getContext('2d');
  ctx.scale(pixelRatio, pixelRatio);

  // Soft circular gold node, matching the approved editorial map treatment.
  const glow = ctx.createRadialGradient(36, 38, 7, 36, 38, 33);
  glow.addColorStop(0, 'rgba(183, 126, 24, 0.34)');
  glow.addColorStop(1, 'rgba(183, 126, 24, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(36, 38, 33, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowColor = 'rgba(71, 48, 13, 0.25)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = 'rgba(255, 253, 247, 0.98)';
  ctx.strokeStyle = '#a87318';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(36, 36, 23, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.shadowColor = 'transparent';

  // Small temple silhouette.
  ctx.fillStyle = '#8b5e0a';
  ctx.beginPath();
  ctx.moveTo(36, 18);
  ctx.lineTo(41, 25);
  ctx.lineTo(31, 25);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#7a1f2b';
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(28, 31);
  ctx.lineTo(36, 24);
  ctx.lineTo(44, 31);
  ctx.lineTo(42, 31);
  ctx.lineTo(42, 47);
  ctx.lineTo(30, 47);
  ctx.lineTo(30, 31);
  ctx.closePath();
  ctx.stroke();

  ctx.fillStyle = '#7a1f2b';
  ctx.fillRect(34, 38, 4, 9);
  ctx.strokeStyle = '#a87318';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(26, 47);
  ctx.lineTo(46, 47);
  ctx.moveTo(24, 51);
  ctx.lineTo(48, 51);
  ctx.stroke();

  // Miniature Jain flag on the temple roof.
  ctx.strokeStyle = '#6b4f2a';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(41, 24);
  ctx.lineTo(41, 15);
  ctx.stroke();
  const flagX = 42;
  const flagY = 15;
  const flagW = 12;
  const flagH = 10;
  drawFlagCloth(ctx, flagX, flagY, flagW, flagH, emblem, { withEmblem: true });

  map.addImage(imageId, ctx.getImageData(0, 0, canvas.width, canvas.height), { pixelRatio });
}

/** Our GeoJSON / marker layers — never treated as MapTiler/OSM clutter. */
const OWNED_MAP_LAYERS = new Set([
  'state-fill', 'state-line', 'selected-state-fill', 'selected-state-line',
  'district-fill', 'district-line', 'selected-district-fill', 'selected-district-line',
  'state-label', 'district-label',
  'jain-flag-symbol', 'jain-flag-count-circle', 'jain-flag-count-label',
  'temple-clusters', 'temple-cluster-count-circle', 'temple-cluster-count', 'temple-symbol',
  'temple-spider-lines', 'temple-spider-symbol',
]);

const FLAG_LAYERS = [
  'jain-flag-symbol', 'jain-flag-count-circle', 'jain-flag-count-label',
];

const TEMPLE_MARKER_LAYERS = [
  'temple-clusters', 'temple-cluster-count-circle', 'temple-cluster-count', 'temple-symbol',
  'temple-spider-lines', 'temple-spider-symbol',
];

const TEMPLE_CLUSTER_LAYERS = [
  'temple-clusters', 'temple-cluster-count-circle', 'temple-cluster-count',
];

const EMPTY_FC = { type: 'FeatureCollection', features: [] };

/** Fan temples around a cluster centre in screen space (works for identical coords). */
function buildSpiderGeoJSON(map, centerLngLat, temples) {
  if (!map || !Array.isArray(temples) || !temples.length) {
    return { points: EMPTY_FC, lines: EMPTY_FC };
  }
  const center = map.project(centerLngLat);
  const n = temples.length;
  const radiusPx = Math.min(92, 34 + n * 7);
  const points = [];
  const lines = [];

  temples.forEach((temple, index) => {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    const screen = {
      x: center.x + radiusPx * Math.cos(angle),
      y: center.y + radiusPx * Math.sin(angle),
    };
    const lngLat = map.unproject(screen);
    const coords = [lngLat.lng, lngLat.lat];
    points.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: coords },
      properties: {
        id: String(temple.id),
        name: temple.name || 'Mandir',
      },
    });
    lines.push({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [centerLngLat, coords],
      },
      properties: { id: String(temple.id) },
    });
  });

  return {
    points: { type: 'FeatureCollection', features: points },
    lines: { type: 'FeatureCollection', features: lines },
  };
}

/** MapTiler streets-v2 uses "City labels" / "Highway" / "Shopping"; OpenFreeMap uses label_*. */
function classifyBasemapSymbol(layerId) {
  const id = String(layerId || '').toLowerCase();
  // Exact owned ids (e.g. state-label) must not match provider "State labels".
  if (OWNED_MAP_LAYERS.has(layerId)) {
    return {
      isRoadLabel: false,
      isSettlement: false,
      isWaterLabel: false,
      isProviderState: false,
      isPoi: false,
      isNoise: false,
      isOwned: true,
    };
  }
  const isRoadLabel = /(highway[\s_-]?name|highway[\s_-]?shield|highway[\s_-]?junction|road[\s_-]?shield|road[\s_-]?one[\s_-]?way|road[\s_-]?labels?|road[\s_-]?name|street[\s_-]?name|bridge[\s_-]?name)/.test(id);
  const isSettlement = /(label_city|label_town|label_village|label_other|place[\s_-]?labels?|place_city|place_town|place_village|place_suburb|place_hamlet|place_neighbourhood|settlement|town[\s_-]?labels?|city[\s_-]?labels?|capital[\s_-]?city|village[\s_-]?labels?|hamlet)/.test(id);
  const isWaterLabel = /(water_name|waterway_line_label|water[\s_-]?labels?|lake[\s_-]?labels?|river[\s_-]?labels?|ocean[\s_-]?labels?)/.test(id);
  // Prefer MapTiler's spaced id "state labels" / OpenFreeMap label_state — not our "state-label".
  const isProviderState = (
    id === 'state labels'
    || /(label_state|place_state|^state[\s_]labels?$)/.test(id)
  ) && !isSettlement;
  // MapTiler streets-v2 POI layers (fuel is under Transport). House numbers stay off.
  const isHouseNumber = /housenumber/.test(id);
  const isPoi = !isHouseNumber && /(^poi_|\/poi|^shopping$|^transport$|^food$|^healthcare$|^education$|^tourism$|^culture$|^park$|^public$|^sport$|^station$|airport|fuel|petrol|amenity|gondola|^ferry$|^oneway$)/.test(id);
  const isNoise = isHouseNumber || (
    /(label_country|country[\s_-]?labels?|province|admin|boundary|continent)/.test(id)
    && !isSettlement
    && !isProviderState
    && !isRoadLabel
    && !isWaterLabel
    && !isPoi
  );
  return { isRoadLabel, isSettlement, isWaterLabel, isProviderState, isPoi, isNoise, isOwned: false };
}

/** Hide only country/admin noise — keep roads, places, POIs for every state/district. */
function simplifyBasemap(map) {
  const layers = map.getStyle()?.layers || [];
  layers.forEach((layer) => {
    if (!map.getLayer(layer.id) || OWNED_MAP_LAYERS.has(layer.id)) return;
    if (layer.type !== 'symbol') return;
    const { isProviderState, isNoise, isSettlement, isRoadLabel, isPoi, isWaterLabel } = classifyBasemapSymbol(layer.id);
    if (isSettlement || isRoadLabel || isPoi || isWaterLabel) return;
    if (isProviderState || isNoise) {
      try {
        map.setLayoutProperty(layer.id, 'visibility', 'none');
      } catch {
        // ignore
      }
    }
  });
}

/** Our state / district names — must stay instant (never wait on MapTiler boosts). */
function syncOwnedLabels(map, level) {
  if (!map) return;
  const zoom = Number(map.getZoom()) || 0;
  const wideView = zoom < 6.45;
  setVisibility(map, ['state-label'], level === 'india' || (level === 'district' && wideView));
  // Dense-state clarity: no GeoJSON district-name forest. Bubbles carry the story.
  setVisibility(map, ['district-label'], false);
}

/**
 * Same basemap detail for every state / district when zoomed in:
 * places, roads/NH, and all MapTiler POI groups (not only Shopping/Transport).
 */
function syncProviderLabelVisibility(map, layerIds, level) {
  if (!map) return;
  const zoom = Number(map.getZoom()) || 0;
  const wideView = zoom < 6.45;
  const detailView = zoom >= 6.8;
  const streetView = zoom >= 12;

  // Always read live style layers so we never miss Food/Healthcare/Education/etc.
  const ids = new Set(layerIds || []);
  (map.getStyle()?.layers || []).forEach((layer) => {
    if (layer.type === 'symbol') ids.add(layer.id);
  });

  ids.forEach((layerId) => {
    if (!map.getLayer(layerId) || OWNED_MAP_LAYERS.has(layerId)) return;
    const {
      isRoadLabel, isSettlement, isWaterLabel, isProviderState, isPoi, isNoise,
    } = classifyBasemapSymbol(layerId);

    if (level === 'india' || isProviderState || isNoise) {
      map.setLayoutProperty(layerId, 'visibility', 'none');
      return;
    }

    if (level === 'state') {
      const show = isWaterLabel
        || (detailView && (isRoadLabel || isSettlement))
        || (streetView && isPoi);
      map.setLayoutProperty(layerId, 'visibility', show ? 'visible' : 'none');
      return;
    }

    // District — full local atlas for every district the same way.
    if (wideView) {
      map.setLayoutProperty(layerId, 'visibility', (isWaterLabel || isSettlement) ? 'visible' : 'none');
      return;
    }
    const show = isRoadLabel || isSettlement || isWaterLabel || isPoi;
    map.setLayoutProperty(layerId, 'visibility', show ? 'visible' : 'none');
  });
}

function syncMapLabels(map, layerIds, level, { boost = false } = {}) {
  if (!map) return;
  syncOwnedLabels(map, level);
  syncProviderLabelVisibility(map, layerIds, level);
  syncOwnedLabels(map, level);
  if (boost && (level === 'state' || level === 'district')) {
    applyBasemapLabelBoost(map, level);
  }
}

/** One-shot / zoomend boost — do NOT call on every zoom frame (freezes labels). */
let basemapBoostAppliedFor = '';

/** Full MapTiler streets-v2 POI set — all categories except house numbers. */
const MAPTILER_POI_LAYER_IDS = [
  'Shopping', 'Transport', 'Food', 'Healthcare', 'Education',
  'Tourism', 'Culture', 'Park', 'Public', 'Sport', 'Station',
  'Airport', 'Airport gate',
];

function applyBasemapLabelBoost(map, level) {
  if (!map || (level !== 'state' && level !== 'district')) return;
  const zoom = Number(map.getZoom()) || 0;
  const key = `${level}|${zoom >= 14 ? 'street' : zoom >= 9 ? 'close' : zoom >= 7.5 ? 'mid' : 'far'}`;
  const skipHeavy = basemapBoostAppliedFor === key;

  const settlementIds = [
    'label_city', 'label_city_capital', 'label_town', 'label_village', 'label_other',
    'City labels', 'Capital city labels', 'Town labels', 'Place labels',
  ];
  const roadIds = [
    'Highway shield', 'Highway shield (US)', 'Highway junction', 'Road labels',
    'highway-shield-non-us', 'highway-name-major', 'highway-name-minor',
    'Gondola', 'Ferry', 'Oneway',
  ];

  settlementIds.forEach((id) => {
    if (!map.getLayer(id)) return;
    try {
      map.setLayoutProperty(id, 'visibility', 'visible');
      if (skipHeavy) return;
      const lower = id.toLowerCase();
      const minz = /village|place[\s_-]?labels?/.test(lower) ? 5.5 : /town/.test(lower) ? 5.0 : 4.0;
      map.setLayerZoomRange(id, minz, 24);
      map.setLayoutProperty(id, 'text-optional', false);
      if (zoom >= 7.5) {
        map.setLayoutProperty(id, 'text-allow-overlap', true);
        map.setLayoutProperty(id, 'text-ignore-placement', zoom >= 9);
      }
      map.setPaintProperty(id, 'text-opacity', 1);
      map.setPaintProperty(id, 'text-color', '#3f3428');
      map.setPaintProperty(id, 'text-halo-color', 'rgba(255, 252, 244, 0.97)');
      map.setPaintProperty(id, 'text-halo-width', 1.7);
    } catch { /* ignore */ }
  });

  roadIds.forEach((id) => {
    if (!map.getLayer(id)) return;
    try {
      map.setLayoutProperty(id, 'visibility', 'visible');
      if (skipHeavy) return;
      const lower = id.toLowerCase();
      if (/shield|junction/.test(lower)) {
        map.setLayerZoomRange(id, level === 'district' ? 6.5 : 7.2, 24);
      } else {
        map.setLayerZoomRange(id, level === 'district' ? 6.5 : 8.0, 24);
      }
      // Allow street names to paint in every district (collision was wiping them outside Jaipur).
      if (zoom >= 11) {
        map.setLayoutProperty(id, 'text-allow-overlap', true);
        map.setLayoutProperty(id, 'text-ignore-placement', zoom >= 14);
        map.setLayoutProperty(id, 'text-padding', 1);
      }
      map.setPaintProperty(id, 'text-opacity', 1);
    } catch { /* ignore */ }
  });

  MAPTILER_POI_LAYER_IDS.forEach((id) => {
    if (!map.getLayer(id)) return;
    try {
      const minz = id === 'Station' ? 11 : 12;
      map.setLayoutProperty(id, 'visibility', zoom >= minz - 1 ? 'visible' : 'none');
      if (skipHeavy) return;
      map.setLayerZoomRange(id, minz, 24);
      map.setLayoutProperty(id, 'icon-allow-overlap', true);
      map.setLayoutProperty(id, 'text-optional', true);
      if (zoom >= 13) {
        map.setLayoutProperty(id, 'text-allow-overlap', false);
      }
    } catch { /* ignore */ }
  });

  // Explicitly keep house numbers off.
  if (map.getLayer('Housenumber')) {
    try { map.setLayoutProperty('Housenumber', 'visibility', 'none'); } catch { /* ignore */ }
  }

  if (map.getLayer('Building')) {
    try {
      map.setLayoutProperty('Building', 'visibility', 'visible');
      if (!skipHeavy) map.setLayerZoomRange('Building', 13, 24);
    } catch { /* ignore */ }
  }

  basemapBoostAppliedFor = key;
}

/**
 * MapTiler "Minor road" is pure white — invisible on our parchment canvas in
 * rural districts (e.g. Barwani / Bawangaja). Retint + clear district wash at
 * street zoom so roads/paths actually read.
 */
function setRoadLineEmphasis(map, level) {
  const layers = map.getStyle()?.layers || [];
  const local = level === 'district' || level === 'state';
  const zoom = Number(map.getZoom()) || 0;

  layers.forEach((layer) => {
    if (layer.type !== 'line' || !map.getLayer(layer.id) || OWNED_MAP_LAYERS.has(layer.id)) return;
    const id = layer.id.toLowerCase();
    if (!/(road|highway|motorway|trunk|primary|secondary|tertiary|street|bridge|tunnel|path|footway)/.test(id)) return;
    if (/(boundary|admin)/.test(id)) return;
    if (/river|water|stream|canal/.test(id) && !/road|highway/.test(id)) return;

    try {
      map.setLayoutProperty(layer.id, 'visibility', 'visible');

      if (!local) {
        map.setPaintProperty(layer.id, 'line-opacity', 0.5);
        return;
      }

      map.setPaintProperty(layer.id, 'line-opacity', 1);

      // White minor roads / pale paths → warm visible strokes on parchment.
      if (id === 'minor road' || id.endsWith('minor road')) {
        map.setPaintProperty(layer.id, 'line-color', '#f8f2e6');
      } else if (id.includes('minor road outline')) {
        map.setPaintProperty(layer.id, 'line-color', '#9a8668');
      } else if (id === 'path' || id === 'path minor' || id.startsWith('path ') || id.includes('footway')) {
        if (!id.includes('outline')) {
          map.setPaintProperty(layer.id, 'line-color', '#8a7a62');
        } else {
          map.setPaintProperty(layer.id, 'line-color', '#c4b498');
        }
      } else if (id === 'major road' || id === 'highway') {
        // Keep MapTiler yellows readable; slight opacity already 1.
      }

      if (level === 'district' && zoom >= 12 && !id.includes('outline')) {
        // Slightly thicker so thin rural tracks don't disappear.
        try {
          const current = map.getPaintProperty(layer.id, 'line-width');
          if (typeof current === 'number') {
            map.setPaintProperty(layer.id, 'line-width', Math.max(current, 1.25));
          }
        } catch { /* data-driven width — leave as-is */ }
      }
    } catch {
      // Some styles use data-driven paint; skip rather than crash.
    }
  });

  // At street zoom, drop the gold district wash so basemap roads aren't veiled.
  if (map.getLayer('selected-district-fill')) {
    try {
      map.setPaintProperty(
        'selected-district-fill',
        'fill-opacity',
        level === 'district' && zoom >= 11 ? 0 : 0.12,
      );
    } catch { /* ignore */ }
  }
  if (map.getLayer('district-fill')) {
    try {
      map.setPaintProperty(
        'district-fill',
        'fill-opacity',
        level === 'district' && zoom >= 11 ? 0 : 0.025,
      );
    } catch { /* ignore */ }
  }
}

function addMapLayers(map) {
  map.addLayer({
    id: 'state-fill',
    type: 'fill',
    source: 'states',
    paint: {
      // Neutral and nearly transparent: no state is highlighted based on temple data.
      'fill-color': '#f4efe5',
      'fill-opacity': 0.015,
    },
  });

  map.addLayer({
    id: 'state-line',
    type: 'line',
    source: 'states',
    paint: {
      'line-color': '#9f9588',
      'line-opacity': 0.62,
      'line-width': ['interpolate', ['linear'], ['zoom'], 3, 0.65, 5.5, 1.15, 8, 1.8],
      'line-blur': 0.1,
    },
  });

  map.addLayer({
    id: 'selected-state-fill',
    type: 'fill',
    source: 'states',
    filter: EMPTY_FILTER,
    layout: { visibility: 'none' },
    paint: {
      'fill-color': '#d5b66f',
      'fill-opacity': 0.055,
    },
  });

  map.addLayer({
    id: 'selected-state-line',
    type: 'line',
    source: 'states',
    filter: EMPTY_FILTER,
    layout: { visibility: 'none' },
    paint: {
      'line-color': '#8b5e0a',
      'line-opacity': 0.92,
      'line-width': ['interpolate', ['linear'], ['zoom'], 4, 1.8, 8, 3.4, 11, 4.8],
      'line-blur': 0.15,
    },
  });

  map.addLayer({
    id: 'district-fill',
    type: 'fill',
    source: 'districts',
    filter: EMPTY_FILTER,
    layout: { visibility: 'none' },
    paint: {
      // Districts remain neutral; Jain flags communicate temple availability.
      'fill-color': '#f2eadc',
      'fill-opacity': 0.025,
    },
  });

  map.addLayer({
    id: 'district-line',
    type: 'line',
    source: 'districts',
    filter: EMPTY_FILTER,
    layout: { visibility: 'none' },
    paint: {
      'line-color': '#9a8b74',
      'line-opacity': 0.88,
      'line-width': ['interpolate', ['linear'], ['zoom'], 5, 0.7, 7, 1.15, 9, 1.7, 11, 2.1],
    },
  });

  map.addLayer({
    id: 'selected-district-fill',
    type: 'fill',
    source: 'districts',
    filter: EMPTY_FILTER,
    layout: { visibility: 'none' },
    paint: {
      'fill-color': '#d8b66a',
      'fill-opacity': 0.12,
    },
  });

  map.addLayer({
    id: 'selected-district-line',
    type: 'line',
    source: 'districts',
    filter: EMPTY_FILTER,
    layout: { visibility: 'none' },
    paint: {
      'line-color': '#7a1f2b',
      'line-opacity': 0.95,
      'line-width': ['interpolate', ['linear'], ['zoom'], 7, 2.1, 11, 4.2],
    },
  });

  map.addLayer({
    id: 'state-label',
    type: 'symbol',
    source: 'state-labels',
    layout: {
      'text-field': ['get', 'label'],
      'text-font': ['Noto Sans Regular'],
      'text-size': ['get', 'textSize'],
      'text-letter-spacing': 0.05,
      'text-padding': 4,
      'text-max-width': 9,
      'text-allow-overlap': true,
      'text-ignore-placement': true,
    },
    paint: {
      'text-color': '#5f5548',
      'text-halo-color': 'rgba(255, 253, 247, 0.94)',
      'text-halo-width': 1.45,
      'text-halo-blur': 0.3,
    },
  });

  map.addLayer({
    id: 'district-label',
    type: 'symbol',
    source: 'district-labels',
    minzoom: 0,
    layout: {
      visibility: 'none',
      'text-field': ['get', 'label'],
      'text-font': ['Noto Sans Regular'],
      'text-size': ['interpolate', ['linear'], ['zoom'], 4, 8, 5.5, 9, 7, 10.5, 9, 12],
      'text-letter-spacing': 0.02,
      'text-padding': 2,
      'text-max-width': 7,
      'text-allow-overlap': true,
      'text-ignore-placement': true,
      'symbol-sort-key': ['get', 'sortKey'],
    },
    paint: {
      'text-color': '#5a4e3f',
      'text-halo-color': 'rgba(255, 253, 247, 0.96)',
      'text-halo-width': 1.5,
      'text-halo-blur': 0.2,
    },
  });

  // State overview: Jain flags + count badge (no district-name forest).
  map.addLayer({
    id: 'jain-flag-symbol',
    type: 'symbol',
    source: 'flag-points',
    minzoom: 0,
    layout: {
      visibility: 'none',
      'icon-image': 'jain-flag-icon',
      'icon-size': ['interpolate', ['linear'], ['zoom'], 5, 0.62, 7, 0.82, 9, 0.98, 11, 1.08],
      'icon-anchor': 'bottom',
      'icon-allow-overlap': true,
      'icon-ignore-placement': true,
    },
  });

  map.addLayer({
    id: 'jain-flag-count-circle',
    type: 'circle',
    source: 'flag-points',
    minzoom: 0,
    filter: ['>', ['to-number', ['get', 'count']], 1],
    layout: { visibility: 'none' },
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, 7, 8, 9, 10, 11],
      'circle-color': '#7a1f2b',
      'circle-opacity': 0.96,
      'circle-stroke-color': '#fffdf7',
      'circle-stroke-width': 1.4,
      'circle-translate': [16, -38],
      'circle-translate-anchor': 'viewport',
    },
  });

  map.addLayer({
    id: 'jain-flag-count-label',
    type: 'symbol',
    source: 'flag-points',
    minzoom: 0,
    filter: ['>', ['to-number', ['get', 'count']], 1],
    layout: {
      visibility: 'none',
      'text-field': ['to-string', ['get', 'count']],
      'text-font': ['Noto Sans Bold'],
      'text-size': ['interpolate', ['linear'], ['zoom'], 5, 10, 8, 11, 10, 13],
      'text-allow-overlap': true,
      'text-ignore-placement': true,
    },
    paint: {
      'text-color': '#ffffff',
      'text-halo-color': '#7a1f2b',
      'text-halo-width': 0.7,
      'text-translate': [16, -38],
      'text-translate-anchor': 'viewport',
    },
  });

  // District temple clusters: same Jain flag + count badge as state markers.
  map.addLayer({
    id: 'temple-clusters',
    type: 'symbol',
    source: 'temple-points',
    filter: ['has', 'point_count'],
    layout: {
      visibility: 'none',
      'icon-image': 'jain-flag-icon',
      'icon-size': [
        'step', ['get', 'point_count'],
        0.72,
        8, 0.88,
        20, 1.02,
      ],
      'icon-anchor': 'bottom',
      'icon-allow-overlap': true,
      'icon-ignore-placement': true,
    },
  });

  map.addLayer({
    id: 'temple-cluster-count-circle',
    type: 'circle',
    source: 'temple-points',
    filter: ['has', 'point_count'],
    layout: { visibility: 'none' },
    paint: {
      'circle-radius': [
        'step', ['get', 'point_count'],
        8,
        8, 9,
        20, 11,
      ],
      'circle-color': '#7a1f2b',
      'circle-opacity': 0.96,
      'circle-stroke-color': '#fffdf7',
      'circle-stroke-width': 1.4,
      'circle-translate': [16, -38],
      'circle-translate-anchor': 'viewport',
    },
  });

  map.addLayer({
    id: 'temple-cluster-count',
    type: 'symbol',
    source: 'temple-points',
    filter: ['has', 'point_count'],
    layout: {
      visibility: 'none',
      'text-field': ['to-string', ['get', 'point_count']],
      'text-font': ['Noto Sans Bold'],
      'text-size': [
        'step', ['get', 'point_count'],
        11,
        8, 12,
        20, 13,
      ],
      'text-allow-overlap': true,
      'text-ignore-placement': true,
    },
    paint: {
      'text-color': '#ffffff',
      'text-halo-color': '#7a1f2b',
      'text-halo-width': 0.7,
      'text-translate': [16, -38],
      'text-translate-anchor': 'viewport',
    },
  });

  map.addLayer({
    id: 'temple-symbol',
    type: 'symbol',
    source: 'temple-points',
    filter: ['!', ['has', 'point_count']],
    minzoom: 0,
    layout: {
      visibility: 'none',
      'icon-image': 'jain-temple-icon',
      'icon-size': ['interpolate', ['linear'], ['zoom'], 4, 0.55, 6, 0.7, 8.5, 0.88, 11, 1.05],
      'icon-anchor': 'center',
      'icon-allow-overlap': true,
      'icon-ignore-placement': true,
      'text-field': ['get', 'name'],
      'text-font': ['Noto Sans Regular'],
      'text-size': ['interpolate', ['linear'], ['zoom'], 5, 9, 8, 11, 11, 12.5],
      'text-offset': [0, 1.35],
      'text-anchor': 'top',
      'text-optional': true,
      'text-allow-overlap': false,
      'text-max-width': 10,
    },
    paint: {
      'text-color': '#5a3d12',
      'text-halo-color': 'rgba(255, 252, 244, 0.96)',
      'text-halo-width': 1.4,
    },
  });

  map.addSource('temple-spider-lines', { type: 'geojson', data: EMPTY_FC });
  map.addSource('temple-spider', { type: 'geojson', data: EMPTY_FC });

  map.addLayer({
    id: 'temple-spider-lines',
    type: 'line',
    source: 'temple-spider-lines',
    layout: { visibility: 'none' },
    paint: {
      'line-color': '#a87318',
      'line-width': 1.4,
      'line-opacity': 0.55,
    },
  });

  map.addLayer({
    id: 'temple-spider-symbol',
    type: 'symbol',
    source: 'temple-spider',
    layout: {
      visibility: 'none',
      'icon-image': 'jain-temple-icon',
      'icon-size': 0.92,
      'icon-anchor': 'center',
      'icon-allow-overlap': true,
      'icon-ignore-placement': true,
      'text-field': ['get', 'name'],
      'text-font': ['Noto Sans Regular'],
      'text-size': 11,
      'text-offset': [0, 1.35],
      'text-anchor': 'top',
      'text-optional': true,
      'text-allow-overlap': true,
      'text-max-width': 9,
    },
    paint: {
      'text-color': '#5a3d12',
      'text-halo-color': 'rgba(255, 252, 244, 0.96)',
      'text-halo-width': 1.4,
    },
  });
}

export default function IndiaMap({
  geoData,
  level,
  selectedStateName,
  selectedDistrictName,
  templeDistrictNames,
  flags = [],
  temples = [],
  districtLabels = [],
  onFeatureClick,
  onSelectDistrict,
  onTempleClick,
  reducedMotion = false,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const basemapSymbolLayerIdsRef = useRef([]);
  const latest = useRef({ onFeatureClick, onSelectDistrict, onTempleClick, temples });
  const levelRef = useRef(level);
  const navFitKeyRef = useRef('');
  const fitBoundsRef = useRef(INDIA_BOUNDS);
  const lastFitSizeRef = useRef({ w: 0, h: 0 });
  const reducedMotionRef = useRef(reducedMotion);
  const stateSourceDataRef = useRef(null);
  const districtSourceDataRef = useRef(null);
  const selectionRef = useRef({ selectedStateName, selectedDistrictName });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [layersReady, setLayersReady] = useState(false);
  const [stateGeoData, setStateGeoData] = useState(null);
  const [mapError, setMapError] = useState('');
  const [clusterMenu, setClusterMenu] = useState(null); // { temples, title }
  const ignoreBlankClickUntilRef = useRef(0);
  const openClusterChooserRef = useRef(() => {});
  const clearSpiderRef = useRef(() => {});

  latest.current = { onFeatureClick, onSelectDistrict, onTempleClick, temples };
  levelRef.current = level;
  reducedMotionRef.current = reducedMotion;
  selectionRef.current = { selectedStateName, selectedDistrictName };

  const clearSpider = () => {
    const map = mapRef.current;
    setClusterMenu(null);
    if (!map) return;
    map.getSource('temple-spider')?.setData(EMPTY_FC);
    map.getSource('temple-spider-lines')?.setData(EMPTY_FC);
    setVisibility(map, ['temple-spider-lines', 'temple-spider-symbol'], false);
  };

  const openClusterChooser = (map, centerLngLat, clusterTemples) => {
    if (!map || !clusterTemples.length) return;
    const { points, lines } = buildSpiderGeoJSON(map, centerLngLat, clusterTemples);
    map.getSource('temple-spider')?.setData(points);
    map.getSource('temple-spider-lines')?.setData(lines);
    setVisibility(map, ['temple-spider-lines', 'temple-spider-symbol'], true);
    ignoreBlankClickUntilRef.current = Date.now() + 500;
    setClusterMenu({
      temples: clusterTemples,
      title: clusterTemples.length === 1
        ? '1 temple'
        : `${clusterTemples.length} temples`,
    });
  };

  clearSpiderRef.current = clearSpider;
  openClusterChooserRef.current = openClusterChooser;

  /** Resolve temples for a cluster; fall back to nearby temples if leaves fail. */
  function templesFromClusterLeaves(leafFeatures, centerLngLat) {
    const fromLeaves = (leafFeatures || [])
      .map((leaf) => {
        const id = String(leaf?.properties?.id ?? '');
        return latest.current.temples.find((item) => String(item.id) === id);
      })
      .filter(Boolean);

    if (fromLeaves.length) return fromLeaves;

    // Fallback for identical / near-identical coordinates.
    const [lng, lat] = centerLngLat || [];
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) return [];
    const near = latest.current.temples
      .map((temple) => {
        const dx = Number(temple.longitude) - lng;
        const dy = Number(temple.latitude) - lat;
        return { temple, dist: (dx * dx) + (dy * dy) };
      })
      .filter((row) => row.dist < 0.00025) // ~ ~1.5–2 km-ish at TN latitudes; catches co-located points
      .sort((a, b) => a.dist - b.dist)
      .map((row) => row.temple);

    return near.length ? near : latest.current.temples.slice(0, 40);
  }

  const stateSourceData = useMemo(() => withStateData(stateGeoData), [stateGeoData]);
  const districtSourceData = useMemo(
    () => withDistrictData(geoData, selectedStateName, templeDistrictNames),
    [geoData, selectedStateName, templeDistrictNames],
  );
  stateSourceDataRef.current = stateSourceData;
  districtSourceDataRef.current = districtSourceData;
  const stateLabelSourceData = useMemo(() => makeStateLabelData(stateSourceData), [stateSourceData]);
  const districtLabelSourceData = useMemo(
    () => makeDistrictLabelData(districtLabels, selectedStateName),
    [districtLabels, selectedStateName],
  );
  const flagSourceData = useMemo(() => makeFlagSourceData(flags), [flags]);
  const templeSourceData = useMemo(() => makeTempleSourceData(temples), [temples]);

  useEffect(() => {
    let cancelled = false;
    fetch('/atlas/india-states.geojson')
      .then((res) => {
        if (!res.ok) throw new Error('State boundary file load failed');
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setStateGeoData(data);
      })
      .catch(() => {
        if (!cancelled) setStateGeoData({ type: 'FeatureCollection', features: [] });
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return undefined;

    setMapError('');
    setMapLoaded(false);
    setLayersReady(false);
    let didLoad = false;
    let fallbackAttempted = false;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: PREFERRED_MAP_STYLE,
      center: [78.96, 22.65],
      zoom: 3.4,
      minZoom: 1.6,
      // Street-level detail (bazaar names, petrol pumps) needs ~16–18, same as Jaipur.
      maxZoom: 18,
      maxBounds: [[62.0, 2.5], [102.5, 41.0]],
      // Custom attribution below — always show quiet text (no compact ⓘ button).
      attributionControl: false,
      renderWorldCopies: false,
      dragRotate: false,
      pitchWithRotate: false,
    });

    const handleMapError = (event) => {
      if (didLoad) return;
      const message = event?.error?.message || String(event?.error || '');
      if (!/style|source|fetch|network|404|403|401|failed|invalid|ajax|load/i.test(message)) {
        return;
      }

      // Invalid MapTiler key / blocked style → keep the app usable.
      if (!fallbackAttempted && PREFERRED_MAP_STYLE !== FALLBACK_MAP_STYLE) {
        fallbackAttempted = true;
        setMapError('');
        try {
          map.setStyle(FALLBACK_MAP_STYLE);
        } catch {
          setMapError('Map style could not be loaded. Check the internet connection, MapTiler key or VITE_MAP_STYLE_URL.');
        }
        return;
      }

      setMapError('Map style could not be loaded. Check the internet connection, MapTiler key or VITE_MAP_STYLE_URL.');
    };

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');
    map.addControl(new maplibregl.AttributionControl({ compact: false }), 'bottom-right');
    map.on('load', () => {
      didLoad = true;
      basemapSymbolLayerIdsRef.current = (map.getStyle()?.layers || [])
        .filter((layer) => layer.type === 'symbol')
        .map((layer) => layer.id);
      simplifyBasemap(map);
      syncMapLabels(map, basemapSymbolLayerIdsRef.current, 'india');
      setMapError('');
      setMapLoaded(true);
    });
    map.on('error', handleMapError);

    return () => {
      map.off('error', handleMapError);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapLoaded || !map || !stateSourceData || !districtSourceData || layersReady) return undefined;

    let cancelled = false;

    (async () => {
      await Promise.all([addJainFlagImage(map), addTempleImage(map)]);
      if (cancelled || !mapRef.current) return;

      map.addSource('states', { type: 'geojson', data: stateSourceData });
      map.addSource('districts', { type: 'geojson', data: districtSourceData });
      map.addSource('state-labels', { type: 'geojson', data: stateLabelSourceData });
      map.addSource('district-labels', { type: 'geojson', data: districtLabelSourceData });
      map.addSource('flag-points', { type: 'geojson', data: flagSourceData });
      map.addSource('temple-points', {
        type: 'geojson',
        data: templeSourceData,
        cluster: true,
        clusterMaxZoom: 12,
        clusterRadius: 40,
      });
      addMapLayers(map);

      const handleStateClick = (event) => {
        clearSpiderRef.current();
        const feature = event.features?.[0];
        const stateName = feature?.properties?.st_nm;
        if (stateName) latest.current.onFeatureClick(null, stateName);
      };

      const handleDistrictClick = (event) => {
        // Don't steal clicks meant for temple flags / clusters / icons above.
        const overlayHit = map.queryRenderedFeatures(event.point, {
          layers: [...TEMPLE_CLUSTER_LAYERS, 'temple-symbol', 'temple-spider-symbol', ...FLAG_LAYERS]
            .filter((id) => map.getLayer(id)),
        });
        if (overlayHit.length) return;

        clearSpiderRef.current();
        const feature = event.features?.[0];
        const stateName = feature?.properties?.st_nm;
        const districtName = feature?.properties?.district;
        if (stateName && districtName) latest.current.onFeatureClick(districtName, stateName);
      };

      const handleFlagClick = (event) => {
        event.originalEvent?.stopPropagation?.();
        clearSpiderRef.current();
        const districtName = event.features?.[0]?.properties?.district;
        if (districtName) latest.current.onSelectDistrict(districtName);
      };

      const selectTempleFromMap = (temple) => {
        if (!temple) return;
        clearSpiderRef.current();
        latest.current.onTempleClick(temple);
        map.easeTo({
          center: [Number(temple.longitude), Number(temple.latitude)],
          duration: reducedMotionRef.current ? 0 : 220,
          easing: (t) => 1 - (1 - t) ** 2,
        });
      };

      const handleTempleClick = (event) => {
        event.originalEvent?.stopPropagation?.();
        const templeId = String(event.features?.[0]?.properties?.id ?? '');
        const temple = latest.current.temples.find((item) => String(item.id) === templeId);
        selectTempleFromMap(temple);
      };

      const handleSpiderClick = (event) => {
        event.originalEvent?.stopPropagation?.();
        const templeId = String(event.features?.[0]?.properties?.id ?? '');
        const temple = latest.current.temples.find((item) => String(item.id) === templeId);
        selectTempleFromMap(temple);
      };

      const handleClusterClick = async (event) => {
        event.originalEvent?.stopPropagation?.();
        const feature = event.features?.[0];
        const clusterId = feature?.properties?.cluster_id;
        const pointCount = Number(feature?.properties?.point_count || 0);
        const coordinates = feature?.geometry?.coordinates;
        const source = map.getSource('temple-points');
        if (clusterId == null || !coordinates || !source) return;

        let leafFeatures = [];
        try {
          // MapLibre v5 returns a Promise (callback form is ignored).
          if (typeof source.getClusterLeaves === 'function') {
            const limit = Math.min(Math.max(pointCount, 1), 100);
            leafFeatures = await source.getClusterLeaves(clusterId, limit, 0);
          }
        } catch {
          leafFeatures = [];
        }

        if (!mapRef.current) return;
        const clusterTemples = templesFromClusterLeaves(leafFeatures, coordinates);
        if (!clusterTemples.length) return;
        openClusterChooserRef.current(map, coordinates, clusterTemples);
      };

      ['state-fill', 'state-label'].forEach((id) => map.on('click', id, handleStateClick));
      ['district-fill', 'district-line'].forEach((id) => map.on('click', id, handleDistrictClick));
      FLAG_LAYERS.forEach((id) => {
        map.on('click', id, handleFlagClick);
      });
      map.on('click', 'temple-symbol', handleTempleClick);
      map.on('click', 'temple-spider-symbol', handleSpiderClick);
      TEMPLE_CLUSTER_LAYERS.forEach((id) => {
        map.on('click', id, handleClusterClick);
      });
      map.on('click', (event) => {
        if (Date.now() < ignoreBlankClickUntilRef.current) return;
        const layers = [...TEMPLE_CLUSTER_LAYERS, 'temple-symbol', 'temple-spider-symbol', ...FLAG_LAYERS]
          .filter((id) => map.getLayer(id));
        const hit = map.queryRenderedFeatures(event.point, { layers });
        if (!hit.length) clearSpiderRef.current();
      });

      [
        'state-fill', 'state-label', 'district-fill', 'district-line',
        ...FLAG_LAYERS,
        ...TEMPLE_MARKER_LAYERS,
      ].forEach((id) => {
        map.on('mouseenter', id, () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', id, () => { map.getCanvas().style.cursor = ''; });
      });

      setLayersReady(true);
    })();

    return () => { cancelled = true; };
  }, [districtLabelSourceData, districtSourceData, flagSourceData, layersReady, mapLoaded, reducedMotion, stateLabelSourceData, stateSourceData, templeSourceData]);

  useEffect(() => {
    const map = mapRef.current;
    if (!layersReady || !map || !stateSourceData || !districtSourceData) return;
    map.getSource('states')?.setData(stateSourceData);
    map.getSource('districts')?.setData(districtSourceData);
    map.getSource('state-labels')?.setData(stateLabelSourceData);
    map.getSource('district-labels')?.setData(districtLabelSourceData);
    map.getSource('flag-points')?.setData(flagSourceData);
    map.getSource('temple-points')?.setData(templeSourceData);
  }, [districtLabelSourceData, districtSourceData, flagSourceData, layersReady, stateLabelSourceData, stateSourceData, templeSourceData]);

  // Update layer visibility/filters whenever selection or source data changes.
  // Auto-fit the camera ONLY when the navigation target changes — never while
  // the user is manually panning/zooming (that made markers appear to vanish).
  useEffect(() => {
    const map = mapRef.current;
    if (!layersReady || !map || !stateSourceData || !districtSourceData) return undefined;

    const sf = stateFilter(selectedStateName);
    const df = districtFilter(selectedStateName, selectedDistrictName);
    const showState = level === 'state' || level === 'district';
    const showDistrict = level === 'state' || level === 'district';
    const showSelectedDistrict = level === 'district';

    setFilter(map, ['selected-state-fill', 'selected-state-line'], sf);
    setFilter(map, ['district-fill', 'district-line'], sf);
    setFilter(map, ['selected-district-fill', 'selected-district-line'], df);

    setVisibility(map, ['state-fill'], level === 'india');
    setVisibility(map, ['selected-state-fill', 'selected-state-line'], showState);
    setVisibility(map, ['district-fill', 'district-line'], showDistrict);
    setVisibility(map, FLAG_LAYERS, level === 'state');
    setVisibility(map, ['selected-district-fill', 'selected-district-line'], showSelectedDistrict);
    setVisibility(
      map,
      ['temple-clusters', 'temple-cluster-count-circle', 'temple-cluster-count', 'temple-symbol'],
      level === 'district',
    );

    const navKey = `${level}|${selectedStateName || ''}|${selectedDistrictName || ''}`;
    const navigated = navFitKeyRef.current !== navKey;
    // Only clear the temple picker when the user actually changes Bharat/state/district.
    if (navigated) {
      map.getSource('temple-spider')?.setData(EMPTY_FC);
      map.getSource('temple-spider-lines')?.setData(EMPTY_FC);
      setVisibility(map, ['temple-spider-lines', 'temple-spider-symbol'], false);
      setClusterMenu(null);
    }

    // Owned labels first (instant), then provider visibility + one boost pass.
    basemapBoostAppliedFor = '';
    syncOwnedLabels(map, level);
    syncMapLabels(map, basemapSymbolLayerIdsRef.current, level, { boost: true });
    setRoadLineEmphasis(map, level);
    void addJainFlagImage(map);
    void addTempleImage(map);

    const shouldFit = navigated;
    if (!shouldFit) return undefined;
    navFitKeyRef.current = navKey;

    const bounds = resolveFitBounds(
      level,
      map,
      stateSourceData,
      districtSourceData,
      selectedStateName,
      selectedDistrictName,
    );
    fitBoundsRef.current = bounds;

    let cancelled = false;
    // Wait until the container has a real size (DevTools device mode can lag),
    // then fit once so Bharat is fully visible on that screen.
    const runFit = () => {
      if (cancelled || !mapRef.current) return;
      const liveMap = mapRef.current;
      const el = liveMap.getContainer();
      if (el.clientWidth < 40 || el.clientHeight < 40) {
        window.setTimeout(runFit, 50);
        return;
      }
      fitMapToBounds(liveMap, bounds, { level, reducedMotion });
      lastFitSizeRef.current = { w: el.clientWidth, h: el.clientHeight };
    };
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(runFit);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [districtSourceData, layersReady, level, reducedMotion, selectedDistrictName, selectedStateName, stateSourceData]);

  // During zoom: only cheap owned-label toggles. Heavy MapTiler boosts on zoomend.
  useEffect(() => {
    const map = mapRef.current;
    if (!layersReady || !map) return undefined;

    let zoomEndTimer = 0;
    const onZoom = () => {
      syncOwnedLabels(map, levelRef.current);
    };
    const onZoomEnd = () => {
      const lvl = levelRef.current;
      syncOwnedLabels(map, lvl);
      window.clearTimeout(zoomEndTimer);
      zoomEndTimer = window.setTimeout(() => {
        syncMapLabels(map, basemapSymbolLayerIdsRef.current, lvl, { boost: true });
        setRoadLineEmphasis(map, lvl);
      }, 80);
    };

    map.on('zoom', onZoom);
    map.on('zoomend', onZoomEnd);
    syncOwnedLabels(map, levelRef.current);

    return () => {
      window.clearTimeout(zoomEndTimer);
      map.off('zoom', onZoom);
      map.off('zoomend', onZoomEnd);
    };
  }, [layersReady, level]);

  // Keep WebGL canvas sized to the container. Re-fit overview levels when the
  // viewport aspect changes a lot (DevTools device mode / rotate) so Bharat
  // still fills the screen like desktop.
  useEffect(() => {
    const map = mapRef.current;
    if (!layersReady || !map) return undefined;

    let timer = 0;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const m = mapRef.current;
        if (!m) return;
        m.resize();
        const el = m.getContainer();
        const w = el.clientWidth;
        const h = el.clientHeight;
        const prev = lastFitSizeRef.current;
        const sizeJump = !prev.w
          || Math.abs(w - prev.w) > 48
          || Math.abs(h - prev.h) > 48
          || Math.abs((w / Math.max(h, 1)) - (prev.w / Math.max(prev.h, 1))) > 0.12;
        const lvl = levelRef.current;
        if (sizeJump && (lvl === 'india' || lvl === 'state' || lvl === 'district')) {
          const { selectedStateName: st, selectedDistrictName: dt } = selectionRef.current;
          const bounds = resolveFitBounds(
            lvl,
            m,
            stateSourceDataRef.current,
            districtSourceDataRef.current,
            st,
            dt,
          );
          fitBoundsRef.current = bounds;
          fitMapToBounds(m, bounds, {
            level: lvl,
            reducedMotion: reducedMotionRef.current,
          });
          lastFitSizeRef.current = { w, h };
        }
      }, 140);
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(onResize)
      : null;
    if (containerRef.current && ro) ro.observe(containerRef.current);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      ro?.disconnect();
    };
  }, [layersReady]);

  return (
    <div className="atlas-map-shell">
      <div ref={containerRef} className="atlas-maplibre" aria-label="Interactive map of Bharat Jain tirths" />
      <div className="atlas-map-wash" aria-hidden="true" />
      {clusterMenu && (
        <div className="cluster-chooser" role="dialog" aria-label={clusterMenu.title}>
          <div className="cluster-chooser__head">
            <div>
              <p className="cluster-chooser__eyebrow">Choose a temple</p>
              <h2 className="cluster-chooser__title">{clusterMenu.title}</h2>
            </div>
            <button
              type="button"
              className="cluster-chooser__close"
              onClick={clearSpider}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <ul className="cluster-chooser__list">
            {clusterMenu.temples.map((temple) => (
              <li key={temple.id}>
                <button
                  type="button"
                  className="cluster-chooser__item"
                  onClick={() => {
                    clearSpider();
                    onTempleClick?.(temple);
                    mapRef.current?.easeTo({
                      center: [Number(temple.longitude), Number(temple.latitude)],
                      duration: reducedMotion ? 0 : 220,
                      easing: (t) => 1 - (1 - t) ** 2,
                    });
                  }}
                >
                  <span className="cluster-chooser__flag" aria-hidden="true" />
                  <span className="cluster-chooser__name">{temple.name}</span>
                  <span className="cluster-chooser__go" aria-hidden="true">›</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {mapError && (
        <div className="atlas-map-config-error" role="alert">
          <strong>Map could not be loaded</strong>
          <span>{mapError}</span>
        </div>
      )}
    </div>
  );
}
