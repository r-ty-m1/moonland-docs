// 團隊管理（英文版）
(window.ARTICLES_EN = window.ARTICLES_EN || {}) && Object.assign(window.ARTICLES_EN, {

'team-login': {
  t: 'Team sign-up & login',
  d: 'How to sign up and log in after you receive a team invitation, and how to reset your own password.',
  body: `
Once team features have been purchased and enabled, you log in with **team login**.

## Signing up and logging in

:::steps
@ Accept the invitation in your inbox
Click the link in the invitation email (or copy it into your browser), enter a **name** and **set a password** to finish signing up.
:::row
[i 483]
|||
[i 484]
:::
:::warn The team code and email can't be changed
You can change your name and password later, but not the team code or email address.
:::
Invitation links are valid for **24 hours**. If yours has expired, ask your team admin to send the invitation again.

@ Choose team account login
Enter the **team code** and your account and password.
[i 485]

@ You're logged in
[i 486]
:::

## Forgot your password

:::steps
@ Request a reset in Settings
**Settings > Personal > Reset password**.
[i 487]

@ Set a new password from your inbox
Click "Reset password" in the reset email (or copy the link into your browser) and set a new password. Use the new password next time you log in.
[i 488]
:::

You can also ask your team admin to send you a reset email. See [Admin 5 | Account status](#admin-5).
`},

'projects': {
  t: 'Projects',
  d: 'Create projects by style, story or job, and keep your generated images and videos organized.',
  body: `
Projects let you group generated images and videos in one place by **style, story, current job** and so on.

:::row
[i 209]
|||
[i 210]
:::

## Creating a project

:::steps
@ Open "Team projects"
Open "Team projects" in the side toolbar to see existing projects and create new ones.

@ Add a project
Click "New project" in the top-right of the window, enter a name and submit. A new project has no content yet, so its preview is black.
:::

## Adding work to a project

:::steps
@ Find the work to add
Select an image or video in Chat, Generate or Lab. You can only add work you generated yourself.

@ Open more options
Click the more-options menu in the top-right of the work.

@ Choose "Add to project"

@ Tick the project
Choose an existing project, or **create a new one** right there. When you're done, click anywhere empty or close the window.
:::
`},

'admin-1': {
  t: 'Admin 1 | Tour & tag setup',
  d: 'Find the team management screen and create tags before you invite members.',
  body: `
These six lessons are for team admins. Work through them in order and you'll know the whole team back office.

| Lesson | Content |
| --- | --- |
| 1 Tour & tag setup | Find the admin screen, create tags |
| [2 Inviting members](#admin-2) | Single and batch invitations, setting roles |
| [3 Grouping with tags](#admin-3) | Tagging in bulk, filtering the list |
| [4 Allocating credits & Moon Coins](#admin-4) | Tracking sign-ups, giving and taking back credits |
| [5 Account status](#admin-5) | Password resets, deactivating, restoring, deleting |
| [6 Viewing member info](#admin-6) | Viewing details, searching and filtering |

## Finding the team management screen

Path: **Member info → Team members**

[i 283]
[i 284]

## Create tags first

If you're inviting lots of members, we recommend **creating tags first**. Tags let you group people by department, team, class or project, so you can later give or take back credits and Moon Coins, or deactivate and reactivate accounts, by tag in one go.

:::steps
@ Open tag settings
**Manage → Tag settings → Add**
[i 285]

@ Set the name and color
Click "Add", enter a tag name and choose a color.
:::row
[i 286]
|||
[i 287]
:::
:::

Once created, use "Filter tags" in the top-left to show only certain groups:

[i 288]

Next lesson: [Admin 2 | Inviting members](#admin-2)
`},

'admin-2': {
  t: 'Admin 2 | Inviting members',
  d: 'Single invitations and batch invitations (up to 40 emails at a time), and setting member roles.',
  body: `
Once your tags are ready, you can invite members.

:::warn Roles can't be changed after sending
Set the role when you invite (team member or team admin; there's no limit on the number of admins). It can't be changed once the invitation is sent.
:::

## Opening the invitation window

Click **Manage > Add member** on the right of the screen.

[i 279]

## Single invitation

Enter an email address and confirm to send the invitation. You can set the role at the same time.

[i 280]

Click "Add" below to open more fields:

[i 281]

## Batch invitation

Enter up to **40** email addresses at once. They currently have to be typed in; you **can't import from Excel**, and you can't exceed the team's member limit.

[i 282]

:::tip Tag each batch right after sending
After sending a batch of invitations, tag those members straight away before moving on to the next batch, so the lists don't get mixed up. See [Admin 3](#admin-3).
:::

## Members accept the invitation

Members click "Accept invitation" in their email, or copy the link into a browser, to finish signing up. Invitation links are valid for **24 hours**.

[i 399]

When the list shows "Registered", the member has finished signing up:

[i 400]

For the member's side of sign-up, see [Team sign-up & login](#team-login).

Next lesson: [Admin 3 | Grouping with tags](#admin-3)
`},

'admin-3': {
  t: 'Admin 3 | Grouping with tags',
  d: 'Tag many members at once, and use "Filter tags" to exclude groups you’ve already sorted.',
  body: `
Once the member list is set up, you can tag lots of people at once by ticking them and using "Batch actions".

## First batch: select all, then tag

:::steps
@ Select all
Tick the checkbox to the left of the list header to select every account.
[i 198]

@ Tag in bulk
Use "Batch actions" in the top-right to apply a tag to the selected members. You can also tick only some members, or set a tag for one member from the menu on their right.
[i 199]
[i 200]
:::

When you're done it looks like this:

[i 201]

## Second batch: exclude groups you've already sorted

:::warn Select all selects everyone
When tagging the second group, select all also picks up members who already have tags.
:::

:::row
[i 202]
|||
[i 203]
:::

The fix is to use "Filter tags" in the top-left and untick the groups that shouldn't change:

:::steps
@ Select all accounts
[i 204]
@ Open "Filter tags" in the top-left and find the group that shouldn't change
[i 205]
@ Untick that group
[i 206]
@ Go back to "All" and check the group has been excluded
[i 207]
@ Apply the new tag with "Batch actions"
[i 208]
:::

Next lesson: [Admin 4 | Allocating credits & Moon Coins](#admin-4)
`},

'admin-4': {
  t: 'Admin 4 | Allocating credits & Moon Coins',
  d: 'Track who has signed up, resend expired invitations, and give or take back credits and Moon Coins.',
  body: `
## Tracking sign-ups

Click the "Status" column on the right to sort the list into "Registered" and "Invited".

[i 191]

## Resending expired invitations

Invitation links are valid for **24 hours**. If a member hasn't signed up in time, the admin needs to click "Re-invite" to send it again.

[i 192]
[i 193]

:::warn Re-invite can't be done in bulk
Invitations can only be resent one at a time, so remind members to sign up within 24 hours.
:::

## Allocating credits

:::note Allocate before they start
New members start with **no credits**, so allocate some before they begin. Team credits don't expire and can be given or taken back at any time.
:::

### One member

:::steps
@ Check team credits
Go to **Member info > Team members** and check the team status and credits in the options on the right.
[i 387]
@ Choose "Transfer unallocated team credits"
[i 388]
@ Enter the credits to give or take back
[i 389]
:::

### Several members at once

Tick the members, click "Batch actions" in the top-right, and choose "Batch credit transfer" or "Batch Moon Coin transfer". Admins can choose to "Give" or "Take back".

[i 194]

:::row
[i 195 Giving in bulk]
|||
[i 196 Taking back in bulk]
:::

When giving, use the slider in the middle or type a number. When taking back, enter an amount, or tick "Take back all extra credits from every member" to reclaim them in one click.

[i 390]

:::row
[i 391 Giving everyone the same credits]
|||
[i 392 Taking back all members' credits]
:::

To adjust just one member, work directly in that member's row:

[i 197]

## Credit rules

- Fixed daily credits **reset to zero at the end of the day**; unused credits don't carry over
- The system records each member's credits, Moon Coins and generations used each month. See [Admin 6](#admin-6)

Next lesson: [Admin 5 | Account status](#admin-5)
`},

'admin-5': {
  t: 'Admin 5 | Account status',
  d: 'Reset members’ passwords, and deactivate, restore or delete accounts.',
  body: `
## Resetting a member's password

:::steps
@ Send the reset email
Go to **Team members > Actions**, click "Reset password" in the options to the right of the member, then confirm to send it.
[i 401]

@ The member sets a new password from their inbox
Ask the member to open the reset email and click "Reset password", or copy the link into a browser.
[i 402]
:::

Members can also reset it themselves. See [Team sign-up & login](#team-login).

## Deactivating and restoring

:::warn Before you deactivate
- When deactivated, the member's **credits go to zero**
- After reactivation, credits start counting again **the next day**
:::

### Deactivating or restoring in bulk

:::steps
@ Tick the accounts to change
[i 183]
@ Click Manage in the top-right → Bulk member management → Batch deactivate or restore
[i 184]
:::

### One account

Deactivate or restore directly from the actions menu to the right of the member:

[i 185]
[i 405]

### Finding deactivated members

Deactivated members are hidden automatically to keep the list tidy. To find or restore them:

:::steps
@ Click "Show deactivated members" in the top-left
[i 186]
@ Sort by "Status"
[i 187]
@ Choose "Restore member" to the right of that member
[i 406]
:::

[i 188]

When the list shows "Registered", the member has been restored:

[i 407]

## Actions available by status

:::row
[i 189 Registered members]
|||
[i 190 Invited members who haven't signed up]
:::

For members who haven't signed up yet (Invited), besides deactivating you can also "Re-invite" or "Delete member". See [Admin 6](#admin-6).

Next lesson: [Admin 6 | Viewing member info](#admin-6)
`},

'admin-6': {
  t: 'Admin 6 | Viewing member info',
  d: 'View each member’s tags, role, status, email and credit usage, and search quickly.',
  body: `
Click the **eye (view)** icon on the right of the list to expand a member's details: name, tags, role, email, status, and credit and Moon Coin usage.

[i 170]

## Tags

[i 171]

When there are lots of members, type a name into "Search" in the top-left, or use "Filter tags" (for example: Class B) to find a group quickly.

[i 172]

Members without tags don't show a label:

[i 173]

## Role

[i 174]

There are two roles: "Team admin" and "Team member".

[i 175]

:::warn Roles can't be changed
The role must be set when the invitation is sent; it can't be changed afterwards.
:::

## Credits and Moon Coins

The system shows each member's "Total available credits" (including extra credits). Fixed daily credits **reset to zero at the end of the day**; unused credits don't carry over.

[i 176]

It also records each member's "Credits used this month", "Moon Coins used this month" and "Generations this month", making it easy to review resources.

[i 177]

## Status

[i 178]

| Status | What you can do |
| --- | --- |
| Registered | Edit tags, transfer unallocated team credits or Moon Coins, deactivate the member |
| Invited | Edit tags, transfer resources, re-invite, delete the member |

:::row
[i 179 Registered]
|||
[i 180 Invited]
:::

## Email

[i 181]

Open the email column to look up each member's account details, handy for reconciling and checking.

[i 182]

Congratulations on finishing all six lessons! Back to the [course overview](#admin).
`},

});
