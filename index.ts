const { OpenAIApi, Configuration } = require("openai");
import * as path from 'path';
import * as fs from 'fs';
import * as  express from 'express';
import * as  multer from 'multer';
import  * as  gTTS from "gtts"
import { OpenAI } from "langchain/llms/openai";

const openai = new OpenAIApi(new Configuration({ 
  apiKey: process.env.OPENAI_API_KEY,
 }))

 let tokens = ""

const model = new OpenAI({
    streaming: true,   
    maxTokens: 3000,
    callbacks: [{
      handleLLMError(err: Error) {
         console.log(err.message)
     },
      handleLLMNewToken(token: string) {
          console.log(token);
          tokens += token;
          io.emit('message', token);
      },
      handleLLMEnd() {
        io.emit('generating');
        const  gtts = new gTTS(tokens, 'en');
 
        let files = fs.readdirSync(path.join(__dirname, 'uploads'));
        const lastFile = files[files.length - 1];

        gtts.save(path.join(__dirname, 'uploads', lastFile.replace(".mp3", "-gen.mp3")), function (err, result){
            if(err) { throw new Error(err); }            
            tokens = ""
            console.log("Text to speech converted!");
            io.emit('converted');
        });      
      }
  }]  
});

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },

  filename(req, file, cb) {
    const fileNameArr = file.originalname.split('.');
    cb(null, `${Date.now()}.${fileNameArr[fileNameArr.length - 1]}`);
  },
});

const upload = multer({ storage });
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('disconnect', () => {
      console.log('user disconnected');
    });
});

app.use(express.static('public/assets'));
app.use(express.static('uploads'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/record', upload.single('audio'), async (req, res) => {

  let files = fs.readdirSync(path.join(__dirname, 'uploads'));
  const lastFile = files[files.length - 1];

  const transcription = await transcribeAudio(lastFile);
  console.log('Transcription:', transcription);

   await model.call(transcription);

   const txtPath = path.join(__dirname, 'uploads', req.file.filename.replace(".mp3", "-prompt.txt"))
   fs.writeFileSync(txtPath, transcription);

   const responsePath = path.join(__dirname, 'uploads', req.file.filename.replace(".mp3", "-gen.txt"))
   fs.writeFileSync(responsePath, tokens);

   return res.json({ success: true })
}) 

app.get('/recordings', async (req, res) => {
  let filesTexts = fs.readdirSync(path.join(__dirname, 'uploads'));

  const files = filesTexts.filter((file) => {
    const fileNameArr = file.split('-');
    return fileNameArr[fileNameArr.length - 1] === 'gen.mp3';
  }).map((file) => `/${file}`);

  const prompts = filesTexts.filter((file) => {
    const fileNameArr = file.split('-');
    return fileNameArr[fileNameArr.length - 1] === 'prompt.txt';
  }).map((txt) => fs.readFileSync(path.join(__dirname, 'uploads', txt), 'utf8'));

  const responses = filesTexts.filter((file) => {
    const fileNameArr = file.split('-');
    return fileNameArr[fileNameArr.length - 1] === 'gen.txt';
  }).map((txt) => fs.readFileSync(path.join(__dirname, 'uploads', txt), 'utf8'));
  
  return res.json({ success: true, files, prompts, responses });
});

async function transcribeAudio(filename) {
  const transcript = await openai.createTranscription(
    fs.createReadStream(path.join(__dirname, 'uploads', filename)),
    "whisper-1"
  );
  return transcript.data.text;
}

http.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
