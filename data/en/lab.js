// 創作工具：實驗室、音樂與 3D、外部模型（英文版）
// 歌詞範例保留原文（日文、中文），示範模型支援多種語言
(window.ARTICLES_EN = window.ARTICLES_EN || {}) && Object.assign(window.ARTICLES_EN, {

'l-ui': {
  t: 'The Lab interface',
  d: 'A full walkthrough of the step view and branches, prompt fields, asset area, model settings and advanced settings.',
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
| General | Output resolution; higher usually needs more computing power and credits |
| Size | Adjust the aspect ratio and orientation with the slider |
| Hires Fix | Increases resolution and sharpens detail without breaking the composition |
| ADetailer | Regenerates selected areas after generation to fix and improve detail |
| Use the base model's recommended settings | Automatically adds prompts, LoRAs and Embeddings that suit this model, at no extra cost |
| Advanced settings | Deeper options; we recommend keeping the defaults (see [the bottom of this page](#h-advanced)) |

### Video models (MiniMax H3 as the example)

[i 433]

| Setting | Notes |
| --- | --- |
| Resolution | Higher usually needs more computing power and credits |
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
`},

'l-lora': {
  t: 'Using LoRA',
  d: 'Use pre-trained style add-ons so results match a specific art style or character traits more precisely.',
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
`},

'l-cn': {
  t: 'Advanced control with ControlNet',
  d: 'Lock in a pose and composition with depth, skeleton or outline control images, then change the style freely.',
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
`},

'l-ip': {
  t: 'Consistent style (IP-Adapter)',
  d: 'Upload one style sample and turn photos or new work into the same art style to create a series.',
  body: `
Want to turn a photo into a Van Gogh painting, or make a series with a consistent style? Turn on IP-Adapter and add one style sample. Illustration, oil painting and hand-drawn comic styles can all be applied quickly.

:::row
[i 464]
|||
[i 465]
|||
[i 466]
:::

:::steps
@ Turn on IP-Adapter
Find IP-Adapter among the controls in the toolbar and upload a "sample image" as the **style source**.
[i 467]

@ Add the image to convert
Upload the image to convert in "Start image" as the **content source**, and turn on "Convert to prompt" and "Apply image size". You can also skip the image and generate from text only.
[i 468]

@ Generate
Choose a model (or use the default) and click Generate.
:::

## What each input does

| Input | Decides |
| --- | --- |
| Sample image (IP-Adapter) | The output's art style, such as oil painting, watercolor or comic |
| Start image | The structure and content to keep |
| Prompt | The description of the subject |

Adjusting strength: raise the start image's **transformation strength** or IP-Adapter's **weight** for a stronger style that looks more like the sample; lower them for more influence from the prompt.

:::tip Build your own style library
Collect the style images you use often so you can apply them again next time.
:::

## FAQ

:::faq
?? The style isn't strong enough.
Raise IP-Adapter's weight so generation follows the sample more closely, or raise the start image's transformation strength — though the shapes may drift from the original.

?? Can I use several style images at once?
Yes. Click the plus sign to add samples, and the AI refers to them according to their weights.
[i 469]

?? Is it normal for generation to be slower?
Yes. There's an extra style-transfer step, and it uses more credits too.
:::

## Going further

- Combine with [ControlNet](#l-cn): lock the pose or composition first, then apply the style
- Use it for brand design, concept art and other spin-off work
`},

'music': {
  t: 'Music generation',
  d: 'Generate songs or background music from lyrics and a style description, with Japanese and Chinese lyric examples.',
  body: `
Have an idea but don't know which instruments or arrangement to use? Held back by music theory or mixing? Just want a simple BGM or demo? Describe it in words, add lyrics, and turn the idea in your head into music.

Go to "Generate" or "Lab" and choose "Music":

[i 103]

:::steps
@ Choose a model
Find "ACE Step 1.5 XL". For the differences between models, see [Music models compared](#m-music).
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
`},

'model-3d': {
  t: '3D model generation',
  d: 'Upload one image and automatically generate an exportable 3D model — great for game assets, product prototypes and VR content.',
  body: `
Whether you're a designer, game developer, animator or just want to make an idea more tangible, all you need now is one image. The AI analyzes the depth and structure in the image, rebuilds it as a 3D model in seconds, and gives you files you can export.

[v 276]

Common uses:

- Game scenes and character assets
- Product showcases and design prototypes
- VR / AR content
- Visual concepts

Find "Other tools" and choose "Model generation":

[i 277]

:::steps
@ Upload a reference image
Upload an image to "Source image" on the right, or choose one generated on the platform. You can't enter a prompt, so the choice of image matters:
- **Clear subject, clean background**: the AI decides what the subject is on its own. Crop or remove the background first, or edit the background in Chat
- **A 45-degree angle works best**: too little information can lead to results far from what you expect. Use Chat or another tool to turn the image to an angle first
- **Avoid transparent objects**: they don't work well
- **Avoid heavy shadows**: colors are easily misread
[i 278]

@ Generate
We recommend the default "Quality" and "Texture size" (High, 4K). Click Generate.
:::

:::note
Up to **4** model generations can run at once. They share the queue with images and don't affect video generation.
:::

## FAQ

:::faq
?? Which formats can I export?
Common formats such as .GLB, .STL, .OBJ and .PLY, with textures as JPG or PNG.

?? Can I edit the model on the platform?
There's a basic preview with rotate and zoom. For detailed changes, export the model and use professional 3D software.

?? Parts of the model float or have holes.
Usually the bottom or structure of the subject was hidden, so there wasn't enough depth information. Generate again, or export and repair it in 3D software.

?? Can I make people or animals?
Yes. A clear, full-body, unobstructed image at a 45-degree angle works best.
:::
`},

'credit-tools': {
  t: 'External models (Moon Coins)',
  d: 'Use Moon Coins to access external models such as Seedance, Kling, Google and OpenAI. Currently available to team accounts only.',
  body: `
This section covers the latest external AI models connected to moonland.ai. External models are billed in **Moon Coins**.

:::note Currently for team accounts only
If you'd like to use them, [contact us](#contact) and we'll help enable them.
:::

External models currently available:

- Seedance
- Kling
- Google
- OpenAI

Guides for each model are being written. For the difference between credits and Moon Coins, see [Credits & Moon Coins](#credits).
`},

});
