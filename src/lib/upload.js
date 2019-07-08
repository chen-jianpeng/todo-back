import { resolve, dirname } from "path";
import fs from "fs";
import nanoid from "nanoid";
import logger from "../lib/log4";

/**
 * 同步创建文件目录
 * @param  {string} dirname 目录绝对地址
 * @return {boolean}        创建目录结果
 */
function mkdirsSync(dir) {
  try {
    if (fs.existsSync(dir)) {
      return true;
    } else {
      if (mkdirsSync(dirname(dir))) {
        fs.mkdirSync(dir);
        return true;
      }
    }
  } catch (error) {
    return false;
  }
}

/**
 * 获取上传文件的后缀名
 * @param  {string} fileName 获取上传文件的后缀名
 * @return {string}          文件后缀名
 */
function getSuffixName(fileName = "") {
  let nameList = fileName.split(".");
  return nameList[nameList.length - 1];
}

/**
 * 保存文件到服务器
 *
 * @export
 * @param {*} file
 * @param {string} [path=""]
 * @returns
 */
export default function upload(file, path = "") {
  const fileType = getSuffixName(file.name);
  const name = nanoid() + "." + fileType;

  const dir = `upload/${path}`;
  const fullPath = `${dir}/${name}`;
  const upStreamPath = resolve(fullPath);

  try {
    const reader = fs.createReadStream(file.path);

    const isMake = mkdirsSync(dir);
    if (!isMake) {
      logger.error("目录创建失败");
      return { success: false, error: "目录创建失败" };
    }

    const upStream = fs.createWriteStream(upStreamPath);

    reader.pipe(upStream);

    return { success: true, path: fullPath };
  } catch (error) {
    return { success: false, error };
  }
}
