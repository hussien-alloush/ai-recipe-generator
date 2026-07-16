import db from '../config/db.js';
import bcrypt from 'bcrypt';

class User {
  static async create(username, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING *',
      [email, hashedPassword, username]
    );

    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );

    return result.rows[0];
  }

  static async update(id, updates) {
    const { username, email } = updates;

    const result = await db.query(
      `UPDATE users 
       SET username = COALESCE($1, username),
           email = COALESCE($2, email)
       WHERE id = $3
       RETURNING *`,
      [username, email, id]
    );

    return result.rows[0];
  }

  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await db.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING *',
      [hashedPassword, id]
    );

    return result.rows[0];
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async delete(id) {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
  }
}

export default User;