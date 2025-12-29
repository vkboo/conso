(function() {
  var statusEl = document.getElementById('status');
  var libsEl = document.getElementById('libs');
  var promptEl = document.getElementById('prompt');
  var helpEl = document.getElementById('help');

  function parseLibraries() {
    var query = window.location.search.substring(1);
    if (!query) return [];
    
    var libs = [];
    var pairs = query.split('&');
    
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i];
      if (!pair) continue;
      
      var parts = pair.split('=');
      var name = decodeURIComponent(parts[0]);
      var version = parts[1] ? decodeURIComponent(parts[1]) : 'latest';
      
      if (name) {
        libs.push({ name: name, version: version });
      }
    }
    
    return libs;
  }

  function createLibItem(lib) {
    var div = document.createElement('div');
    div.className = 'lib-item loading';
    div.innerHTML = '<span class="dot"></span><span>' + lib.name + '@' + lib.version + '</span>';
    return div;
  }

  function loadScript(lib) {
    return new Promise(function(resolve, reject) {
      var script = document.createElement('script');
      var url = 'https://cdn.jsdelivr.net/npm/' + lib.name + '@' + lib.version;
      script.src = url;
      script.async = false;
      
      script.onload = function() {
        resolve(lib);
      };
      
      script.onerror = function() {
        reject(new Error('Failed to load ' + lib.name + '@' + lib.version));
      };
      
      document.head.appendChild(script);
    });
  }

  function init() {
    var libs = parseLibraries();
    
    if (libs.length === 0) {
      statusEl.textContent = 'No packages specified';
      helpEl.style.display = 'block';
      return;
    }

    statusEl.textContent = 'Loading ' + libs.length + ' package(s)...';

    var items = [];
    for (var i = 0; i < libs.length; i++) {
      var item = createLibItem(libs[i]);
      libsEl.appendChild(item);
      items.push(item);
    }

    var loadedCount = 0;
    var errorCount = 0;

    var promises = libs.map(function(lib, index) {
      return loadScript(lib)
        .then(function() {
          items[index].className = 'lib-item loaded';
          loadedCount++;
          updateStatus();
        })
        .catch(function(err) {
          items[index].className = 'lib-item error';
          items[index].querySelector('span:last-child').textContent += ' (failed)';
          errorCount++;
          updateStatus();
          console.error(err.message);
        });
    });

    function updateStatus() {
      if (loadedCount + errorCount === libs.length) {
        if (errorCount === 0) {
          statusEl.textContent = 'All loaded ✓';
          statusEl.style.color = '#3fb950';
        } else {
          statusEl.textContent = loadedCount + '/' + libs.length + ' loaded';
          statusEl.style.color = '#f0883e';
        }
        promptEl.style.display = 'block';
      }
    }

    Promise.all(promises).catch(function() {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

