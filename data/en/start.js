// 英文翻譯：開始使用（AI 翻譯，2026-11-23，對照正式網站當天的中文）
// 伺服器啟動時，還沒有英文版的頁面會匯入成「英文草稿」（server/editor.js 的 importEnSeed），要有人看過、取消草稿才公開
// 匯入之後以編輯後台為準，改這個檔案不會影響已經匯入的頁面；這個檔案不對外提供
// src 是翻譯時中文的簽章（model.js 的 zhSig）：中文之後改過，後台會標「英文待更新」
// 名稱照 moonland.ai 本站英文版（data/en/terms.json）：點數 Points、登月幣 Coins、交談 Chat、實驗室 Lab、社群藝廊 Gallery
(window.EN_SEED = window.EN_SEED || { pages: {}, sections: {}, groups: {} });
Object.assign(EN_SEED.pages, {

"quick-start": {
  src: "8503ddcd", t: "5-minute quick start", n: "Quick start",
  d: "New to moonland.ai? Follow these steps to create your first image and first video in five minutes.",
  body: `
:::tip What you'll learn
Log in, create your first image in Chat, tweak the details, then turn the image into a video.
:::

## Four steps

:::steps
@ Log in
Personal accounts can log in directly. If you received a trial code from an event or course, see [Logging in with a trial account](#trial-login); team members, see [Team sign-up & login](#team-login).

@ Create your first image in Chat
Click "Chat" in the left menu and describe the picture you want in one sentence, using at least two descriptive words. The AI assistant picks a suitable model for you.
> An orange kitten using a vacuum cleaner, 1:1

@ Fix what you don't like
Just tell the AI what to change in the same conversation, for example "change the background to a kid's bedroom". To replace a character or combine several images, see [Editing & compositing](#chat-edit).

@ Bring the image to life
In Chat, describe the motion and camera to generate a video. For finer control, go to [Image to video (i2v)](#v-i2v).
> A kitten in a spacesuit stares at the camera, then suddenly turns to look at a meteor falling behind it, 16:9, 10 seconds
:::

## What to read next

- [Writing prompts](#chat-prompts): formulas for describing images, text designs, videos and music
- [Image generation basics](#img-basics): choose the model and adjust settings yourself
- [Model guide](#models): when you're not sure which model to use
- [Points & Coins](#credits): how each feature is charged
`,
},

"credits": {
  src: "0755600c", t: "Points & Coins",
  d: "How the platform's two billing units differ, how much each generation costs, and how Points work for teams.",
  body: `
Generating images or videos on moonland.ai uses two kinds of "money": **Points** and **Coins**.

- **Points**: for moonland.ai's own AI tools. Most features use Points.
- **Coins**: for other AI tools (such as OpenAI and Kling).

The two can't be exchanged for each other.

| | Points | Coins |
| --- | --- | --- |
| What they're for | moonland.ai's own AI tools | External tools |
| How to get them | 1,000 free Points a day once your account is verified; on Education and Business team plans, admins give them to members | If you'd like to buy some, contact us directly |
| How long they last | Depends on the team plan | They don't expire |

The daily 1,000 Points only arrive after you verify your account. Free accounts have no Coins. To use Coins models, [top up Coins](#credit-tools) or use a plan that includes Coins.

## How much does it cost

Open "Select tool". At the top, the **coin** icon is for Points models and the **moon** icon is for Coins models; click one to list only that kind. Each model shows roughly how many Points or Coins it costs:

[i 621 The coin is Points, the moon is Coins]

**Before you send, the cost of that generation is always shown again**, and nothing is charged until you confirm.

The Points a generation uses depend on the model you're using.

Operations that use a lot of Points:

| Operation | Notes |
| --- | --- |
| Chat | Each message uses 2 "AI assistant Points"; the actual generation is then charged at each tool's normal price |
| Video generation | Both resolution and length affect the Points |
| Frame interpolation | Makes motion smoother when turned on, but uses more Points |
| Upscaling (SeedVR2) | Costs far more than a normal generation. Only upscale images you're sure you want to keep |
| Music generation | Costs vary a lot between models. See [Points music models](#m-music) |

:::tip Try a low setting first
This applies to both Points and Coins: for video, check the result at a short length and low resolution first (for example 480P, 5 seconds), then raise the settings once you're happy.
:::

## Avoid spending too much by accident

Keep "Auto-allow small generations" on in [Chat settings](#chat-settings): any single generation over 100 Points, or any generation that uses Coins, asks you to confirm before it's sent.

## Points on team accounts {#h-team-points}

When a school or company buys a team plan, it gets a batch of Points (Business plans also include Coins), which the admin gives out to members.

- New members start with **no Points** until an admin allocates some
- Admins can give or take back Points at any time
- Fixed daily Points **reset to zero at the end of the day**; unused Points don't carry over to the next day
- When a member is deactivated, their Points go to zero; after they're reactivated, Points start again the next day

For how to allocate them, see [Admin 4 | Allocating Points & Coins](#admin-4).

## Trial accounts

Trial accounts come with plenty of free Points but only work until 23:59 on their expiry date. See [Logging in with a trial account](#trial-login).
`,
},

"credit-tools": {
  src: "5837de77", t: "Top up Coins",
  d: "Who needs to top up, how to buy Coins with a credit card, and the premium benefits that come with each top-up.",
  body: `
To use [Coins models](#credit-image) you need Coins first. For what Coins are and how they differ from Points, see [Points & Coins](#credits).

## How to get them

| Who | How |
| --- | --- |
| Individual users | Top up yourself |
| Companies and studios | Business plans include Coins |
| Schools | Email us about team plans |

- Coins **don't expire**; they last until you use them up.
- On team accounts, admins give Coins to members. See [Admin 4 | Allocating Points & Coins](#admin-4).
- For questions about buying, payment or team plans, [contact us](#contact).

## How to top up

:::steps
@ Choose an amount
Drag the slider or type an amount. The top of the screen shows how many Coins you'll get.
[i 594 The Coins top-up screen]

@ Enter the payer's details
Enter a name, phone number and email. These are only used to verify the card and send the invoice.

@ Choose an invoice
An e-invoice is selected by default.

@ Enter your card and pay
Enter the card number, expiry date and the security code on the back, then click "Pay". The card must pass 3D Secure (your bank will text or notify you to confirm). Payment is handled by TapPay; the website doesn't keep your card details.
:::

:::tip Every top-up includes premium benefits
Each time you top up Coins you also get one year of **premium benefits**, such as private generation and more workspaces. The year starts from the day that payment goes through.
:::

## Using Coins after you top up

In "Select tool", click the **moon** icon to list only Coins models. For how much each generation costs and how to avoid overspending, see [Points & Coins](#credits).
`,
},

"trial-login": {
  src: "be4323f3", t: "Trial account guidelines", n: "Trial accounts",
  d: "One-time accounts from events and courses: how to get one, how to log in, and what to do before it expires.",
  body: `
:::tip Before you start
Please read our [terms of service](https://moonland.ai/terms-of-service) before using your account.
:::


A trial account is a one-time moonland.ai account for people attending events or courses. You don't need to sign up, and you get plenty of generation Points while it's active.

:::warn Your data is deleted when it expires
A trial account only works until **23:59 on its expiry date**. After that you can't log in or open anything you generated. **Download** any work you want to keep to your own computer before then.
:::

## How to get one

- Attend an official moonland.ai talk or workshop
- Become a certified moonland.ai instructor
- Host an educational event in partnership with us

If you're interested in working with us, [contact us](#contact).

## How to log in

On the login screen, choose trial account login and enter the code from the event organizer.

[i 386 Trial account login screen]
`,
},

"gallery": {
  src: "c866d6d7", t: "Finding inspiration in the Gallery", n: "Gallery",
  d: "Browse other users’ work, see the settings they used, and apply them with one click.",
  body: `
The Gallery collects work from other users. When you're short on ideas, have a look around.

[i 489 Gallery home]

## See the settings and reuse them

Click any piece to see its prompt and settings; the quick options below it let you generate with the same setup.

[i 490 Details and quick options for a piece]

## Search by topic

Use the platform's search to find work on a particular topic.

[i 491 Searching the gallery]
`,
},

});
