import { prisma } from "../src/lib/prisma";

// Category migration map: product ID → new category slug
const migrations: Record<string, string> = {
  // JAJF → bath-and-beauty
  "cmulib4c70000ucf25cwo4ynf": "bath-and-beauty",

  // Bags & Purses (was: fashion / textiles / ceramics)
  "cmukhc6or000204l0ifazzb4f": "bags-and-purses",  // باج كروشيه ورده مجسمه
  "cmukgvjcr000004lcmen9xx3v": "bags-and-purses",  // كولدر هارد هاند ميد فوري
  "cmubdnkl5000004jy04fcu1zy": "bags-and-purses",  // Flowers tote bag
  "cmubdf3uv000004ldm3opqz7r": "bags-and-purses",  // Tote bag crochet
  "cmtnn0chb000004l1ctdixd7d": "bags-and-purses",  // Hand made crochet clutch
  "cmt4pizt4000004l2mfkyj79p": "bags-and-purses",  // شنطه هاند ميد (was ceramics - wrong!)
  "cmt1e32tz000004ld5la4y4xo": "bags-and-purses",  // Ruby Pearl Bag
  "cmt1b98kz000004lakcgapb18": "bags-and-purses",  // Pastel Cloud Mini Bag
  "cmt19qnqh000004l41i1haqd6": "bags-and-purses",  // Sunshine Summer Bag
  "cmsw1pouv000104lbf583teqa": "bags-and-purses",  // باج كنفا هاند ميد بالكامل
  "cmsw1ajrk000004lbdr0yqter": "bags-and-purses",  // باج كنفا هاند ميد
  "cmsrlamyc000004lbiw86hlg8": "bags-and-purses",  // Mini bag
  "cmsqj3dy5000004kzim77k6h3": "bags-and-purses",  // Mini bag
  "cmsqinbm3000004jw9dcncfb6": "bags-and-purses",  // Blue one 🦋
  "cmsq6fa4u000104jlpyzv5ktq": "bags-and-purses",  // Joker bag
  "cmsq693m1000004jl9a357klk": "bags-and-purses",  // Tote bag
  "cmsq658h9000004kzd1igm4y4": "bags-and-purses",  // Seashell bag
  "cmsnn2a6s000004l5k30uygaf": "bags-and-purses",  // Crochet Donut Bag
  "cmp8dsd6p000004jjg24rinx1": "bags-and-purses",  // حقيبه يد بخيط الكليم

  // Clothing (was: fashion / art-collectibles)
  "cmuaoxgpd000104jsqprzhs58": "clothing",  // ايس كاب كروشية
  "cmt0qwlti000004ldfkbarc6l": "clothing",  // 70's vest
  "cmt0qow70000004ie5xaw9aut": "clothing",  // Cat eared Beanie
  "cmspbvlad000104ldbk8jiouy": "clothing",  // جوانتي للشتاء

  // Accessories (was: fashion / art-collectibles / textiles / jewelry)
  "cmuaopwao000104jwmkzf8swh": "accessories",  // عليقات شنط (bag charms)
  "cmsqj8ps2000104jp79rlh0h5": "accessories",  // Card holder
  "cmsqj0jc1000004jp3xm50wx9": "accessories",  // Laptop sleeve
  "cmsp2cfmy000004jo8sxjbgbi": "accessories",  // Lip stick holder
  "cmsp267l2000004jriuy9ukhe": "accessories",  // Crochet Initials Keychains
  "cmsn7sl9k000004l0btal7so1": "accessories",  // Crochet Octopus Keychain
  "cmpvmci3z000104jxre3sl21n": "accessories",  // جراب كتاب مميز للقراء
  "cmpvllh6h000004jxwzuvrfty": "accessories",  // فاصل كتاب اشكال
  "cmoe9fqif000004l2aq8aeg6n": "accessories",  // مقلمة خشبي (wooden pencil case)

  // Home & Living (was: fashion / textiles / art-collectibles / ceramics / woodwork)
  "cmuaokcfk000004jqc4j6pxrn": "home-and-living",  // كوستر عباد الشمس
  "cmsucmo2x000004jr3z8kxa08": "home-and-living",  // Organizing box
  "cmsqiipd5000004jyqkoucvv1": "home-and-living",  // Coaster
  "cmsnmhr0q000004l8lp3i9q3q": "home-and-living",  // Crochet Heart Trinket Dish
  "cmpvo4sgh000004jybq6z89je": "home-and-living",  // كوسترات اكواب
  "cmp4p72vr000004gtr26t18lu": "home-and-living",  // قطع كونكريت
  "cmon3tihd000005ju61oyq2qv": "home-and-living",  // مراءه بزهور الكروشيه الانيقه
  "cmoea7zzf000004jmvumx66pk": "home-and-living",  // استاند بحرف E
  "cmoea43e8000204l2esprn8mb": "home-and-living",  // اباجورة بتصميم عصري
  "cmoe9x3wa000104l2qybz5wuc": "home-and-living",  // اباجورة بإسم من اختيارك
  "cmoe9jih1000104l77n7i20w0": "home-and-living",  // استاند حرف S
  "cmoe98vdj000004juvjwp4gta": "home-and-living",  // استاند حرف R
  "cmoe93oxt000004l7h85t07t0": "home-and-living",  // استاند حرف M
  "cmoe8wp9n000004jts9bv3lup": "home-and-living",  // استاند حرف H

  // Jewelry (was: art-collectibles / textiles)
  "cmspbreqi000004ldeirw8g6z": "jewelry",  // ميداليه وَنَس (medallion/pendant)
  "cmpvntq8p000004l7uz1hd2lr": "jewelry",  // ميدالية كوروشية أشكال

  // Art & Collectibles (fix slug: art-collectibles → art-and-collectibles)
  "cmsp1hiqq000004l744wdlkoy": "art-and-collectibles",  // Crochet Voodoo Doll

  // Toys & Games (was: personalized)
  "cmp8e97w8000004kzov2no3nd": "toys-and-games",  // دميه الينيكورن بألوان الباستيل
  "cmp8dxl9h000004l7ceo5l9ba": "toys-and-games",  // دميه ولد بشعر كيرلي
  "cmon3n0ou000004jm32gc5zg1": "toys-and-games",  // دميه طفله بالوان الربيع مبهجه

  // Gifts & Sets (was: gift-boxes-sets → gifts-sets)
  "cmtoev5rd000004l7tia6vkcb": "gifts-sets",  // بوكيه ورد بينك
  "cmtnnk55z000004l8giyxqptr": "gifts-sets",  // بوكيه ورد ستان
  "cmon3df9s000104lb65swv8k2": "gifts-sets",  // Rana دميه التخرج ل 2026

  // Weddings (fix slug: wedding → weddings)
  "cmtnneca8000004jpg5hew2g2": "weddings",  // mirror engagement plate
};

async function main() {
  console.log("🔄 Starting category migration...\n");

  let successCount = 0;
  let skipCount = 0;

  for (const [productId, newCategory] of Object.entries(migrations)) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { id: true, name: true, category: true }
      });

      if (!product) {
        console.log(`⚠️  SKIP  [${productId}] — not found in DB`);
        skipCount++;
        continue;
      }

      if (product.category === newCategory) {
        console.log(`✅ SAME  "${product.name}" → already "${newCategory}"`);
        skipCount++;
        continue;
      }

      await prisma.product.update({
        where: { id: productId },
        data: { category: newCategory }
      });

      console.log(`✅ OK    "${product.name}"\n         ${product.category} → ${newCategory}`);
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
