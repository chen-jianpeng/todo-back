const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const AttachmentSchema = new Schema({
  movie: {
    type: ObjectId,
    ref: "Movie"
  },

  video: String,
  videoKey: String,
  cover: String,
  coverKey: String,

  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
});

AttachmentSchema.pre("save", function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }
  next();
});

model("Attachment", AttachmentSchema);
