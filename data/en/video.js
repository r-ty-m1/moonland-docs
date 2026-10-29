// 創作工具：影片生成（英文版）
(window.ARTICLES_EN = window.ARTICLES_EN || {}) && Object.assign(window.ARTICLES_EN, {

'v-basics': {
  t: 'Video generation basics',
  d: 'Text to video (t2v): the interface, how to structure prompts, and resolution, aspect ratio and length settings.',
  body: `
Just type some text and turn the picture in your head into a video — from the grand scenes of a fantasy world to the subtle emotion in a character's eyes.

:::warn Before you start
- You can generate up to **2** videos at a time (image generation isn't affected)
- Video generation uses a lot of credits, so use it wisely
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
`},

'v-i2v': {
  t: 'Image to video (i2v)',
  d: 'With one image, make a character blink, turn their head or dance, and add background motion and camera moves.',
  body: `
With a single image you can make the character blink, turn their head, smile or even dance, add wind or changing light in the background, and design push-ins, pull-outs and orbiting camera moves.

:::row
[i 436 Original image]
|||
[v 437 Generated video]
:::

:::warn Before you start
- You can generate up to **2** videos at a time (image generation isn't affected)
- Video generation uses a lot of credits, so use it wisely
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
`},

'v-v2v': {
  t: 'Video to video (v2v)',
  d: 'Keep the motion and rhythm of the original video while remaking the look, swapping the character or applying a style — one video can become hundreds.',
  body: `
When you don't like the look of a video but want to keep its motion or rhythm, use video to video. You can borrow the movement from a popular clip, or turn live-action motion into animation, illustration, realism, a cinematic look, anime and many other styles.

Common uses:

- Remake a video's look and style
- Make a character perform specific moves
- Recreate meme videos
- Capture real human motion

:::warn Before you start
- You can generate up to **2** videos at a time (image generation isn't affected)
- Video generation uses a lot of credits, so use it wisely
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
- **Resolution**: 480P or 720P; 720P uses a lot of credits
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
Video generation takes a lot of computing power and time; you can do other work while you wait. If it won't generate, the content may break platform rules — check the usage policy first, since violations can lead to account suspension. Also check your credit balance and avoid peak hours. If it keeps failing, [contact us](#contact).
:::
`},

'v-path': {
  t: 'Motion path control',
  d: 'Draw arrows on the image to set the direction and path a character or background object moves.',
  body: `
Before generating a video, draw motion paths on the image to set exactly where a character, the camera or background objects should move.

Common uses:

- Move a character or object in a specific direction
- Move objects in the background

[i 408]

:::warn Before you start
- You can generate up to **2** videos at a time (image generation isn't affected)
- Video generation uses a lot of credits, so use it wisely
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
`},

'v-frames': {
  t: 'First & last frames',
  d: 'Set the opening and closing shots of a video and let the AI fill in the motion and transition in between.',
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
- Video generation uses a lot of credits, so use it wisely
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
`},

'v-mimic': {
  t: 'Motion mimic (Wan Animate 2 / SCAIL 2)',
  d: 'Make the character in an image dance or perform like the person in a video, or replace the person in a video with your character.',
  body: `
Want your character to perform specific moves, or to make a trending meme video? Wan Animate 2 and SCAIL 2 take the motion from a video and apply it — from real people or any footage — to your character.

| Model | Best for | Prompts |
| --- | --- | --- |
| Wan Animate 2 | Making an image's character perform like the video | Subject, background, action (all optional) |
| SCAIL 2 | Copying motion, or replacing the video's subject with your character | Prompt, reference subject, driving subject |

[i 118]

:::warn Before you start
- You can generate up to **2** videos at a time (image generation isn't affected)
- Video generation uses a lot of credits, so use it wisely
:::

## Wan Animate 2: the "LET ME IN!" meme

[i 119]

Wan Animate 2 is built for motion mimic: the character in the image performs like the video.

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
- **720P**: about 1 million pixels; sharper, but uses more credits
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
Choose "Copy motion" or "Replace subject", and 480P or 720P (720P uses more credits).
[i 134]

@ Generate
:::

:::row
[v 135 Copy motion (uses the image's aspect ratio)]
|||
[v 136 Replace subject (uses the video's aspect ratio)]
:::

:::tip When replacing the subject
Keep the character and the person in the video fairly similar in species and build, or the proportions can come out strange.
:::
`},

'v-merge': {
  t: 'Merging videos',
  d: 'Join several clips into one video right on the platform, no editing software needed.',
  body: `
Don't want to switch between apps just to edit a video? "Merge" joins several clips together right on moonland.ai. Combine it with [first & last frames](#v-frames) to control how each clip starts and ends, and you can build a complete video.

Videos from any model can be merged.

[i 111]

:::warn Note
- Merging uses **your own computer's processing power**
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
`},

});
