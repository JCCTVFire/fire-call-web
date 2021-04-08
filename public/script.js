import { Json } from "sequelize/types/lib/utils";

async function getDates() {

    const date_text = document.getElementById('button1');
    const data = {
        start_date = new Date('2018-05-08'),
        end_date = new Date('2018-05-10')
    }
    const endpoint = '/api/incidents/on_dates';
    const response = await fetch (endpoint, body: JSON.stringify(data);
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

