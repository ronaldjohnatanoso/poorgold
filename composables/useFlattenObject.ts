export const  flattenObject = (obj: any, prefix = ''): any => {
    const result: { [key: string]: any } = {};
  
    for (const key in obj) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}_${key}` : key;
  
      if (typeof value === 'object' && value !== null) {
        Object.assign(result, flattenObject(value, newKey));
      } else {
        result[newKey] = value;
      }
    }
  
    return result;
  }
