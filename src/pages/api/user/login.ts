import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { fauna } from "../../../services/fauna";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const user = await fauna.query(
        q.Get(
          q.Intersection([
            q.Match(
              q.Index('ix_user_email'),
              q.Casefold(req.body.email)
            ),
            q.Match(
              q.Index('ix_user_password'),
              req.body.password
            )
          ])
        )
      );
    
      return res.json(user);
    } catch(err) {
      res.status(400).json(err);
    }
  }
}