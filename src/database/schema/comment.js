const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const CommentSchema = new Schema({
  content: String,
  attachment: [
    {
      type: ObjectId,
      ref: "Attachment"
    }
  ],
  reminders: [
    {
      type: ObjectId,
      ref: "User"
    }
  ],

  creator: {
    type: ObjectId,
    ref: "User"
  },
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

CommentSchema.pre("save", function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }
  next();
});

model("Comment", CommentSchema);
