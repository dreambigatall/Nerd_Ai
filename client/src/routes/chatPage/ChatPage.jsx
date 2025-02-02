import "./chatPage.css";
import NewPrompt from "../../components/newPrompt/NewPrompt";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";

const ChatPage = () => {
  // Extract the chat ID using the correct parameter name
  const { id } = useParams();
  console.log("Chat ID from params:", id);

  const { isPending, error, data } = useQuery({
    queryKey: ["chat", id],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${id}`, {
        credentials: "include",
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      }),
    enabled: !!id, // only run if id exists
  });

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          {isPending
            ? "Loading..."
            : error
            ? "Something went wrong!"
            : data?.history?.map((message, i) => (
                <div key={i}>
                  {message.img && (
                    <IKImage
                      urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                      path={message.img}
                      height="300"
                      width="400"
                      transformation={[{ height: 300, width: 400 }]}
                      loading="lazy"
                      lqip={{ active: true, quality: 20 }}
                    />
                  )}
                  <div
                    className={message.role === "user" ? "message user" : "message"}
                  >
                    <Markdown>{message.parts[0].text}</Markdown>
                  </div>
                </div>
              ))}

          {data && <NewPrompt data={data} />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
