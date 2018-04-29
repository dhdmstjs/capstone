var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  netid: String,
  name: String,
  date: Array,
  program: String,
  grade: String,
  subject: String,
  nid: String
});

var Post = mongoose.model("Post", PostSchema);
module.exports = Post;
