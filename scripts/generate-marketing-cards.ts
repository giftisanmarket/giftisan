import sharp from "sharp";
import fs from "fs";
import path from "path";
import { CAIRO_WOFF2_BASE64 } from "./cairo-font-base64";

// Deep require qr.js
const QRCode = require("qr.js/lib/QRCode");
const ErrorCorrectLevel = require("qr.js/lib/ErrorCorrectLevel");

// Read icon.png as base64 for embedding in SVGs
const iconPngBuffer = fs.readFileSync(path.resolve("public/icon.png"));
const iconPngBase64 = `data:image/png;base64,${iconPngBuffer.toString("base64")}`;

// Generates an SVG path string for a QR code with ErrorCorrectLevel.H (high 30% redundancy)
function generateQRPath(text: string, size: number, margin = 2) {
  const qr = new QRCode(-1, ErrorCorrectLevel.H);
  qr.addData(text);
  qr.make();
  const modules = qr.modules;
  const count = modules.length;
  const totalCount = count + margin * 2;
  const cellSize = size / totalCount;

  let path = "";
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (modules[r][c]) {
        const x = (c + margin) * cellSize;
        const y = (r + margin) * cellSize;
        path += `M${x.toFixed(2)},${y.toFixed(2)}h${cellSize.toFixed(2)}v${cellSize.toFixed(2)}h-${cellSize.toFixed(2)}Z `;
      }
    }
  }
  return { path, totalSize: size };
}

// Exactly https://giftisan.com on BOTH QR codes
const WEBSITE_URL = "https://giftisan.com";
const frontQR = generateQRPath(WEBSITE_URL, 440, 2);
const backQR = generateQRPath(WEBSITE_URL, 380, 2);

// =========================================================================
// 1. FRONT CARD - FULL BLEED, ZERO EDGE PADDING, VELVET EMERALD (2100x1200)
// =========================================================================
function getFrontEmeraldSvg(): string {
  return `
  <svg width="2100" height="1200" viewBox="0 0 2100 1200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Deep luxury forest emerald background -->
      <linearGradient id="bgFront" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#075640"/>
        <stop offset="40%" stop-color="#064E3B"/>
        <stop offset="100%" stop-color="#02271C"/>
      </linearGradient>

      <!-- Soft ambient radial light -->
      <radialGradient id="ambientGlow" cx="20%" cy="25%" r="85%">
        <stop offset="0%" stop-color="#0D9488" stop-opacity="0.32"/>
        <stop offset="50%" stop-color="#064E3B" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>

      <!-- Egyptian Gold Foil Gradient -->
      <linearGradient id="goldFoil" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#F59E0B"/>
        <stop offset="35%" stop-color="#FDE68A"/>
        <stop offset="70%" stop-color="#F59E0B"/>
        <stop offset="100%" stop-color="#D97706"/>
      </linearGradient>

      <!-- Generous, unclipped drop shadow for the right QR plaque -->
      <filter id="plaqueDropShadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="24" stdDeviation="32" flood-color="#000000" flood-opacity="0.5"/>
      </filter>

      <filter id="iconSoftShadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000000" flood-opacity="0.35"/>
      </filter>

      <!-- Clip path for perfectly rounded logo corners (smooth 26px radius matching stroke) -->
      <clipPath id="logoClip">
        <rect x="0" y="0" width="112" height="112" rx="26" ry="26"/>
      </clipPath>
      <clipPath id="frontQrBadgeClip">
        <rect x="0" y="0" width="80" height="80" rx="16" ry="16"/>
      </clipPath>
    </defs>

    <!-- Full Bleed Edge-to-Edge Canvas -->
    <rect width="2100" height="1200" fill="url(#bgFront)"/>
    <rect width="2100" height="1200" fill="url(#ambientGlow)"/>

    <!-- ================= LEFT COLUMN: BRANDING & HEADLINE ================= -->
    <g transform="translate(120, 110)">
      
      <!-- Brand Header Lockup: Image corners clipped to smooth 26px radius matching gold stroke -->
      <g transform="translate(0, 0)">
        <g filter="url(#iconSoftShadow)">
          <rect x="0" y="0" width="112" height="112" rx="26" fill="#064E3B"/>
          <image href="${iconPngBase64}" x="0" y="0" width="112" height="112" clip-path="url(#logoClip)"/>
          <rect x="0" y="0" width="112" height="112" rx="26" fill="none" stroke="#F59E0B" stroke-width="2.5" stroke-opacity="0.5"/>
        </g>

        <text x="145" y="70" fill="#FDFCF0" font-family="'Outfit', 'Plus Jakarta Sans', sans-serif" font-size="70" font-weight="900" letter-spacing="14">
          GIFTISAN
        </text>
        <text x="150" y="108" fill="#F59E0B" font-family="'Outfit', sans-serif" font-size="18" font-weight="700" letter-spacing="6">
          EGYPTIAN HANDMADE MARKETPLACE
        </text>
      </g>

      <!-- Eyebrow Pill: FULLY COVERS TEXT WITH GENEROUS PADDING -->
      <g transform="translate(0, 195)">
        <rect x="0" y="0" width="360" height="46" rx="23" fill="#F59E0B" fill-opacity="0.16" stroke="#F59E0B" stroke-width="1.5" stroke-opacity="0.45"/>
        <circle cx="26" cy="23" r="5" fill="#F59E0B"/>
        <text x="46" y="29" fill="#FDE68A" font-family="'Outfit', sans-serif" font-size="17" font-weight="800" letter-spacing="2.5">
          FOR MAKERS &amp; ARTISANS
        </text>
      </g>

      <!-- Primary Headline: "Your craft deserves more than one bazaar." -->
      <g transform="translate(0, 355)">
        <text x="0" y="0" fill="#FDFCF0" font-family="'Outfit', 'Plus Jakarta Sans', sans-serif" font-size="82" font-weight="800" letter-spacing="-0.5">
          Your craft deserves
        </text>
        <text x="0" y="98" fill="url(#goldFoil)" font-family="'Outfit', 'Plus Jakarta Sans', sans-serif" font-size="88" font-weight="900" letter-spacing="-0.5">
          more than one bazaar.
        </text>
      </g>

      <!-- Subtitle: "Take your handmade business online and reach more customers through Giftisan." -->
      <g transform="translate(0, 560)">
        <text x="0" y="0" fill="#FDFCF0" fill-opacity="0.9" font-family="'EB Garamond', 'Georgia', serif" font-size="40" font-style="italic" font-weight="400">
          Take your handmade business online and reach
        </text>
        <text x="0" y="55" fill="#FDFCF0" fill-opacity="0.9" font-family="'EB Garamond', 'Georgia', serif" font-size="40" font-style="italic" font-weight="400">
          more customers through Giftisan.
        </text>
      </g>

      <!-- 3 Key Trust Pills: SNUGLY FITTED TO TEXT CONTENT WITH NO EXCESSIVE RIGHT PADDING -->
      <g transform="translate(0, 720)">
        <!-- Pill 1: 0% Setup Fee (fitted width: 192) -->
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="192" height="52" rx="26" fill="#FDFCF0" fill-opacity="0.08" stroke="#FDFCF0" stroke-width="1.2" stroke-opacity="0.25"/>
          <circle cx="24" cy="26" r="4.5" fill="#10B981"/>
          <text x="42" y="33" fill="#FDFCF0" font-family="'Outfit', sans-serif" font-size="20" font-weight="600" letter-spacing="0.5">0% Setup Fee</text>
        </g>
        <!-- Pill 2: Doorstep Shipping (fitted width: 240) -->
        <g transform="translate(210, 0)">
          <rect x="0" y="0" width="240" height="52" rx="26" fill="#FDFCF0" fill-opacity="0.08" stroke="#FDFCF0" stroke-width="1.2" stroke-opacity="0.25"/>
          <circle cx="24" cy="26" r="4.5" fill="#10B981"/>
          <text x="42" y="33" fill="#FDFCF0" font-family="'Outfit', sans-serif" font-size="20" font-weight="600" letter-spacing="0.5">Doorstep Shipping</text>
        </g>
        <!-- Pill 3: Instant Payouts (fitted width: 210) -->
        <g transform="translate(468, 0)">
          <rect x="0" y="0" width="210" height="52" rx="26" fill="#FDFCF0" fill-opacity="0.08" stroke="#FDFCF0" stroke-width="1.2" stroke-opacity="0.25"/>
          <circle cx="24" cy="26" r="4.5" fill="#10B981"/>
          <text x="42" y="33" fill="#FDFCF0" font-family="'Outfit', sans-serif" font-size="20" font-weight="600" letter-spacing="0.5">Instant Payouts</text>
        </g>
      </g>

      <!-- Bottom Platform Tag: Moved lower to y=970 to align with bottom of QR plaque -->
      <g transform="translate(0, 970)">
        <text fill="#FDFCF0" fill-opacity="0.45" font-family="'Outfit', sans-serif" font-size="19" font-weight="600" letter-spacing="4">
          GIFTISAN.COM • EMPOWERING EGYPTIAN HANDMADE BUSINESSES
        </text>
      </g>
    </g>

    <!-- ================= RIGHT COLUMN: QR PLAQUE ================= -->
    <g transform="translate(1420, 110)" filter="url(#plaqueDropShadow)">
      <rect x="0" y="0" width="560" height="970" rx="44" fill="#FDFCF0" stroke="#F59E0B" stroke-width="3.5"/>
      <rect x="18" y="18" width="524" height="934" rx="34" fill="none" stroke="#064E3B" stroke-width="1.2" stroke-opacity="0.15"/>

      <!-- Header: SCAN TO JOIN -->
      <g transform="translate(280, 110)" text-anchor="middle">
        <text y="0" fill="#064E3B" font-family="'Outfit', 'Plus Jakarta Sans', sans-serif" font-size="42" font-weight="900" letter-spacing="6">
          SCAN TO JOIN
        </text>
        <line x1="-120" y1="24" x2="120" y2="24" stroke="#D97706" stroke-width="3" stroke-linecap="round"/>
        <text y="62" fill="#4B5563" font-family="'Outfit', sans-serif" font-size="22" font-weight="600" letter-spacing="2">
          OPEN YOUR MAKER SHOP
        </text>
      </g>

      <!-- Centered QR Box (Scans directly to https://giftisan.com) -->
      <g transform="translate(60, 240)">
        <rect x="0" y="0" width="440" height="440" rx="28" fill="#FFFFFF" stroke="#064E3B" stroke-width="1.5" stroke-opacity="0.12"/>
        <path d="${frontQR.path}" fill="#064E3B"/>

        <!-- Center Official Icon Badge: Clipped corners -->
        <g transform="translate(175, 175)">
          <rect x="0" y="0" width="90" height="90" rx="20" fill="#064E3B" stroke="#FFFFFF" stroke-width="4"/>
          <image href="${iconPngBase64}" x="5" y="5" width="80" height="80" clip-path="url(#frontQrBadgeClip)"/>
        </g>
      </g>

      <!-- URL Button: giftisan.com -->
      <g transform="translate(280, 810)">
        <rect x="-220" y="0" width="440" height="84" rx="42" fill="#064E3B"/>
        <rect x="-218" y="2" width="436" height="80" rx="40" fill="none" stroke="#F59E0B" stroke-width="2" stroke-opacity="0.5"/>
        <text text-anchor="middle" y="54" fill="#FDFCF0" font-family="'Outfit', 'Plus Jakarta Sans', sans-serif" font-size="36" font-weight="900" letter-spacing="4">
          giftisan.com
        </text>
      </g>
    </g>
  </svg>
  `;
}

// =========================================================================
// 2. BACK CARD - FULL BLEED, ZERO EDGE PADDING, WARM CREAM (2100x1200)
// =========================================================================
function getBackCreamSvg(): string {
  return `
  <svg width="2100" height="1200" viewBox="0 0 2100 1200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Warm tactile Egyptian cream background -->
      <linearGradient id="bgBackCream" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="50%" stop-color="#FDFCF0"/>
        <stop offset="100%" stop-color="#F6F1E3"/>
      </linearGradient>

      <linearGradient id="emeraldPillGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#085A44"/>
        <stop offset="100%" stop-color="#033023"/>
      </linearGradient>

      <!-- Wide boundary shadow for card boxes (no clipping) -->
      <filter id="softCardShadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="14" stdDeviation="20" flood-color="#064E3B" flood-opacity="0.1"/>
      </filter>

      <!-- Clip path for back QR center badge -->
      <clipPath id="backQrBadgeClip">
        <rect x="0" y="0" width="70" height="70" rx="16" ry="16"/>
      </clipPath>
    </defs>

    <!-- Full Bleed Edge-to-Edge Canvas -->
    <rect width="2100" height="1200" fill="url(#bgBackCream)"/>

    <!-- ================= LEFT COLUMN: HEADLINE & 4 PILLARS (62% WIDTH) ================= -->
    <g transform="translate(120, 100)">
      
      <!-- Top Eyebrow: Generously sized for all fonts (W=320) -->
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="320" height="44" rx="22" fill="#064E3B" fill-opacity="0.08" stroke="#064E3B" stroke-width="1.2" stroke-opacity="0.25"/>
        <text x="160" y="28" text-anchor="middle" fill="#064E3B" font-family="'Outfit', sans-serif" font-size="16" font-weight="800" letter-spacing="3">
          THE ARTISAN JOURNEY
        </text>
      </g>

      <!-- Main Headline: Positioned with clean 45px vertical gap below eyebrow -->
      <g transform="translate(0, 85)">
        <text x="0" y="52" fill="#064E3B" font-family="'Outfit', 'Plus Jakarta Sans', sans-serif" font-size="64" font-weight="900" letter-spacing="2">
          YOU MAKE IT.
        </text>
        <text x="0" y="126" fill="#D97706" font-family="'Outfit', 'Plus Jakarta Sans', sans-serif" font-size="64" font-weight="900" letter-spacing="2">
          WE HELP PEOPLE FIND IT.
        </text>
      </g>

      <!-- 4 Value Steps in 2x2 Grid (Spacious, clean, borderless cards) -->
      <g transform="translate(0, 280)">
        
        <!-- STEP 01: Create your shop -->
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="550" height="225" rx="26" fill="#FFFFFF" stroke="#064E3B" stroke-width="1.2" stroke-opacity="0.12" filter="url(#softCardShadow)"/>
          <rect x="28" y="28" width="50" height="50" rx="14" fill="#064E3B"/>
          <text x="53" y="62" text-anchor="middle" fill="#FDFCF0" font-family="'Outfit', sans-serif" font-size="24" font-weight="900">01</text>
          
          <text x="96" y="60" fill="#064E3B" font-family="'Outfit', sans-serif" font-size="28" font-weight="800">Create your shop.</text>
          
          <text x="28" y="118" fill="#4B5563" font-family="'Outfit', sans-serif" font-size="21" font-weight="500">
            Set up your custom maker store
          </text>
          <text x="28" y="150" fill="#4B5563" font-family="'Outfit', sans-serif" font-size="21" font-weight="500">
            in 2 minutes. Zero technical hassle.
          </text>
          <text x="28" y="190" fill="#D97706" font-family="'Outfit', sans-serif" font-size="18" font-weight="700">
            ★ Free to open &amp; launch
          </text>
        </g>

        <!-- STEP 02: Showcase your products -->
        <g transform="translate(580, 0)">
          <rect x="0" y="0" width="550" height="225" rx="26" fill="#FFFFFF" stroke="#064E3B" stroke-width="1.2" stroke-opacity="0.12" filter="url(#softCardShadow)"/>
          <rect x="28" y="28" width="50" height="50" rx="14" fill="#064E3B"/>
          <text x="53" y="62" text-anchor="middle" fill="#FDFCF0" font-family="'Outfit', sans-serif" font-size="24" font-weight="900">02</text>
          
          <text x="96" y="60" fill="#064E3B" font-family="'Outfit', sans-serif" font-size="26" font-weight="800">Showcase your products.</text>
          
          <text x="28" y="118" fill="#4B5563" font-family="'Outfit', sans-serif" font-size="21" font-weight="500">
            Present high-res craft gallery,
          </text>
          <text x="28" y="150" fill="#4B5563" font-family="'Outfit', sans-serif" font-size="21" font-weight="500">
            maker story &amp; bespoke customization.
          </text>
          <text x="28" y="190" fill="#D97706" font-family="'Outfit', sans-serif" font-size="18" font-weight="700">
            ★ Dedicated artisan bio page
          </text>
        </g>

        <!-- STEP 03: Reach customers beyond bazaars (wrapped onto 2 lines, fits cleanly inside container) -->
        <g transform="translate(0, 255)">
          <rect x="0" y="0" width="550" height="225" rx="26" fill="#FFFFFF" stroke="#064E3B" stroke-width="1.2" stroke-opacity="0.12" filter="url(#softCardShadow)"/>
          <rect x="28" y="28" width="50" height="50" rx="14" fill="#064E3B"/>
          <text x="53" y="62" text-anchor="middle" fill="#FDFCF0" font-family="'Outfit', sans-serif" font-size="24" font-weight="900">03</text>
          
          <text x="96" y="48" fill="#064E3B" font-family="'Outfit', sans-serif" font-size="23" font-weight="800">Reach customers</text>
          <text x="96" y="74" fill="#064E3B" font-family="'Outfit', sans-serif" font-size="23" font-weight="800">beyond bazaars.</text>
          
          <text x="28" y="118" fill="#4B5563" font-family="'Outfit', sans-serif" font-size="21" font-weight="500">
            Never depend on weekend events.
          </text>
          <text x="28" y="150" fill="#4B5563" font-family="'Outfit', sans-serif" font-size="21" font-weight="500">
            Sell 365 days a year across Egypt.
          </text>
          <text x="28" y="190" fill="#D97706" font-family="'Outfit', sans-serif" font-size="18" font-weight="700">
            ★ Always-on customer orders
          </text>
        </g>

        <!-- STEP 04: Grow your brand online -->
        <g transform="translate(580, 255)">
          <rect x="0" y="0" width="550" height="225" rx="26" fill="#FFFFFF" stroke="#064E3B" stroke-width="1.2" stroke-opacity="0.12" filter="url(#softCardShadow)"/>
          <rect x="28" y="28" width="50" height="50" rx="14" fill="#064E3B"/>
          <text x="53" y="62" text-anchor="middle" fill="#FDFCF0" font-family="'Outfit', sans-serif" font-size="24" font-weight="900">04</text>
          
          <text x="96" y="60" fill="#064E3B" font-family="'Outfit', sans-serif" font-size="26" font-weight="800">Grow your brand online.</text>
          
          <text x="28" y="118" fill="#4B5563" font-family="'Outfit', sans-serif" font-size="21" font-weight="500">
            Automated courier doorstep pickup,
          </text>
          <text x="28" y="150" fill="#4B5563" font-family="'Outfit', sans-serif" font-size="21" font-weight="500">
            buyer escrow &amp; direct bank payouts.
          </text>
          <text x="28" y="190" fill="#D97706" font-family="'Outfit', sans-serif" font-size="18" font-weight="700">
            ★ Safe escrow to Instapay / Bank
          </text>
        </g>
      </g>

      <!-- Trust Badges Row: Generous 85px gap below cards, spaced across full 1130px column width -->
      <g transform="translate(0, 845)">
        <!-- Item 1: Verified Handmade Only -->
        <g transform="translate(0, 0)">
          <text fill="#064E3B" font-family="'Outfit', sans-serif" font-size="21" font-weight="800">✓</text>
          <text x="26" fill="#374151" font-family="'Outfit', sans-serif" font-size="21" font-weight="600" letter-spacing="0.2">Verified Handmade Only</text>
        </g>
        
        <!-- Item 2: Dedicated Support Team -->
        <g transform="translate(420, 0)">
          <text fill="#064E3B" font-family="'Outfit', sans-serif" font-size="21" font-weight="800">✓</text>
          <text x="26" fill="#374151" font-family="'Outfit', sans-serif" font-size="21" font-weight="600" letter-spacing="0.2">Dedicated Support Team</text>
        </g>

        <!-- Item 3: Keep Your Brand Identity -->
        <g transform="translate(820, 0)">
          <text fill="#064E3B" font-family="'Outfit', sans-serif" font-size="21" font-weight="800">✓</text>
          <text x="26" fill="#374151" font-family="'Outfit', sans-serif" font-size="21" font-weight="600" letter-spacing="0.2">Keep Your Brand Identity</text>
        </g>
      </g>

      <!-- Bottom Platform Tag: Moved lower to y=1000 (100px from bottom edge) -->
      <g transform="translate(0, 1000)">
        <text fill="#064E3B" fill-opacity="0.5" font-family="'Outfit', sans-serif" font-size="19" font-weight="700" letter-spacing="4">
          GIFTISAN.COM • JOIN THE CIRCLE OF EGYPTIAN HANDMADE ARTISANS
        </text>
      </g>
    </g>

    <!-- ================= RIGHT COLUMN: ACTION & QR MODULE (38% WIDTH) ================= -->
    <g transform="translate(1330, 100)">
      
      <!-- Big Action Card -->
      <rect x="0" y="0" width="650" height="980" rx="44" fill="#FFFFFF" stroke="#064E3B" stroke-width="2" stroke-opacity="0.15" filter="url(#softCardShadow)"/>
      <rect x="18" y="18" width="614" height="944" rx="34" fill="none" stroke="#D97706" stroke-width="1.2" stroke-opacity="0.3"/>

      <!-- CTA Button: OPEN YOUR SHOP → (NO CLIPPED SHADOW, CRISP PRISTINE PILL) -->
      <g transform="translate(65, 65)">
        <rect x="0" y="0" width="520" height="104" rx="52" fill="url(#emeraldPillGrad)"/>
        <rect x="2" y="2" width="516" height="100" rx="50" fill="none" stroke="#F59E0B" stroke-width="2.5" stroke-opacity="0.6"/>
        <text x="260" y="64" text-anchor="middle" fill="#FDFCF0" font-family="'Outfit', 'Plus Jakarta Sans', sans-serif" font-size="34" font-weight="900" letter-spacing="3">
          OPEN YOUR SHOP →
        </text>
      </g>

      <!-- Centered QR Box (Scans directly to https://giftisan.com) -->
      <g transform="translate(135, 220)">
        <rect x="0" y="0" width="380" height="380" rx="26" fill="#FDFCF0" stroke="#064E3B" stroke-width="1.5" stroke-opacity="0.12"/>
        <path d="${backQR.path}" fill="#064E3B"/>
        
        <!-- Center Icon Badge: Clipped corners -->
        <g transform="translate(150, 150)">
          <rect x="0" y="0" width="80" height="80" rx="18" fill="#064E3B" stroke="#FFFFFF" stroke-width="3.5"/>
          <image href="${iconPngBase64}" x="5" y="5" width="70" height="70" clip-path="url(#backQrBadgeClip)"/>
        </g>
      </g>

      <!-- Scan Instruction -->
      <text x="325" y="650" text-anchor="middle" fill="#064E3B" font-family="'Outfit', sans-serif" font-size="24" font-weight="900" letter-spacing="3">
        SCAN TO JOIN ONLINE
      </text>
      <text x="325" y="682" text-anchor="middle" fill="#6B7280" font-family="'Outfit', sans-serif" font-size="19" font-weight="500">
        Points directly to giftisan.com
      </text>

      <line x1="80" y1="715" x2="570" y2="715" stroke="#064E3B" stroke-width="1" stroke-opacity="0.12"/>

      <!-- Instagram Handle Pill: @giftisan_eg (clean, centered with no trailing text) -->
      <g transform="translate(325, 795)">
        <rect x="-160" y="-34" width="320" height="68" rx="34" fill="#064E3B" fill-opacity="0.08" stroke="#064E3B" stroke-width="1.8" stroke-opacity="0.25"/>
        
        <!-- Instagram Camera Glyph -->
        <rect x="-124" y="-17" width="34" height="34" rx="9.5" fill="none" stroke="#D97706" stroke-width="3"/>
        <circle cx="-107" cy="0" r="7" fill="none" stroke="#D97706" stroke-width="3"/>
        <circle cx="-97" cy="-8" r="2.5" fill="#D97706"/>

        <text x="-74" y="10" fill="#064E3B" font-family="'Outfit', 'Segoe UI', sans-serif" font-size="30" font-weight="900" letter-spacing="1">
          @giftisan_eg
        </text>
      </g>
    </g>
  </svg>
  `;
}

// =========================================================================
// 3. ARABIC FRONT CARD - EMERALD VELVET (RTL NATURAL HIERARCHY)
// =========================================================================
export function getFrontEmeraldArabicSvg(): string {
  return `
  <svg width="2100" height="1200" viewBox="0 0 2100 1200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgFrontAr" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#075640"/>
        <stop offset="40%" stop-color="#064E3B"/>
        <stop offset="100%" stop-color="#02271C"/>
      </linearGradient>

      <radialGradient id="ambientGlowAr" cx="80%" cy="25%" r="85%">
        <stop offset="0%" stop-color="#0D9488" stop-opacity="0.32"/>
        <stop offset="50%" stop-color="#064E3B" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>

      <linearGradient id="goldFoilAr" x1="100%" y1="0%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#F59E0B"/>
        <stop offset="35%" stop-color="#FDE68A"/>
        <stop offset="70%" stop-color="#F59E0B"/>
        <stop offset="100%" stop-color="#D97706"/>
      </linearGradient>

      <filter id="plaqueDropShadowAr" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="24" stdDeviation="32" flood-color="#000000" flood-opacity="0.5"/>
      </filter>

      <filter id="iconSoftShadowAr" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000000" flood-opacity="0.35"/>
      </filter>

      <clipPath id="logoClipAr">
        <rect x="0" y="0" width="112" height="112" rx="26" ry="26"/>
      </clipPath>
      <clipPath id="frontQrBadgeClipAr">
        <rect x="0" y="0" width="80" height="80" rx="16" ry="16"/>
      </clipPath>

      <style>
        @font-face {
          font-family: 'Cairo';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url(data:font/woff2;base64,${CAIRO_WOFF2_BASE64}) format('woff2');
        }
        @font-face {
          font-family: 'Cairo';
          font-style: normal;
          font-weight: 600;
          font-display: swap;
          src: url(data:font/woff2;base64,${CAIRO_WOFF2_BASE64}) format('woff2');
        }
        @font-face {
          font-family: 'Cairo';
          font-style: normal;
          font-weight: 700;
          font-display: swap;
          src: url(data:font/woff2;base64,${CAIRO_WOFF2_BASE64}) format('woff2');
        }
        @font-face {
          font-family: 'Cairo';
          font-style: normal;
          font-weight: 800;
          font-display: swap;
          src: url(data:font/woff2;base64,${CAIRO_WOFF2_BASE64}) format('woff2');
        }
        @font-face {
          font-family: 'Cairo';
          font-style: normal;
          font-weight: 900;
          font-display: swap;
          src: url(data:font/woff2;base64,${CAIRO_WOFF2_BASE64}) format('woff2');
        }
      </style>
    </defs>

    <!-- Canvas -->
    <rect width="2100" height="1200" fill="url(#bgFrontAr)"/>
    <rect width="2100" height="1200" fill="url(#ambientGlowAr)"/>

    <!-- ================= LEFT COLUMN: ACTION & QR PLAQUE ================= -->
    <g transform="translate(120, 110)" filter="url(#plaqueDropShadowAr)">
      <rect x="0" y="0" width="560" height="970" rx="44" fill="#FDFCF0" stroke="#F59E0B" stroke-width="3.5"/>
      <rect x="18" y="18" width="524" height="934" rx="34" fill="none" stroke="#064E3B" stroke-width="1.2" stroke-opacity="0.15"/>

      <!-- Header: امسح الكود -->
      <g transform="translate(280, 105)" text-anchor="middle">
        <text y="0" fill="#064E3B" font-family="'Cairo', 'Alexandria', sans-serif" font-size="44" font-weight="900" direction="rtl">
          امسح الكود
        </text>
        <line x1="-70" y1="22" x2="70" y2="22" stroke="#D97706" stroke-width="3" stroke-linecap="round"/>
        <text y="64" fill="#4B5563" font-family="'Cairo', 'Alexandria', sans-serif" font-size="20" font-weight="700" direction="rtl">
          افتح متجرك وسجل كصانع
        </text>
      </g>

      <!-- Centered QR Box (Scans directly to https://giftisan.com) -->
      <g transform="translate(60, 240)">
        <rect x="0" y="0" width="440" height="440" rx="28" fill="#FFFFFF" stroke="#064E3B" stroke-width="1.5" stroke-opacity="0.12"/>
        <path d="${frontQR.path}" fill="#064E3B"/>

        <!-- Center Official Icon Badge -->
        <g transform="translate(175, 175)">
          <rect x="0" y="0" width="90" height="90" rx="20" fill="#064E3B" stroke="#FFFFFF" stroke-width="4"/>
          <image href="${iconPngBase64}" x="5" y="5" width="80" height="80" clip-path="url(#frontQrBadgeClipAr)"/>
        </g>
      </g>

      <!-- URL Button: giftisan.com -->
      <g transform="translate(280, 810)">
        <rect x="-220" y="0" width="440" height="84" rx="42" fill="#064E3B"/>
        <rect x="-218" y="2" width="436" height="80" rx="40" fill="none" stroke="#F59E0B" stroke-width="2" stroke-opacity="0.5"/>
        <text text-anchor="middle" y="54" fill="#FDFCF0" font-family="'Outfit', sans-serif" font-size="36" font-weight="900" letter-spacing="4">
          giftisan.com
        </text>
      </g>
    </g>

    <!-- ================= RIGHT COLUMN: BRANDING & HEADLINE (RTL ALIGNED) ================= -->
    <g transform="translate(760, 110)">
      
      <!-- Brand Header Lockup (Right-Aligned) -->
      <g transform="translate(1220, 0)">
        <!-- Logo Icon on the far right -->
        <g transform="translate(-112, 0)" filter="url(#iconSoftShadowAr)">
          <rect x="0" y="0" width="112" height="112" rx="26" fill="#064E3B"/>
          <image href="${iconPngBase64}" x="0" y="0" width="112" height="112" clip-path="url(#logoClipAr)"/>
          <rect x="0" y="0" width="112" height="112" rx="26" fill="none" stroke="#F59E0B" stroke-width="2.5" stroke-opacity="0.5"/>
        </g>

        <!-- Brand Name & Tagline flowing leftward from icon -->
        <text x="-140" y="65" fill="#FDFCF0" font-family="'Cairo', 'Alexandria', sans-serif" font-size="56" font-weight="900" direction="rtl" text-anchor="start">
          جيفتيزان
        </text>
        <text x="-140" y="105" fill="#F59E0B" font-family="'Cairo', 'Alexandria', sans-serif" font-size="20" font-weight="700" direction="rtl" text-anchor="start">
          منصة الحرف والمنتجات اليدوية المصرية
        </text>
      </g>

      <!-- Eyebrow Pill (Generously Sized: W=300px, guarantees perfect fit in Cairo & System Fonts) -->
      <g transform="translate(1220, 195)">
        <rect x="-300" y="0" width="300" height="44" rx="22" fill="#F59E0B" fill-opacity="0.16" stroke="#F59E0B" stroke-width="1.5" stroke-opacity="0.45"/>
        <circle cx="-18" cy="22" r="4.5" fill="#F59E0B"/>
        <text x="-36" y="29" fill="#FDE68A" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="18" font-weight="800" direction="rtl" text-anchor="start">
          لصناع الحرف اليدوية والفنانين
        </text>
      </g>

      <!-- Primary Headline -->
      <g transform="translate(1220, 360)">
        <text x="0" y="0" fill="#FDFCF0" font-family="'Cairo', 'Alexandria', sans-serif" font-size="76" font-weight="900" direction="rtl" text-anchor="start">
          شغلك اليدوي يستاهل
        </text>
        <text x="0" y="100" fill="url(#goldFoilAr)" font-family="'Cairo', 'Alexandria', sans-serif" font-size="82" font-weight="900" direction="rtl" text-anchor="start">
          أكتر من مجرد بازار.
        </text>
      </g>

      <!-- Subtitle -->
      <g transform="translate(1220, 565)">
        <text x="0" y="0" fill="#FDFCF0" fill-opacity="0.9" font-family="'Cairo', 'Alexandria', sans-serif" font-size="34" font-weight="600" direction="rtl" text-anchor="start">
          انقل مشروعك للإنترنت واوصل لعملاء في كل مكان
        </text>
        <text x="0" y="55" fill="#FDFCF0" fill-opacity="0.9" font-family="'Cairo', 'Alexandria', sans-serif" font-size="34" font-weight="600" direction="rtl" text-anchor="start">
          واستقبل طلباتك أونلاين عبر منصة جيفتيزان.
        </text>
      </g>

      <!-- 3 Key Trust Pills (Generously sized for all Arabic fonts: W=210, 175, 225) -->
      <g transform="translate(1220, 720)">
        <!-- Pill 1: بدون رسوم اشتراك (W=210) -->
        <g transform="translate(-210, 0)">
          <rect x="0" y="0" width="210" height="48" rx="24" fill="#FDFCF0" fill-opacity="0.08" stroke="#FDFCF0" stroke-width="1.2" stroke-opacity="0.25"/>
          <circle cx="188" cy="24" r="4.5" fill="#10B981"/>
          <text x="172" y="32" fill="#FDFCF0" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="19" font-weight="700" direction="rtl" text-anchor="start">بدون رسوم اشتراك</text>
        </g>

        <!-- Pill 2: شحن لباب بيتك (W=175) -->
        <g transform="translate(-403, 0)">
          <rect x="0" y="0" width="175" height="48" rx="24" fill="#FDFCF0" fill-opacity="0.08" stroke="#FDFCF0" stroke-width="1.2" stroke-opacity="0.25"/>
          <circle cx="155" cy="24" r="4.5" fill="#10B981"/>
          <text x="139" y="32" fill="#FDFCF0" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="19" font-weight="700" direction="rtl" text-anchor="start">شحن لباب بيتك</text>
        </g>

        <!-- Pill 3: تحويل فوري للأرباح (W=225) -->
        <g transform="translate(-646, 0)">
          <rect x="0" y="0" width="225" height="48" rx="24" fill="#FDFCF0" fill-opacity="0.08" stroke="#FDFCF0" stroke-width="1.2" stroke-opacity="0.25"/>
          <circle cx="203" cy="24" r="4.5" fill="#10B981"/>
          <text x="187" y="32" fill="#FDFCF0" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="19" font-weight="700" direction="rtl" text-anchor="start">تحويل فوري للأرباح</text>
        </g>
      </g>

      <!-- Bottom Platform Tag -->
      <g transform="translate(1220, 970)">
        <text fill="#FDFCF0" fill-opacity="0.45" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="20" font-weight="700" direction="rtl" text-anchor="start">
          GIFTISAN.COM • المنصة المصرية الأولى لدعم وتمكين الحرف اليدوية
        </text>
      </g>
    </g>
  </svg>
  `;
}

// =========================================================================
// 4. ARABIC BACK CARD - ARTISANAL WARM CREAM (RTL 4 STEPS)
// =========================================================================
export function getBackCreamArabicSvg(): string {
  return `
  <svg width="2100" height="1200" viewBox="0 0 2100 1200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgBackCreamAr" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="50%" stop-color="#FDFCF0"/>
        <stop offset="100%" stop-color="#F6F1E3"/>
      </linearGradient>

      <linearGradient id="emeraldPillGradAr" x1="100%" y1="0%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#085A44"/>
        <stop offset="100%" stop-color="#033023"/>
      </linearGradient>

      <filter id="softCardShadowAr" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="14" stdDeviation="20" flood-color="#064E3B" flood-opacity="0.1"/>
      </filter>

      <clipPath id="backQrBadgeClipAr">
        <rect x="0" y="0" width="70" height="70" rx="16" ry="16"/>
      </clipPath>

      <style>
        @font-face {
          font-family: 'Cairo';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url(data:font/woff2;base64,${CAIRO_WOFF2_BASE64}) format('woff2');
        }
        @font-face {
          font-family: 'Cairo';
          font-style: normal;
          font-weight: 600;
          font-display: swap;
          src: url(data:font/woff2;base64,${CAIRO_WOFF2_BASE64}) format('woff2');
        }
        @font-face {
          font-family: 'Cairo';
          font-style: normal;
          font-weight: 700;
          font-display: swap;
          src: url(data:font/woff2;base64,${CAIRO_WOFF2_BASE64}) format('woff2');
        }
        @font-face {
          font-family: 'Cairo';
          font-style: normal;
          font-weight: 800;
          font-display: swap;
          src: url(data:font/woff2;base64,${CAIRO_WOFF2_BASE64}) format('woff2');
        }
        @font-face {
          font-family: 'Cairo';
          font-style: normal;
          font-weight: 900;
          font-display: swap;
          src: url(data:font/woff2;base64,${CAIRO_WOFF2_BASE64}) format('woff2');
        }
      </style>
    </defs>

    <rect width="2100" height="1200" fill="url(#bgBackCreamAr)"/>

    <!-- ================= LEFT COLUMN: ACTION & QR MODULE (38% WIDTH) ================= -->
    <g transform="translate(120, 100)">
      <rect x="0" y="0" width="650" height="980" rx="44" fill="#FFFFFF" stroke="#064E3B" stroke-width="2" stroke-opacity="0.15" filter="url(#softCardShadowAr)"/>
      <rect x="18" y="18" width="614" height="944" rx="34" fill="none" stroke="#D97706" stroke-width="1.2" stroke-opacity="0.3"/>

      <!-- CTA Button: افتح متجرك الآن ← -->
      <g transform="translate(65, 65)">
        <rect x="0" y="0" width="520" height="104" rx="52" fill="url(#emeraldPillGradAr)"/>
        <rect x="2" y="2" width="516" height="100" rx="50" fill="none" stroke="#F59E0B" stroke-width="2.5" stroke-opacity="0.6"/>
        <text x="260" y="66" text-anchor="middle" fill="#FDFCF0" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="34" font-weight="900" direction="rtl">
          افتح متجرك الآن ←
        </text>
      </g>

      <!-- Centered QR Box (Scans directly to https://giftisan.com) -->
      <g transform="translate(135, 220)">
        <rect x="0" y="0" width="380" height="380" rx="26" fill="#FDFCF0" stroke="#064E3B" stroke-width="1.5" stroke-opacity="0.12"/>
        <path d="${backQR.path}" fill="#064E3B"/>
        
        <!-- Center Icon Badge -->
        <g transform="translate(150, 150)">
          <rect x="0" y="0" width="80" height="80" rx="18" fill="#064E3B" stroke="#FFFFFF" stroke-width="3.5"/>
          <image href="${iconPngBase64}" x="5" y="5" width="70" height="70" clip-path="url(#backQrBadgeClipAr)"/>
        </g>
      </g>

      <!-- Scan Instruction -->
      <text x="325" y="650" text-anchor="middle" fill="#064E3B" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="26" font-weight="900" direction="rtl">
        امسح الكود وسجل أونلاين
      </text>
      <text x="325" y="684" text-anchor="middle" fill="#6B7280" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="19" font-weight="600" direction="rtl">
        ينقلك مباشرة لموقع giftisan.com
      </text>

      <line x1="80" y1="715" x2="570" y2="715" stroke="#064E3B" stroke-width="1" stroke-opacity="0.12"/>

      <!-- Instagram Handle Pill: @giftisan_eg -->
      <g transform="translate(325, 795)">
        <rect x="-160" y="-34" width="320" height="68" rx="34" fill="#064E3B" fill-opacity="0.08" stroke="#064E3B" stroke-width="1.8" stroke-opacity="0.25"/>
        <rect x="-124" y="-17" width="34" height="34" rx="9.5" fill="none" stroke="#D97706" stroke-width="3"/>
        <circle cx="-107" cy="0" r="7" fill="none" stroke="#D97706" stroke-width="3"/>
        <circle cx="-97" cy="-8" r="2.5" fill="#D97706"/>
        <text x="-74" y="10" fill="#064E3B" font-family="'Outfit', 'Segoe UI', sans-serif" font-size="30" font-weight="900" letter-spacing="1">
          @giftisan_eg
        </text>
      </g>
    </g>

    <!-- ================= RIGHT COLUMN: HEADLINE & 4 PILLARS (62% WIDTH) ================= -->
    <g transform="translate(850, 100)">
      
      <!-- Top Eyebrow (Generously Fitted: W=280) -->
      <g transform="translate(1130, 0)">
        <rect x="-280" y="0" width="280" height="44" rx="22" fill="#064E3B" fill-opacity="0.08" stroke="#064E3B" stroke-width="1.2" stroke-opacity="0.25"/>
        <text x="-140" y="29" text-anchor="middle" fill="#064E3B" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="17" font-weight="800" direction="rtl">
          رحلة الصانع في جيفتيزان
        </text>
      </g>

      <!-- Main Headline -->
      <g transform="translate(1130, 85)">
        <text x="0" y="52" fill="#064E3B" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="60" font-weight="900" direction="rtl" text-anchor="start">
          أنت بتبدع وتصنع.
        </text>
        <text x="0" y="126" fill="#D97706" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="60" font-weight="900" direction="rtl" text-anchor="start">
          وإحنا بنوصلك بالناس.
        </text>
      </g>

      <!-- 4 Value Steps in 2x2 Grid (RTL Grid: Top-Right is 01, Top-Left is 02, etc.) -->
      <g transform="translate(0, 280)">
        
        <!-- STEP 01: أنشئ متجرك (Top Right: x=580) -->
        <g transform="translate(580, 0)">
          <rect x="0" y="0" width="550" height="225" rx="26" fill="#FFFFFF" stroke="#064E3B" stroke-width="1.2" stroke-opacity="0.12" filter="url(#softCardShadowAr)"/>
          <rect x="472" y="28" width="50" height="50" rx="14" fill="#064E3B"/>
          <text x="497" y="62" text-anchor="middle" fill="#FDFCF0" font-family="'Outfit', sans-serif" font-size="24" font-weight="900">01</text>
          
          <text x="450" y="60" fill="#064E3B" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="25" font-weight="800" direction="rtl" text-anchor="start">أنشئ متجرك الإلكتروني.</text>
          
          <text x="522" y="118" fill="#4B5563" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="19" font-weight="600" direction="rtl" text-anchor="start">
            متجر خاص بيك وبقصتك في دقيقتين.
          </text>
          <text x="522" y="148" fill="#4B5563" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="19" font-weight="600" direction="rtl" text-anchor="start">
            بدون أي تعقيد أو مصاريف تقنية.
          </text>
          <text x="522" y="190" fill="#D97706" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="17" font-weight="700" direction="rtl" text-anchor="start">
            ★ التسجيل والفتح مجاناً بالكامل
          </text>
        </g>

        <!-- STEP 02: اعرض منتجاتك (Top Left: x=0) -->
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="550" height="225" rx="26" fill="#FFFFFF" stroke="#064E3B" stroke-width="1.2" stroke-opacity="0.12" filter="url(#softCardShadowAr)"/>
          <rect x="472" y="28" width="50" height="50" rx="14" fill="#064E3B"/>
          <text x="497" y="62" text-anchor="middle" fill="#FDFCF0" font-family="'Outfit', sans-serif" font-size="24" font-weight="900">02</text>
          
          <text x="450" y="60" fill="#064E3B" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="25" font-weight="800" direction="rtl" text-anchor="start">اعرض منتجاتك بحرية.</text>
          
          <text x="522" y="118" fill="#4B5563" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="19" font-weight="600" direction="rtl" text-anchor="start">
            معرض صور احترافي، قصة صنعتك،
          </text>
          <text x="522" y="148" fill="#4B5563" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="19" font-weight="600" direction="rtl" text-anchor="start">
            واستقبال طلبات التفصيل المخصوص.
          </text>
          <text x="522" y="190" fill="#D97706" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="17" font-weight="700" direction="rtl" text-anchor="start">
            ★ صفحة تعريفية خاصة بكل صانع
          </text>
        </g>

        <!-- STEP 03: اوصل لعملاء (Bottom Right: x=580) -->
        <g transform="translate(580, 255)">
          <rect x="0" y="0" width="550" height="225" rx="26" fill="#FFFFFF" stroke="#064E3B" stroke-width="1.2" stroke-opacity="0.12" filter="url(#softCardShadowAr)"/>
          <rect x="472" y="28" width="50" height="50" rx="14" fill="#064E3B"/>
          <text x="497" y="62" text-anchor="middle" fill="#FDFCF0" font-family="'Outfit', sans-serif" font-size="24" font-weight="900">03</text>
          
          <text x="450" y="60" fill="#064E3B" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="25" font-weight="800" direction="rtl" text-anchor="start">اوصل لعملاء طول السنة.</text>
          
          <text x="522" y="118" fill="#4B5563" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="19" font-weight="600" direction="rtl" text-anchor="start">
            ماتعتمدش على إيفنتات الويك إند بس.
          </text>
          <text x="522" y="148" fill="#4B5563" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="19" font-weight="600" direction="rtl" text-anchor="start">
            شغلك معروض للبيع ٣٦٥ يوم في كل مصر.
          </text>
          <text x="522" y="190" fill="#D97706" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="17" font-weight="700" direction="rtl" text-anchor="start">
            ★ مبيعات وطلبات مستمرة بدون انقطاع
          </text>
        </g>

        <!-- STEP 04: نمّي علامتك (Bottom Left: x=0) -->
        <g transform="translate(0, 255)">
          <rect x="0" y="0" width="550" height="225" rx="26" fill="#FFFFFF" stroke="#064E3B" stroke-width="1.2" stroke-opacity="0.12" filter="url(#softCardShadowAr)"/>
          <rect x="472" y="28" width="50" height="50" rx="14" fill="#064E3B"/>
          <text x="497" y="62" text-anchor="middle" fill="#FDFCF0" font-family="'Outfit', sans-serif" font-size="24" font-weight="900">04</text>
          
          <text x="450" y="60" fill="#064E3B" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="25" font-weight="800" direction="rtl" text-anchor="start">نمّي علامتك التجارية.</text>
          
          <text x="522" y="118" fill="#4B5563" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="19" font-weight="600" direction="rtl" text-anchor="start">
            مندوب شحن يستلم من باب ورشتك،
          </text>
          <text x="522" y="148" fill="#4B5563" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="19" font-weight="600" direction="rtl" text-anchor="start">
            وحماية دفع وتحويل لأرباحك مباشرة.
          </text>
          <text x="522" y="190" fill="#D97706" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="17" font-weight="700" direction="rtl" text-anchor="start">
            ★ تحويل آمن للبنك أو انستاباي
          </text>
        </g>
      </g>

      <!-- Trust Badges Row (RTL aligned, 85px gap below cards) -->
      <g transform="translate(1130, 845)">
        <!-- Item 1 (Rightmost) -->
        <g transform="translate(0, 0)">
          <text fill="#064E3B" font-family="'Cairo', 'Segoe UI', sans-serif" font-size="22" font-weight="900" direction="rtl" text-anchor="start">✓</text>
          <text x="-30" fill="#374151" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="20" font-weight="700" direction="rtl" text-anchor="start">حرف ومنتجات يدوية موثقة</text>
        </g>

        <!-- Item 2 (Middle) -->
        <g transform="translate(-400, 0)">
          <text fill="#064E3B" font-family="'Cairo', 'Segoe UI', sans-serif" font-size="22" font-weight="900" direction="rtl" text-anchor="start">✓</text>
          <text x="-30" fill="#374151" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="20" font-weight="700" direction="rtl" text-anchor="start">فريق دعم مخصص للمصنعين</text>
        </g>

        <!-- Item 3 (Leftmost) -->
        <g transform="translate(-800, 0)">
          <text fill="#064E3B" font-family="'Cairo', 'Segoe UI', sans-serif" font-size="22" font-weight="900" direction="rtl" text-anchor="start">✓</text>
          <text x="-30" fill="#374151" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="20" font-weight="700" direction="rtl" text-anchor="start">اسمك وعلامتك ملكك بالكامل</text>
        </g>
      </g>

      <!-- Bottom Platform Tag -->
      <g transform="translate(1130, 1000)">
        <text fill="#064E3B" fill-opacity="0.55" font-family="'Cairo', 'Alexandria', 'Segoe UI', sans-serif" font-size="19" font-weight="700" direction="rtl" text-anchor="start">
          GIFTISAN.COM • انضم لمجتمع صناع الحرف والمنتجات اليدوية في مصر
        </text>
      </g>
    </g>
  </svg>
  `;
}

async function safeWriteFile(filePath: string, content: Buffer | string, retries = 5, delay = 350) {
  for (let i = 0; i < retries; i++) {
    try {
      fs.writeFileSync(filePath, content);
      return;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

async function run() {
  console.log("Generating perfected Giftisan Marketing Cards (English & Arabic)...");

  const outputDir = path.resolve("public/marketing/cards");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. Generate SVGs (English & Arabic)
  const frontEmeraldSvg = getFrontEmeraldSvg();
  const backCreamSvg = getBackCreamSvg();
  const frontEmeraldArSvg = getFrontEmeraldArabicSvg();
  const backCreamArSvg = getBackCreamArabicSvg();

  await safeWriteFile(path.join(outputDir, "giftisan-card-front.svg"), frontEmeraldSvg.trim());
  await safeWriteFile(path.join(outputDir, "giftisan-card-back.svg"), backCreamSvg.trim());
  await safeWriteFile(path.join(outputDir, "giftisan-card-front-ar.svg"), frontEmeraldArSvg.trim());
  await safeWriteFile(path.join(outputDir, "giftisan-card-back-ar.svg"), backCreamArSvg.trim());

  // 2. Render 300 DPI Ultra-Sharp PNGs (English & Arabic)
  const frontPngPath = path.join(outputDir, "giftisan-card-front.png");
  const backPngPath = path.join(outputDir, "giftisan-card-back.png");
  const frontArPngPath = path.join(outputDir, "giftisan-card-front-ar.png");
  const backArPngPath = path.join(outputDir, "giftisan-card-back-ar.png");

  const frontBufferPng = await sharp(Buffer.from(frontEmeraldSvg))
    .png({ quality: 100, compressionLevel: 9 })
    .toBuffer();
  await safeWriteFile(frontPngPath, frontBufferPng);

  const backBufferPng = await sharp(Buffer.from(backCreamSvg))
    .png({ quality: 100, compressionLevel: 9 })
    .toBuffer();
  await safeWriteFile(backPngPath, backBufferPng);

  const frontArBufferPng = await sharp(Buffer.from(frontEmeraldArSvg))
    .png({ quality: 100, compressionLevel: 9 })
    .toBuffer();
  await safeWriteFile(frontArPngPath, frontArBufferPng);

  const backArBufferPng = await sharp(Buffer.from(backCreamArSvg))
    .png({ quality: 100, compressionLevel: 9 })
    .toBuffer();
  await safeWriteFile(backArPngPath, backArBufferPng);

  console.log("Rendered 300 DPI PNGs for English & Arabic successfully.");

  // 3. Render Photorealistic 3D Physical Mockups
  const cardW = 1000;
  const cardH = Math.round(cardW / 1.75); // 571px

  // English 3D Mockup
  const frontCardResized = await sharp(frontBufferPng)
    .resize(cardW, cardH, { fit: "cover" })
    .png()
    .toBuffer();

  const backCardResized = await sharp(backBufferPng)
    .resize(cardW, cardH, { fit: "cover" })
    .png()
    .toBuffer();

  const realisticMockupSvg = `
    <svg width="2400" height="1500" viewBox="0 0 2400 1500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="tableGlow" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stop-color="#142B23"/>
          <stop offset="50%" stop-color="#0A1813"/>
          <stop offset="100%" stop-color="#040907"/>
        </radialGradient>

        <filter id="physicalShadowFront" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="15" dy="35" stdDeviation="40" flood-color="#000000" flood-opacity="0.65"/>
          <feDropShadow dx="4" dy="12" stdDeviation="15" flood-color="#000000" flood-opacity="0.45"/>
        </filter>

        <filter id="physicalShadowBack" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="-15" dy="35" stdDeviation="40" flood-color="#000000" flood-opacity="0.65"/>
          <feDropShadow dx="-4" dy="12" stdDeviation="15" flood-color="#000000" flood-opacity="0.45"/>
        </filter>
      </defs>

      <rect width="2400" height="1500" fill="url(#tableGlow)"/>

      <g transform="translate(1200, 150)" text-anchor="middle">
        <text y="0" fill="#FDFCF0" font-family="'Outfit', 'Plus Jakarta Sans', sans-serif" font-size="52" font-weight="900" letter-spacing="10">
          GIFTISAN OFFICIAL MARKETING CARDS
        </text>
        <text y="50" fill="#F59E0B" font-family="'Outfit', sans-serif" font-size="22" font-weight="700" letter-spacing="6">
          PREMIUM 3.5" × 2.0" BAZAAR ARTISAN OUTREACH • 400 GSM CARDSTOCK SPECIFICATION
        </text>
      </g>

      <!-- LEFT: FRONT CARD (Tilted at 3D angle with stack depth) -->
      <g transform="translate(150, 480) rotate(-4 500 285)">
        <rect x="8" y="16" width="${cardW}" height="${cardH}" rx="24" fill="#021C14" opacity="0.6"/>
        <rect x="4" y="8" width="${cardW}" height="${cardH}" rx="24" fill="#032B20" opacity="0.8"/>
        
        <g filter="url(#physicalShadowFront)">
          <rect x="0" y="0" width="${cardW}" height="${cardH}" rx="24" fill="#064E3B"/>
          <image href="data:image/png;base64,${frontCardResized.toString("base64")}" x="0" y="0" width="${cardW}" height="${cardH}" clip-path="inset(0 round 24px)"/>
          <rect x="0" y="0" width="${cardW}" height="2" fill="#FFFFFF" fill-opacity="0.3"/>
        </g>
      </g>

      <!-- RIGHT: BACK CARD -->
      <g transform="translate(1250, 480) rotate(4 500 285)">
        <rect x="-8" y="16" width="${cardW}" height="${cardH}" rx="24" fill="#E5DFCE" opacity="0.6"/>
        <rect x="-4" y="8" width="${cardW}" height="${cardH}" rx="24" fill="#F0EBDC" opacity="0.8"/>

        <g filter="url(#physicalShadowBack)">
          <rect x="0" y="0" width="${cardW}" height="${cardH}" rx="24" fill="#FDFCF0"/>
          <image href="data:image/png;base64,${backCardResized.toString("base64")}" x="0" y="0" width="${cardW}" height="${cardH}" clip-path="inset(0 round 24px)"/>
          <rect x="0" y="0" width="${cardW}" height="2" fill="#FFFFFF" fill-opacity="0.6"/>
        </g>
      </g>

      <g transform="translate(650, 1180)" text-anchor="middle">
        <text y="0" fill="#FDFCF0" font-family="'Outfit', sans-serif" font-size="28" font-weight="900" letter-spacing="4">
          FRONT — EMERALD VELVET
        </text>
        <text y="32" fill="#9CA3AF" font-family="'Outfit', sans-serif" font-size="18" font-weight="600">
          Gold Stamping • Hook Headline • Scan to Join
        </text>
      </g>

      <g transform="translate(1750, 1180)" text-anchor="middle">
        <text y="0" fill="#FDFCF0" font-family="'Outfit', sans-serif" font-size="28" font-weight="900" letter-spacing="4">
          BACK — ARTISANAL WARM CREAM
        </text>
        <text y="32" fill="#9CA3AF" font-family="'Outfit', sans-serif" font-size="18" font-weight="600">
          The 4 Maker Steps • Open Your Shop CTA • @giftisan_eg
        </text>
      </g>

      <g transform="translate(1200, 1370)" text-anchor="middle">
        <text y="0" fill="#9CA3AF" font-family="'Outfit', sans-serif" font-size="20" font-weight="500" letter-spacing="2">
          Dimensions: 3.5" × 2.0" (88.9 × 50.8 mm)  •  Direct Link: https://giftisan.com on Front &amp; Back QR Codes
        </text>
        <text y="42" fill="#F59E0B" font-family="'Outfit', sans-serif" font-size="22" font-weight="800" letter-spacing="3">
          giftisan.com  •  @giftisan_eg  •  Open Your Shop  •  Join the Maker Circle
        </text>
      </g>
    </svg>
  `;

  await safeWriteFile(path.join(outputDir, "giftisan-cards-duo-showcase.svg"), realisticMockupSvg.trim());
  const duoMockupPath = path.join(outputDir, "giftisan-cards-duo-showcase.png");
  const duoMockupBuf = await sharp(Buffer.from(realisticMockupSvg))
    .png({ quality: 100 })
    .toBuffer();
  await safeWriteFile(duoMockupPath, duoMockupBuf);

  // Arabic 3D Mockup
  const frontCardArResized = await sharp(frontArBufferPng)
    .resize(cardW, cardH, { fit: "cover" })
    .png()
    .toBuffer();

  const backCardArResized = await sharp(backArBufferPng)
    .resize(cardW, cardH, { fit: "cover" })
    .png()
    .toBuffer();

  const realisticMockupArSvg = `
    <svg width="2400" height="1500" viewBox="0 0 2400 1500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="tableGlowAr" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stop-color="#142B23"/>
          <stop offset="50%" stop-color="#0A1813"/>
          <stop offset="100%" stop-color="#040907"/>
        </radialGradient>

        <filter id="physicalShadowFrontAr" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="15" dy="35" stdDeviation="40" flood-color="#000000" flood-opacity="0.65"/>
          <feDropShadow dx="4" dy="12" stdDeviation="15" flood-color="#000000" flood-opacity="0.45"/>
        </filter>

        <filter id="physicalShadowBackAr" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="-15" dy="35" stdDeviation="40" flood-color="#000000" flood-opacity="0.65"/>
          <feDropShadow dx="-4" dy="12" stdDeviation="15" flood-color="#000000" flood-opacity="0.45"/>
        </filter>
      </defs>

      <rect width="2400" height="1500" fill="url(#tableGlowAr)"/>

      <g transform="translate(1200, 150)" text-anchor="middle">
        <text y="0" fill="#FDFCF0" font-family="'Cairo', 'Alexandria', sans-serif" font-size="48" font-weight="900" direction="rtl">
          بطاقات جيفتيزان الرسمية للتسويق — النسخة العربية
        </text>
        <text y="52" fill="#F59E0B" font-family="'Cairo', 'Alexandria', sans-serif" font-size="22" font-weight="700" direction="rtl">
          مواصفات طباعة فاخرة 3.5 × 2.0 بوصة • ورق مقوى 400 جرام • سيلوفان مط ناعم الملمس
        </text>
      </g>

      <!-- LEFT: FRONT ARABIC CARD -->
      <g transform="translate(150, 480) rotate(-4 500 285)">
        <rect x="8" y="16" width="${cardW}" height="${cardH}" rx="24" fill="#021C14" opacity="0.6"/>
        <rect x="4" y="8" width="${cardW}" height="${cardH}" rx="24" fill="#032B20" opacity="0.8"/>
        
        <g filter="url(#physicalShadowFrontAr)">
          <rect x="0" y="0" width="${cardW}" height="${cardH}" rx="24" fill="#064E3B"/>
          <image href="data:image/png;base64,${frontCardArResized.toString("base64")}" x="0" y="0" width="${cardW}" height="${cardH}" clip-path="inset(0 round 24px)"/>
          <rect x="0" y="0" width="${cardW}" height="2" fill="#FFFFFF" fill-opacity="0.3"/>
        </g>
      </g>

      <!-- RIGHT: BACK ARABIC CARD -->
      <g transform="translate(1250, 480) rotate(4 500 285)">
        <rect x="-8" y="16" width="${cardW}" height="${cardH}" rx="24" fill="#E5DFCE" opacity="0.6"/>
        <rect x="-4" y="8" width="${cardW}" height="${cardH}" rx="24" fill="#F0EBDC" opacity="0.8"/>

        <g filter="url(#physicalShadowBackAr)">
          <rect x="0" y="0" width="${cardW}" height="${cardH}" rx="24" fill="#FDFCF0"/>
          <image href="data:image/png;base64,${backCardArResized.toString("base64")}" x="0" y="0" width="${cardW}" height="${cardH}" clip-path="inset(0 round 24px)"/>
          <rect x="0" y="0" width="${cardW}" height="2" fill="#FFFFFF" fill-opacity="0.6"/>
        </g>
      </g>

      <g transform="translate(650, 1180)" text-anchor="middle">
        <text y="0" fill="#FDFCF0" font-family="'Cairo', 'Alexandria', sans-serif" font-size="28" font-weight="900" direction="rtl">
          الوجه — الأخضر الزمردي الفاخر
        </text>
        <text y="32" fill="#9CA3AF" font-family="'Cairo', 'Alexandria', sans-serif" font-size="18" font-weight="600" direction="rtl">
          شغلك اليدوي يستاهل • طباعة فويل ذهبي • كود التسجيل المباشر
        </text>
      </g>

      <g transform="translate(1750, 1180)" text-anchor="middle">
        <text y="0" fill="#FDFCF0" font-family="'Cairo', 'Alexandria', sans-serif" font-size="28" font-weight="900" direction="rtl">
          الظهر — كريمي أثري دافئ
        </text>
        <text y="32" fill="#9CA3AF" font-family="'Cairo', 'Alexandria', sans-serif" font-size="18" font-weight="600" direction="rtl">
          خطوات الصانع الأربعة • افتح متجرك الآن • @giftisan_eg
        </text>
      </g>

      <g transform="translate(1200, 1370)" text-anchor="middle">
        <text y="0" fill="#9CA3AF" font-family="'Cairo', 'Alexandria', sans-serif" font-size="20" font-weight="600" direction="rtl">
          المقاس: 3.5 × 2.0 بوصة (88.9 × 50.8 مم)  •  رابط مباشر: https://giftisan.com على كود QR
        </text>
        <text y="42" fill="#F59E0B" font-family="'Cairo', 'Alexandria', sans-serif" font-size="22" font-weight="800" direction="rtl">
          giftisan.com  •  @giftisan_eg  •  افتح متجرك  •  انضم لمجتمع صناع مصر
        </text>
      </g>
    </svg>
  `;

  await safeWriteFile(path.join(outputDir, "giftisan-cards-duo-showcase-ar.svg"), realisticMockupArSvg.trim());
  const duoMockupArPath = path.join(outputDir, "giftisan-cards-duo-showcase-ar.png");
  const duoMockupArBuf = await sharp(Buffer.from(realisticMockupArSvg))
    .png({ quality: 100 })
    .toBuffer();
  await safeWriteFile(duoMockupArPath, duoMockupArBuf);

  console.log("Saved all English and Arabic print assets and 3D mockups successfully.");
}

run().catch(console.error);
