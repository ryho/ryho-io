// A file URL needs the index filename. Web servers resolve directory URLs themselves.
if (location.protocol === 'file:') {
 document.querySelectorAll('a[href]').forEach(link => {
  const url = new URL(link.href);
  if (url.protocol !== 'file:' || !url.pathname.endsWith('/')) return;
  url.pathname += 'index.html';
  link.href = url.href;
 });
}
