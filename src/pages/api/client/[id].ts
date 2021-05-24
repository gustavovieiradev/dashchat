import { NextApiRequest, NextApiResponse } from "next";
import { apiNest } from "../../../services/api-nest";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PATCH') {
    try {
      await apiNest.patch(`cliente/${req.query.id}`, req.body);
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ err })
    }
  }
}