import { query } from "../../lib/db";

export default async function handler(req, res) {
  try {
    const data = await query("SELECT * FROM users");
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
