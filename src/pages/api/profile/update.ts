import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { fauna } from "../../../services/fauna";
import { generateHash } from "../_lib/password";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const password = await generateHash(req.body.password);
      await fauna.query(
        q.Update(
          q.Select("ref",
            q.Get(
              q.Match(q.Index("ix_user_email"), req.body.email)
            )
          ),
          {
            data: {
              name: req.body.name,
              password
            },
          }
        )
      )
      return res.json({success: true});
    } catch (err) {
      return res.status(500).json({err})
    }
  }
}