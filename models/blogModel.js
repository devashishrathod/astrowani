// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// const BlogSchema = new Schema(
//   {
//     english: {
//       title: { type: String, required: true },
//       slug: { type: String, },
//       content: { type: String, required: true },
//       excerpt: { type: String },
//       metaDescription: { type: String },
//       keywords: [{ type: String }],
//     },
//     hindi: {
//       title: { type: String, required: true },
//       slug: { type: String, },
//       content: { type: String, required: true },
//       excerpt: { type: String },
//       metaDescription: { type: String },
//       keywords: [{ type: String }],
//     },
//     slug: { type: String },
//     thumbnail: { type: String, required: true },
//     category: {
//       type: Schema.Types.ObjectId,
//       ref: "Category",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// const Blog = mongoose.model("Blog", BlogSchema);

// module.exports = Blog;
//=========================================
const mongoose = require("mongoose");
const { slugify } = require("../helpers/slugify");
const { Schema } = mongoose;


const BlogSchema = new Schema(
  {
    english: {
      title: { type: String },
      slug: { type: String },
      content: { type: String },
      excerpt: { type: String },
      metaDescription: { type: String },
      keywords: [{ type: String }],
    },
    hindi: {
      title: { type: String },
      slug: { type: String },
      content: { type: String },
      excerpt: { type: String },
      metaDescription: { type: String },
      keywords: [{ type: String }],
    },
    slug: { type: String },
    thumbnail: { type: String },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  }, { timestamps: true }
);

// Pre-save hook to generate slugs
BlogSchema.pre("save", function (next) {
  if (this.english && !this.english.slug) {
    this.english.slug = slugify(this.english.title, { lower: true });
  }
  if (this.hindi && !this.hindi.slug) {
    this.hindi.slug = slugify(this.hindi.title, { lower: true });
  }
  if (!this.slug) {
    this.slug = slugify(this.english.title, { lower: true });
  }
  next();
});

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;