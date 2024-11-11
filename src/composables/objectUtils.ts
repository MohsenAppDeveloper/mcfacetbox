//👉 - مقادیر اعضاء یک شیء را به شیء دیگری شامل همان اعضاء انتقال میدهد
export const objectMap = (newObject: Record<string, any>, oldObject: Record<string, any>) => {
    for (const key in oldObject) {
        if (oldObject.hasOwnProperty(key) && newObject.hasOwnProperty(key)) {
            newObject[key] = oldObject[key]
        }
    }
}
