import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { WordPressPostEditor } from "../pages/CreatePost";
import { WP_USERNAME, WP_PASSWORD } from "../helpers/login";

test.describe("Aesthetic Shortcodes", () => {
  let loginPage: LoginPage;
  let postEditor: WordPressPostEditor;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    postEditor = new WordPressPostEditor(page);
    await loginPage.loginWithSession(WP_USERNAME, WP_PASSWORD);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({ fullPage: true });
      await testInfo.attach("screenshot", {
        body: screenshot,
        contentType: "image/png",
      });
    }
  });

  test("CTA Button shortcode renders correctly", async ({ page }) => {
    const randomTitle = "CTA Button Test " + crypto.randomUUID();
    const buttonContent =
      '[button link="https://99bitcoins.com/visit/margex"]Visit Margex[/button]';

    await postEditor.gotoNewPost();
    await postEditor.fillPostDetails(randomTitle, buttonContent);
    await postEditor.selectCategory("News");
    await postEditor.publishAndNavigate();

    await expect(
      page.getByRole("link", { name: "Visit Margex" }),
    ).toBeVisible();
  });

  test("Step by step guide shortcode renders with multiple items", async ({
    page,
  }) => {
    const randomTitle = "Step by Step Guide Test " + crypto.randomUUID();
    const guideContent = `
[step_by_step_guide]

How to Open an Account: A Step-by-Step Guide

[step_by_step_guide_list]

[step_by_step_guide_list_item heading="Visit the Website"]
Open your web browser and go to the website and click on the "Sign Up" button.
[/step_by_step_guide_list_item]

[step_by_step_guide_list_item heading="Register Your Account"]
Fill in your personal information including email and password.
[/step_by_step_guide_list_item]

[step_by_step_guide_list_item heading="Verify Your Email"]
Check your email inbox for a verification email and click the verification link.
[/step_by_step_guide_list_item]

[/step_by_step_guide_list]

[/step_by_step_guide]
    `;

    await postEditor.gotoNewPost();
    await postEditor.fillPostDetails(randomTitle, guideContent);
    await postEditor.selectCategory("News");
    await postEditor.publishAndNavigate();

    await expect(page.getByText("Visit the Website")).toBeVisible();
    await expect(page.getByText("Register Your Account")).toBeVisible();
    await expect(page.getByText("Verify Your Email")).toBeVisible();
  });

  test("Countdown shortcode renders expired message when date has passed", async ({
    page,
  }) => {
    const randomTitle = "Countdown Test " + crypto.randomUUID();
    const countdownContent =
      '[countdown date="15/12/2025 18:00:00" expired_message="The offer is expired."]';

    await postEditor.gotoNewPost();
    await postEditor.fillPostDetails(randomTitle, countdownContent);
    await postEditor.selectCategory("News");
    await postEditor.publishAndNavigate();

    // Date is in the past, so the expired message should be shown
    await expect(page.getByText("The offer is expired.")).toBeVisible();
  });

  test("Checklist with green checkmarks shortcode", async ({ page }) => {
    const randomTitle = "Checklist Test " + crypto.randomUUID();
    const checklistContent = `
[green_checkmarks_list]

[green_checkmarks_list_item heading="User-Friendly Interface"]
Evaluate if the platform is easy to navigate and suitable for both beginners and advanced users.
[/green_checkmarks_list_item]

[green_checkmarks_list_item heading="Trading Fees"]
Compare the trading fees, including spreads, commissions, and any hidden costs.
[/green_checkmarks_list_item]

[green_checkmarks_list_item heading="Customer Support"]
Look for multiple support channels such as live chat, email, and phone support.
[/green_checkmarks_list_item]

[/green_checkmarks_list]
    `;

    await postEditor.gotoNewPost();
    await postEditor.fillPostDetails(randomTitle, checklistContent);
    await postEditor.selectCategory("News");
    await postEditor.publishAndNavigate();

    await expect(page.getByText("User-Friendly Interface")).toBeVisible();
    await expect(page.getByText("Trading Fees")).toBeVisible();
    await expect(page.getByText("Customer Support")).toBeVisible();
  });

  test("Pros and Cons shortcode renders sections", async ({ page }) => {
    const randomTitle = "Pros & Cons Test " + crypto.randomUUID();
    const prosConsContent = `
[pros_and_cons background="#f1f2f4"]

[pros_and_cons_list pros_or_cons="pros" heading_type="h3"]
[pros_and_cons_list_item]Innovative social trading features[/pros_and_cons_list_item]
[pros_and_cons_list_item]Wide range of assets available[/pros_and_cons_list_item]
[pros_and_cons_list_item]User-friendly interface[/pros_and_cons_list_item]
[/pros_and_cons_list]

[pros_and_cons_list pros_or_cons="cons" heading_type="h3"]
[pros_and_cons_list_item]Limited payment options[/pros_and_cons_list_item]
[pros_and_cons_list_item]High withdrawal fees[/pros_and_cons_list_item]
[/pros_and_cons_list]

[/pros_and_cons]
    `;

    await postEditor.gotoNewPost();
    await postEditor.fillPostDetails(randomTitle, prosConsContent);
    await postEditor.selectCategory("News");
    await postEditor.publishAndNavigate();

    await expect(
      page.getByText("Innovative social trading features"),
    ).toBeVisible();
    await expect(page.getByText("Limited payment options")).toBeVisible();
  });

  test("Verdict shortcode with rating and items", async ({ page }) => {
    const randomTitle = "Verdict Test " + crypto.randomUUID();
    const verdictContent = `
[verdict logo_url="" title="Our Verdict" rating="9.8" button_link="#" button_text="Visit CoinCasino"]
[verdict_list_item text="Accepted Cryptocurrencies" rating="10"/]
[verdict_list_item text="Payment Methods" rating="10"/]
[verdict_list_item text="User Experience" rating="10"/]
[verdict_list_item text="Withdrawal Speed" rating="9"/]
[/verdict]
    `;

    await postEditor.gotoNewPost();
    await postEditor.fillPostDetails(randomTitle, verdictContent);
    await postEditor.selectCategory("News");
    await postEditor.publishAndNavigate();

    await expect(page.getByText("Our Verdict")).toBeVisible();
    await expect(page.getByText("Visit CoinCasino")).toBeVisible();
    await expect(page.getByText("Accepted Cryptocurrencies")).toBeVisible();
  });

  test("Star rating shortcode renders with label", async ({ page }) => {
    const randomTitle = "Star Rating Test " + crypto.randomUUID();
    const starRatingContent = '[star-rating label="Review" stars="4.5"]';

    await postEditor.gotoNewPost();
    await postEditor.fillPostDetails(randomTitle, starRatingContent);
    await postEditor.selectCategory("News");
    await postEditor.publishAndNavigate();

    await expect(page.getByText("Review")).toBeVisible();
  });

  test("Highlighted paragraph shortcode renders", async ({ page }) => {
    const randomTitle = "Highlighted Section Test " + crypto.randomUUID();
    const highlightedContent =
      '[highlighted_paragraph heading="Key Point"]This is important information that should stand out to readers.[/highlighted_paragraph]';

    await postEditor.gotoNewPost();
    await postEditor.fillPostDetails(randomTitle, highlightedContent);
    await postEditor.selectCategory("News");
    await postEditor.publishAndNavigate();

    await expect(page.getByText("Key Point")).toBeVisible();
    await expect(
      page.getByText(
        "This is important information that should stand out to readers.",
      ),
    ).toBeVisible();
  });

  test("Key Takeaways shortcode with multiple items", async ({ page }) => {
    const randomTitle = "Key Takeaways Test " + crypto.randomUUID();
    const keyTakeawaysContent = `
[key_takeaways title="Key Takeaways" heading_type="h3"]

[key_takeaways_list]

[key_takeaway]User-friendly interfaces designed for both beginners and experienced traders[/key_takeaway]

[key_takeaway]Wide range of cryptocurrencies available for trading[/key_takeaway]

[key_takeaway]High security standards through 2FA and cold storage[/key_takeaway]

[/key_takeaways_list]

[/key_takeaways]
    `;

    await postEditor.gotoNewPost();
    await postEditor.fillPostDetails(randomTitle, keyTakeawaysContent);
    await postEditor.selectCategory("News");
    await postEditor.publishAndNavigate();

    await expect(page.getByText("Key Takeaways")).toBeVisible();
    await expect(
      page.getByText(
        "User-friendly interfaces designed for both beginners and experienced traders",
      ),
    ).toBeVisible();
    await expect(
      page.getByText("Wide range of cryptocurrencies available for trading"),
    ).toBeVisible();
  });

  test("Multiple shortcodes combined in one post", async ({ page }) => {
    const randomTitle = "Combined Shortcodes Test " + crypto.randomUUID();
    const combinedContent = `
<h2>Overview</h2>
[highlighted_paragraph heading="Important Overview"]This comprehensive guide covers multiple aspects you need to know.[/highlighted_paragraph]

<h2>Benefits Checklist</h2>
[green_checkmarks_list]
[green_checkmarks_list_item heading="Benefit 1"]First key benefit[/green_checkmarks_list_item]
[green_checkmarks_list_item heading="Benefit 2"]Second key benefit[/green_checkmarks_list_item]
[/green_checkmarks_list]

<h2>Ratings</h2>
[star-rating label="Overall" stars="4.5"]

<h2>Our Verdict</h2>
[verdict title="Final Verdict" rating="9.5" button_text="Learn More" button_link="#"]
[verdict_list_item text="Feature 1" rating="10"/]
[verdict_list_item text="Feature 2" rating="9"/]
[/verdict]
    `;

    await postEditor.gotoNewPost();
    await postEditor.fillPostDetails(randomTitle, combinedContent);
    await postEditor.selectCategory("News");
    await postEditor.publishAndNavigate();

    await expect(page.getByText("Important Overview")).toBeVisible();
    await expect(page.getByText("Benefit 1")).toBeVisible();
    await expect(page.getByText("Overall")).toBeVisible();
    await expect(page.getByText("Final Verdict")).toBeVisible();
  });
});
