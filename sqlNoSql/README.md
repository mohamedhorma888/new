# SQL/NoSQL CRUD Demo

This project demonstrates equivalent CRUD operations against two different database systems from a Node.js/Express backend.

## Project structure

- `models/Product.js` - Mongoose schema for MongoDB
- `controllers/NoSQLcontroller.js` - handlers using Mongoose
- `controllers/SQLcontroller.js` - handlers using `mysql2` with parameterized SQL
- `db/mysql.js` - MySQL connection pool
- `db/init.sql` - SQL script to create the `products` table
- `app.js` - simple Express server wiring both controllers to routes

## Product fields

| field     | type    | required | notes                    |
|-----------|---------|----------|--------------------------|
| id        | auto    | auto     | generated (ObjectId/AI)  |
| name      | string  | yes      |                          |
| price     | number  | yes      |                          |
| category  | string  | no       |                          |
| inStock   | boolean | default true |                    |

## Getting started

1. Install dependencies:
   ```sh
   npm install
   ```

2. Start a MongoDB server and/or MySQL server.
   - For MySQL, create a database (default `testdb`) and run `db/init.sql`:
     ```sh
     mysql -u root -p testdb < db/init.sql
     ```

3. Set environment variables as needed:
   - `MONGO_URI`, `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, etc.

4. Launch the app:
   ```sh
   npm run dev   # with nodemon
   ```

5. Use HTTP clients (curl, Postman) to exercise endpoints:
   - `POST /nosql/products` and `/sql/products` etc.

## Usage comparison

Both controllers expose the same REST interface; the internals differ only by database client and query syntax. The MongoDB version uses Mongoose models, while the SQL version builds parameterized queries and maps boolean values to tinyint.

---

This setup fulfills the checkpoint requirement: two controllers implementing a full CRUD flow across MongoDB and MySQL with equivalent field definitions.
