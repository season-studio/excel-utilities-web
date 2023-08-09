export function getGlobalStyleSheets() {
    return Array.from(document.head.querySelectorAll("style")||[]).filter(item => /\.--global-style\s*{/.test(item.innerHTML));
}