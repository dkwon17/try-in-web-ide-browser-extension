export const sanitizeUrl = (str: string) => {
    let res = str;
    while (res.charAt(res.length - 1) === "/") {
        res = res.substring(0, res.length - 1);
    }
    return res;
};
