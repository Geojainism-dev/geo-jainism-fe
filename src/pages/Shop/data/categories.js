/**
 * Shop categories. Order = display order on the shop homepage and filters.
 * `image` is a key under /public/shop-assets/ (see data/media.js).
 * Add, remove or reorder categories here — every page reads from this list.
 */
export const CATEGORIES = [
  {
    slug: "books-literature",
    name: "Books & Literature",
    short: "Books",
    blurb: "Scripture, scholarship and the stories of a 2,500-year tradition.",
    image: "cat-books-literature",
  },
  {
    slug: "art-paintings",
    name: "Jain Art & Paintings",
    short: "Art",
    blurb: "Archival prints of manuscripts, cosmologies and temple photography.",
    image: "cat-art-paintings",
  },
  {
    slug: "spiritual-devotional",
    name: "Spiritual & Devotional",
    short: "Devotional",
    blurb: "Lamps, malas and fragrances for daily practice.",
    image: "cat-spiritual-devotional",
  },
  {
    slug: "home-lifestyle",
    name: "Home & Lifestyle",
    short: "Home",
    blurb: "Quiet objects for calm interiors, made by hand.",
    image: "cat-home-lifestyle",
  },
  {
    slug: "clothing-accessories",
    name: "Clothing & Accessories",
    short: "Wear",
    blurb: "Handspun, naturally dyed and non-violent textiles.",
    image: "cat-clothing-accessories",
  },
  {
    slug: "heritage-collectibles",
    name: "Heritage & Collectibles",
    short: "Collectibles",
    blurb: "Pieces that carry the craft of temple artisans.",
    image: "cat-heritage-collectibles",
  },
  {
    slug: "educational",
    name: "Educational Products",
    short: "Learn",
    blurb: "Scripts, maps and ideas for curious young minds.",
    image: "cat-educational",
  },
  {
    slug: "gifts-souvenirs",
    name: "Gifts & Souvenirs",
    short: "Gifts",
    blurb: "Thoughtful keepsakes from the GEO Jainism journey.",
    image: "cat-gifts-souvenirs",
  },
];

export const categoryBySlug = (slug) => CATEGORIES.find((c) => c.slug === slug);
