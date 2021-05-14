// User feedback functions

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

async function editButtonHandler(button) {
  const elem = button.parentElement;
  const idForEdit = elem.getElementsByClassName('inc-id')[0].innerHTML;
  const response = await fetch('/api/incidents/'+idForEdit);
  const responseJSON = await response.json();
  const data = responseJSON.data;
  console.log(data);
  await populateForm(data[0]);
}


function createPopupNotification(response, prefix, targetID) {
  // creates a new notification based on response, with ids set by prefix, and appended to target element
  const notifID = `${prefix}-status-tag`
  const deleteID = `${prefix}-delete-button`

  // Remove old notifications
  const notifications = document.querySelectorAll(`#${notifID}`);
  if (notifications.length > 0) {
    notifications.forEach((notif) => notif.remove());
  }

  // Create and fill out a notification box depending on the type of message.
  const messageBox = document.createElement('div');
  messageBox.classList.add('notification');
  messageBox.id = notifID;
  if (response.message) {
    const message = response['message'];
    messageBox.classList.add('is-success');
    messageBox.innerHTML = `${message}<a id="${deleteID}" class="delete is-small"></a>`
  } else {
    const error = response['error'];
    messageBox.classList.add('is-danger');
    console.log(response);
    messageBox.innerHTML = `${error}<a id="${deleteID}" class="delete is-small"></a>`
  }

  // Add it to the target, given by ID.
  const targetElement = document.getElementById(targetID);
  targetElement.append(messageBox);
  const deleteButton = document.getElementById(deleteID);
  deleteButton.onclick = (evt) => messageBox.remove();
}

// Map functions
async function markMap(mapObjectFromFunction, incident) {
  const marker = L.marker([incident.location.lat, incident.location.long]).addTo(mapObjectFromFunction);
  const latlng = L.latLng(incident.location.lat, incident.location.long);
  const editBtn = L.DomUtil.create('a', 'edit');
  editBtn.innerHTML = '<a href="#manageForm" onclick="editButtonHandler(this)">Edit</a>';     
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


// Data handling
async function postData(url = '', data = {}) {
  const request = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: data 
  });
  const response = await request.json();
  createPopupNotification(response, 'add', 'add-call-display');
  return response;
}

async function sendUpdate(tableName, formData, id) {
  const request = await fetch('/api/'+tableName+'/'+id, { 
    headers: {'Content-Type': 'application/json'}, 
    body: formData, 
    method: 'PUT'
  });
  const response = await request.json();
  createPopupNotification(response, 'manage', 'Call');
}

async function deleteIncident() {
  const idText = document.getElementById('incidentID').textContent;
  const incID = idText.substring(4,idText.length);
  const request = await fetch('/api/incidents/' + incID, {method: 'DELETE'});
  const response = await request.json();
  createPopupNotification(response, 'deleter', 'Call')
}


async function dataHandler(mapObjectFromFunction) {
  const searchForm = document.querySelector('.userform');
  const search = document.getElementById('search_value');
  const startDate = document.getElementById('start');
  const endDate = document.getElementById('end');
  const limit = document.getElementById('limit');
   

  const addForm = document.getElementById('addForm');
  const addFormType = document.getElementById('formType');
  const addFormClass = document.getElementById('formClass');
  const addFormTime = document.getElementById('formTime');

  const searchIDBox = document.getElementById('callID');
  const findIDForm = document.getElementById('findID');

  async function findByID(evt) {
    evt.preventDefault();
    const idQuery = searchIDBox.value;
    const response = await fetch('/api/calls/' + idQuery + '/incident');
    const responseJSON = await response.json();
    try {
      const data = responseJSON.data;
      await populateForm(data[0]);
      // Remove current markers here
      mapObjectFromFunction.eachLayer(function (layer) {
        if (layer.options.tileSize != 512) {
            mapObjectFromFunction.removeLayer(layer);
        }
      });
      await markMap(mapObjectFromFunction, data[0]);
    } catch (err) {
      console.error(responseJSON.error);
      createPopupNotification(responseJSON, 'find', 'findID');
    }
  }

  findIDForm.addEventListener('submit', findByID);
  
  addForm.addEventListener('submit', async function (evt) {
    evt.preventDefault();

    let dataRaw = {
      date: Date(),
      call:{
        call_type: addFormType.value.trim(), 
        call_class: addFormClass.value.trim(),
        call_time: addFormTime.value.trim()
      },
      dispatch: {},
      location: {
        lat: 38.88024,
        long: -77.08556
      },
      unit: {
        unit_number: "A101",
        unit_class: "Ambulance"
      }
    }
    
    timeFormValue = addFormTime.value.trim();
    if ((timeFormValue === '') | (timeFormValue.search(/\d{2}:\d{2}:\d{2}/) === -1)) {
      let today = Date();
      console.log(today)
      let timePos = today.search(/\d{2}:\d{2}:\d{2}/);
      dataRaw.call.call_time = today.substring(timePos, timePos+8);
      console.log(dataRaw.call.call_time);
    }

    dataRaw.date.replace(/\d{2}:\d{2}:\d{2}/, '00:00:00');
    const data = JSON.stringify(dataRaw);
    const response = await postData('/api/incidents', data);

    const responseData = response.data[0];
    try { 
      // Remove current markers here
      mapObjectFromFunction.eachLayer(function (layer) {
        if (layer.options.tileSize != 512) {
            mapObjectFromFunction.removeLayer(layer);
        }
      });
      await markMap(mapObjectFromFunction, responseData);
    } catch (err) {
      alert('No results found!');
    }
  });



  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const requestSearch = await fetch('/api/search?queryText=' + search.value + '&startDate=' + 
                              startDate.value + '&endDate=' + endDate.value + '&limit=' + limit.value);
    
    const searchToJSON = await requestSearch.json();
    const searchData = searchToJSON.data;
    console.log(searchData);
    try { 
      // Remove current markers here
      mapObjectFromFunction.eachLayer(function (layer) {
        if (layer.options.tileSize != 512) {
            mapObjectFromFunction.removeLayer(layer);
        }
      });
      searchData.forEach(async (incident) => {
        await markMap(mapObjectFromFunction, incident);
      });
    } catch (err) {
      alert('No results found!');
    }
  });
}

async function populateForm(data) {
  const inc = data;
  const incID = document.getElementById('incidentID');
  const incDate = document.getElementById('incidentDate');
  const incDesc = document.getElementById('incidentDesc');
  const incPostal = document.getElementById('incidentPostal');
  const incDist = document.getElementById('incidentDist');

  incID.innerHTML = 'ID: ' + inc.incident_id;
  incDate.innerHTML = 'Date: ' + inc.date;
  incDesc.innerHTML = 'Description: ' + inc.description;
  incPostal.innerHTML = 'Postal Code: ' + inc.postal_code;
  incDist.innerHTML = 'District Code: ' + inc.district_code;

  const call = inc.call;
  const callID = document.getElementById('callID');
  const callType = document.getElementById('callType');
  const callClass = document.getElementById('callClass');
  const callTime = document.getElementById('callTime');
  
  callID.value = call.call_id;
  callType.value = call.call_type;
  callClass.value = call.call_class;
  let timePos = call.call_time.search(/\d{2}:\d{2}:\d{2}/);
  callTime.value = call.call_time.substring(timePos, timePos+8);

  const manageForm = document.getElementById('manageForm');
  manageForm.addEventListener('submit', async function (evt) {
    evt.preventDefault();
    await sendUpdate('calls', {call_type: callType.value, call_class: callClass.value, call_time: callTime.value}, call.call_id);
  });

  const deleteEntryButton = document.getElementById('delete-entry-button');
  deleteEntryButton.addEventListener('click', async (evt) => {
    evt.preventDefault();
    await deleteIncident();
  });

  const dispatch = inc.dispatch;
  const disID = document.getElementById('dispatchID');
  const disTime = document.getElementById('dispatchTime');
  const arrTime = document.getElementById('arrivalTime');
  const resTime = document.getElementById('responseTime');
  const arrUnit = document.getElementById('arrivalUnit');
  const clearedTime = document.getElementById('clearedTime');
 
  disID.innerHTML = 'ID: ' + dispatch.dispatch_id;
  disTime.innerHTML = 'Dispatch Time: ' + dispatch.dispatch_time;
  arrTime.innerHTML = 'Arrival Time: ' + dispatch.arrival_time;
  resTime.innerHTML = 'Response Time: ' + dispatch.response_time;
  arrUnit.innerHTML = 'Arrival Unit: ' + dispatch.arrival_unit;
  clearedTime.innerHTML = 'Cleared Time ' + dispatch.cleared_time;

  const units = inc.unit;
  const unitID = document.getElementById('unitID');
  const unitNumber = document.getElementById('unitNumber');
  const unitClassName = document.getElementById('unitClassName');

  unitID.innerHTML = 'ID: ' + units.unit_id;
  unitNumber.innerHTML = 'Number: ' + units.unit_number;
  unitClassName.innerHTML = 'Class Name: ' + units.unit_class_name;


  // const activeTableName = document.querySelector('li.is-active a').textContent;
  // const activeForm = document.getElementById(activeTableName);
}

async function windowActions() {
  const map = await mapInit();
  await dataHandler(map);
}

window.onload = windowActions;