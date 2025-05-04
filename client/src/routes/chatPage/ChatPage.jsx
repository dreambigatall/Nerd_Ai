// import "./chatPage.css";
// import NewPrompt from "../../components/newPrompt/NewPrompt";
// import { useQuery } from "@tanstack/react-query";
// import { useParams } from "react-router-dom";
// import Markdown from "react-markdown";
// import { IKImage } from "imagekitio-react";

// const ChatPage = () => {
//   // Extract the chat ID using the correct parameter name
//   const { id } = useParams();
//   console.log("Chat ID from params:", id);

//   const { isPending, error, data } = useQuery({
//     queryKey: ["chat", id],
//     queryFn: () =>
//       fetch(`${import.meta.env.VITE_API_URL}/api/chats/${id}`, {
//         credentials: "include",
//       }).then((res) => {
//         if (!res.ok) {
//           throw new Error("Network response was not ok");
//         }
//         return res.json();
//       }),
//     enabled: !!id, // only run if id exists
//   });

//   return (
//     <div className="chatPage">
//       <div className="wrapper">
//         <div className="chat">
//           {isPending
//             ? "Loading..."
//             : error
//             ? "Something went wrong!"
//             : data?.history?.map((message, i) => (
//                 <div key={i}>
//                   {message.img && (
//                     <IKImage
//                       urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
//                       path={message.img}
//                       height="300"
//                       width="400"
//                       transformation={[{ height: 300, width: 400 }]}
//                       loading="lazy"
//                       lqip={{ active: true, quality: 20 }}
//                     />
//                   )}
//                   <div
//                     className={message.role === "user" ? "message user" : "message"}
//                   >
//                     <Markdown>{message.parts[0].text}</Markdown>
//                   </div>
//                 </div>
//               ))}

//           {data && <NewPrompt data={data} />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;

// import "./chatPage.css";
// import NewPrompt from "../../components/newPrompt/NewPrompt";
// import { useQuery } from "@tanstack/react-query";
// import { useParams } from "react-router-dom";
// import Markdown from "react-markdown";
// import { IKImage } from "imagekitio-react";
// import { useAuth } from "@clerk/clerk-react"; // Import useAuth

// const ChatPage = () => {
//   const { id } = useParams();
//   const { getToken } = useAuth(); // Get the getToken function from Clerk

//   console.log("Chat ID from params:", id);

//   const { isPending, error, data } = useQuery({
//     queryKey: ["chat", id],
//     queryFn: async () => { // Make queryFn async
//       const token = await getToken(); // Get the token

//       if (!token) {
//          throw new Error("Not authenticated"); // Optional: handle case where token is not available
//       }

//       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${id}`, {
//          // credentials: "include", // May or may not be needed alongside Bearer token, depending on setup. Often safe to remove if using Bearer token.
//          headers: {
//            "Authorization": `Bearer ${token}`, // Add the Authorization header
//          },
//       });

//       if (!response.ok) {
//         // Consider more specific error handling based on response status
//         console.error("Fetch error response:", response);
//         throw new Error(`Network response was not ok (status: ${response.status})`);
//       }
//       return response.json();
//     },
//     enabled: !!id, // only run if id exists
//   });

//    // Rest of your component remains the same...
//    // (Error handling might need refinement based on actual errors thrown)

//   return (
//     <div className="chatPage">
//       <div className="wrapper">
//         <div className="chat">
//           {isPending
//             ? "Loading..."
//             // Improve error display
//             : error
//             ? `Error fetching chat: ${error.message}`
//             : data?.history?.map((message, i) => (
//                 <div key={i}>
//                   {message.img && (
//                     <IKImage
//                       urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
//                       path={message.img}
//                       height="300"
//                       width="400"
//                       transformation={[{ height: 300, width: 400 }]}
//                       loading="lazy"
//                       lqip={{ active: true, quality: 20 }}
//                     />
//                   )}
//                   <div
//                     className={message.role === "user" ? "message user" : "message"}
//                   >
//                     {/* Ensure message.parts exists and has content */}
//                     <Markdown>{message.parts?.[0]?.text || ""}</Markdown>
//                   </div>
//                 </div>
//               ))}

//           {/* Render NewPrompt only if data is successfully fetched */}
//           {!isPending && !error && data && <NewPrompt data={data} />}
//            {/* Add a message if data is fetched but history is empty */}
//            {!isPending && !error && data && !data.history?.length && (
//               <div className="message">Start the conversation!</div>
//            )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";

import NewPrompt from "../../components/newPrompt/NewPrompt";
import "./chatPage.css";

const ChatPage = () => {
  const { id } = useParams();
  const { getToken } = useAuth();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["chat", id],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chats/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error(`Fetch failed: ${res.status}`);
      }
      return res.json();
    },
    enabled: !!id, // only run once we have an ID
  });

  if (isLoading) {
    return (
      <div className="chatPage">
        <div className="wrapper">
          <p>Loading chat…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="chatPage">
        <div className="wrapper">
          <p className="error">Error: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          {data.history.length > 0 ? (
            data.history.map((message, i) => (
              <div key={i}>
                {message.img && (
                  <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                    path={message.img}
                    width="380"
                    transformation={[{ width: 380 }]}
                    loading="lazy"
                    lqip={{ active: true, quality: 20 }}
                  />
                )}
                <div
                  className={
                    message.role === "user" ? "message user" : "message"
                  }
                >
                  <Markdown>
                    {message.parts?.[0]?.text || "[no text]"}
                  </Markdown>
                </div>
              </div>
            ))
          ) : (
            <div className="message">No messages yet. Start the conversation!</div>
          )}

          {/* Always show the prompt form once we've loaded (even if history is empty) */}
          <NewPrompt data={data} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
