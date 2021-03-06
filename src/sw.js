//script for caching files using the service worker 

let staticFilesCache = 'v10'; 

//caching the appilication shell

self.addEventListener('install', event => {
   console.log("service worker installed");
    event.waitUntil(
      caches.open(staticFilesCache).then(cache =>{
        
         cache.addAll(
          [
            './',
            './index.html',
            './game.html',
            './pre-game.html',
            './end.html',
            './highscores.html',
            './styles/game.css',
            './styles/index.css',
            './styles/pre-game.css',
            './questions/general.json',
            './questions/technology.json',
            './questions/sports.json',
            './questions/history.json',
            './js/end.js',
            './js/game.js',
            './js/highscores.js',
            './js/pre-game.js',
            './images/icon-big2.png',
         ]
        );
      })
    );
  });


  //deleting cache and updating service workers
  self.addEventListener('activate',  event => {

    console.log("service worker activated");

    event.waitUntil(caches.keys().then(cacheNames => {
       Promise.all(cacheNames.map(thisCacheName =>{
         if (thisCacheName !== staticFilesCache) {

           console.log("deleting cache files from",thisCacheName)

           return caches.delete(thisCacheName);
         }

      }));
    }));
});


//hijacking requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          console.log('fetching',response);
          return response;
        }

        //  Clone the request. 
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response. 
            var responseToCache = response.clone();

            caches.open(staticFilesCache)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});