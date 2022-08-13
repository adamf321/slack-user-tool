import { createPool } from "mariadb";

export class MariaDB {
  static pool = createPool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "3306"),
    connectionLimit: 5
  });

  insert = async (table: string, data: { [key: string]: boolean | string | number }) => {
    let conn, res;

    const fields = Object.keys(data);
    const values = Object.values(data);

    console.log(data, fields, values);

    const query = `INSERT INTO ${table} (${fields.join(",")}) VALUES (${fields.map(f => "?").join(",")})`;

    try {
      conn = await MariaDB.pool.getConnection();
      res = await conn.query(query, values);
    } finally {
      if (conn) conn.release();
    }
  }
}
