const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const types = ["other", "create", "delete", "update", "search"];

const ActivitySchema = new Schema({
  type: {
    type: String,
    required: true,
    validate: {
      validator: async function(type) {
        return types.includes(type);
      },
      message: type => `活动类型出错。只能是${types}中的，当前为${type}`
    }
  },
  target: {
    type: String,
    required: true
  },
  before: {
    type: String
  },
  after: {
    type: String
  },

  creator: {
    type: ObjectId,
    ref: "User",
    required: true
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
