// 英文翻譯：支援（AI 翻譯，2026-11-23，對照正式網站當天的中文）
// 伺服器啟動時，還沒有英文版的頁面會匯入成「英文草稿」（server/editor.js 的 importEnSeed），要有人看過、取消草稿才公開
// 匯入之後以編輯後台為準，改這個檔案不會影響已經匯入的頁面；這個檔案不對外提供
// src 是翻譯時中文的簽章（model.js 的 zhSig）：中文之後改過，後台會標「英文待更新」
// 名稱照 moonland.ai 本站英文版（data/en/terms.json）：點數 Points、登月幣 Coins、交談 Chat、實驗室 Lab、社群藝廊 Gallery
(window.EN_SEED = window.EN_SEED || { pages: {}, sections: {}, groups: {} });
Object.assign(EN_SEED.pages, {

"faq": {
  src: "b2ca060f", t: "FAQ",
  d: "The most common questions from across the guides, each linked to the full guide.",
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
Video takes a lot of computing power and time. A failure may mean the request breaks platform rules; also check your Points balance and avoid peak hours. If it keeps failing, [contact us](#contact). ([Video to video](#v-v2v))

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

## Points and accounts

:::faq
?? Which actions use the most Points?
High-resolution and long videos, frame interpolation, upscaling and IP-Adapter. ([Points & Coins](#credits))

?? Why don't team members have any Points?
New members start with none; an admin needs to allocate them. ([Admin 4](#admin-4))

?? Do unused daily Points carry over?
No. Fixed daily Points reset to zero at the end of the day. ([Points & Coins](#credits))

?? A team member's invitation link has expired.
Links are valid for 24 hours. Ask the admin to click "Re-invite". ([Admin 4](#admin-4))

?? Is my work still there after a trial account expires?
No. After 23:59 on the expiry date you can't log in or open any work, so download it beforehand. ([Logging in with a trial account](#trial-login))

?? External models (Coin tools) don't work.
They are currently only available to team accounts. [Contact us](#contact) to enable them.
:::
`,
},

"contact": {
  src: "92d4ca17", t: "Contact us",
  d: "How to reach us about training, custom technical support and questions about using the platform.",
  body: `
We can run online or in-person training courses, and we welcome enquiries about custom technical support.

| Channel | Details |
| --- | --- |
| Email | support@moonland.ai |
| Phone | (+886) 02-2785-3069 |
| LINE community | ID: @588katjx · [Join the community](https://lin.ee/PpA769D) |
| Pricing | [Pricing on our website](https://moonland.ai/pricing?direct) |

You can also email us directly with the form below.
`,
},

"feedback": {
  src: "d40fbab4", t: "Feedback",
  d: "",
},

});
