const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const ActivitySchema = new Schema({
  content: String,

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

ActivitySchema.pre("save", function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }
  next();
});

model("Activity", ActivitySchema);
