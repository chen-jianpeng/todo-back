const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const types = ["project", "task", "comment"];

const AttachmentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    validate: {
      validator: async function(type) {
        return types.includes(type);
      },
      message: type => `附件类型只能为${types},不能是${type}`
    }
  },
  project: {
    type: ObjectId,
    ref: "Project"
  },
  task: {
    type: ObjectId,
    ref: "Task"
  },
  comment: {
    type: ObjectId,
    ref: "Comment"
  },

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

AttachmentSchema.pre("save", function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }
  next();
});

model("Attachment", AttachmentSchema);
