export function getCookieValue(cookieName: string): string | undefined {
    const cookies = document.cookie.split('; ');
    console.log(cookies)

    for (const cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === cookieName) {
            return decodeURIComponent(value);
        }
    }

    return undefined;
}