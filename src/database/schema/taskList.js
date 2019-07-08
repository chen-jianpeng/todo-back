const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const TaskListSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  project: {
    type: ObjectId,
    ref: "Project",
    required: true,
    validate: {
      validator: async function(id) {
        const Project = model("Project");
        let project = await Project.findById(id);
        return !!project;
      },
      message: props => `项目id=${props.value}不存在`
    }
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
