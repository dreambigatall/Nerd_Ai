import { useEffect, useRef, useState } from "react";
import "./newPrompt.css";
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import model from "../../lib/gemini";
import Markdown from "react-markdown"
export default function NewPrompt({data}) {
  const [quetion, setQuetion]=useState("");
  const [answer,setAnswer]= useState("")
  const [image, setImg]=useState({
    isLoading:false,
    error:"",
    dbData:{},
    aiData:{}

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

    const endRef=useRef(null)
  useEffect(()=>{
    endRef.current.scrollIntoView({behavior:"smooth"})
  }, [quetion,answer, image.dbData])
 

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
  
    try {
      setQuetion(text);
      const result = await chat.sendMessageStream(Object.entries(image.aiData).length ? [image.aiData, text] : [text ]);
      let accumulatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        //console.log(chunkText);
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }
    } catch (error) {
      console.error("Error generating content:", error);
    }
    setImg({
      isLoading:false,
    error:"",
    dbData:{},
    aiData:{}
    })
  };

  return (
    <>
    {image.isLoading && <div className="">Loading...</div>}
    {image.dbData?.filePath &&
    <IKImage
     urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
     path={image.dbData?.filePath}
     width="380"
     transformation={[{width:380}]}
    /> }
    {quetion && <div className="message user">{quetion}</div>}
    {answer && <div className="message "><Markdown>{answer}</Markdown></div>}
    
    <div className="endChat" ref={endRef}></div>
      <form className="newForm" onSubmit={handleSubmit}>
       <Upload setImg={setImg}/>
       <input type="file" id="file" multiple={false} hidden/>
       <input type="text" name="text" placeholder="Ask your nerd quetion..." />
       <button>
         <img src="arrow.png" alt="" />
         </button>
      </form>
    </>
  );
}
