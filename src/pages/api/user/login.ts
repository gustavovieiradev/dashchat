import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { fauna } from "../../../services/fauna";
import { compareHash } from "../_lib/password";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const user: any = await fauna.query(
        q.Get(
          q.Match(
            q.Index('ix_user_email'),
            q.Casefold(req.body.email)
          ),
        )
      );

      const passwordMatched = await compareHash(req.body.password, user.data.password);

      if (!passwordMatched) {
        res.status(400).json({error: true});
      }

      return res.json(user);
    } catch(err) {
      res.status(400).json(err);
    }
  }
}