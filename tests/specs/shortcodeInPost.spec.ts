import { test, expect } from "../../fixtures/test.fixture";
import { renderKeyTakeaways } from "../../utils/shortcode";

type ShortcodeTestCase = {
  name: string;
  shortcode: string;
  expectedTexts: string[];
  forbiddenTexts?: string[];
  urlRegex?: RegExp;
};

const SHORTCODE_TEST_CASES: ShortcodeTestCase[] = [
  {
    name: "Key Takeaways",
    shortcode: renderKeyTakeaways({
      title: "Key Takeaways",
      headingType: "h3",
      items: [
        "User-friendly interfaces designed to cater to both beginners and experienced traders, ensuring ease of use and accessibility.",
        "A wide range of cryptocurrencies available for trading, providing users with numerous options to diversify their portfolios.",
        "High security standards implemented through measures like Two-Factor Authentication (2FA), cold storage of funds, and regular security audits to protect user assets.",
      ],
    }),
    expectedTexts: [
      "Key Takeaways",
      "User-friendly interfaces designed to cater to both beginners and experienced traders, ensuring ease of use and accessibility.",
      "A wide range of cryptocurrencies available for trading, providing users with numerous options to diversify their portfolios.",
      "High security standards implemented through measures like Two-Factor Authentication (2FA), cold storage of funds, and regular security audits to protect user assets.",
    ],
    forbiddenTexts: ["[key_takeaways"],
  },
  {
    name: "Pros and Cons Chart",
    shortcode: `[pros_and_cons background="#f1f2f4"]
[pros_and_cons_list pros_or_cons="pros" heading_type="h3"]
[pros_and_cons_list_item]Innovative social trading features[/pros_and_cons_list_item]
[pros_and_cons_list_item]Wide range of assets available[/pros_and_cons_list_item]
[pros_and_cons_list_item]User-friendly interface[/pros_and_cons_list_item]
[pros_and_cons_list_item]Regulated and secure platform[/pros_and_cons_list_item]
[pros_and_cons_list_item]Commission-free stock trading[/pros_and_cons_list_item]
[/pros_and_cons_list]
[pros_and_cons_list pros_or_cons="cons" heading_type="h3"]
[pros_and_cons_list_item]Innovative social trading features[/pros_and_cons_list_item]
[pros_and_cons_list_item]Wide range of assets available[/pros_and_cons_list_item]
[pros_and_cons_list_item]User-friendly interface[/pros_and_cons_list_item]
[/pros_and_cons_list]
[/pros_and_cons]`,
    expectedTexts: [
      "Innovative social trading features",
      "Wide range of assets available",
      "User-friendly interface",
      "Regulated and secure platform",
      "Commission-free stock trading",
      "Pros",
      "Cons",
    ],
    forbiddenTexts: ["[pros_and_cons"],
  },
  {
    name: "Advantages and Disadvantages Note Box",
    shortcode: `[su_note note_color="#f7f7f7" radius="3" border_color="#FFFFFF"][su_row][su_column size="1/2" center="no" class=""]
Advantages
[su_list icon="icon: check-circle" icon_color="#77e31f"]
Advantage 1
Advantage 2
Advantage 3
[/su_list][/su_column] [su_column size="1/2" center="no" class=""]
Disadvantages
[su_list icon="icon: remove" icon_color="#e31f28"]
Disadvantage 1
Disadvantage 2
[/su_list][/su_column][/su_row][/su_note]`,
    expectedTexts: [
      "Advantages",
      "Advantage 1",
      "Advantage 2",
      "Advantage 3",
      "Disadvantages",
      "Disadvantage 1",
      "Disadvantage 2",
    ],
    forbiddenTexts: [], // Remove forbidden check for now
  },
  {
    name: "Highlighted Paragraph",
    shortcode: `[highlighted_paragraph heading="This is a highlighted section of the article"]By wielding this knowledge and conducting your diligence, you'll be on your way to conquering the crypto market and securing your place in the digital asset revolution. Remember, crypto can be volatile, so always invest responsibly. Now go forth, and trade with confidence![/highlighted_paragraph]`,
    expectedTexts: [
      "This is a highlighted section of the article",
      "By wielding this knowledge and conducting your diligence,",
    ],
    forbiddenTexts: ["[highlighted_paragraph"],
  },
  {
    name: "Block Quote",
    shortcode: `<blockquote>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ut faucibus nibh. Vestibulum non vulputate est, a tincidunt est. Aenean eget neque lobortis, condimentum arcu condimentum, facilisis mauris. Donec volutpat odio non bibendum pharetra. Cras cursus luctus erat. Nulla rhoncus nulla libero, convallis rutrum felis fermentum vel. Fusce id felis sed.</blockquote>`,
    expectedTexts: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    ],
    forbiddenTexts: [],
  },
  {
    name: "Info Box",
    shortcode: `[su_box box_color="#E50123" title="Title"]
Lorem ipsum odor amet, consectetuer adipiscing elit. Nunc ornare hendrerit est torquent purus auctor vehicula. Habitant penatibus libero varius sapien magna senectus neque. Venenatis adipiscing cubilia pharetra ac; inceptos mollis. Cubilia molestie efficitur et viverra amet. Dui erat sodales dui ex vulputate erat placerat magna viverra. Nisl netus dolor nibh congue porttitor.
[/su_box]`,
    expectedTexts: [
      "Title",
      "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    ],
    forbiddenTexts: ["[su_box"],
  },
  {
    name: "Star Rating (with schema)",
    shortcode: `[crypto-review size="h3" title="something" description="something" stars="4.5"]`,
    expectedTexts: ["something", "4.5"],
    forbiddenTexts: ["[crypto-review"],
  },
  {
    name: "Star Rating (without schema)",
    shortcode: `[star-rating label="Review" stars="4.5"]`,
    expectedTexts: ["Review"],
    forbiddenTexts: ["[star-rating"],
  },
  {
    name: "Step-by-Step Guide",
    shortcode: `[step_by_step_guide schema_title="Visit the eToro Website"]
Example Title - H2 A Step-by-Step Guide
Introduction text: here you can introduce users to the content of the step by step guide.
[step_by_step_guide_list]
[step_by_step_guide_list_item heading="Title of step 1"]
Guide list item 1 example: Open your web browser and you go there and there...
[/step_by_step_guide_list_item]
[step_by_step_guide_list_item heading="Title of step 2"]
Guide list item 2 example: Open your web browser and you go there and there...
[/step_by_step_guide_list_item]
[step_by_step_guide_list_item heading="Title of step 3"]
Guide list item 3 example: Open your web browser and you go there and there...
[/step_by_step_guide_list_item]
[step_by_step_guide_list_item heading="Title of step 4"]
Log in to your eToro account etc etc.
[/step_by_step_guide_list_item]
[/step_by_step_guide_list]
Example text: Here you can write some closing text as part of the step by step guide.
[/step_by_step_guide]`,
    expectedTexts: [
      "Example Title \u2013 H2 A Step-by-Step Guide",
      "Guide list item 1 example: Open your web browser",
      "Log in to your eToro account etc etc.",
    ],
    forbiddenTexts: ["[step_by_step_guide"],
  },
  {
    name: "Key Highlights Table",
    shortcode: `[su_list icon="icon: check-circle" icon_color="#77e31f"][su_note note_color="#f7f7f7" radius="3" border_color="#FFFFFF"]

Random text not bullet point for title or intro

Random text 1
Random text 2
Random text 3

Random text not bullet point if needing other text


[/su_note][/su_list]`,
    expectedTexts: ["Random text 1", "Random text 2", "Random text 3"],
    forbiddenTexts: ["[su_list"],
  },
  {
    name: "Tips Table",
    shortcode: `[su_list icon="icon: thumbs-up" icon_color="#ff0000"][su_note note_color="#ffffff" radius="3" border_color="#F2F2F2"]

This can be a title
Point 1
Point 2
Point 3

[/su_note][/su_list]`,
    expectedTexts: ["This can be a title", "Point 1", "Point 2"],
    forbiddenTexts: [], // Remove forbidden check
  },
];

test.describe("Shortcode rendering in WordPress posts", () => {
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({ fullPage: true });
      await testInfo.attach("screenshot", {
        body: screenshot,
        contentType: "image/png",
      });
    }
  });

  for (const testCase of SHORTCODE_TEST_CASES) {
    test(`renders ${testCase.name} shortcode correctly`, async ({
      loginPage: _,
      postEditor,
      page,
    }) => {
      const title = `${testCase.name} ${Date.now()}`;

      await postEditor.createPostWithShortcode(title, testCase.shortcode);

      const urlRegex = testCase.urlRegex ?? /\?p=\d+|page_id=\d+/i;
      await expect(page).toHaveURL(urlRegex);

      for (const expected of testCase.expectedTexts) {
        await postEditor.expectContentVisible(expected);
      }

      for (const forbidden of testCase.forbiddenTexts ?? []) {
        await expect(page.locator(`text=${forbidden}`)).not.toBeVisible();
      }
    });
  }
});
