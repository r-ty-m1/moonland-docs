// 開始使用（英文版）：文章代號與 data/start.js 相同，只放標題 t、摘要 d、內文 body
// 等級、分鐘數、模型等沿用中文版。寫法同 README.md 的「文章標記語法」
(window.ARTICLES_EN = window.ARTICLES_EN || {}) && Object.assign(window.ARTICLES_EN, {

'quick-start': {
  t: '5-minute quick start', n: 'Quick start',
  d: 'New to moonland.ai? Follow these steps to create your first image and first video in five minutes.',
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
- [Credits & Moon Coins](#credits): how each feature is charged
`},

'credits': {
  t: 'Credits & Moon Coins',
  d: 'The platform’s two billing units, which actions cost more, and the rules for team credits.',
  body: `
moonland.ai has two billing units: **credits** pay for the platform's built-in generation tools, and **Moon Coins** pay for [external models](#credit-tools) such as Seedance and Kling. For prices, see the [moonland.ai pricing page](https://moonland.ai/pricing?direct).

## What costs more

| Action | Notes |
| --- | --- |
| Chat | Each message uses 2 "AI assistant credits"; the actual generation is charged at each tool's normal price |
| Video generation | Both resolution (480P / 720P) and length affect the cost; 720P costs noticeably more |
| Frame interpolation | Makes motion smoother but adds to the cost |
| Upscaling (SeedVR2) | Costs far more than normal generation; only upscale images you're sure you want to keep |
| IP-Adapter style transfer | The extra style-transfer step uses more credits |
| Music generation | Costs vary a lot between models; see [Music models compared](#m-music) |

:::tip Test at low settings first
Try videos at 480P and 5 seconds to check the result, then raise the resolution or length once you're happy.
:::

## Avoid spending too much by accident

Keep "Auto-approve small generations" on in [Chat settings](#chat-settings): any single generation over 100 credits, or any generation that uses Moon Coins, will ask you to confirm before it runs.

## Credit rules for team accounts

- New members start with **no credits** until an admin allocates some
- Shared team credits **don't expire**; admins can give or take them back at any time
- Fixed daily credits **reset to zero at the end of the day**; unused credits don't carry over
- When a member is deactivated their credits go to zero; after reactivation, credits start counting again the next day

For how to allocate credits, see [Admin 4 | Allocating credits & Moon Coins](#admin-4).

## Trial accounts

Trial accounts come with plenty of free credits but only work until 23:59 on the expiry date. See [Logging in with a trial account](#trial-login).
`},

'trial-login': {
  t: 'Logging in with a trial account', n: 'Trial accounts',
  d: 'One-time accounts from events and courses: how to get one, how to log in, and what to do before it expires.',
  body: `
A trial account is a one-time moonland.ai account for people attending events or courses. You don't need to sign up, and you get plenty of generation credits while it's active.

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
`},

'gallery': {
  t: 'Finding inspiration in the Community Gallery', n: 'Community Gallery',
  d: 'Browse other users’ work, see the settings they used, and apply them with one click.',
  body: `
The Community Gallery collects work from other users. When you're short on ideas, have a look around.

[i 489 Community Gallery home]

## See the settings and reuse them

Click any piece to see its prompt and settings; the quick options below it let you generate with the same setup.

[i 490 Details and quick options for a piece]

## Search by topic

Use the search box in the top-right corner to find work on a particular topic.

[i 491 Searching the gallery]
`},

});
