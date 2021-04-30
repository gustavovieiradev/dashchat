import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { fauna } from "../../../services/fauna";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      await fauna.query(
        q.Update(
          q.Select("ref",
            q.Get(
              q.Match(q.Index("ix_config_id_project"), req.body.id_project)
            )
          ),
          {
            data: req.body
          }
        )
      )

      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ err })
    }
  }
}