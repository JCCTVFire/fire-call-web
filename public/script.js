function mapInit() {
    // follow the Leaflet Getting Started tutorial here
  document.getElementById('mapid').style.height = `${400}px`;
  const map = L.map('mapid').setView([38.88101, -77.10428], 13);
  
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
  const form = document.querySelector('.userform');
  const search = document.getElementById('search_value');
  const startDate = document.getElementById('start');
  const endDate = document.getElementById('end');
  const limit = document.getElementById('limit');
   
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const request_search = await fetch('/api/search?queryText=' + search.value + '&startDate=' + 
                              startDate.value + '&endDate=' + endDate.value + '&limit=' + limit.value);
    
    const searchToJSON = await request_search.json();
    const search_data = searchToJSON.data;
    // Remove current markers here
    for(i=0;i<search_data.length;i++) {
      const marker = L.marker([search_data[i].location.lat,search_data[i].location.long]).addTo(mapObjectFromFunction);
      marker.bindPopup('<b>Call ID: </b>' + search_data[i].call.call_id + '<br>' + '<b>Call Type: </b>' + search_data[i].call.call_type + 
      '<br>' + '<b>Call Class: </b>' + search_data[i].call.call_class + '<br>' + '<b>Call Time: </b>' + search_data[i].call.call_time).openPopup();
    }
  });
}
  
async function markMap(mapObjectFromFunction) {
  const request_loc = await fetch('/api/locations');
  const locationsToJSON = await request_loc.json();
  const locations = locationsToJSON.data;

  const request_calls = await fetch('/api/calls');
  const callsToJSON = await request_calls.json();
  const calls = callsToJSON.data;

  for(j = 0; j < 100; j++) {
    const marker = L.marker([locations[j].lat, locations[j].long]).addTo(mapObjectFromFunction);
    marker.bindPopup('<b>Call ID: </b>' + calls[j].call_id + '<br>' + '<b>Call Type: </b>' + calls[j].call_type + 
                    '<br>' + '<b>Call Class: </b>' + calls[j].call_class + '<br>' + '<b>Call Time: </b>' + calls[j].call_time).openPopup();
  }
  
}

async function windowActions() {
  const map = mapInit();
  await dataHandler(map);  
  await markMap(map);
}

window.onload = windowActions;
