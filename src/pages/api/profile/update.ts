import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { fauna } from "../../../services/fauna";
import { generateHash } from "../_lib/password";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {

      const data: any = {
        name: req.body.name,
      }

      
      if (req.body.password) {
        data.password = await generateHash(req.body.password);
      }

      console.log(data)

      await fauna.query(
        q.Update(
          q.Select("ref",
            q.Get(
              q.Match(q.Index("ix_user_email"), req.body.email)
            )
          ),
          {
            data
          }
        )
      )
      return res.json({success: true});
    } catch (err) {
      console.log('err', err);
      return res.status(500).json(err);
    }
  }
}