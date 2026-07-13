const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function cuid() {
  return 'c' + crypto.randomBytes(12).toString('base64url');
}

function localImg(name) {
  return '/images/products/' + name;
}

// Find first available image from a folder name pattern
const imgDir = '/app/static/images/products';
const avail = new Set();
try {
  fs.readdirSync(imgDir).forEach(f => avail.add(f));
} catch(e) {
  // fallback in dev
}

function firstImg(prefix) {
  const match = [...avail].find(f => f.startsWith(prefix));
  return match ? localImg(match) : null;
}

const db = new Database(process.env.DATABASE_FILE || './dev.db');
db.pragma('journal_mode = WAL');

// Clear old data
db.exec(`
  DELETE FROM "WishlistItem";
  DELETE FROM "Review";
  DELETE FROM "Session";
  DELETE FROM "OrderItem";
  DELETE FROM "Order";
  DELETE FROM "CartItem";
  DELETE FROM "Address";
  DELETE FROM "ProductVariant";
  DELETE FROM "ProductImage";
  DELETE FROM "Product";
  DELETE FROM "Category";
  DELETE FROM "User";
`);

// --- Admin user ---
const adminId = cuid();
const passwordHash = bcrypt.hashSync('admin123', 10);
const now = new Date().toISOString();
db.prepare(`INSERT INTO "User" ("id","email","name","passwordHash","phone","role","createdAt","updatedAt") VALUES (?,?,?,?,?,?,?,?)`).run(
  adminId, 'admin@ikitentun.id', 'Admin IKI TENUN', passwordHash, null, 'admin', now, now
);

// --- Categories ---
const categories = [
  { name: 'Dress', slug: 'dress', description: 'Koleksi dress tenun ikat', image: null },
  { name: 'Blazer', slug: 'blazer', description: 'Blazer tenun modern', image: null },
  { name: 'Set', slug: 'set', description: 'Set tenun couple/ matching', image: null },
  { name: 'Kimono', slug: 'kimono', description: 'Kimono & outerwear tenun', image: null },
];

const catMap = {};
const insertCat = db.prepare(`INSERT INTO "Category" ("id","name","slug","description","image","sortOrder") VALUES (?,?,?,?,?,?)`);
for (let i = 0; i < categories.length; i++) {
  const c = categories[i];
  const id = cuid();
  insertCat.run(id, c.name, c.slug, c.description, c.image, i);
  catMap[c.slug] = id;
}

// --- Products ---
const featuredSlugs = new Set(['bianca-lime', 'dharma-lime', 'arum-dress', 'aura-blazer', 'dinara-set-tenun']);
const newArrivalSlugs = new Set(['berlin-dress', 'hazel-lime', 'hazel-violet', 'jena-burgundy']);

function makeTags(name, desc) {
  const words = new Set();
  const kw = (name + ' ' + desc).toLowerCase().split(/\W+/);
  const keep = ['tenun','ikat','dress','blazer','set','couple','kimono','outerwear','premium','jepara','floral','etnik','modern','formal','casual','daily','blangket'];
  for (const w of kw) if (keep.includes(w)) words.add(w);
  return [...words].join(',');
}

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const products = [
  // Dress
  { name: 'Iris Dress Tenun', slug: 'iris-dress', price: 370000, categoryId: catMap['dress'],
    description: 'Dress tenun ikat asli Jepara dengan motif floral anggun. Bahan tenun blangket premium, resleting belakang. Ukuran XS-XXL. Pre-order 8 hari kerja.',
    image: 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-7r98z-lspug7zq2ix24c.webp' },
  { name: 'Marigold Dress Tenun', slug: 'marigold-dress', price: 350000, categoryId: catMap['dress'],
    description: 'Dress tenun ikat motif bunga marigold. Warna cerah dengan kombinasi tenun tradisional modern. Cocok untuk acara formal & semi-formal.',
    image: 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-23010-c4umr6iim8lv75-600x783.webp' },
  { name: 'Nana Dress Tenun', slug: 'nana-dress', price: 340000, categoryId: catMap['dress'],
    description: 'Dress tenun klasik dengan potongan simpel elegan. Bahan tenun asli Jepara, nyaman dipakai sehari-hari maupun acara.',
    image: firstImg('nana') || 'https://ikitenun.com/wp-content/uploads/2021/08/Nana-Dress-1-600x783.jpg' },
  { name: 'Berlin Dress', slug: 'berlin-dress', price: 395000, categoryId: catMap['dress'],
    description: 'Dress tenun Berlin dengan potongan modern dan motif etnik kontemporer. Cocok untuk acara formal.',
    image: firstImg('foto_web_berlin') || '/images/placeholder.png' },
  { name: 'Anna Dress', slug: 'anna-dress', price: 430000, categoryId: catMap['dress'],
    description: 'Anna dress tenun pre order 8 hari. Tenun original blangket, resleting belakang. Detail size XS-XXL. Custom size tersedia.',
    image: 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-7r98z-lspug7zq2ix24c.webp' },
  { name: 'Arum Dress', slug: 'arum-dress', price: 449000, categoryId: catMap['dress'],
    description: 'Dress tenun Arum dengan desain modern & feminin. Bahan tenun ikat premium dari Jepara.',
    image: firstImg('arum_') || 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-7rbk7-mb1xj5dc4co41d.webp' },
  { name: 'Bianca Dress Lime', slug: 'bianca-lime', price: 425000, categoryId: catMap['dress'],
    description: 'Dress tenun Bianca warna lime fresh. Motif tenun modern, cocok untuk daily wear. Tersedia berbagai ukuran.',
    image: firstImg('foto_web_bianca_lime_') || '/images/placeholder.png' },
  { name: 'Bianca Dress Violet', slug: 'bianca-violet', price: 425000, categoryId: catMap['dress'],
    description: 'Dress tenun Bianca warna violet elegan. Bahan tenun premium dengan motif tradisional khas Jepara.',
    image: firstImg('foto_web_bianca_1') || '/images/placeholder.png' },
  { name: 'Dharma Dress Lime', slug: 'dharma-lime', price: 435000, categoryId: catMap['dress'],
    description: 'Dress tenun Dharma warna lime. Desain modern dengan sentuhan tenun ikat asli Jepara.',
    image: firstImg('foto_web_dharma_lime_') || '/images/placeholder.png' },
  { name: 'Dharma Dress Violet', slug: 'dharma-violet', price: 435000, categoryId: catMap['dress'],
    description: 'Dress tenun Dharma warna violet. Elegan dan cocok untuk acara formal maupun semi-formal.',
    image: firstImg('foto_web_dharma_1') || '/images/placeholder.png' },
  { name: 'Hazel Blouse Lime', slug: 'hazel-lime', price: 295000, categoryId: catMap['kimono'],
    description: 'Blouse tenun Hazel warna lime. Atasan ringan dengan motif tenun etnik yang cantik.',
    image: firstImg('foto_web_hazel_') || '/images/placeholder.png' },
  { name: 'Hazel Blouse Violet', slug: 'hazel-violet', price: 295000, categoryId: catMap['kimono'],
    description: 'Blouse tenun Hazel warna violet. Motif tenun tradisional dalam potongan blouse modern.',
    image: firstImg('foto_web_lime_') || '/images/placeholder.png' },
  { name: 'Jena Dress Burgundy', slug: 'jena-burgundy', price: 415000, categoryId: catMap['dress'],
    description: 'Dress tenun Jena warna burgundy elegan. Bahan tenun premium dengan motif klasik Jepara.',
    image: firstImg('foto_web_jena_') || '/images/placeholder.png' },
  { name: 'Becca Dress', slug: 'becca-dress', price: 405000, categoryId: catMap['dress'],
    description: 'Dress tenun Becca, potongan A-line yang flattering untuk semua bentuk tubuh. Tenun ikat asli Jepara.',
    image: 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-7r98y-lsptngi3f7zb01.webp' },
  { name: 'Dara Dress', slug: 'dara-dress', price: 390000, categoryId: catMap['dress'],
    description: 'Dress tenun Dara, kombinasi motif etnik kontemporer. Cocok untuk pesta dan acara spesial.',
    image: 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-7r98y-lw8um1ncpi6zc7.webp' },
  { name: 'Claudia Dress', slug: 'claudia-dress', price: 375000, categoryId: catMap['dress'],
    description: 'Dress tenun Claudia dengan desain timeless. Bahan tenun blangket nyaman, motif tradisional khas Jepara.',
    image: 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-23010-c4umr6iim8lv75-600x783.webp' },

  // Blazer
  { name: 'Aura Blazer', slug: 'aura-blazer', price: 485000, categoryId: catMap['blazer'],
    description: 'Aura blazer tenun dijual terpisah. Blazer tenun motif etnik, bisa dipadukan dengan dress atau skirt. Size XS-XXL. Khusus blazer tidak bisa custom.',
    image: 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-7r98s-lw8tx77vlk3hda.webp' },
  { name: 'Bamma Blazer', slug: 'bamma-blazer', price: 438000, categoryId: catMap['blazer'],
    description: 'Bamma blazer tenun dengan potongan modern. Cocok untuk tampil profesional dengan sentuhan budaya.',
    image: 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-7rbk9-mb1vit2d7d3y86.webp' },
  { name: 'Dirgayu Blazer', slug: 'dirgayu-blazer', price: 495000, categoryId: catMap['blazer'],
    description: 'Dirgayu blazer tenun premium. Motif tenun klasik Jepara dalam desain blazer kontemporer.',
    image: 'https://ikitenun.com/wp-content/uploads/2025/08/6-600x783.png' },

  // Set
  { name: 'Dinara Set Tenun', slug: 'dinara-set-tenun', price: 625000, categoryId: catMap['set'],
    description: 'Set tenun Dinara couple. Blazer + dress/kemeja senada. Cocok untuk couple outfit di acara formal.',
    image: 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-7rbk5-m71r6l0vt2t8c4.webp' },
  { name: 'Corra Set Tenun', slug: 'corra-set-tenun', price: 485000, categoryId: catMap['set'],
    description: 'Set tenun Corra couple matching. Kombinasi tenun ikat modern untuk tampil serasi bersama pasangan.',
    image: 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-7ras8-m2lvylvqb7x1e6.webp' },
  { name: 'Cempaka Set Black', slug: 'cempaka-black', price: 728000, categoryId: catMap['set'],
    description: 'Set tenun Cempaka warna hitam premium. Elegan dan berkelas, cocok untuk acara spesial.',
    image: 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-7ra0t-mcwb9v90pd7r77.webp' },
  { name: 'Callin Set Tenun', slug: 'callin-set-tenun', price: 530000, categoryId: catMap['set'],
    description: 'Set tenun Callin couple. Kemeja + dress tenun motif serasi. Bahan tenun premium Jepara.',
    image: 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-7rask-m1i1xsqnyytrad.webp' },

  // Kimono
  { name: 'Kalani Kimono Tenun', slug: 'kalani-kimono', price: 310000, categoryId: catMap['kimono'],
    description: 'Kimono tenun Kalani dengan motif etnik modern. Outerwear serbaguna, bisa dipadukan dengan outfit apapun.',
    image: 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-7rbk8-m71rii9pnqf0bc.webp' },
  { name: 'Sabell Kimono Tenun', slug: 'sabell-kimono', price: 310000, categoryId: catMap['kimono'],
    description: 'Kimono tenun Sabell. Desain longgar nyaman dengan tenun ikat khas Jepara.',
    image: 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-7rbk8-m71rii9pnqf0bc.webp' },
  { name: 'Harumi Blouse Tenun', slug: 'harumi-blouse', price: 285000, categoryId: catMap['kimono'],
    description: 'Blouse tenun Harumi. Atasan tenun ringan & nyaman untuk daily wear. Motif tenun asli.',
    image: 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-7r98r-lw8um1n2oise39.webp' },
];

const insertProd = db.prepare(`INSERT INTO "Product" ("id","name","slug","description","price","stock","categoryId","isActive","isFeatured","isNewArrival","tags","createdAt","updatedAt") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`);
const insertImg = db.prepare(`INSERT INTO "ProductImage" ("id","url","alt","sortOrder","productId") VALUES (?,?,?,?,?)`);

// Product slug -> image prefix for multi-image support
const imgPrefixMap = {
  'arum-dress': 'arum',
  'bianca-lime': 'foto_web_bianca_lime',
  'bianca-violet': 'foto_web_bianca_',
  'dharma-lime': 'foto_web_dharma_lime',
  'dharma-violet': 'foto_web_dharma_',
  'hazel-lime': 'foto_web_hazel_',
  'hazel-violet': 'foto_web_lime_',
  'jena-burgundy': 'foto_web_jena_',
  'berlin-dress': 'foto_web_berlin',
};

function findLocalImages(prefix) {
  return [...avail]
    .filter(f => f.startsWith(prefix))
    .sort()
    .map(f => '/images/products/' + f);
}

const insertAll = db.transaction(() => {
  for (const p of products) {
    const pid = cuid();
    const isFeatured = featuredSlugs.has(p.slug) ? 1 : 0;
    const isNewArrival = newArrivalSlugs.has(p.slug) ? 1 : 0;
    const now = new Date().toISOString();
    insertProd.run(
      pid, p.name, p.slug, p.description, p.price,
      rnd(10, 50), p.categoryId, 1, isFeatured, isNewArrival,
      makeTags(p.name, p.description), now, now
    );
    // Insert main image
    insertImg.run(cuid(), p.image, p.name, 0, pid);
    // Insert additional local images if available
    const prefix = imgPrefixMap[p.slug];
    if (prefix) {
      const extras = findLocalImages(prefix).filter(img => img !== p.image);
      extras.forEach((img, i) => {
        insertImg.run(cuid(), img, p.name + ' ' + (i + 2), i + 1, pid);
      });
    }
  }
});
insertAll();

// --- Dummy users for reviews ---
const reviewers = [
  { name: 'Siti Rahmawati', email: 'siti@example.com' },
  { name: 'Dewi Lestari', email: 'dewi@example.com' },
  { name: 'Putri Ayu', email: 'putri@example.com' },
  { name: 'Rina Wulandari', email: 'rina@example.com' },
  { name: 'Maya Sari', email: 'maya@example.com' },
  { name: 'Anisa Permata', email: 'anisa@example.com' },
  { name: 'Bunga Citra', email: 'bunga@example.com' },
  { name: 'Ratna Sari', email: 'ratna@example.com' },
];

const insertUser = db.prepare(`INSERT INTO "User" ("id","email","name","passwordHash","phone","role","createdAt","updatedAt") VALUES (?,?,?,?,?,?,?,?)`);
const reviewerIds = [];
for (const r of reviewers) {
  const rid = cuid();
  insertUser.run(rid, r.email, r.name, passwordHash, null, 'customer', now, now);
  reviewerIds.push(rid);
}

// --- Dummy reviews ---
const reviewTexts = [
  { rating: 5, comment: 'Kualitas tenunnya luar biasa! Motifnya indah dan jahitan sangat rapi. Puas banget!' },
  { rating: 5, comment: 'Bahannya premium, nyaman dipakai. Pengiriman juga cepat. Recommended seller!' },
  { rating: 4, comment: 'Bagus overall, cuma ukurannya agak kecil. Next time mungkin minta size lebih besar.' },
  { rating: 5, comment: 'Motif tenunnya autentik, benar-benar handmade. Keren abis!' },
  { rating: 4, comment: 'Warnanya sesuai foto. Bahan tebal tapi tetap adem. Cocok buat acara formal.' },
  { rating: 5, comment: 'Pesanan datang tepat waktu, packaging rapi. Tenunnya cantik, dapat banyak pujian!' },
  { rating: 3, comment: 'Kualitas oke, tapi pengiriman agak lama. Overall masih worth it sih.' },
  { rating: 5, comment: 'Sudah kedua kalinya beli di sini. Kualitas konsisten, tidak mengecewakan.' },
  { rating: 4, comment: 'Motifnya unik, jarang ada yang punya. Cuma agak kaku di awal, setelah dicuci jadi lembut.' },
  { rating: 5, comment: 'Pas banget dipakainya, ga terlalu ketat ga terlalu longgar. Love it!' },
  { rating: 5, comment: 'Kado buat ibu, beliau suka banget! Tenunnya cantik dan berkesan.' },
  { rating: 4, comment: 'Blazer tenun yang super keren. Bisa dipaduin sama jeans atau dress.' },
  { rating: 5, comment: 'Detail tenunnya luar biasa, setiap helai terasa keartisanannya.' },
  { rating: 4, comment: 'Kimono-nya versatile banget, bisa dipakai inner atau outer. Suka!' },
  { rating: 5, comment: 'Set tenun couple-nya perfect! Foto prewedding jadi makin estetik.' },
  { rating: 3, comment: 'Lumayan, tapi agak susah setrika. Harus pakai suhu rendah.' },
  { rating: 5, comment: 'Pengalaman belanja terbaik! Admin ramah, produk sesuai ekspektasi.' },
  { rating: 4, comment: 'Tenun asli Jepara, ga nyesel beli. Cuma harga segini worth it banget.' },
  { rating: 5, comment: 'Ga nyangka kualitasnya sebagus ini. Teman-teman pada nanya beli dimana!' },
  { rating: 5, comment: 'Terima kasih IKI TENUN! Tenunnya jadi favorit buat ke kantor.' },
];

const insertReview = db.prepare(`INSERT INTO "Review" ("id","rating","comment","userId","productId","createdAt") VALUES (?,?,?,?,?,?)`);

const productIds = db.prepare('SELECT "id" FROM "Product"').all().map(r => r.id);

const insertReviews = db.transaction(() => {
  for (const productId of productIds) {
    const numReviews = 2 + Math.floor(Math.random() * 2);
    const shuffledReviewers = [...reviewerIds].sort(() => Math.random() - 0.5).slice(0, numReviews);
    for (let i = 0; i < numReviews; i++) {
      const rv = reviewTexts[Math.floor(Math.random() * reviewTexts.length)];
      const daysAgo = Math.floor(Math.random() * 30) + 1;
      const reviewDate = new Date(Date.now() - daysAgo * 86400000).toISOString();
      insertReview.run(cuid(), rv.rating, rv.comment, shuffledReviewers[i], productId, reviewDate);
    }
  }
});
insertReviews();

const count = db.prepare('SELECT COUNT(*) as c FROM "Product"').get().c;
const catCount = db.prepare('SELECT COUNT(*) as c FROM "Category"').get().c;
const reviewCount = db.prepare('SELECT COUNT(*) as c FROM "Review"').get().c;
console.log(`Seed complete: ${count} products, ${catCount} categories, ${reviewCount} reviews, 1 admin user`);
db.close();
