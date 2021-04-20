import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { fauna } from "../../../services/fauna";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const intents = await fauna.query(
        q.Map(
          q.Paginate(
            q.Match(q.Index('ix_intent'))
          ),
          q.Lambda("X", q.Get(q.Var("X")))
        )
      )
      return res.json(intents);
    } catch (err) {
      return res.status(500).json({err})
    }
  }
}