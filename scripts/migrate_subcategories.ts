import { prisma } from "../src/lib/prisma";

// Subcategory migration map: product ID → subcategory slug
const subcategoryMigrations: Record<string, string> = {

  // ── BAGS & PURSES ──────────────────────────────────────────────────────────
  "cmukhc6or000204l0ifazzb4f": "handbags",        // باج كروشيه ورده مجسمه
  "cmukgvjcr000004lcmen9xx3v": "handbags",        // كولدر هارد هاند ميد فوري
  "cmubdnkl5000004jy04fcu1zy": "totes",           // Flowers tote bag
  "cmubdf3uv000004ldm3opqz7r": "totes",           // Tote bag crochet
  "cmtnn0chb000004l1ctdixd7d": "pouches-coin-purses", // Hand made crochet clutch
  "cmt4pizt4000004l2mfkyj79p": "handbags",        // شنطه هاند ميد
  "cmt1e32tz000004ld5la4y4xo": "handbags",        // Ruby Pearl Bag
  "cmt1b98kz000004lakcgapb18": "handbags",        // Pastel Cloud Mini Bag
  "cmt19qnqh000004l41i1haqd6": "handbags",        // Sunshine Summer Bag
  "cmsw1pouv000104lbf583teqa": "totes",           // باج كنفا هاند ميد بالكامل
  "cmsw1ajrk000004lbdr0yqter": "totes",           // باج كنفا هاند ميد
  "cmsrlamyc000004lbiw86hlg8": "pouches-coin-purses", // Mini bag
  "cmsqj3dy5000004kzim77k6h3": "pouches-coin-purses", // Mini bag
  "cmsqinbm3000004jw9dcncfb6": "pouches-coin-purses", // Blue one 🦋
  "cmsq6fa4u000104jlpyzv5ktq": "handbags",        // Joker bag
  "cmsq693m1000004jl9a357klk": "totes",           // Tote bag
  "cmsq658h9000004kzd1igm4y4": "handbags",        // Seashell bag
  "cmsnn2a6s000004l5k30uygaf": "pouches-coin-purses", // Crochet Donut Bag
  "cmp8dsd6p000004jjg24rinx1": "handbags",        // حقيبه يد بخيط الكليم

  // ── CLOTHING ───────────────────────────────────────────────────────────────
  "cmuaoxgpd000104jsqprzhs58": "clothing",        // ايس كاب كروشية (beanie)
  "cmt0qwlti000004ldfkbarc6l": "clothing",        // 70's vest
  "cmt0qow70000004ie5xaw9aut": "clothing",        // Cat eared Beanie
  "cmspbvlad000104ldbk8jiouy": "clothing",        // جوانتي للشتاء (winter gloves)

  // ── ACCESSORIES ────────────────────────────────────────────────────────────
  "cmuaopwao000104jwmkzf8swh": "accessories",     // عليقات شنط (bag charms)
  "cmsqj8ps2000104jp79rlh0h5": "accessories",     // Card holder
  "cmsqj0jc1000004jp3xm50wx9": "accessories",     // Laptop sleeve
  "cmsp2cfmy000004jo8sxjbgbi": "accessories",     // Lip stick holder
  "cmsp267l2000004jriuy9ukhe": "keychains-lanyards", // Crochet Initials Keychains
  "cmsn7sl9k000004l0btal7so1": "keychains-lanyards", // Crochet Octopus Keychain
  "cmpvmci3z000104jxre3sl21n": "accessories",     // جراب كتاب (book sleeve)
  "cmpvllh6h000004jxwzuvrfty": "accessories",     // فاصل كتاب (bookmark)
  "cmoe9fqif000004l2aq8aeg6n": "accessories",     // مقلمة خشبي (wooden pencil case)

  // ── HOME & LIVING ──────────────────────────────────────────────────────────
  "cmuaokcfk000004jqc4j6pxrn": "home-decor",     // كوستر عباد الشمس
  "cmsucmo2x000004jr3z8kxa08": "storage-organization", // Organizing box
  "cmsqiipd5000004jyqkoucvv1": "home-decor",     // Coaster
  "cmsnmhr0q000004l8lp3i9q3q": "home-decor",     // Crochet Heart Trinket Dish
  "cmpvo4sgh000004jybq6z89je": "home-decor",     // كوسترات اكواب
  "cmp4p72vr000004gtr26t18lu": "home-decor",     // قطع كونكريت
  "cmon3tihd000005ju61oyq2qv": "home-decor",     // مراءه بزهور الكروشيه (mirror)
  "cmoea7zzf000004jmvumx66pk": "home-decor",     // استاند بحرف E
  "cmoea43e8000204l2esprn8mb": "lighting",        // اباجورة بتصميم عصري
  "cmoe9x3wa000104l2qybz5wuc": "lighting",        // اباجورة بإسم من اختيارك
  "cmoe9jih1000104l77n7i20w0": "home-decor",     // استاند حرف S
  "cmoe98vdj000004juvjwp4gta": "home-decor",     // استاند حرف R
  "cmoe93oxt000004l7h85t07t0": "home-decor",     // استاند حرف M
  "cmoe8wp9n000004jts9bv3lup": "home-decor",     // استاند حرف H

  // ── JEWELRY ────────────────────────────────────────────────────────────────
  "cmt0qzyy4000104ievfhqpvu5": "bracelets",       // Midi bracelet (already correct cat)
  "cmspbreqi000004ldeirw8g6z": "necklaces",       // ميداليه وَنَس (medallion/pendant)
  "cmpvntq8p000004l7uz1hd2lr": "necklaces",       // ميدالية كوروشية أشكال

  // ── ART & COLLECTIBLES ─────────────────────────────────────────────────────
  "cmsp1hiqq000004l744wdlkoy": "dolls-and-miniatures", // Crochet Voodoo Doll

  // ── TOYS & GAMES ───────────────────────────────────────────────────────────
  "cmp8e97w8000004kzov2no3nd": "toys-and-games",  // دميه الينيكورن
  "cmp8dxl9h000004l7ceo5l9ba": "toys-and-games",  // دميه ولد بشعر كيرلي
  "cmon3n0ou000004jm32gc5zg1": "toys-and-games",  // دميه طفله بالوان الربيع

  // ── GIFTS & SETS ───────────────────────────────────────────────────────────
  "cmtoev5rd000004l7tia6vkcb": "gifts-sets",      // بوكيه ورد بينك
  "cmtnnk55z000004l8giyxqptr": "gifts-sets",      // بوكيه ورد ستان
  "cmon3df9s000104lb65swv8k2": "gifts-sets",      // Rana دميه التخرج

  // ── WEDDINGS ───────────────────────────────────────────────────────────────
  "cmtnneca8000004jpg5hew2g2": "weddings",        // mirror engagement plate

  // ── BATH & BEAUTY ──────────────────────────────────────────────────────────
  "cmulib4c70000ucf25cwo4ynf": "makeup-and-cosmetics", // JAJF
};

async function main() {
  console.log("🔄 Starting subcategory migration...\n");

  let successCount = 0;
  let skipCount = 0;

  for (const [productId, subcategory] of Object.entries(subcategoryMigrations)) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { id: true, name: true, category: true, subcategory: true }
      });

      if (!product) {
        console.log(`⚠️  SKIP  [${productId}] — not found in DB`);
        skipCount++;
        continue;
      }

      if (product.subcategory === subcategory) {
        console.log(`✅ SAME  "${product.name}" → already "${subcategory}"`);
        skipCount++;
        continue;
      }

      await prisma.product.update({
        where: { id: productId },
        data: { subcategory }
      });

      console.log(`✅ OK    "${product.name}"\n         [${product.category}] subcategory → ${subcategory}`);
      successCount++;
    } catch (err) {
      console.error(`❌ ERROR [${productId}]:`, err);
    }
  }

  console.log(`\n✅ Done! Updated ${successCount} products. Skipped ${skipCount}.`);
}

main()
  .catch(err => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
