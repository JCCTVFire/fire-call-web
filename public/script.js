import { Json } from "sequelize/types/lib/utils";

async function getDates() {

    const date_text = document.getElementById('button1');
    const data = {
        start_date = new Date('2018-05-08'),
        end_date = new Date('2018-05-10')
    }
    const endpoint = '/api/incidents/on_dates';
    const response = await fetch (endpoint, { body: JSON.stringify(data) });
    return response.json();

}



async function testDelete() {
    
    const test_record = 1821899;
    const data = {
        incident_id: test_record

    }
    const delete_button = document.getElementById('button4');
    const endpoint = '/api/incidents/incident_id';
    const response = await fetch (endpoint, {method: 'DELETE', body: JSON.stringify(data)});
    return response.json();
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

    const button1 = document.getElementById('button1');
    const button2 = document.getElementById('button2');
    const button3 = document.getElementById('button3');
    const button4 = document.getElementById('button4');

    button1.onclick = () => {
        const res = await getDates();
        output.innerText = res;
    }
    button2.onclick = () => {
        const res = await testCreate();
        output.innerText = res;
    };
    
    button3.onclick = () => {
        const res = await testUpdate();
        output.innerText = res;
    }
    button4.onclick = () => {
        const res = await testDelete();
        output.innerText =res;
    }
}

window.onload = windowActions;

