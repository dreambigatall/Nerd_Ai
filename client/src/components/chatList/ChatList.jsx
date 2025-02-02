import { Link } from "react-router-dom";
import "./chatList.css";
import { useQuery } from "@tanstack/react-query";

const ChatList = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["chatList"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="chatList">
      <span className="title">DASHBOARD</span>
      <Link to="/dashboard">Create a new Chat</Link>
      <Link to="/">Explore Lama AI</Link>
      <Link to="/">Contact</Link>
      <div className="chats">
        {data?.chats?.length > 0 ? (
          data.chats.map((chat) => (
            <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>
            <div key={chat._id} className="chatItem">
              <h5>{chat.title}</h5>
              <p>{new Date(chat.createdAt).toLocaleString()}</p>
            </div>
            </Link>
          ))
        ) : (
          <div>No chats available</div>
        )}
      </div>
    </div>
  );
};

export default ChatList;