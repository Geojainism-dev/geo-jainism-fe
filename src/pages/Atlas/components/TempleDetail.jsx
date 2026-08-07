import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Custom, offline SVG illustration used when a temple has no real photo yet.
// Tinted by sect so each card still feels distinct. No external fetch, no copyright.
function TempleArt({ name, sect }) {
  const theme =
    sect === 'Digambar' ? { sky: '#fde9c8', hill: '#caa86a', accent: '#d97706' }
      : sect === 'Both' ? { sky: '#d9efe0', hill: '#8fc6a3', accent: '#2e7d4f' }
        : { sky: '#eef1f7', hill: '#c3cad9', accent: '#7a1f2b' }; // Shwetambar / default
  return (
    <svg viewBox="0 0 400 170" className="temple-art" preserveAspectRatio="xMidYMid slice" role="img" aria-label={name}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={theme.sky} />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      <rect width="400" height="170" fill="url(#sky)" />
      <circle cx="320" cy="42" r="20" fill={theme.accent} opacity="0.35" />
      <path d="M0 130 Q90 70 180 120 T400 104 V170 H0 Z" fill={theme.hill} opacity="0.55" />
      <path d="M0 150 Q120 100 240 140 T400 130 V170 H0 Z" fill={theme.hill} />
      <g transform="translate(168 64)">
        <rect x="10" y="58" width="44" height="30" fill="#fff8ec" stroke="#9a8048" />
        <rect x="26" y="68" width="12" height="20" fill={theme.accent} opacity="0.7" />
        <path d="M6 58 L32 10 L58 58 Z" fill="#fff3da" stroke="#9a8048" />
        <path d="M14 58 L32 24 L50 58 Z" fill={theme.accent} opacity="0.25" />
        <circle cx="32" cy="8" r="4" fill={theme.accent} />
        <rect x="32" y="-14" width="1.5" height="20" fill="#6b4f2a" />
        <g transform="translate(33.5 -14)">
          <rect width="14" height="3" y="0" fill="#e30613" /><rect width="14" height="3" y="3" fill="#ffd100" />
          <rect width="14" height="3" y="6" fill="#ffffff" /><rect width="14" height="3" y="9" fill="#009639" />
          <rect width="14" height="3" y="12" fill="#000000" />
        </g>
      </g>
    </svg>
  );
}

function getImageTitles(temple) {
  if (!temple) return [];
  const titles = [];
  if (Array.isArray(temple.imageWikiTitles)) titles.push(...temple.imageWikiTitles);
  else if (temple.imageWikiTitle) titles.push(temple.imageWikiTitle);

  const deity = String(temple.deity || '')
    .replace(/\([^)]*\)/g, '')
    .split('/')[0]
    .split('·')[0]
    .trim();
  const deityMap = {
    Adinath: 'Rishabhanatha',
    Rishabhdev: 'Rishabhanatha',
    Neminath: 'Neminatha',
    Chandraprabhu: 'Chandraprabha',
    'Mahavir Swami': 'Mahavira',
    Bahubali: 'Gommateshwara statue',
  };
  if (deityMap[deity]) titles.push(deityMap[deity]);
  else if (deity) titles.push(deity);
  if (temple.name) titles.push(temple.name);

  return [...new Set(titles.filter(Boolean))];
}

async function fetchWikiImage(title, signal) {
  const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const response = await fetch(endpoint, { signal });
  if (!response.ok) return null;
  const data = await response.json();
  return data?.originalimage?.source || data?.thumbnail?.source || null;
}

export default function TempleDetail({ temple, reducedMotion, onClose }) {
  const [imgError, setImgError] = useState(false);
  const [remoteImageUrl, setRemoteImageUrl] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const touchStartY = useRef(null);
  const imageTitles = useMemo(() => getImageTitles(temple), [temple]);

  useEffect(() => {
    setImgError(false);
    setRemoteImageUrl(null);
    setExpanded(false);
    if (!temple || temple.imageUrl || imageTitles.length === 0) return undefined;

    const controller = new AbortController();
    let active = true;

    async function loadImage() {
      for (const title of imageTitles) {
        try {
          const image = await fetchWikiImage(title, controller.signal);
          if (active && image) {
            setRemoteImageUrl(image);
            return;
          }
        } catch (error) {
          if (controller.signal.aborted) return;
        }
      }
    }

    loadImage();
    return () => {
      active = false;
      controller.abort();
    };
  }, [imageTitles, temple]);

  if (!temple) return null;

  const imageUrl = temple.imageUrl || remoteImageUrl;
  const showImg = imageUrl && !imgError;
  const gmaps = `https://www.google.com/maps/dir/?api=1&destination=${temple.latitude},${temple.longitude}`;
  const hasMore = Boolean(temple.description || temple.routeNotes);

  return (
    <motion.div
      className={`temple-detail${expanded ? ' is-expanded' : ''}`}
      role="dialog"
      aria-label={`${temple.name} details`}
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      onTouchStart={(event) => {
        touchStartY.current = event.touches[0]?.clientY ?? null;
      }}
      onTouchEnd={(event) => {
        const start = touchStartY.current;
        touchStartY.current = null;
        if (start == null) return;
        const dy = (event.changedTouches[0]?.clientY ?? start) - start;
        if (dy > 72) onClose();
      }}
    >
      <div className="temple-detail__handle" aria-hidden="true" />
      <button className="temple-detail__close" onClick={onClose} aria-label="Close" type="button">×</button>

      <div className="temple-detail__media">
        {showImg ? (
          <img src={imageUrl} alt={temple.deity ? `${temple.deity} - ${temple.name}` : temple.name} onError={() => setImgError(true)} />
        ) : (
          <TempleArt name={temple.name} sect={temple.sect} />
        )}
      </div>

      <div className="temple-detail__body">
        {temple.sect && <span className="temple-detail__badge is-visited">{temple.sect}</span>}
        <h3 className="temple-detail__name">{temple.name}</h3>

        <dl className="temple-detail__facts">
          {temple.deity && (<><dt>Mulnayak</dt><dd>{temple.deity}</dd></>)}
          {temple.address && (<><dt>Address</dt><dd>{temple.address}</dd></>)}
        </dl>

        {temple.description && <p className="temple-detail__desc">{temple.description}</p>}
        {temple.routeNotes && <p className="temple-detail__notes"><strong>Route:</strong> {temple.routeNotes}</p>}

        <div className="temple-detail__actions">
          <a className="btn btn--primary" href={gmaps} target="_blank" rel="noopener noreferrer">Directions (Google Maps)</a>
          {hasMore && (
            <button
              type="button"
              className="btn btn--ghost temple-detail__more"
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? 'Less' : 'More'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
