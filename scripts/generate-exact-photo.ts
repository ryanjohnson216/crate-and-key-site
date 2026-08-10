import { createCanvas, ImageData } from "@napi-rs/canvas";
import fs from "fs";
import path from "path";

async function createPhotorealisticHeroImage() {
  const width = 1080;
  const height = 1920;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Enable high quality smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // --- 1. BACKGROUND / ENTRYWAY ENVIRONMENT ---
  // Tile floor in foreground threshold
  const tileGrad = ctx.createLinearGradient(0, 1400, 0, 1920);
  tileGrad.addColorStop(0, "#D5CFC0");
  tileGrad.addColorStop(0.5, "#C4BCAB");
  tileGrad.addColorStop(1, "#ABA290");
  ctx.fillStyle = tileGrad;
  ctx.fillRect(0, 1400, width, 520);

  // Subtle tile grout grid
  ctx.strokeStyle = "rgba(140, 130, 115, 0.5)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 1560); ctx.lineTo(width, 1560);
  ctx.moveTo(0, 1740); ctx.lineTo(width, 1740);
  ctx.moveTo(420, 1400); ctx.lineTo(420, 1920);
  ctx.moveTo(850, 1400); ctx.lineTo(850, 1920);
  ctx.stroke();

  // Open Doorway View into House (Right Side)
  // Hardwood floor inside house
  const floorGrad = ctx.createLinearGradient(750, 800, 1080, 800);
  floorGrad.addColorStop(0, "#D2A26D");
  floorGrad.addColorStop(0.3, "#C3925C");
  floorGrad.addColorStop(0.7, "#B2804A");
  floorGrad.addColorStop(1, "#996733");
  ctx.fillStyle = floorGrad;
  ctx.fillRect(750, 800, 330, 1120);

  // Hardwood floor plank lines
  ctx.strokeStyle = "rgba(120, 80, 35, 0.4)";
  ctx.lineWidth = 2.5;
  for (let x = 790; x <= 1080; x += 45) {
    ctx.beginPath();
    ctx.moveTo(x, 800);
    ctx.lineTo(x, 1920);
    ctx.stroke();
  }

  // Interior Wall (Soft greige wallpaper/paint with pattern)
  ctx.fillStyle = "#E4DFC2";
  ctx.fillRect(780, 0, 300, 820);

  // Subtle lattice pattern on wallpaper
  ctx.strokeStyle = "rgba(200, 190, 170, 0.35)";
  ctx.lineWidth = 2;
  for (let y = -100; y < 820; y += 80) {
    ctx.beginPath();
    ctx.moveTo(780, y); ctx.lineTo(1080, y + 150);
    ctx.moveTo(1080, y); ctx.lineTo(780, y + 150);
    ctx.stroke();
  }

  // White decorative cabinet / console table in interior background
  ctx.fillStyle = "#FAF8F5";
  ctx.shadowColor = "rgba(0,0,0,0.12)";
  ctx.shadowBlur = 20;
  ctx.fillRect(860, 520, 220, 310);
  ctx.shadowBlur = 0;

  // Cabinet door frame trim
  ctx.strokeStyle = "#E5DFD3";
  ctx.lineWidth = 4;
  ctx.strokeRect(880, 545, 80, 260);
  ctx.strokeRect(975, 545, 95, 260);

  // Small decor plant on console table
  ctx.fillStyle = "#2D4230";
  ctx.beginPath();
  ctx.ellipse(920, 480, 20, 30, -0.2, 0, Math.PI * 2);
  ctx.ellipse(940, 475, 25, 35, 0.3, 0, Math.PI * 2);
  ctx.fill();


  // --- 2. FRONT DOOR (DARK NAVY BLUE WITH GLASS PANEL) ---
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetX = 15;

  // Navy Blue Door
  const doorGrad = ctx.createLinearGradient(0, 0, 820, 0);
  doorGrad.addColorStop(0, "#121A24");
  doorGrad.addColorStop(0.3, "#1A2635");
  doorGrad.addColorStop(0.7, "#223143");
  doorGrad.addColorStop(1, "#16202D");
  ctx.fillStyle = doorGrad;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(820, 0);
  ctx.lineTo(820, 1500);
  ctx.lineTo(0, 1500);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Glass Window Panel Insert
  const glassGrad = ctx.createLinearGradient(190, 0, 620, 950);
  glassGrad.addColorStop(0, "#233344");
  glassGrad.addColorStop(0.3, "#34485D");
  glassGrad.addColorStop(0.6, "#28394C");
  glassGrad.addColorStop(1, "#182432");
  ctx.fillStyle = glassGrad;
  ctx.fillRect(190, 0, 430, 950);

  // Outer Wood Molding around Glass Window
  ctx.strokeStyle = "#0E151F";
  ctx.lineWidth = 22;
  ctx.strokeRect(190, 0, 430, 950);

  // Glass Reflections & Beveled Metal Caming Lines
  ctx.strokeStyle = "rgba(160, 185, 210, 0.35)";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  for (let y = 120; y < 850; y += 180) {
    ctx.moveTo(405, y - 90);
    ctx.lineTo(495, y);
    ctx.lineTo(405, y + 90);
    ctx.lineTo(315, y);
    ctx.closePath();
  }
  ctx.stroke();

  // Soft window glass specular highlight reflection
  const glassReflect = ctx.createLinearGradient(200, 100, 500, 700);
  glassReflect.addColorStop(0, "rgba(255, 255, 255, 0.18)");
  glassReflect.addColorStop(0.4, "rgba(255, 255, 255, 0.05)");
  glassReflect.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = glassReflect;
  ctx.beginPath();
  ctx.moveTo(210, 100); ctx.lineTo(580, 100); ctx.lineTo(380, 850); ctx.lineTo(210, 850);
  ctx.closePath();
  ctx.fill();


  // --- 3. DOOR HARDWARE (SILVER METALLIC LEVER & LOCK) ---
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = 18;

  // Deadbolt Round Collar
  const lockGrad = ctx.createLinearGradient(740, 580, 800, 640);
  lockGrad.addColorStop(0, "#F5F7F8");
  lockGrad.addColorStop(0.4, "#B8BEC4");
  lockGrad.addColorStop(0.8, "#7B838C");
  lockGrad.addColorStop(1, "#4E555E");

  ctx.fillStyle = lockGrad;
  ctx.beginPath();
  ctx.arc(770, 610, 30, 0, Math.PI * 2);
  ctx.fill();

  // Keyhole
  ctx.fillStyle = "#111820";
  ctx.fillRect(766, 600, 8, 18);

  // Door Lever Base Plate (Rosette)
  ctx.fillStyle = lockGrad;
  ctx.beginPath();
  ctx.arc(770, 760, 40, 0, Math.PI * 2);
  ctx.fill();

  // Curved Ergonomic Lever Handle
  ctx.strokeStyle = lockGrad;
  ctx.lineWidth = 24;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(770, 760);
  ctx.bezierCurveTo(810, 785, 825, 860, 795, 960);
  ctx.stroke();

  // Metallic Specular Highlights
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(772, 762);
  ctx.bezierCurveTo(808, 785, 821, 858, 792, 955);
  ctx.stroke();
  ctx.restore();


  // --- 4. HANGING ROUND "WELCOME" WOOD SIGN ---
  ctx.save();
  ctx.translate(410, 340);
  ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 10;

  // Round Wooden Plaque
  const signGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, 220);
  signGrad.addColorStop(0, "#EDC79B");
  signGrad.addColorStop(0.5, "#D8A36C");
  signGrad.addColorStop(0.9, "#B78049");
  signGrad.addColorStop(1, "#94612F");

  ctx.fillStyle = signGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 220, 0, Math.PI * 2);
  ctx.fill();

  // Wood Grain Slats & Ring Lines
  ctx.strokeStyle = "rgba(140, 90, 40, 0.4)";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-210, -75); ctx.lineTo(210, -75);
  ctx.moveTo(-215, 75); ctx.lineTo(215, 75);
  ctx.stroke();

  // Natural Wood Grain Ring Textures
  ctx.strokeStyle = "rgba(160, 105, 45, 0.25)";
  ctx.lineWidth = 2;
  for (let r = 50; r <= 200; r += 35) {
    ctx.beginPath();
    ctx.arc(10, 10, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Eucalyptus Green Leaves Clusters (Left & Right top of sign)
  const drawLeaf = (x: number, y: number, angle: number, rx: number, ry: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    const leafGrad = ctx.createLinearGradient(-rx, 0, rx, 0);
    leafGrad.addColorStop(0, "#7A9E7A");
    leafGrad.addColorStop(0.5, "#5B7F5B");
    leafGrad.addColorStop(1, "#416041");
    ctx.fillStyle = leafGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    // Leaf vein
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-rx + 5, 0); ctx.lineTo(rx - 5, 0); ctx.stroke();
    ctx.restore();
  };

  // Left leaves
  drawLeaf(-100, -170, -0.7, 45, 18);
  drawLeaf(-135, -145, -0.4, 50, 20);
  drawLeaf(-160, -110, 0.1, 45, 18);
  drawLeaf(-175, -70, 0.4, 40, 16);

  // Right leaves
  drawLeaf(100, -170, 0.7, 45, 18);
  drawLeaf(135, -145, 0.4, 50, 20);
  drawLeaf(160, -110, -0.1, 45, 18);
  drawLeaf(175, -70, -0.4, 40, 16);

  // FABRIC BURLAP & STRIPED RIBBON BOW AT TOP
  // Hanging Rope at very top
  ctx.strokeStyle = "#C2A378";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(0, -220); ctx.lineTo(0, -270);
  ctx.stroke();

  // Ribbon Tails
  ctx.fillStyle = "#E8DFD1";
  ctx.strokeStyle = "#333333";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(-25, -160); ctx.lineTo(-65, -70); ctx.lineTo(-25, -85); ctx.lineTo(0, -160);
  ctx.fill(); ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(25, -160); ctx.lineTo(65, -70); ctx.lineTo(25, -85); ctx.lineTo(0, -160);
  ctx.fill(); ctx.stroke();

  // Ribbon Loops
  ctx.fillStyle = "#DFD5C4";
  ctx.beginPath();
  ctx.ellipse(-55, -185, 55, 30, -0.3, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(55, -185, 55, 30, 0.3, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // Black stripes on bow loops
  ctx.strokeStyle = "#1A1A1A";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-95, -195); ctx.lineTo(-20, -175);
  ctx.moveTo(95, -195); ctx.lineTo(20, -175);
  ctx.stroke();

  // Center Bow Knot
  ctx.fillStyle = "#CFC0A9";
  ctx.fillRect(-25, -200, 50, 36);
  ctx.strokeRect(-25, -200, 50, 36);

  // 3D WHITE WOOD "Welcome" SCRIPT TEXT
  ctx.shadowColor = "rgba(0,0,0,0.65)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 6;
  ctx.font = "bold italic 110px 'Playfair Display', Georgia, serif";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Welcome", 0, 30);
  ctx.restore();


  // --- 5. FOREGROUND: STACKED HEAVY DUTY TOTES WITH BRIGHT YELLOW LIDS ---
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
  ctx.shadowBlur = 45;

  const drawTote = (yPos: number, scale: number, isTopTote: boolean) => {
    ctx.save();
    ctx.translate(0, yPos);
    ctx.scale(scale, scale);

    // Black Tote Container Body
    const toteBodyGrad = ctx.createLinearGradient(0, 80, 0, 480);
    toteBodyGrad.addColorStop(0, "#333333");
    toteBodyGrad.addColorStop(0.4, "#222222");
    toteBodyGrad.addColorStop(0.8, "#161616");
    toteBodyGrad.addColorStop(1, "#0A0A0A");

    ctx.fillStyle = toteBodyGrad;
    ctx.beginPath();
    ctx.moveTo(10, 80);
    ctx.lineTo(840, 80);
    ctx.lineTo(770, 480);
    ctx.lineTo(60, 480);
    ctx.closePath();
    ctx.fill();

    // Recessed Front/Side Panels & Ribs
    ctx.fillStyle = "#181818";
    ctx.beginPath();
    ctx.moveTo(70, 110);
    ctx.lineTo(780, 110);
    ctx.lineTo(730, 440);
    ctx.lineTo(100, 440);
    ctx.closePath();
    ctx.fill();

    // Vertical Strength Ribs
    ctx.strokeStyle = "#2B2B2B";
    ctx.lineWidth = 8;
    for (let x = 220; x <= 640; x += 140) {
      ctx.beginPath();
      ctx.moveTo(x, 110);
      ctx.lineTo(x - 20, 440);
      ctx.stroke();
    }

    // Molded Carrying Handle Recess
    ctx.fillStyle = "#0D0D0D";
    ctx.strokeStyle = "#404040";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(330, 140, 210, 55, 12);
    ctx.fill();
    ctx.stroke();

    // BRIGHT YELLOW SNAP-ON LID
    const lidGrad = ctx.createLinearGradient(0, -30, 0, 80);
    lidGrad.addColorStop(0, "#FFF366");
    lidGrad.addColorStop(0.2, "#FFD700");
    lidGrad.addColorStop(0.6, "#E6B800");
    lidGrad.addColorStop(0.9, "#C89A00");
    lidGrad.addColorStop(1, "#A27B00");

    ctx.fillStyle = lidGrad;
    ctx.beginPath();
    ctx.moveTo(-10, -30);
    ctx.lineTo(870, -30);
    ctx.lineTo(850, 80);
    ctx.lineTo(0, 80);
    ctx.closePath();
    ctx.fill();

    // Top Rim Specular Highlight
    ctx.fillStyle = "rgba(255, 255, 220, 0.8)";
    ctx.fillRect(-10, -30, 880, 16);

    // Structural Snap Latch Overhangs
    ctx.fillStyle = "#B38600";
    ctx.fillRect(20, 40, 120, 35);
    ctx.fillRect(720, 40, 120, 35);

    // If Top Tote: Render Prominent Diamond Grid Pattern on Lid Top
    if (isTopTote) {
      ctx.strokeStyle = "rgba(160, 115, 0, 0.75)";
      ctx.lineWidth = 4.5;
      ctx.beginPath();

      // Grid lines angled 1
      for (let x = -150; x < 1000; x += 90) {
        ctx.moveTo(x, -30);
        ctx.lineTo(x + 180, 80);
      }
      // Grid lines angled 2
      for (let x = -150; x < 1000; x += 90) {
        ctx.moveTo(x + 180, -30);
        ctx.lineTo(x, 80);
      }
      ctx.stroke();

      // Lock holes in corner lid rims
      ctx.fillStyle = "#111111";
      ctx.beginPath();
      ctx.arc(45, 25, 10, 0, Math.PI * 2);
      ctx.arc(815, 25, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  // Stack 3 Totes (Bottom, Middle, Top)
  drawTote(1450, 1.05, false);
  drawTote(1120, 1.0, false);
  drawTote(740, 0.95, true); // TOP TOTE WITH DIAMOND LID PATTERN
  ctx.restore();


  // --- 6. REALISTIC CAMERA / LENS LIGHTING & GRAIN FINISH ---
  // Sunlight flare from top-left window
  const sunFlare = ctx.createRadialGradient(250, 250, 10, 250, 250, 1100);
  sunFlare.addColorStop(0, "rgba(255, 252, 240, 0.22)");
  sunFlare.addColorStop(0.5, "rgba(255, 245, 220, 0.08)");
  sunFlare.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = sunFlare;
  ctx.fillRect(0, 0, width, height);

  // Soft photographic vignette
  const vignette = ctx.createRadialGradient(width / 2, height / 2, width * 0.35, width / 2, height / 2, height * 0.75);
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.38)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  // Add micro photographic noise/grain for authentic camera texture
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 8; // subtle +/- 4 pixel noise
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);


  // --- 7. WRITE TO PUBLIC & DIST DIRECTORIES ---
  const publicDir = path.join(process.cwd(), "public");
  const distDir = path.join(process.cwd(), "dist");

  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

  const buffer = canvas.toBuffer("image/jpeg", 95);

  fs.writeFileSync(path.join(publicDir, "hero-front-door.jpg"), buffer);
  fs.writeFileSync(path.join(distDir, "hero-front-door.jpg"), buffer);

  console.log("Photorealistic hero photo generated successfully!");
}

createPhotorealisticHeroImage().catch(console.error);
