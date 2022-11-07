/**
 * Validates that the object has all fields and types from the given map
 * @param obj The object to check
 * @param validator The map of keys and types to check against
 * @returns true if the object is valid, false if not
 */
export function validateObjectValues(obj: any, validator: Map<string, string>): boolean{
    for (let [key, type] of validator) {
        if (!obj.hasOwnProperty(key)) return false;

        if (type === 'date') {
            if (typeof obj[key] !== 'number') return false;
        }
        else if (typeof obj[key] !== type) return false;
    }
    return true;
}

/**
 * Validates that the object contains only valid keys
 * @param obj The object to check
 * @param validator The map of keys and types to check against
 * @returns true if the object is valid, false if not
 */
export function assureValidValues(obj: any, validator: Map<string, string>) : boolean{
    for (let key in obj) {
        let type = validator.get(key);
        if (!type) return false;

        // Speical case for date
        if (type === 'date') {
            if (typeof obj[key] !== 'number') 
                return false;
        }
        else if (typeof obj[key] !== type) return false;
    }
    return true;
}


/**
 * Checks if the object is empty
 * @param obj The object to check
 * @returns true if the object is empty, false if not
 */
export function isEmpty(obj: Object): boolean {
    return Object.keys(obj).length === 0;
}