async function openTab(evt, tabTitle) {
  const oldTab = document.querySelector('li.is-active');
  const oldData = document.getElementById('displayBox').querySelector('div');

  const newFormData = document.getElementById(tabTitle);
  
  const displayBox = document.getElementById('displayBox');
  const hideBox = document.getElementById('hider');
  
  oldTab.classList.remove('is-active');
  evt.currentTarget.parentElement.classList.add('is-active');
  hideBox.append(oldData);
  displayBox.append(newFormData);
}

async function markMap(mapObjectFromFunction, incident) {
  const marker = L.marker([incident.location.lat, incident.location.long]).addTo(mapObjectFromFunction);
  const latlng = L.latLng(incident.location.lat, incident.location.long);
  const editBtn = L.DomUtil.create('a', 'edit');
  editBtn.innerHTML = '<a href="#manageForm" onclick="populateForm(this)">Edit</a>';     
  const popup = L.popup()
                .setLatLng(latlng)
                .setContent('<b>Call ID: </b>' + incident.call.call_id + '<br>' + '<b>Call Type: </b>' + incident.call.call_type + 
                '<br>' + '<b>Call Class: </b>' + incident.call.call_class + '<br>' + '<b>Call Time: </b>' + incident.call.call_time
                + '<br>' + editBtn.innerHTML + '<p hidden class="inc-id">' + incident.incident_id + '</p>')
                .openOn(mapObjectFromFunction);

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
  const mapInitData = mapInitJSON.data;

  mapInitData.forEach(async (point) => { await markMap(map, point); });

  return map;
}
  

async function sendUpdate(tableName, formData, id) {
  console.log(JSON.stringify(formData));
  const request = await fetch('/api/'+tableName+'/'+id, { headers: {'Content-Type': 'application/json'}, body: formData, method: 'PUT'})
  const response = await request.json();
  const deleteButtons = document.querySelectorAll('div.notification');
  
  if (deleteButtons.length > 0) {
    deleteButtons.forEach((button) => button.remove());
  }
  // response = {message: 'Successfully updated a new tab.'}
  const messageBox = document.createElement('div');
  messageBox.classList.add('notification');
  
  if (response.message) {
    const message = response['message'];
    messageBox.classList.add('is-success');
    messageBox.innerHTML = `${message}<a id="success-tag" class="delete is-small"></a>`
  } else {
    const error = response['error'];
    messageBox.classList.add('is-danger');
    console.log(response);
    messageBox.innerHTML = `${error}<a id="success-tag" class="delete is-small"></a>`
  }
  const tabContent = document.getElementById('Call');
  tabContent.append(messageBox);
  const deleteButton = document.getElementById("success-tag");
  deleteButton.onclick = (evt) => messageBox.remove();
}



async function dataHandler(mapObjectFromFunction) {
  const form = document.querySelector('.userform');
  const search = document.getElementById('search_value');
  const startDate = document.getElementById('start');
  const endDate = document.getElementById('end');
  const limit = document.getElementById('limit');
   
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const requestSearch = await fetch('/api/search?queryText=' + search.value + '&startDate=' + 
                              startDate.value + '&endDate=' + endDate.value + '&limit=' + limit.value);
    
    const searchToJSON = await requestSearch.json();
    const searchData = searchToJSON.data;
    try { 
      // Remove current markers here
      mapObjectFromFunction.eachLayer(function (layer) {
        if (layer.options.tileSize != 512) {
            mapObjectFromFunction.removeLayer(layer);
        }
      });
      searchData.reduce(async (acc, incident) => {
        await markMap(mapObjectFromFunction, incident);
      });
    } catch (err) {
      alert('No results found!');
    }
  });
}

async function populateForm(button) {
  const elem = button.parentElement;
  const idForEdit = elem.getElementsByClassName('inc-id')[0].innerHTML;
  const request = await fetch('/api/incidents/' + idForEdit);
  const requestToJSON = await request.json();

  const inc = requestToJSON.data;
  const incID = document.getElementById('incidentID');
  const incDate = document.getElementById('incidentDate');
  const incDesc = document.getElementById('incidentDesc');
  const incPostal = document.getElementById('incidentPostal');
  const incDist = document.getElementById('incidentDist');

  incID.innerHTML = 'ID: ' + inc[0].incident_id;
  incDate.innerHTML = 'Date: ' + inc[0].date;
  incDesc.innerHTML = 'Description: ' + inc[0].description;
  incPostal.innerHTML = 'Postal Code: ' + inc[0].postal_code;
  incDist.innerHTML = 'District Code: ' + inc[0].district_code;

  const requestCall = await fetch('/api/calls/' + inc[0].call_id);
  const requestCallToJSON = await requestCall.json();
  const call = requestCallToJSON.data;
  const callID = document.getElementById('callID');
  const callType = document.getElementById('callType');
  const callClass = document.getElementById('callClass');
  const callTime = document.getElementById('callTime');
  const manageForm = document.getElementById('manageForm');
 
  callID.innerHTML = 'ID: ' + call[0].call_id;
  callType.value = call[0].call_type;
  callClass.value = call[0].call_class;
  callTime.value = call[0].call_time;

  manageForm.addEventListener('submit', async function (evt) {
    evt.preventDefault();
    console.log(callType);
    await sendUpdate('calls', JSON.stringify({call_type: callType.value, call_class: callClass.value, call_time: callTime.value}), call[0].call_id);
  });

  const addForm = document.getElementById('addForm');
  const addFormType = document.getElementById('formType');
  const addFormClass = document.getElementById('formClass');
  const addFormTime = document.getElementById('formTime');

  let data = {
    call_type: addFormType.value, 
    call_class: addFormClass.value,
    call_time: addFormTime.value
  }

  addForm.addEventListener('click', function() {
    postData('/api/calls', data)
     .then(data => {
        console.log(data); 
      });
  })
  
  const requestDis = await fetch('/api/dispatch/' + inc[0].dispatch_id);
  const requestDisToJSON = await requestDis.json();
  const dispatch = requestDisToJSON.data;
  const disID = document.getElementById('dispatchID');
  const disTime = document.getElementById('dispatchTime');
  const arrTime = document.getElementById('arrivalTime');
  const resTime = document.getElementById('responseTime');
  const arrUnit = document.getElementById('arrivalUnit');
  const clearedTime = document.getElementById('clearedTime');
 
  disID.innerHTML = 'ID: ' + dispatch[0].dispatch_id;
  disTime.innerHTML = 'Dispatch Time: ' + dispatch[0].dispatch_time;
  arrTime.innerHTML = 'Arrival Time: ' + dispatch[0].arrival_time;
  resTime.innerHTML = 'Response Time: ' + dispatch[0].response_time;
  arrUnit.innerHTML = 'Arrival Unit: ' + dispatch[0].arrival_unit;
  clearedTime.innerHTML = 'Cleared Time ' + dispatch[0].cleared_time;

  const requestUnits = await fetch('/api/units/' + inc[0].unit_id);
  const requestUnitsToJSON = await requestUnits.json();
  const units = requestUnitsToJSON.data;
  const unitID = document.getElementById('unitID');
  const unitNumber = document.getElementById('unitNumber');
  const unitClassName = document.getElementById('unitClassName');

  unitID.innerHTML = 'ID: ' + units[0].unit_id;
  unitNumber.innerHTML = 'Number: ' + units[0].unit_number;
  unitClassName.innerHTML = 'Class Name: ' + units[0].unit_class_name;


  const activeTableName = document.querySelector('li.is-active a').textContent;
  const activeForm = document.getElementById(activeTableName);
  console.log(activeForm);
}

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors', 
    cache: 'no-cache', 
    credentials: 'same-origin', 
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow', 
    referrerPolicy: 'no-referrer', 
    body: JSON.stringify(data) 
  });
  return response.json(); 
}


async function deleteIncident() {
  const incID = document.getElementById('incidentID').innerHTML.substring(4,11);
  const request = await fetch('/api/**path to table**' + incID, {mode: 'DEL'});
}

async function windowActions() {
  const map = await mapInit();
  await dataHandler(map);
}

window.onload = windowActions;