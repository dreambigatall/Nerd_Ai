// // import React, { useState, useEffect, useRef } from 'react';
// // import model from "../../lib/gemini";
// // import Markdown from "react-markdown";
// // import { IKImage } from 'imagekitio-react';
// // import Upload from '../upload/Upload'; // Ensure you have this component

// // export default function NewPrompt({ data }) {
// //   const [question, setQuestion] = useState("");
// //   const [answer, setAnswer] = useState("");
// //   const [image, setImg] = useState({
// //     isLoading: false,
// //     error: "",
// //     dbData: {},
// //     aiData: {}
// //   });

// //   const chat = model.startChat({
// //     history: data?.history?.map(({ role, parts }) => ({
// //       role,
// //       parts: [{ text: parts[0].text }]
// //     })) || [],
// //     generationConfig: {
// //       // maxOutputTokens: 100,
// //     },
// //   });

// //   const endRef = useRef(null);

// //   useEffect(() => {
// //     if (endRef.current) {
// //       endRef.current.scrollIntoView({ behavior: "smooth" });
// //     }
// //   }, [question, answer, image.dbData]);

// //   const queryClient = useQueryClient();

// //   const mutation = useMutation({
// //     mutationFn: () => {
// //       return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
// //         method: "PUT",
// //         credentials: "include",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           question: question.length ? question : undefined,
// //           answer,
// //           img: img.dbData?.filePath || undefined,
// //         }),
// //       }).then((res) => res.json());
// //     },
// //     onSuccess: () => {
// //       queryClient
// //         .invalidateQueries({ queryKey: ["chat", data._id] })
// //         .then(() => {
// //           formRef.current.reset();
// //           setQuestion("");
// //           setAnswer("");
// //           setImg({
// //             isLoading: false,
// //             error: "",
// //             dbData: {},
// //             aiData: {},
// //           });
// //         });
// //     },
// //     onError: (err) => {
// //       console.log(err);
// //     },
// //   });

// //   const add = async (text, isInitial) => {
// //     if (!isInitial) setQuestion(text);

// //     try {
// //       const result = await chat.sendMessageStream(
// //         Object.entries(img.aiData).length ? [img.aiData, text] : [text]
// //       );
// //       let accumulatedText = "";
// //       for await (const chunk of result.stream) {
// //         const chunkText = chunk.text();
// //         console.log(chunkText);
// //         accumulatedText += chunkText;
// //         setAnswer(accumulatedText);
// //       }

// //       mutation.mutate();
// //     } catch (err) {
// //       console.log(err);
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     const text = e.target.text.value;
// //     if (!text) return;

// //     try {
// //       setQuestion(text);
// //       const result = await chat.sendMessageStream(Object.entries(image.aiData).length ? [image.aiData, text] : [text]);
// //       let accumulatedText = "";
// //       for await (const chunk of result.stream) {
// //         const chunkText = await chunk.text(); // Ensure chunk.text() is awaited
// //         accumulatedText += chunkText;
// //         setAnswer(accumulatedText);
// //       }
// //     } catch (error) {
// //       console.error("Error generating content:", error);
// //     }
// //     setImg({
// //       isLoading: false,
// //       error: "",
// //       dbData: {},
// //       aiData: {}
// //     });
// //   };

// //   return (
// //     <>
// //       {image.isLoading && <div className="">Loading...</div>}
// //       {image.dbData?.filePath && (
// //         <IKImage
// //           urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
// //           path={image.dbData?.filePath}
// //           width="380"
// //           transformation={[{ width: 380 }]}
// //         />
// //       )}
// //       {question && <div className="message user">{question}</div>}
// //       {answer && <div className="message"><Markdown>{answer}</Markdown></div>}
      
// //       <div className="endChat" ref={endRef}></div>
// //       <form className="newForm" onSubmit={handleSubmit}>
// //         <Upload setImg={setImg} />
// //         <input type="file" id="file" multiple={false} hidden />
// //         <input type="text" name="text" placeholder="Ask your nerd question..." />
// //         <button type="submit">
// //           <img src="arrow.png" alt="" />
// //         </button>
// //       </form>
// //     </>
// //   );
// // }


// import { useEffect, useRef, useState } from "react";
// import "./newPrompt.css";
// import Upload from "../upload/Upload";
// import { IKImage } from "imagekitio-react";
// import model from "../../lib/gemini";
// import Markdown from "react-markdown";
// import { useMutation, useQueryClient } from "@tanstack/react-query";

// const NewPrompt = ({ data }) => {
//   const [question, setQuestion] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [img, setImg] = useState({
//     isLoading: false,
//     error: "",
//     dbData: {},
//     aiData: {},
//   });

//   const chat = model.startChat({
//     history: data?.history?.map(({ role, parts }) => ({
//       role,
//       parts: [{ text: parts[0].text }],
//     })) || [],
//     generationConfig: {
//       // maxOutputTokens: 100,
//     },
//   });
  

//   const endRef = useRef(null);
//   const formRef = useRef(null);

//   useEffect(() => {
//     endRef.current.scrollIntoView({ behavior: "smooth" });
//   }, [data, question, answer, img.dbData]);

//   const queryClient = useQueryClient();

//   const mutation = useMutation({
//     mutationFn: () => {
//       return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
//         method: "PUT",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           question: question.length ? question : undefined,
//           answer,
//           img: img.dbData?.filePath || undefined,
//         }),
//       }).then((res) => res.json());
//     },
//     onSuccess: () => {
//       queryClient
//         .invalidateQueries({ queryKey: ["chat", data._id] })
//         .then(() => {
//           formRef.current.reset();
//           setQuestion("");
//           setAnswer("");
//           setImg({
//             isLoading: false,
//             error: "",
//             dbData: {},
//             aiData: {},
//           });
//         });
//     },
//     onError: (err) => {
//       console.log(err);
//     },
//   });

//   const add = async (text, isInitial) => {
//     if (!isInitial) setQuestion(text);

//     try {
//       const result = await chat.sendMessageStream(
//         Object.entries(img.aiData).length ? [img.aiData, text] : [text]
//       );
//       let accumulatedText = "";
//       for await (const chunk of result.stream) {
//         const chunkText = chunk.text();
//         console.log(chunkText);
//         accumulatedText += chunkText;
//         setAnswer(accumulatedText);
//       }

//       mutation.mutate();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const text = e.target.text.value;
//     if (!text) return;

//     add(text, false);
//   };

//   // IN PRODUCTION WE DON'T NEED IT
//   const hasRun = useRef(false);

//   useEffect(() => {
//     if (!hasRun.current) {
//       if (data?.history?.length === 1) {
//         add(data.history[0].parts[0].text, true);
//       }
//     }
//     hasRun.current = true;
//   }, []);

//   return (
//     <>
//       {/* ADD NEW CHAT */}
//       {img.isLoading && <div className="">Loading...</div>}
//       {img.dbData?.filePath && (
//         <IKImage
//           urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
//           path={img.dbData?.filePath}
//           width="380"
//           transformation={[{ width: 380 }]}
//         />
//       )}
//       {question && <div className="message user">{question}</div>}
//       {answer && (
//         <div className="message">
//           <Markdown>{answer}</Markdown>
//         </div>
//       )}
//       <div className="endChat" ref={endRef}></div>
//       <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
//         <Upload setImg={setImg} />
//         <input id="file" type="file" multiple={false} hidden />
//         <input type="text" name="text" placeholder="Ask anything..." />
//         <button>
//           <img src="/arrow.png" alt="" />
//         </button>
//       </form>
//     </>
//   );
// };

// export default NewPrompt;
import { useEffect, useRef, useState } from "react";
import "./newPrompt.css";
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import model from "../../lib/gemini";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react"; // Import useAuth

const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {}
  });
   // ... (img state remains the same)
  const [isGenerating, setIsGenerating] = useState(false); // Add state for generation loading

  const { getToken } = useAuth(); // Get the getToken function from Clerk

  // Initialize Gemini chat (consider memoizing if needed)
  const chat = model.startChat({
     history: data?.history?.map(({ role, parts }) => ({
       role,
       parts: [{ text: parts[0].text }],
     })) || [],
     generationConfig: {
       // maxOutputTokens: 100,
     },
   });

  const endRef = useRef(null);
  const formRef = useRef(null); // Ref for the form

  // Scroll effect
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [answer, question, img.dbData]); // Dependencies seem okay

  const queryClient = useQueryClient();

  // Mutation for updating chat history on the backend
  const mutation = useMutation({
    mutationFn: async (payload) => { // Make mutationFn async and accept payload
      const token = await getToken(); // Get token
       if (!token) {
         throw new Error("Not authenticated");
      }

      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        // credentials: "include", // May remove if using Bearer token
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Add Authorization header
        },
        body: JSON.stringify(payload), // Use the passed payload
      }).then((res) => {
          if (!res.ok) {
             // Throw an error to be caught by onError
             throw new Error(`Failed to update chat (status: ${res.status})`);
          }
          return res.json();
       });
    },
    onSuccess: () => {
      // Invalidate query to refetch updated chat data
      queryClient.invalidateQueries({ queryKey: ["chat", data._id] });
      // Reset form state AFTER successful mutation AND invalidation (optional, depending on desired UX)
       formRef.current?.reset(); // Reset the form using the ref
       setQuestion("");
       setAnswer("");
       setImg({
         isLoading: false,
         error: "",
         dbData: {},
         aiData: {},
       });
        setIsGenerating(false); // Stop loading indicator
    },
    onError: (err) => {
      console.error("Mutation Error:", err);
       setIsGenerating(false); // Stop loading indicator on error too
      // TODO: Show user-friendly error message
    },
  });

  // Function to handle sending message to Gemini and backend
  const add = async (text) => {
    if (!text || isGenerating) return; // Prevent empty submissions or multiple concurrent requests

    setQuestion(text); // Show user question immediately
    setAnswer(""); // Clear previous answer
    setIsGenerating(true); // Start loading indicator

    try {
      // Prepare prompt parts for Gemini (text and optional image)
      const promptParts = Object.keys(img.aiData).length ? [img.aiData, text] : [text];

      // Start streaming response from Gemini
      const result = await chat.sendMessageStream(promptParts);

      let accumulatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        accumulatedText += chunkText;
        setAnswer(accumulatedText); // Update answer state progressively
      }

      // Once Gemini response is complete, trigger backend mutation
      mutation.mutate({
        question: text, // Send the actual user question
        answer: accumulatedText, // Send the final Gemini answer
        img: img.dbData?.filePath || undefined,
      });

       // Reset image *after* successful processing (handled in onSuccess now)
       /* setImg({
         isLoading: false,
         error: "",
         dbData: {},
         aiData: {},
       }); */

    } catch (err) {
      console.error("Gemini Error:", err);
      setAnswer("Sorry, something went wrong while contacting the AI."); // Show error in chat
      setIsGenerating(false); // Stop loading indicator
    }
  };


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text")?.toString().trim(); // Get text and trim whitespace

    if (text) {
      add(text); // Call the add function
    }
  };

  // // Effect to handle initial AI response if history has only one message (user prompt)
  // // Consider if this logic is still needed or should be handled differently
  // const hasRun = useRef(false);
  // useEffect(() => {
  //   if (!hasRun.current && data?.history?.length === 1) {
  //     add(data.history[0].parts[0].text, true); // The 'true' flag seems unused in `add` now?
  //     hasRun.current = true;
  //   }
  // }, [data?.history]); // Dependency array looks okay

  return (
    <>
      {/* RENDER AREA FOR CURRENT INTERACTION (before it's part of data.history) */}
      {img.isLoading && <div className="message user">Uploading image...</div>}
      {img.dbData?.filePath && (
        <div className="message user"> {/* Wrap image in user message context */}
             <IKImage
               urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
               path={img.dbData?.filePath}
               width="380"
               transformation={[{ width: 380 }]}
               loading="lazy"
             />
         </div>
      )}
      {/* Display the user's question immediately */}
      {question && <div className="message user">{question}</div>}
      {/* Display the AI's answer as it streams in */}
      {answer && (
        <div className="message">
          <Markdown>{answer}</Markdown>
        </div>
      )}
       {/* Show loading indicator while AI is generating */}
       {isGenerating && <div className="message">Generating...</div>}

      {/* Invisible element to scroll to */}
      <div className="endChat" ref={endRef}></div>

      {/* Input Form */}
      <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
        <Upload setImg={setImg} disabled={isGenerating} /> {/* Disable upload while generating */}
        {/* Input field */}
        <input
             type="text"
             name="text"
             placeholder={isGenerating ? "Generating response..." : "Ask anything..."}
             disabled={isGenerating} // Disable input while generating
         />
         {/* Submit button */}
         <button type="submit" disabled={isGenerating}> {/* Disable button */}
          <img src="/arrow.png" alt="Send" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;