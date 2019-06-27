const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const TaskListSchema = new Schema({
  name: {
    unique: true,
    type: String
  },
  tasks: [
    {
      type: ObjectId,
      ref: "Task"
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

TaskListSchema.pre("save", function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }
  next();
});

model("TaskList", TaskListSchema);
