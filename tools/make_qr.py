# -*- coding: utf-8 -*-
"""
生成作品集二维码（页面内使用 + 可保存/打印的海报版）

用法：修改 URL 后运行  python make_qr.py
依赖：pip install segno pillow
"""
import os
import segno
from PIL import Image, ImageDraw, ImageFont

URL = "https://sxc-258170.github.io/zky-portfolio/"

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

INK = "#14120F"
RED_A = (141, 24, 32)
RED_B = (109, 15, 22)
PAPER = (247, 243, 236)
GOLD = (169, 133, 79)

SERIF = r"C:\Windows\Fonts\STSONG.TTF"
SANS = r"C:\Windows\Fonts\msyh.ttc"
SANS_B = r"C:\Windows\Fonts\msyhbd.ttc"


def font(path, size):
    return ImageFont.truetype(path, size)


def make_page_qr(path, px=480):
    qr = segno.make(URL, error="h")
    qr.save(path, kind="png", scale=px // (qr.symbol_size(scale=1, border=2)[0]), border=2,
            dark=INK, light="#FFFFFF")
    im = Image.open(path).convert("RGB")
    if im.size != (px, px):
        im = im.resize((px, px), Image.LANCZOS)
        im.save(path, "PNG")
    return im


def make_standalone(path, size=1200):
    """高清纯净版二维码，四角留白充足，适合微信长按识别 / 打印"""
    qr = segno.make(URL, error="h")
    tmp = os.path.join(HERE, "_qr_tmp.png")
    qr.save(tmp, kind="png", scale=20, border=4, dark=INK, light="#FFFFFF")
    im = Image.open(tmp).convert("RGB").resize((size, size), Image.LANCZOS)
    os.remove(tmp)
    im.save(path, "PNG")
    return im


def gradient(size, c1, c2):
    w, h = size
    base = Image.new("RGB", (1, h))
    for y in range(h):
        t = y / max(1, h - 1)
        base.putpixel((0, y), tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3)))
    return base.resize((w, h))


def make_poster(path, w=1080, h=1560):
    img = Image.new("RGB", (w, h), PAPER)
    d = ImageDraw.Draw(img)

    # 顶部红色区
    top_h = 560
    img.paste(gradient((w, top_h), RED_A, RED_B), (0, 0))

    # 顶部小字
    d.text((80, 96), "中北大学 · 广播电视学", font=font(SANS, 26), fill=(252, 236, 214))
    # 姓名
    d.text((76, 156), "周珂莹", font=font(SERIF, 112), fill=(255, 250, 242))
    # 标题
    d.text((82, 320), "全 媒 体 宣 传 · 作 品 集", font=font(SERIF, 44), fill=(247, 226, 200))
    # 岗位
    d.line([(82, 412), (140, 412)], fill=(214, 186, 143), width=2)
    d.text((156, 392), "寒假实习应聘　政务宣传 / 融媒体岗位", font=font(SANS, 26), fill=(240, 220, 195))

    # 二维码卡片
    card_x, card_y, card_w, card_h = 110, 470, w - 220, 800
    d.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h],
                        radius=28, fill=(255, 255, 255))
    qr = segno.make(URL, error="h")
    tmp = os.path.join(HERE, "_qr_card.png")
    qr.save(tmp, kind="png", scale=24, border=2, dark=INK, light="#FFFFFF")
    q = Image.open(tmp).convert("RGB")
    os.remove(tmp)
    qs = 600
    q = q.resize((qs, qs), Image.LANCZOS)
    img.paste(q, (w // 2 - qs // 2, card_y + 56))

    # 卡片文字
    ft = font(SANS_B, 38)
    t1 = "扫码查看完整作品集"
    tw = d.textlength(t1, font=ft)
    d.text((w / 2 - tw / 2, card_y + 690), t1, font=ft, fill=(30, 27, 24))
    t2 = "长按可保存，转发给面试官 / 同事"
    ft2 = font(SANS, 24)
    tw2 = d.textlength(t2, font=ft2)
    d.text((w / 2 - tw2 / 2, card_y + 748), t2, font=ft2, fill=(140, 132, 122))

    # 底部信息
    d.line([(110, 1350), (w - 110, 1350)], fill=(222, 212, 198), width=1)
    info = font(SANS, 28)
    d.text((110, 1392), "150 3510 6336", font=info, fill=(60, 54, 47))
    d.text((110, 1444), "zky_1919@qq.com", font=info, fill=(60, 54, 47))
    site = "sxc-258170.github.io/zky-portfolio"
    fs = font(SANS, 22)
    d.text((w - 110 - d.textlength(site, font=fs), 1444), site, font=fs, fill=(150, 142, 132))
    d.text((110, 1512), "周珂莹 · 全媒体宣传作品集 · 2026", font=font(SANS, 22), fill=(160, 152, 142))

    img.save(path, "PNG")
    return img


if __name__ == "__main__":
    page = os.path.join(ROOT, "assets", "img", "qr.png")
    os.makedirs(os.path.dirname(page), exist_ok=True)
    make_page_qr(page, 480)
    print("page qr ->", page)

    out_dir = ROOT
    make_standalone(os.path.join(out_dir, "二维码-高清版.png"), 1200)
    print("standalone qr done")
    make_poster(os.path.join(out_dir, "作品集二维码海报.png"))
    print("poster done")
