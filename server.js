const venom = require("venom-bot");
const express = require("express")
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require("dotenv").config()

const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json({limit: "100mb"}))
app.use(express.static(path.join(__dirname, "public")))

let pesanMasuk = ["Hi", "Hello", "Oi", "P", "Bro", "Cuy"]
let pesanBalas = [
`Hello, maaf saya sedang tidak online... 🙊`,
`Guys, saya tidak online, hubungi saya 30 menit lagi, terima kasih `,
`_Mohon maaf saya tidak online_
*WA-BOT* 🙊
`
]
venom
  .create()
  .then((client) => {
    start(client);
  })
  .catch((err) => {
    console.error(err);
  });

  const randomPesan = (arr)=>{
    let idxArr = Math.floor(Math.random() * arr.length) // 0 - 2
    console.info(arr[idxArr])
    return arr[idxArr]
  }

  randomPesan(pesanBalas)


// venom runner
const start = (client) => {
  //listener WA
  client.onMessage((msg) => {
    if (pesanMasuk.includes(msg.body) && msg.isGroupMsg === false) {
      client
        .sendText(msg.from, randomPesan(pesanBalas))
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });

  app.post("/api/kirim_pesan",async(req,res)=>{
    try {
      const {to, msg} = await req.body
      const kirim = await client.sendText(`${to}@c.us`, msg)

      res.status(200).json({
        success: true,
        result: kirim
      })
    } catch (error) {
      res.status(500).json({
      success: false,
      error : error.message
      })
    }
  })
};

app.listen(PORT,()=>{
  console.log(`
  SERVER RUNNING TO PORT ${PORT}
  `);
})