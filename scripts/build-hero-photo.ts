import { createCanvas } from "@napi-rs/canvas";
import fs from "fs";
import path from "path";

async function renderPhoto() {
  const width = 1000;
  const height = 1600;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // --- 1. BASE BACKGROUND: TILE FLOOR & INTERIOR ROOM ---
  // Tile floor in doorway
  const tileGrad = ctx.createLinearGradient(0, 1100, 0, 1600);
  tileGrad.addColorStop(0, "#D0C9B6");
  tileGrad.addColorStop(1, "#AFA794");
  ctx.fillStyle = tileGrad;
  ctx.fillRect(0, 1100, 1000, 500);

  // Tile grout lines
  ctx.strokeStyle = "#9E9683";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 1280); ctx.lineTo(1000, 1280);
  ctx.moveTo(0, 1460); ctx.lineTo(1000, 1460);
  ctx.moveTo(380, 1100); ctx.lineTo(380, 1600);
  ctx.moveTo(760, 1100); ctx.lineTo(760, 1600);
  ctx.stroke();

  // Open door threshold - Hardwood floor in house interior (right side)
  const woodGrad = ctx.createLinearGradient(700, 0, 1000, 0);
  woodGrad.addColorStop(0, "#C99862");
  woodGrad.addColorStop(0.5, "#B88650");
  woodGrad.addColorStop(1, "#9E6D3A");
  ctx.fillStyle = woodGrad;
  ctx.fillRect(700, 600, 300, 1000);

  // Hardwood plank lines
  ctx.strokeStyle = "#825528";
  ctx.lineWidth = 2;
  for (let x = 740; x < 1000; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 600);
    ctx.lineTo(x, 1600);
    ctx.stroke();
  }

  // Interior Wall & White Cabinet in background
  ctx.fillStyle = "#EAE6DD";
  ctx.fillRect(720, 200, 280, 480);
  // White cabinet furniture
  ctx.fillStyle = "#FAF8F3";
  ctx.shadowColor = "rgba(0,0,0,0.15)";
  ctx.shadowBlur = 15;
  ctx.fillRect(800, 420, 200, 260);
  ctx.shadowBlur = 0;
  // Cabinet door trim
  ctx.strokeStyle = "#E2DDD0";
  ctx.lineWidth = 3;
  ctx.strokeRect(820, 440, 70, 220);
  ctx.strokeRect(910, 440, 80, 220);


  // --- 2. FRONT DOOR (NAVY BLUE WITH GLASS PANEL) ---
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetX = 10;

  // Navy Blue Door Panel
  const doorGrad = ctx.createLinearGradient(0, 0, 750, 0);
  doorGrad.addColorStop(0, "#131E2A");
  doorGrad.addColorStop(0.4, "#1C2A3A");
  doorGrad.addColorStop(0.8, "#253648");
  doorGrad.addColorStop(1, "#182432");
  ctx.fillStyle = doorGrad;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(760, 0);
  ctx.lineTo(760, 1300);
  ctx.lineTo(0, 1300);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Glass Panel Window in Upper Door
  const glassGrad = ctx.createLinearGradient(180, 0, 580, 800);
  glassGrad.addColorStop(0, "#2D3E50");
  glassGrad.addColorStop(0.3, "#3A4F65");
  glassGrad.addColorStop(0.7, "#2A3A4C");
  glassGrad.addColorStop(1, "#1C2936");

  ctx.fillStyle = glassGrad;
  ctx.fillRect(180, 0, 400, 780);

  // Glass Beveled Frame Moldings
  ctx.strokeStyle = "#121A24";
  ctx.lineWidth = 18;
  ctx.strokeRect(180, 0, 400, 780);

  // Leaded Glass Diamond Pattern
  ctx.strokeStyle = "rgba(140, 160, 180, 0.4)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let y = 100; y < 700; y += 160) {
    ctx.moveTo(380, y - 80);
    ctx.lineTo(460, y);
    ctx.lineTo(380, y + 80);
    ctx.lineTo(300, y);
    ctx.closePath();
  }
  ctx.stroke();

  // Lower Door Raised Wood Panel Molding
  ctx.fillStyle = "#16222F";
  ctx.fillRect(120, 840, 520, 400);
  ctx.strokeStyle = "#0E151E";
  ctx.lineWidth = 14;
  ctx.strokeRect(120, 840, 520, 400);
  ctx.strokeStyle = "#2B3C4F";
  ctx.lineWidth = 3;
  ctx.strokeRect(132, 852, 496, 376);


  // --- 3. SILVER DOOR HANDLE HARDWARE ---
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 12;

  // Deadbolt lock plate
  const silverGrad = ctx.createLinearGradient(700, 500, 740, 540);
  silverGrad.addColorStop(0, "#F0F3F5");
  silverGrad.addColorStop(0.5, "#B5BCB3");
  silverGrad.addColorStop(1, "#727982");

  ctx.fillStyle = silverGrad;
  ctx.beginPath();
  ctx.arc(710, 510, 24, 0, Math.PI * 2);
  ctx.fill();

  // Keyhole slot
  ctx.fillStyle = "#1A1A1A";
  ctx.fillRect(707, 503, 6, 14);

  // Main Handle Rosette Plate
  ctx.fillStyle = silverGrad;
  ctx.beginPath();
  ctx.arc(710, 620, 32, 0, Math.PI * 2);
  ctx.fill();

  // Curved Lever Handle
  ctx.strokeStyle = silverGrad;
  ctx.lineWidth = 18;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(710, 620);
  ctx.bezierCurveTo(740, 640, 750, 700, 725, 770);
  ctx.stroke();

  // Highlight reflection on lever
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(712, 622);
  ctx.bezierCurveTo(738, 640, 746, 698, 723, 765);
  ctx.stroke();
  ctx.restore();


  // --- 4. HANGING ROUND "WELCOME" WOOD SIGN ---
  ctx.save();
  ctx.translate(380, 280);
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 20;

  // Wood Plaque Circle
  const woodSignGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 180);
  woodSignGrad.addColorStop(0, "#EAC293");
  woodSignGrad.addColorStop(0.6, "#D4A168");
  woodSignGrad.addColorStop(1, "#B27D44");

  ctx.fillStyle = woodSignGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 180, 0, Math.PI * 2);
  ctx.fill();

  // Wood Grain Horizontal Slat Lines
  ctx.strokeStyle = "#A3723C";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-170, -60); ctx.lineTo(170, -60);
  ctx.moveTo(-175, 60); ctx.lineTo(175, 60);
  ctx.stroke();

  // Eucalyptus Green Leaves (Top sides)
  const drawLeaf = (x: number, y: number, angle: number, size: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = "#6A8D6A";
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  // Leaves Cluster
  drawLeaf(-80, -140, -0.6, 35);
  drawLeaf(-110, -120, -0.3, 40);
  drawLeaf(-130, -90, 0.1, 35);
  drawLeaf(80, -140, 0.6, 35);
  drawLeaf(110, -120, 0.3, 40);
  drawLeaf(130, -90, -0.1, 35);

  // Striped Burlap Ribbon Bow at top
  // Bow Tails
  ctx.fillStyle = "#EAE0CE";
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(-20, -130); ctx.lineTo(-50, -60); ctx.lineTo(-20, -70); ctx.lineTo(0, -130);
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(20, -130); ctx.lineTo(50, -60); ctx.lineTo(20, -70); ctx.lineTo(0, -130);
  ctx.fill(); ctx.stroke();

  // Bow Loops
  ctx.fillStyle = "#DFD4BD";
  ctx.beginPath();
  ctx.ellipse(-45, -150, 45, 25, -0.3, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(45, -150, 45, 25, 0.3, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // Black stripes on bow
  ctx.strokeStyle = "#1A1A1A";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-75, -158); ctx.lineTo(-15, -142);
  ctx.moveTo(75, -158); ctx.lineTo(15, -142);
  ctx.stroke();

  // Bow Center Knot
  ctx.fillStyle = "#D6C4A5";
  ctx.fillRect(-20, -162, 40, 30);
  ctx.strokeRect(-20, -162, 40, 30);

  // 3D "Welcome" White Script Text
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 4;
  ctx.font = "bold italic 90px 'Playfair Display', Georgia, serif";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Welcome", 0, 25);
  ctx.restore();


  // --- 5. FOREGROUND: STACKED HEAVY DUTY TOTES WITH BRIGHT YELLOW LIDS ---
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
  ctx.shadowBlur = 35;

  // BOTTOM TOTE
  const drawTote = (yOffset: number, isTop = false) => {
    ctx.save();
    ctx.translate(0, yOffset);

    // Black Body
    const bodyGrad = ctx.createLinearGradient(0, 50, 0, 350);
    bodyGrad.addColorStop(0, "#2E2E2E");
    bodyGrad.addColorStop(0.5, "#1F1F1F");
    bodyGrad.addColorStop(1, "#121212");

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(20, 50);
    ctx.lineTo(760, 50);
    ctx.lineTo(700, 320);
    ctx.lineTo(50, 320);
    ctx.closePath();
    ctx.fill();

    // Side Rib Recesses
    ctx.fillStyle = "#161616";
    ctx.beginPath();
    ctx.moveTo(70, 70);
    ctx.lineTo(710, 70);
    ctx.lineTo(670, 280);
    ctx.lineTo(90, 280);
    ctx.closePath();
    ctx.fill();

    // Vertical structural reinforcement ribs
    ctx.strokeStyle = "#2D2D2D";
    ctx.lineWidth = 6;
    for (let x = 200; x <= 580; x += 120) {
      ctx.beginPath();
      ctx.moveTo(x, 70);
      ctx.lineTo(x - 15, 280);
      ctx.stroke();
    }

    // Molded Handle Slot
    ctx.fillStyle = "#0A0A0A";
    ctx.strokeStyle = "#383838";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(320, 90, 180, 45, 10);
    ctx.fill();
    ctx.stroke();

    // BRIGHT YELLOW HEAVY DUTY LID
    const lidGrad = ctx.createLinearGradient(0, -20, 0, 50);
    lidGrad.addColorStop(0, "#FFF266");
    lidGrad.addColorStop(0.3, "#FFD700");
    lidGrad.addColorStop(0.8, "#E6B800");
    lidGrad.addColorStop(1, "#C89A00");

    ctx.fillStyle = lidGrad;
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(790, -20);
    ctx.lineTo(770, 50);
    ctx.lineTo(10, 50);
    ctx.closePath();
    ctx.fill();

    // Top Rim Highlight
    ctx.fillStyle = "#FFF78D";
    ctx.fillRect(0, -20, 790, 12);

    // If Top Tote: Render Diamond Grid Lid Pattern
    if (isTop) {
      ctx.strokeStyle = "rgba(180, 130, 0, 0.7)";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      // Diagonal grid lines left to right
      for (let x = -100; x < 900; x += 80) {
        ctx.moveTo(x, -20);
        ctx.lineTo(x + 140, 50);
      }
      // Diagonal grid lines right to left
      for (let x = -100; x < 900; x += 80) {
        ctx.moveTo(x + 140, -20);
        ctx.lineTo(x, 50);
      }
      ctx.stroke();

      // Padlock / Tie-down holes in lid edge
      ctx.fillStyle = "#1A1A1A";
      ctx.beginPath();
      ctx.arc(40, 15, 8, 0, Math.PI * 2);
      ctx.arc(740, 15, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  // Stack of 3 Totes in Foreground
  drawTote(1280, false);
  drawTote(980, false);
  drawTote(680, true); // TOP TOTE FOCUS
  ctx.restore();


  // --- 6. PHOTOGRAPHIC FINISHING EFFECTS (LIGHTING & VIGNETTE) ---
  // Ambient Soft Sunlight Glow from top left
  const sunGlow = ctx.createRadialGradient(200, 200, 50, 200, 200, 900);
  sunGlow.addColorStop(0, "rgba(255, 245, 225, 0.25)");
  sunGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = sunGlow;
  ctx.fillRect(0, 0, width, height);

  // Camera Vignette
  const vignette = ctx.createRadialGradient(width/2, height/2, width*0.4, width/2, height/2, width*0.85);
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.35)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);


  // --- 7. SAVE TO FILE ---
  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outPath = path.join(publicDir, "hero-front-door.jpg");
  const buffer = canvas.toBuffer("image/jpeg", 95);
  fs.writeFileSync(outPath, buffer);
  console.log("Successfully rendered photo image to:", outPath);
}

renderPhoto().catch(console.error);
