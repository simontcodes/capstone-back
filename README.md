# CM Immigration API
Its the API of [CM Immigration](https://github.com/simontcodes/captstone-front).

## Build
This is a RESTful API built in Express framework in Node.js.

This API also includes the following:
- Knex for managing mySQL DB
- Sendgrid for email
- UUID for asigning ids

## Getting Started
 ### Requirements
 Before you begin, make sure you have all the below installed:

- Node.js v16 or above
- Git
- mySQL or other SQL suite.

1. Clone this repo with `git clone`.
2. Run `npm install` to install all dependencies.
3. Create a DB and connect to project with knex
4. Run migrations with `knex migrate:latest`
5. Set all development keys in the `.env` file
6. Run `npm run dev` to get the server up and running.

## End points
### /clients
- `GET`
Response:

### /clientspost
- `POST`
Response:

### /appointments
- `GET`
Response:

### /payment
- `POST`
Response:

### /login
- `POST`
Response:

## Next steps

- Add edit and delete functionality for clients and appointments
- Add password field to clients table so they can as well log in.



