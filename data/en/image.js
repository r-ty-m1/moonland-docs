// 創作工具：圖片生成（英文版）
(window.ARTICLES_EN = window.ARTICLES_EN || {}) && Object.assign(window.ARTICLES_EN, {

'img-basics': {
  t: 'Image generation basics',
  d: 'Open image generation, choose a model, write prompts, then learn to edit generated images and pick models.',
  body: `
:::tip What you'll learn
Open the image generation screen, choose a model, write effective prompts, then go further and edit the images you've generated.
:::

## Opening image generation

:::steps
@ Click "Generate" in the left menu
@ Switch to "Image" at the bottom of the screen
@ Choose a model
This guide uses "FLUX.2" as the example.
[i 249]
@ Once the generation mode and model are set, you're ready to generate
:::

## Writing a prompt

Type what you want to generate in the prompt field. The more complete the description, the closer the result will be to what you have in mind.

:::warn Use at least two words
The prompt is the most important input the AI uses. Describe it with at least two words, and say specifically which objects should appear.
:::

Not sure what to write? Turn on "Auto prompt enhancement" and the AI rewrites your prompt for the model you chose. See [Prompt assistant](#img-prompt).

> A tabby cat wearing a bamboo hat

> A parrot holding a spoon in its beak

> A beautiful Asian model walking the runway in an evening gown

[i 250]

:::row
[i 251]
|||
[i 252]
|||
[i 253]
:::

### Add a style

> A pixel-art orange cat

> An orange cat in ink-wash painting style

> A watercolor orange cat

:::row
[i 260]
|||
[i 261]
|||
[i 262]
:::

### List the elements you want

Add the elements you want one at a time for a richer image:

> A product shot of a gaming laptop

> A product shot of a gaming laptop, open and floating in mid-air, white background

> A product shot of a gaming laptop, open and floating in mid-air, in a high-tech studio set with neon-blue tones

:::row
[i 263]
|||
[i 264]
|||
[i 265]
:::

## Editing a generated image

To edit an image you've already generated, choose a model that supports editing. FLUX.2 can edit directly.

:::steps
@ Click "Reference image", then "Asset library"
[i 254]
@ Open the "Generated" tab and choose the image you just made
[i 255]
@ Write what to change
For example, turn the tabby cat into a Shiba Inu:
> Change the cat into a Shiba Inu
[i 256]
:::

:::row
[i 257]
|||
[i 258]
|||
[i 259]
:::

## Choosing the right model

Each model has its own strengths. Before generating, check the model's description and other people's work.

:::steps
@ Click the currently selected model
[i 266]
@ Hover over a model and click "Model details"
[i 267]
@ Read the description and sample work
[i 268]
Click any sample to see the prompt another user wrote.
[i 269]
:::

For a comparison of models, see [Image models](#m-image).

## Can't write a prompt? Use "Image to prompt"

If you already have a reference image, click "Image to prompt" in the top-left corner and pick an image from the asset library or upload one. You'll get a prompt that describes it.

[i 270]

:::warn Choose the model before converting
Different models work differently. Switch to the model you plan to use before running Image to prompt, so the prompt suits that model best.
:::

[i 271]

## FAQ

:::faq
?? What if I can't get the look I want?
Try "Auto prompt enhancement" first. You can also work in stages: generate the subject first, then add other effects by editing with "Reference image".
:::
`},

'img-prompt': {
  t: 'Prompt assistant',
  d: 'Translate, Image to prompt, Refine prompt and Auto enhancement: four tools that help you write better prompts.',
  body: `
Below the prompt field are several small tools you can combine to fill in details when you're short on ideas or your description is incomplete. They work in both Chinese and English.

[i 238 The toolbar below the prompt field]

| Tool | What it does | When to use it |
| --- | --- | --- |
| [Translate](#h-translate) | Translates Chinese into English without any rewriting | You want to keep your own wording exactly |
| [Image to prompt](#h-img2prompt) | Turns an image into a prompt suited to the current model | You have a reference image and want something similar |
| [Refine prompt](#h-refine) | Say in one sentence what to change and the AI rewrites the whole prompt | You don't like the result and want a quick adjustment |
| [Auto enhancement](#h-auto) | Translates and improves the prompt in one click and adds LoRA trigger words | Recommended in most cases |

:::note
Which tools are available depends on the model. "Translate" currently appears in the Lab; video models don't offer Image to prompt.
:::

## Translate {#h-translate}

Translates the Chinese you typed into English. The AI doesn't optimize or change anything else.

:::row
[i 452]
|||
[i 453]
:::

:::note
If your prompt contains Chinese text that must stay as is (for example words that should appear in the image), type it back in after translating.
:::

## Image to prompt {#h-img2prompt}

Turns an image into a prompt suited to the current model. Use it to generate images on a similar theme, or convert an image before editing it and then tweak the text for more reliable results.

[i 239]

After clicking the tool icon, choose **Asset library** or **Upload image**:

[v 240]

:::tip
To keep the composition or a particular feel, combine it with "Start image" or "Reference image".
:::

## Refine prompt {#h-refine}

Prompts generated by the system are often long and complex. Instead of hunting for the words to change, just write what you want adjusted and the AI rewrites the whole prompt and generates again.

[i 241]

:::row
[i 242]
|||
[i 243]
:::

:::warn This isn't image editing
Refine prompt regenerates the whole image, so it may look very different. To keep the composition, use "Start image" or "Reference image" instead.
:::

## Auto enhancement {#h-auto}

Translates and optimizes in one click so the model understands you more accurately. **It's off by default; turn it on yourself.**

[i 244]

When it's on, it will:

- Rewrite the prompt as a natural description suited to the current model
- Add trigger words for the LoRA you selected
- Translate Chinese into English

[i 245]

:::row
[i 246 Auto enhancement on]
|||
[i 247 Auto enhancement off]
:::

After generating, you can see the enhanced prompt in the image info:

[v 248]

## FAQ

:::faq
?? The rewritten result is very different from what I imagined.
Making several small changes gets you closer step by step than entering lots of adjustments at once.

?? I wrote in Chinese and the result is a bit off.
Auto enhancement translates the prompt into English, and the meaning can drift a little. Type key terms (such as style or character names) directly in English.
:::
`},

'img-upscale': {
  t: 'Upscaling (SeedVR2)',
  d: 'Redraw blurry images at 4K or 6.8K and bring back detail in faces, clothing and flowers.',
  body: `
Generated an image you love but it isn't sharp enough? Upscaling redraws the details while enlarging the canvas, making your work suitable for print or commercial use.

[i 234 Original, 4K and 6.8K compared]

| Area | Original | 4K | 6.8K |
| --- | --- | --- | --- |
| Face | Film-grain texture; eyes and lip line are blurry | Features clearly rebuilt, eyes bright, lashes sharp, noise removed | More three-dimensional lighting, clearer contours of eyes and lips, very smooth skin |
| Clothing | Plaid detail hidden under noise, looks flat | Sharp plaid lines, visible rough wool texture, fluffier scarf | Scarf detail stands out more |
| Bouquet | Loose rose edges, unclear layers | Crisp petal edges, natural deep-red shadows | Same as 4K, finer |

## Steps

:::steps
@ Choose the SeedVR2 model
[i 235]
@ Upload the image to upscale
[i 236]
@ Choose the quality
- **4K ultra HD**: balances sharpness and file size; good for social media
- **6.8K maximum detail**: commercial photography resolution; good for print or large screens
@ Generate
[i 237]
:::

:::warn Costs a lot of credits
Upscaling costs far more than normal generation. Only use it on images you're sure you want to keep.
:::

## How it works

Upscaling regenerates detail rather than simply stretching pixels. It fills in or repairs blurry areas while increasing the canvas size.

## FAQ

:::faq
?? After upscaling the composition changed — the subject moved or details disappeared.
Upscaling always involves regenerating, so some changes are expected. Filling in or repairing blurry details is itself a change.
:::
`},

'img-outpaint': {
  t: 'Outpainting',
  d: 'Extend the canvas and generate the scene beyond the original, completing images that are cropped or cramped.',
  body: `
When an image is too tight or the subject is cut off, extend the canvas and let the AI generate what lies outside the original.

:::row
[i 211 Original]
|||
[i 212 Outpainted]
:::

:::steps
@ Choose the model and image
Click "Generate" on the left, switch to "Image" at the bottom, choose "FLUX.2 [Klein]", then upload the image to extend.
[i 213]

@ Set up the expanded canvas
Hover over the image and click "Expand canvas". Use the **left, right, top and bottom margins** to choose which way to extend; the blank area is what will be generated. Click "Apply" when you're done.
:::row
[i 214]
|||
[i 215]
:::
:::tip Don't extend too far at once
Large areas are prone to errors. Extend outward a little at a time over several rounds.
:::

@ Apply the asset ratio and write a prompt
This step matters most, so check each setting:
1. Open the options in the bottom-right of the image and click "Apply asset ratio"
[i 216]
2. Enter the prompt:
> Extend the white area based on the content of the original image
3. Turn on "Auto prompt enhancement" in the top-right corner
[i 217]
You can also click "Convert to prompt" under "More options" so the AI refers to the original image, or add other descriptions to change the image, such as "change the action to pouring milk".
[i 218]

@ Check, then generate
Make sure the prompt has been converted and the size matches the current image, then click Generate.
:::

:::row
[i 219]
|||
[i 220]
:::

## FAQ

:::faq
?? The extended area looks very different in style from the original.
Use "Convert to prompt" so the AI refers to the original image.

?? The proportions are wrong after outpainting.
Always set up the expanded canvas first and then click "Apply asset ratio". Doing it the other way round throws the ratio off.

?? The extension looks unnatural, or the conversion failed.
Make sure the prompt clearly says to "extend based on the original image".

?? Can I extend in only one direction?
Yes. Adjust only that side's margin and leave the others at 0.

?? The extended content doesn't look continuous.
The prompt may not be tied to the original image, or you extended too much at once. Use "Convert to prompt" first and extend in several rounds.
:::
`},

'img-rotate': {
  t: 'Rotating the viewpoint',
  d: 'Pan the camera, rotate the angle or switch focal length with text instructions — for character turnarounds and multi-angle product shots.',
  body: `
"2059 Multi Angle" is a LoRA made for Qwen Edit that changes an image's angle from simple text: pan the camera, rotate the angle or switch the focal length.

Common uses:

- Character turnarounds
- Adjusting the camera position
- Multi-angle product shots

:::row
[i 221]
|||
[i 222]
|||
[i 223]
:::

## Steps

:::steps
@ Choose the Qwen Edit model
Qwen Edit is built for fine-tuning existing images, making local changes while keeping the overall picture. Find "Qwen Edit" under "Choose generation tool".
[i 224]

@ Apply the LoRA
Click "LoRA" and apply "2059 Multi Angle".
[i 225]

@ Add a reference image and enter an instruction
Put the image you want to change into Qwen Edit's reference image, then type an instruction.
[i 226]
You can also click the LoRA and use the sliders to control the camera; the trigger words appear in the prompt box automatically.
[i 227]

@ Generate
:::

### Example instructions

| What you want | Instruction |
| --- | --- |
| Move forward or back | Move the camera forward / back |
| Move left or right | Move the camera left / right |
| Rotate | Rotate the camera 45 / 90 degrees to the left / right |
| Change the viewpoint | Switch to a top-down view |
| Change the focal length | Switch to a wide-angle lens; switch to a close-up |

:::row
[i 228]
[i 229]
[i 230]
|||
[i 231]
[i 232]
[i 233]
:::

:::tip
The reference image works best when it shows the whole person or object.
:::

## FAQ

:::faq
?? The image doesn't change after the instruction, or it's badly distorted.
Make sure the "2059 Multi Angle" LoRA is applied. The reference image should show the whole person or object, and the background shouldn't be too busy.

?? How do I ask for a back view?
"Turn the character to a back view" works better than "rotate the camera 180 degrees", which is often read as flipping the image upside down. Extreme angles may change the composition, so generate a few and pick the best.

?? Can I move the camera and change the focal length at the same time?
Yes, for example "move the camera left and switch to a close-up". But the more instructions, the bigger the change, so start with one.

?? I wanted to turn 90 degrees to the right, but the image just rotated 90 degrees clockwise.
"Pan the camera 90 degrees to the right" works better. In other words, change "Rotate the camera 45 degrees to the right" to "Pan the camera 45 degrees to the right".
:::
`},

});
