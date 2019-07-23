import mongoose from "mongoose";
import { logger } from "../lib/log4";

const Activity = mongoose.model("Activity");

const TYPE_MAP = {
  create: "新增",
  delete: "删除",
  update: "修改",
  search: "查看",
  other: "其他操作"
};

const TARGET_MAP = {
  status: "状态",
  deadline: "截至时间",
  level: "优先级",
  discription: "描述",
  executors: "执行人",
  followers: "关注人",
  attachments: "附件",
  comments: "评论",
  subTasks: "子任务",
  name: "任务内容",
  taskList: "所属清单"
};

export default {
  /**
   * 保存
   *
   * @param {*} params
   */
  async save(oldObj, newObj = {}, type, user) {
    let result = [];
    try {
      for (let key in newObj) {
        let params = {
          type: {
            key: type,
            text: TYPE_MAP[type]
          },
          target: {
            key: key,
            text: TARGET_MAP[key]
          },
          before: oldObj[key],
          change: newObj[key],
          creator: user._id
        };
        let activity = new Activity(params);
        let res = await activity.save();
        result.push(res);
      }
    } catch (error) {
      logger.error(error);
    }
    return result;
  },

  /**
   * 保存
   *
   * @param {*} params
   */
  async saveArrayItem(oldObj, newObj = {}, type, user) {
    let result = [];
    const serviceMap = {
      executors: { key: "name", service: () => import("./user") },
      followers: { key: "name", service: () => import("./user") },
      attachments: { key: "name", service: () => import("./attachment") },
      comments: { key: "content", service: () => import("./comment") },
      subTasks: { key: "name", service: () => import("./subTask") }
    };
    try {
      for (let key in newObj) {
        let params = {
          type: {
            key: type,
            text: TYPE_MAP[type]
          },
          target: {
            key: key,
            text: TARGET_MAP[key]
          },
          before: "",
          change: "",
          creator: user._id
        };

        let id = newObj[key][0];
        const service = await serviceMap[key].service();
        const subRes = await service.default.getById(id);
        params.change = subRes.data[serviceMap[key].key];

        let activity = new Activity(params);
        let res = await activity.save();
        result.push(res);
      }
    } catch (error) {
      logger.error(error);
    }
    return result;
  }
};
