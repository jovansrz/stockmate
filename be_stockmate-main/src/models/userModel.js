import pool from '../config/db.js';

export const getAllUsers = async () => {
  const query = `
    SELECT 
      * 
    FROM 
      userdata
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const findUserByCredentials = async (username, password) => {
  const query = `
    SELECT 
      id, 
      username, 
      totalXp,
      saldo_virtual
    FROM 
      userdata
    WHERE 
      username = $1 AND password = $2
  `;
  const result = await pool.query(query, [username, password]);
  return result.rows[0]; // Returns the user object if found, otherwise undefined
};

export const getUserByUsername = async (username) => {
  const query = `
    SELECT 
      * 
    FROM 
      userdata
    WHERE 
      username = $1
  `;
  const result = await pool.query(query, [username]);
  return result.rows[0];
};

export const createUser = async (name, username, password) => {
  const query = `
    INSERT INTO userdata (name, username, password, totalXp, saldo_virtual)
    VALUES ($1, $2, $3, 0, 10000000)
    RETURNING id, name, username, totalxp, saldo_virtual
  `;
  const result = await pool.query(query, [name, username, password]);
  return result.rows[0];
};

export const addUserXp = async (userId, xpToAdd) => {
  const query = `
    UPDATE userdata 
    SET totalXp = totalXp + $1 
    WHERE id = $2 
    RETURNING id, username, totalxp
  `;
  const result = await pool.query(query, [xpToAdd, userId]);
  return result.rows[0];
};

export const updateUserSaldo = async (userId, newSaldo) => {
  const query = `
    UPDATE userdata 
    SET saldo_virtual = $1 
    WHERE id = $2 
    RETURNING id, username, saldo_virtual
  `;
  const result = await pool.query(query, [newSaldo, userId]);
  return result.rows[0];
};

export const getUserById = async (id) => {
  const query = `
    SELECT 
      * 
    FROM 
      userdata
    WHERE 
      id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const updateUserProfile = async (id, name, username, updateUsernameTimestamp) => {
  let query;
  let params;

  if (updateUsernameTimestamp) {
    query = `
      UPDATE userdata
      SET name = $1, username = $2, last_username_change = NOW()
      WHERE id = $3
      RETURNING id, name, username, last_username_change, totalxp, saldo_virtual
    `;
    params = [name, username, id];
  } else {
    query = `
      UPDATE userdata
      SET name = $1, username = $2
      WHERE id = $3
      RETURNING id, name, username, last_username_change, totalxp, saldo_virtual
    `;
    params = [name, username, id];
  }

  const result = await pool.query(query, params);
  return result.rows[0];
};
