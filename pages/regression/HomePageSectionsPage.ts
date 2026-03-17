import { Page, Locator } from "@playwright/test";
import { BasePage } from "../BasePage";

export class HomePageSectionsPage extends BasePage {
  readonly featuredSection: Locator;
  readonly featuredArticles: Locator;

  readonly topStoriesSection: Locator;
  readonly topStoriesLabel: Locator;
  readonly topStoriesItems: Locator;

  readonly crashCourseSection: Locator;
  readonly crashCourseHeading: Locator;
  readonly crashCourseName: Locator;
  readonly crashCourseEmail: Locator;
  readonly crashCourseSubmit: Locator;

  readonly guidesSection: Locator;
  readonly guidesHeading: Locator;
  readonly guideCards: Locator;

  readonly newsSection: Locator;
  readonly bitcoinNewsHeading: Locator;
  readonly altcoinNewsHeading: Locator;
  readonly presalesHeading: Locator;
  readonly bitcoinNewsColumn: Locator;
  readonly altcoinNewsColumn: Locator;
  readonly presalesColumn: Locator;
  readonly viewAllNewsLink: Locator;

  readonly editorPicksSection: Locator;
  readonly editorPicksHeading: Locator;
  readonly editorPicksTabTopArticles: Locator;
  readonly editorPicksTabGuides: Locator;
  readonly editorPicksTabComparisons: Locator;
  readonly editorPicksTabReviews: Locator;

  readonly trustSection: Locator;
  readonly trustHeading: Locator;

  constructor(page: Page) {
    super(page);

    this.featuredSection = page.locator(".nnbtc-news");
    this.featuredArticles = this.featuredSection.getByRole("link");

    this.topStoriesSection = page.locator(".nnbtc-topstories");
    this.topStoriesLabel = this.topStoriesSection.getByText("Top Stories", {
      exact: true,
    });
    this.topStoriesItems = this.topStoriesSection.getByRole("link");

    this.crashCourseSection = page.locator(".crash-course");
    this.crashCourseHeading = page.getByRole("heading", {
      name: "Free Bitcoin Crash Course",
    });
    this.crashCourseName = this.crashCourseSection.getByRole("textbox", {
      name: "Your name",
    });
    this.crashCourseEmail = this.crashCourseSection.getByRole("textbox", {
      name: "Your email",
    });
    this.crashCourseSubmit = this.crashCourseSection.getByRole("button", {
      name: "Enroll Me Now",
    });

    this.guidesSection = page.locator(".guides");
    this.guidesHeading = page.getByRole("heading", { name: "Bitcoins Guides" });
    this.guideCards = this.guidesSection.getByRole("link");

    this.newsSection = page.locator(".bitcoins_news");
    this.bitcoinNewsHeading = page.getByRole("heading", {
      name: "Bitcoin News Today",
    });
    this.altcoinNewsHeading = page.getByRole("heading", {
      name: "Altcoin News Today",
    });
    this.presalesHeading = page.getByRole("heading", {
      name: "Presales",
      exact: true,
    });

    const newsGrid = page.locator(".bitcoins_news .grid-block");
    this.bitcoinNewsColumn = newsGrid.locator("> div").nth(0);
    this.altcoinNewsColumn = newsGrid.locator("> div").nth(1);
    this.presalesColumn = newsGrid.locator("> div").nth(2);

    this.viewAllNewsLink = page.getByRole("link", { name: "View All News" });

    this.editorPicksSection = page.locator(".nnbtc-editorspick");
    this.editorPicksHeading = page.getByRole("heading", {
      name: "Editor's Picks",
    });
    this.editorPicksTabTopArticles = this.editorPicksSection.getByRole(
      "button",
      { name: "Top Articles" },
    );
    this.editorPicksTabGuides = this.editorPicksSection.getByRole("button", {
      name: "Guides",
    });
    this.editorPicksTabComparisons = this.editorPicksSection.getByRole(
      "button",
      { name: "Comparisons" },
    );
    this.editorPicksTabReviews = this.editorPicksSection.getByRole("button", {
      name: "Reviews",
    });

    this.trustSection = page.locator(".trust-us");
    this.trustHeading = page.getByRole("heading", {
      name: "Why you can trust 99Bitcoins",
    });
  }

  async clickEditorPicksTab(tabName: string): Promise<void> {
    await this.editorPicksSection
      .getByRole("button", { name: tabName })
      .click();
  }
}
