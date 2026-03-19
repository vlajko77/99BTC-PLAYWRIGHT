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
