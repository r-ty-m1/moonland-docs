// 英文翻譯：學習資源（AI 翻譯，2026-11-23，對照正式網站當天的中文）
// 伺服器啟動時，還沒有英文版的頁面會匯入成「英文草稿」（server/editor.js 的 importEnSeed），要有人看過、取消草稿才公開
// 匯入之後以編輯後台為準，改這個檔案不會影響已經匯入的頁面；這個檔案不對外提供
// src 是翻譯時中文的簽章（model.js 的 zhSig）：中文之後改過，後台會標「英文待更新」
// 名稱照 moonland.ai 本站英文版（data/en/terms.json）：點數 Points、登月幣 Coins、交談 Chat、實驗室 Lab、社群藝廊 Gallery
(window.EN_SEED = window.EN_SEED || { pages: {}, sections: {}, groups: {} });
Object.assign(EN_SEED.pages, {

"recipes": {
  src: "e350269d", t: "Tutorials",
  d: "Step-by-step tutorials: start from a concrete result and walk through the whole process.",
},

"chat-recipes": {
  src: "1d4e43f2", t: "Chat image cookbook",
  d: "Starting from one image: text designs, outfit swaps, pose templates, scene swaps, stylization and prompt tips.",
  body: `
Chat lets you create and edit images and videos in plain language, and it can do a lot. This guide starts from your first image and walks through changing outfits, adjusting poses, swapping scenes and stylizing.

[i 320]

:::note
Chat focuses on creative generation; it can't handle documents or data work.
:::

## Creating images {#h-create}

Click "Chat" on the left of the screen to open the conversation view:

[i 321]

Describe the picture in your head:

:::row
[i 322]
> Concept art of a fantasy-style medieval game scene
|||
[i 323]
> A giant loaf of bread in the square in front of the Eiffel Tower
:::

:::row
[i 324]
> An old artisan at work in a café
|||
[i 325]
> An old black-and-white photo of a woman
:::

Once you're comfortable, add more detail:

> An orange-and-white kitten in a red hat strolls along a crowded European street, medieval oil painting style, 16:9.

### Text designs

:::row
[i 326]
|||
[i 327]
:::

To generate images with text or lettering art, put the text in quotation marks:

> A pop-art Chinese lettering design of "登月智慧", and a street-graffiti Chinese lettering design of "登月智慧"

> A pixel-game English lettering design of "Moonland", and a gothic English lettering design of "Moonland"

[i 328]

:::note
Only Chinese and English are supported for now.
:::

## Changing outfits {#h-outfit}

Once an image is generated, you can give the character different actions, poses, clothes and accessories.

[i 329]

:::steps
@ Add the images
Click "+" in the message box and choose from the asset library (everything you've generated on the platform) or upload from your computer.
[i 330]

@ Add the person and clothing, then give the instruction
Add both the person and the clothing to the chat and refer to them as "image 1" and "image 2" (left to right, in the order added), for example "Dress the person in image 1 in the top from image 2". Repeat until everything is changed.
[i 331]
:::

:::tip Be clear about what to change
For example: change the "red" clothes to "yellow" clothes, or change the "blazer" to a "brown trench coat". **Change one item at a time**; more than 3 images can produce odd results.
:::

[i 332]
[i 333]
[i 334]

For detailed tips, see [Changing outfits](#outfit).

## Adjusting poses {#h-pose}

No more stiff poses — get your character into all kinds of positions with ease.

[i 336]

:::steps
@ Open the pose templates
Click "+" in the bottom-left of the message box and choose "Image".
[i 337]
Find "Pose templates" in the list at the top and choose the pose you want.
[i 338]
[i 339]

@ Add the person and give the instruction
Refer to them as "image 1" and "image 2", for example "Make the person in image 1 do the pose in image 2".
[i 340]
:::

:::tip Keep the character and skeleton similar
For example, putting Godzilla in a ballet dancer's pose is hard to reproduce because its limbs are too short.
:::

## Swapping scenes {#h-scene}

Once the outfit and pose are done, put the character into a whole new scene.

Add the person and the background image and refer to them as "image 1" and "image 2", for example "Place the person from image 1 into the scene in image 2". If you need a different image size, say so in the prompt.

[i 341]

:::row
[i 342]
|||
[i 343]
:::

:::row
[i 344]
|||
[i 345]
:::

## Stylizing {#h-style}

Once the character is set, you can also change the style.

[i 346]

Add a style reference image to apply it quickly:

[i 347]

:::row
[i 348]
[i 349]
|||
[i 350]
[i 351]
:::

## Prompt tips {#h-tips}

### Write descriptions

For general generation, write descriptively, for example "a cheerful child playing", "lightning flashing across a sky full of dark clouds" or "a relaxed corgi sleeping".

### Precise beats long

Think of the prompt as a **shopping list**: list what you want so the AI has less to guess.

| Strength | Prompt |
| --- | --- |
| Weak | Modern digital watch design |
| Medium | Pure white tones, trendy design, mechanical watch, watch product ad, floating in a pure white space |
| Strong | Premium pure-white lighting, lively layout, exquisite mechanical dial, high-tech photo studio, floating white particles and tech light effects |

:::row
[i 352 Weak]
|||
[i 353 Medium]
|||
[i 354 Strong]
:::

### Say it another way

Sometimes the AI can draw something but doesn't "understand" the request. Describe what you want indirectly, generate something similar, then edit it.

:::row
[i 355 Original reference: tralalelo tarara]
|||
[i 356 Result from typing the name directly]
|||
[i 357 Using a description instead: a shark standing on the shore on its fins, both fins wearing blue Nike sneakers]
:::
`,
},

"pvc": {
  src: "3fc9b494", t: "PVC figure style",
  d: "Turn personal photos, anime characters or historical figures into PVC figure product shots, with Chinese and English prompts.",
  body: `
Want your favorite character as a real collectible figure? Personal photos, couple photos, anime characters and historical figures can all be converted easily.

**Anime style → PVC**

:::row
[i 564]
|||
[i 565]
:::

**Personal photo → PVC**

:::row
[i 566]
|||
[i 567]
:::

Open Chat and enter a suitable prompt to generate it:

[i 568]

:::steps
@ Choose a reference image
In Chat, click "Add image" and upload or pick the image to convert from the asset library.
[i 569]
You can also keep chatting about the image from the previous step and skip to the next step.

@ Enter a prompt
How precise and detailed the prompt is makes a big difference.
[i 570]
**Basic**: simple and easy, but not very precise.
> Turn the character in the image into a PVC figure
[i 571]
**Advanced**: the more detail, the better the result usually is. You can swap the scale, base, background and other settings. English prompts are usually slightly more precise than Chinese.
> 生成一張逼真的產品照，主體是一個 1/7 比例的 PVC 公仔，其姿勢與表情需與用戶提供的照片角色完全相同。公仔放置於黑色圓形底座上，背景為整潔的電腦桌，並有一個印有角色插畫的包裝盒。照片需清楚展現 PVC 光澤與專業攝影棚質感。

> Generate a realistic product photo: the subject is a 1/7 scale PVC figure, with pose and facial expression exactly the same as the character in the provided photo. The figure is placed on a black circular base, set on a neat computer desk, with a character-illustrated package box in the background. The photo should clearly show the gloss and texture of PVC and create a professional studio photography atmosphere.

@ Generate
Choose a model (or use the default) and click Generate.
:::

## FAQ

:::faq
?? The figure looks different from the original image.
Add "Use the provided image as the model, with the pose and expression exactly matching the character in the photo" to the prompt and generate again.

?? Can I turn it into a 3D model?
Yes. Generate an image with a clean background first, then upload it to [Model generation](#model-3d) under "Other tools".
:::
`,
},

"logo": {
  src: "c7c9bb7d", t: "Logo design",
  d: "No design background needed: define your brand's colors and style in a conversation and generate your own logo.",
  body: `
You don't need any design background. Just talk it through with the AI to settle on your brand's colors and style, and generate a logo of your own.

:::row
[i 515]
**Theme**: Baseball team crest
**Elements**: Blue and red lines weave into a wolf's outline, with a yellow lightning bolt at the corner of the eye
**Style**: 2D vector lines, minimalist
**Use**: Sports brand identity
|||
[i 516]
**Theme**: Dynamic coffee cup
**Elements**: Flowing lines trace the cup, with silky curls of aroma rising from the rim
**Style**: Modern vector illustration
**Use**: Café identity, takeaway cup design
|||
[i 517]
**Theme**: W Art hair scissors company
**Elements**: A pair of hairdressing scissors decorated with teal feathers, light and lively
**Style**: Digital art, hyperrealistic
**Use**: Flagship salon logo, brand image
:::

Open "Chat", enter your prompt, and your logo takes shape right away:

[i 518]

:::steps
@ Describe your idea
Write your logo idea in the chat box; the better the description, the better the result. If you're not sure what to say, use the template below and replace the parts in quotes:
[i 519]
> Create a professional logo design for "theme, brand name". The main visual element of the logo is "description of the main symbol, colors, elements".
> The design style is "style", and overall it should be "extra notes", suitable for a professional brand.
Styles you could try: minimalist, flat, modern geometric, hand-drawn illustration, luxury, retro, art deco, futuristic, abstract, dynamic.

@ Explore more versions
To try more variations, just say "**generate 4 more versions**" in Chat, or describe the change you want, such as different colors or a round badge.
:::row
[i 520]
|||
[i 614]
:::
For finer adjustments, use "Generate" or the "Lab".
:::

## FAQ

:::faq
?? How do I put the brand name on the logo?
Write it in the prompt, or add the text after generating with [the editing features](#chat-edit).

?? I want several versions in a consistent style
Keep using the same prompt, or add an example image in that style as a reference, then generate several times.

?? Can I use an AI-generated logo commercially as is?
Not necessarily. We recommend reworking the downloaded image in other software, or redrawing the final design in vector software, so you fully own the copyright.

?? The result is far from what I imagined
- Describe it more clearly, with colors and adjectives
- Provide a reference image
- Generate a few more times, pick the closest version and edit it by hand
:::
`,
},

"outfit": {
  src: "9346acac", t: "Changing outfits",
  d: "Dress a person in specific clothes: upload, crop and instruct in three steps, plus tips to avoid wrong proportions.",
  body: `
Want to see how clothes you're shopping for online would look on? Want to put an anime character in modern fashion? Changing outfits in Chat is as easy as applying a filter — great for style tests, outfit proposals and character work.

Changing outfits is a kind of image editing; for the basics, also see [Editing & compositing](#chat-edit).

:::steps
@ Upload the images
Start a new conversation in Chat and add the model (the person to dress) and the clothing reference.
[i 492]

@ Crop the reference (the key step)
The reference image has a big effect on the result, so **crop** it to keep only what you need.
[i 493]
[i 494]
- **Always crop the head out of the reference**, so the model's face isn't changed
- Keep only the part you want to change: full or half body, top, trousers, socks, shoes
:::warn Full-length photos without cropping often go wrong
Also mind **how much of the model is shown**: if the model is half-body but the clothing reference is full-length, the result gets squeezed into an oddly proportioned full body, or the clothes don't change at all.
:::

@ Enter the instruction and send
Give the instruction using "image 1" and "image 2" (left to right, in upload order):
> Dress the person in image 1 in the clothes from image 2
[i 495]
:::

:::row
[i 496 Person to dress]
|||
[i 497 Reference clothing]
|||
[i 498 Result]
:::

## More examples

:::row
[i 499 Half body]
|||
[i 500 Full body]
:::

:::row
[i 501 Anime style]
|||
[i 502 Wrong: the crop doesn't match the person being dressed]
:::

## FAQ

:::faq
?? The result doesn't match the reference.
- Add a description of the clothing to the prompt, such as silk blouse, leather armor, light blue, low saturation
- Use a high-resolution clothing image for better detail

?? The proportions are off, limbs are distorted, or the face changed.
- Make sure the model and clothing **cover the same area**: half body with half body, full body with full body
- Re-crop the clothing image to remove the head and extra background
- Avoid extreme poses such as crouching or twisting; use upright or natural standing poses

?? I want an anime or realistic style, but the style drifts.
This happens when the model and clothing images are very different in style (real person vs. anime). Use images in a similar style, or add something like "keep the whole image in anime style".

?? Can I change several items from different sources at once?
It's better to change them over several rounds for more reliable results.

?? Can I keep editing after the outfit is changed?
Yes. Just enter a new instruction, such as "make the skirt a bit shorter" or "make the color a pale pink".
:::
`,
},

"storyboard": {
  src: "61327410", t: "From storyboard to video",
  d: "Have a story but not sure how to turn it into a video? In Chat, the AI assistant helps you plan the storyboard, generate the frames and make them into a video.",
  body: `
Have a great story in your head but not sure how to turn it into pictures? Generating a video directly often doesn't turn out as expected, and even after rewriting the prompt several times it still isn't right?

You don't have to start with "generate video". First **break the story into a storyboard** and plan each scene's image and action, then generate the material step by step. Your work will have a much clearer direction.

In Chat, just describe your idea and the AI assistant helps you plan the storyboard, generate the frames and make them into a video. No video-making experience needed.

Open "Chat" from the right:

[i 595]

:::steps
@ Describe the outline or script
You can give a rough idea or a full script. We recommend including:
- **Mood**
- **Style**
- **Characters**
- **Story outline**
> Make a short film with a suspenseful mood. On a rainy night, a girl takes a clear umbrella from the umbrella stand outside a convenience store. As she walks off under it, she notices a mysterious figure in the reflection on the glass. Please develop this story and plan it as a storyboard suitable for making an AI video.
[i 596]

@ Discuss the first plan
The AI assistant gives you concrete storyboard descriptions, the mood and suggestions for the next step. If you want to change anything, just talk it through.
:::details The AI assistant's full reply
[i 597]
:::
For example, if you only want to adjust part of the story:
[i 598]

@ Revise the storyboard
After it generates five storyboard images, **ask for changes to what you don't like**, or **bring in new ideas**.
:::details The AI assistant's full reply
[i 599]
:::
For example: "In the fifth image, point the camera at the main character's back, with a bloody handprint on her back."
[i 600]
[i 601 The revised fifth storyboard image]

@ Finalize the storyboard and generate the video
Once the storyboard is settled, give the images to the AI assistant **in order** and describe the details of each one. You can also ask the AI assistant to put the details together for you.
:::row
[i 602 Image 1]
|||
[i 603 Image 2]
:::
:::row
[i 604 Image 3]
|||
[i 605 Image 4]
:::
[i 606 Image 5]
An example of describing the details (from left to right: image 1, image 2…):
[i 607]
:::tip
Try to explain all your details and ideas at once! Changing things after the video has been generated **uses more Points**.
:::

@ Check and revise the video clips
If you're not happy with a clip, give your ideas and feedback until you are.
:::row
[v 608]
|||
[v 609]
:::
:::row
[v 610]
|||
[v 611]
:::
[v 612]

@ Edit it yourself to finish
Edit the clips together and you're done:
[v 613]
:::

## FAQ

:::faq
?? I want to keep going, but my "AI assistant Points" have run out
You can finish the generation yourself in "Generate" or the "Lab".

?? Do I have to choose the AI model myself in Chat?
No, the AI assistant picks a suitable model automatically. If you have a preference, such as quality, speed, a model that uses fewer Points, or a particular model for video, just tell it in the chat. See also [Chat settings](#chat-settings).

?? How do I keep characters and visual style consistent across storyboard frames?
- When planning the storyboard, describe the character's look clearly up front, such as hairstyle, clothing, age and accessories, as well as the overall art style and color tone, and keep to these settings in later generations
- Upload reference images, such as **the character's appearance, clothing, scene** or **overall visual style**, to help the AI understand what you want

?? Can the AI decide the action and camera work for each shot?
Yes. Upload the storyboard images **in order** in the same way and enter:
> Please plan in words the characters' actions, scene changes, emotions and camera language for images 1 to 5
Adjust "images 1 to 5" to match your actual number of frames. Note that the AI planning the shots and the video model actually generating the motion are separate steps, so the final result still depends on what the model can do.

?? Why doesn't the generated storyboard or video match my description exactly?
Results depend on how clear the prompt is, the model's characteristics, the reference material and how it's generated, so not every detail in the text can be reproduced. Make your request more specific, for example by clearly stating **the character's appearance, action, camera angle, lighting and scene details**. Settling the main image and action first, then adding details bit by bit, is usually easier to control.
:::
`,
},

"models": {
  src: "f0159080", t: "Model guide",
  d: "Choose a model by what you want to make: what each image, video, music and 3D model is good at.",
  body: `
The same prompt can give completely different results with a different model. Use the tables below to find a suitable model, then open each article for real comparisons.

:::note All the models below use Points
You can use them with your free daily Points. For paid models that use Coins (such as GPT Image, Kling and Seedance), see [Coins image models](#credit-image), [Coins video models](#credit-video), [Coins music models](#credit-music) and [Coins 3D models](#credit-3d). For the difference between Points and Coins, see [Points & Coins](#credits).
:::

## Images

| I want… | Suggested models |
| --- | --- |
| Realistic photos, product shots, ad visuals | FLUX.2, Krea 2, FLUX.1 |
| Cinematic, naturally lit realistic images | P-H3-Image, Krea 2 |
| Good understanding of Chinese, natural-looking people | Z-Image |
| Posters, logos, text inside the image | Ideogram 4, Qwen Image |
| Editing an existing image | Fibo 2.0, Qwen Image Edit, FLUX.2 [Klein] |
| Keeping a character or product from a reference image | FLUX.3 Image Klein, Qwen Image 2.1, P-H3-Image |
| Anime characters, illustration | Anima, Illustrious, NoobAI XL |
| Furries, fantasy creatures, cartoons | Pony Diffusion V6 XL |
| Concept art, visual experiments | Lumina |
| Free adjustment with LoRA/ControlNet | Stable Diffusion XL |
| Upscaling images and restoring detail | SeedVR2 Image |

See [Points image models](#m-image), or start with [Choosing a model](#m-choose) to learn what a model is.

## Video

| I want… | Suggested models |
| --- | --- |
| Consistency from several reference images, videos and audio | MiniMax H3 |
| Quick tests of motion and composition before the final version | MiniMax H3 Turbo |
| First and last frames, generated audio, fewer Points and higher quality | LTX 2.5 |
| Effect LoRAs (such as earth zoom or a suplex) | Wan 2.2 |
| A character copying the motion in a video | Wan Animate 2, SCAIL 2 |
| Replacing the subject of a video with my own character | SCAIL 2 |
| Upscaling and repairing blurry video | SeedVR2 |

See [Points video models](#m-video).

## Music

| I want… | Suggested models |
| --- | --- |
| Fast, cheap songs with an exact length | ACE Step 1.5 XL |
| Natural vocals, polished arrangements, good sound | MiniMax Music 3.0 |
| Good sound at a low price, or a new arrangement from a score | YuE2 |
| Background music, solo instruments, sound effects | Stable Audio 3.0 |

See [Points music models](#m-music).

## 3D

| I want… | Suggested models |
| --- | --- |
| A faithful model for ordinary 3D software or 3D printing | Pixal3D |
| Cheap, quick previews, or a realistic Gaussian Splat scene | Idol |

See [Points 3D models](#m-3d).
`,
},

"m-choose": {
  src: "d5e6e6a6", t: "Choosing a model",
  d: "What a model is, why switching models works better than rewriting prompts, and how to see what each model does best.",
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

Found a suitable model? Start creating! For real comparisons between models, see [Points image models](#m-image).
`,
},

"m-image": {
  src: "b0cd2361", t: "Points image models",
  d: "The features, strengths and best uses of 18 image models and SeedVR2 image upscaling, compared using the same prompts.",
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

## How to choose

| I want… | Suggested models |
| --- | --- |
| To try several cheap versions first | Stable Diffusion XL, FLUX.3 Image Klein (about 23 Points per image) |
| Realistic photos, product shots, ad visuals | FLUX.2, Krea 2, FLUX.1 |
| Cinematic, naturally lit realistic images | P-H3-Image, Krea 2 |
| To keep a character or product from a reference image | Qwen Image 2.1, FLUX.3 Image Klein, P-H3-Image |
| To edit an existing image | Qwen Image Edit, Fibo 2.0, FLUX.2 [Klein] |
| Good understanding of Chinese, natural-looking people | Z-Image |
| Posters, logos, text inside the image | Ideogram 4, Qwen Image |
| Anime characters, illustration | Anima, Illustrious, NoobAI XL |
| Furries, fantasy creatures, cartoons | Pony Diffusion V6 XL |
| Concept art, visual experiments | Lumina |
| Free adjustment with LoRA/ControlNet | Stable Diffusion XL |
| To upscale images and restore detail | SeedVR2 Image |

## All models

In "Select tool", click the coin icon "**Points**" to list only the models that use Points. The last column is roughly how many Points one image costs with the default settings; higher resolutions cost more, and the actual cost is shown again before you send.

| Model | Good at | Extras | Cost per image (Points) |
| --- | --- | --- | --- |
| [P-H3-Image](#h-ph3) | Realistic photography, cinematic looks, graphic design | Multiple reference images, editing | 49 |
| [Qwen Image 2.1](#h-qwen21) {{Most used}} | Reference-guided generation | Reference images, LoRA | 26 |
| [FLUX.3 Image Klein](#h-flux3) | Generation and editing, multiple reference images | Reference images, LoRA | 23 |
| [Fibo 2.0](#h-fibo) | Image editing (no text-to-image) | – | 33 |
| [Krea 2](#h-krea) | Photographic, cinematic and artistic styles | LoRA | 25 |
| [Anima](#h-anima) | Anime characters, illustration | LoRA | 38 |
| [Z-Image](#h-zimage) | Understanding Chinese, people, varied styles | LoRA, ControlNet | 25 |
| [Ideogram 4](#h-ideogram) | Text in images, graphic design | – | 30 |
| [FLUX.2](#h-flux2) | Product photography, commercial visuals | Reference images, editing, LoRA | 30 |
| [FLUX.2 [Klein]](#h-flux2k) | Fast generation and editing, outfit changes | Editing, LoRA | 30 |
| [FLUX.1](#h-flux1) | Realistic people, lifestyle photography | LoRA, ControlNet | 32 |
| [Qwen Image](#h-qwen) | Typography, posters, infographics | LoRA, ControlNet | 30 |
| [Qwen Image Edit](#h-qwenedit) | Editing images from text instructions | LoRA (a reference image is required) | 35 |
| [Illustrious](#h-illustrious) | High-quality anime illustration, clothing detail | LoRA, ControlNet, Embedding | 23 |
| [NoobAI XL](#h-noobai) | Anime characters, varied art styles | LoRA, ControlNet, Embedding | 23 |
| [Pony Diffusion V6 XL](#h-pony) | Furries, fantasy creatures, cartoons | LoRA, ControlNet, Embedding | 23 |
| [Lumina](#h-lumina) | Concept art, visual experiments | LoRA | 43 |
| [Stable Diffusion XL](#h-sdxl) | Realism, character illustration, concept art | LoRA, ControlNet, Embedding, negative prompts | 23 |
| [SeedVR2 Image](#h-seedvr-image) | Upscaling images and restoring detail (can't generate new images) | – | 80 |

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

## P-H3-Image {#h-ph3}

[i 615]

An image model developed by Pruna AI on top of MiniMax H3. It's good at **realistic photography, cinematic images and natural light**, producing images that look like real photos or film stills, and it also suits **graphic design**.

It also supports **editing with reference images**, and can combine **several reference images** at once, for example putting a person from one image into the scene of another.

:::tip Who it's for
People who want the look of real photos or film stills, or want to combine several reference images into a new image.
:::

:::row
[i 616]
|||
[i 617]
|||
[i 618]
:::

## Qwen Image 2.1 {{Most used}} {#h-qwen21}

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

## Fibo 2.0 (image editing) {#h-fibo}

[i 25]

Fibo 2.0 specializes in **image editing**: changing objects, colors, materials or local details, especially simple, clear adjustments. It tries to keep the original composition and style.

It currently **only supports image editing, not text to image**. With "Auto prompt enhancement" on, the system rewrites your instruction in its own VGL (Visual Graph Language) format for more precise edits.

:::tip Who it's for
People who only want to change some elements, colors or details without changing the picture much.
:::

Drag the divider in the middle to compare before and after:

:::row
:::compare
[i 585 Before]
[i 588 After]
?? Prompt(After)
Change the lanterns into jack-o’-lanterns, turn the torii gate in the distance into a Halloween-style Gothic gate, and change the buildings on both sides to medieval European architecture
:::
|||
:::compare
[i 586 Before]
[i 589 After]
?? Prompt(After)
Change the woman into a melancholy short-haired man in his early twenties, wearing a short dark blue trench coat
:::
|||
:::compare
[i 587 Before]
[i 590 After]
?? Prompt(After)
Change the tabby cat into a brown Shiba Inu
:::
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
[i 619]
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
:::compare
[i 585 Before]
[i 591 After]
?? Prompt(After)
Change the lanterns into jack-o’-lanterns, turn the torii gate in the distance into a Halloween-style Gothic gate, and change the buildings on both sides to medieval European architecture
:::
|||
:::compare
[i 586 Before]
[i 592 After]
?? Prompt(After)
Change the woman into a melancholy short-haired man in his early twenties, wearing a short dark blue trench coat
:::
|||
:::compare
[i 587 Before]
[i 593 After]
?? Prompt(After)
Change the tabby cat into a brown Shiba Inu
:::
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

## SeedVR2 Image (upscaling) {#h-seedvr-image}

ByteDance's **upscaling tool**: when an image is too small or not sharp enough, it enlarges it and **restores natural detail**. It can't generate new images; it only works on existing ones, whether generated images or your own photos. Each run costs about 80 Points by default.

There's the same tool for video; see SeedVR2 in [Points video models](#m-video).

:::tip Who it's for
People who already have an image they like, but the resolution isn't enough for printing, wallpaper or large displays.
:::
`,
},

"m-video": {
  src: "d9f7236b", t: "Points video models",
  d: "Features and usage of MiniMax H3, MiniMax H3 Turbo, LTX 2.5, Wan 2.2, Wan Animate 2, SCAIL 2 and SeedVR2 compared.",
  body: `
Want to generate from reference images and videos? Make first-and-last-frame videos? Have a character copy a dance? With so many video models, knowing each one's strengths saves a lot of effort.

Models differ in features, how to write prompts, how many Points they use and what material they accept. For example, MiniMax H3 can be steered by reference images, videos and audio at the same time, and you can quickly reference assets in the prompt with "@" — ideal for work that needs a **consistent** character, scene, motion or voice.

## How to choose

| I want… | Suggested models |
| --- | --- |
| To try several cheap versions first | LTX 2.5 (about 165 Points), MiniMax H3 Turbo (about 313 Points) |
| To keep a character consistent using several reference images, videos and audio | MiniMax H3 |
| Quick tests of motion and composition before the final version | MiniMax H3 Turbo |
| To set the opening and closing frames | LTX 2.5, MiniMax H3 |
| The video to generate its own sound | LTX 2.5 |
| To control the sound or soundtrack with reference audio | MiniMax H3 |
| Effect LoRAs (such as earth zoom or a suplex) | Wan 2.2 |
| A character in an image copying the motion in a video | Wan Animate 2, SCAIL 2 |
| To replace the subject of a video with my own character | SCAIL 2 |
| To upscale a video and fix blur | SeedVR2 |

## All models

In "Select tool", click the coin icon "**Points**" to list only the models that use Points. The last column is roughly how many Points one generation costs with the default settings; longer videos and higher resolutions cost more, and the actual cost is shown again before you send.

| Model | Strength | Accepted material | Default cost (Points) |
| --- | --- | --- | --- |
| [MiniMax H3](#h-minimax) {{Most used}} | Multiple references, consistency | Reference images, videos and audio; supports first & last frames | 626 |
| [MiniMax H3 Turbo](#h-minimax-turbo) | A fast version of H3: quicker and uses fewer Points | Similar to MiniMax H3 | 313 |
| [LTX 2.5](#h-ltx) | Cheaper first & last frames, higher quality, can generate audio | Start image, last frame image | 165 |
| [Wan 2.2](#h-wan22) | Lots of effect LoRAs | Start image | 380 |
| [Wan Animate 2](#h-wananimate) | Makes an image's character perform like a video | Source image, driving video | 1,809 |
| [SCAIL 2](#h-scail) | Copies motion or replaces the subject | Reference image, driving video | 653 |
| [SeedVR2](#h-seedvr) | Upscaling and repairing video detail | Video | 567 |

## Choosing a model

Open "Generate" or "Lab" and choose "Video":

[i 137]

Pick the model you want in the model selector:

[i 138]

## MiniMax H3 {{Most used}} {#h-minimax}

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

### MiniMax H3 Turbo {#h-minimax-turbo}

[i 620]

The **fast version** of MiniMax H3: slightly lower quality but quicker to generate, at about 313 Points by default, roughly half of MiniMax H3. Since 2026/11/05 it runs on Pika H3 Flex, with better quality and motion. It's currently marked as a "Beta" feature.

:::tip Who it's for
People who want to try motion and composition quickly, then make the final version with MiniMax H3 once they're happy.
:::

## LTX 2.5 {#h-ltx}

[i 145]

Accepts a **start image** and a **last frame image**, and can **generate audio**. For first-and-last-frame videos, LTX 2.5 is **cheaper and higher quality** than MiniMax H3.

:::row
[v 146 LTX 2.5 | 720P | 235 Points]
|||
[v 147 MiniMax H3 | 480P | 250 Points]
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

Built for **motion transfer**: the character in an image performs like the video. You can fill in subject, background and action prompts, or leave them all empty and just add the source image and driving video. For the full guide, see [Motion transfer](#v-mimic).

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
In this Replace subject example, the character and the person in the video differ too much in species and build, so the proportions come out strange. For a normal example, see [Motion transfer](#v-mimic).
:::

## SeedVR2 {#h-seedvr}

[i 167]

When a video is too small or unclear, SeedVR2 **upscales it naturally and repairs detail**, with 1080P and 1440P options. Images can be upscaled too; see SeedVR2 Image in [Points image models](#m-image).

:::row
[v 168 Original]
|||
[v 169 Upscaled to 1440P]
:::
`,
},

"m-music": {
  src: "ff3d00f7", t: "Points music models",
  d: "Hands-on comparison of YuE2, ACE Step 1.5 XL, Stable Audio 3.0 and MiniMax Music 3.0, plus how to use YuE2's sheet-music mode.",
  body: `
Once you've learned [music generation](#music), compare the four music models using the same prompts to see what each does best.

## How to choose

| I want… | Suggested models |
| --- | --- |
| To try several cheap versions first | Stable Audio 3.0 (about 90 Points, instrumental), ACE Step 1.5 XL (about 148 Points) |
| Natural vocals and good sound at a low price | YuE2 |
| A new arrangement from a score | YuE2 |
| An exact length (for example, to match a video) | ACE Step 1.5 XL, Stable Audio 3.0 |
| Background music, solo instruments, sound effects | Stable Audio 3.0 |
| A polished final piece with the best sound | MiniMax Music 3.0 |

## All models

The last column is roughly how many Points one generation costs with the default settings; longer tracks cost more, and the actual cost is shown again before you send.

| Model | Strengths | Prompts | Default cost (Points) |
| --- | --- | --- | --- |
| [YuE2](#h-yue) | Natural vocals, varied arrangements, good sound, cheap, can be driven by sheet music | Lyrics, style, sheet music | 250 |
| [ACE Step 1.5 XL](#h-ace) | Fast, cheap, stable, precise length | Lyrics, style | 148 |
| [Stable Audio 3.0](#h-stable-audio) | Great for soundtracks, solo instruments and sound effects; good sound, precise length | Style | 90 |
| [MiniMax Music 3.0](#h-minimax-music) | Natural vocals, mature and varied arrangements, the best sound | Lyrics, style | 623 |

## Choosing a model

Open "Generate" or "Lab" and choose "Music":

[i 82]

Pick the model you want in the model selector:

[i 83]

## Test prompts

ACE Step, MiniMax Music and YuE2 all used the same lyrics and style prompt.

:::details Lyrics (Japanese)
> [Intro]
> [Verse 1]
> そこには　まさかのらくえんさ
> しずくばっかかぞえていた
> ねえ、ずっとないてること　しってるわ
> どうやってあのこにしょうめいするか
> おまえはさいていな @#&^%#(&
> 「どこ にげればいい」と にゃにゃ
> ほえあげろ
> [Pre-Chorus 1]
> このまま、このまま
> きつねあめのいつか
> だいきらいな、わけのようなおとなになった。
> そんなこうとう、そんなかお
> ぎぶんつもりだけど
> 「ね、おまえもようかいになるか」
> [Chorus 1]
> あわせよ
> このうた　うたうこえを
> あたまならしてのを
> あのこのなきごえを
> そう、いっそ
> ここごちゃごちゃにしろ
> どうせわけのせいになるだろう
> また
> むねはっちゃった、てんぐなっちゃった
> だれをまもったさえような
> あやまったか？ゆるせずさ
> はらはら　まっていくんだ。
> [Verse 2]
> せんたくしないのもせんたくかも
> こうやっていきてるいつも
> ねえ、いったいだれのおかげなの
> こわいからのあやまちのはひとのつねや
> そこで　おおめにみてようしゃして  ねえ
> [Bridge]
> ねね、じごくのえんまさま
> からくれないをみにやきつけて
> ねね、じごくのあのこへ
> あのひだけわすれないでくれ
> ねね、まえるやまつみわ
> あいなんてこいなんてをおしえて
> ねね、まよえるおまえわ
> いっそしぬまでにくみあってくれ
> 「どう？たもとにすがってでも..........」
> こたえよ...
> こたえよ!
> [Final Chorus]
> どこかへいけるの
> なにまもりたいっていったっけ？
> あはははは　えらいね
> さあ、どうぞ
> ここでおどりおどろう
> どうせこんなことになったもん
> ほら
> はなぐもり　もえさかり　めざわり　こいのけむり
> じそんをぬき　わけのように
> いきのびてでもいい
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

## YuE2 {#h-yue}

[i 88]

In the default "Generate" mode it also creates songs from prompts. **Natural vocals, varied and mature arrangements, good sound and a low price**, at medium speed. The model sets the song's length automatically from the lyrics.

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

## ACE Step 1.5 XL {#h-ace}

[i 84]

Mainly for **songs**: **fast, cheap, stable, with precise length control**, which makes it good for generating lots of songs or songs of a fixed length. It has "Lyrics" and "Style" prompts; for details, see [Music generation](#music).

:::row
[i 85]
|||
[a 572 ACE Step 1.5 XL]
:::

## Stable Audio 3.0 {#h-stable-audio}

[i 100]

Good at **soundtracks, solo instruments and sound effects**, with good sound, efficient generation, varied arrangement styles and precise length. It makes instrumental music only, so you just write a "Style" prompt.

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

## MiniMax Music 3.0 {#h-minimax-music}

[i 86]

Similar to ACE Step, but **puts more weight on natural vocals**, so it sounds more like a real singer. Its styles and arrangements are more varied and mature, it often surprises you, and it **sounds better**, which makes it a good choice for finished work.

:::row
[i 87]
|||
[a 573 MiniMax Music 3.0]
:::
`,
},

"m-3d": {
  src: "28d0ab7f", t: "Points 3D models",
  d: "The two Points 3D models, Pixal3D and Idol: what each is good at, roughly how much one generation costs, and how to choose.",
  body: `
To generate a 3D model you only need to upload **one image**; there's no prompt to write. For the steps and how to prepare the source image, see [3D model generation](#model-3d). This page explains the difference between the two Points 3D models.

## How to choose

| I want… | Suggested model |
| --- | --- |
| A quick, cheap look at the result first | Idol (about 100 Points) |
| A faithful model with realistic surface materials | Pixal3D |
| To import into Blender, Maya, a game engine or other ordinary 3D software | Pixal3D |
| 3D printing | Pixal3D (.STL available) |
| A 3D scene that looks like a photo (Gaussian Splat) | Idol |

## All models

The last column is roughly how many Points one generation costs with the default settings; the actual cost is shown again before you send.

| Model | Strengths | Export formats | Default cost (Points) |
| --- | --- | --- | --- |
| [Pixal3D](#h-pixal3d) {{Most used}} | Aligns point by point with the image for a faithful model, with PBR materials | .GLB, .USDZ, .STL, .OBJ, .PLY | 650 |
| [Idol](#h-idol) | Quickly generates a Gaussian Splat model at a low cost | .SPZ, .PLY, .SOG (.GLB is experimental) | 100 |

For 3D models that use Coins (Tripo, Hunyuan3D), see [Coins 3D models](#credit-3d).

## Where to find them

Find "Other tools", choose "Model generation", then pick a model:

[i 277]

## Example: one image turned into 3D

All three examples were generated with Pixal3D from the source images below. Click one to load it, then drag to rotate and pinch to zoom. Each model is about 12–22 MB, so watch your data if you're on mobile.

:::row
[i 631 Source: scene]
|||
[i 632 Source: person]
|||
[i 633 Source: animal]
:::

[3d 634 Pixal3D: scene]

[3d 635 Pixal3D: person]

[3d 636 Pixal3D: animal]

## Pixal3D {{Most used}} {#h-pixal3d}

Rebuilds the model by **aligning point by point** with the image, so the shape stays close to the image, and adds **PBR materials** (realistic surface qualities such as metal and roughness). It's an ordinary 3D mesh that most 3D software can open directly.

- **Quality and texture size**: we recommend the defaults (High, 4K)
- **Export**: .GLB (with textures, as "Original" or "Compatible"), .USDZ, .STL, .OBJ, .PLY; textures can also be downloaded on their own as the original files, PNG or JPEG
- If other software can't open the original GLB, download the "Compatible" version instead

:::tip Who it's for
People who need a truly editable 3D model for games, animation, product showcases or 3D printing.
:::

## Idol {#h-idol}

Quickly generates **3D Gaussian Splat** models for less than a sixth of the cost of Pixal3D. Idol is an improved version built on TripoSplat technology, with better object detail and more consistency from different angles (TripoSplat was retired on 2026/11/05).

- **What's a Gaussian Splat**: a 3D scene made of many tiny colored points. It looks a lot like a photo, but it isn't the same as an ordinary 3D mesh
- **Export**: .SPZ, .PLY, .SOG, plus an experimental .GLB

:::warn Check the format before importing
Not every 3D program can open Gaussian Splats. To import into other software, 3D print or rig for animation, use Pixal3D instead.
:::

Below are Idol examples generated from the same source images.

:::note The previews here look rougher than the real thing
The Help Center can only draw a Gaussian Splat as individual colored dots, so it looks sparse with noisy edges. Previewed on the platform or opened in software that supports splats, it looks much finer. Each file is about 15 MB.
:::

[3d 637 Idol: scene]

[3d 638 Idol: person]

[3d 639 Idol: animal]

:::tip Who it's for
People who want a cheap first look at turning an image into 3D, or want a realistic 3D scene to browse.
:::
`,
},

"credit-image": {
  src: "d56565b6", t: "Coins image models",
  d: "14 image models from OpenAI, Google, ByteDance and others: what each is good at, roughly how much one image costs, and how to choose.",
  body: `
:::warn Paid models: Coins required
Every model on this page uses **Coins**; your free daily Points can't be used. For how to get Coins, see [Top up Coins](#credit-tools). To use Points instead, see the Points models in the [Model guide](#models).
:::

This page covers the image models that use **Coins**. For what Coins are, see [Points & Coins](#credits); for how to top up, see [Top up Coins](#credit-tools).

## Where to find them

Open "Select tool", click the moon icon "**Coins**" at the top, then choose "**Image**" to list only the Coins image models. The moon number next to each model is **roughly how many Coins one image costs**.

[i 622]

## How to choose

| I want… | Suggested models |
| --- | --- |
| To try several cheap versions first | GPT Image 2.5 Flare, Seedream 5 Flash, Muse Image, MAI Image 2.6 Flash |
| Precise edits that keep the original's detail | GPT Image 2.6 Sunburst, GPT Image 2.5 Sunburst |
| Slides, infographics, lots of text in the image | Nano Banana Pro, GPT Image 2.6 |
| Commercial key visuals, large ad images | Seedream 5 Pro, MAI Image 2.6 |
| To mark with boxes where things go in the image | FLUX 3 Image |
| To upscale images and restore detail | Topaz Wonder 3.5 |

## All models

| Model | Company | Strengths | Cost per image (Coins) |
| --- | --- | --- | --- |
| [GPT Image 2.6 Sunburst](#h-gptimage) | OpenAI | Richly detailed images and precise edits, with adjustable complexity (new) | 4 |
| [GPT Image 2.6 Flare](#h-gptimage) | OpenAI | Fast, high-quality images for quick iterations, with adjustable complexity (new) | 4 |
| [GPT Image 2.5 Sunburst](#h-gptimage25) {{Most used}} | OpenAI | Focused on precise edits that keep the original's detail | 1 |
| [GPT Image 2.5 Flare](#h-gptimage25) | OpenAI | Fast, high-quality images for everyday generation and quick iterations | 1 |
| [Seedream 5 Pro](#h-seedream5) | ByteDance | Polished results and detail; commercial key visuals look especially cinematic | 4 |
| [Seedream 5 Flash](#h-seedream5) | ByteDance | Fast and cheap, good for lots of drafts and quick layer separation | 1 |
| [Nano Banana Pro](#h-nanobanana-pro) | Google | Strong at text in images; great for slides, infographics and combining several images | 8 |
| [Nano Banana 2.1](#h-nanobanana21) | Google | A fast, all-round everyday choice for both generating and editing | 4 |
| [Grok Imagine Image 2.0](#h-grok-image) | xAI | Adjustable quality and cost, from quick drafts to polished results | 4 |
| [Muse Image](#h-muse) | Meta | Make several versions on a small budget and pick the one you like | 1 |
| [MAI Image 2.6](#h-mai) | Microsoft | High-quality images, good for detailed retouching and commercial visuals | 4 |
| [MAI Image 2.6 Flash](#h-mai) | Microsoft | Fast images for revising ideas repeatedly at a lower cost | 2 |
| [FLUX 3 Image](#h-flux3-image) | Black Forest Labs | Supports editing with reference images, with layout regions for precise control | 4 |
| [Topaz Wonder 3.5](#h-topaz-wonder) | Topaz Labs | Upscales images and rebuilds detail, for photos, illustrations and AI images | 7 |

Apart from Topaz Wonder 3.5, which only upscales, every model can generate new images and also **edit** existing ones.

:::tip What's the difference between Sunburst and Flare
Each version of GPT Image comes in two kinds: **Sunburst** focuses on detail and precise edits, and **Flare** focuses on speed, so it's good for trying several versions.
:::

## GPT Image 2.6 (Sunburst/Flare) {#h-gptimage}

GPT Image 2.6 is faster, produces better images and follows instructions more closely. It's good at **dense text, complex layouts and the relationships between several objects**. Edits are more accurate and reliably keep the details of people, objects and scenes.

Like 2.5, it comes in two kinds:

| Version | Strengths | Cost per image (Coins) |
| --- | --- | --- |
| GPT Image 2.6 Sunburst | Richly detailed images and **precise edits**, for finished work and edits that keep the original's detail | 4 |
| GPT Image 2.6 Flare | **Fast**, high-quality images, good for quick iterations | 4 |

Both let you adjust the complexity. If you're not sure which to pick, find a direction with Flare first, then make the final version with Sunburst.

You can adjust the **complexity**:

[i 623]

| Complexity | Good for |
| --- | --- |
| Lower | Small edits, such as changing a color or removing one object from the image |
| Higher | Dense text, complex layouts, relationships between several objects |

:::warn The higher the complexity, the more likely other parts change
At higher complexity, the image may change in ways you didn't ask for. If you only want to change a small part, start with a lower complexity.
:::

## GPT Image 2.5 (Sunburst/Flare) {#h-gptimage25}

The previous version of GPT Image 2.6, also in two kinds: **Sunburst**{{Most used}} focuses on precise edits that keep the original's detail, and **Flare** is fast, good for everyday generation and quick iterations.

Each image costs about **1 Coin**, making it the cheapest option in the GPT Image family. Start here if you want to try out the composition and colors cheaply before making the final version with 2.6.

:::tip Who it's for
People who want GPT Image's understanding while keeping costs down.
:::

## Seedream 5 (Pro/Flash) {#h-seedream5}

ByteDance's image model. It's good at **realistic photos, materials and lighting**, with a polished, finished look, and commercial key visuals look especially cinematic. You can also add several reference images to keep a person's face and clothing consistent across different images.

| Version | Strengths | Cost per image (Coins) |
| --- | --- | --- |
| Seedream 5 Pro | The best detail and finish, for final key visuals | 4 |
| Seedream 5 Flash | Fast and cheap, good for lots of drafts and quick layer separation | 1 |

:::tip Who it's for
People making ads, product images, posters and other commercial visuals. Try directions with Flash first, then make the final version with Pro.
:::

## Nano Banana Pro {#h-nanobanana-pro}

Google's image model built on Gemini. Its biggest strength is **text in images**: from titles and slogans to whole paragraphs, it renders text clearly, in many languages. It's great for text-heavy, complex layouts such as **slides, infographics, posters and menus**.

It can also combine several images into one while keeping characters consistent. At about 8 Coins per image, it's the most expensive image model here, best for finished work.

:::tip Who it's for
People who need lots of accurate text in their images, or are making infographics and slide visuals.
:::

## Nano Banana 2.1 {#h-nanobanana21}

Google's everyday choice: **fast and versatile**, easy for both generating and editing. It understands conversational edit instructions well (for example "change the background to a beach" or "turn the person to a side profile").

It isn't as good with text and complex layouts as [Nano Banana Pro](#h-nanobanana-pro), but costs only about half as much.

:::tip Who it's for
People who want an everyday model that can do anything and makes editing easy.
:::

## Grok Imagine Image 2.0 {#h-grok-image}

xAI's image model. It's good at **realistic photos, portraits and dramatic images**, with a bold style and strong lighting, and it can understand images and edit them following your instructions.

Quality and cost are adjustable: make quick images to find a direction, or polished final results.

:::tip Who it's for
People who want striking images with a strong style, or like trying lots of different ideas.
:::

## Muse Image {#h-muse}

Meta's image model. It's good at **everyday, lifestyle images**, and can also combine several photos, add clear text to an image, or restore and tidy up old photos.

At only about **1 Coin** per image, you can make several versions on a small budget and pick the one you like.

:::tip Who it's for
People on a limited budget who want to try lots of versions, or are making social posts and lifestyle images.
:::

## MAI Image 2.6 (and Flash) {#h-mai}

Microsoft's image model. It excels at **realistic photos**, with natural light, reflections and materials, and supports detailed retouching, which makes it good for commercial visuals.

| Version | Strengths | Cost per image (Coins) |
| --- | --- | --- |
| MAI Image 2.6 | High-quality images and detailed retouching | 4 |
| MAI Image 2.6 Flash | Fast and cheap, good for revising ideas repeatedly | 2 |

:::tip Who it's for
People who need a natural, realistic photo look, or want to make existing photos look better.
:::

## FLUX 3 Image {#h-flux3-image}

The Coins version of Black Forest Labs' image model (the Points version is [FLUX.3 Image Klein](#m-image)). Its standout feature is **layout regions**: draw boxes to say what goes where in the image, for example "title at the top left, product at the bottom right", and the model places things accordingly.

You don't have to draw boxes; a plain prompt works too. It also supports **editing with reference images**: add a reference image to put the same face or product into different images.

:::tip Who it's for
People with clear layout requirements, such as posters, ad layouts or product group shots.
:::

## Topaz Wonder 3.5 {#h-topaz-wonder}

Topaz Labs' image **upscaling** tool: it enlarges images while rebuilding and restoring detail, making blurry or low-resolution images sharp. It works on photos, illustrations and AI-generated images.

It **can't generate new images**; it only works on existing ones. Each run costs about 7 Coins.

:::tip Who it's for
People who already have an image they like, but the resolution isn't enough for printing or large displays.
:::
`,
},

"credit-video": {
  src: "1a3eeaf8", t: "Coins video models",
  d: "19 video models from Seedance, Kling, Google, xAI and others: what each is good at, roughly how much one generation costs, and how to choose.",
  body: `
:::warn Paid models: Coins required
Every model on this page uses **Coins**; your free daily Points can't be used. For how to get Coins, see [Top up Coins](#credit-tools). To use Points instead, see the Points models in the [Model guide](#models).
:::

This page covers the video models that use **Coins**. For what Coins are, see [Points & Coins](#credits); for how to top up, see [Top up Coins](#credit-tools).

## Where to find them

Open "Select tool", click the moon icon "**Coins**" at the top, then choose "**Video**" to list only the Coins video models. The moon number next to each model is **roughly how many Coins one generation costs**; longer videos and higher resolutions cost more, and the actual cost is shown again before you send.

[i 624]

## How to choose

| I want… | Suggested models |
| --- | --- |
| To try several cheap versions first | Grok Imagine Video 1.5 Lite, MiniMax H3 Max Turbo, Grok Imagine Video, Seedance 2.0 Mini |
| A multi-shot story or a longer video | Seedance 2.5, Seedance 2.0, Kling 4.0 |
| Characters who speak, or a video with sound | Kling 4.0, MiniMax H3 Max, Grok Imagine Video 1.5 |
| To keep a character consistent using several reference images, videos and sounds | MiniMax H3 Max, Gemini Omni 1.1 Flash |
| To set the opening and closing frames | Gemini Omni 1.1 Flash, Kling 3.0, Kling 4.0 |
| Memes and fun social clips | Grok Imagine Video, Grok Imagine Video 1.5 |
| To edit or continue an existing video | Wan 3.0, FLUX 3, Kling 3.0 Omni |
| To upscale a video and restore its quality | Topaz Starlight Precise 2.6, Topaz Starlight Mini |

## All models

In "What it does", **Generate** makes a new video, **Edit** changes an existing video, **Motion control** makes a character perform the moves in a reference video, and **Upscale** raises the resolution and restores detail.

| Model | Company | Strengths | What it does | Cost per run (Coins) |
| --- | --- | --- | --- | --- |
| [Seedance 2.5](#h-seedance25) {{Most used}} | ByteDance | Goes beyond a single shot, keeping characters and pacing steady through longer stories | Generate, Edit | 46 |
| [Seedance 2.0](#h-seedance2) | ByteDance | Strong at cinematic action and multi-shot stories | Generate, Edit | 30 |
| [Seedance 2.0 Fast](#h-seedance2) | ByteDance | A faster version of 2.0, good for testing lots of shots and moves | Generate, Edit | 24 |
| [Seedance 2.0 Mini](#h-seedance2) | ByteDance | A cheaper version of 2.0, the best value for short-video drafts and volume work | Generate, Edit | 15 |
| [Wan 3.0](#h-wan3) | Alibaba | An all-round video model that generates, edits and extends | Generate, Edit | 20 |
| [Gemini Omni 1.1 Flash](#h-gemini-omni) | Google | Keeps characters and scenes consistent; supports first and last frames, editing, extending and 4K | Generate, Edit | 20 |
| [FLUX 3 Max](#h-flux3-video) | Black Forest Labs | Fast, and good at high-quality video from a first frame | Generate | 34 |
| [FLUX 3](#h-flux3-video) | Black Forest Labs | Generates video, edits footage, or continues the action and scene of an existing video | Generate, Edit | 30 |
| [Kling 4.0](#h-kling4) | Kling AI | Videos with sound up to 30 seconds long, using multiple shots, key frames and chosen voices (new) | Generate, Edit | 32 |
| [Kling 4.0 Flash](#h-kling-flash) | Kling AI | 720P videos with sound up to 20 seconds long at a lower cost (new) | Generate, Edit | 19 |
| [Kling 3.0](#h-kling3) | Kling AI | Makes videos from prompts, first and last frames and character elements | Generate | 17 |
| [Kling 3.0 Omni](#h-kling3) | Kling AI | The most versatile Kling: generating, editing videos and character performance in one | Generate, Edit, Motion control | 17 |
| [Grok Imagine Video 1.5](#h-grok-video) | xAI | Short social videos with more mature motion, physics and sound | Generate | 28 |
| [Grok Imagine Video 1.5 Lite](#h-grok-video) | xAI | A budget version of 1.5, good for lots of test clips | Generate | 6 |
| [Grok Imagine Video](#h-grok-video) | xAI | Fast, with bold ideas; ideal for memes and fun clips | Generate, Edit | 14 |
| [MiniMax H3 Max](#h-minimax-max) | MiniMax | An enhanced H3 with many kinds of reference material and synced sound | Generate, Edit | 16 |
| [MiniMax H3 Max Turbo](#h-minimax-max) | MiniMax | A fast H3 with many kinds of reference material, making videos with sound at a lower cost | Generate, Edit | 8 |
| [Topaz Starlight Precise 2.6](#h-topaz-starlight) | Topaz Labs | Upscales AI-generated or already-sharp video, restoring natural detail | Upscale | 20 |
| [Topaz Starlight Mini](#h-topaz-starlight) | Topaz Labs | Repairs low-resolution, compressed or old video | Upscale | 20 |

## Seedance 2.5 {{Most used}} {#h-seedance25}

ByteDance's latest video model. It goes beyond a single shot: **even longer stories keep their characters and pacing steady**. It accepts more reference material than 2.0, so characters' faces, clothing and scenes stay more consistent across shots.

At about 46 Coins per run, it's one of the most expensive video models here, best for final, longer clips.

:::tip Who it's for
People making multi-shot story clips who care a lot about characters staying consistent.
:::

## Seedance 2.0 (Fast/Mini) {#h-seedance2}

Strong at **cinematic action and multi-shot stories**: one generation can include transitions between several shots, along with music, ambient sound and dialogue. You can use images, videos and sound as references; for example, add a piece of music and the images and cuts follow the beat.

| Version | Strengths | Cost per run (Coins) |
| --- | --- | --- |
| Seedance 2.0 | The most complete quality and motion | 30 |
| Seedance 2.0 Fast | Faster, good for testing lots of shots and moves | 24 |
| Seedance 2.0 Mini | The cheapest, the best value for short-video drafts and volume work | 15 |

Text in the image and many people on screen at once can still be unstable at times, so we recommend focusing on one or two main characters.

:::tip Who it's for
People who want story clips with sound. Try with Mini or Fast first, then make the final version with 2.0.
:::

## Wan 3.0 {#h-wan3}

Alibaba's **all-round video model**: it can generate new videos, edit existing ones (such as changing the background or clothing), and **extend** a video while keeping characters and scenes consistent, generating sound at the same time.

The Points model [Wan 2.2](#m-video) is mainly about effect LoRAs; Wan 3.0 is a newer, more complete generation.

:::tip Who it's for
People who need one model to generate, edit and extend videos.
:::

## Gemini Omni 1.1 Flash {#h-gemini-omni}

Google's video model. It's good at **keeping characters and scenes consistent** and supports **first and last frames**: give it an opening and a closing image and it fills in the motion between them. It can also edit and extend existing videos, with output up to **4K**.

:::tip Who it's for
People who have already drawn their key frames and want a character to move naturally from frame A to frame B.
:::

## FLUX 3 and FLUX 3 Max {#h-flux3-video}

Black Forest Labs' video model comes in two versions:

| Version | Strengths | Cost per run (Coins) |
| --- | --- | --- |
| FLUX 3 | Generates video, edits footage, or **continues** from the last few frames of a video, carrying on the action and scene | 30 |
| FLUX 3 Max | Fast, and good at high-quality video from a first frame (generation only) | 34 |

:::tip Who it's for
People who want to bring an image to life, or carry on an existing video.
:::

## Kling 4.0 {#h-kling4}

Kling's latest video model, which can generate videos with sound up to **30 seconds** long.

- **Shots**: split the video into several shots, each with its own description and length
- **Middle frames**: placed between the start and end frames to make sure key frames appear
- **Elements and voices**: create a character with "Elements" and choose a voice, so the character speaks in that voice in the video
- Supports **video editing**

:::row
[i 625 Shots: several shots, each with its own length]
|||
[i 626 Elements: create a character and choose a voice]
:::

## Kling 4.0 Flash {#h-kling-flash}

A **budget version** of Kling 4.0 that generates **720P** videos with sound up to **20 seconds** long, and also supports references and editing.

It doesn't support **shots**, **middle frames**, **end frames** or **voices**. If you need those, use [Kling 4.0](#h-kling4) instead.

:::tip Who it's for
People who want longer videos for fewer Coins and don't need shots or control over the closing frame.
:::

## Kling 3.0 and 3.0 Omni {#h-kling3}

Kling's previous generation, cheaper than 4.0:

| Version | Strengths | Cost per run (Coins) |
| --- | --- | --- |
| Kling 3.0 | Makes videos from prompts, first and last frames and character elements, with good motion | 17 |
| Kling 3.0 Omni | The most versatile: generates and edits videos, and can make a character perform the moves in a reference video (motion control) | 17 |

**Omni**'s strength is "Elements": build an element from images of a character from several angles or a short clip of them, and their face stays consistent however the camera moves. You can also give an element a voice.

:::tip Who it's for
People who want Kling-style videos for fewer Coins, or need a character to perform the moves in a reference video.
:::

## Grok Imagine Video (1.5/1.5 Lite/original) {#h-grok-video}

xAI's video model, best for **short social videos**. It generates sound effects, ambient sound and speech along with the images, and its bold ideas suit memes and fun clips.

| Version | Strengths | Cost per run (Coins) |
| --- | --- | --- |
| Grok Imagine Video 1.5 | More mature motion, physics and sound | 28 |
| Grok Imagine Video 1.5 Lite | A budget version of 1.5, good for lots of test clips | 6 |
| Grok Imagine Video | Fast, and can also edit videos | 14 |

:::tip Who it's for
People making social clips, memes and funny videos who want to see results quickly.
:::

## MiniMax H3 Max and Max Turbo {#h-minimax-max}

Two Coins versions of MiniMax H3. Both make videos with sound from many kinds of reference material (images, videos and sound):

| Version | Notes |
| --- | --- |
| MiniMax H3 Max | The enhanced version, with synced sound |
| MiniMax H3 Max Turbo | The fast version at about half the cost; it now supports "Reference" material too, so it's as complete as Max |

Reference material works the same way as in the Points model MiniMax H3; see [Points video models](#m-video).

## Topaz Starlight (Precise 2.6/Mini) {#h-topaz-starlight}

Topaz Labs' video **upscaling and repair** tool. It **can't generate new videos**; it only works on existing ones:

| Version | Good for | Cost per run (Coins) |
| --- | --- | --- |
| Topaz Starlight Precise 2.6 | AI-generated or already-sharp video, restoring natural detail as it upscales | 20 |
| Topaz Starlight Mini | Low-resolution, compressed or old video, repairing noise and blur | 20 |

The Points upscaling tool is [SeedVR2](#m-video); you can try that first.

:::tip Who it's for
People who are already happy with a video's content and just want it to look sharper.
:::
`,
},

"credit-music": {
  src: "524a3652", t: "Coins music models",
  d: "ElevenLabs Music v2.5: what it's good at, roughly how much one generation costs, and how to choose between it and the Points music models.",
  body: `
:::warn Paid models: Coins required
Every model on this page uses **Coins**; your free daily Points can't be used. For how to get Coins, see [Top up Coins](#credit-tools). To use Points instead, see the Points models in the [Model guide](#models).
:::

This page covers the music models that use **Coins**. For what Coins are, see [Points & Coins](#credits); for how to top up, see [Top up Coins](#credit-tools).

## Where to find them

Open "Select tool", click the moon icon "**Coins**" at the top, then choose "**Music**" to list only the Coins music models. The moon number next to each model is **roughly how many Coins one generation costs**, and the actual cost is shown again before you send.

[i 627]

## How to choose

| I want… | Suggested model |
| --- | --- |
| A complete song from a plain-language description | ElevenLabs Music v2.5 |
| Songs in English, Japanese, Spanish and other languages | ElevenLabs Music v2.5 |
| To try with free Points first | [Points music models](#m-music) (such as ACE Step 1.5 XL and YuE2) |

## All models

| Model | Company | Strengths | Cost per run (Coins) |
| --- | --- | --- | --- |
| [ElevenLabs Music v2.5](#h-elevenlabs) | ElevenLabs | Describe the genre and lyrics in plain language to get a complete song or instrumental | 20 |

To try with Points first, see [Music generation](#music) and [Points music models](#m-music).

## ElevenLabs Music v2.5 {#h-elevenlabs}

Describe the genre, mood and instruments in plain language to generate a **complete song or instrumental track**.

- **Lyrics**: write your own, or leave them out and the model writes lyrics that fit the length
- **Instrumental**: write "instrumental only" in the description and there won't be any vocals
- **Many languages**: it can sing in English, Japanese, Spanish and more, with natural vocals, and it even handles fast rap

:::tip Who it's for
People who want natural vocals and full arrangements, or custom music for their videos.
:::
`,
},

"credit-3d": {
  src: "62a8cb80", t: "Coins 3D models",
  d: "Tripo H3.1, Tripo P2.0 and Hunyuan3D 3.1: what each is good at, roughly how much one generation costs, and how to choose.",
  body: `
:::warn Paid models: Coins required
Every model on this page uses **Coins**; your free daily Points can't be used. For how to get Coins, see [Top up Coins](#credit-tools). To use Points instead, see the Points models in the [Model guide](#models).
:::

This page covers the 3D models that use **Coins**. For what Coins are, see [Points & Coins](#credits); for how to top up, see [Top up Coins](#credit-tools).

## Where to find them

Open "Select tool", click the moon icon "**Coins**" at the top, then choose "**3D**" to list only the Coins 3D models. The moon number next to each model is **roughly how many Coins one generation costs**, and the actual cost is shown again before you send.

[i 628]

## How to choose

| I want… | Suggested model |
| --- | --- |
| A complex character or object, with parts I can edit separately | Tripo H3.1 |
| A lightweight model for a game or app | Tripo P2.0 |
| To use several photos from different angles, or just a text description | Hunyuan3D 3.1 |
| To try with free Points first | [Points 3D models](#m-3d) (Pixal3D, Idol) |

## All models

| Model | Company | Strengths | Cost per run (Coins) |
| --- | --- | --- | --- |
| [Tripo H3.1](#h-tripo-h31) | Tripo | More complete detail on complex characters and objects; can split the model into parts | 16 |
| [Tripo P2.0](#h-tripo-p20) {{Most used}} | Tripo | Low polygon count and clean structure (supports quads), good for games, mobile and VR | 48 |
| [Hunyuan3D 3.1](#h-hunyuan3d) | Tencent | Generates 3D from text or several images from different angles, with more faithful objects and characters | 21 |

For how to prepare the source image (clean background, 45-degree angle and so on), see [3D model generation](#model-3d).

## Tripo H3.1 {#h-tripo-h31}

Tripo's **high-detail** model. It captures more detail on complex characters and objects, and can **split the model into separate parts** (for example a person and the prop in their hand) so you can edit each one later.

:::tip Who it's for
People with complex characters or props, or who want to take the model apart to adjust it.
:::

## Tripo P2.0 {{Most used}} {#h-tripo-p20}

Tripo's **lightweight** model: a low polygon count and clean structure, with support for **quads** (the faces most 3D software and animation rigging prefer), so it's ready for games, mobile apps and VR without extra cleanup.

It has less detail than H3.1, but the files are small and easy to work with. Each run costs about 48 Coins.

:::tip Who it's for
People putting models into a game engine or app who care about file size and polygon count.
:::

## Hunyuan3D 3.1 {#h-hunyuan3d}

Tencent's 3D model. It can generate from **a text description**, or from **several images taken from different angles** (front, side, back and so on), giving more faithful objects and characters, and the back is less likely to come out strange.

A single front image works too; the more angles you give, the closer the result gets to what you want.

:::tip Who it's for
People who have photos of the same object from several angles, or who just want to generate 3D from a text description.
:::
`,
},

});
