export function getProjectURL() {
    var meta = window.document.querySelector('meta[property="og:url"]');
    var url = 'https://github.com/eclipse/che';
    if (meta) {
        url = meta.getAttribute('content');
    }
    return url;
}
