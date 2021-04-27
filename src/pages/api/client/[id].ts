import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { fauna } from "../../../services/fauna";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await fauna.query(
    q.Get(
      q.Match(
        q.Index('ix_client_id'),
        q.Casefold(req.query.id)
      )
    )
  )

  return res.json(client);
}