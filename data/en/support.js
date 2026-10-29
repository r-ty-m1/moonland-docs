// 支援（英文版）：常見問題、更新日誌、聯絡我們
(window.ARTICLES_EN = window.ARTICLES_EN || {}) && Object.assign(window.ARTICLES_EN, {

'faq': {
  t: 'FAQ',
  d: 'The most common questions from across the guides, each linked to the full guide.',
  body: `
## Results aren't what you expected

:::faq
?? No matter how I change the prompt, I can't get the look I want.
1. Turn on "Auto prompt enhancement", or use "Image to prompt" to generate a prompt from a reference image ([Prompt assistant](#img-prompt))
2. Work in stages: generate the subject first, then add other effects by editing with a reference image ([Image generation basics](#img-basics))
3. Switch to a model that is good at that style ([Choosing a model](#m-choose))

?? I wrote in Chinese and the result doesn't match what I meant.
Auto enhancement translates the prompt into English, and the meaning can drift a little. Write key terms such as style names and character names in English. ([Prompt assistant](#img-prompt))

?? Each time I regenerate in Chat, the result is very different.
Chat is built for early brainstorming, so every regeneration is different. To change only part of an image, use [Editing & compositing](#chat-edit).

?? Text, fingers and other details never come out right.
Finish the image with LoRA first, then fix details with an image-editing model or Chat. ([Using LoRA](#l-lora))

?? The image is noisy and cluttered.
You're using too many LoRAs or the weights are too high. Use at most 3 to 4 at a time, with the main one at weight 1 and the others around 0.6; set guidance to 3–5 and sampling steps to 20–30. ([Using LoRA](#l-lora))
:::

## Video

:::faq
?? How many videos can I generate at once?
Up to 2, and it doesn't affect image generation. ([Video generation basics](#v-basics))

?? Video generation takes too long or fails.
Video takes a lot of computing power and time. A failure may mean the request breaks platform rules; also check your credit balance and avoid peak hours. If it keeps failing, [contact us](#contact). ([Video to video](#v-v2v))

?? The first and last frames don't connect smoothly.
Make the two frames less different and describe what happens in between more specifically. MiniMax H3 doesn't handle negative instructions such as "don't blink". ([First & last frames](#v-frames))

?? The motion path has no effect.
Paths stop working when there are more than 2, when they point in opposite directions, or when the object isn't clear. ([Motion path control](#v-path))
:::

## Editing and tutorials

:::faq
?? After changing outfits, the proportions look off or the face changed.
Crop the head out of the clothing image, and make sure the model and the clothing cover the same area (half body with half body, full body with full body). ([Changing outfits](#outfit))

?? How many images can I edit at once?
One Chat message can include up to 9 images + 1 video, but using two images at a time gives the most reliable results. ([Editing & compositing](#chat-edit))

?? The proportions are wrong after outpainting.
Set up the expanded canvas first, then click "Apply asset ratio" — in that order. ([Outpainting](#img-outpaint))

?? Can I use an AI-generated logo commercially as-is?
Not necessarily. Once the design is final, we recommend redrawing it in vector software so you fully own the copyright. ([Logo design](#logo))
:::

## Credits and accounts

:::faq
?? Which actions use the most credits?
High-resolution and long videos, frame interpolation, upscaling and IP-Adapter. ([Credits & Moon Coins](#credits))

?? Why don't team members have any credits?
New members start with none; an admin needs to allocate them. ([Admin 4](#admin-4))

?? Do unused daily credits carry over?
No. Fixed daily credits reset to zero at the end of the day. ([Credits & Moon Coins](#credits))

?? A team member's invitation link has expired.
Links are valid for 24 hours. Ask the admin to click "Re-invite". ([Admin 4](#admin-4))

?? Is my work still there after a trial account expires?
No. After 23:59 on the expiry date you can't log in or open any work, so download it beforehand. ([Logging in with a trial account](#trial-login))

?? External models (Moon Coin tools) don't work.
They are currently only available to team accounts. [Contact us](#contact) to enable them.
:::
`},

'changelog': {
  t: 'Changelog',
  d: 'Updates to the Help Center and platform features, newest first.',
  body: `
| Date | Changes |
| --- | --- |
| 2026/10/29 | English version of the Help Center added |
| 2026/10/27 | Help Center redesign: sections reorganized, duplicate articles merged, all guides moved to the new reading format |
| 2026/08/14 | Content updates |
| 2026/05/05 | Content updates |
| 2026/04/23 | Some article images updated |
| 2026/03/12 | Content updates |
| 2026/03/08 | Interface screenshots and text updated |
| 2026/02/03 | Interface screenshots and text updated |
`},

'contact': {
  t: 'Contact us',
  d: 'How to reach us about training, custom technical support and questions about using the platform.',
  body: `
We can run online or in-person training courses, and we welcome enquiries about custom technical support.

| Channel | Details |
| --- | --- |
| Email | support@moonshine.ai |
| Phone | (+886) 02-2785-3069 |
| LINE community | ID: @588katjx · [Join the community](https://lin.ee/PpA769D) |
| Pricing | [moonland.ai/pricing](https://moonland.ai/pricing?direct) |

Join our LINE community to chat with other users and share feedback.
`},

});
