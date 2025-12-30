(function() {
  var CACHE_KEY = 'conso_stars', CACHE_TTL = 3600000;
  var cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    var data = JSON.parse(cached);
    if (Date.now() - data.t < CACHE_TTL) {
      document.getElementById('star-num').textContent = data.v;
      return;
    }
  }
  fetch('https://api.github.com/repos/vkboo/conso')
    .then(function(r) { return r.json(); })
    .then(function(d) {
      if (d.stargazers_count !== undefined) {
        document.getElementById('star-num').textContent = d.stargazers_count;
        localStorage.setItem(CACHE_KEY, JSON.stringify({ v: d.stargazers_count, t: Date.now() }));
      }
    })
    .catch(function() {});
})();

