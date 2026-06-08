import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';

export interface CenturySlide {
  readonly century: string;
  readonly subtitle: string;
  readonly paragraphs: readonly string[];
  readonly imageSrc: string;
  readonly imageAlt: string;
}

@Component({
  selector: 'app-century-wall',
  templateUrl: './century-wall.html',
  styleUrl: './century-wall.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
})
export class CenturyWall {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly timelineTrack = viewChild<ElementRef<HTMLElement>>('timelineTrack');

  protected readonly slides: readonly CenturySlide[] = [
    {
      century: '3RD CENTURY BCE',
      subtitle: 'Tamil Brahmi Inscriptions',
      paragraphs: [
        'The earliest evidence of Jainism in Tamil Nadu comes from Tamil-Brahmi inscriptions found in natural caverns. These caves served as monsoon shelters for Jain monks and bear witness to a vibrant ascetic tradition on this soil.',
        'Scholars connect these engravings with the spread of Śramaṇa thought across ancient Tamilakam, tying together language, archaeology, and the enduring Jain presence across the peninsula.',
      ],
      imageSrc: 'images/rock-wall-carvings.webp',
      imageAlt: 'Ancient Tamil Jain rock carving in a cavern',
    },
    {
      century: '9TH CENTURY CE',
      subtitle: 'Rock-Cut Jain Sanctuaries',
      paragraphs: [
        'Across the Pudukottai plateau and Tiruchirappalli plains, Jain communities sponsored rock-cut shrines crowned with luminous plaster and painted ceilings that still whisper of manuscript schools.',
        'Pilgrim routes braided village tanks with hillside caverns, translating patronage carved in stone into the seasonal rhythms of monsoon retreats.',
      ],
      imageSrc: 'images/heritage-rock-figure.webp',
      imageAlt: 'Heritage rock-cut Jain sculptures',
    },
    {
      century: '16TH CENTURY CE',
      subtitle: 'Pandya & Vijayanagara Patronage',
      paragraphs: [
        'Later dynasties protected Jain bankers, composers, and temple stewards whose copper-plate charters record irrigation gifts and lamp-endowments along the Tambraparni and Vaigai basins.',
        'The interplay of courtly Sanskrit and crystalline Tamil commentaries anchored a cosmopolitan Jain public sphere that still resonates in choral festivals.',
      ],
      imageSrc: 'images/gallery-golden-temple.webp',
      imageAlt: 'Tamil Jain golden temple façade detail',
    },
  ];

  protected readonly slideIndex = signal(0);
  protected readonly dragging = signal(false);

  private lastWheelHandledAtMs = 0;
  private pointerRafId = 0;
  private pendingPointerClientY: number | null = null;

  protected readonly maxIndex = computed(() => Math.max(0, this.slides.length - 1));
  protected readonly currentSlide = computed(() => this.slides[this.slideIndex()]!);

  /** 0 at top (earliest era), 100 at bottom */
  protected readonly handlePositionPct = computed(() => {
    const max = this.maxIndex();
    if (max <= 0) return 0;
    return (this.slideIndex() / max) * 100;
  });

  protected readonly mobileProgressPct = computed(() => {
    const max = this.maxIndex();
    if (max <= 0) return 100;
    return Math.max(8, (this.slideIndex() / max) * 100);
  });

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      const attach = () => {
        const track = this.timelineTrack()?.nativeElement;
        if (!track) return false;
        const fn = (e: WheelEvent) => this.onTimelineWheel(e);
        track.addEventListener('wheel', fn, { passive: false });
        this.destroyRef.onDestroy(() => track.removeEventListener('wheel', fn));
        return true;
      };
      if (!attach()) {
        queueMicrotask(() => attach());
      }
    });
  }

  protected slideUp(): void {
    this.slideIndex.update((i) => Math.max(0, i - 1));
  }

  protected slideDown(): void {
    this.slideIndex.update((i) => Math.min(this.maxIndex(), i + 1));
  }

  protected onTimelineWheel(ev: WheelEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const track = this.timelineTrack()?.nativeElement;
    if (!track || !(ev.target instanceof Node) || !track.contains(ev.target)) {
      return;
    }

    const absDelta = Math.abs(ev.deltaY);
    if (absDelta < 20) return;

    const dir = ev.deltaY > 0 ? 1 : -1;
    const i = this.slideIndex();
    const max = this.maxIndex();

    // At ends: don't block page scroll once the carousel can't move further
    if ((dir > 0 && i >= max) || (dir < 0 && i <= 0)) {
      return;
    }

    const now = performance.now();
    if (now - this.lastWheelHandledAtMs < 300) {
      ev.preventDefault();
      return;
    }

    ev.preventDefault();
    this.lastWheelHandledAtMs = performance.now();
    if (dir > 0) this.slideDown();
    else this.slideUp();
  }
  protected onTimelineKey(ev: KeyboardEvent): void {
    if (ev.key === 'ArrowUp' || ev.key === 'PageUp') {
      ev.preventDefault();
      this.slideUp();
      return;
    }
    if (ev.key === 'ArrowDown' || ev.key === 'PageDown') {
      ev.preventDefault();
      this.slideDown();
      return;
    }
    if (ev.key === 'Home') {
      ev.preventDefault();
      this.slideIndex.set(0);
      return;
    }
    if (ev.key === 'End') {
      ev.preventDefault();
      this.slideIndex.set(this.maxIndex());
    }
  }

  protected onTrackPointerDown(ev: PointerEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const el = ev.currentTarget as HTMLElement;
    el.focus({ preventScroll: true });
    el.setPointerCapture(ev.pointerId);
    this.dragging.set(true);
    this.updateSlideFromPointer(ev.clientY);
  }

  protected onTrackPointerMove(ev: PointerEvent): void {
    if (!this.dragging()) return;
    if (!isPlatformBrowser(this.platformId)) return;
    ev.preventDefault();
    this.pendingPointerClientY = ev.clientY;
    if (this.pointerRafId !== 0) return;
    this.pointerRafId = requestAnimationFrame(() => {
      this.pointerRafId = 0;
      const y = this.pendingPointerClientY;
      this.pendingPointerClientY = null;
      if (y != null) this.updateSlideFromPointer(y);
    });
  }

  protected onTrackPointerEnd(ev: PointerEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.dragging.set(false);
    if (this.pointerRafId !== 0) {
      cancelAnimationFrame(this.pointerRafId);
      this.pointerRafId = 0;
    }
    try {
      (ev.currentTarget as HTMLElement).releasePointerCapture(ev.pointerId);
    } catch {
      /* not captured */
    }
  }

  private updateSlideFromPointer(clientY: number): void {
    const host = this.timelineTrack()?.nativeElement;
    if (!host) return;
    const rect = host.getBoundingClientRect();
    if (rect.height <= 0) return;
    const y = Math.min(Math.max(clientY - rect.top, 0), rect.height);
    const ratioDown = y / rect.height;
    const max = this.maxIndex();
    const idx = Math.round(ratioDown * max);
    const clamped = Math.max(0, Math.min(max, idx));
    this.slideIndex.set(clamped);
  }
}
