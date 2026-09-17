from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, black
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Register Arial fonts with Cyrillic support
pdfmetrics.registerFont(TTFont('Arial', 'C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('Arial-Bold', 'C:/Windows/Fonts/arialbd.ttf'))

OUTPUT = r"D:\Документы\prompt-master-fix\access.pdf"

BG       = HexColor('#0a0a0a')
GREEN    = HexColor('#00ff88')
WHITE    = HexColor('#ffffff')
GREY     = HexColor('#aaaaaa')
DARKGREY = HexColor('#555555')
BADGE_BG = HexColor('#0d2e1e')
BADGE_BR = HexColor('#1a5c38')
BLOCK_BG = HexColor('#111111')

W, H = A4  # 595 x 842

c = canvas.Canvas(OUTPUT, pagesize=A4)

# ── Background ──
c.setFillColor(BG)
c.rect(0, 0, W, H, fill=1, stroke=0)

# ── Grid dots ──
c.setFillColor(HexColor('#141414'))
for x in range(0, int(W)+1, 40):
    for y in range(0, int(H)+1, 40):
        c.circle(x, y, 1, fill=1, stroke=0)

# ── Glow top-left ──
from reportlab.lib.colors import Color
for r, alpha in [(220, 0.04), (150, 0.06), (80, 0.08)]:
    glow = Color(0, 1, 0.53, alpha=alpha)
    c.setFillColor(glow)
    c.circle(70, H - 50, r, fill=1, stroke=0)

# ── BADGE ──
badge_text = "ТАРИФ МАСТЕР  ·  ARCHITECT SYSTEMS AI"
badge_w = 310
badge_h = 28
badge_x = (W - badge_w) / 2
badge_y = H - 108

c.setFillColor(BADGE_BG)
c.setStrokeColor(BADGE_BR)
c.setLineWidth(1)
c.roundRect(badge_x, badge_y, badge_w, badge_h, 14, fill=1, stroke=1)

c.setFillColor(GREEN)
c.circle(badge_x + 18, badge_y + badge_h / 2, 4, fill=1, stroke=0)

c.setFillColor(GREEN)
c.setFont("Arial-Bold", 9)
c.drawCentredString(W / 2 + 5, badge_y + 9, badge_text)

# ── LOGO ──
logo_y = H - 192
c.setFont("Arial-Bold", 60)
prompt_w = c.stringWidth("PROMPT", "Arial-Bold", 60)
master_w = c.stringWidth("MASTER", "Arial-Bold", 60)
start_x = (W - prompt_w - master_w) / 2

c.setFillColor(WHITE)
c.drawString(start_x, logo_y, "PROMPT")
c.setFillColor(GREEN)
c.drawString(start_x + prompt_w, logo_y, "MASTER")

# ── TAGLINE ──
c.setFillColor(GREY)
c.setFont("Arial-Bold", 14)
c.drawCentredString(W / 2, H - 228, "Система создания промпт-запросов")
c.setFont("Arial", 14)
c.drawCentredString(W / 2, H - 248, "любой сложности на базе Claude AI")

# ── DIVIDER ──
c.setStrokeColor(HexColor('#1e1e1e'))
c.setLineWidth(1)
c.line(60, H - 270, W - 60, H - 270)

# ── ACCESS BLOCK ──
block_x = 55
block_y = H - 495
block_w = W - 110
block_h = 195

c.setFillColor(BLOCK_BG)
c.setStrokeColor(HexColor('#1e3d2a'))
c.setLineWidth(1)
c.roundRect(block_x, block_y, block_w, block_h, 12, fill=1, stroke=1)

# green left bar
c.setFillColor(GREEN)
c.roundRect(block_x, block_y, 4, block_h, 2, fill=1, stroke=0)

# "ТВОЙ ДОСТУП" label
c.setFillColor(GREEN)
c.setFont("Arial-Bold", 11)
c.drawString(block_x + 24, block_y + block_h - 30, "ТВОЙ ДОСТУП")

c.setStrokeColor(HexColor('#1e1e1e'))
c.line(block_x + 24, block_y + block_h - 40, block_x + block_w - 24, block_y + block_h - 40)

# Link section
row1_y = block_y + block_h - 72
c.setFillColor(DARKGREY)
c.setFont("Arial", 9)
c.drawString(block_x + 24, row1_y, "ССЫЛКА")

c.setFillColor(WHITE)
c.setFont("Arial-Bold", 13)
c.drawString(block_x + 24, row1_y - 18, "https://prompt-master-lac.vercel.app/")

c.setStrokeColor(HexColor('#1a1a1a'))
c.line(block_x + 24, row1_y - 30, block_x + block_w - 24, row1_y - 30)

# Password section
row2_y = row1_y - 55
c.setFillColor(DARKGREY)
c.setFont("Arial", 9)
c.drawString(block_x + 24, row2_y, "ПАРОЛЬ ДОСТУПА")

pw_text = "master2024"
pw_w = c.stringWidth(pw_text, "Arial-Bold", 16) + 44
pw_x = block_x + 24
pw_y = row2_y - 32

c.setFillColor(HexColor('#0d2e1e'))
c.setStrokeColor(GREEN)
c.setLineWidth(1.5)
c.roundRect(pw_x, pw_y, pw_w, 30, 8, fill=1, stroke=1)
c.setFillColor(GREEN)
c.setFont("Arial-Bold", 16)
c.drawCentredString(pw_x + pw_w / 2, pw_y + 8, pw_text)

# ── INSTRUCTION ──
instr_y = H - 536
c.setFillColor(HexColor('#666666'))
c.setFont("Arial", 11)
c.drawCentredString(W / 2, instr_y, "Сохрани эти данные. Введи пароль на сайте и начни создавать")
c.drawCentredString(W / 2, instr_y - 17, "профессиональные промпт-запросы с помощью Claude AI.")

# ── MODE CHIPS ──
modes = ["Контент", "Код", "Анализ", "Изображение", "Автоматизация", "Универсальный"]
chip_h = 26
gap = 8
total_w = sum(c.stringWidth(m, "Arial-Bold", 10) + 28 for m in modes) + gap * (len(modes) - 1)
cur_x = (W - total_w) / 2
chip_y = H - 605

for mode in modes:
    mw = c.stringWidth(mode, "Arial-Bold", 10) + 28
    c.setFillColor(GREEN)
    c.roundRect(cur_x, chip_y, mw, chip_h, 13, fill=1, stroke=0)
    c.setFillColor(black)
    c.setFont("Arial-Bold", 10)
    c.drawCentredString(cur_x + mw / 2, chip_y + 8, mode)
    cur_x += mw + gap

# ── BOTTOM LINE ──
c.setStrokeColor(HexColor('#1e1e1e'))
c.setLineWidth(1)
c.line(60, 58, W - 60, 58)

c.setFillColor(HexColor('#444444'))
c.setFont("Arial", 9)
c.drawCentredString(W / 2, 42, "© Architect Systems AI  ·  PROMPT MASTER")

c.save()
print(f"PDF saved: {OUTPUT}")
