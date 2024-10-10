const { DateTime } = require("luxon");
const Image = require("@11ty/eleventy-img");
const cheerio = require("cheerio");

async function imageShortcode(src, alt, sizes, style, classlist) {
  let metadata = await Image(src, {
    widths: [750, 600, 1000, 1200],
    formats: ["webp"],
    urlPath: "/images/",
    outputDir: "./dist/images/",
  });

  let imageAttributes = {
    alt,
    sizes,
    style,
    class: classlist,
    title: alt,
    loading: "lazy",
    decoding: "async",
  };

  // You can add other attributes such as `class` and `style` here
  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function (eleventyConfig) {
  // Add a filter to extract table of contents
  eleventyConfig.addFilter("toc", function (content) {
    const $ = cheerio.load(content);
    const headings = [];
    $("h2").each((i, elem) => {
      const $elem = $(elem);
      headings.push({
        id: $elem.attr("id") || slugify($elem.text()),
        text: $elem.text(),
        level: parseInt(elem.tagName.slice(1)),
      });
    });
    return headings;
  });

  // Add a filter to add IDs to headings
  eleventyConfig.addFilter("addHeaderIds", function (content) {
    const $ = cheerio.load(content);
    $("h2, h3").each((i, elem) => {
      const $elem = $(elem);
      if (!$elem.attr("id")) {
        $elem.attr("id", slugify($elem.text()));
      }
    });
    return $.html();
  });

  // Slugify function (if you don't already have one)
  function slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }

  eleventyConfig.addPassthroughCopy("./src/assets");
  eleventyConfig.addPassthroughCopy("./src/admin");
  eleventyConfig.addPassthroughCopy("./src/.htaccess");
  // eleventyConfig.addPassthroughCopy('./src/admin')
  eleventyConfig.addAsyncShortcode("image", imageShortcode);

  // Or add them individually
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addLiquidShortcode("image", imageShortcode);
  eleventyConfig.addJavaScriptFunction("image", imageShortcode);

  eleventyConfig.addFilter("postDate", (dataObj) => {
    return DateTime.fromJSDate(dataObj).toLocaleString(DateTime.DATE_MED);
  });
  // Extract headings from content
  eleventyConfig.addFilter("getHeadings", function (content) {
    const headings = content.match(/<h2[^>]*>(.*?)<\/h2>/g) || [];
    return headings.map((heading) => {
      return heading.replace(/<[^>]*>/g, "");
    });
  });

  // Get first paragraph for drop cap
  eleventyConfig.addFilter("getFirstParagraph", function (content) {
    const match = content.match(/<p>(.*?)<\/p>/);
    return match ? match[1] : "";
  });

  // Remove first paragraph from content
  eleventyConfig.addFilter("removeFirstParagraph", function (content) {
    return content.replace(/<p>.*?<\/p>/, "");
  });
  // Return your Object options:
  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
