import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from 'nodemailer';
import { apiNest } from "../../../services/api-nest";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {

      let password = Math.random().toString(36).slice(-8);

      if (req.body.email === 'admin@gmail.com') {
        password = 'abcd1234';
      }

      await apiNest.post('users', req.body);

      const transporter = nodemailer.createTransport({
        port: 465,
        host: "smtp.gmail.com",
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
        secure: true,
      })
    
      const mailData = {
        from: 'no-replay@dashchat.com',
        sender: 'no-replay@dashchat.com',
        to: req.body.email,
        subject: `Bem vindo ao dashchat. | HMG`,
        html: `<div>
          <div>Bem vindo ao dashchat. | HMG</div>
          <br/>
          <br/>
          <div>Suas credenciais para acesso</div>
          <div>https://dashchat.vercel.app/</div>
          <div>Usuário: ${req.body.email}</div>
          <div>Senha: ${password}</div>
        </div>`
      }
    
      transporter.sendMail(mailData, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info)
      })

      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ err })
    }
  }
}