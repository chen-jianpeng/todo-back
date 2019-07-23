const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const TaskSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: false
  },
  deadline: {
    type: Date,
    default: null
  },
  level: {
    type: Number,
    default: 0
  },
  discription: {
    type: String,
    default: ""
  },
  executors: [
    {
      type: ObjectId,
      ref: "User"
    }
  ],
  followers: [
    {
      type: ObjectId,
      ref: "User"
    }
  ],
  attachments: [
    {
      type: ObjectId,
      ref: "Attachment"
    }
  ],
  comments: [
    {
      type: ObjectId,
      ref: "Comment"
    }
  ],
  activities: [
    {
      type: ObjectId,
      ref: "Activity"
    }
  ],
  subTasks: [
    {
      type: ObjectId,
      ref: "SubTask"
    }
  ],

  taskList: {
    type: ObjectId,
    ref: "TaskList",
    required: true
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

TaskSchema.pre("save", function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }
  next();
});

model("Task", TaskSchema);
