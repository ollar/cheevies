export default function serializeUrlParams(obj = {}) {
    if (!Object.keys(obj).length) return '';
    return (
        '?' +
        Object.keys(obj)
            .map(key => `${key}=${obj[key]}`)
            .join('&')
    );
}
