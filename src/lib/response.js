const CODE_MAP = {
  // 成功
  2000: "操作成功",
  // 告警
  4000: "参数出错",
  4001: "id不存在",
  4002: "存在关联内容",
  // 出错
  5000: "系统出错"
};

export default class {
  constructor(code, data = {}) {
    this.code = code;

    this.msg = CODE_MAP[code] || "错误码不存在";

    this.data = data;
  }
}
