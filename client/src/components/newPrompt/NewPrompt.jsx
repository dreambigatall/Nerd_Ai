import React, { useState, useEffect, useRef } from 'react';
import model from "../../lib/gemini";
import Markdown from "react-markdown";
import { IKImage } from 'imagekitio-react';
import Upload from '../upload/Upload'; // Ensure you have this component

export default function NewPrompt({ data }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [image, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {}
  });

  const chat = model.startChat({
    history: data?.history?.map(({ role, parts }) => ({
      role,
      parts: [{ text: parts[0].text }]
    })) || [],
    generationConfig: {
      // maxOutputTokens: 100,
    },
  });

  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [question, answer, image.dbData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;

    try {
      setQuestion(text);
      const result = await chat.sendMessageStream(Object.entries(image.aiData).length ? [image.aiData, text] : [text]);
      let accumulatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = await chunk.text(); // Ensure chunk.text() is awaited
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }
    } catch (error) {
      console.error("Error generating content:", error);
    }
    setImg({
      isLoading: false,
      error: "",
      dbData: {},
      aiData: {}
    });
  };

  return (
    <>
      {image.isLoading && <div className="">Loading...</div>}
      {image.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={image.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}
        />
      )}
      {question && <div className="message user">{question}</div>}
      {answer && <div className="message"><Markdown>{answer}</Markdown></div>}
      
      <div className="endChat" ref={endRef}></div>
      <form className="newForm" onSubmit={handleSubmit}>
        <Upload setImg={setImg} />
        <input type="file" id="file" multiple={false} hidden />
        <input type="text" name="text" placeholder="Ask your nerd question..." />
        <button type="submit">
          <img src="arrow.png" alt="" />
        </button>
      </form>
    </>
  );
}
