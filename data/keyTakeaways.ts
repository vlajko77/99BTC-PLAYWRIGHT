import { KeyTakeaways } from "../utils/shortcode";

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
