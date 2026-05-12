import * as fs from "fs";
import * as path from "path";

function loadJSON(filePath: string): any {
  try {
    const rawData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(rawData);
  } catch (error: any) {
    console.error(`❌ Failed to read or parse file at ${filePath}:`, error.message);
    process.exit(1);
  }
}

function deepCompareKeys(objA: any, objB: any, currentPath = ""): string[] {
  let missing: string[] = [];
  
  for (const key in objA) {
    const nextPath = currentPath ? `${currentPath}.${key}` : key;
    
    if (!(key in objB)) {
      missing.push(nextPath);
    } else if (typeof objA[key] === "object" && objA[key] !== null) {
      if (typeof objB[key] === "object" && objB[key] !== null) {
        missing = missing.concat(deepCompareKeys(objA[key], objB[key], nextPath));
      } else {
        missing.push(`${nextPath} (Type mismatch: Object vs Primitive)`);
      }
    }
  }
  
  return missing;
}

function runAudit() {
  const rootDir = process.cwd();
  const arPath = path.join(rootDir, "src/app/[lang]/dictionaries/ar.json");
  const enPath = path.join(rootDir, "src/app/[lang]/dictionaries/en.json");

  console.log(`🔍 [i18n Audit] Loading translation dictionaries...`);
  console.log(`   🇸🇦 Arabic Dictionary:   ${arPath}`);
  console.log(`   🇬🇧 English Dictionary:  ${enPath}\n`);

  const arDict = loadJSON(arPath);
  const enDict = loadJSON(enPath);

  const missingInArabic = deepCompareKeys(enDict, arDict);
  const missingInEnglish = deepCompareKeys(arDict, enDict);

  console.log("=========================================");
  console.log("📊 PARITY AUDIT RESULTS");
  console.log("=========================================");

  if (missingInArabic.length === 0) {
    console.log("✅ Arabic Dictionary has 100% of the keys present in English!");
  } else {
    console.log(`❌ Missing in ARABIC (ar.json) [Count: ${missingInArabic.length}]:`);
    missingInArabic.slice(0, 15).forEach(k => console.log(`   - ${k}`));
    if (missingInArabic.length > 15) {
      console.log(`   ...and ${missingInArabic.length - 15} more keys.`);
    }
  }

  console.log("\n-----------------------------------------");

  if (missingInEnglish.length === 0) {
    console.log("✅ English Dictionary has 100% of the keys present in Arabic!");
  } else {
    console.log(`❌ Missing in ENGLISH (en.json) [Count: ${missingInEnglish.length}]:`);
    missingInEnglish.slice(0, 15).forEach(k => console.log(`   - ${k}`));
    if (missingInEnglish.length > 15) {
      console.log(`   ...and ${missingInEnglish.length - 15} more keys.`);
    }
  }
  console.log("=========================================\n");

  if (missingInArabic.length > 0 || missingInEnglish.length > 0) {
    console.log("💡 Tip: Standardize keys across both translation layers to prevent mixed language UI blocks or fallback rendering failures.");
  } else {
    console.log("⭐ Perfect Translation Synchronization Achieved! Both files are 100% aligned.");
  }
}

runAudit();
