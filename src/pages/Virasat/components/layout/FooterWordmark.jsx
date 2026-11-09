import { BRAND } from "../../data/site";
import { useVirasat } from "../../hooks/useSmoothScroll";
import Ornament from "../common/Ornament";

/**
 * "Torchlight" wordmark: an engraved gold outline, with a pool of lamplight
 * that travels from the first letter to the last and back again, gilding
 * each letter as it passes. Under reduced motion the light rests, softly
 * lit, at the centre.
 */
export default function FooterWordmark() {
  const { reducedMotion } = useVirasat();

  return (
    <div className="py-8" aria-hidden="true">
      <div className={`vr-torch ${reducedMotion ? "is-still" : "is-sweeping"}`}>
        {/* engraved outline */}
        <p className="vr-torch__text vr-torch__outline">{BRAND.name}</p>
        {/* gilded letters, revealed by the light */}
        <p className="vr-torch__text vr-torch__gilt">{BRAND.name}</p>
        {/* the warm halo itself */}
        <span className="vr-torch__halo" />
      </div>
      <div className="mt-6 flex flex-col items-center gap-4 text-vr-gold">
        <Ornament.Divider className="w-64" />
        <p className="font-vr-display text-xl italic tracking-wide text-vr-ivory/70">{BRAND.tagline}</p>
      </div>
    </div>
  );
}
