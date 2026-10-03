"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { 
  Search, ChevronRight, ArrowLeft, Check, Sparkles, X, 
  Home, Gem, Shirt, Package, Brush, Heart, PencilLine, History,
  Edit2, FolderTree, Glasses, ShoppingBag, Footprints, Scissors,
  Baby, Gamepad2, Dog, Smartphone, BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface EtsyCategoryPickerProps {
  value: string;
  onChange: (category: string) => void;
  dict: any;
  disabled?: boolean;
}

interface SubcategoryItem {
  id: string;
  label: string;
  keywords: string[];
}

interface DepartmentGroup {
  department: string;
  slug: string;
  icon: any;
  subcategories: SubcategoryItem[];
}

export function EtsyCategoryPicker({ value, onChange, dict, disabled = false }: EtsyCategoryPickerProps) {
  const isAr = dict?.common?.home === "الرئيسية" || dict?.common?.search?.includes("ابحث");
  const [isOpen, setIsOpen] = useState(!value);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentGroup | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close drilldown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (value && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const departments: DepartmentGroup[] = useMemo(() => [
    {
      department: (dict as any).common?.categories_list?.["home-and-living"] || (dict as any).home?.categories_list?.["home-and-living"] || "Home & Living",
      slug: "home-and-living",
      icon: Home,
      subcategories: [
        {
          id: "home-decor",
          label: (dict as any).common?.categories_list?.["home-decor"] || (isAr ? "ديكور منزلي وتحف" : "Home Decor"),
          keywords: ["home decor", "decor", "vase", "candle", "wall art", "clock", "mirror", "pottery", "ceramics", "ديكور", "فازة", "شمع", "سيراميك", "خزف", "مرآة", "ساعة حائط"]
        },
        {
          id: "lighting",
          label: (dict as any).common?.categories_list?.["lighting"] || (isAr ? "إضاءة ووحدات إنارة" : "Lighting"),
          keywords: ["lighting", "lamp", "lantern", "chandelier", "sconce", "fanoos", "إضاءة", "أباجورة", "مصباح", "فانوس", "نجفة"]
        },
        {
          id: "floor-rugs",
          label: (dict as any).common?.categories_list?.["floor-rugs"] || (isAr ? "سجاد ومفروشات أرضية" : "Floor & Rugs"),
          keywords: ["rug", "carpet", "kilim", "runner", "doormat", "tapestry", "سجاد", "كليم", "موكيت", "مشاية", "منسوجات"]
        },
        {
          id: "kitchen-dining",
          label: (dict as any).common?.categories_list?.["kitchen-dining"] || (isAr ? "مطبخ وأدوات مائدة" : "Kitchen & Dining"),
          keywords: ["kitchen", "dining", "tableware", "mug", "bowl", "plate", "cutting board", "coasters", "مطبخ", "صحون", "أطباق", "مج", "فناجين", "صينية", "لوح تقطيع"]
        },
        {
          id: "furniture",
          label: (dict as any).common?.categories_list?.["furniture"] || (isAr ? "أثاث منزلي" : "Furniture"),
          keywords: ["furniture", "table", "chair", "stool", "shelf", "bench", "coffee table", "أثاث", "طاولة", "كرسي", "رفوف", "ترابيزة"]
        },
        {
          id: "bathroom",
          label: (dict as any).common?.categories_list?.["bathroom"] || (isAr ? "مستلزمات الحمام" : "Bathroom"),
          keywords: ["bathroom", "towel", "bath mat", "shower curtain", "soap dispenser", "حمام", "فوط", "ستارة حمام", "موزع صابون"]
        },
        {
          id: "storage-organization",
          label: (dict as any).common?.categories_list?.["storage-organization"] || (isAr ? "تخزين وتنظيم منزلي" : "Storage & Organization"),
          keywords: ["storage", "basket", "organizer", "box", "bin", "hooks", "سلال", "صندوق تخزين", "منظم", "شماعة", "خوص"]
        },
        {
          id: "outdoor-gardening",
          label: (dict as any).common?.categories_list?.["outdoor-gardening"] || (isAr ? "حدائق ومساحات خارجية" : "Outdoor & Gardening"),
          keywords: ["gardening", "planter", "flower pot", "garden decor", "bird feeder", "حديقة", "أصيص زرع", "فازة زرع", "نباتات"]
        },
        {
          id: "curtains-window-treatments",
          label: (dict as any).common?.categories_list?.["curtains-window-treatments"] || (isAr ? "ستائر وتجهيزات نوافذ" : "Curtains & Window Treatments"),
          keywords: ["curtains", "drapes", "blinds", "valances", "window", "ستائر", "ستارة", "برقع", "شيش"]
        },
        {
          id: "bedding",
          label: (dict as any).common?.categories_list?.["bedding"] || (isAr ? "مفروشات سرير وأغطية" : "Bedding"),
          keywords: ["bedding", "quilt", "duvet", "sheets", "pillowcase", "blanket", "مفارش سرير", "لحاف", "ملايات", "وسادة", "بطانية"]
        },
        {
          id: "office",
          label: (dict as any).common?.categories_list?.["office"] || (isAr ? "مكتب ومستلزمات عمل" : "Office"),
          keywords: ["office", "desk", "desk organizer", "pen holder", "mousepad", "مكتب", "منظم مكتب", "مقلمة", "أدوات مكتبية"]
        },
        {
          id: "food-drink",
          label: (dict as any).common?.categories_list?.["food-drink"] || (isAr ? "أطعمة ومشروبات حرفية" : "Food & Drink"),
          keywords: ["food", "drink", "coffee", "tea", "honey", "spices", "jam", "olive oil", "طعام", "شاي", "قهوة", "عسل", "توابل", "مربى"]
        },
        {
          id: "spirituality-religion",
          label: (dict as any).common?.categories_list?.["spirituality-religion"] || (isAr ? "روحانيات ومقتنيات دينية" : "Spirituality & Religion"),
          keywords: ["spirituality", "religion", "rosary", "sebha", "prayer rug", "incense", "quran stand", "سبحة", "سجادة صلاة", "بخور", "حامل مصحف", "روحانيات"]
        },
        {
          id: "home-improvement",
          label: (dict as any).common?.categories_list?.["home-improvement"] || (isAr ? "تحسين وصيانة المنزل" : "Home Improvement"),
          keywords: ["home improvement", "knobs", "handles", "hardware", "tiles", "wallpaper", "مقابض", "سيراميك حوائط", "ورق حائط", "صيانة"]
        },
        {
          id: "home-appliances",
          label: (dict as any).common?.categories_list?.["home-appliances"] || (isAr ? "أجهزة منزلية" : "Home Appliances"),
          keywords: ["home appliances", "heater", "fan", "coffee maker", "diffuser", "أجهزة منزلية", "دفاية", "مروحة", "فواحة كهربائية"]
        },
        {
          id: "cleaning-supplies",
          label: (dict as any).common?.categories_list?.["cleaning-supplies"] || (isAr ? "مستلزمات تنظيف" : "Cleaning Supplies"),
          keywords: ["cleaning supplies", "broom", "duster", "natural cleaner", "brush", "أدوات تنظيف", "مكنسة قش", "فرشاة تنظيف"]
        },
        {
          id: "home-and-living",
          label: (dict as any).common?.categories_list?.["home-and-living"] || "General Home & Living",
          keywords: ["home", "living", "house", "decor", "منزل", "بيت", "ديكور"]
        }
      ]
    },
    {
      department: (dict as any).common?.categories_list?.["jewelry"] || (dict as any).home?.categories_list?.["jewelry"] || "Jewelry",
      slug: "jewelry",
      icon: Gem,
      subcategories: [
        {
          id: "earrings",
          label: (dict as any).common?.categories_list?.["earrings"] || (isAr ? "أقراط وحلقان" : "Earrings"),
          keywords: ["earring", "earrings", "studs", "hoops", "drop earrings", "dangle", "حلق", "حلقان", "أقراط", "فضة", "ذهب"]
        },
        {
          id: "necklaces",
          label: (dict as any).common?.categories_list?.["necklaces"] || (isAr ? "قلائد وسلاسل وعقود" : "Necklaces"),
          keywords: ["necklace", "pendant", "choker", "chain", "locket", "عقد", "سلسلة", "قلادة", "دلاية"]
        },
        {
          id: "rings",
          label: (dict as any).common?.categories_list?.["rings"] || (isAr ? "خواتم ومحابس" : "Rings"),
          keywords: ["ring", "band", "solitaire", "signet ring", "gemstone ring", "خاتم", "دبلة", "محبس", "فص"]
        },
        {
          id: "bracelets",
          label: (dict as any).common?.categories_list?.["bracelets"] || (isAr ? "أساور وغوايش" : "Bracelets"),
          keywords: ["bracelet", "bangle", "cuff", "charm bracelet", "beaded bracelet", "سوار", "إسورة", "غوايش", "انسيال"]
        },
        {
          id: "watches",
          label: (dict as any).common?.categories_list?.["watches"] || (isAr ? "ساعات يد" : "Watches"),
          keywords: ["watch", "wrist watch", "pocket watch", "leather strap watch", "ساعة", "ساعة يد", "ساعات", "ساعة جيب"]
        },
        {
          id: "jewelry-sets",
          label: (dict as any).common?.categories_list?.["jewelry-sets"] || (isAr ? "أطقم مجوهرات متكاملة" : "Jewelry Sets"),
          keywords: ["jewelry set", "matching set", "bridal set", "necklace and earrings", "طقم مجوهرات", "طقم كامل", "طقم عروسة"]
        },
        {
          id: "body-jewelry",
          label: (dict as any).common?.categories_list?.["body-jewelry"] || (isAr ? "مجوهرات وحلي الجسم" : "Body Jewelry"),
          keywords: ["body jewelry", "anklet", "belly chain", "nose ring", "toe ring", "خلخال", "سلسلة خصر", "بيرسينج", "حلق أنف"]
        },
        {
          id: "cremation-memorial-jewelry",
          label: (dict as any).common?.categories_list?.["cremation-memorial-jewelry"] || (isAr ? "مجوهرات تذكارية ومخلدة" : "Cremation & Memorial Jewelry"),
          keywords: ["memorial jewelry", "keepsake jewelry", "fingerprint jewelry", "urn necklace", "مجوهرات تذكارية", "حلي مخلدة", "قلادة تذكار"]
        },
        {
          id: "jewelry-storage",
          label: (dict as any).common?.categories_list?.["jewelry-storage"] || (isAr ? "صناديق وحافظات مجوهرات" : "Jewelry Storage"),
          keywords: ["jewelry box", "jewelry stand", "jewelry dish", "travel case", "صندوق مجوهرات", "علبة مجوهرات", "حامل خواتم"]
        },
        {
          id: "brooches-pins-clips",
          label: (dict as any).common?.categories_list?.["brooches-pins-clips"] || (isAr ? "بروشات ودبابيس وملاقط" : "Brooches, Pins & Clips"),
          keywords: ["brooch", "pin", "lapel pin", "enamel pin", "clip", "بروش", "دبوس", "دبوس بدلة", "بروش فضة"]
        },
        {
          id: "smart-jewelry",
          label: (dict as any).common?.categories_list?.["smart-jewelry"] || (isAr ? "مجوهرات ذكية" : "Smart Jewelry"),
          keywords: ["smart jewelry", "nfc ring", "smart bracelet", "fitness jewelry", "مجوهرات ذكية", "خاتم ذكي", "سوار ذكي"]
        },
        {
          id: "cuff-links-tie-clips",
          label: (dict as any).common?.categories_list?.["cuff-links-tie-clips"] || (isAr ? "أزرار أكمام وملاقط كرفتات" : "Cuff Links & Tie Clips"),
          keywords: ["cuff links", "tie clip", "tie bar", "suit accessories", "أزرار أكمام", "مشبك كرافتة", "كبك"]
        },
        {
          id: "jewelry",
          label: (dict as any).common?.categories_list?.["jewelry"] || "General Jewelry",
          keywords: ["jewelry", "gold", "silver", "gemstones", "مجوهرات", "ذهب", "فضة", "أحجار كريمة"]
        }
      ]
    },
    {
      department: (dict as any).common?.categories_list?.["clothing"] || (dict as any).home?.categories_list?.["clothing"] || "Clothing",
      slug: "clothing",
      icon: Shirt,
      subcategories: [
        {
          id: "womens-clothing",
          label: (dict as any).common?.categories_list?.["womens-clothing"] || (isAr ? "ملابس نسائية" : "Women's Clothing"),
          keywords: ["women", "womens clothing", "dress", "skirt", "blouse", "robe", "abaya", "فستان", "عباية", "بلوزة", "ملابس نسائية", "ملابس حريمي", "تنورة"]
        },
        {
          id: "mens-clothing",
          label: (dict as any).common?.categories_list?.["mens-clothing"] || (isAr ? "ملابس رجالية" : "Men's Clothing"),
          keywords: ["men", "mens clothing", "shirt", "pants", "suit", "jacket", "linen shirt", "قميص", "بنطلون", "بدلة", "جاكيت", "ملابس رجالية", "ملابس رجالي"]
        },
        {
          id: "boys-clothing",
          label: (dict as any).common?.categories_list?.["boys-clothing"] || (isAr ? "ملابس أولاد" : "Boys' Clothing"),
          keywords: ["boys", "boys clothing", "kids", "boy shirt", "boy pants", "ملابس أولاد", "أولادي", "قميص أولاد", "بنطلون أولاد"]
        },
        {
          id: "girls-clothing",
          label: (dict as any).common?.categories_list?.["girls-clothing"] || (isAr ? "ملابس بنات" : "Girls' Clothing"),
          keywords: ["girls", "girls clothing", "girl dress", "skirt", "frock", "ملابس بنات", "بناتي", "فستان بنات", "جيبة بناتي"]
        },
        {
          id: "gender-neutral-adult-clothing",
          label: (dict as any).common?.categories_list?.["gender-neutral-adult-clothing"] || (isAr ? "ملابس للجنسين (كبار)" : "Gender-Neutral Adult Clothing"),
          keywords: ["unisex", "gender neutral", "adult clothing", "hoodie", "tee", "sweatshirt", "ملابس للجنسين", "يونيسكس", "سويت شيرت", "هودي"]
        },
        {
          id: "gender-neutral-kids-clothing",
          label: (dict as any).common?.categories_list?.["gender-neutral-kids-clothing"] || (isAr ? "ملابس أطفال للجنسين" : "Gender-Neutral Kids' Clothing"),
          keywords: ["unisex kids", "gender neutral kids", "kids clothing", "baby clothes", "romper", "ملابس أطفال للجنسين", "أطفال يونيسكس", "سلوبت"]
        },
        {
          id: "clothing",
          label: (dict as any).common?.categories_list?.["clothing"] || "General Clothing",
          keywords: ["clothing", "apparel", "wear", "linen", "fashion", "أزياء", "ملابس"]
        }
      ]
    },
    {
      department: (dict as any).common?.categories_list?.["bags-and-purses"] || (dict as any).home?.categories_list?.["bags-and-purses"] || "Bags & Purses",
      slug: "bags-and-purses",
      icon: ShoppingBag,
      subcategories: [
        {
          id: "handbags",
          label: (dict as any).common?.categories_list?.["handbags"] || (isAr ? "حقائب يد" : "Handbags"),
          keywords: ["handbag", "purse", "shoulder bag", "crossbody", "clutch", "leather handbag", "حقيبة يد", "شنطة يد", "كروس", "شنطة كتف"]
        },
        {
          id: "totes",
          label: (dict as any).common?.categories_list?.["totes"] || (isAr ? "حقائب قماشية وتوت باج" : "Totes"),
          keywords: ["tote", "tote bag", "canvas tote", "linen tote", "shopper", "توت باج", "شنطة قماش", "حقيبة قماش"]
        },
        {
          id: "backpacks",
          label: (dict as any).common?.categories_list?.["backpacks"] || (isAr ? "حقائب ظهر" : "Backpacks"),
          keywords: ["backpack", "rucksack", "knapsack", "leather backpack", "school bag", "حقيبة ظهر", "شنطة ظهر"]
        },
        {
          id: "wallets-money-clips",
          label: (dict as any).common?.categories_list?.["wallets-money-clips"] || (isAr ? "محافظ وملاقط نقود" : "Wallets & Money Clips"),
          keywords: ["wallet", "money clip", "bifold", "cardholder", "leather wallet", "محفظة", "حافظة كروت", "ملقط نقود", "محفظة جلد"]
        },
        {
          id: "pouches-coin-purses",
          label: (dict as any).common?.categories_list?.["pouches-coin-purses"] || (isAr ? "أكياس صغيرة ومحافظ نقود معدنية" : "Pouches & Coin Purses"),
          keywords: ["pouch", "coin purse", "change purse", "zipper pouch", "drawstring pouch", "محفظة فكة", "كيس صغير", "محفظة صغيرة"]
        },
        {
          id: "cosmetic-toiletry-storage",
          label: (dict as any).common?.categories_list?.["cosmetic-toiletry-storage"] || (isAr ? "حقائب مكياج ومستحضرات تجميل" : "Cosmetic & Toiletry Storage"),
          keywords: ["cosmetic bag", "makeup bag", "toiletry bag", "dopp kit", "beauty case", "شنطة مكياج", "حقيبة أدوات عناية", "شنطة ميك أب"]
        },
        {
          id: "luggage-travel",
          label: (dict as any).common?.categories_list?.["luggage-travel"] || (isAr ? "حقائب سفر وأمتعة" : "Luggage & Travel"),
          keywords: ["luggage", "travel bag", "duffel bag", "weekender", "overnight bag", "suitcase", "شنطة سفر", "حقيبة أمتعة", "دفل باج"]
        },
        {
          id: "fanny-packs",
          label: (dict as any).common?.categories_list?.["fanny-packs"] || (isAr ? "حقائب خصر وحقائب حزام" : "Fanny Packs"),
          keywords: ["fanny pack", "belt bag", "waist bag", "bum bag", "hip pack", "شنطة وسط", "حقيبة خصر", "شنطة حزام"]
        },
        {
          id: "messenger-bags",
          label: (dict as any).common?.categories_list?.["messenger-bags"] || (isAr ? "حقائب ساعي البريد ولابتوب" : "Messenger Bags"),
          keywords: ["messenger bag", "courier bag", "satchel", "laptop bag", "briefcase", "شنطة ساعي", "حقيبة لابتوب", "شنطة بريد"]
        },
        {
          id: "market-bags",
          label: (dict as any).common?.categories_list?.["market-bags"] || (isAr ? "حقائب تسوق وشباك سوق" : "Market Bags"),
          keywords: ["market bag", "grocery bag", "net bag", "string bag", "straw bag", "basket bag", "شنطة تسوق", "حقيبة سوق", "شنطة خوص"]
        },
        {
          id: "accessory-cases",
          label: (dict as any).common?.categories_list?.["accessory-cases"] || (isAr ? "حافظات إكسسوارات ونظارات" : "Accessory Cases"),
          keywords: ["accessory case", "sunglasses case", "pen case", "cable pouch", "jewelry roll", "حافظة نظارات", "مقلمة", "جراب إكسسوارات"]
        },
        {
          id: "food-insulated-bags",
          label: (dict as any).common?.categories_list?.["food-insulated-bags"] || (isAr ? "حقائب طعام وحقائب حرارية" : "Food & Insulated Bags"),
          keywords: ["lunch bag", "insulated bag", "cooler bag", "bento bag", "thermal bag", "شنطة لانش بوكس", "حقيبة حرارية", "شنطة طعام"]
        },
        {
          id: "clothing-shoe-bags",
          label: (dict as any).common?.categories_list?.["clothing-shoe-bags"] || (isAr ? "حقائب ملابس وأحذية" : "Clothing & Shoe Bags"),
          keywords: ["garment bag", "shoe bag", "suit cover", "laundry bag", "travel shoe pouch", "شنطة جزم", "كفر بدل", "حقيبة أحذية"]
        },
        {
          id: "diaper-bags",
          label: (dict as any).common?.categories_list?.["diaper-bags"] || (isAr ? "حقائب أمهات ومستلزمات رضع" : "Diaper Bags"),
          keywords: ["diaper bag", "nappy bag", "baby bag", "maternity bag", "شنطة بيبى", "شنطة حفاضات", "حقيبة أمومة"]
        },
        {
          id: "sports-bags",
          label: (dict as any).common?.categories_list?.["sports-bags"] || (isAr ? "حقائب رياضية وجيم" : "Sports Bags"),
          keywords: ["sports bag", "gym bag", "yoga mat bag", "fitness bag", "athletic bag", "شنطة جيم", "حقيبة رياضية", "شنطة يوجا"]
        },
        {
          id: "leatherwork",
          label: (dict as any).common?.categories_list?.["leatherwork"] || (dict as any).home?.categories_list?.["leatherwork"] || dict.common?.leatherwork || "Handcrafted Leather Bags & Goods",
          keywords: ["leather", "bag", "wallet", "purse", "backpack", "tote", "belt", "جلد", "حقيبة", "شنطة", "محفظة", "حزام"]
        },
        {
          id: "bags-and-purses",
          label: (dict as any).common?.categories_list?.["bags-and-purses"] || "General Bags & Purses",
          keywords: ["bag", "purse", "handbag", "شنط", "حقائب"]
        }
      ]
    },
    {
      department: (dict as any).common?.categories_list?.["accessories"] || (dict as any).home?.categories_list?.["accessories"] || "Accessories",
      slug: "accessories",
      icon: Glasses,
      subcategories: [
        {
          id: "hair-accessories",
          label: (dict as any).common?.categories_list?.["hair-accessories"] || (isAr ? "إكسسوارات الشعر" : "Hair Accessories"),
          keywords: ["hair", "hairpin", "clip", "barrette", "headband", "scrunchie", "tiara", "comb", "شعر", "توكة شعر", "بنسة", "طوق", "مشبك شعر"]
        },
        {
          id: "hats-headwear",
          label: (dict as any).common?.categories_list?.["hats-headwear"] || (isAr ? "قبعات وأغطية رأس" : "Hats & Headwear"),
          keywords: ["hat", "cap", "beret", "beanie", "sun hat", "fedora", "turban", "fascinator", "headwear", "قبعة", "طاقية", "برنيطة", "تربان"]
        },
        {
          id: "patches-applique",
          label: (dict as any).common?.categories_list?.["patches-applique"] || (isAr ? "شارات وباتشات وتطريز" : "Patches & Appliqués"),
          keywords: ["patch", "patches", "appliqué", "iron-on", "embroidered patch", "badge", "باتش", "بادج", "شارة", "تطريز"]
        },
        {
          id: "keychains-lanyards",
          label: (dict as any).common?.categories_list?.["keychains-lanyards"] || (isAr ? "ميداليات وحوامل مفاتيح" : "Keychains & Lanyards"),
          keywords: ["keychain", "fob", "charm", "lanyard", "key ring", "ميدالية", "سلسلة مفاتيح", "حامل بطاقة"]
        },
        {
          id: "scarves-wraps",
          label: (dict as any).common?.categories_list?.["scarves-wraps"] || (isAr ? "أوشحة وشيلان" : "Scarves & Wraps"),
          keywords: ["scarf", "wrap", "shawl", "pashmina", "hijab", "bandana", "infinity scarf", "شال", "طرحة", "كوفية", "وشاح"]
        },
        {
          id: "belts-suspenders",
          label: (dict as any).common?.categories_list?.["belts-suspenders"] || (isAr ? "أحزمة وحمالات" : "Belts & Suspenders"),
          keywords: ["belt", "suspenders", "buckle", "leather belt", "waistband", "حزام", "حمالات", "توكة حزام"]
        },
        {
          id: "pins-clips",
          label: (dict as any).common?.categories_list?.["pins-clips"] || (isAr ? "دبابيس وبروشات" : "Pins & Clips"),
          keywords: ["pin", "pins", "clip", "brooch", "lapel pin", "enamel pin", "بروش", "دبوس", "دبوس بدلة"]
        },
        {
          id: "gloves-sleeves",
          label: (dict as any).common?.categories_list?.["gloves-sleeves"] || (isAr ? "قفازات وأكمام" : "Gloves & Sleeves"),
          keywords: ["gloves", "mittens", "fingerless gloves", "arm warmers", "sleeves", "قفازات", "جوانتي", "أكمام"]
        },
        {
          id: "costume-accessories",
          label: (dict as any).common?.categories_list?.["costume-accessories"] || (isAr ? "إكسسوارات تنكرية واستعراضية" : "Costume Accessories"),
          keywords: ["costume", "cosplay", "wings", "wand", "cape", "crown", "تنكري", "أزياء تنكرية", "تاج"]
        },
        {
          id: "sunglasses-eyewear",
          label: (dict as any).common?.categories_list?.["sunglasses-eyewear"] || (isAr ? "نظارات شمسية وملحقاتها" : "Sunglasses & Eyewear"),
          keywords: ["sunglasses", "glasses", "eyewear", "glasses chain", "case", "نظارة", "نظارات شمسية", "سلسلة نظارة"]
        },
        {
          id: "bouquets-corsages",
          label: (dict as any).common?.categories_list?.["bouquets-corsages"] || (isAr ? "باقات ورد وبروشات زهور" : "Bouquets & Corsages"),
          keywords: ["bouquet", "corsage", "boutonniere", "flower", "dried flowers", "باقة ورد", "بوكيه", "وردة بدلة"]
        },
        {
          id: "aprons",
          label: (dict as any).common?.categories_list?.["aprons"] || (isAr ? "مرايل ومآزر عمل ومطبخ" : "Aprons"),
          keywords: ["apron", "kitchen apron", "cooking apron", "craft apron", "linen apron", "مريلة", "مريلة مطبخ", "مريلة عمل"]
        },
        {
          id: "suit-tie-accessories",
          label: (dict as any).common?.categories_list?.["suit-tie-accessories"] || (isAr ? "إكسسوارات البدلة وربطات العنق" : "Suit & Tie Accessories"),
          keywords: ["tie", "cufflinks", "tie clip", "bowtie", "pocket square", "cravat", "كرافتة", "أزرار أكمام", "ببيونة", "منديل بدلة"]
        },
        {
          id: "umbrellas-rain-accessories",
          label: (dict as any).common?.categories_list?.["umbrellas-rain-accessories"] || (isAr ? "مظلات وإكسسوارات المطر" : "Umbrellas & Rain Accessories"),
          keywords: ["umbrella", "rain", "parasol", "raincoat", "مظلة", "شمسية", "واقي مطر"]
        },
        {
          id: "face-masks-accessories",
          label: (dict as any).common?.categories_list?.["face-masks-accessories"] || (isAr ? "كمامات وأقنعة وملحقاتها" : "Face Masks & Accessories"),
          keywords: ["mask", "face mask", "mask chain", "mask lanyard", "كمامة", "ماسك", "سلسلة كمامة"]
        },
        {
          id: "hand-fans",
          label: (dict as any).common?.categories_list?.["hand-fans"] || (isAr ? "مراوح يد تقليدية" : "Hand Fans"),
          keywords: ["hand fan", "folding fan", "paper fan", "bamboo fan", "مروحة يد", "مهواة", "مروحة ورقية"]
        },
        {
          id: "collars",
          label: (dict as any).common?.categories_list?.["collars"] || (isAr ? "ياقات وأطواق عنق مزخرفة" : "Collars"),
          keywords: ["collar", "peter pan collar", "detachable collar", "lace collar", "choker collar", "ياقة", "كوليه", "ياقة دانتيل"]
        },
        {
          id: "accessories",
          label: (dict as any).common?.categories_list?.["accessories"] || "General Accessories",
          keywords: ["accessories", "accessory", "إكسسوارات"]
        }
      ]
    },
    {
      department: (dict as any).common?.categories_list?.["art-and-collectibles"] || (dict as any).home?.categories_list?.["art-and-collectibles"] || "Art & Collectibles",
      slug: "art-and-collectibles",
      icon: Brush,
      subcategories: [
        {
          id: "prints",
          label: (dict as any).common?.categories_list?.["prints"] || (isAr ? "مطبوعات فنية" : "Prints"),
          keywords: ["print", "prints", "art print", "giclée", "woodcut", "lithograph", "poster", "طباعة", "مطبوعات", "بوستر", "طباعة فنية"]
        },
        {
          id: "painting",
          label: (dict as any).common?.categories_list?.["painting"] || (isAr ? "لوحات تشكيلية ورسم" : "Painting"),
          keywords: ["painting", "paintings", "oil painting", "acrylic", "watercolor", "canvas", "لوحة", "رسم زيتي", "ألوان مائية", "كانفس", "لوحات"]
        },
        {
          id: "sculpture",
          label: (dict as any).common?.categories_list?.["sculpture"] || (isAr ? "منحوتات ومجسمات" : "Sculpture"),
          keywords: ["sculpture", "statue", "bronze", "stone carving", "wood sculpture", "clay sculpture", "تمثال", "منحوتة", "مجسم", "نحت"]
        },
        {
          id: "collectibles",
          label: (dict as any).common?.categories_list?.["collectibles"] || (isAr ? "مقتنيات وتحف نادرة" : "Collectibles"),
          keywords: ["collectible", "collectibles", "memorabilia", "vintage collectible", "figurine", "antiques", "مقتنيات", "تحف", "نادر", "أنتيك"]
        },
        {
          id: "glass-art",
          label: (dict as any).common?.categories_list?.["glass-art"] || (isAr ? "فن الزجاج والموزاييك" : "Glass Art"),
          keywords: ["glass art", "blown glass", "stained glass", "fused glass", "glass sculpture", "زجاج معشق", "فن الزجاج", "زجاج منفوخ", "موزاييك"]
        },
        {
          id: "fine-art-ceramics",
          label: (dict as any).common?.categories_list?.["fine-art-ceramics"] || (isAr ? "خزف وفخار فني فاخر" : "Fine Art Ceramics"),
          keywords: ["fine art ceramics", "ceramic sculpture", "art pottery", "raku", "porcelain art", "خزف فني", "سيراميك فني", "فخار فاخر", "بورسلين"]
        },
        {
          id: "photography",
          label: (dict as any).common?.categories_list?.["photography"] || (isAr ? "تصوير فوتوغرافي" : "Photography"),
          keywords: ["photo", "photography", "photographic print", "black and white", "landscape", "portrait", "تصوير", "صورة فوتوغرافية", "فوتوغرافيا"]
        },
        {
          id: "drawing-illustration",
          label: (dict as any).common?.categories_list?.["drawing-illustration"] || (isAr ? "رسم يدوي ورسومات توضيحية" : "Drawing & Illustration"),
          keywords: ["drawing", "illustration", "sketch", "pencil", "charcoal", "ink", "pastel", "calligraphy", "رسم", "اسكتش", "رسم بالرصاص", "فحم", "حبر", "خط"]
        },
        {
          id: "dolls-miniatures",
          label: (dict as any).common?.categories_list?.["dolls-miniatures"] || (isAr ? "دمى فنية ومصغرات" : "Dolls & Miniatures"),
          keywords: ["doll", "miniature", "diorama", "dollhouse", "art doll", "figurine", "دمية فنية", "مصغرات", "مجسمات صغيرة", "عرائس"]
        },
        {
          id: "fiber-arts",
          label: (dict as any).common?.categories_list?.["fiber-arts"] || (isAr ? "فنون الخيوط والنسيج اليدوي" : "Fiber Arts"),
          keywords: ["fiber art", "macrame", "tapestry", "weaving", "felt", "embroidery art", "مكرمية", "نسيج جداري", "فنون الخيوط", "تطريز فني"]
        },
        {
          id: "mixed-media-collage",
          label: (dict as any).common?.categories_list?.["mixed-media-collage"] || (isAr ? "وسائط مختلطة وكولاج" : "Mixed Media & Collage"),
          keywords: ["mixed media", "collage", "assemblage", "paper collage", "resin art", "كولاج", "وسائط مختلطة", "ريزن", "تركيب فني"]
        },
        {
          id: "artist-trading-cards",
          label: (dict as any).common?.categories_list?.["artist-trading-cards"] || (isAr ? "بطاقات فنية متبادلة" : "Artist Trading Cards"),
          keywords: ["artist trading cards", "atc", "aceo", "mini art", "trading cards", "بطاقات فنية", "كروت فنانين", "ميني آرت"]
        },
        {
          id: "art-and-collectibles",
          label: (dict as any).common?.categories_list?.["art-and-collectibles"] || "General Art & Collectibles",
          keywords: ["art", "fine art", "gallery", "artist", "فن", "فنون"]
        }
      ]
    },
    {
      department: (dict as any).common?.categories_list?.["bath-and-beauty"] || (dict as any).home?.categories_list?.["bath-and-beauty"] || "Bath & Beauty",
      slug: "bath-and-beauty",
      icon: Sparkles,
      subcategories: [
        {
          id: "spa-relaxation",
          label: (dict as any).common?.categories_list?.["spa-relaxation"] || (isAr ? "سبا واسترخاء" : "Spa & Relaxation"),
          keywords: ["spa", "relaxation", "bath salts", "bath bombs", "body scrub", "candle", "massage oil", "سبا", "استرخاء", "أملاح استحمام", "كرات فوارة", "سكراب", "مساج"]
        },
        {
          id: "fragrances",
          label: (dict as any).common?.categories_list?.["fragrances"] || (isAr ? "عطور وروائح فواحة" : "Fragrances"),
          keywords: ["fragrance", "perfume", "cologne", "body mist", "attar", "musk", "oud", "عطر", "عطور", "مسك", "عود", "روائح", "معطر جسم", "برفان"]
        },
        {
          id: "skin-care",
          label: (dict as any).common?.categories_list?.["skin-care"] || (isAr ? "العناية بالبشرة" : "Skin Care"),
          keywords: ["skin care", "skincare", "lotion", "face cream", "moisturizer", "serum", "face mask", "cleanser", "عناية بالبشرة", "كريم وجه", "مرطب", "سيروم", "غسول وجه", "ماسك"]
        },
        {
          id: "bath-accessories",
          label: (dict as any).common?.categories_list?.["bath-accessories"] || (isAr ? "ملحقات ومستلزمات الاستحمام" : "Bath Accessories"),
          keywords: ["bath accessories", "bath brush", "loofah", "sponge", "soap dish", "bath pillow", "مستلزمات استحمام", "ليفة", "لوفة", "إسفنجة", "صبانة", "فرشاة ظهر"]
        },
        {
          id: "makeup-cosmetics",
          label: (dict as any).common?.categories_list?.["makeup-cosmetics"] || (isAr ? "مكياج ومستحضرات تجميل" : "Makeup & Cosmetics"),
          keywords: ["makeup", "cosmetics", "lipstick", "lip balm", "eyeliner", "blush", "foundation", "كحل", "مكياج", "حمرة", "مرطب شفاه", "روج", "مستحضرات تجميل"]
        },
        {
          id: "soaps",
          label: (dict as any).common?.categories_list?.["soaps"] || (isAr ? "صابون طبيعي يدوي" : "Soaps"),
          keywords: ["soap", "soaps", "bar soap", "olive oil soap", "castile", "handmade soap", "liquid soap", "صابون", "صابون غار", "صابون طبيعي", "صابونة", "صابون يدوي"]
        },
        {
          id: "personal-care",
          label: (dict as any).common?.categories_list?.["personal-care"] || (isAr ? "العناية الشخصية" : "Personal Care"),
          keywords: ["personal care", "deodorant", "body wash", "oral care", "shaving", "عناية شخصية", "مزيل عرق", "شاور جل", "حلاقة", "شامبو جسم"]
        },
        {
          id: "hair-care",
          label: (dict as any).common?.categories_list?.["hair-care"] || (isAr ? "العناية بالشعر" : "Hair Care"),
          keywords: ["hair care", "shampoo", "conditioner", "hair oil", "hair mask", "scalp", "عناية بالشعر", "شامبو", "بلسم", "زيت شعر", "سيروم شعر", "حمام كريم"]
        },
        {
          id: "cosmetic-toiletry-storage",
          label: (dict as any).common?.categories_list?.["cosmetic-toiletry-storage"] || (isAr ? "حقائب مكياج ومستحضرات تجميل" : "Cosmetic & Toiletry Storage"),
          keywords: ["cosmetic storage", "makeup bag", "toiletry bag", "dopp kit", "cosmetic organizer", "شنطة مكياج", "حقيبة مستحضرات تجميل", "منظم مكياج", "حافظة تواليت"]
        },
        {
          id: "baby-child-care",
          label: (dict as any).common?.categories_list?.["baby-child-care"] || (isAr ? "عناية بالطفل والرضيع" : "Baby & Child Care"),
          keywords: ["baby care", "baby lotion", "baby soap", "baby shampoo", "rash cream", "child care", "عناية بالأطفال", "شامبو أطفال", "كريم حفاض", "صابون أطفال", "عناية بالرضيع"]
        },
        {
          id: "essential-oils",
          label: (dict as any).common?.categories_list?.["essential-oils"] || (isAr ? "زيوت عطرية وطبيعية" : "Essential Oils"),
          keywords: ["essential oil", "essential oils", "aromatherapy", "diffuser oil", "pure oil", "lavender oil", "زيوت عطرية", "زيت عطري", "علاج عطري", "فواحة", "زيت لافندر"]
        },
        {
          id: "bath-and-beauty",
          label: (dict as any).common?.categories_list?.["bath-and-beauty"] || "General Bath & Beauty",
          keywords: ["bath", "beauty", "apothecary", "wellness", "استحمام", "عناية"]
        }
      ]
    },
    {
      department: (dict as any).common?.categories_list?.["weddings"] || (dict as any).home?.categories_list?.["weddings"] || "Weddings",
      slug: "weddings",
      icon: Heart,
      subcategories: [
        {
          id: "gifts-mementos",
          label: (dict as any).common?.categories_list?.["gifts-mementos"] || (isAr ? "هدايا وتذكارات زفاف" : "Gifts & Mementos"),
          keywords: ["wedding favor", "favor", "giveaways", "souvenir", "keepsake", "توزيعات", "توزيعات زفاف", "هدايا معازيم", "تذكار فرح"]
        },
        {
          id: "decorations",
          label: (dict as any).common?.categories_list?.["decorations"] || (dict as any).common?.categories_list?.["wedding-decorations"] || (isAr ? "ديكور وزينة الزفاف" : "Decorations"),
          keywords: ["wedding decor", "centerpiece", "arch", "guest book", "candle", "cake topper", "ديكور زفاف", "كوشة", "توبير كيك", "شموع فرح"]
        },
        {
          id: "accessories",
          label: (dict as any).common?.categories_list?.["wedding-accessories"] || (isAr ? "إكسسوارات زفاف وعروسة" : "Accessories"),
          keywords: ["veil", "bridal headpiece", "tiara", "hair vine", "corsage", "bouquet", "طرحة عروس", "تاج", "إكسسوار شعر", "بوكيه ورد"]
        },
        {
          id: "clothing",
          label: (dict as any).common?.categories_list?.["wedding-clothing"] || (isAr ? "أزياء وفساتين زفاف" : "Clothing"),
          keywords: ["wedding dress", "bridal gown", "tuxedo", "groom suit", "bridesmaid dress", "فستان زفاف", "فستان فرح", "بدلة عريس"]
        },
        {
          id: "jewelry",
          label: (dict as any).common?.categories_list?.["wedding-jewelry"] || (isAr ? "مجوهرات وأطقم زفاف" : "Jewelry"),
          keywords: ["bridal jewelry", "wedding ring", "wedding bands", "bridal set", "pearl necklace", "طقم عروسة", "دبل زواج", "مجوهرات زفاف"]
        },
        {
          id: "invitations-paper",
          label: (dict as any).common?.categories_list?.["invitations-paper"] || (isAr ? "بطاقات دعوة وورقيات زفاف" : "Invitations & Paper"),
          keywords: ["invitation", "wedding card", "save the date", "rsvp", "menu card", "دعوة فرح", "كارت دعوة", "ورقيات زفاف"]
        },
        {
          id: "shoes",
          label: (dict as any).common?.categories_list?.["wedding-shoes"] || (isAr ? "أحذية زفاف وأفراح" : "Shoes"),
          keywords: ["wedding shoes", "bridal heels", "bridal sneakers", "custom wedding shoes", "حذاء زفاف", "شوز عروسة", "كعب زفاف"]
        },
        {
          id: "weddings",
          label: (dict as any).common?.categories_list?.["weddings"] || "General Weddings & Celebrations",
          keywords: ["wedding", "marriage", "celebration", "bridal", "زفاف", "أفراح", "أعراس"]
        }
      ]
    },
    {
      department: (dict as any).common?.categories_list?.["craft-supplies-and-tools"] || (dict as any).home?.categories_list?.["craft-supplies-and-tools"] || "Craft Supplies & Tools",
      slug: "craft-supplies-and-tools",
      icon: Scissors,
      subcategories: [
        {
          id: "home-hobby",
          label: (dict as any).common?.categories_list?.["home-hobby"] || (isAr ? "مستلزمات هوايات ومنزلية" : "Home & Hobby"),
          keywords: ["home craft", "hobby", "woodworking supplies", "candle making", "soap making", "baking craft", "هوايات", "صناعة الشموع", "أعمال خشبية", "أشغال يدوية"]
        },
        {
          id: "sewing-fiber",
          label: (dict as any).common?.categories_list?.["sewing-fiber"] || (isAr ? "خياطة وألياف ونسيج" : "Sewing & Fiber"),
          keywords: ["sewing", "fiber", "yarn", "fabric", "thread", "embroidery", "needlework", "knitting", "crochet", "خياطة", "أقمشة", "صوف", "خيوط", "تطريز", "كروشيه", "تريكو"]
        },
        {
          id: "jewelry-beauty",
          label: (dict as any).common?.categories_list?.["jewelry-beauty"] || (isAr ? "خامات مجوهرات وتجميل" : "Jewelry & Beauty"),
          keywords: ["jewelry making", "beads", "charms", "gemstones", "wire", "clasps", "cosmetic ingredients", "خرز", "مستلزمات إكسسوارات", "أحجار كريمة", "أسلاك", "أقفال"]
        },
        {
          id: "visual-arts",
          label: (dict as any).common?.categories_list?.["visual-arts"] || (isAr ? "فنون بصرية ورسم" : "Visual Arts"),
          keywords: ["paint", "canvas", "brushes", "acrylic", "oil paint", "easel", "drawing tools", "ألوان", "فرش رسم", "كانفس", "ألوان زيتية", "أكريليك", "أدوات رسم"]
        },
        {
          id: "paper-party-kids",
          label: (dict as any).common?.categories_list?.["paper-party-kids"] || (isAr ? "ورقيات وحفلات وأطفال" : "Paper, Party & Kids"),
          keywords: ["scrapbooking", "cardstock", "stickers", "party craft", "kids craft", "origami", "ورق كرافت", "استيكرات", "أشغال أطفال", "أوريجامي", "زينة حفلات"]
        },
        {
          id: "sculpting-forming",
          label: (dict as any).common?.categories_list?.["sculpting-forming"] || (isAr ? "نحت وتشكيل وقوالب" : "Sculpting & Forming"),
          keywords: ["clay", "polymer clay", "molds", "silicone mold", "resin", "pottery tools", "صلصال", "قوالب سيليكون", "صلصال حراري", "ريزن", "أدوات فخار", "نحت"]
        },
        {
          id: "craft-supplies-and-tools",
          label: (dict as any).common?.categories_list?.["craft-supplies-and-tools"] || "General Craft Supplies",
          keywords: ["craft", "supplies", "raw materials", "خامات", "مستلزمات حرفية"]
        }
      ]
    },
    {
      department: (dict as any).common?.categories_list?.["kids-and-baby"] || (dict as any).home?.categories_list?.["kids-and-baby"] || "Kids & Baby",
      slug: "kids-and-baby",
      icon: Baby,
      subcategories: [
        {
          id: "baby-gift-sets",
          label: (dict as any).common?.categories_list?.["baby-gift-sets"] || (isAr ? "أطقم هدايا مواليد وسبوع" : "Baby Gift Sets"),
          keywords: ["baby gift set", "baby shower", "newborn gift", "welcome baby box", "طقم سبوع", "هدايا مواليد", "بوكس مواليد"]
        },
        {
          id: "nursery-decor",
          label: (dict as any).common?.categories_list?.["nursery-decor"] || (isAr ? "ديكور غرف الأطفال والمواليد" : "Nursery Decor"),
          keywords: ["nursery", "crib mobile", "growth chart", "nursery wall art", "ديكور غرفة أطفال", "موبايل سرير", "لوحات أطفال"]
        },
        {
          id: "toys",
          label: (dict as any).common?.categories_list?.["toys"] || (isAr ? "ألعاب أطفال" : "Toys"),
          keywords: ["toys", "wooden toy", "stuffed animal", "plush", "teether", "ألعاب أطفال", "لعبة خشب", "دبدوب", "عضاضة"]
        },
        {
          id: "baby-blankets",
          label: (dict as any).common?.categories_list?.["baby-blankets"] || (isAr ? "بطانيات ولفات رضع" : "Baby Blankets"),
          keywords: ["baby blanket", "swaddle", "quilt", "receiving blanket", "بطانية أطفال", "كوفلية", "لفة بيبي", "قماط"]
        },
        {
          id: "baby-clothing",
          label: (dict as any).common?.categories_list?.["baby-clothing"] || (isAr ? "ملابس رضع ومواليد" : "Baby Clothing"),
          keywords: ["baby clothing", "onesie", "romper", "booties", "bib", "ملابس رضع", "سلوبت", "بافتة", "لكلوك"]
        },
        {
          id: "kids-furniture",
          label: (dict as any).common?.categories_list?.["kids-furniture"] || (isAr ? "أثاث غرف أطفال" : "Kids' Furniture"),
          keywords: ["kids furniture", "crib", "toddler bed", "kids chair", "toy chest", "سرير أطفال", "كرسي أطفال", "صندوق ألعاب"]
        },
        {
          id: "games-puzzles",
          label: (dict as any).common?.categories_list?.["games-puzzles"] || (isAr ? "ألعاب ذكاء وأحاجي وبازل" : "Games & Puzzles"),
          keywords: ["puzzle", "kids game", "wooden puzzle", "educational toy", "بازل أطفال", "ألعاب تعليمية", "أحجية خشبية"]
        },
        {
          id: "childrens-books",
          label: (dict as any).common?.categories_list?.["childrens-books"] || (isAr ? "كتب وقصص أطفال" : "Children's Books"),
          keywords: ["childrens book", "story book", "picture book", "fabric book", "قصص أطفال", "كتب أطفال", "كتاب مصور"]
        },
        {
          id: "girls-clothing",
          label: (dict as any).common?.categories_list?.["girls-clothing"] || (isAr ? "ملابس بنات" : "Girls' Clothing"),
          keywords: ["girls clothing", "girl dress", "toddler girl", "skirt", "ملابس بنات", "فستان بناتي", "تنورة أطفال"]
        },
        {
          id: "baby-care",
          label: (dict as any).common?.categories_list?.["baby-care"] || (isAr ? "عناية بالرضع والأطفال" : "Baby Care"),
          keywords: ["baby care", "baby lotion", "baby shampoo", "baby soap", "rash cream", "عناية بالطفل", "شامبو أطفال", "كريم حفاض"]
        },
        {
          id: "boys-clothing",
          label: (dict as any).common?.categories_list?.["boys-clothing"] || (isAr ? "ملابس أولاد" : "Boys' Clothing"),
          keywords: ["boys clothing", "boy shirt", "toddler boy", "pants", "ملابس أولاد", "قميص أولادي", "بنطلون أولاد"]
        },
        {
          id: "kids-and-baby",
          label: (dict as any).common?.categories_list?.["kids-and-baby"] || "General Kids & Baby",
          keywords: ["kids", "baby", "children", "toddler", "أطفال", "رضع", "مواليد"]
        }
      ]
    },
    {
      department: (dict as any).common?.categories_list?.["paper-and-party-supplies"] || (dict as any).home?.categories_list?.["paper-and-party-supplies"] || "Paper & Party Supplies",
      slug: "paper-and-party-supplies",
      icon: PencilLine,
      subcategories: [
        {
          id: "party-supplies",
          label: (dict as any).common?.categories_list?.["party-supplies"] || (isAr ? "مستلزمات وزينة الحفلات" : "Party Supplies"),
          keywords: ["party supplies", "party decor", "balloons", "cake topper", "banner", "confetti", "party favors", "حفلات", "زينة حفلات", "توبير كيك", "توزيعات", "بالونات"]
        },
        {
          id: "paper",
          label: (dict as any).common?.categories_list?.["paper"] || (isAr ? "ورقيات وأظرف يدوية" : "Paper"),
          keywords: ["paper", "stationery", "handmade paper", "journals", "notebooks", "greeting cards", "envelopes", "scrapbook", "ورق يدوي", "دفاتر", "أجندات", "كروت معايدة", "أظرف", "ورقيات"]
        },
        {
          id: "paper-and-party-supplies",
          label: (dict as any).common?.categories_list?.["paper-and-party-supplies"] || "General Paper & Party Supplies",
          keywords: ["paper", "party", "stationery", "ورقيات", "حفلات"]
        }
      ]
    },
    {
      department: (dict as any).common?.categories_list?.["pet-supplies"] || (dict as any).home?.categories_list?.["pet-supplies"] || "Pet Supplies",
      slug: "pet-supplies",
      icon: Dog,
      subcategories: [
        {
          id: "pet-collars-leashes",
          label: (dict as any).common?.categories_list?.["pet-collars-leashes"] || (isAr ? "أطواق ومقاود الحيوانات الأليفة" : "Pet Collars & Leashes"),
          keywords: ["collar", "leash", "harness", "pet tag", "dog collar", "cat collar", "طوق", "مقود", "حبل كلاب", "سلسلة قطط", "طوق حيوانات"]
        },
        {
          id: "pet-gates-fences",
          label: (dict as any).common?.categories_list?.["pet-gates-fences"] || (isAr ? "بوابات وحواجز أليفة" : "Pet Gates & Fences"),
          keywords: ["pet gate", "dog fence", "barrier", "playpen", "بوابة حيوانات", "حاجز أمان", "سياج حيوانات"]
        },
        {
          id: "pet-bedding",
          label: (dict as any).common?.categories_list?.["pet-bedding"] || (isAr ? "مفارش وأغطية نوم للحيوانات الأليفة" : "Pet Bedding"),
          keywords: ["pet bed", "dog bed", "cat bed", "pet blanket", "sleeping mat", "سرير كلاب", "سرير قطط", "مفرش حيوانات", "بطانية حيوانات"]
        },
        {
          id: "pet-furniture",
          label: (dict as any).common?.categories_list?.["pet-furniture"] || (isAr ? "أثاث وأسرة حيوانات أليفة" : "Pet Furniture"),
          keywords: ["cat tree", "scratching post", "pet ramp", "dog couch", "أثاث قطط", "شجرة قطط", "عمود خدش", "أريكة كلاب"]
        },
        {
          id: "pet-clothing-accessories-shoes",
          label: (dict as any).common?.categories_list?.["pet-clothing-accessories-shoes"] || (isAr ? "ملابس وإكسسوارات وأحذية حيوانات أليفة" : "Pet Clothing, Accessories & Shoes"),
          keywords: ["pet clothing", "dog bandana", "dog boots", "pet sweater", "pet coat", "ملابس كلاب", "بندانا قطط", "أحذية حيوانات", "جاكيت كلاب"]
        },
        {
          id: "pet-toys",
          label: (dict as any).common?.categories_list?.["pet-toys"] || (isAr ? "ألعاب حيوانات أليفة" : "Pet Toys"),
          keywords: ["dog toy", "cat toy", "chew toy", "catnip", "rope toy", "ألعاب كلاب", "ألعاب قطط", "عضاضة كلاب", "نعناع قطط"]
        },
        {
          id: "pet-storage",
          label: (dict as any).common?.categories_list?.["pet-storage"] || (isAr ? "صناديق وحافظات مستلزمات الحيوانات" : "Pet Storage"),
          keywords: ["toy basket", "pet food storage", "treat jar", "leash holder", "صندوق ألعاب حيوانات", "علبة طعام قطط", "حامل مقاود"]
        },
        {
          id: "urns-memorials",
          label: (dict as any).common?.categories_list?.["urns-memorials"] || (isAr ? "تذكارات ومجسمات وفاء للحيوانات الأليفة" : "Urns & Memorials"),
          keywords: ["pet memorial", "pet urn", "paw print", "memorial stone", "تذكار حيوان أليف", "مجسم وفاء", "أثر قدم حيوان"]
        },
        {
          id: "pet-feeding",
          label: (dict as any).common?.categories_list?.["pet-feeding"] || (isAr ? "أطباق وأدوات إطعام الحيوانات" : "Pet Feeding"),
          keywords: ["pet bowl", "elevated feeder", "water dispenser", "treat jar", "صحن قطط", "طبق كلاب", "موزع مياه", "أطباق طعام حيوانات"]
        },
        {
          id: "riding-farm-animals",
          label: (dict as any).common?.categories_list?.["riding-farm-animals"] || (isAr ? "مستلزمات الفروسية وحيوانات المزرعة" : "Riding & Farm Animals"),
          keywords: ["horse", "saddle", "bridle", "farm animals", "halter", "فروسية", "خيل", "سرج", "لجام", "حيوانات مزرعة"]
        },
        {
          id: "pet-carriers-houses",
          label: (dict as any).common?.categories_list?.["pet-carriers-houses"] || (isAr ? "بيوت وحقائب تنقل للحيوانات الأليفة" : "Pet Carriers & Houses"),
          keywords: ["pet carrier", "dog house", "cat house", "travel crate", "شنطة تنقل قطط", "بيت كلاب", "قفص نقل حيوانات"]
        },
        {
          id: "pet-health-wellness",
          label: (dict as any).common?.categories_list?.["pet-health-wellness"] || (isAr ? "صحة وعناية بالحيوانات الأليفة" : "Pet Health & Wellness"),
          keywords: ["pet shampoo", "grooming brush", "paw balm", "pet wellness", "شامبو حيوانات", "فرشاة تنظيف شعر", "مرطب أقدام"]
        },
        {
          id: "beekeeping",
          label: (dict as any).common?.categories_list?.["beekeeping"] || (isAr ? "مستلزمات تربية النحل وإنتاج العسل" : "Beekeeping"),
          keywords: ["beekeeping", "beehive", "bee suit", "honey extractor", "تربية نحل", "خلية نحل", "بدلة نحال", "إنتاج عسل"]
        },
        {
          id: "training",
          label: (dict as any).common?.categories_list?.["training"] || (isAr ? "أدوات تدريب وتأهيل الحيوانات" : "Training"),
          keywords: ["clicker", "training pad", "dog whistle", "treat pouch", "أدوات تدريب كلاب", "صافرة تدريب", "حقيبة مكافآت"]
        },
        {
          id: "pet-supplies",
          label: (dict as any).common?.categories_list?.["pet-supplies"] || "General Pet Supplies",
          keywords: ["pet", "cat", "dog", "puppy", "kitten", "حيوانات أليفة", "قطط", "كلاب"]
        }
      ]
    },
    {
      department: (dict as any).common?.categories_list?.["shoes"] || (dict as any).home?.categories_list?.["shoes"] || "Shoes",
      slug: "shoes",
      icon: Footprints,
      subcategories: [
        {
          id: "womens-shoes",
          label: (dict as any).common?.categories_list?.["womens-shoes"] || (isAr ? "أحذية نسائية" : "Women's Shoes"),
          keywords: ["women shoes", "heels", "flats", "sandals", "boots", "slippers", "أحذية نسائية", "كعب", "صندل حريمي", "سليبر نسائي", "جزمة"]
        },
        {
          id: "mens-shoes",
          label: (dict as any).common?.categories_list?.["mens-shoes"] || (isAr ? "أحذية رجالية" : "Men's Shoes"),
          keywords: ["men shoes", "oxfords", "loafers", "boots", "leather shoes", "أحذية رجالية", "لوفر", "جزمة جلد", "أحذية كلاسيك"]
        },
        {
          id: "girls-shoes",
          label: (dict as any).common?.categories_list?.["girls-shoes"] || (isAr ? "أحذية بنات" : "Girls' Shoes"),
          keywords: ["girls shoes", "ballerina flats", "girl sandals", "toddler girl shoes", "أحذية بنات", "صندل بناتي", "باليرينا أطفال"]
        },
        {
          id: "insoles-accessories",
          label: (dict as any).common?.categories_list?.["insoles-accessories"] || (isAr ? "فرش أحذية وملحقاتها" : "Insoles & Accessories"),
          keywords: ["insoles", "shoe clips", "laces", "shoe horn", "shoe tree", "فرش جزمة", "أربطة أحذية", "إكسسوارات حذاء", "بيسة"]
        },
        {
          id: "boys-shoes",
          label: (dict as any).common?.categories_list?.["boys-shoes"] || (isAr ? "أحذية أولاد" : "Boys' Shoes"),
          keywords: ["boys shoes", "sneakers", "boots", "loafers", "toddler boy shoes", "أحذية أولاد", "سنيكرز أطفال", "حذاء ولادي"]
        },
        {
          id: "shoes",
          label: (dict as any).common?.categories_list?.["shoes"] || "General Shoes & Footwear",
          keywords: ["shoes", "footwear", "handmade shoes", "أحذية", "شوز"]
        }
      ]
    },
    {
      department: (dict as any).common?.categories_list?.["toys-and-games"] || (dict as any).home?.categories_list?.["toys-and-games"] || "Toys & Games",
      slug: "toys-and-games",
      icon: Gamepad2,
      subcategories: [
        {
          id: "games-puzzles",
          label: (dict as any).common?.categories_list?.["games-puzzles"] || (isAr ? "ألعاب ذكاء وأحاجي وبازل" : "Games & Puzzles"),
          keywords: ["puzzle", "jigsaw", "board game", "chess", "backgammon", "card game", "شطرنج", "طاولة زهر", "بازل", "ألعاب طاولة", "أحجية"]
        },
        {
          id: "toys",
          label: (dict as any).common?.categories_list?.["toys"] || (isAr ? "ألعاب أطفال" : "Toys"),
          keywords: ["wooden toy", "doll", "rag doll", "plush", "stuffed animal", "action figure", "ألعاب خشبية", "عرائس قماش", "دمية", "دبدوب", "ألعاب"]
        },
        {
          id: "sports-outdoor-recreation",
          label: (dict as any).common?.categories_list?.["sports-outdoor-recreation"] || (isAr ? "رياضة وأنشطة ترفيهية خارجية" : "Sports & Outdoor Recreation"),
          keywords: ["sports", "outdoor games", "kite", "yard game", "cornhole", "boomerang", "طائرة ورقية", "ألعاب خارجية", "رياضة", "أنشطة حديقة"]
        },
        {
          id: "toys-and-games",
          label: (dict as any).common?.categories_list?.["toys-and-games"] || "General Toys & Games",
          keywords: ["toys", "games", "play", "ألعاب", "تسلية"]
        }
      ]
    },
    {
      department: (dict as any).common?.categories_list?.["books-movies-and-music"] || (dict as any).home?.categories_list?.["books-movies-and-music"] || "Books, Movies & Music",
      slug: "books-movies-and-music",
      icon: BookOpen,
      subcategories: [
        {
          id: "books",
          label: (dict as any).common?.categories_list?.["books"] || (isAr ? "كتب وروايات" : "Books"),
          keywords: ["book", "books", "novel", "literature", "art book", "rare books", "leather bound", "كتب", "روايات", "كتاب", "تجليد كتب", "مؤلفات"]
        },
        {
          id: "movies",
          label: (dict as any).common?.categories_list?.["movies"] || (isAr ? "أفلام وسينما" : "Movies"),
          keywords: ["movie", "movies", "film", "cinema", "dvd", "vhs", "blu-ray", "أفلام", "سينما", "فيلم", "أشرطة فيديو", "دي في دي"]
        },
        {
          id: "music",
          label: (dict as any).common?.categories_list?.["music"] || (isAr ? "موسيقى وتسجيلات" : "Music"),
          keywords: ["music", "vinyl", "record", "cd", "cassette", "instrument", "sheet music", "موسيقى", "أسطوانة", "شريط كاسيت", "آلات موسيقية", "نوتة موسيقية"]
        },
        {
          id: "video-cases-tins",
          label: (dict as any).common?.categories_list?.["video-cases-tins"] || (isAr ? "علب وحافظات أشرطة وأقراص" : "Video Cases & Tins"),
          keywords: ["video case", "steelbook", "tin case", "tape box", "cd sleeve", "علبة شريط", "حافظة أقراص", "علب معدنية", "كاسيت"]
        },
        {
          id: "books-movies-and-music",
          label: (dict as any).common?.categories_list?.["books-movies-and-music"] || "General Books, Movies & Music",
          keywords: ["books", "movies", "music", "media", "كتب وموسيقى", "إعلام"]
        }
      ]
    },
    {
      department: (dict as any).common?.categories_list?.["electronics-and-accessories"] || (dict as any).home?.categories_list?.["electronics-and-accessories"] || "Electronics & Accessories",
      slug: "electronics-and-accessories",
      icon: Smartphone,
      subcategories: [
        {
          id: "computers-peripherals",
          label: (dict as any).common?.categories_list?.["computers-peripherals"] || (isAr ? "كمبيوتر وملحقاته" : "Computers & Peripherals"),
          keywords: ["computer", "mousepad", "keyboard", "wrist rest", "mouse", "monitor stand", "كمبيوتر", "ماوس باد", "كيبورد", "مسند معصم", "شاشة"]
        },
        {
          id: "video-games",
          label: (dict as any).common?.categories_list?.["video-games"] || (isAr ? "ألعاب فيديو وجيمينج" : "Video Games"),
          keywords: ["video game", "gaming", "console", "controller stand", "custom controller", "ألعاب فيديو", "جيمينج", "يد تحكم", "بلايستيشن", "إكس بوكس"]
        },
        {
          id: "gadgets",
          label: (dict as any).common?.categories_list?.["gadgets"] || (isAr ? "أجهزة وأدوات ذكية" : "Gadgets"),
          keywords: ["gadget", "smart device", "key finder", "usb gadget", "أجهزة ذكية", "أدوات ذكية", "ابتكارات"]
        },
        {
          id: "car-parts-accessories",
          label: (dict as any).common?.categories_list?.["car-parts-accessories"] || (isAr ? "قطع غيار وإكسسوارات سيارات" : "Car Parts & Accessories"),
          keywords: ["car", "car mount", "key fob", "shift knob", "car coaster", "إكسسوارات سيارة", "حامل موبايل للسيارة", "مقبض فتيس"]
        },
        {
          id: "cameras-equipment",
          label: (dict as any).common?.categories_list?.["cameras-equipment"] || (isAr ? "كاميرات ومعدات تصوير" : "Cameras & Equipment"),
          keywords: ["camera", "camera strap", "lens cap", "tripod", "camera bag", "كاميرا", "حزام كاميرا", "شنطة كاميرا", "حامل تصوير"]
        },
        {
          id: "telephones-handsets",
          label: (dict as any).common?.categories_list?.["telephones-handsets"] || (isAr ? "هواتف وسماعات" : "Telephones & Handsets"),
          keywords: ["telephone", "vintage phone", "handset", "rotary phone", "هواتف كلاسيكية", "تليفون", "سماعة هاتف"]
        },
        {
          id: "docking-stands",
          label: (dict as any).common?.categories_list?.["docking-stands"] || (isAr ? "قواعد تثبيت وحوامل" : "Docking & Stands"),
          keywords: ["dock", "docking station", "stand", "wooden dock", "phone stand", "قاعدة تثبيت", "حامل مكتب", "حامل خشب"]
        },
        {
          id: "cell-phone-accessories",
          label: (dict as any).common?.categories_list?.["cell-phone-accessories"] || (isAr ? "إكسسوارات هواتف محمولة" : "Cell Phone Accessories"),
          keywords: ["phone charm", "phone strap", "pop socket", "phone ring", "تعليقة موبايل", "سوار هاتف", "مسكة موبايل"]
        },
        {
          id: "diy-kits",
          label: (dict as any).common?.categories_list?.["diy-kits"] || (isAr ? "مجموعات تركيب وصنع يدوي (DIY)" : "DIY Kits"),
          keywords: ["diy kit", "electronics kit", "soldering kit", "build kit", "مجموعة تركيب", "كيت إلكترونيات", "اصنع بنفسك"]
        },
        {
          id: "electronics-cases",
          label: (dict as any).common?.categories_list?.["electronics-cases"] || (isAr ? "جرابات وحافظات إلكترونيات" : "Electronics Cases"),
          keywords: ["phone case", "ipad sleeve", "laptop case", "earphone pouch", "جراب", "كفر", "جراب لابتوب", "حافظة سماعات"]
        },
        {
          id: "audio",
          label: (dict as any).common?.categories_list?.["audio"] || (isAr ? "صوتيات وسماعات" : "Audio"),
          keywords: ["speaker", "headphones", "headphone stand", "bluetooth speaker", "amplifiers", "مكبر صوت", "سماعات رأس", "سبيكر"]
        },
        {
          id: "decals-skins",
          label: (dict as any).common?.categories_list?.["decals-skins"] || (isAr ? "استيكرات ولصقات أجهزة (Skins)" : "Decals & Skins"),
          keywords: ["skin", "laptop skin", "decal", "console skin", "phone decal", "لصقات لابتوب", "استيكر حماية", "سكينز"]
        },
        {
          id: "tv-projection",
          label: (dict as any).common?.categories_list?.["tv-projection"] || (isAr ? "تلفزيون وأجهزة عرض" : "TV & Projection"),
          keywords: ["tv", "projector stand", "remote holder", "tv mount", "شاشات", "بروجكتور", "حامل ريموت"]
        },
        {
          id: "cables-cords",
          label: (dict as any).common?.categories_list?.["cables-cords"] || (isAr ? "كابلات وأسلاك وتوصيلات" : "Cables & Cords"),
          keywords: ["cable", "cord organizer", "cable clip", "leather cable wrap", "كابل", "منظم أسلاك", "رباط أسلاك جلد"]
        },
        {
          id: "batteries-charging",
          label: (dict as any).common?.categories_list?.["batteries-charging"] || (isAr ? "بطاريات وشواحن" : "Batteries & Charging"),
          keywords: ["charger", "wireless charger", "charging pad", "battery pack", "شاحن لاسلكي", "باور بانك", "قاعدة شحن"]
        },
        {
          id: "parts-electrical",
          label: (dict as any).common?.categories_list?.["parts-electrical"] || (isAr ? "قطع غيار كهربائية وإلكترونية" : "Parts & Electrical"),
          keywords: ["electrical parts", "switch", "wire", "led", "connectors", "قطع غيار كهربائية", "مفاتيح كهرباء", "أسلاك", "لمبات ليد"]
        },
        {
          id: "maker-supplies",
          label: (dict as any).common?.categories_list?.["maker-supplies"] || (isAr ? "مستلزمات مبتكرين ودوائر إلكترونية" : "Maker Supplies"),
          keywords: ["arduino", "raspberry pi", "breadboard", "sensors", "maker", "دوائر إلكترونية", "أردوينو", "راسبيري باي", "حساسات"]
        },
        {
          id: "electronics-and-accessories",
          label: (dict as any).common?.categories_list?.["electronics-and-accessories"] || "General Electronics & Accessories",
          keywords: ["tech", "electronics", "gadget", "إلكترونيات", "ملحقات تقنية"]
        }
      ]
    }
  ], [dict, isAr]);

  // Find confirmed breadcrumb path for current value
  const confirmedSelection = useMemo(() => {
    if (!value) return null;
    const target = value.toLowerCase().trim();
    for (const dept of departments) {
      if (dept.slug === target || dept.department.toLowerCase() === target) {
        return {
          department: dept.department,
          subcategory: dept.department,
          id: dept.slug,
          icon: dept.icon
        };
      }
      const match = dept.subcategories.find(sub => 
        sub.id === value || 
        sub.id.toLowerCase() === target ||
        sub.label.toLowerCase() === target ||
        sub.id.replace(/-/g, " ").toLowerCase() === target
      );
      if (match) {
        return {
          department: dept.department,
          subcategory: match.label,
          id: match.id,
          icon: dept.icon
        };
      }
    }

    // Check dictionary translation for category slug (e.g. ceramics -> سيراميك)
    const localizedSubcategory = (dict as any)?.common?.categories_list?.[value] 
      || (dict as any)?.home?.categories_list?.[value]
      || (dict as any)?.common?.[value]
      || value;

    let deptLabel = isAr ? "الفئة" : (dict?.new_product?.category_label?.replace(/[*:]/g, "").trim() || "Category");
    let Icon = FolderTree;

    if (["ceramics", "woodwork", "home-decor", "lighting", "furniture", "kitchen-dining"].includes(target)) {
      deptLabel = (dict as any)?.common?.categories_list?.["home-and-living"] || (dict as any)?.home?.categories_list?.["home-and-living"] || (isAr ? "المنزل والديكور" : "Home & Living");
      Icon = Home;
    } else if (["jewelry", "earrings", "necklaces", "rings", "bracelets", "watches"].includes(target)) {
      deptLabel = (dict as any)?.common?.categories_list?.["jewelry"] || (dict as any)?.home?.categories_list?.["jewelry"] || (isAr ? "مجوهرات" : "Jewelry");
      Icon = Gem;
    } else if (["art", "prints", "painting", "sculpture", "fine-art-ceramics"].includes(target)) {
      deptLabel = (dict as any)?.common?.categories_list?.["art-and-collectibles"] || (dict as any)?.home?.categories_list?.["art-and-collectibles"] || (isAr ? "فن ومقتنيات" : "Art & Collectibles");
      Icon = Brush;
    }

    return {
      department: deptLabel,
      subcategory: localizedSubcategory,
      id: value,
      icon: Icon
    };
  }, [value, departments, dict, isAr]);

  // Search Results across all departments and craft subcategories
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    const results: { department: string; subcategory: SubcategoryItem; icon: any }[] = [];
    for (const dept of departments) {
      for (const sub of dept.subcategories) {
        const matchesLabel = sub.label.toLowerCase().includes(query);
        const matchesDept = dept.department.toLowerCase().includes(query);
        const matchesKeyword = sub.keywords.some(k => k.toLowerCase().includes(query));
        if (matchesLabel || matchesDept || matchesKeyword) {
          results.push({
            department: dept.department,
            subcategory: sub,
            icon: dept.icon
          });
        }
      }
    }
    return results;
  }, [searchQuery, departments]);

  const handleSelect = (categoryId: string) => {
    onChange(categoryId);
    setIsOpen(false);
    setSearchQuery("");
    setSelectedDepartment(null);
  };

  // 1. Confirmed Badge State (Etsy-Style locked pill with Change button)
  if (confirmedSelection && !isOpen) {
    const Icon = confirmedSelection.icon;
    return (
      <div className="bg-cream/50 border border-primary/15 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs hover:border-primary/30 transition-all">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-wider text-accent flex items-center gap-1.5 truncate">
              <span>{confirmedSelection.department}</span>
              <span>›</span>
            </p>
            <p className="text-sm font-bold text-primary truncate">
              {confirmedSelection.subcategory}
            </p>
          </div>
        </div>

        {!disabled && (
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setSelectedDepartment(null);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-primary hover:text-accent bg-white border border-primary/10 hover:border-primary/25 transition-all active:scale-95 shadow-2xs shrink-0"
          >
            <Edit2 className="w-3.5 h-3.5 text-accent" />
            <span>{isAr ? "تغيير الفئة" : "Change"}</span>
          </button>
        )}
      </div>
    );
  }

  // 2. Active Selection Mode (Search + 2-Tier Cascading Drilldown)
  return (
    <div ref={containerRef} className="space-y-3 bg-white border border-primary/15 rounded-2xl p-4 shadow-sm relative">
      {/* Top Search Input (Etsy Smart Search) */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value) setSelectedDepartment(null);
          }}
          placeholder={
            isAr
              ? "اكتب وصفاً للفئة (مثال: مج فخار، حقيبة جلد، خاتم فضة)..."
              : "Search category (e.g. ceramic mug, leather bag, silver ring)..."
          }
          className="w-full py-2.5 ps-10 pe-9 bg-cream/30 border border-primary/15 rounded-xl text-xs md:text-sm font-medium text-primary placeholder:text-primary/40 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-2xs"
        />
        <Search className="w-4 h-4 text-primary/40 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute end-2.5 top-1/2 -translate-y-1/2 p-1 text-charcoal/40 hover:text-primary transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Mode A: Predictive Search Results */}
      {searchQuery.trim().length > 0 ? (
        <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/10 space-y-1">
          {searchResults.length > 0 ? (
            searchResults.map(({ department, subcategory, icon: Icon }) => (
              <button
                key={subcategory.id}
                type="button"
                onClick={() => handleSelect(subcategory.id)}
                className="w-full px-3 py-2.5 text-start rounded-xl hover:bg-cream/60 border border-transparent hover:border-primary/10 transition-all flex items-center justify-between group active:scale-[0.99]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-cream flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="text-[11px] text-charcoal/50 font-medium">
                      {department} ›{" "}
                    </span>
                    <span className="text-xs md:text-sm font-bold text-primary">
                      {subcategory.label}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-primary/30 group-hover:text-accent rtl:rotate-180 transition-colors shrink-0 ms-2" />
              </button>
            ))
          ) : (
            <div className="py-6 text-center text-charcoal/50 text-xs">
              <p>{isAr ? "لم يتم العثور على فئة تطابق بحثك." : `No categories match "${searchQuery}".`}</p>
              <p className="mt-1 text-[11px] text-primary/70">
                {isAr ? "جرّب تصفح الأقسام أدناه." : "Browse the departments below instead."}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Mode B: 2-Tier Cascading Drilldown (Etsy Browse Categories) */
        <div>
          <AnimatePresence mode="wait">
            {!selectedDepartment ? (
              /* Step 1: Root Departments List */
              <motion.div
                key="departments"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between px-1 pb-1 border-b border-primary/5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary/40">
                    {isAr ? "تصفح حسب القسم الرئيسي" : "Browse by Department"}
                  </span>
                  {value && (
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="text-[11px] font-bold text-charcoal/50 hover:text-primary transition-colors"
                    >
                      {isAr ? "إلغاء" : "Cancel"}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/10 pt-1">
                  {departments.map((dept) => {
                    const Icon = dept.icon;
                    return (
                      <button
                        key={dept.slug}
                        type="button"
                        onClick={() => setSelectedDepartment(dept)}
                        className="px-3 py-2 rounded-xl text-start border border-primary/5 bg-cream/30 hover:bg-cream hover:border-primary/15 transition-all flex items-center justify-between group active:scale-98"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className="w-4 h-4 text-accent shrink-0" />
                          <span className="text-xs font-bold text-primary truncate">
                            {dept.department}
                          </span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-primary/30 group-hover:text-accent rtl:rotate-180 transition-colors shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              /* Step 2: Craft Subcategories for Selected Department */
              <motion.div
                key="subcategories"
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.15 }}
                className="space-y-2"
              >
                {/* Back button */}
                <div className="flex items-center justify-between pb-1.5 border-b border-primary/5">
                  <button
                    type="button"
                    onClick={() => setSelectedDepartment(null)}
                    className="flex items-center gap-1.5 text-xs font-bold text-accent hover:text-primary transition-colors group"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5 transition-transform" />
                    <span>{isAr ? "الرجوع للأقسام" : "All Departments"}</span>
                  </button>
                  <span className="text-xs font-black text-primary truncate">
                    {selectedDepartment.department}
                  </span>
                </div>

                <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/10 space-y-1">
                  {selectedDepartment.subcategories.map((sub) => {
                    const isSelected = value === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => handleSelect(sub.id)}
                        className={cn(
                          "w-full px-3.5 py-2.5 text-start rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center justify-between active:scale-[0.99]",
                          isSelected
                            ? "bg-primary text-white font-bold shadow-xs"
                            : "hover:bg-cream text-charcoal/80 hover:text-primary"
                        )}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <span
                            className={cn(
                              "w-1.5 h-1.5 rounded-full shrink-0",
                              isSelected ? "bg-accent" : "bg-primary/20"
                            )}
                          />
                          <span className="truncate">{sub.label}</span>
                        </span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-accent stroke-[3] shrink-0 ms-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
