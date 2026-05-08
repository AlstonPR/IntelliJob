This is looking REALLY good now — the current UI, cinematic interactions, motion effects, dark luxury aesthetic, scrolling behavior, floating panels, typography, and overall immersive feel are PERFECT. No major UI redesign changes are needed. Keep the current visual direction exactly the same.

Now make the following updates and feature additions carefully across the project.

Change the product name everywhere from:

* “Nexus / Nexus AI”
  to:
* “IntelliJob”

This includes:

* navbar
* logo text
* hero section
* dashboard
* authentication pages
* placeholders
* loading screens
* footer
* meta titles

Keep the same futuristic score visualization UI.

Keep About and Contact routes/pages for now.

Do NOT fully design them yet.

Only:

* dark placeholders
* cinematic backgrounds
* “Coming Soon” style sections

We will build them later.

Current requirement:

* Clicking “Get Started” should navigate to Login Page

For now:

* implement temporary dummy authentication logic only
* no real database yet

VERY IMPORTANT:
Leave clear placeholder comments where backend/database code will later be added.

Example:

```js
// TODO: Add Firebase/Supabase/Auth backend here
// Temporary dummy login for UI testing
```

Temporary behavior:

* entering dummy credentials logs user in
* redirects to Dashboard

This is NOT a social networking platform.

Remove:

* profile views
* follower/following sections
* social stats
* networking features
* public profile analytics

Keep IntelliJob focused ONLY on:

* AI job matching
* resume analysis
* personalized resumes
* AI preferences
* interview preparation
* automated recommendations

In Dashboard:
Create a proper Upload Resume panel with:

* Upload Resume button
* drag & drop support
* PDF only uploads
* elegant upload animation
* uploaded file preview card
* success upload state

IMPORTANT:
Leave placeholder comments for backend upload/storage logic.

Example:

```js
// TODO: Connect file upload backend here
// TODO: Store uploaded PDF securely
```

AI Preferences should NOT be inside Settings.

Create a completely separate major dashboard section called:

“AI Preferences”

Place it directly BELOW Upload Resume.

This is one of the MOST important sections of IntelliJob.

Users should be able to naturally describe what they personally want from jobs.

Example:
“I want remote startup jobs with flexible timings, creative teams, good work-life balance, and strong growth opportunities.”

The AI should visually extract:

* preferred work culture
* startup vs corporate
* remote/hybrid preference
* salary expectations
* flexibility
* role interests
* growth preference

UI REQUIREMENTS:

* futuristic textarea
* floating AI tags
* live extraction effects
* premium AI analysis visuals
* cinematic interaction design

Settings page should now ONLY contain:

* preferred email
* notification frequency
* recommendation count
* alert timing
* automation toggles
* placeholder theme settings

Remove AI Preferences from Settings completely.

Add a NEW feature section inside Dashboard and Job Match flow.

When users receive matched jobs, each job card should also include:

“Interview Preparation”

When opened, show:

* expected interview topics
* likely technical questions
* HR questions
* behavioral questions
* company-specific preparation tips
* required skills to revise
* AI-generated preparation roadmap

Example:
For a frontend developer role:

* React questions
* JavaScript concepts
* system design basics
* HR interview questions
* portfolio preparation tips

UI STYLE:

* futuristic preparation cards
* expandable accordion sections
* glowing topic tags
* premium study dashboard feel

This feature should feel like:
“AI helping the user prepare for the actual interview.”

Add another major feature section.

When AI generates a customized resume for a specific job:
show it as a separate futuristic card.

Card examples:

* “Your personalized resume is ready”
* “Resume optimized for Frontend Developer @ Stripe”
* “JS Score improved from 74 → 91”

Card should include:

* preview button
* download button
* generated timestamp
* AI optimization indicators

Use:

* floating glassmorphism cards
* glowing accents
* premium futuristic motion

This should feel like:
“The AI has already prepared the best version of your resume for this exact role.”

Sidebar should now contain:

* Dashboard
* Upload Resume
* AI Preferences
* AI Analysis
* Job Matches
* Interview Preparation
* Personalized Resumes
* Alerts
* Settings

The current UI direction is PERFECT.

Do NOT redesign the overall aesthetic.

Keep:

* cinematic dark UI
* luxury tech aesthetic
* immersive storytelling
* floating panels
* cursor-reactive interactions
* smooth scrolling
* layered gradients
* premium motion design
* editorial typography
* futuristic dashboard style

The current visual quality is exactly the direction we want for IntelliJob.
