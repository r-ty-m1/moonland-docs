// 英文翻譯：創作工具（AI 翻譯，2026-11-23，對照正式網站當天的中文）
// 伺服器啟動時，還沒有英文版的頁面會匯入成「英文草稿」（server/editor.js 的 importEnSeed），要有人看過、取消草稿才公開
// 匯入之後以編輯後台為準，改這個檔案不會影響已經匯入的頁面；這個檔案不對外提供
// src 是翻譯時中文的簽章（model.js 的 zhSig）：中文之後改過，後台會標「英文待更新」
// 名稱照 moonland.ai 本站英文版（data/en/terms.json）：點數 Points、登月幣 Coins、交談 Chat、實驗室 Lab、社群藝廊 Gallery
(window.EN_SEED = window.EN_SEED || { pages: {}, sections: {}, groups: {} });
Object.assign(EN_SEED.pages, {

"chat": {
  src: "cddc104b", t: "Chat",
  d: "Create images, videos, music and 3D models just by chatting in plain language — the AI assistant picks the model for you. The best place to start if you are new.",
},

"chat-intro": {
  src: "953d2404", t: "Introduction to Chat",
  d: "Create images, videos, music and 3D models by chatting. The AI assistant picks a suitable model for you.",
  body: `
Chat is designed for people who are new to generative AI. Describe what you want the way you'd normally talk, and the AI assistant works out what you need and picks the best model to generate it.

[i 521 The Chat interface]

## What Chat can do

- **Many kinds of media**: generate images, videos, music and 3D models
- **Plain-language descriptions**: just describe it; the AI assistant decides which model to use
- **Edit existing material**: upload an image or video and change it directly. See [Editing & compositing](#chat-edit)
- **Talk it through**: when something is unclear, the AI assistant suggests options and asks what you think. You can also ask it questions about generation

:::note Limits
- One message can include up to **9 images + 1 video**
- Each message uses **2 "AI assistant Points"**; the actual generation is charged at each tool's normal price
:::

## Every regeneration is different

Chat is meant for trying lots of ideas early on, so each regeneration gives a very different result. If you only want to change part of an image, use [editing](#chat-edit) instead of regenerating.

## Managing conversations

When you start a new topic, create a new chat from the toolbar on the left, or rename a chat so you can find it again later.

:::tip Very long chats can run into errors
If you hit an error, starting a new chat usually fixes it.
:::

:::warn Deleting can't be undone
Once you delete a chat, the content and images generated in it can't be recovered. Make sure you've saved the files you need first.
:::

[i 555 Chat list and management options]

## Next steps

- [Writing prompts](#chat-prompts): learn to describe images, text designs, videos and music
- [Chat settings](#chat-settings): have the AI remember your preferences
`,
},

"chat-prompts": {
  src: "03ae7e47", t: "Writing prompts",
  d: "Formulas and copy-ready examples for describing images, Chinese and English text designs, videos and music in Chat.",
  body: `
The prompt is the most important input the AI uses. Whatever you're generating, **use at least two descriptive words** and say specifically what you want.

## Images

Describe three aspects:

| Aspect | What to include |
| --- | --- |
| Subject | People, animals, objects, actions, expressions, appearance |
| Scene | Setting, background, time of day, weather, mood |
| Image | Composition, viewpoint, lighting, color, art style, details, aspect ratio |

> An orange kitten using a vacuum cleaner, 1:1

> A glamorously dressed model walks a runway down the street on a drizzly evening; passers-by stop and stare at her in surprise, 4:3

:::row
[i 522]
|||
[i 523]
:::

The fuller the description, the richer the image:

> A detailed watercolor of a medieval street. Old stone buildings and wooden shops line both sides of the cobbled street, with people coming and going. Clear blue sky and warm sunlight, bright and soft colors, delicate brushwork with the bleeding texture of hand-painted watercolor. Wide-angle view, rich scene detail, landscape 16:9

[i 524]

## Chinese and English text designs

Chat can generate text designs in Chinese and English, and the AI assistant automatically picks a model that's good at text. Put the text you want in quotation marks:

> Create a Chinese text design of "床前明月光，疑是地上霜"

> Create a Chinese lettering design for the character "龍"

> Create an English text design of "One giant leap for mankind"

:::row
[i 525]
|||
[i 526]
|||
[i 527]
:::

:::note
Text generation currently supports Chinese and English only.
:::

## Video

| Element | Description |
| --- | --- |
| Subject | The main character's appearance and features |
| Action | What the subject is doing, or small changes |
| Background | The setting or scene |
| Background motion | Small movements or changes in the surroundings |
| Camera movement | Pans, push-ins, pull-outs, orbits and other camera moves |
| Length | 5 seconds by default, up to 15 seconds |

> A Shiba Inu drops the bomb from its mouth and blows up a castle, 1:1

> A giant transparent jellyfish floats above a city of flickering neon, with a galaxy flowing between its tentacles; dreamy, surreal, slow camera, 1:1

:::row
[v 528]
|||
[v 529]
:::

> A kitten in a spacesuit looks into the camera, senses a meteor falling behind it, turns around and looks at the meteor. The background is the Moon; suddenly a meteor hits the lunar surface and explodes, throwing up dust and flames. The camera starts focused on the kitten, then racks focus to the meteor in the background when it arrives, 16:9, 10 seconds

[v 530]

## Music

Chat can also generate songs, background music (BGM) and sound effects. Describe two things: the lyrics and the style.

**Lyrics**: split them into sections with tags such as [Intro], [Verse], [Pre-Chorus], [Chorus], [Bridge], [Outro], [Instrumental] and [Solo]. This helps the AI understand the song's structure.

**Style**: you can describe the feel simply, or go into detail:

| Item | Examples |
| --- | --- |
| Genre | Hip hop, J-pop soft rock, jazz, blues, classical, electronic, lo-fi, R&B, folk, heavy metal, reggae, funk |
| Mood | Upbeat, sad, romantic, lonely, tense, mysterious, dreamy, oppressive, soothing, fired-up, eerie |
| Era / flavor | 80s, 90s, retro, Showa-era, cyberpunk, anime, game soundtrack |
| Instruments | Piano, guitar, drum kit, strings, synthesizer, acoustic guitar, saxophone |
| Vocals | Male, female, choir, deep voice, ethereal female, youthful, metal growl |
| Key | Minor (mysterious, heavy, sad) or major (happy, positive, cheerful) |
| Length | 200 seconds by default, from 60 seconds up to 6 minutes 20 seconds |

:::note About length
Chat currently generates music with Stable Audio 3.0 or YuE2, and YuE2 can't set a length. For the differences between models, see [Points music models](#m-music).
:::

> A light drum and bass track

> Japanese rock, dark, oppressive and gloomy, with piano, distorted electric guitar, bass and drums as the main instruments, minor key, 2 minutes 30 seconds

:::row
[i 531]
[a 582]
|||
[i 532]
[a 583]
:::

For more precise results, write out what you want in each section and include the lyrics:

> Japanese folk rock with a wafu flavor; a sentimental, surging, cold and eerie atmosphere. Koto, shakuhachi, electric bass and taiko lead, combining a hauntingly beautiful melody, fast plucking, airy breathy vocals and heavy, fierce drumming. A cute, clear, powerful female lead vocal, with screams added in the chorus and climax. Minor key; the emotion builds from restraint into frenzy and explosion.

:::details Lyrics example (Japanese — paste it right below the style prompt)
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

:::row
[i 533]
|||
[a 584 Result]
:::

## When the result isn't right

Every regeneration in Chat can differ a lot. If you only want to change part of the result, use [editing](#chat-edit) instead; for more techniques, see the [Chat cookbook](#chat-recipes).
`,
},

"chat-edit": {
  src: "0296b40f", t: "Editing & compositing",
  d: "Keep the overall image and change only part of it, replace a character or background, combine several images, or make a character copy the motion in a video.",
  body: `
In Chat you can keep a whole image and change just one element, or keep the character and change only the background or style, moving step by step toward the image you have in mind.

- Replace or fix a specific character in the image
- Keep the character and change the background or style
- Add Chinese or English text designs to the image

## Example 1: Keep describing changes

First, generate an image:

> A white mechanical watch with an exquisite dial design, in a high-tech photo studio, refined professional product advertising photography, 1:1

[i 534]

If the result isn't quite right, or you have a new idea, keep describing what to change in the same conversation:

[i 535]

> Set the background to a kid's bedroom

> A kid's bedroom with a large floor-to-ceiling window

> Change the aspect ratio to 3:4 and make the watch bigger in the frame

:::row
[i 536]
|||
[i 537]
|||
[i 538]
:::

## Example 2: Upload your own image to edit

:::steps
@ Add the image to edit
Click "+" in the message box and choose from the **Asset library** or **Upload image**. Once added, Chat switches to edit mode automatically.
:::row
[i 503]
|||
[i 504]
:::
If needed, click "Current model" on the right to change the model. Usually the default is fine.
[i 505]

@ Say what to change
State clearly what to change and what it should look like.
[i 541]
> Replace the character with a frog astronaut

> Replace the background with an amusement park

> Add metallic English lettering "Moonland" to the background
:::

:::row
[i 542]
[i 543]
|||
[i 544]
[i 545]
:::

## Example 3: Combine several images

You can combine elements from up to **9 images** into one picture.

[i 546]

:::steps
@ Add all the images you need
Click "+" and add the images one by one. The upload order sets the image numbers: from left to right they are image 1, image 2, and so on.

@ Refer to the images by number
Use "image 1", "image 2" to say what each image is for, so the AI understands correctly.
[i 547]
:::

:::tip Two at a time works best
You can add up to 9, but changing things using two images at a time gives the most reliable results.
:::

## Example 4: Edit, composite or copy motion with a video

You can attach up to **9 images + 1 video**. This dance video is used in the examples below:

[v 548]

**Change the character and scene with text only**: after adding the video, write which character and scene you want instead.

:::row
[i 549]
|||
[v 550]
:::

**Change the character and scene with reference images**: add the video, a character reference and a scene reference together, and use "reference image / video 1, 2, 3" (in upload order) to say what each is for. You can also add camera or scene changes to the prompt.

:::row
[i 551]
|||
[v 552]
:::

:::row
[i 553]
|||
[v 554]
:::

## Related guides

- [Changing outfits](#outfit): the full outfit-swap process and cropping tips
- [Chat cookbook](#chat-recipes): pose templates, scene swaps and stylization
`,
},

"chat-settings": {
  src: "d3d43bcc", t: "Chat settings",
  d: "Use \"Personal instructions\" so the AI remembers your preferences, and choose which tools it may use.",
  body: `
Repeating your preferences in every new chat gets tedious. Add "Personal instructions" under **Settings > Chat** and the AI will remember how you like to work. You can also choose which tools the AI may use here (Coin tools need to be enabled separately).

:::steps
@ Open Settings
Click the bottom-left corner and find "Settings".
[i 71]

@ Choose "Chat"
[i 72]

@ Write your personal instructions
List your preferences, then click "Save".
> Default aspect ratio 1:1
> Prefer a realistic style
> Prefer tools that use fewer Points
> Use LTX 2.5 for first & last frames
[i 73]
[i 74]

@ Check the other settings
We recommend keeping the defaults:
- **Auto-approve small generations**: Points tools are used first by default. Any single generation over 100 Points, or any generation that uses Coins, will ask you to confirm first
- **Generation tools**: choose which tools the AI may use
[i 75]
:::

## What changes after setup

**Example 1**: with just a description, the AI picked the cheapest realistic model and generated at 1:1.

:::row
[i 76]
|||
[i 77]
:::

**Example 2**: drag an image into the message box below and type a prompt.

:::row
[i 78]
|||
[i 79]
:::

**Example 3**: following the personal instructions, the AI used LTX 2.5 to make a first-and-last-frame video. Because this one costs more than 100 Points, the system asks you to confirm first; generation starts when you click Send.

[i 80]
[v 81]
`,
},

"image": {
  src: "e94c2c7e", t: "Image generation",
  d: "Generate AI images from text or reference images, then upscale, outpaint, rotate the viewpoint or edit them.",
},

"img-basics": {
  src: "f34890f5", t: "Image generation basics",
  d: "Open image generation, choose a model, write prompts, then learn to edit generated images and pick models.",
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

For a comparison of models, see [Points image models](#m-image).

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
`,
},

"img-prompt": {
  src: "73055298", t: "Prompt assistant",
  d: "Translate, Image to prompt, Refine prompt and Auto enhancement: four tools that help you write better prompts.",
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

Translates in one click so the model can optimize your prompt. **It's on by default; turn it off yourself.**

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
`,
},

"img-upscale": {
  src: "f757c46d", t: "Upscaling (SeedVR2)",
  d: "Redraw blurry images at 4K or 6.8K and bring back detail in faces, clothing and flowers.",
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

:::warn Costs a lot of Points
Upscaling costs far more than normal generation. Only use it on images you're sure you want to keep.
:::

## How it works

Upscaling regenerates detail rather than simply stretching pixels. It fills in or repairs blurry areas while increasing the canvas size.

## FAQ

:::faq
?? After upscaling the composition changed — the subject moved or details disappeared.
Upscaling always involves regenerating, so some changes are expected. Filling in or repairing blurry details is itself a change.
:::
`,
},

"img-rotate": {
  src: "97f69233", t: "Rotating the viewpoint",
  d: "Pan the camera, rotate the angle or switch focal length with text instructions — for character turnarounds and multi-angle product shots.",
  body: `
"2509 Multi Angle" is a LoRA made for Qwen Edit that changes an image's angle from simple text: pan the camera, rotate the angle or switch the focal length.

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
Click "LoRA" and apply "2509 Multi Angle".
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
Make sure the "2509 Multi Angle" LoRA is applied. The reference image should show the whole person or object, and the background shouldn't be too busy.

?? How do I ask for a back view?
"Turn the character to a back view" works better than "rotate the camera 180 degrees", which is often read as flipping the image upside down. Extreme angles may change the composition, so generate a few and pick the best.

?? Can I move the camera and change the focal length at the same time?
Yes, for example "move the camera left and switch to a close-up". But the more instructions, the bigger the change, so start with one.

?? I wanted to turn 90 degrees to the right, but the image just rotated 90 degrees clockwise.
"Pan the camera 90 degrees to the right" works better. In other words, change "Rotate the camera 45 degrees to the right" to "Pan the camera 45 degrees to the right".
:::
`,
},

"video": {
  src: "aa84430a", t: "Video generation",
  d: "Generate AI videos from text, images or video, and control motion paths, first and last frames, motion transfer and merging.",
},

"v-basics": {
  src: "a82610a5", t: "Video generation basics",
  d: "Text to video (t2v): the interface, how to structure prompts, and resolution, aspect ratio and length settings.",
  body: `
Just type some text and turn the picture in your head into a video — from the grand scenes of a fantasy world to the subtle emotion in a character's eyes.

:::warn Before you start
- You can generate up to **2** videos at a time (image generation isn't affected)
- Video generation uses a lot of Points, so use it wisely
:::

## Opening video generation

:::steps
@ Click "Generate" in the left menu
@ Switch to "Video" at the bottom of the screen
@ Choose a model
This guide uses "MiniMax H3" as the example.
[i 272]
:::

Text to video doesn't need an image; the text alone drives the generation.

[i 273]

## Writing a prompt

Precise, detailed descriptions, cinematic language, timing and pacing, mood and even sound cues all help the AI produce the shot you want. We recommend this structure:

| Part | Content | Example |
| --- | --- | --- |
| Character | Situation, main character, action, emotion, style | A famous actress weaving through a busy street, sunglasses in hand, tense but composed, realistic fashion style |
| Background | Time, weather, theme | Dusk, light rain, a theme of chase and escape |
| Camera | Viewpoint, effects, pacing, photographic look | Handheld camera, raindrop bokeh, fast cutting, film grain |

Write these elements as one paragraph:

> A famous actress weaves through a busy street, sunglasses in hand, tense yet composed, in a realistic fashion style. It is dusk and light rain is falling, creating a mood of chase and escape. The camera is handheld, with bokeh from the raindrops, fast-paced cutting and fine film grain.

[v 274]

## Resolution, aspect ratio and length

[i 275 The toolbar at the bottom]

| Setting | Notes |
| --- | --- |
| Resolution | 480P or 720P. Start with 480P; resolution affects the cost |
| Aspect ratio | The output's width-to-height ratio. 16:9 by default; it affects the result |
| Length | MiniMax H3 can be set from 5 to 15 seconds; length affects the cost |

## FAQ

:::faq
?? The result is very different from my prompt.
Complex or vague descriptions are easily misread. Use the "character + background + camera" structure and try a few versions.
:::

## More video features

- [Image to video (i2v)](#v-i2v)
- [Video to video (v2v)](#v-v2v)
- [First & last frames](#v-frames)
- [Prompt assistant](#img-prompt)
`,
},

"v-i2v": {
  src: "73c4f0df", t: "Image to video (i2v)",
  d: "With one image, make a character blink, turn their head or dance, and add background motion and camera moves.",
  body: `
With a single image you can make the character blink, turn their head, smile or even dance, add wind or changing light in the background, and design push-ins, pull-outs and orbiting camera moves.

:::row
[i 436 Original image]
|||
[v 437 Generated video]
:::

:::warn Before you start
- You can generate up to **2** videos at a time (image generation isn't affected)
- Video generation uses a lot of Points, so use it wisely
:::

[i 438]

:::steps
@ Choose an image
Upload your own, or pick one from the **Asset library**.

@ Describe the motion you want
Include these elements:
- **Subject**: the main character's appearance and features
- **Action**: what the subject is doing, or small changes
- **Background**: the setting or scene
- **Background motion**: small changes in the surroundings
- **Camera movement**: pans, push-ins, pull-outs, orbits and so on
:::note
Even with an image uploaded, briefly describe the subject too. Writing only the action isn't recommended.
:::
[i 439]
> A kitten in a spacesuit looks into the camera, senses a meteor coming from behind, turns around in surprise and looks at the meteor. The background is the Moon; suddenly a meteor hits the lunar surface and explodes, throwing up dust and flames. The camera starts focused on the kitten, then racks focus to the meteor in the background when it arrives.
[v 440]

@ Adjust resolution, aspect ratio and length
[i 441]
- **Resolution**: 480P or 720P. Start with 480P (affects the cost)
- **Aspect ratio**: 16:9 by default; it affects the result
- **Length**: MiniMax H3 can be set from 5 to 15 seconds (affects the cost)
:::

## FAQ

:::faq
?? Can I generate several videos at once?
Currently up to 2 at a time. Video takes a while, so you can work on images while you wait.
:::

## More control

- [Motion path control](#v-path): draw arrows to set the direction objects move
- [First & last frames](#v-frames): set both the opening and closing shot
`,
},

"v-v2v": {
  src: "03489c30", t: "Video to video (v2v)",
  d: "Keep the motion and rhythm of the original video while remaking the look, swapping the character or applying a style — one video can become hundreds.",
  body: `
When you don't like the look of a video but want to keep its motion or rhythm, use video to video. You can borrow the movement from a popular clip, or turn live-action motion into animation, illustration, realism, a cinematic look, anime and many other styles.

Common uses:

- Remake a video's look and style
- Make a character perform specific moves
- Recreate meme videos
- Capture real human motion

:::warn Before you start
- You can generate up to **2** videos at a time (image generation isn't affected)
- Video generation uses a lot of Points, so use it wisely
:::

Switch to "Video" mode and choose "MiniMax H3" under "Choose generation tool":

[i 470]

:::steps
@ Add a reference video
Click "Reference video" at the bottom to upload a video.
[i 471]
:::row
[i 472]
|||
[v 473 Source video]
:::
:::note
If needed, you can also add "Reference image" or "Reference video 2". You can use up to **9** reference images and up to **3** reference videos.
:::

@ Choose a method
There are three ways to use it:
| Method | Effect |
| --- | --- |
| Prompt only | Describe a new scene in text and apply the original video's motion |
| Reference image | Use an image to set the character and style, with the original video's motion |
| Reference video | Use another video to set the character and motion, placed into the original video's background |

@ Adjust resolution, aspect ratio and length (optional)
[i 482]
- **Resolution**: 480P or 720P; 720P uses a lot of Points
- **Aspect ratio**: adjust with the slider
- **Length**: 5 to 15 seconds, 5 seconds by default
:::

## Examples of the three methods

### Prompt only

> A Pomeranian astronaut walking with an umbrella

[i 474]
[v 475]

### Reference image + prompt

> A space cat is out for a walk when a lizard suddenly darts in from the right, jumps onto the space cat's umbrella, then leaps straight off and disappears to the left.

:::row
[i 476 Reference material]
|||
[i 477]
:::

[v 478]

### Reference video + prompt

> The boy from reference video 2 walks forward in the scene from reference video 1

:::row
[v 479 Reference material]
|||
[i 480]
:::

[v 481]

:::tip
You can leave the prompt empty or use it to add details. When there are several assets, they are numbered 1, 2, 3… from left to right.
:::

## FAQ

:::faq
?? Strange glitches appear in the video.
Try generating again, re-uploading, or adjusting the settings and generating again.

?? The result is very different from my prompt.
For more precise control, turn off AI prompt enhancement, write in English, or adjust the settings and try again.

?? Generation takes too long or doesn't work.
Video generation takes a lot of computing power and time; you can do other work while you wait. If it won't generate, the content may break platform rules — check the usage policy first, since violations can lead to account suspension. Also check your Points balance and avoid peak hours. If it keeps failing, [contact us](#contact).
:::
`,
},

"v-path": {
  src: "73dfb5f3", t: "Motion path control",
  d: "Draw arrows on the image to set the direction and path a character or background object moves.",
  body: `
Before generating a video, draw motion paths on the image to set exactly where a character, the camera or background objects should move.

Common uses:

- Move a character or object in a specific direction
- Move objects in the background

[i 408]

:::warn Before you start
- You can generate up to **2** videos at a time (image generation isn't affected)
- Video generation uses a lot of Points, so use it wisely
- For the basic image-to-video process, read [Image to video (i2v)](#v-i2v) first
:::

:::steps
@ Upload an image and find "Control"
After uploading the source image, find "Control" in the toolbar on the right.
[i 409]

@ Choose "Motion path"
"Control" has five modes:
| Mode | Use |
| --- | --- |
| None | The default |
| First & last frames | Set the closing shot. See [First & last frames](#v-frames) |
| Reference video | Use another video as a reference, such as a dance meme |
| Motion path | Set the direction objects move and fix details in the video |
| Camera movement | Combine different camera moves freely and adjust the speed |
Choose "Motion path" from the drop-down.
:::row
[i 410]
|||
[i 411]
:::
:::note
"Motion path" is the only mode that doesn't support text to video; it always needs a source image.
:::

@ Edit the path
Click "Edit motion path" to open the editor, then click "Add motion path":
- The **tail** marks the object to move (the starting point)
- The **head** shows the direction of movement
- The point on the dashed line in between adjusts the **curve**
- **Green** is the path you're editing; **red** paths are finished
"Delete selected" removes the selected green path; "Delete all" clears every path.
:::row
[i 412]
After clicking "Apply", you'll see the path under "Control".
|||
[i 413]
:::

@ Generate
:::

:::warn When paths tend to fail
When there are **more than 2 paths**, they point in **opposite directions**, or the **object to move isn't clear** (for example the ground or the sky).
:::

## How to draw paths

The examples below are for reference only; results aren't guaranteed.

### Moving a character

Put the tail on the subject: the character follows the path while the camera and background stay still. For example, put it on the nose and the whole head moves, led by the nose.

:::row
[i 414]
|||
[v 415]
:::

### Moving a background object

Put the tail on a background object: the object follows the path while the subject and camera stay still.

:::row
[i 416]
|||
[v 417]
:::

### Moving several objects

You can control several at once, but avoid too many paths, opposite directions or unclear objects.

:::row
[i 418]
|||
[v 419]
:::

### Examples that fail

:::row
[i 420 Too many paths]
|||
[v 421]
:::

:::row
[i 422 Opposite directions]
|||
[v 423]
:::

:::row
[i 424 Unclear object]
|||
[v 425]
:::

## FAQ

:::faq
?? The character moves the opposite way to what I drew.
Check that the head is the direction and the tail is the start. If it's reversed, drag to flip it or redraw it in the editor. The system may also have read it as a camera move; nudging the tail's position usually fixes it.

?? Can I control a character, the background and the camera at the same time?
We don't recommend controlling more than 2 objects at once; the paths may stop working.

?? There are too many paths and it's a mess. How do I start over?
In the editor, use "Delete selected" to remove one path, or "Delete all" to clear everything and redraw.

?? I can't see the path in the generated video.
That's normal. The path only guides generation and doesn't appear in the video. If you need it, take a screenshot in the editor.
:::
`,
},

"v-frames": {
  src: "703bf60f", t: "First & last frames",
  d: "Set the opening and closing shots of a video and let the AI fill in the motion and transition in between.",
  body: `
Use first and last frames to set the video's **opening shot (first frame)** and **closing shot (last frame)**, and the AI generates the transition in between. Going from storyboard to finished clip becomes much faster.

[v 313]

Common uses:

- **Fill in storyboard motion**: give the start and end poses and the AI generates the movement between them
- **Smooth transitions**: transformations, scene changes, product reveals and other clips that need a smooth change
- **Continue a clip**: use the last frame of one clip as the first frame of the next, so several clips stay consistent in style and motion
- **Lock the style**: make sure the style, composition and character look right at the start and end of the video

:::note
Video generation still has many unpredictable factors; clear instructions are needed to get close to what you expect.
:::

:::warn Before you start
- You can generate up to **2** videos at a time (image generation isn't affected)
- Video generation uses a lot of Points, so use it wisely
:::

[i 314]

:::steps
@ Make the first and last frame images
Following your script or idea, create the two images in Chat or Generate first. You can use image generation's "Reference image" editing to make both frames from the same picture. Related guides: [Image generation basics](#img-basics), [Editing & compositing](#chat-edit).
:::row
[i 315 First frame]
|||
[i 316 Last frame]
:::

@ Add the first frame
Put the first frame in "Source image" — upload it or pick it from the asset library.

@ Add the last frame
Upload the closing shot to "Last frame image".

@ Write a prompt
Describe what happens in between.
> The cat slowly looks to the side, its expression unchanged
[i 317]
:::tip
Keep the elements in the first and last frames fairly similar.
:::

@ Generate
[v 318]
:::

## FAQ

:::faq
?? The video doesn't flow — it seems to jump to the last frame.
Besides making the two frames more similar, describe the prompt in more detail:
❌ The cat turns its head
✅ The cat keeps its eyes open while slowly turning its head until it is looking fully to the side and stops; only then does it close its eyes and open them once

?? The result isn't quite what I described.
Taking MiniMax H3 as an example, its official prompt guide notes that it doesn't handle negative instructions such as "don't blink" or "don't move". Describe things positively with a clear sequence of events or camera structure, or turn on "Auto prompt enhancement".
[i 319]
:::
`,
},

"v-mimic": {
  src: "79744529", t: "Motion transfer (Wan Animate 2 / SCAIL 2)", n: "Motion transfer",
  d: "Make the character in an image dance or perform like the person in a video, or replace the person in a video with your character.",
  body: `
Want your character to perform specific moves, or to make a trending meme video? Wan Animate 2 and SCAIL 2 take the motion from a video and apply it — from real people or any footage — to your character.

| Model | Best for | Prompts |
| --- | --- | --- |
| Wan Animate 2 | Making an image's character perform like the video | Subject, background, action (all optional) |
| SCAIL 2 | Copying motion, or replacing the video's subject with your character | Prompt, reference subject, driving subject |

[i 118]

:::warn Before you start
- You can generate up to **2** videos at a time (image generation isn't affected)
- Video generation uses a lot of Points, so use it wisely
:::

## Wan Animate 2: the "LET ME IN!" meme

[i 119]

Wan Animate 2 is built for motion transfer: the character in the image performs like the video.

:::steps
@ Choose a source image and a driving video
[i 120]
:::row
[i 121 Source image]
|||
[v 122 Driving video]
:::
:::note
The generated video uses the driving video's audio.
:::

@ Fill in the prompts (optional)
You can fill in subject, background and action prompts to add elements that aren't in the original image.
**Background prompt**
> A long row of iron gates
**Action prompt**
> The character is pulling on the iron gate and won't let go
:::row
[i 123]
|||
[i 124]
:::

@ Set resolution and aspect ratio
- **480P**: about 350,000 pixels; a good balance of speed and file size
- **720P**: about 1 million pixels; sharper, but uses more Points
- **Aspect ratio**: "Auto" by default, matching the source image
[i 125]

@ Generate
[v 126]
:::

## SCAIL 2: copy motion or replace the subject

[i 127]

Besides copying motion, SCAIL 2 can also replace the subject:

- **Copy motion**: keep the **image's** character and scene, performing like the **video**
- **Replace subject**: keep the **video's** motion and scene, swapping the subject for the character in the **image**

:::steps
@ Choose a reference image and a driving video
[i 128]
:::row
[i 129 Source image]
|||
[v 130 Driving video]
:::

@ Fill in the prompts
- **Prompt**: describe the content and style you want. It can be empty, but a short description reduces errors
- **Reference subject prompt** and **Driving subject prompt**: these have default values; if there aren't several people in the shot, keep the defaults
> A person with a cat's head is dancing
:::row
[i 131]
|||
[i 132]
|||
[i 133]
:::

@ Choose the mode and resolution
Choose "Copy motion" or "Replace subject", and 480P or 720P (720P uses more Points).
[i 134]

@ Generate
:::


[v 135 Motion transfer (uses the image's aspect ratio)]

[v 136 Subject replacement (uses the video's aspect ratio)]


:::tip When replacing the subject
Keep the character and the person in the video fairly similar in species and build, or the proportions can come out strange.
:::
`,
},

"v-merge": {
  src: "ada8c678", t: "Merging videos",
  d: "Join several clips into one video right on the platform, no editing software needed.",
  body: `
Don't want to switch between apps just to edit a video? "Merge" joins several clips together right on moonland.ai. Combine it with [first & last frames](#v-frames) to control how each clip starts and ends, and you can build a complete video.

Videos from any model can be merged.

[i 111]

:::warn Note
- Merging uses **your computer's processing power**
- If the clips differ in size or frame rate, re-encoding takes longer
:::

:::steps
@ Add videos to the merge
Find the videos you want in "Lab", "Generate" or "History", open the menu in the top-right and choose "Add to merge". Once added, a marker appears in the video's top-left corner.
[i 112]
:::row
[i 113]
|||
[i 114]
:::

@ Arrange the order
A merge list appears in the top-right of the screen. It follows the order you added clips; drag to rearrange.
[i 115]

@ Merge and download
Click "Merge" to start. When it's done you can download the result.
[i 116]
:::warn The video disappears when you close the window
The merged result isn't saved, so download it straight away if you're happy with it.
:::
:::

[v 117 Merged result]

## FAQ

:::faq
?? Can I merge videos from other sources?
Only videos on the moonland.ai platform, from any model. For anything else, download the clips and use editing software.

?? Is there a limit on the number of videos?
Not currently, but merging uses your own computer's processing power.
:::
`,
},

"lab": {
  src: "5f3055fe", t: "Lab",
  d: "Fine-tune generation with LoRA, ControlNet, IP-Adapter and more. For users who need top quality or know Stable Diffusion.",
},

"l-ui": {
  src: "5b2cd17e", t: "The Lab interface", n: "The interface",
  d: "A full walkthrough of the step view and branches, prompt fields, asset area, model settings and advanced settings.",
  body: `
The Lab is a highly flexible creative space. Beyond prompt optimization, it clearly lists every **generation step** and how the settings differ, so you can adjust settings, compare results and branch off in new directions from any step.

Click "Lab" on the left to open it:

[i 426]

## Step view

:::row
[i 427]
|||
The background links your generated steps into a line. Each step shows:
- Generation number
- Step order (0, 1, 2, 3…)
- The model used
- **What changed from the previous step**
:::

[i 428]

### Creating a branch

Select the step you want to try again from, change the settings and submit. A new branch grows from that step.

[v 429]

## Prompt fields

Guide the result with the **prompt** and the **negative prompt**. For the tools below the fields (Image to prompt, Refine prompt, Auto enhancement), see [Prompt assistant](#img-prompt).

[i 430]

:::note
Available features depend on the model: video models don't have Image to prompt, and some image models don't have a negative prompt.
:::

## Asset area

The tiles below the prompt field are the assets used in this generation:

- **Base model**: the first tile, for image models only. Click to switch to a model that suits the style you're after. For how to choose, see [Choosing a model](#m-choose)
- **Media**: start image, reference images, reference videos, reference audio (depending on the model)
- **Control and enhancement**: [LoRA](#l-lora), [ControlNet](#l-cn), Embeddings and more (depending on the model)

[i 431]

## Model settings

Each model has different settings.

### Image models (Juggernaut XL as the example)

[i 432]

| Setting | Notes |
| --- | --- |
| General | Output resolution; higher usually needs more computing power and Points |
| Size | Adjust the aspect ratio and orientation with the slider |
| Hires Fix | Increases resolution and sharpens detail without breaking the composition |
| ADetailer | Regenerates selected areas after generation to fix and improve detail |
| Use the base model's recommended settings | Automatically adds prompts, LoRAs and Embeddings that suit this model, at no extra cost |
| Advanced settings | Deeper options; we recommend keeping the defaults (see [the bottom of this page](#h-advanced)) |

### Video models (MiniMax H3 as the example)

[i 433]

| Setting | Notes |
| --- | --- |
| Resolution | Higher usually needs more computing power and Points |
| Size | Adjust the aspect ratio and orientation with the slider |
| Length | 5 to 15 seconds |
| Frame interpolation | Off by default; when on, it adds frames for smoother motion and costs more |

## Other features

[i 434]

- **Presets**: browse presets, or save your current settings as one
- **Reset all tools**: restore the current model's defaults. Assets you've added (such as a start image) are also cleared and need to be added again
- **Batch size**: generate up to 4 at once

## Advanced settings for image models {#h-advanced}

[i 435]

| Setting | Notes |
| --- | --- |
| Sampling steps | More steps give finer detail but take longer. Start with 20–30; beyond a certain point the difference is hard to see |
| Guidance | How strongly the prompt is followed; too high causes unnatural over-sharpening |
| Sampler | Different denoising methods each have their own character. Euler a and DPM++ SDE are more random; DDIM and DPM++ 2M are more stable. Some take longer |
| Scheduler | We recommend the default Karras, which produces high-quality images in fewer steps (such as 20) |
| Seed | The same seed with the same model, prompt and settings gives similar or identical results. Choose random each time or set a value |
| VAE | "None" by default. With certain models it can make colors more vivid and details better |
`,
},

"l-lora": {
  src: "3d5047e8", t: "Using LoRA",
  d: "Use pre-trained style add-ons so results match a specific art style or character traits more precisely.",
  body: `
LoRAs are **pre-trained add-on packs of attributes**. With the right LoRA, the AI understands your prompt more fully and produces results closer to what you expect.

[i 379]

:::warn Different base models support different LoRAs
Check which base model you've selected first; some newer models have fewer compatible LoRAs.
:::

## What is a LoRA?

Knowing only someone's name, it's hard to really know them; but if you could read their résumé, diary and social media, you'd have a fuller picture. A plain prompt is like the name, and a LoRA is like that "life file".

There are two main ways to use LoRAs:

- **Targeted**: when you already have a clear style or character details in mind, pick suitable LoRAs to strengthen and stabilize the image
- **Exploring**: browse model descriptions and other users' work in the LoRA library to find new creative directions

Common uses:

- **Strengthen a style**: pixel art, realism, photography, picture book, fantasy, epic, game, sci-fi, surreal, cinematic, ukiyo-e…
- **Strengthen character traits**: Asian, Western, robots, beastfolk, animals, monsters; elements such as long or short hair, tanned skin or a mechanical exoskeleton

## How it works

LoRA is a technique for fine-tuning a base model: it keeps the original model's strengths and adds a particular style or knowledge, so the model can learn a new subject quickly from a small amount of data.

Every LoRA has **trigger words** that must appear in the prompt for it to take effect. But moonland.ai **adds the trigger words automatically** for the LoRAs you select when it optimizes your prompt, so you don't need to remember them.

For the differences between base models, see [Choosing a model](#m-choose).

## Steps

:::steps
@ Choose a base model
This example uses the image model "Juggernaut XL".

@ Turn on a LoRA
[i 380]
- **A**: choose a model category (compatible models are already grouped for you)
- **B**: set filters and sorting
- **C**: click the book icon to see the LoRA's details and users' work
- **D**: hover to preview how to use it below
[i 381]
:::

:::tip Using several LoRAs at once
Set the main LoRA's weight to 1 and the others to around 0.6. Too many LoRAs or weights that are too high easily cause problems.
:::

## Examples

[i 382]
[i 383]

Text, fingers and similar details often come out poorly. Generate with the LoRA first, then fix the details with an image-editing model or Chat:

[i 384]
[i 385]

## FAQ

:::faq
?? Do I need to type the trigger words myself?
No. moonland.ai adds the trigger words for the selected LoRAs automatically when it optimizes your prompt.

?? What if text, fingers and other details come out poorly?
Create the first version with the LoRA, then refine details with an image-editing model or Chat. If the style drifts after fixing:
1. Generate the image with the LoRA
2. Make local changes with "Reference image" or Chat
3. Put the edited image in "Start image", lower the transformation strength, and generate again with the original prompt and LoRA (you can "Convert to prompt" first)

?? Why do some base models have no LoRAs?
Newer models haven't been out long and their LoRAs are still being trained. Generate with an older model first, then refine with the new model using "Start image" or other controls.

?? The image is full of noise and the elements are messy.
- Too many LoRAs or weights too high: use at most 3 to 4 at once; set the main one to 1 and the others to around 0.6
- Adjust the advanced settings: guidance around 3–5 and sampling steps around 20–30
:::
`,
},

"l-cn": {
  src: "88602dd8", t: "Advanced control with ControlNet", n: "ControlNet",
  d: "Lock in a pose and composition with depth, skeleton or outline control images, then change the style freely.",
  body: `
Got the character right but can't get the pose you want? Want to try different styles with the same composition? Want to guide the AI with a sketch? ControlNet uses depth, outlines, skeletons and other information to make the AI follow the structure of a reference image.

[i 358]

## When to use ControlNet

First decide what you want to take from the reference image: the character design, the body pose, the composition, the color and style, a specific object, or facial features? When what you need is structural — **pose, outline, composition** — use ControlNet and treat it as a condition the AI must follow.

Common uses:

- Control a person's pose and expression
- Control buildings and structures (interiors, exteriors, line art)
- Turn doodles or sketches into finished work
- Arrange space and layout

## How it works

ControlNet converts the reference image into a **control sketch** in a specific format and passes it to the AI with the prompt. During generation, the AI must follow the spatial structure or outlines this sketch defines.

[i 359]

:::row
| Type | What it captures | Good for |
| --- | --- | --- |
| Depth | Near and far | General use — try it first when unsure |
| OpenPose | Key points of a person | Fixing a pose |
| Canny | The strongest edges | Copying shapes precisely |
| Lineart | Thicker line art | Coloring line art, photo to illustration |
| Normal | Which way surfaces face | A three-dimensional feel |
| Segmentation | Areas by object type | Repainting large scenes |
| MLSD | Straight lines | Interior design, architecture |
| Softedge | Rough shapes | Natural blending, style swaps |
|||
[i 360]
:::

## Each type explained

### Depth

Analyzes spatial distance in the image and produces a grayscale map: white is closest to the camera, black is furthest. It's powerful and versatile — **try it first when you're not sure which to use**.

[i 361]

Good for: **scene swaps** — copying the original layout exactly to change the style while keeping the composition.

### OpenPose

Detects key points of the body, hands and head and produces a stick-figure skeleton. It only controls the pose and ignores the person's looks or clothing, so it can't lock in a character's appearance.

[i 362]

Good for:
- **Fixing a pose**: more effective than describing it in words, as long as you find a good reference image first
- **Scenes with several people**: supports multiple characters, but is less stable
- **Unusual poses**: combine with "Normal" to show front-to-back relationships the skeleton can't express

### Canny

Detects the strongest edges and produces white lines on black. The lines are very detailed but can also introduce noise.

[i 363]

Good for: **precise copies or style transfer**, fixing an object's shape or a character's form.

### Lineart

Stronger line extraction than Canny, with thicker lines. Even realistic models produce an illustrated feel, so it's better for illustrations.

[i 364]

Good for: coloring line art, turning photos into illustrations.

:::warn Less stable results
We recommend getting these effects in Chat instead, or using it with care.
:::

### Normal

Uses color to record which way each point on a surface faces, controlling bumps and how light falls. Results have a stronger 3D feel.

[i 365]

Good for:
- **Product style swaps**: keep a product's lighting and texture when changing material or style (in our tests "Depth" works better)
- **Fashion design reference**: capture the three-dimensional shape of clothing
- **Unusual poses**: show front-to-back relationships OpenPose can't express

:::warn Less stable results
Use with care.
:::

### Segmentation

Marks different kinds of objects in the image with different colors. It only separates areas, so details and people will differ a lot from the original.

[i 366]

Good for: **changing a scene's theme**, such as repainting buildings and roads in a wide shot.

:::warn Less stable results
Use with care.
:::

### MLSD

Detects straight lines only, ignoring curves, people and textures. The AI keeps walls, doors, windows, ceilings and other straight structures and "redecorates" around them.

[i 367]

Good for: interior design, remodeling building exteriors.

:::tip
Not suitable for scenes with lots of soft furnishings (sofas, cushions and so on).
:::

### Softedge

Doesn't aim for precise lines; it captures the rough shape of the main objects and produces a soft, blurry edge map. It guides the composition while leaving room for the AI to add detail.

[i 368]

Good for: style and scene swaps, avoiding a "pasted-on" look, coloring line art, turning photos into illustrations.

## Canny, Lineart and Softedge compared

All three extract lines, so what's the difference? Using the same image with a realistic model and an illustration model:

[i 369]

> A sunlit forest, warm and fresh style

**Canny**: fine lines, faithful to the composition and line work.

:::row
[i 370]
|||
[i 371]
|||
[i 372]
:::

**Lineart**: thicker lines, equally faithful. The realistic model looks clearly illustrated; with the illustration model, light, shade and detail are more three-dimensional than with Canny.

:::row
[i 373]
|||
[i 374]
|||
[i 375]
:::

**Softedge**: thicker, simpler lines. Details are less faithful (such as the fur on the hand or the stars in the background), but the AI has more room to be creative.

:::row
[i 376]
|||
[i 377]
|||
[i 378]
:::

## FAQ

:::faq
?? The result still doesn't match the reference image.
Check these in order:
- **Weight**: how strongly the ControlNet image is followed
- **Control range**: the share of generation steps ControlNet takes part in; it usually doesn't need to be at maximum
- **Type**: make sure the type fits the job — OpenPose won't do anything for interior design, for example
- **Prompt**: make sure nothing in it conflicts with what you expect

?? Can I fix a person's pose and a building's structure at the same time?
Yes. You can use up to two ControlNets at once.

?? I used MLSD for interior design and the sofa and curtains look strange.
Use an image of the empty room, so furniture doesn't block the structure and cause misreadings.
:::
`,
},

"music-3d": {
  src: "02be9bbb", t: "Music & 3D",
  d: "Generate songs, background music and sound effects from text and lyrics, or turn one image into a 3D model.",
},

"music": {
  src: "d37fd1bc", t: "Music generation",
  d: "Generate songs or background music from lyrics and a style description, with Japanese and Chinese lyric examples.",
  body: `
Have an idea but don't know which instruments or arrangement to use? Held back by music theory or mixing? Just want a simple BGM or demo? Describe it in words, add lyrics, and turn the idea in your head into music.

Go to "Generate" or "Lab" and choose "Music":

[i 103]

:::steps
@ Choose a model
Find "ACE Step 1.5 XL". For the differences between models, see [Points music models](#m-music).
[i 104]

@ Write the lyrics
[i 105]
Split them into sections with tags such as [Intro], [Verse], [Pre-Chorus], [Chorus], [Bridge], [Outro], [Instrumental] and [Solo] to help the AI understand the song's structure. Out of ideas? Leave it empty. For no vocals, write "no lyrics" or [Instrumental]. **Japanese, Chinese and English** are supported.

@ Describe the style
[i 106]
You can leave it empty too, or describe it along these lines:
| Item | Examples |
| --- | --- |
| Genre | Hip hop, J-pop soft rock, jazz, blues, classical, electronic, lo-fi, R&B, folk, heavy metal, reggae, funk |
| Mood | Upbeat, sad, romantic, lonely, tense, mysterious, dreamy, oppressive, soothing, fired-up, eerie |
| Era / flavor | 80s, 90s, retro, Showa-era, cyberpunk, anime, game soundtrack |
| Instruments | Piano, guitar, drum kit, strings, synthesizer, acoustic guitar, saxophone |
| Vocals | Male, female, choir, deep voice, ethereal female, youthful, metal growl |
| Key | Minor (mysterious, heavy, sad) or major (happy, positive, cheerful) |
:::tip
If you describe the style in Chinese, keep "Auto prompt enhancement" on.
:::

@ Other settings
[i 107]
- **Auto prompt enhancement**: has separate switches for "Lyrics" and "Style". If you wrote the lyrics yourself, turn "Lyrics" off so they aren't changed by mistake
- **Length**: 120 to 600 seconds; very long tracks may repeat

@ Generate
:::

## Example 1: Japanese lyrics + a detailed style

You can write what you want for each section into the style prompt.

:::details Lyrics example (Japanese)
> [Intro]
> [Verse 1]
> 独り芝居　惑いを花弁に。　騒ぎ、耳鳴りを上書き。
> 春にした過ちから、ばたばたで、ここまで？
> 花の灰と泥が混ざり合ってできたようなけだものね
> 恋だというつもりの儘、ただただ愛おしいな
> [Pre-Chorus 1]
> 逃げてよ、ボクを連れて　逃げ場ないけれどね...
> 近づけば聞こえるでしょう、詰まってた鳴き声を
> [Chorus 1]
> 心臓抜き出してくれよ　言語になれない群れを暴こう
> 手を汚しちゃった、ごめんよ。ただ、一人じゃもう耐えられないもん
> キキラキキラキラキレラ～
> お互いに咎になろか
> キキラキキラキラキレラ～
> 恋だって　呼んでもいいな
> [Verse 2]
> 揺らむ影が探したのは　恨んだ儘造花めく未練だ
> 何時居竦み始めたんだ、がたがたで、ここ待って？
> 白鴉の屍だらけで、血と羽塗れキミ浮いてるね
> 護るというつもりの様、憐れで美しいわ
> [Pre-Chorus 2]
> 止めてよ、匙を投げて、何処行っても不幸せ...
> 聞こえても甲斐がないもん　ナニカが来る兆しを
> [Instrumental Break]
> [Pre-Chorus 3]
> もっと懲らしめてくれよ　報いはまだこんなもんでしょう
> 這って踏まされた花を　何度でも見殺した醜い人
> [Final Chorus]
> キキラキキラキラキレラ～
> 穢れて咲いた物が
> キキラキキラキラキレラ～
> なんだって　呼んでも嫌！
> 繰り返し繰り返して
> いこみきな顔を夢見た
> 毒を背負うために生きれば
> それでも随分綺麗だ
> [Outro]
> キキラキキラキラキレラ～
> 五臓六腑が融けそうだ
> キキラキキラキラキレラ～
> なんだ　なんだ　君は
:::

:::details Style prompt example
> Japanese rock,
> dark, oppressive and gloomy mood,
> piano, distorted electric guitar, electric bass and drums as the main instruments,
> the piano uses dark, dissonant chords and arpeggios for an eerie, oppressive atmosphere; the electric guitar has a heavy distorted tone, built on strong riffs, power chords and high-tension melodies; the bass is deep and thick, emphasizing low end and groove; the drums are powerful, dense and aggressive, with fast fills, hitting much harder in the chorus and climax,
> lead vocal is a rich, deep and explosive female voice,
> BPM 178,
> minor key,
> [Intro] main melody led by piano, with piano and electric guitar providing harmony and melodic accompaniment
> [Verse] piano accompaniment only, no electric guitar
> [Pre-Chorus] adds some guitar melody lines as accompaniment, but no strumming
> [Chorus] lots of guitar strumming; besides harmonic accompaniment, the piano plays a melody line behind the lead vocal
> [Instrumental Break] anything goes
> [Pre-Chorus 3] quiet, piano and lead vocal solo only
> [Final Chorus] only here comes heavy guitar strumming, contrasting with the previous section; besides harmonic accompaniment, the piano plays a melody line behind the vocal
> [Outro] carries the momentum through to the end
:::

:::row
[i 108]
|||
[a 580 Result]
:::

## Example 2: AI-written Chinese lyrics + a simple style

No detailed ideas? No problem. Let the AI write the lyrics and keep the style to the key points.

:::details Lyrics example (Chinese, written by AI)
> [Intro]
> [Verse 1]
> 冷雨爬滿窗沿
> 黑霧淹沒心岸
> 心跳沉入深寒
> 呼吸溺斃黑暗
> [Pre-Chorus 1]
> 鎖鏈越收越緊
> 耳語越來越近
> 別閉眼 別認命
> 墜落前放聲嘶鳴
> [Chorus 1]
> 撕開虛假黎明
> 咬碎既定宿命
> 深淵倒映黑影
> 烈火照亮夢境
> 以血為誓不認命
> 以痛為刃斬寂靜
> 就算世界崩壞傾
> 我也要活得清醒
> [Verse 2]
> 鏡中人影潰散
> 時鐘停在彼岸
> 指尖觸到冰寒
> 眼淚凝成血斑
> [Pre-Chorus 2]
> 高牆越築越高
> 心跳越來越焦
> 別沉默 別求饒
> 碎裂前用力奔跑
> [Chorus 2]
> 撕開虛假黎明
> 咬碎既定宿命
> 深淵倒映黑影
> 烈火照亮夢境
> 以血為誓不認命
> 以痛為刃斬寂靜
> 就算世界崩壞傾
> 我也要活得清醒
> [Instrumental]
> [Pre-Chorus 3]
> 只剩我和琴聲
> 在黑暗中獨行
> 如果光已熄滅
> 就讓我成為火焚
> [Final Chorus]
> 撕開虛假黎明
> 咬碎既定宿命
> 深淵倒映黑影
> 烈火照亮夢境
> 以血為誓不認命
> 以痛為刃斬寂靜
> 就算世界崩壞傾
> 我也要活得清醒
> [Outro]
> 絕不回頭 絕不熄滅
> 黑夜盡頭 由我點燃
:::

> Japanese rock,
> dark, oppressive and gloomy mood,
> piano, distorted electric guitar, electric bass and drums as the main instruments,
> lead vocal is a clear, explosive youthful male voice,
> BPM 178,
> minor key,

Turn on auto enhancement for both "Lyrics" and "Style":

[i 109]

:::row
[i 110]
|||
[a 581 Result]
:::

## FAQ

:::faq
?? Japanese lyrics keep getting sung wrong.
Japanese kanji readings are complicated. If a word is mispronounced, rewrite the kanji in hiragana or katakana. For Chinese characters with several readings that get mispronounced, swap in a character with the same sound.

?? The result is very different from my style prompt.
For more precision, turn off AI prompt enhancement, write in English, or describe it in more detail.
:::
`,
},

"model-3d": {
  src: "7ca3549b", t: "3D model generation",
  d: "Upload one image to automatically generate an exportable 3D model, great for game assets, product prototypes and VR content.",
  body: `
Whether you're a designer, game developer or animator, or just want to make an idea more concrete, all you need now is one image. The AI analyzes the depth and structure in the image, rebuilds it as a 3D model in seconds, and gives you files you can export.

[v 276]

Common uses:

- Game scenes and character assets
- Product showcases and design prototypes
- VR/AR content
- Visualizing concepts

Find "Other tools" and choose "Model generation":

[i 277]

There are two 3D models to choose from (both use Points):

| Model | Strengths | Default cost (Points) |
| --- | --- | --- |
| Pixal3D {{Most used}} | Aligns point by point with the image for a faithful 3D model, with PBR materials (realistic surface qualities such as metal and roughness) | 650 |
| Idol (new) | Quickly generates a 3D Gaussian Splat model at a lower cost | 100 |

[i 629]

:::note Idol replaces TripoSplat
Idol is an improved version built on TripoSplat technology, with better object detail and more consistency from different angles. TripoSplat was retired on 2026/11/05. A Gaussian Splat is a 3D scene made of many tiny colored points. It looks very realistic, but it isn't the same as an ordinary 3D mesh, so check that your 3D software supports the format before importing it.
:::

For a detailed comparison of the two models, see [Points 3D models](#m-3d). For 3D models that use Coins (such as Tripo and Hunyuan3D), see [Coins 3D models](#credit-3d).

:::steps
@ Upload a reference image
Upload an image under "Source image" on the right, or choose one generated on the platform. You can't enter a prompt, so the image matters:
- **A clear subject on a clean background**: the AI decides the subject by itself. You can crop it or remove the background first, or edit the background in "Chat"
- **A 45-degree angle works best**: too little information often gives unexpected results. You can change the image to an angled view in "Chat" or another tool first
- **Avoid transparent objects**: they don't work well
- **Avoid heavy shadows**: colors are easily misread
[i 278]

@ Generate
Choose a model and click generate. With Pixal3D, we recommend keeping the default "Quality" and "Texture size" (High, 4K).
:::

:::note
You can run up to **4** model generations at once. They share a queue with images and don't affect video generation.
:::

## FAQ

:::faq
?? Which formats can I export?
[i 630 Pixal3D's download menu]
- **Pixal3D**: .GLB (with textures, as "Original" or "Compatible"), .USDZ, .STL, .OBJ, .PLY; textures can also be downloaded on their own as the original files, PNG or JPEG. If other software can't open the original GLB, download the compatible version instead
- **Idol**: .SPZ, .PLY, .SOG, plus an experimental .GLB

?? Can I edit the model on the platform?
For now there's a basic preview with rotate and zoom. For detailed changes, export the model and use professional 3D software.

?? The model has floating parts or holes
Usually the bottom or part of the structure is hidden in the image, so there isn't enough depth information. Generate again, or export and repair it in 3D software.

?? Can I make people or animals?
Yes. For the best results, use a clear, full-body image with nothing blocking the subject, taken from a 45-degree angle.
:::
`,
},

});
