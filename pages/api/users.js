import { query } from "../../lib/db";

export default async function handler(req, res) {
  try {
    const users = await query("SELECT * FROM users"); // Replace with your table name
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
