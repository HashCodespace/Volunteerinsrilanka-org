const { DateTime } = require("luxon")
const Image = require("@11ty/eleventy-img");
const htmlMinifier = require("html-minifier-terser");
const postcss = require("postcss");
const terser = require("terser");


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
    classlist,
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
    // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      return htmlMinifier.minify(content, {
        collapseWhitespace: true,
        conservativeCollapse: true,
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
      });
    }

    return content;
  });

  eleventyConfig.addTransform('cssmin', async (content, outputPath) => {
    if (outputPath && outputPath.endsWith('.css')) {
      const result = await postcss([cssnano]).process(content);
      return result.css;
    }

    return content;
  });

  // Minify JS
  eleventyConfig.addNunjucksAsyncFilter("jsmin", async function (code, callback) {
    try {
      const minified = await terser.minify(code);

      callback(null, minified.code);
    } catch (err) {
      console.error("Terser error: ", err);

      // Fail gracefully.
      callback(null, code);
    }
  });
    // Return your Object options:
  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "dist"
    }
  };



}