# fire-call-web 
>An open-source web-based emergency dispatch management and display tool and API.

Heroku deployment: https://fathomless-depths-82143.herokuapp.com

## Developer Notes
### Installation
1. Clone or fork this repository to your machine.
2. Run `npm install` in the base directory to install required packages.


### Startup of Test Server
Starts a dev server on your localhost
1. Run `npm start` to start the application.
2. Open http://localhost:3000 on your browser to view the webpage.

## API Documentation
All requests and responses should use JSON headers unless otherwise specified.

`/api/incidents` - Routes for dealing with the incidents resource. This is the primary resource in use and joins the rest of the implemented tables.
- GET - Pulls all emergency incidents and assorted values from other tables. Returns `{data: [ JSON objects ], size: N}`, where `data` contains the data JSON, and size and the number of those objects `N`.
- POST - Creates a new incident. Returns `{data: [ JSON object ], message: 'Inserted new entry in "incidents" with call_id 10101011.'}` if successful.

`/api/incidents/:incident_id` - Routes dealing with existing single incidents by their primary key.
- GET - Gets an individual incident. Returns the data and the number of entries in the request (see above). 
- DELETE - Deletes that incident from the database, and all associated values. Returns `{message: "Deleted N rows in incidents."}` if successful. Can be used to be remove multiple values with the same `incident_id`.

`/api/calls/:call_id` - Deals with individual calls, which is included in an incidents request.
- PUT - Updates the values in the call. Returns `{message: "Successfully updated an incident."}` if successful.

`/api/calls/:call_id/incident` - GET - Returns the incident with the corresponding call_id.

`/api/search?endDate=&startDate=&limit=` 
- GET - Keyword search endpoint passed by the search bar in an application. Can be modified with filter values. Returns JSON with data and size of the return as above. Can be modified by `startDate`, `endDate`, and `limit`. `startDate` and `endDate` should be in YYYY-MM-DD format (i.e. 2021-05-07). 
    >Searches throught following:
    >- Call class
    >- Call type
    >- Incident description
    >- Unit number
    >- Unit class name

`/api/mapInit` - GET - Used on the loading of the map to fill it with the first 20 entries in the incidents resource. Returns a JSON object with an array of 20 entries and the size of the array, as above.


### Errors & No Result
For all requests, if there is an error on the back end, the response will be 
`{ error: "Server error" }`.

If a get request returns no results, the response will be `{ message: "No results found." }`.

## Known Bugs
Upon creation of a new entry, does not pan to the new point even though it is marked on the map.

## Development Goals
To expand the editing and creation capabilities to include all tables, resources, instead of just the calls resource. Also, need to implement a token authentication system, possibly using OAuth2 standard.

## Additional API Documentation
Additional endpoints exist, but are not used in the demo web site. For full api documentation, go to the Postman document [here.](https://documenter.getpostman.com/view/13807059/TzRNEUyb)

### NOTE: 
Initial code for database initialization modified from INST377-SP2021/Sequelize.
