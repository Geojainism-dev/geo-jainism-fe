import { motion, AnimatePresence } from 'framer-motion';

// Light fades only — no stagger / slide (keeps sidebar snappy on all devices).
const fade = { duration: 0.14, ease: 'easeOut' };

export default function AtlasSidebar({
  level, selectedStateName, selectedDistrictName,
  templeDistricts, temples, reducedMotion,
  onSelectDistrict, onSelectTemple, onBack,
}) {
  return (
    <aside className="atlas-sidebar" aria-label="Jain Atlas navigation">
      <header className="atlas-sidebar__head">
        <div className="atlas-brand" aria-hidden="true">
          <div className="atlas-brand__title">GEO JAINISM</div>
        </div>

        <div className="atlas-title-card">
          <h1 className="atlas-title">Jain Atlas</h1>
        </div>

        {level !== 'india' && (
          <nav className="atlas-breadcrumbs" aria-label="Breadcrumb">
            <button className="atlas-crumb" onClick={() => onBack('india')} type="button">Bharat</button>
            <span aria-hidden>›</span>
            {level === 'district' ? (
              <button className="atlas-crumb" onClick={() => onBack('state')} type="button">{selectedStateName}</button>
            ) : (
              <span className="atlas-crumb is-current">{selectedStateName}</span>
            )}
            {level === 'district' && (<><span aria-hidden>›</span><span className="atlas-crumb is-current">{selectedDistrictName}</span></>)}
          </nav>
        )}
      </header>

      <div className="atlas-list-wrap">
        <AnimatePresence mode="wait">
          {level === 'india' && (
            <motion.div
              key="india"
              className="atlas-empty"
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fade}
            >
              <div className="atlas-empty__icon">🗺️</div>
              <p className="atlas-empty__title">Select a state on the map</p>
              <p className="atlas-empty__hint">Click any state to view its Jain temples.</p>
            </motion.div>
          )}

          {level === 'state' && (
            <motion.div
              key={`state-${selectedStateName}`}
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fade}
            >
              <p className="atlas-section-label">Districts with temples</p>
              {templeDistricts.length === 0 ? (
                <div className="atlas-empty">
                  <p className="atlas-empty__title">Coming soon</p>
                  <p className="atlas-empty__hint">
                    Tamil Nadu is live on Jain Atlas. More states will be added as temple data is ready.
                  </p>
                </div>
              ) : (
                <ul className="atlas-list">
                  {templeDistricts.map((d) => (
                    <li key={d.name}>
                      <button type="button" className="atlas-row is-visited" onClick={() => onSelectDistrict(d.name)}>
                        <span className="atlas-row__name">🚩 {d.name}</span>
                        <span className="atlas-row__meta">{d.count} {d.count === 1 ? 'temple' : 'temples'}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}

          {level === 'district' && (
            <motion.div
              key={`dist-${selectedDistrictName}`}
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fade}
            >
              <p className="atlas-section-label">Jain temples in {selectedDistrictName}</p>
              <ul className="atlas-list">
                {temples.map((t) => (
                  <li key={t.id}>
                    <button type="button" className="atlas-row atlas-row--temple is-visited" onClick={() => onSelectTemple(t)}>
                      <span className="atlas-row__name">{t.name}</span>
                      <span className="atlas-row__meta">{[t.sect, t.deity].filter(Boolean).join(' · ')}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
