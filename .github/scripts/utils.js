export function parseJson(input) {
    if (typeof input !== 'string' || !input) return null;
    let str = input;
    const jsonMatch = str.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!jsonMatch) return null;
    str = jsonMatch[0];
    try {
        return JSON.parse(str);
    } catch (e) {
        return null;
    }
}
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
