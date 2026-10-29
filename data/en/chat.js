// 創作工具：交談（英文版）
(window.ARTICLES_EN = window.ARTICLES_EN || {}) && Object.assign(window.ARTICLES_EN, {

'chat-intro': {
  t: 'Introduction to Chat',
  d: 'Create images, videos, music and 3D models by chatting. The AI assistant picks a suitable model for you.',
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
- Each message uses **2 "AI assistant credits"**; the actual generation is charged at each tool's normal price
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
`},

'chat-prompts': {
  t: 'Writing prompts',
  d: 'Formulas and copy-ready examples for describing images, Chinese and English text designs, videos and music in Chat.',
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
Chat currently generates music with Stable Audio 3.0 or YuE2, and YuE2 can't set a length. For the differences between models, see [Music models compared](#m-music).
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
${SNIP.lyricsJa1}
:::

:::row
[i 533]
|||
[a 584 Result]
:::

## When the result isn't right

Every regeneration in Chat can differ a lot. If you only want to change part of the result, use [editing](#chat-edit) instead; for more techniques, see the [Chat cookbook](#chat-recipes).
`},

'chat-edit': {
  t: 'Editing & compositing',
  d: 'Keep the overall image and change only part of it, replace a character or background, combine several images, or make a character copy the motion in a video.',
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
`},

'chat-settings': {
  t: 'Chat settings',
  d: 'Use "Personal instructions" so the AI remembers your preferences, and choose which tools it may use.',
  body: `
Repeating your preferences in every new chat gets tedious. Add "Personal instructions" under **Settings > Chat** and the AI will remember how you like to work. You can also choose which tools the AI may use here (Moon Coin tools need to be enabled separately).

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
> Prefer tools that use fewer credits
> Use LTX 2.5 for first & last frames
[i 73]
[i 74]

@ Check the other settings
We recommend keeping the defaults:
- **Auto-approve small generations**: credit tools are used first by default. Any single generation over 100 credits, or any generation that uses Moon Coins, will ask you to confirm first
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

**Example 3**: following the personal instructions, the AI used LTX 2.5 to make a first-and-last-frame video. Because this one costs more than 100 credits, the system asks you to confirm first; generation starts when you click Send.

[i 80]
[v 81]
`},

});
