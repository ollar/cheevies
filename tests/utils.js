export const sleep = (timeout = 1000) => new Promise(res => setTimeout(() => res(), timeout));
