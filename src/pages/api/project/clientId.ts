import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { fauna } from "../../../services/fauna";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const projects = await fauna.query(
    q.Map(
      q.Paginate(
        q.Match(
          q.Index('ix_project_client_id'),
          q.Casefold(req.query.id)
        )
      ),
      q.Lambda("X", q.Get(q.Var("X")))
    )
  )
  return res.json(projects);
}