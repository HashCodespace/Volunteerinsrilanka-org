const { DateTime } = require("luxon")



module.exports = function(eleventyConfig){
  eleventyConfig.addPassthroughCopy('./src/assets')
  eleventyConfig.addPassthroughCopy('./src/.htaccess')
  // eleventyConfig.addPassthroughCopy('./src/admin')

  eleventyConfig.addFilter("postDate", (dataObj) => {
    return DateTime.fromJSDate(dataObj).toLocaleString(DateTime.DATE_MED);
  })
  
    // Return your Object options:
  return {
    dir: {
      input: "src",
      output: "dist"
    }
  };
}