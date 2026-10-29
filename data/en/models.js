// 學習資源：模型指南（英文版）
// 前後比較工具（[embed ...]）的網址與中文版相同；測試用的歌詞保留日文、中文原文
(window.ARTICLES_EN = window.ARTICLES_EN || {}) && Object.assign(window.ARTICLES_EN, {

'models': {
  t: 'Model guide',
  d: 'Pick a model by what you want to do: what each image, video and music model is good at.',
  body: `
The same prompt can give completely different results with a different model. Use the tables below to find a suitable model, then open each guide for real comparisons.

## Images

| I want… | Suggested models |
| --- | --- |
| Realistic photos, product shots, ad visuals | FLUX.2, Krea 2, FLUX.1 |
| Good Chinese understanding, natural-looking people | Z-Image |
| Posters, logos, text in the image | Ideogram 4, Qwen Image |
| Editing existing images | Fibo 2.0, Qwen Image Edit, FLUX.2 [Klein] |
| Keeping a character or product consistent from reference images | FLUX.3 Image Klein, Qwen Image 2.1 |
| Anime characters, illustration | Anima, Illustrious, NoobAI XL |
| Beastfolk, fantasy creatures, cartoons | Pony Diffusion V6 XL |
| Free tuning with LoRA / ControlNet | Stable Diffusion XL |

See [Image models](#m-image), or read [Choosing a model](#m-choose) first to learn what a model is.

## Video

| I want… | Suggested models |
| --- | --- |
| Consistency using several reference images, videos and audio | MiniMax H3 |
| First & last frames and generated audio, cheaper and higher quality | LTX 2.5 |
| Effect LoRAs (such as Earth zoom or German suplex) | Wan 2.2 |
| A character copying the motion in a video | Wan Animate 2, SCAIL 2 |
| Replacing the subject of a video with my own character | SCAIL 2 |
| Upscaling and repairing blurry video | SeedVR2 |

See [Video models compared](#m-video).

## Music

| I want… | Suggested models |
| --- | --- |
| Fast, cheap songs with precise length | ACE Step 1.5 XL |
| Natural vocals, mature arrangements, good sound | MiniMax Music 3.0 |
| Good sound at a low price, or rearranging from sheet music | YuE2 |
| Background music, solo instruments, sound effects | Stable Audio 3.0 |

See [Music models compared](#m-music).
`},

'm-choose': {
  t: 'Choosing a model',
  d: 'What a model is, why switching models works better than rewriting prompts, and how to see what each model does best.',
  body: `
## Can't get the anime style you want?

The same prompt, "a Japanese anime-style girl standing under a cherry tree", with Juggernaut XL on the left and Animagine XL on the right. The left is clearly more realistic and doesn't look like typical anime.

:::row
[i 556 Juggernaut XL]
|||
[i 557 Animagine XL]
:::

:::tip Try a different model
When no amount of prompt changes gets you what you imagine, the problem often isn't the prompt — the model just isn't good at it. Switching to a model trained for that style often gets you much closer.
:::

## What is a model?

A model is like a professionally trained painter. Different models are trained on different data, just as painters have their own style and strengths from their background and experience. The model largely decides the **style** of the work and **what it can depict well**.

Give several painters the same subject and one paints it realistically, another in anime style, another abstractly. AI is the same: one model varies a little each time, but switching models makes a much bigger difference.

## How to see how models differ

:::steps
@ Open the model list
In Chat, or at the bottom of the Generate and Lab pages, find where to change the model.
:::row
[i 558 Chat]
|||
[i 559 Generate / Lab]
:::

@ Browse models in Chat
Use the navigation bar (1) to filter by type, or choose "All". Hover over a model you're interested in and click the **book icon** in the top-right (2) to see its description and sample work; you can also hover over the model name (3) for a quick introduction.
[i 560]
[i 561]

@ Browse models in Generate or Lab
Open the model picker (1) and choose a type. A model appears below (2); click it to open the selection window. Again, click the **book icon** (3) for details and samples, or hover over the name (4) for an introduction.
[i 562]
[i 563]
:::

Found a suitable model? Start creating! For real comparisons between models, see [Image models](#m-image).
`},

'm-image': {
  t: 'Image models',
  d: 'The features, strengths and best uses of 17 image models, compared using the same prompts.',
  body: `
Results never quite right? Besides the prompt, **choosing the right model** is key. This guide covers the image models on moonland.ai — features, strengths, best uses and real results — all in one place.

The same prompt looks different with different models:

:::row
[i 0]
[i 1]
|||
[i 2]
[i 3]
|||
[i 4]
[i 5]
:::

## How to switch models

:::steps
@ Choose a model category
Click "Generate" or "Lab" on the left, find the model category and choose it.
[i 6]
@ Choose a base model
Click the base model in the bottom-left and choose one.
[i 7]
[i 8]
:::

## Overview

| Model | Best at | Extras |
| --- | --- | --- |
| [Stable Diffusion XL](#h-sdxl) | Realism, character illustration, concept art | LoRA, ControlNet, Embedding, negative prompt |
| [Krea 2](#h-krea) | Photographic, cinematic, artistic styles | LoRA |
| [Z-Image](#h-zimage) | Chinese understanding, people, varied styles | LoRA, ControlNet |
| [Ideogram 4](#h-ideogram) | Text generation, graphic design | – |
| [Fibo 2.0](#h-fibo) | Image editing (no text to image) | – |
| [FLUX.3 Image Klein](#h-flux3) | Generation and editing, multiple reference images | Reference images, LoRA |
| [FLUX.2](#h-flux2) | Product photography, commercial visuals | Reference images, editing, LoRA |
| [FLUX.2 [Klein]](#h-flux2k) | Fast generation and editing, outfit changes | Editing, LoRA |
| [FLUX.1](#h-flux1) | Realistic people, lifestyle photography | LoRA, ControlNet |
| [Qwen Image](#h-qwen) | Text layout, posters, infographics | LoRA, ControlNet |
| [Qwen Image 2.1](#h-qwen21) | Reference-guided generation | Reference images, LoRA |
| [Qwen Image Edit](#h-qwenedit) | Editing images from text instructions | LoRA (reference image required) |
| [Anima](#h-anima) | Anime characters, illustration | LoRA |
| [Illustrious](#h-illustrious) | High-quality anime illustration, clothing detail | LoRA, ControlNet, Embedding |
| [NoobAI XL](#h-noobai) | Anime characters, varied art styles | LoRA, ControlNet, Embedding |
| [Pony Diffusion V6 XL](#h-pony) | Beastfolk, fantasy creatures, cartoons | LoRA, ControlNet, Embedding |
| [Lumina](#h-lumina) | Concept art, visual experiments | LoRA |

## Prompts used for comparison

Every model below was given the same prompts. From left to right: **scene, person, animal**.

:::details Scene
> A traditional Japanese old street at dusk. A narrow cobbled road stretches into the distance, lined on both sides with old wooden machiya townhouses, their eaves hung with warm yellow paper lanterns; at the end of the street stands a red torii gate shrouded in mist. The road is wet from recent rain, and puddles reflect the lanterns and buildings. Damp cherry petals are scattered in the foreground, wooden benches and stone lanterns sit in the middle ground, and layered mountains are faintly visible in the background. A light mist hangs in the air, and the setting sun shines into the street between the buildings, creating cinematic warm-and-cool lighting, with a clear foreground, middle ground and background, high detail and fine textures.
:::

:::details Person
> A Japanese woman of about 20 stands on a station platform in the rain, wearing a long navy trench coat, holding a clear umbrella in one hand and a crumpled train ticket in the other. She looks down slightly at the ticket, her expression tired and disappointed. Wet long black hair clings to her cheeks and the wind lifts the hem of her coat. Behind the platform are a blurred train and neon lights, raindrops are clearly visible on the umbrella, cool cinematic lighting, medium close-up, high detail.
:::

:::details Animal
> An orange tabby cat sits on the edge of a city rooftop late at night, one front paw on an old newspaper lifted by the wind, looking up at the full moon. Its tail hangs naturally beside the roof tiles. In the distance are dense high-rises and flickering neon signs; a few rusty water tanks and antennas are scattered across the roof, and the night wind blows sheets of paper into the air. Moonlight lights the cat's fur from the side, cinematic composition, high detail.
:::

## Stable Diffusion XL {#h-sdxl}

[i 9]

Stable Diffusion XL (SDXL) offers **many base models** and is good at realistic photos, character illustration and concept art, and it can follow fairly complex scene descriptions. Its biggest strength is how much you can extend it: combine LoRA, ControlNet and Embeddings to adjust style, character traits, pose and detail, and use a **negative prompt** to exclude things you don't want.

:::tip Who it's for
People who want lots of freedom and to create varied effects with extensions.
:::

:::row
[i 10]
|||
[i 11]
|||
[i 12]
:::

## Krea 2 {#h-krea}

[i 13]

Krea 2 focuses on **high-quality images and visual impact**. It does well with composition, lighting, materials and detail, and gives layered results from full scene descriptions. It can be combined with LoRAs to adjust the style.

:::tip Who it's for
People who care about image quality and want photographic, cinematic or artistic images.
:::

:::row
[i 14]
|||
[i 15]
|||
[i 16]
:::

## Z-Image {#h-zimage}

[i 17]

Z-Image is a new-generation **all-rounder** that shines at understanding Chinese, depicting people and handling varied styles. It can cope with realistic photos, people, scenes and all kinds of creative requests. Supports LoRA and ControlNet.

:::tip Who it's for
People who want to describe things in Chinese and quickly try different kinds of images.
:::

:::row
[i 18]
|||
[i 19]
|||
[i 20]
:::

## Ideogram 4 {#h-ideogram}

[i 21]

Ideogram 4 is good at **text generation and graphic design**: posters, logos, social posts, ad visuals and all kinds of typography. It renders the text you specify more accurately and pairs it with different layouts, fonts and visual styles.

:::tip Who it's for
Try it first whenever you need text in the image.
:::

:::row
[i 22]
|||
[i 23]
|||
[i 24]
:::

## Fibo 2.0 (image editing) {#h-fibo}

[i 25]

Fibo 2.0 specializes in **image editing**: changing objects, colors, materials or local details, especially simple, clear adjustments. It tries to keep the original composition and style.

It currently **only supports image editing, not text to image**. With "Auto prompt enhancement" on, the system rewrites your instruction in its own VGL (Visual Graph Language) format for more precise edits.

:::tip Who it's for
People who only want to change some elements, colors or details without changing the picture much.
:::

Drag the divider in the middle to compare before and after:

:::row
[embed https://r-ty-m1.github.io/Image_Compare/?view=1&r=3%3A4&a=https%3A%2F%2Fraw.githubusercontent.com%2Fr-ty-m1%2FImage_Compare%2FHEAD%2Fcomparison-images%2Fbefore-1792147606192-fcgm8.jpeg&b=https%3A%2F%2Fraw.githubusercontent.com%2Fr-ty-m1%2FImage_Compare%2F042a66a7f13c0ee6b1dffda4cc909109c81f92ed%2Fcomparison-images%2FFibo20_A01-1792650234739-m1qfk.jpeg&la=Before&lb=After&pta=Prompt%28Before%29&ptb=Prompt%28After%29&pb=%E6%8A%8A%E7%87%88%E7%B1%A0%E6%94%B9%E6%88%90%E5%8D%97%E7%93%9C%E7%87%88%EF%BC%8C%E9%81%A0%E6%99%AF%E7%9A%84%E9%B3%A5%E5%B1%85%E6%94%B9%E6%88%90%E8%90%AC%E8%81%96%E7%AF%80%E9%A2%A8%E6%A0%BC%E7%9A%84%E5%93%A5%E5%BE%B7%E5%BC%8F%E5%A4%A7%E9%96%80%EF%BC%8C%E5%85%A9%E5%81%B4%E7%9A%84%E5%BB%BA%E7%AF%89%E6%94%B9%E6%88%90%E6%AD%90%E6%B4%B2%E4%B8%AD%E5%8F%A4%E6%99%82%E4%BB%A3%E7%9A%84%E5%BB%BA%E7%AF%89%E9%A2%A8%E6%A0%BC&labels=1&showA=0&showB=1&edit=0]
|||
[embed https://r-ty-m1.github.io/Image_Compare/?view=1&r=3%3A4&a=https%3A%2F%2Fraw.githubusercontent.com%2Fr-ty-m1%2FImage_Compare%2FHEAD%2Fcomparison-images%2Fmoonland---hlbtx2-1792147520441-k9zim.jpeg&b=https%3A%2F%2Fraw.githubusercontent.com%2Fr-ty-m1%2FImage_Compare%2F8fa56e3ea47c1a1471b16d027942dca830480ee6%2Fcomparison-images%2FFibo20_A02-1792650892824-zq2jw.jpeg&la=Before&lb=After&pta=Prompt%28Before%29&ptb=Prompt%28After%29&pb=%E6%8A%8A%E5%A5%B3%E6%80%A7%E6%94%B9%E7%82%BA20%E6%AD%B2%E5%B7%A6%E5%8F%B3%E7%9A%84%E6%86%82%E9%AC%B1%E7%9A%84%E7%9F%AD%E9%AB%AE%E7%94%B7%E6%80%A7%EF%BC%8C%E7%A9%BF%E8%91%97%E7%9F%AD%E7%89%88%E6%B7%B1%E8%97%8D%E8%89%B2%E9%A2%A8%E8%A1%A3&labels=1&showA=0&showB=1&edit=0]
|||
[embed https://r-ty-m1.github.io/Image_Compare/?view=1&r=3%3A4&a=https%3A%2F%2Fraw.githubusercontent.com%2Fr-ty-m1%2FImage_Compare%2FHEAD%2Fcomparison-images%2Fmoonland---pyxec4-1792147666640-4rtjv.jpeg&b=https%3A%2F%2Fraw.githubusercontent.com%2Fr-ty-m1%2FImage_Compare%2F50bca6a29b1b03baba10cd7f949aba85cd5baa24%2Fcomparison-images%2FFibo20_A03-1792651050848-lxjc6.jpeg&la=Before&lb=After&pta=Prompt%28Before%29&ptb=Prompt%28After%29&pb=%E6%8A%8A%E8%99%8E%E6%96%91%E8%B2%93%E6%94%B9%E6%88%90%E8%A4%90%E8%89%B2%E7%9A%84%E6%9F%B4%E7%8A%AC&labels=1&showA=0&showB=1&edit=0]
:::

## FLUX.3 Image Klein {#h-flux3}

[i 26]

Does both **generation and editing**, suited to character design, scene creation, product visuals and all kinds of creative images. Besides text, you can guide the result with reference images or edit existing images directly. Supports **multiple reference images** and LoRA, so you can keep a character's look and combine different material.

:::tip Who it's for
People who want to build on existing material, or do many kinds of work with one model.
:::

:::row
[i 27]
|||
[i 28]
|||
[i 29]
:::

## FLUX.2 {#h-flux2}

[i 30]

Good at **product photography, realistic photos and commercial visuals**, with strong material detail, lighting and composition — suited to product shots, ad material and brand visuals. Supports **multiple reference images and image editing**, as well as LoRA.

:::tip Who it's for
People after a realistic look and commercial-quality visuals.
:::

:::row
[i 31]
|||
[i 32]
|||
[i 33]
:::

## FLUX.2 [Klein] (image editing) {#h-flux2k}

[i 34]

Built for **fast generation and editing**: quickly trying ideas, adjusting images or editing existing ones. With LoRAs it can change a person's clothes, transform their look or turn an anime character into a realistic one.

:::tip Who it's for
People who want to generate and edit quickly and try different looks and styles.
:::

:::row
[i 35]
|||
[i 36]
|||
[i 37]
:::

## FLUX.1 {#h-flux1}

[i 38]

A classic model known for its **realistic style and fine detail**, suited to realistic people, lifestyle photography and scenes. People's looks, clothing materials and lighting are all rich in detail. Supports LoRA and ControlNet, so you can guide it with pose, composition and other conditions.

:::tip Who it's for
People who want high-quality portraits and realistic scenes with control over style and composition.
:::

:::row
[i 39]
|||
[i 40]
|||
[i 41]
:::

## Qwen Image {#h-qwen}

[i 42]

Good at **understanding text and generating images**: realistic photos, character illustration, concept art, promotional posters and infographics, and it handles Chinese and English text in images too. Supports LoRA and ControlNet.

:::tip Who it's for
People who need text layout, style adjustments, or control over pose and composition.
:::

:::row
[i 43]
|||
[i 44]
|||
[i 45]
:::

## Qwen Image 2.1 {#h-qwen21}

[i 46]

Focuses on **reference-guided generation and controlling visual features**, suited to character design, product visuals, concept art and combining multiple sources. Give it a reference image to keep a particular person, object or style, rather than relying on text alone. Supports LoRA.

:::tip Who it's for
People who want to guide results with reference images and fine-tune style or character traits with LoRAs.
:::

:::row
[i 47]
|||
[i 48]
|||
[i 49]
:::

## Qwen Image Edit (image editing) {#h-qwenedit}

[i 50]

**Edits existing images from text instructions**: change the background, alter objects, adjust poses, transform the style or change content without starting from scratch each time. A **reference image is required**, and the model tries to keep the parts that don't need to change. Supports LoRA.

:::tip Who it's for
People who want to modify characters, scenes or design assets based on existing images.
:::

### Choosing within the Qwen family

| Model | Main use | Good for |
| --- | --- | --- |
| Qwen Image | Generating images from text | Chinese posters, infographics, typography, concept design |
| Qwen Image 2.1 | Generation and editing combined | Reference-guided generation, cut-out assets, character and product visuals |
| Qwen Image Edit | Editing existing images | Changing backgrounds, altering objects, adjusting poses, fixing text |

:::row
[embed https://r-ty-m1.github.io/Image_Compare/?view=1&r=3%3A4&a=https%3A%2F%2Fraw.githubusercontent.com%2Fr-ty-m1%2FImage_Compare%2Ff759a512c27ba6f48399dee4aac61a820bacd1ed%2Fcomparison-images%2Fmoonland---hlbtx2-1792147520441-k9zim.jpeg&b=https%3A%2F%2Fraw.githubusercontent.com%2Fr-ty-m1%2FImage_Compare%2Fbaaed73efec5991bab8e5981879a79bd9ad05614%2Fcomparison-images%2Fmoonland---jzaaza-1792147522824-sg4y3.jpeg&la=Before&lb=After&pta=Prompt%28Before%29&ptb=Prompt%28After%29&pb=%E6%8A%8A%E5%A5%B3%E6%80%A7%E6%94%B9%E7%82%BA20%E6%AD%B2%E5%B7%A6%E5%8F%B3%E7%9A%84%E6%86%82%E9%AC%B1%E7%9A%84%E7%9F%AD%E9%AB%AE%E7%94%B7%E6%80%A7%EF%BC%8C%E7%A9%BF%E8%91%97%E7%9F%AD%E7%89%88%E6%B7%B1%E8%97%8D%E8%89%B2%E9%A2%A8%E8%A1%A3&labels=1&showA=0&showB=1&edit=0]
|||
[embed https://r-ty-m1.github.io/Image_Compare/?view=1&r=3%3A4&a=https%3A%2F%2Fraw.githubusercontent.com%2Fr-ty-m1%2FImage_Compare%2F43bdd0637f7274acfd300a01c63af5d4e871ce8f%2Fcomparison-images%2Fbefore-1792147606192-fcgm8.jpeg&b=https%3A%2F%2Fraw.githubusercontent.com%2Fr-ty-m1%2FImage_Compare%2F044992eb8f8b4d1563164306153c7aec48f3be42%2Fcomparison-images%2Fafter-1792147608315-05685.jpeg&la=Before&lb=After&pta=Prompt%28Before%29&ptb=Prompt%28After%29&pb=%E6%8A%8A%E7%87%88%E7%B1%A0%E6%94%B9%E6%88%90%E5%8D%97%E7%93%9C%E7%87%88%EF%BC%8C%E9%81%A0%E6%99%AF%E7%9A%84%E9%B3%A5%E5%B1%85%E6%94%B9%E6%88%90%E8%90%AC%E8%81%96%E7%AF%80%E9%A2%A8%E6%A0%BC%E7%9A%84%E5%93%A5%E5%BE%B7%E5%BC%8F%E5%A4%A7%E9%96%80%EF%BC%8C%E5%85%A9%E5%81%B4%E7%9A%84%E5%BB%BA%E7%AF%89%E6%94%B9%E6%88%90%E6%AD%90%E6%B4%B2%E4%B8%AD%E5%8F%A4%E6%99%82%E4%BB%A3%E7%9A%84%E5%BB%BA%E7%AF%89%E9%A2%A8%E6%A0%BC&labels=1&showA=0&showB=1&edit=0]
|||
[embed https://r-ty-m1.github.io/Image_Compare/?view=1&r=3%3A4&a=https%3A%2F%2Fraw.githubusercontent.com%2Fr-ty-m1%2FImage_Compare%2Fbca3b4880ee23d98adac747243791778efb25692%2Fcomparison-images%2Fmoonland---pyxec4-1792147666640-4rtjv.jpeg&b=https%3A%2F%2Fraw.githubusercontent.com%2Fr-ty-m1%2FImage_Compare%2F9a84d3f6a2f0c5a6f140177673c20ec0f5c8c8f9%2Fcomparison-images%2Fmoonland---agj8dr-1792147668576-5okvf.jpeg&la=Before&lb=After&pta=Prompt%28Before%29&ptb=Prompt%28After%29&pb=%E6%8A%8A%E8%99%8E%E6%96%91%E8%B2%93%E6%94%B9%E6%88%90%E8%A4%90%E8%89%B2%E7%9A%84%E6%9F%B4%E7%8A%AC&labels=1&showA=0&showB=1&edit=0]
:::

## Anima {#h-anima}

[i 51]

Focused on **anime style and illustration**: anime characters, character portraits, stylized illustration and character concepts. Supports LoRA for more style variations.

:::tip Who it's for
People who mainly create anime characters or stylized illustrations.
:::

:::row
[i 52]
|||
[i 53]
|||
[i 54]
:::

## Illustrious {#h-illustrious}

[i 55]

Specializes in **high-quality anime illustration**, with strong character looks, clothing detail, expressions and poses — suited to character portraits, character design, costume concepts and scenes with several characters. Supports LoRA, ControlNet and Embeddings, so you can control it with pose, line art and other conditions.

:::tip Who it's for
People who care about anime illustration detail and need to refine looks and composition repeatedly.
:::

:::row
[i 56]
|||
[i 57]
|||
[i 58]
:::

## NoobAI XL {#h-noobai}

[i 59]

Focused on **anime characters and illustration**: character portraits, character interactions, illustrations in different styles, and varied subjects such as beastfolk. Supports LoRA, ControlNet and Embeddings.

:::tip Who it's for
People who love anime-style art and need varied characters and pose control.
:::

:::row
[i 60]
|||
[i 61]
|||
[i 62]
:::

## Pony Diffusion V6 XL {#h-pony}

[i 63]

If your work includes **beastfolk, fantasy creatures** or other stylized characters, this model is worth a try. Suited to cartoon illustration, beastfolk characters, fantasy creature design and character interaction scenes. Supports LoRA, ControlNet and Embeddings.

:::tip Who it's for
People with varied character subjects who prefer a cartoon or stylized look.
:::

:::row
[i 64]
|||
[i 65]
|||
[i 66]
:::

## Lumina {#h-lumina}

[i 67]

Good for exploring **varied visual concepts**: concept art, character design, scenes and stylized illustration, and for step-by-step visual experiments with text. Supports LoRA.

:::tip Who it's for
People who want to explore different visual directions and try concept design.
:::

:::row
[i 68]
|||
[i 69]
|||
[i 70]
:::
`},

'm-video': {
  t: 'Video models compared',
  d: 'Features and usage of MiniMax H3, LTX 2.5, Wan 2.2, Wan Animate 2, SCAIL 2 and SeedVR2 compared.',
  body: `
Want to generate from reference images and videos? Make first-and-last-frame videos? Have a character copy a dance? With so many video models, knowing each one's strengths saves a lot of effort.

Models differ in features, how to write prompts, how many credits they use and what material they accept. For example, MiniMax H3 can be steered by reference images, videos and audio at the same time, and you can quickly reference assets in the prompt with "@" — ideal for work that needs a **consistent** character, scene, motion or voice.

## Overview

| Model | Strength | Accepted material |
| --- | --- | --- |
| [MiniMax H3](#h-minimax) | Multiple references, consistency | Reference images, videos and audio; supports first & last frames |
| [LTX 2.5](#h-ltx) | Cheaper first & last frames, higher quality, can generate audio | Start image, last frame image |
| [Wan 2.2](#h-wan22) | Lots of effect LoRAs | Start image |
| [Wan Animate 2](#h-wananimate) | Makes an image's character perform like a video | Source image, driving video |
| [SCAIL 2](#h-scail) | Copies motion or replaces the subject | Reference image, driving video |
| [SeedVR2](#h-seedvr) | Upscaling and repairing video detail | Video |

## Choosing a model

Open "Generate" or "Lab" and choose "Video":

[i 137]

Pick the model you want in the model selector:

[i 138]

## MiniMax H3 {#h-minimax}

[i 139]

Steer the result with **reference images, reference videos and reference audio**, and reference assets in the prompt with "@", for example "@image1". Assets are numbered 1, 2, 3… from left to right.

When you need lots of generations that keep a particular character, scene, motion or voice consistent, MiniMax H3 is the best choice. It also supports first & last frames: click "Reference" at the far left of the bottom bar to switch to first-and-last-frame mode.

[i 140]

**Example**

:::row
[i 141 Reference image 1]
|||
[i 142 Reference image 2]
|||
[v 143 Reference video 1]
:::

> A human-sized mouse runs on an athletics track, clearing hurdle after hurdle from far away as it gets closer to the camera, and finally crosses the finish line. Character reference @image1, scene reference @image2, hurdling motion reference @video1, handheld camera

[v 144]

## LTX 2.5 {#h-ltx}

[i 145]

Accepts a **start image** and a **last frame image**, and can **generate audio**. For first-and-last-frame videos, LTX 2.5 is **cheaper and higher quality** than MiniMax H3.

:::row
[v 146 LTX 2.5 | 720P | 235 credits]
|||
[v 147 MiniMax H3 | 480P | 250 credits]
:::

**Example**

:::row
[i 148 Start image]
|||
[i 149 Last frame image]
:::

> The mouse raises its hand and says in an energetic male voice: "I'm going to be the Mouse King!"

[v 150]

## Wan 2.2 {#h-wan22}

[i 151]
[i 152]

Supports a **start image**, with a choice of "base model" and "motion control". Its biggest advantage is a **huge range of effect LoRAs**, such as Earth zoom, German suplex, things smashing into faces and character transformations.

[i 153]

**Example**: base model set to "Free", LoRA set to "German suplex".

:::row
[i 154 Start image]
|||
[i 155 Choosing the "German suplex" LoRA]
:::

[i 156]

> The mouse gets a German Suplex from another mouse

[v 157]

## Wan Animate 2 {#h-wananimate}

[i 158]

Built for **motion mimic**: the character in an image performs like the video. You can fill in subject, background and action prompts, or leave them all empty and just add the source image and driving video. For the full guide, see [Motion mimic](#v-mimic).

:::row
[i 159 Source image]
|||
[v 160 Driving video]
:::

**Background prompt**

> A long row of iron gates

**Action prompt**

> The character is pulling on the iron gate and won't let go

[v 161]

:::note
The generated video uses the driving video's audio.
:::

## SCAIL 2 {#h-scail}

[i 162]

Another motion-mimic model, with an extra **Replace subject** mode:

- **Copy motion**: keep the image's character and scene, performing like the video
- **Replace subject**: keep the video's motion and scene, swapping the subject for the character in the image

:::row
[i 163 Source image]
|||
[v 164 Driving video]
:::

:::row
[v 165 Copy motion (uses the image's aspect ratio)]
|||
[v 166 Replace subject (uses the video's aspect ratio)]
:::

:::warn
In this Replace subject example, the character and the person in the video differ too much in species and build, so the proportions come out strange. For a normal example, see [Motion mimic](#v-mimic).
:::

## SeedVR2 {#h-seedvr}

[i 167]

When a video is too small or unclear, SeedVR2 **upscales it naturally and repairs detail**, with 1080P and 1440P options.

:::row
[v 168 Original]
|||
[v 169 Upscaled to 1440P]
:::
`},

'm-music': {
  t: 'Music models compared',
  d: 'Hands-on comparison of ACE Step 1.5 XL, MiniMax Music 3.0, YuE2 and Stable Audio 3.0, plus how to use YuE2’s sheet-music mode.',
  body: `
Once you've learned [music generation](#music), compare the four music models using the same prompts to see what each does best.

## Overview

| Model | Pros | Cons | Prompts |
| --- | --- | --- | --- |
| [ACE Step 1.5 XL](#h-ace) | Fast, cheap, stable, precise length | Average sound, fairly fixed style, vocals sound a little AI | Lyrics, style |
| [MiniMax Music 3.0](#h-minimax-music) | Natural vocals, mature and varied arrangements, good sound | Slow, expensive, often shorter than the set length | Lyrics, style |
| [YuE2](#h-yue) | Natural vocals, varied arrangements, good sound, cheap, can be driven by sheet music | Can't control length | Lyrics, style, sheet music |
| [Stable Audio 3.0](#h-stable-audio) | Great for soundtracks, solo instruments and sound effects; good sound, precise length | No lyrics | Style |

## Choosing a model

Open "Generate" or "Lab" and choose "Music":

[i 82]

Pick the model you want in the model selector:

[i 83]

## Test prompts

ACE Step, MiniMax Music and YuE2 all used the same lyrics and style prompt.

:::details Lyrics (Japanese)
${SNIP.lyricsJa1}
:::

:::details Style
> Japanese wafu style
> sentimental, surging emotion,
> koto, shakuhachi, electric bass and taiko as the main instruments,
> the koto plays a hauntingly beautiful, cold and uneasy melody, using fast plucking, slides, vibrato and tense arpeggios to create an eerie, desolate atmosphere, with intense, dense rapid plucking in the climax;
> the shakuhachi has a deep, ethereal, mournful tone, using long notes, breathy sounds, slides and emotional melodies to create loneliness, eeriness and sorrow, echoing strongly between sections;
> the electric bass is deep and thick, emphasizing low end and a strong groove, forming a heavy, oppressive low foundation together with the taiko;
> the taiko hits heavy, fierce and aggressive, with dense rapid rolls and strong rhythms, greatly raising intensity and impact in the chorus and climax for a surging, frenzied, almost festival-like pressure.
> lead vocal is a cute, clear and powerful female voice, with screams added in the chorus and climax
> minor key,
:::

## ACE Step 1.5 XL {#h-ace}

[i 84]

Mainly for **songs**: **fast, cheap, stable, with precise length control**. On the other hand, the sound is average (but good enough), the style is fairly fixed, and vocals sound a little AI. It has "Lyrics" and "Style" prompts; for details, see [Music generation](#music).

:::row
[i 85]
|||
[a 572 ACE Step 1.5 XL]
:::

## MiniMax Music 3.0 {#h-minimax-music}

[i 86]

Similar to ACE Step, but **puts more weight on natural vocals**, sounds less AI, has more varied and mature styles and arrangements, often surprises you, and **sounds better**. The downsides are that it's slow and expensive, and the actual length is usually shorter than set — though it's less likely to stop midway because the length is too long.

:::row
[i 87]
|||
[a 573 MiniMax Music 3.0]
:::

## YuE2 {#h-yue}

[i 88]

In the default "Generate" mode it also creates songs from prompts. **Natural vocals, varied and mature arrangements, good sound and a low price**, at medium speed; the one drawback is that you **can't control the length**.

:::row
[i 89]
|||
[a 574 YuE2]
:::

### Sheet-music mode

[i 90]

Click "Generate" at the bottom and change the mode to "**Sheet-music driven**". For every song YuE2 generates, it records the melody and chords as **ABC notation**; sheet-music mode uses ABC notation or external audio to drive a new song.

#### Example 1: Rearranging external audio (Canon / wafu remix)

:::steps
@ Add the audio
[i 91]
@ Write the style prompt
Instrumental music doesn't need lyrics, and the style prompt drops the vocals and key.
[i 92]
> Japanese wafu rock battle music
> sentimental, surging emotion,
> koto, shakuhachi, electric bass, electric guitar and taiko as the main instruments,
> the koto plays a hauntingly beautiful, cold and uneasy melody, using fast plucking, slides, vibrato and tense arpeggios to create an eerie, desolate atmosphere, with intense, dense rapid plucking in the climax;
> the shakuhachi has a deep, ethereal, mournful tone, using long notes, breathy sounds, slides and emotional melodies to create loneliness, eeriness and sorrow, echoing strongly between sections;
> the electric bass is deep and thick, emphasizing low end and a strong groove, forming a heavy, oppressive low foundation together with the taiko;
> the taiko hits heavy, fierce and aggressive, with dense rapid rolls and strong rhythms, greatly raising intensity and impact in the chorus and climax for a surging, frenzied, almost festival-like pressure.
> the electric guitar has a heavy, sharp, tense distorted tone, built on strong riffs, power chords, syncopated rhythms and high-tension melodies, contrasting with and answering the koto melody
@ Generate
:::row
[i 93]
|||
[a 575 Result]
:::
:::

#### Example 2: Adapting ABC notation (wafu rock → Mandarin ballad with new Chinese lyrics)

:::steps
@ Copy the ABC notation
Open the song you want to adapt, find "ABC notation" and click the copy icon.
[i 94]
@ Change the audio setting to "Direct input"
[i 95]
@ Paste the ABC notation
An extra field appears in the prompt area; paste the notation you copied.
[i 96]
@ Write the lyrics and style
[i 97]
:::details Lyrics (Chinese, written by AI)
> [Intro]
> [Verse 1]
> 那一天我們約好不再回頭等候
> 眼淚落在無人的街頭直到半夜
> 你說你會記得彼此的那些溫柔 直到白頭的那一天。
> 我只能看著你慢慢走遠
> 卻不願再挽留啊我還留在原地不變
> 「哪裡才是我們最後的終點呢」放聲呼喊吧
> [Pre-Chorus 1]
> 就這樣吧就這樣吧
> 雨落在你的窗前等
> 最難忘的那個夜晚還留在心裡
> 如果當初沒有遇見你的話.......
> [Chorus 1]
> 別走好嗎
> 這首歌唱給你聽吧
> 讓心跳靠近些吧
> 讓你聽見我的聲音啊
> 就算就算
> 讓所有遺憾都散去了
> 反正我們終究會再見吧
> 再見
> 我多想抱緊你直到天亮以前都不放手啊
> 卻只能看著你慢慢離去遠方
> [Verse 2]
> 不去選擇也許也是一種答案吧
> 我們就這樣走過每一天
> 你說究竟誰還欠誰一句話
> 因為害怕所以學會了沉默與等待著你啊
> 就讓時間慢慢原諒我好嗎
> [Bridge]
> 親愛的請別再離開我了啊
> 把最後一點溫柔留給我好嗎啊啊
> 親愛的我還在等待著你啊
> 那一天的約定請你別忘記了啊
> 親愛的若我們都迷路了啊
> 就讓我再一次牽著你手吧
> 親愛的如果你也想念啊
> 就陪我走到故事最後一頁吧
> 「如果就算哭著也要留下來啊」
> 回答啊
> 回答啊
> [Final Chorus]
> 我們還能走多遠呢
> 你說最想守護的究竟是什麼呢啊
> 哈哈哈哈別再哭啦
> 來吧來吧
> 就在這裡和我共舞吧
> 反正我們已經走到這一步了啊
> 看啊
> 晚風輕輕 吹過你窗 你還記得那年約定嗎
> 把所有遺憾都留在昨天吧
> 就算孤單也要好呀
:::
> Mandarin ballad pop rock,
> sentimental, lonely, tender, with strong emotional tension,
> piano, strings, electric guitar, electric bass, drum kit; restrained verses, explosive chorus,
> female vocal, gentle and delicate with a touch of breathiness, turning raw and explosive at the climax,
> minor key
@ Generate
:::

:::row
[i 98]
[a 576 Original]
|||
[i 99]
[a 577 Adapted]
:::

## Stable Audio 3.0 {#h-stable-audio}

[i 100]

Good at **soundtracks, solo instruments and sound effects**, with good sound, efficient generation, varied arrangement styles and precise length. It can't do lyrics; there's only a "Style" prompt.

:::row
[i 101]
|||
**BGM example**
[a 578]
> A comical, eerie, lively BGM, using lots of dissonant chords to create a sense of unease.
:::

:::row
[i 102]
|||
**Sound effect example**
[a 579]
> Metal pipes falling to the ground, clanging; each pipe bounces again and again after hitting the floor, and new pipes keep falling without stopping, huge reverb, distortion, extremely heavy clipping
:::
`},

});
