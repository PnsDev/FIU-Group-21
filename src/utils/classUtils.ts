export function validateObjectValues(obj: any, validator: Map<string, string>): boolean{
    for (let [val, type] of validator) {
        if (obj.hasOwnProperty(val) && typeof obj[val] === type) continue;
        return false;
    }
    return true;
}