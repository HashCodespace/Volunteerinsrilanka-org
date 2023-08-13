const { DateTime } = require("luxon")
const Image = require("@11ty/eleventy-img");


async function imageShortcode(src, alt, sizes , style, classlist) {
  let metadata = await Image(src, {
    widths: [750, 600, 1000,1200],
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


module.exports = function(eleventyConfig){
  eleventyConfig.addPassthroughCopy('./src/assets')
  eleventyConfig.addPassthroughCopy('./src/.htaccess')
  // eleventyConfig.addPassthroughCopy('./src/admin')
  eleventyConfig.addAsyncShortcode("image", imageShortcode);

  // Or add them individually
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addLiquidShortcode("image", imageShortcode);
  eleventyConfig.addJavaScriptFunction("image", imageShortcode);

  eleventyConfig.addFilter("postDate", (dataObj) => {
    return DateTime.fromJSDate(dataObj).toLocaleString(DateTime.DATE_MED);
  })
  
    // Return your Object options:
  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "dist"
    }
  };
}