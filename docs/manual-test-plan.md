# Manual Test Plan — 99Bitcoins WordPress

**Project:** 99Bitcoins WordPress Site
**Environment:** Local (`https://99bitcoins.local`) / Staging (`https://staging.99bitcoins.com`)
**Prepared by:** QA Team
**Date:** 2026-03-24

---

## Table of Contents

1. [Scope](#1-scope)
2. [Test Environments](#2-test-environments)
3. [Entry & Exit Criteria](#3-entry--exit-criteria)
4. [Test Suites](#4-test-suites)
   - [TS-01 Authentication](#ts-01-authentication)
   - [TS-02 Admin Dashboard](#ts-02-admin-dashboard)
   - [TS-03 Post Creation](#ts-03-post-creation)
   - [TS-04 Page Creation](#ts-04-page-creation)
   - [TS-05 Plugin Management](#ts-05-plugin-management)
   - [TS-06 Shortcodes in Posts](#ts-06-shortcodes-in-posts)
   - [TS-07 Shortcodes in Pages](#ts-07-shortcodes-in-pages)
   - [TS-08 Homepage Sections (Regression)](#ts-08-homepage-sections-regression)
   - [TS-09 Header Section (Regression)](#ts-09-header-section-regression)
   - [TS-10 Media Library](#ts-10-media-library)
   - [TS-11 Crypto Presales Toplist](#ts-11-crypto-presales-toplist)
   - [TS-12 Article Page (Regression)](#ts-12-article-page-regression)
   - [TS-13 Category Page (Regression)](#ts-13-category-page-regression)
   - [TS-14 Mobile Navigation](#ts-14-mobile-navigation)
   - [TS-15 Search Results (Regression)](#ts-15-search-results-regression)
   - [TS-16 Visual Regression](#ts-16-visual-regression)
5. [Test Summary](#5-test-summary)

---

## 1. Scope

This document covers manual verification of the 99Bitcoins WordPress site across the following functional areas:

| Area | Coverage |
|------|----------|
| Authentication | Admin login via session |
| Admin Dashboard | Widgets, sidebar, quick draft |
| Content Creation | Posts and pages |
| Plugin Management | Install, activate, deactivate, delete |
| Shortcodes | Rendering in posts and pages |
| Media Library | Upload and manage media files |
| Homepage (Regression) | All homepage sections |
| Header (Regression) | Navigation, search, language switching |
| Article Page (Regression) | Content, author info, trust section |
| Category Page (Regression) | Article cards, links |
| Mobile Navigation | Hamburger menu, mobile layout |
| Search Results | Query results, article cards |
| Crypto Presales Toplist | Navigation, submenu, per-page toplist |
| Visual Regression | Full-page and component screenshots |

---

## 2. Test Environments

| Environment | URL | Purpose |
|-------------|-----|---------|
| Local | `https://99bitcoins.local` | Development testing |
| Staging | `https://staging.99bitcoins.com` | Pre-release regression |

**Browsers:** Chrome, Firefox, Safari (WebKit)
**Additional device:** iPhone 12 (for mobile shortcode and navigation tests)

---

## 3. Entry & Exit Criteria

### Entry Criteria
- WordPress admin credentials are available
- Local or staging environment is accessible
- All required plugins are installed and active

### Exit Criteria
- All test cases executed
- All critical and high defects resolved or deferred with sign-off
- Test results documented

### Severity Levels
| Level | Description |
|-------|-------------|
| Critical | Blocks core functionality (login, content creation) |
| High | Feature broken, no workaround |
| Medium | Feature partially broken, workaround exists |
| Low | Cosmetic or minor UX issue |

---

## 4. Test Suites

---

### TS-01 Authentication

**Objective:** Verify admin login works correctly.

---

#### TC-01-01 — Admin Login

| Field | Detail |
|-------|--------|
| **Priority** | Critical |
| **Preconditions** | WordPress is accessible |

**Steps:**

1. Navigate to `https://99bitcoins.local/wp-admin`
2. Enter valid admin username
3. Enter valid admin password
4. Click **Log In**

**Expected Result:**
- Redirected to WordPress Admin Dashboard (`/wp-admin/`)
- Dashboard heading "Dashboard" is visible
- Admin bar is present at the top of the page

---

### TS-02 Admin Dashboard

**Objective:** Verify all dashboard widgets and navigation elements render correctly after login.

---

#### TC-02-01 — Dashboard Loads Successfully

| Field | Detail |
|-------|--------|
| **Priority** | High |
| **Preconditions** | User is logged in |

**Steps:**

1. Navigate to `/wp-admin/`
2. Observe the page

**Expected Result:**
- Page title contains "Dashboard"
- "Dashboard" heading is visible on the page

---

#### TC-02-02 — Admin Bar Elements

| Field | Detail |
|-------|--------|
| **Priority** | Medium |
| **Preconditions** | User is logged in, on Dashboard |

**Steps:**

1. Observe the admin bar at the top of the page
2. Check for Screen Options button
3. Check for Help button

**Expected Result:**
- Admin bar is visible
- "Screen Options" and "Help" buttons are present

---

#### TC-02-03 — Sidebar Menu Items

| Field | Detail |
|-------|--------|
| **Priority** | Medium |
| **Preconditions** | User is logged in, on Dashboard |

**Steps:**

1. Observe the left sidebar
2. Verify the following items are visible: Dashboard, Posts, Media, Pages, Comments, Plugins, Users, Tools, Settings

**Expected Result:**
- All main sidebar menu items are visible and clickable

---

#### TC-02-04 — Quick Draft Widget Display

| Field | Detail |
|-------|--------|
| **Priority** | Medium |
| **Preconditions** | User is logged in, on Dashboard |

**Steps:**

1. Locate the **Quick Draft** widget (`#dashboard_quick_press`)
2. Check for the title input field
3. Check for the content textarea
4. Check for the **Save Draft** button

**Expected Result:**
- Title input (`input[name="post_title"]`) is visible
- Content textarea (`textarea[name="content"]`) is visible
- "Save Draft" button (`#save-post`) is visible

---

#### TC-02-05 — Save Quick Draft

| Field | Detail |
|-------|--------|
| **Priority** | Medium |
| **Preconditions** | User is logged in, on Dashboard |

**Steps:**

1. In the **Quick Draft** widget, enter a unique title (e.g. `Test Draft 12345`)
2. Enter content (e.g. `Draft content for testing`)
3. Click **Save Draft**

**Expected Result:**
- Draft is saved without error
- Title appears in the **Recent Drafts** section below the form

---

#### TC-02-06 — At a Glance Widget

| Field | Detail |
|-------|--------|
| **Priority** | Low |
| **Preconditions** | User is logged in, on Dashboard |

**Steps:**

1. Locate the **At a Glance** widget (`#dashboard_right_now`)
2. Check post count
3. Check page count

**Expected Result:**
- Post count is a number greater than 0
- Page count is a number greater than 0

---

#### TC-02-07 — Quiz Maker Widget

| Field | Detail |
|-------|--------|
| **Priority** | Low |
| **Preconditions** | User is logged in, on Dashboard |

**Steps:**

1. Locate the **Quiz Maker** widget (`#quiz-maker`)
2. Observe quiz statistics

**Expected Result:**
- Widget is visible and displays quiz data

---

#### TC-02-08 — Activity Widget

| Field | Detail |
|-------|--------|
| **Priority** | Low |
| **Preconditions** | User is logged in, on Dashboard |

**Steps:**

1. Locate the **Activity** widget (`#dashboard_activity`)
2. Check the **Recently Published** section
3. Check the **Recent Comments** section

**Expected Result:**
- Both sections are visible inside the widget
- At least one entry is present in each section

---

#### TC-02-09 — Site Health Widget

| Field | Detail |
|-------|--------|
| **Priority** | Low |
| **Preconditions** | User is logged in, on Dashboard |

**Steps:**

1. Locate the **Site Health** widget (`#dashboard_site_health`)
2. Observe the health status

**Expected Result:**
- Widget is visible and displays a site health status

---

### TS-03 Post Creation

**Objective:** Verify a WordPress post can be created, published, and viewed on the front end.

---

#### TC-03-01 — Create and Publish a Post

| Field | Detail |
|-------|--------|
| **Priority** | Critical |
| **Preconditions** | User is logged in |

**Steps:**

1. Navigate to `/wp-admin/post-new.php`
2. Verify URL contains `post-new.php`
3. Enter a unique title in the **Add title** field (e.g. `Test Post 12345`)
4. Enter body content in the content editor
5. In the **Categories** panel, check the **News** category
6. Click **Publish**
7. After publishing, click the permalink / **View post** link

**Expected Result:**
- Page redirects to the published post URL matching `/test-post|p=/i`
- Post title is visible in the `<main>` content area
- Post body content is visible
- "News" category link is visible on the post page

---

### TS-04 Page Creation

**Objective:** Verify a WordPress page can be created, published, and viewed on the front end.

---

#### TC-04-01 — Create and Publish a Page

| Field | Detail |
|-------|--------|
| **Priority** | Critical |
| **Preconditions** | User is logged in |

**Steps:**

1. Navigate to `/wp-admin/post-new.php?post_type=page`
2. Verify URL contains `post-new.php?post_type=page`
3. Enter a unique title in the **Add title** field (e.g. `Test Page 12345`)
4. Enter body content in the content editor
5. Click **Publish**
6. After publishing, click the permalink / **View page** link

**Expected Result:**
- Page redirects to the published page URL matching `/test-page|page_id=/i`
- Page title is visible in the `<main>` content area
- Page body content is visible

---

### TS-05 Plugin Management

**Objective:** Verify plugins can be browsed, installed, activated, deactivated, and deleted.

---

#### TC-05-01 — Plugins Page Loads

| Field | Detail |
|-------|--------|
| **Priority** | High |
| **Preconditions** | User is logged in |

**Steps:**

1. Navigate to `/wp-admin/plugins.php`
2. Observe the plugins list

**Expected Result:**
- URL contains `plugins.php`
- Plugins table is visible
- Search input field is visible
- At least one plugin is listed

---

#### TC-05-02 — Activate a Deactivated Plugin

| Field | Detail |
|-------|--------|
| **Priority** | High |
| **Preconditions** | User is logged in; **Classic Widgets** plugin is installed and deactivated |

**Steps:**

1. Navigate to `/wp-admin/plugins.php`
2. Locate **Classic Widgets** (`classic-widgets`)
3. Verify it shows as inactive
4. Click **Activate** under Classic Widgets

**Expected Result:**
- Success message "Plugin activated" is shown
- Plugin now shows as active (deactivate link visible)

---

#### TC-05-03 — Deactivate an Active Plugin

| Field | Detail |
|-------|--------|
| **Priority** | High |
| **Preconditions** | User is logged in; **Classic Widgets** plugin is installed and activated |

**Steps:**

1. Navigate to `/wp-admin/plugins.php`
2. Locate **Classic Widgets** (`classic-widgets`)
3. Verify it shows as active
4. Click **Deactivate** under Classic Widgets

**Expected Result:**
- Success message "Plugin deactivated" is shown
- Plugin now shows as inactive (activate link visible)

---

#### TC-05-04 — Install a Plugin from WordPress Repository

| Field | Detail |
|-------|--------|
| **Priority** | Medium |
| **Preconditions** | User is logged in; **Health Check** plugin is NOT installed |

**Steps:**

1. Navigate to `/wp-admin/plugins.php`
2. Click **Add New Plugin**
3. Verify URL contains `plugin-install.php`
4. Search for `Health Check`
5. Click **Install Now** on the Health Check plugin result
6. After installation, navigate back to `/wp-admin/plugins.php`

**Expected Result:**
- Health Check plugin appears in the plugins list

---

#### TC-05-05 — Delete a Plugin

| Field | Detail |
|-------|--------|
| **Priority** | Medium |
| **Preconditions** | User is logged in; **Health Check** plugin is installed and deactivated |

**Steps:**

1. Navigate to `/wp-admin/plugins.php`
2. Locate **Health Check** (`health-check`)
3. Click **Delete** under Health Check
4. Confirm the deletion prompt

**Expected Result:**
- Success message confirming deletion is shown
- Health Check plugin no longer appears in the plugins list

---

### TS-06 Shortcodes in Posts

**Objective:** Verify each shortcode renders correctly when embedded in a WordPress post.

**Common Preconditions for all TC-06-xx:**
- User is logged in
- Navigate to `/wp-admin/post-new.php`
- Select category **News**
- Publish the post and open the permalink

**Common Pass Criteria:**
- Published URL matches `/\?p=\d+/`
- Shortcode raw tag (e.g. `[shortcode_name`) is NOT visible on the front end (shortcode rendered, not shown as text)

---

#### TC-06-01 — Key Takeaways Shortcode

**Steps:**
1. Create a new post with the following content:
```
[key_takeaways title="Key Takeaways" heading_type="h3"]
  [key_takeaways_list]
    [key_takeaway]User-friendly interfaces...[/key_takeaway]
    [key_takeaway]A wide range of cryptocurrencies...[/key_takeaway]
    [key_takeaway]High security standards...[/key_takeaway]
  [/key_takeaways_list]
[/key_takeaways]
```
2. Publish and open the post

**Expected Result:**
- "Key Takeaways" heading is visible
- All 3 bullet point texts are visible
- Raw tag `[key_takeaways` is NOT visible

---

#### TC-06-02 — Pros and Cons Chart Shortcode

**Steps:**
1. Create a new post with a `[pros_and_cons]` shortcode containing pros and cons list items
2. Publish and open the post

**Expected Result:**
- "Pros" and "Cons" labels are visible
- All list items (e.g. "Innovative social trading features", "Wide range of assets available") are visible
- Raw tag `[pros_and_cons` is NOT visible

---

#### TC-06-03 — Advantages and Disadvantages Note Box

**Steps:**
1. Create a new post with `[su_note]`, `[su_row]`, `[su_column]`, and `[su_list]` shortcodes forming a two-column Advantages/Disadvantages layout
2. Publish and open the post

**Expected Result:**
- "Advantages" and "Disadvantages" headings are visible
- All advantage and disadvantage items are visible

---

#### TC-06-04 — Highlighted Paragraph Shortcode

**Steps:**
1. Create a new post with:
```
[highlighted_paragraph heading="This is a highlighted section of the article"]...[/highlighted_paragraph]
```
2. Publish and open the post

**Expected Result:**
- Heading text "This is a highlighted section of the article" is visible
- Paragraph content beginning "By wielding this knowledge..." is visible
- Raw tag `[highlighted_paragraph` is NOT visible

---

#### TC-06-05 — Block Quote

**Steps:**
1. Create a new post with:
```
<blockquote>Lorem ipsum dolor sit amet...</blockquote>
```
2. Publish and open the post

**Expected Result:**
- Block quote text "Lorem ipsum dolor sit amet, consectetur adipiscing elit." is visible

---

#### TC-06-06 — Info Box Shortcode

**Steps:**
1. Create a new post with:
```
[su_box box_color="#E50123" title="Title"]Lorem ipsum...[/su_box]
```
2. Publish and open the post

**Expected Result:**
- "Title" heading of the box is visible
- Body text beginning "Lorem ipsum odor amet..." is visible
- Raw tag `[su_box` is NOT visible

---

#### TC-06-07 — Star Rating with Schema Shortcode

**Steps:**
1. Create a new post with:
```
[crypto-review size="h3" title="something" description="something" stars="4.5"]
```
2. Publish and open the post

**Expected Result:**
- Text "something" is visible
- Rating value "4.5" is visible
- Raw tag `[crypto-review` is NOT visible

---

#### TC-06-08 — Star Rating without Schema Shortcode

**Steps:**
1. Create a new post with:
```
[star-rating label="Review" stars="4.5"]
```
2. Publish and open the post

**Expected Result:**
- Label "Review" is visible
- Raw tag `[star-rating` is NOT visible

---

#### TC-06-09 — Step-by-Step Guide Shortcode

**Steps:**
1. Create a new post with a `[step_by_step_guide]` shortcode containing 4 steps
2. Publish and open the post

**Expected Result:**
- Guide title is visible (rendered as em dash: "Example Title – H2 A Step-by-Step Guide")
- Step items including "Guide list item 1 example..." and "Log in to your eToro account..." are visible
- Raw tag `[step_by_step_guide` is NOT visible

---

#### TC-06-10 — Key Highlights Table Shortcode

**Steps:**
1. Create a new post with `[su_list]` and `[su_note]` shortcodes containing "Random text 1", "Random text 2", "Random text 3"
2. Publish and open the post

**Expected Result:**
- All three random text items are visible
- Raw tag `[su_list` is NOT visible

---

#### TC-06-11 — Tips Table Shortcode

**Steps:**
1. Create a new post with `[su_list icon="icon: thumbs-up"]` and `[su_note]` shortcodes
2. Publish and open the post

**Expected Result:**
- "This can be a title", "Point 1", "Point 2" are visible

---

#### TC-06-12 — CTA Button Shortcode

**Steps:**
1. Create a new post with:
```
[button link="https://99bitcoins.com/visit/margex"]Visit Margex[/button]
```
2. Publish and open the post

**Expected Result:**
- A link with text "Visit Margex" is visible and clickable

---

#### TC-06-13 — Countdown Shortcode (Expired)

**Steps:**
1. Create a new post with:
```
[countdown date="15/12/2025 18:00:00" expired_message="The offer is expired."]
```
2. Publish and open the post

**Expected Result:**
- "The offer is expired." message is visible (date is in the past)

---

#### TC-06-14 — Green Checkmarks Checklist Shortcode

**Steps:**
1. Create a new post with a `[green_checkmarks_list]` shortcode containing items: "User-Friendly Interface", "Trading Fees", "Customer Support"
2. Publish and open the post

**Expected Result:**
- All three list item headings are visible

---

#### TC-06-15 — Verdict Shortcode

**Steps:**
1. Create a new post with a `[verdict]` shortcode with title "Our Verdict", button text "Visit CoinCasino", and verdict items including "Accepted Cryptocurrencies"
2. Publish and open the post

**Expected Result:**
- "Our Verdict" is visible
- "Visit CoinCasino" button/link is visible
- "Accepted Cryptocurrencies" item is visible

---

#### TC-06-16 — Multiple Shortcodes Combined in One Post

**Steps:**
1. Create a new post combining: `[highlighted_paragraph]`, `[green_checkmarks_list]`, `[star-rating]`, and `[verdict]` shortcodes
2. Publish and open the post

**Expected Result:**
- "Important Overview" (highlighted paragraph heading) is visible
- "Benefit 1" (checklist item) is visible
- "Overall" (star rating label) is visible
- "Final Verdict" (verdict title) is visible

---

### TS-07 Shortcodes in Pages

**Objective:** Verify all shortcodes from TS-06 render correctly in WordPress pages (not posts).

**Common Preconditions for all TC-07-xx:**
- User is logged in
- Navigate to `/wp-admin/post-new.php?post_type=page`
- Publish the page and open the permalink

**Common Pass Criteria:**
- Published URL matches `/page_id=\d+/`
- Shortcode raw tag is NOT visible on the front end

> **Note:** TC-07-01 through TC-07-16 mirror TC-06-01 through TC-06-16 exactly, with the only difference being that content is created as a **Page** (not a Post) and no category selection is required.

---

#### TC-07-17 — Key Takeaways with H3 Heading

| Field | Detail |
|-------|--------|
| **Priority** | High |

**Steps:**
1. Create a new page with `[key_takeaways title="Key Takeaways" heading_type="h3"]` containing 3 items
2. Publish and open the page

**Expected Result:**
- URL matches `/key-takeaways|page_id=/`
- "Key Takeaways" text is visible
- All 3 items are visible
- An `<h3>` element containing "Key Takeaways" is present

---

#### TC-07-18 — Key Takeaways without Heading Type

| Field | Detail |
|-------|--------|
| **Priority** | Medium |

**Steps:**
1. Create a new page with `[key_takeaways title="Important Points"]` (no `heading_type`) containing 2 items
2. Publish and open the page

**Expected Result:**
- "Important Points" is visible
- Both items ("First point", "Second point") are visible

---

#### TC-07-19 — Key Takeaways with H2 Heading and 5 Items

| Field | Detail |
|-------|--------|
| **Priority** | Medium |

**Steps:**
1. Create a new page with `[key_takeaways title="Summary" heading_type="h2"]` containing 5 Bitcoin-related items
2. Publish and open the page

**Expected Result:**
- "Summary" is visible
- All 5 items are visible
- An `<h2>` element containing "Summary" is present

---

#### TC-07-20 — Multiple Key Takeaways Blocks on One Page

| Field | Detail |
|-------|--------|
| **Priority** | Medium |

**Steps:**
1. Create a new page with 3 separate `[key_takeaways]` blocks with titles: "Introduction Highlights", "Advanced Topics", "Summary Points", separated by regular paragraph text
2. Publish and open the page

**Expected Result:**
- URL matches `/multiple-shortcodes|page_id=/`
- All 3 block titles and all their items are visible
- Intermediate paragraph text ("Some regular content between shortcodes", "Another paragraph of regular text content") is visible
- Raw shortcode tag `[key_takeaways` is NOT visible
- At least 3 key takeaway sections (CSS class `.key-takeaways` or `[class*="key-takeaway"]`) are present in the DOM

---

#### TC-07-21 — Malformed Shortcode Error Handling

| Field | Detail |
|-------|--------|
| **Priority** | High |

**Steps:**
1. Create a new page with this content:
   - Valid paragraph: "Valid content at the start of the page."
   - Malformed shortcode: `[key_takeaways]` (missing required `title` attribute)
   - Non-existent shortcode: `[nonexistent_shortcode_xyz]`
   - Valid paragraph: "Valid content at the end of the page."
2. Publish and open the page

**Expected Result:**
- Page loads without HTTP error (title does NOT contain "500", "503", "502", "Internal Server Error")
- Page title text is visible
- "Valid content at the start" is visible
- "Valid content at the end" is visible
- Page body does NOT contain "Fatal error:" or "Parse error:"

---

#### TC-07-22 — Missing Shortcode Parameters

| Field | Detail |
|-------|--------|
| **Priority** | High |

**Steps:**
1. Create a new page with:
   - Valid paragraph: "Introduction paragraph with valid content."
   - `[key_takeaways title="Topics Without Items"]` with an empty `[key_takeaways_list][/key_takeaways_list]`
   - Valid paragraph: "Conclusion paragraph with valid content."
2. Publish and open the page

**Expected Result:**
- URL does NOT match `/error|500/`
- "Introduction paragraph with valid content" is visible
- "Conclusion paragraph with valid content" is visible
- No visible PHP error, fatal error, or parse error on the page

---

#### TC-07-23 — Shortcode Rendering on Mobile (iPhone 12)

| Field | Detail |
|-------|--------|
| **Priority** | Medium |
| **Preconditions** | Browser set to iPhone 12 viewport (390×844) |

**Steps:**
1. Open browser in iPhone 12 emulation mode (viewport width < 500px)
2. Log in to WordPress admin
3. Create a new page with a Key Takeaways shortcode
4. Publish and open the page

**Expected Result:**
- URL matches `/shortcode-page|page_id=/`
- Key Takeaways title is visible
- All items are visible on the mobile viewport

---

### TS-08 Homepage Sections (Regression)

**Objective:** Verify all homepage sections display correctly on the staging site.

**Common Preconditions:** Navigate to `https://staging.99bitcoins.com`

---

#### TC-08-01 — Featured Articles Section

| Field | Detail |
|-------|--------|
| **Priority** | High |

**Steps:**
1. Navigate to the staging homepage
2. Locate the Featured Articles section

**Expected Result:**
- Exactly 3 article cards are visible
- Each card has an image and a title (paragraph element)

---

#### TC-08-02 — Top Stories Section

| Field | Detail |
|-------|--------|
| **Priority** | High |

**Steps:**
1. Locate the Top Stories section on the homepage

**Expected Result:**
- "Top Stories" label is visible
- Exactly 5 story items are present
- Each story has an image and a title

---

#### TC-08-03 — Crash Course Section

| Field | Detail |
|-------|--------|
| **Priority** | Medium |

**Steps:**
1. Locate the Crash Course section on the homepage

**Expected Result:**
- Section heading is visible
- Name input field is visible
- Email input field is visible
- Submit button is visible

---

#### TC-08-04 — Bitcoin Guides Section

| Field | Detail |
|-------|--------|
| **Priority** | Medium |

**Steps:**
1. Locate the Bitcoin Guides section on the homepage

**Expected Result:**
- "Bitcoins Guides" heading is visible
- Exactly 4 guide cards are present
- Each card has an image and a paragraph (title)

---

#### TC-08-05 — News Section

| Field | Detail |
|-------|--------|
| **Priority** | High |

**Steps:**
1. Locate the News section on the homepage
2. Check Bitcoin News Today, Altcoin News Today, and Presales columns
3. Click **View All News**

**Expected Result:**
- "Bitcoin News Today" heading and at least one article link are visible
- "Altcoin News Today" heading and at least one article link are visible
- "Presales" heading and at least one article link are visible
- "View All News" click navigates to `/news/`

---

#### TC-08-06 — Editor's Picks Section

| Field | Detail |
|-------|--------|
| **Priority** | Medium |

**Steps:**
1. Locate the Editor's Picks section
2. Check all 4 tabs: Top Articles, Guides, Comparisons, Reviews
3. Click the **Guides** tab
4. Click the **Comparisons** tab
5. Click the **Reviews** tab

**Expected Result:**
- Section heading is visible
- All 4 tabs are visible
- "Top Articles" is active by default (has CSS class `is-active`)
- Each clicked tab becomes active

---

#### TC-08-07 — Trust Section

| Field | Detail |
|-------|--------|
| **Priority** | Medium |

**Steps:**
1. Locate the Trust Section on the homepage

**Expected Result:**
- Trust section heading is visible
- Stats visible: "10+ Years", "90hr+", "100k+", "50+", "2000+"
- "Featured in:" text is visible

---

### TS-09 Header Section (Regression)

**Objective:** Verify header elements, navigation, search, and language switching work correctly on staging.

**Common Preconditions:** Navigate to `https://staging.99bitcoins.com`

---

#### TC-09-01 — Logo Navigation

| Field | Detail |
|-------|--------|
| **Priority** | High |

**Steps:**
1. Locate the 99Bitcoins logo link in the header
2. Verify the `href` attribute
3. Click the logo

**Expected Result:**
- Logo link is visible
- `href` is either `/` or the base domain URL
- After click, URL matches `99bitcoins.(com|local)/?$`
- Page title contains "99Bitcoins"
- A heading containing "99Bitcoins" is visible

---

#### TC-09-02 — Search Returns Results

| Field | Detail |
|-------|--------|
| **Priority** | High |

**Steps:**
1. Click the search icon in the header
2. Type `bitcoin` in the search field
3. Submit the search

**Expected Result:**
- URL contains `?s=bitcoin`
- "You searched for bitcoin" message is visible
- Main content area is visible

---

#### TC-09-03 — Search with No Results

| Field | Detail |
|-------|--------|
| **Priority** | Medium |

**Steps:**
1. Click the search icon
2. Type `xyznonexistent123`
3. Submit the search

**Expected Result:**
- URL contains `?s=xyznonexistent123`
- A "no results", "nothing found", or "not found" message is visible

---

#### TC-09-04 — Best Wallet Button

| Field | Detail |
|-------|--------|
| **Priority** | Medium |

**Steps:**
1. Locate the Best Wallet button in the header
2. Check its `href` attribute
3. Click the button

**Expected Result:**
- Button is visible
- `href` contains `goto/bestwallet`
- Clicking opens a page with URL containing `bestwallet`

---

#### TC-09-05 — Navigation Menu and Submenu

| Field | Detail |
|-------|--------|
| **Priority** | High |

**Steps:**
1. Verify main header navigation elements are visible
2. Hover over the **Bitcoin Casinos** menu item
3. Check that the submenu appears
4. Click the **Bitcoin Historical Price** submenu link

**Expected Result:**
- Main nav elements are visible
- Submenu link becomes visible on hover
- After click, URL contains `historical-price`
- Heading "Bitcoin Historical Price &" is visible

---

#### TC-09-06 — Language Selector Icon

| Field | Detail |
|-------|--------|
| **Priority** | Medium |

**Steps:**
1. Locate the language selector icon in the header
2. Click the language icon

**Expected Result:**
- Language selector icon is visible
- Language dropdown becomes visible after click

---

#### TC-09-07 — Language Dropdown Contents

| Field | Detail |
|-------|--------|
| **Priority** | Medium |

**Steps:**
1. Open the language dropdown
2. Count and verify all language options

**Expected Result:**
- Dropdown contains all 14 supported languages
- All language names are visible as links

---

#### TC-09-08 — Language Link Hrefs

| Field | Detail |
|-------|--------|
| **Priority** | Medium |

**Steps:**
1. Open the language dropdown
2. Check `href` for: English, Deutsch, Français, Español

**Expected Result:**
- English → `href="/"`
- Deutsch → `href="/de/"`
- Français → `href="/fr/"`
- Español → `href="/es/"`

---

#### TC-09-09 — Switch to German

| Field | Detail |
|-------|--------|
| **Priority** | High |

**Steps:**
1. Open the language dropdown
2. Click **Deutsch**

**Expected Result:**
- URL contains `/de/`
- Page title contains "99Bitcoins"
- Nav links "News", "Krypto", "Prognosen" are visible

---

#### TC-09-10 — Switch to French

**Steps:** Open dropdown → click **Français**
**Expected Result:** URL contains `/fr/`, title contains "99Bitcoins"

---

#### TC-09-11 — Switch to Spanish

**Steps:** Open dropdown → click **Español**
**Expected Result:** URL contains `/es/`, title contains "99Bitcoins"

---

#### TC-09-12 — Switch to Japanese

**Steps:** Open dropdown → click **日本語**
**Expected Result:** URL contains `/jp/`, title contains "99Bitcoins"

---

#### TC-09-13 — Switch to Arabic (RTL)

**Steps:** Open dropdown → click **العربية**
**Expected Result:** URL contains `/ar/`, title contains "99Bitcoins"

---

#### TC-09-14 — Switch to Russian (Cyrillic)

**Steps:** Open dropdown → click **Русский**
**Expected Result:** URL contains `/ru/`, title contains "99Bitcoins"

---

#### TC-09-15 — Switch Back to English

| Field | Detail |
|-------|--------|
| **Priority** | Medium |

**Steps:**
1. Switch to Deutsch (URL should contain `/de/`)
2. Open language dropdown again
3. Click **English**

**Expected Result:**
- URL matches `99bitcoins.(com|local)/?$`
- "Bitcoin Casinos" nav link is visible (English nav restored)

---

#### TC-09-16 — Language Selection Persists in URL

| Field | Detail |
|-------|--------|
| **Priority** | Medium |

**Steps:**
1. Switch to Deutsch (URL contains `/de/`)
2. Click the **News** link in the navigation

**Expected Result:**
- URL contains `/de/news`

---

#### TC-09-17 — Logo Click from Translated Page

| Field | Detail |
|-------|--------|
| **Priority** | Medium |

**Steps:**
1. Switch to Deutsch (URL contains `/de/`)
2. Click the 99Bitcoins logo

**Expected Result:**
- URL matches `/de/?$` (German homepage, not English)

---

#### TC-09-18 — Header Structure in German

| Field | Detail |
|-------|--------|
| **Priority** | Low |

**Steps:**
1. Switch to Deutsch
2. Observe the header

**Expected Result:**
- 99Bitcoins logo link is visible
- Search icon is visible
- Language selector icon is visible

---

#### TC-09-19 — Parameterized Language Switching (5 Languages)

| Field | Detail |
|-------|--------|
| **Priority** | Medium |

**Steps (repeat for each language below):**
1. Open language dropdown
2. Click the language name
3. Verify URL and page title

| Language | Expected URL path | Page title |
|----------|-------------------|-----------|
| Deutsch | `/de/` | 99Bitcoins |
| Français | `/fr/` | 99Bitcoins |
| Español | `/es/` | 99Bitcoins |
| Italiano | `/it/` | 99Bitcoins |
| Português | `/br/` | 99Bitcoins |

---

### TS-10 Media Library

**Objective:** Verify the WordPress Media Library loads, displays existing media, and supports file uploads.

**Spec:** `tests/admin/mediaLibrary.spec.ts`

---

#### TC-10-01 — Media Library Page Loads

| Field | Detail |
|-------|--------|
| **Priority** | High |
| **Preconditions** | User is logged in |

**Steps:**
1. Navigate to `/wp-admin/upload.php`
2. Observe the page

**Expected Result:**
- URL contains `upload.php`
- "Media Library" heading is visible

---

#### TC-10-02 — Media Library Contains Existing Items

| Field | Detail |
|-------|--------|
| **Priority** | Medium |
| **Preconditions** | User is logged in, at least one media item exists |

**Steps:**
1. Navigate to `/wp-admin/upload.php`
2. Wait for page to load fully
3. Count media items

**Expected Result:**
- At least one media item (`.attachments .attachment` or table row) is visible

---

#### TC-10-03 — Add New Media Page Loads

| Field | Detail |
|-------|--------|
| **Priority** | Medium |
| **Preconditions** | User is logged in |

**Steps:**
1. Navigate to `/wp-admin/media-new.php`

**Expected Result:**
- URL contains `media-new.php`
- "Upload New Media" heading is visible

---

#### TC-10-04 — File Upload Input is Present

| Field | Detail |
|-------|--------|
| **Priority** | Medium |
| **Preconditions** | User is logged in |

**Steps:**
1. Navigate to `/wp-admin/media-new.php`
2. Locate the file upload area

**Expected Result:**
- A file input (`input[type='file']`) or drag-drop area is visible

---

#### TC-10-05 — Upload a PNG File

| Field | Detail |
|-------|--------|
| **Priority** | High |
| **Preconditions** | User is logged in; a test PNG file is available |

**Steps:**
1. Navigate to `/wp-admin/media-new.php`
2. Upload a PNG file via the drag-drop area
3. Wait for the upload to complete

**Expected Result:**
- The uploaded filename appears in the upload area (`.media-item .filename.new`)
- Upload completes without error

**Cleanup:**
- Delete the uploaded media via the REST API (`DELETE /wp-json/wp/v2/media/{id}?force=true`) after the test

---

### TS-11 Crypto Presales Toplist

**Objective:** Verify the Crypto Presales navigation and all six presales toplist pages work correctly.

**Spec:** `tests/regression/presalesToplist.spec.ts`
**POM:** `pages/frontend/PresalesToplistPage.ts`

---

#### TC-11-01 — Presales Nav Item Visible

| Field | Detail |
|-------|--------|
| **Priority** | High |

**Steps:**
1. Navigate to the homepage
2. Look for "Crypto Presales" in the main navigation (`nav.btc-header__nav`)

**Expected Result:**
- "Crypto Presales" link is visible in the desktop navigation

---

#### TC-11-02 — Hover Reveals Submenu

| Field | Detail |
|-------|--------|
| **Priority** | High |

**Steps:**
1. Hover over "Crypto Presales" in the navigation
2. Observe the submenu

**Expected Result:**
- All 6 submenu links are visible:
  - Crypto Presales
  - Next 1000x Crypto
  - Best Crypto to Buy
  - Best Solana Meme Coins
  - Best Meme Coin ICOs
  - Next Crypto to Hit $1

---

#### TC-11-03 — Submenu Navigation (All 6 Pages)

| Field | Detail |
|-------|--------|
| **Priority** | High |

**Steps (repeat for each submenu link):**
1. Hover over "Crypto Presales" nav item
2. Click the submenu link
3. Verify navigation and page content

| Page | URL |
|------|-----|
| Crypto Presales | `/cryptocurrency/crypto-presales/` |
| Next 1000x Crypto | `/cryptocurrency/next-1000x-crypto/` |
| Best Crypto to Buy | `/cryptocurrency/best-crypto-to-buy/` |
| Best Solana Meme Coins | `/cryptocurrency/best-solana-meme-coins/` |
| Best Meme Coin ICOs | `/cryptocurrency/best-meme-coin-icos/` |
| Next Crypto to Hit $1 | `/cryptocurrency/next-crypto-to-hit-1-dollar/` |

**Expected Result (per page):**
- URL matches the expected path
- Page has an H1 heading
- Toplist wrapper (`.cbm-presale-toplist__wrapper`) is visible
- At least 1 offer (`.cbm-presale-toplist__offer`) is rendered
- Each offer has: title link, logo image, CTA button
- CTA button `href` is a non-empty valid URL
- Offer title text is non-empty

---

### TS-12 Article Page (Regression)

**Objective:** Verify that individual article pages render the expected content structure.

**Spec:** `tests/regression/articlePage.spec.ts`

---

#### TC-12-01 — Article Page Structure

| Field | Detail |
|-------|--------|
| **Priority** | High |

**Steps:**
1. Navigate to any published article URL
2. Observe page content

**Expected Result:**
- Main content area (`main.site-main` or `.nnbtc-article-content`) is visible
- Page has an H1 title
- Author information is present
- Readable body content is visible
- Trust section is visible on the page

---

### TS-13 Category Page (Regression)

**Objective:** Verify that category archive pages display article cards with valid links.

**Spec:** `tests/regression/categoryPage.spec.ts`

---

#### TC-13-01 — Category Page Structure

| Field | Detail |
|-------|--------|
| **Priority** | High |

**Steps:**
1. Navigate to `/category/bitcoin/`
2. Observe the page content

**Expected Result:**
- Main content area is visible
- Page has a heading
- At least one article card (`.nnbtc-card`) is present
- Article cards are `<a>` elements with non-empty `href` attributes linking to article pages

---

### TS-14 Mobile Navigation

**Objective:** Verify that the site header, logo, and hamburger menu are accessible on a mobile viewport.

**Spec:** `tests/regression/mobileNav.spec.ts`

---

#### TC-14-01 — Mobile Header Elements

| Field | Detail |
|-------|--------|
| **Priority** | High |
| **Preconditions** | Viewport set to 375×812 (mobile) |

**Steps:**
1. Navigate to the homepage at mobile viewport
2. Observe the header

**Expected Result:**
- Header is visible
- 99Bitcoins logo is visible
- Hamburger menu button (`img[alt*='menu' i]` or equivalent) is visible
- Site title is present in the page

---

### TS-15 Search Results (Regression)

**Objective:** Verify that the search results page returns relevant content and displays article cards.

**Spec:** `tests/regression/searchResults.spec.ts`

---

#### TC-15-01 — Search Results Page

| Field | Detail |
|-------|--------|
| **Priority** | High |

**Steps:**
1. Navigate to `/?s=bitcoin`
2. Wait for the page to fully load (AJAX results)

**Expected Result:**
- URL contains `?s=bitcoin`
- Main content area is visible
- At least one article card (`.nnbtc-card`) is rendered after AJAX loads

---

#### TC-15-02 — No Results Message

| Field | Detail |
|-------|--------|
| **Priority** | Medium |

**Steps:**
1. Navigate to `/?s=xyznonexistent123`

**Expected Result:**
- A "no results", "nothing found", or "not found" message is visible

---

### TS-16 Visual Regression

**Objective:** Verify that key pages and components match their approved visual baseline screenshots.

**Spec:** `tests/regression/visualRegression.spec.ts`
**Snapshots:** `tests/regression/visualRegression.spec.ts-snapshots/`

**Notes:**
- Baselines are captured once with `--update-snapshots` and committed to the repo
- Dynamic content (live prices, dates, ads, tickers, countdown timers) is masked before comparison
- Tolerance: `threshold: 0.2` (per-pixel colour), `maxDiffPixelRatio: 0.05` (5 % of pixels)
- Run with `npx playwright test tests/regression/visualRegression.spec.ts --update-snapshots` to regenerate baselines after intentional UI changes

---

#### TC-16-01 — Homepage Full Page

| Field | Detail |
|-------|--------|
| **Priority** | High |

**Steps:**
1. Navigate to `/`
2. Wait for `networkidle`
3. Take a full-page screenshot

**Expected Result:** Screenshot matches `homepage-full-chromium-darwin.png` within tolerance

---

#### TC-16-02 — Homepage Header

**Steps:** Navigate to `/` → wait for `networkidle` → screenshot `.btc-header`
**Expected Result:** Matches `homepage-header-chromium-darwin.png`

---

#### TC-16-03 — Homepage Footer

**Steps:** Navigate to `/` → wait for `networkidle` → screenshot `footer`
**Expected Result:** Matches `homepage-footer-chromium-darwin.png` (tolerance: 10 %)

---

#### TC-16-04 — Category Page — Bitcoin

**Steps:** Navigate to `/category/bitcoin/` → full-page screenshot
**Expected Result:** Matches `category-bitcoin-full-chromium-darwin.png`

---

#### TC-16-05 — Crypto Presales Toplist Full Page

**Steps:** Navigate to `/cryptocurrency/crypto-presales/` → wait for first offer → full-page screenshot
**Expected Result:** Matches `presales-toplist-full-chromium-darwin.png`

---

#### TC-16-06 — Presales Toplist Widget

**Steps:** Navigate to `/cryptocurrency/crypto-presales/` → screenshot `.cbm-presale-toplist__wrapper`
**Expected Result:** Matches `presales-toplist-widget-chromium-darwin.png`

---

#### TC-16-07 — Best Crypto to Buy Full Page

**Steps:** Navigate to `/cryptocurrency/best-crypto-to-buy/` → wait for first offer → full-page screenshot
**Expected Result:** Matches `best-crypto-to-buy-full-chromium-darwin.png`

---

#### TC-16-08 — Article Page Full Page

**Steps:** Navigate via homepage news link → full-page screenshot
**Expected Result:** Matches `article-page-full-chromium-darwin.png`

---

#### TC-16-09 — Search Results Full Page

**Steps:** Navigate to `/?s=bitcoin` → full-page screenshot
**Expected Result:** Matches `search-results-bitcoin-full-chromium-darwin.png`

---

#### TC-16-10 — 404 Page Full Page

**Steps:** Navigate to `/this-page-does-not-exist-404-test/` → full-page screenshot
**Expected Result:** Matches `404-full-chromium-darwin.png`

---

#### TC-16-11 — Homepage Mobile Full Page

**Steps:** Set viewport to 375×812 → navigate to `/` → full-page screenshot
**Expected Result:** Matches `homepage-mobile-full-chromium-darwin.png`

---

#### TC-16-12 — Homepage Mobile Header

**Steps:** Set viewport to 375×812 → navigate to `/` → screenshot `header`
**Expected Result:** Matches `homepage-mobile-header-chromium-darwin.png`

---

## 5. Test Summary

### Test Count by Suite

| Suite | Test Cases | Priority |
|-------|-----------|----------|
| TS-01 Authentication | 1 | Critical |
| TS-02 Admin Dashboard | 9 | High–Low |
| TS-03 Post Creation | 1 | Critical |
| TS-04 Page Creation | 1 | Critical |
| TS-05 Plugin Management | 5 | High–Medium |
| TS-06 Shortcodes in Posts | 16 | High–Medium |
| TS-07 Shortcodes in Pages | 23 | High–Medium |
| TS-08 Homepage Sections | 7 | High–Medium |
| TS-09 Header Section | 19 | High–Low |
| TS-10 Media Library | 5 | High–Medium |
| TS-11 Crypto Presales Toplist | 8 (nav) + 36 (per-page) | High |
| TS-12 Article Page | 1 | High |
| TS-13 Category Page | 1 | High |
| TS-14 Mobile Navigation | 1 | High |
| TS-15 Search Results | 2 | High–Medium |
| TS-16 Visual Regression | 12 | High–Medium |
| **Total** | **142** | |

### Coverage Matrix

| Feature | Automated | Manual |
|---------|-----------|--------|
| Login | ✅ | ✅ |
| Dashboard | ✅ | ✅ |
| Post creation | ✅ | ✅ |
| Page creation | ✅ | ✅ |
| Plugin management | ✅ | ✅ |
| Shortcodes in posts | ✅ | ✅ |
| Shortcodes in pages | ✅ | ✅ |
| Homepage sections | ✅ | ✅ |
| Header / navigation | ✅ | ✅ |
| Language switching | ✅ | ✅ |
| Mobile rendering | ✅ | ✅ |
| Media library | ✅ | ✅ |
| Media file upload | ✅ | ✅ |
| Crypto Presales toplist | ✅ | ✅ |
| Article page | ✅ | ✅ |
| Category page | ✅ | ✅ |
| Mobile navigation | ✅ | ✅ |
| Search results | ✅ | ✅ |
| Visual regression | ✅ | ❌ |
| Firefox / WebKit cross-browser | ✅ | ❌ |
