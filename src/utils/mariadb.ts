import { createPool } from "mariadb";

export class MariaDB {
  static pool = createPool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "3306"),
    connectionLimit: 1,
  });

  insert = async (table: string, data: { [key: string]: boolean | string | number | null }) => {
    let conn;

    const fields = Object.keys(data);
    const values = Object.values(data);

    const query = `INSERT INTO ${table} (${fields.join(",")}) VALUES (${fields.map(f => "?").join(",")})`;

    try {
      conn = await MariaDB.pool.getConnection();
      await conn.query(query, values);
    } finally {
      if (conn) conn.release();
    }
  }

  update = async (table: string, id: string, data: { [key: string]: boolean | string | number | null }) => {
    let conn, res;

    const fields = Object.keys(data);
    const values = Object.values(data);

    const query = `UPDATE ${table} SET ${fields.map(f => f + "=?").join(",")} WHERE id = ?`;

    try {
      conn = await MariaDB.pool.getConnection();
      res = await conn.query(query, [...values, id]);
    } finally {
      if (conn) conn.release();
    }

    if (res.affectedRows === 0) throw Error(`Record with id ${id} not found`);
  }

  get = async (table: string) => {
    let conn, res;

    const query = `SELECT * FROM ${table}`;

    try {
      conn = await MariaDB.pool.getConnection();
      res = await conn.query(query);
    } finally {
      if (conn) conn.release();
    }

    return res;
  }
}
