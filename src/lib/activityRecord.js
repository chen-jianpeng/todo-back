import ActivityService from "../service/activity";

async function createActivityRecord(params) {
  return await ActivityService.save(params);
}

function getArrayChange(beforeVal, afterVal, valueKey) {
  afterVal.forEach(element => {
    if (!beforeVal.includes(element)) {
      return {
        type: "create",
        before: "",
        after: element[valueKey]
      };
    }
  });
  beforeVal.forEach(element => {
    if (!afterVal.includes(element)) {
      return {
        type: "delete",
        before: element[valueKey],
        after: ""
      };
    }
  });
}

export default async function(beforeObj, afterObj) {
  for (let key in afterObj) {
    const afterVal = afterObj[key];
    const beforeVal = beforeObj[key];

    if (beforeVal === afterVal) {
      continue;
    }

    let params = {
      target: key,
      type: "update",
      before: beforeVal,
      after: afterVal
    };

    await createActivityRecord(params);
  }
}
