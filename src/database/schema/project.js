const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const ProjectSchema = new Schema({
  name: {
    unique: true,
    type: String,
    required: true
  },

  taskLists: [
    {
      type: ObjectId,
      ref: "TaskList"
    }
  ],

  attachments: [
    {
      type: ObjectId,
      ref: "Attachment"
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

ProjectSchema.pre("save", function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }
  next();
});

model("Project", ProjectSchema);
