import { NextApiRequest, NextApiResponse } from "next";
import { apiNest } from "../../../services/api-nest";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      await apiNest.post('projeto', req.body);
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ err })
    }
  }

  if (req.method === 'PATCH') {
    try {
    } catch (err) {
      return res.status(500).json({ err })
    }
  }
}