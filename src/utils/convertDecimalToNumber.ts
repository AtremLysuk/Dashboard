export function convertDecimalToNumber(obj): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "object") {
    if (obj.constructor.name === "Decimal" || (obj instanceof Object && "to Number" in obj)) {
      return Number(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map(convertDecimalToNumber);
    }

    const result: any = {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = convertDecimalToNumber(obj[key]);
      }
    }
    return result;
  }

  return obj;
}
