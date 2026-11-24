# 周珂莹 · 全媒体宣传作品集 H5

在线访问：<https://sxc-258170.github.io/zky-portfolio/>

一个面向「政务宣传 / 融媒体」寒假实习岗位的移动端 H5 作品集，全部为纯静态页面（无需构建、无外部依赖、可离线打开）。

## 内容结构

| 页面 | 内容 |
| --- | --- |
| 封面 | 姓名、岗位意向、技能关键词、联系方式 |
| 02 | 个人概况、数据亮点、技能标签 |
| 03 | 作品目录（点击跳转） |
| 04 | 青龙寺文化宣传 AIGC 系列（省级三等奖 ×2） |
| 05 | 生态 AI 纪录片《无声的鲸鸣》 |
| 06 | 融合新闻 · 双柳长江大桥生态答卷 |
| 07 | 实拍民生新闻 · 汾河治理 |
| 08 | 纪实 Vlog · 大学生日常 |
| 09 | 在校实践与公众号排版作品 |
| 10 | 荣誉证书、简历下载 |
| 11 | 封底：联系方式 + 作品集二维码 |

## 目录

```
index.html            页面结构
assets/style.css      样式
assets/app.js         交互（滚动进度、目录弹层、视频、图片放大）
assets/img/           照片、证书、页面二维码 qr.png
assets/posters/       视频封面与截图
assets/video/         压缩后的作品视频（720p）
assets/fonts/         思源宋体子集（约 95KB）
tools/make_qr.py      重新生成二维码 / 二维码海报
```

## 本地预览

```bash
python -m http.server 8899
```

然后打开 <http://127.0.0.1:8899/>。

## 修改后重新发布

```bash
git add -A
git commit -m "update"
git push
```

GitHub Pages 会在 1 分钟内自动更新。

## 二维码

页面中的二维码指向本站地址。若更换域名或仓库名，修改 `tools/make_qr.py` 顶部的 `URL` 后运行：

```bash
pip install segno pillow
python tools/make_qr.py
```

会重新生成 `assets/img/qr.png`、`二维码-高清版.png`、`作品集二维码海报.png`。
