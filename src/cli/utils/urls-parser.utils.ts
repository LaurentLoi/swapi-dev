export const urlParser = (urls: string[]): number[] => {
    return urls.map((url: string) => {
        const splitted: string[] = url.split('/');
        return +splitted[splitted.length - 2];
    });
};
