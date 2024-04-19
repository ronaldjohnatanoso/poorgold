function flattenObject(obj: any, prefix = ''): any {
    const result: { [key: string]: any } = {};

    for (const key in obj) {
        const value = obj[key];
        const newKey  = prefix ? `${prefix}_${key}` : key;

        if (typeof value === 'object' && value !== null) {
            Object.assign(result, flattenObject(value, newKey));
        } else {
            result[newKey] = value;
        }
    }
  
    return result;
  }
  
  
  type measurement = { width: number, length: number }
  type dogType = { name: string, age: number }
  type pairType = { value: any, render: boolean }
  type newType = dogType & { dogM: measurement }
  
  const orig = {
    name: { value: 'eric', render: true },
    age: { value: 21, render: true },
    dogM: { width: { value: 52, render: true }, length: { value: 12, render: true } }
  }
  
  const done = flattenObject(orig);
  console.log(done);