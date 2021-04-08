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
    
    const response = await fetch('api/incidents', { method: 'POST', body: JSON.stringify(data)});
    return response.json();
}

async function testUpdate() {
    const data = {
        incident_id: 1821899,
        description: 'This has been updated'
    }

    const response = await fetch('api/incidents', { method: 'PUT', body: JSON.stringify(data)});
    return response.json();
}


async function windowActions() {

    const output = document.getElementById('displayOut');

    const button2 = document.getElementById('button2');
    const button3 = document.getElementById('button3');
    const button4 = document.getElementById('button4');

    button2.onclick = () => {
        const res = testCreate();
        output.innerText = res;
    };
    
    button3.onclick = () => {
        const res = testUpdate();
        output.innerText = res;
    }
}

window.onload = windowActions;