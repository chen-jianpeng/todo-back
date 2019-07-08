const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const SubTaskSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: false
  },
  task: {
    type: ObjectId,
    ref: "Task"
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

SubTaskSchema.pre("save", function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }
  next();
});

model("SubTask", SubTaskSchema);
