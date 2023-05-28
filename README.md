# Speech to Text to Speech

I just built an app where you can record your voice and see the text extracted from your voice and the image generated.

I turn my audio into text using [Whisper](https://openai.com/research/whisper)  which is an OpenAI Speech Recognition Model that turns audio into text with up to 99% accuracy. Whisper is a speech transcription system form the creators of ChatGPT. Anyone can use it, and it is completely free. The system is trained on 680 000 hours of speech data from the network and recognizes 99 languages.

I generated images from texts using Replicate. [Replicat](https://replicate.com/blog/machine-learning-needs-better-tools) runs machine learning models on the cloud. They have a library of open-source
models that we can run with a few lines of code. 



I built a Node.js app where you can ask questions to ChatGPT using voice prompts, see the ChatGPT-like word-by-word answer, and then listen to the responses with voice.

Voice to Text: I turn an audio into text using [Whisper](https://openai.com/research/whisper) which is an OpenAI Speech Recognition Model that turns audio 
into text with up to 99% accuracy. Whisper is a speech transcription system form the creators of ChatGPT. Anyone can use it, and it is completely free. The system is trained on 680 000 hours of speech data from the network and recognizes 99 languages.

Generating Answers: To generate word-by-word answers and display them, we utilize the LangChain streaming API [LangChain](https://js.langchain.com/). This API allows
us to receive words in real-time as they are generated. Additionally, we use Node.js Socket.IO, which enables bidirectional and event-based communication between the client and server.
Text to Voice: I use [gTTS.js](https://www.npmjs.com/package/gtts) which is Google Text to Speech JavaScript library originally written in Phyton.


To get started.
```
       Clone the repository

       git clone https://github.com/Ashot72/Speech-to-Text-to-Speech
       cd Speech-to-Text-to-Speech

       Add your key to .env file
       
       # installs dependencies
         npm install

       # to run locally
         npm start
      
```

Go to [Speech To Text to Speech Video](https://youtu.be/PZWEQjuDxog) page

Go to [Speech To Text to Speech Description](https://ashot72.github.io/Speech-to-Text-to-Speech/doc.html) page
