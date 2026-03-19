import { KeyTakeaways, renderKeyTakeaways } from "../utils/shortcode";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ShortcodeTestCase = {
  name: string;
  shortcode: string;
  expectedTexts: string[];
  forbiddenTexts?: string[];
  urlRegex?: RegExp;
};

// ─── Key Takeaways data ───────────────────────────────────────────────────────

export const keyTakeawaysH3: KeyTakeaways = {
  title: "Key Takeaways",
  headingType: "h3",
  items: ["Point 1", "Point 2", "Point 3"],
};

export const keyTakeawaysDefault: KeyTakeaways = {
  title: "Important Points",
  items: ["First point", "Second point"],
};

export const keyTakeawaysH2: KeyTakeaways = {
  title: "Summary",
  headingType: "h2",
  items: [
    "Bitcoin is a decentralized digital currency",
    "Blockchain technology ensures transparency",
    "Wallets store your private keys securely",
    "Always do your own research before investing",
    "Security best practices are essential",
  ],
};

export const keyTakeawaysBasic: KeyTakeaways = {
  title: "Key Takeaways",
  items: [
    "First important point about the topic.",
    "Second important point to remember.",
    "Third key takeaway for readers.",
  ],
};

export const multipleShortcodeBlocks: KeyTakeaways[] = [
  {
    title: "Introduction Highlights",
    items: [
      "Welcome to our comprehensive guide.",
      "This section covers the basics.",
      "Read on for detailed information.",
    ],
  },
  {
    title: "Advanced Topics",
    headingType: "h3",
    items: [
      "Deep dive into advanced concepts.",
      "Expert tips and best practices.",
      "Common pitfalls to avoid.",
    ],
  },
  {
    title: "Summary Points",
    headingType: "h4",
    items: ["Key conclusion from this article.", "Next steps for readers."],
  },
];

// ─── Shortcode strings ────────────────────────────────────────────────────────

export const CTA_BUTTON_SHORTCODE =
  '[button link="https://99bitcoins.com/visit/margex"]Visit Margex[/button]';

export const STEP_BY_STEP_GUIDE_SHORTCODE = `
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

export const COUNTDOWN_SHORTCODE =
  '[countdown date="15/12/2025 18:00:00" expired_message="The offer is expired."]';

export const GREEN_CHECKMARKS_SHORTCODE = `
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

export const PROS_AND_CONS_SHORTCODE = `
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

export const VERDICT_SHORTCODE = `
[verdict logo_url="" title="Our Verdict" rating="9.8" button_link="#" button_text="Visit CoinCasino"]
[verdict_list_item text="Accepted Cryptocurrencies" rating="10"/]
[verdict_list_item text="Payment Methods" rating="10"/]
[verdict_list_item text="User Experience" rating="10"/]
[verdict_list_item text="Withdrawal Speed" rating="9"/]
[/verdict]
`;

export const STAR_RATING_SHORTCODE = '[star-rating label="Review" stars="4.5"]';

export const HIGHLIGHTED_PARAGRAPH_SHORTCODE =
  '[highlighted_paragraph heading="Key Point"]This is important information that should stand out to readers.[/highlighted_paragraph]';

export const KEY_TAKEAWAYS_SHORTCODE = `
[key_takeaways title="Key Takeaways" heading_type="h3"]

[key_takeaways_list]

[key_takeaway]User-friendly interfaces designed for both beginners and experienced traders[/key_takeaway]

[key_takeaway]Wide range of cryptocurrencies available for trading[/key_takeaway]

[key_takeaway]High security standards through 2FA and cold storage[/key_takeaway]

[/key_takeaways_list]

[/key_takeaways]
`;

export const COMBINED_SHORTCODES_CONTENT = `
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

// ─── Error handling content ───────────────────────────────────────────────────

export const MALFORMED_SHORTCODE_CONTENT = `
<p>Valid content at the start of the page.</p>

[key_takeaways]
Missing title attribute
[/key_takeaways]

<p>Valid content at the end of the page.</p>

[nonexistent_shortcode_xyz]
This shortcode does not exist
[/nonexistent_shortcode_xyz]
`.trim();

export const MISSING_PARAMS_CONTENT = `
<p>Introduction paragraph with valid content.</p>

[key_takeaways title="Topics Without Items"]
  [key_takeaways_list]
  [/key_takeaways_list]
[/key_takeaways]

<p>Conclusion paragraph with valid content.</p>
`.trim();

// ─── Parameterised test cases (shortcodeInPost) ───────────────────────────────

export const SHORTCODE_TEST_CASES: ShortcodeTestCase[] = [
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
    forbiddenTexts: [],
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
    forbiddenTexts: [],
  },
];
