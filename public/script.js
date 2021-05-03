var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    } 
  });
}

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    } 
  });
}

function mapInit() {
    // follow the Leaflet Getting Started tutorial here
    document.getElementById('mapid').style.height = `${400}px`;
    const map = L.map('mapid').setView([38.9896946148518, -76.93886260848691], 13);
  
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoicG9vbDAxMSIsImEiOiJja20zdmVjZHAwYzl2MnBsY2R3MWdoemEyIn0.cdvnKCusaIY45GptcuQcPQ'
    }).addTo(map);
    return map;
  }
  
  async function dataHandler(mapObjectFromFunction) {
    // use your assignment 1 data handling code here
    // and target mapObjectFromFunction to attach markers
    const request = await fetch('/api');
    const restaurants = await request.json();
  
    let markers = [];
  
    const search = document.querySelector('.input');
    const form = document.getElementById('search');
    const suggestions = document.querySelector('.suggestions');
  
    function findMatches(restList) {
      const tempArr = restList.filter((place) => place.zip.includes(search.value));
      const tempSet = new Set(tempArr.map((place) => place.establishment_id));
      const uniqueIDs = Array.from(tempSet);
  
      // iterate through the list until out of unique "establishment_id"s
      let idLength = uniqueIDs.length - 1;
  
      const results = [];
      function filterResults (place) {
        // compare the value of the restaurants key to value in unique keys
        if (place.establishment_id === uniqueIDs[idLength] && uniqueIDs.length > 0) {
          results.push(place);
          uniqueIDs.pop();
          idLength = uniqueIDs.length - 1;
        }
      }
      while (idLength >= 0) {
        restList.forEach(filterResults);
      }
      // Sort by reverse zip code
      results.sort((a, b) => (b.zip - a.zip));
      return results.slice(0, 5);
    }
  
    // const suggestions = document.querySelector('.suggestions');
  
    // function displayMatches(event) {
    //   const matchArray = findMatches(event.target.value, restaurants);
    //   const html = matchArray.map((place) => {
    //     entry = `
    //     <div class="box">
    //       <li>
    //       <address>
    //         <h2 class="subtitle is-3"><span class="name">${place.name}</span></h2>
    //         <span class="address">${place.address_line_1}</span> <br>
    //         ${place.city}, ${place.state} ${place.zip} <br>
    //         <span class="category">${place.category} <br>
    //       </address>
    //       </li>
    //     </div>
    //     `;
    //     return entry;
    //   });
    //   suggestions.innerHTML = html.join('');
    // }
    form.addEventListener('submit', async (evt) => {
      // Clear results list
      suggestions.innerHTML = '';
  
      // Remove all old markers
      markers.forEach((marker) => {
        mapObjectFromFunction.removeLayer(marker);
      });
      markers = [];
  
      evt.preventDefault();

      const matchArray = findMatches(restaurants);
  
      matchArray.forEach((place) => {
        // Add map markers to layer group. This group will be added to the map later.
        const coords = place.geocoded_column_1.coordinates;
        console.log(coords);
        const marker = L.marker([coords[1], coords[0]]);
        marker.addTo(mapObjectFromFunction);
        markers.push(marker);
        console.log('Marker added');
  
        // Create a new list item
        const newResult = document.createElement('li');
        newResult.classList.add('box');
        newResult.classList.add('list-item');
        newResult.innerHTML = `<div class='list-header'>${place.name}</div><address>${place.address_line_1}</address>`;
        suggestions.append(newResult);
        console.log('List item added.');
      });
      if (search.value.length === 0) {
        suggestions.innerHTML = '';
      }
    });
  }
  async function windowActions() {
    const map = mapInit();
    await dataHandler(map); 
    
  }
window.onload = windowActions;
