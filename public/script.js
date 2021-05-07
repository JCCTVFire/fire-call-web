async function markMap(mapObjectFromFunction, incident) {
  // console.log(location, call)
  const marker = L.marker([incident.location.lat, incident.location.long]).addTo(mapObjectFromFunction);
  const latlng = L.latLng(incident.location.lat, incident.location.long);
  const editBtn = L.DomUtil.create('a', 'edit');
  editBtn.innerHTML = '<a href="#manageForm" onclick="populateForm(this)">Edit</a>';     
  const popup = L.popup()
                .setLatLng(latlng)
                .setContent('<b>Call ID: </b>' + incident.call.call_id + '<br>' + '<b>Call Type: </b>' + incident.call.call_type + 
                '<br>' + '<b>Call Class: </b>' + incident.call.call_class + '<br>' + '<b>Call Time: </b>' + incident.call.call_time
                + '<br>' + editBtn.innerHTML)
                .openOn(mapObjectFromFunction);

  //console.log('Edit value', editBtn);
  //L.DomEvent.on(editBtn, 'click', function() { alert('works'); });
  marker.bindPopup(popup).openPopup();
}

async function mapInit() {
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

  const mapInitRequest = await fetch('/api/mapInit');
  const mapInitJSON = await mapInitRequest.json();
  const mapInitData = mapInitJSON.data

  mapInitData.forEach(async (point) => { await markMap(map, point);});

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
    mapObjectFromFunction.eachLayer(function (layer) {
    if(layer.options.tileSize != 512) {
        mapObjectFromFunction.removeLayer(layer);
    }
    });
    
    for(i=0;i<search_data.length;i++) {
      const marker = L.marker([search_data[i].location.lat,search_data[i].location.long]).addTo(mapObjectFromFunction);
      const editBtn = L.DomUtil.create('a', 'edit');
      editBtn.innerHTML = '<a href="#manageForm">Edit</a>';
      marker.bindPopup('<b>Call ID: </b>' + search_data[i].call.call_id + '<br>' + '<b>Call Type: </b>' + search_data[i].call.call_type + 
      '<br>' + '<b>Call Class: </b>' + search_data[i].call.call_class + '<br>' + '<b>Call Time: </b>' + search_data[i].call.call_time + '<br>'+ editBtn.innerHTML).openPopup();
    }
  });
}

async function populateForm(button) {
  const elem = button.parentElement;
  const idForEdit = elem.innerHTML.substring(elem.innerHTML.indexOf('<br>')-8, elem.innerHTML.indexOf('<br>')-1);
  console.log(idForEdit);
  const request = await fetch('/api/search?queryText=' + idForEdit);
  const requestToJSON = await request.json();
  const callToEdit = requestToJSON.data;
  console.log(requestToJSON);
}

async function windowActions() {
  const map = await mapInit();
  await dataHandler(map);
}

window.onload = windowActions;
