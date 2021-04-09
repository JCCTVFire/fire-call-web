const myHeaders = new Headers({
    "Content-Type": "application/json"
});
async function getDates() {

    const data = {
        'startDate': '2018-05-08',
        'endDate': '2018-05-10'
    }
    const endpoint = '/api/incidents/on_dates';

    console.log(data, JSON.stringify(data));
    const res = await fetch(endpoint, { method: 'POST', headers: myHeaders, body: JSON.stringify(data)});
    const result =  await res.json();
    console.log(result);
    return result;
}

async function testDelete() {
        
    const test_record = 1821899;
    const data = {
        incident_id: 1821899
    }
    console.log(data)
    // const delete_button = document.getElementById('button4');
    const endpoint = `/api/incidents/${test_record}`;
    const response = await fetch(endpoint, {method: 'DELETE', headers: myHeaders});
    const result =  await response.text();
    return result;
}

async function testCreate() {
    const data = {
        incident_id: 1821899, 
        date: new Date('2018-05-11'),
        description: 'EMS call, excluding vehicle accident with injury',
        postal_code: '22204    ',
        district_code: '10909    ',
        call_id: null,
        dispatch_id: null
    }
    
    const response = await fetch('api/incidents', { method: 'POST', headers: myHeaders, body: JSON.stringify(data)});
    const result = await response.json()
    return result;
}

async function testUpdate() {
    const data = {
        incident_id: 1821899,
        description: 'This has been updated.'
    }
    console.log(data, JSON.stringify(data));
    const response = await fetch('api/incidents', { method: 'PUT', headers: myHeaders, body: JSON.stringify(data)});
    const result = await response.text();
    return result;
}


async function windowActions() {

    const output = document.getElementById('displayOut');

    const button1 = document.getElementById('button1');
    const button2 = document.getElementById('button2');
    const button3 = document.getElementById('button3');
    const button4 = document.getElementById('button4');

    button1.addEventListener('click', async (event) => {
        event.preventDefault();
        const res = await getDates();
        output.innerText = JSON.stringify(res);
    });
    button2.addEventListener('click', async (event) => {
        event.preventDefault();
        const res = await testCreate();
        output.innerText = JSON.stringify(res);
    });

    button3.addEventListener('click', async (event) => {
        event.preventDefault();
        const res = await testUpdate();
        output.innerText = res;
    });

    button4.addEventListener('click', async (event) => {
        event.preventDefault();
        const res = await testDelete();
        output.innerText = JSON.stringify(res);
    });
}

window.onload = windowActions;

