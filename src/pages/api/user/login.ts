import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { fauna } from "../../../services/fauna";
import { compareHash } from "../_lib/password";
import { sign } from "jsonwebtoken";

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

      const jwt = {
        secret: process.env.APP_SECRET,
        expiresIn: '1d'
      };

      const token = sign({}, jwt.secret, {
        subject: user.data.email,
        expiresIn: jwt.expiresIn,
      })

      return res.json({
        user,
        token
      });
    } catch(err) {

      console.log(err);

      res.status(400).json(err);
    }
  }
}