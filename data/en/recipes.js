// 學習資源：應用範例（英文版）
(window.ARTICLES_EN = window.ARTICLES_EN || {}) && Object.assign(window.ARTICLES_EN, {

'chat-recipes': {
  t: 'Chat cookbook',
  d: 'Starting from one image: text designs, outfit swaps, pose templates, scene swaps, stylization and prompt tips.',
  body: `
Chat lets you create and edit images in plain language, and it can do a lot. This guide starts from your first image and walks through changing outfits, adjusting poses, swapping scenes and stylizing.

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

### Practice material

Scan the QR code to download free practice material:

[i 335]

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
`},

'pvc': {
  t: 'PVC figure style',
  d: 'Turn personal photos, anime characters or historical figures into PVC figure product shots, with Chinese and English prompts.',
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
`},

'logo': {
  t: 'Logo design',
  d: 'No design background needed: define your brand colors and style through conversation and generate your own logo.',
  body: `
No design background needed — chat with the AI to define your brand's colors and style and generate your own logo.

:::row
[i 515]
**Theme**: baseball team crest
**Elements**: interwoven blue and red lines forming a wolf's outline, with a yellow lightning bolt at the corner of the eye
**Style**: 2D vector lines, minimalist
**Use**: sports brand identity
|||
[i 516]
**Theme**: dynamic coffee cup
**Elements**: flowing lines shape the cup, with silky curves of aroma rising from the rim
**Style**: modern vector illustration
**Use**: café identity, takeaway cup design
|||
[i 517]
**Theme**: W Art hair scissors company
**Elements**: a pair of hairdressing scissors decorated with teal feathers, light and lively
**Style**: digital art, hyper-realistic
**Use**: flagship salon logo, brand image
:::

Open Chat; you can use the "Z-Image Turbo" model:

[i 518]

:::steps
@ Describe your idea
Write your logo idea in the message box — the better the description, the better the result. Not sure what to say? Use the template below and replace the parts in quotation marks:
[i 519]
> Create a professional logo design. Its main visual elements are "brand name, main symbol, colors, elements and so on".
> The design style is "style", and overall it should be "extra details", with a vector-graphic look.
> Use flat design, simple geometric shapes, clean bold lines and high contrast.
> Center the logo on a pure white background so it looks like a scalable vector graphic suitable for a professional brand.
Styles to consider: minimalist, flat, modern geometric, hand-drawn illustration, luxury, retro, art deco, futuristic, abstract, dynamic.

@ Generate
Choose a model (or use the default) and click Generate.

@ Keep the style with "Generate more"
To try more versions, click "Generate more" to the right of a result and it will keep generating in a similar style.
[i 520]
:::note
"Generate more" only works on the most recent result. For finer adjustments, use "Generate" or the "Lab".
:::
:::

## FAQ

:::faq
?? How do I get the brand name on the logo?
Write it in the prompt, or add the text afterwards with [editing](#chat-edit).

?? I want several versions in a consistent style.
Keep using the same prompt, or add a sample image of that style as a reference, and generate several times.

?? Can I use an AI-generated logo commercially as-is?
Not necessarily. We recommend recreating it in other software after downloading, or redrawing it in vector software once it's final, so you fully own the copyright.

?? The result is very different from what I imagined.
- Describe it more clearly, adding colors and adjectives
- Provide a sample reference image
- Generate several times, pick the closest version and edit it by hand
:::
`},

'outfit': {
  t: 'Changing outfits',
  d: 'Dress a person in specific clothes: upload, crop and instruct in three steps, plus tips to avoid wrong proportions.',
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
`},

'face-swap': {
  t: 'Face swap on famous paintings',
  d: 'Use Qwen Edit with the Best Face Swap LoRA to put a real person’s face onto a famous painting.',
  body: `
Can you imagine the Mona Lisa's smile on someone else? To put a real person's photo onto a famous painting, use Qwen Edit with the "BFS - Best Face Swap" LoRA.

[i 442]

:::steps
@ Turn on Reference Latent
Turn on "Reference Latent" in the "Image" options. The base model then switches to and locks on Qwen Image Edit 2509.
[i 443]
Upload the face to use and the subject whose face will be replaced:
[i 444]

@ Turn on the LoRA
Click "LoRA" to open the picker, and untick "Featured only" on the right to find "BFS - Best Face Swap".
:::row
[i 445]
|||
[i 446]
:::

@ Write a prompt and generate
> Swap the face from image 1 onto the face in image 2
[i 447]
:::

## FAQ

:::faq
?? The result looks nothing like the person — more like a new character.
:::row
[i 448 Expected]
|||
[i 449 Actual result]
:::
The prompt may not be precise enough. Add details about the person's features and try again.

?? It changed too much. How do I keep it closer to the original?
Adjust the LoRA's weight. The default is 1.2; raise it to around 1.4 to look more like the face, or lower it to around 0.9 for a bigger difference.
[i 450]
:::
`},

});
