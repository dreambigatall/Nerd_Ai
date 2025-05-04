// import { Link } from "react-router-dom";
// import "./chatList.css";
// import { useQuery } from "@tanstack/react-query";

// const ChatList = () => {
//   const { isPending, error, data } = useQuery({
//     queryKey: ["chatList"],
//     queryFn: () =>
//       fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
//         credentials: "include",
//       }).then((res) => res.json()),
//   });

//   if (isPending) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;

//   // Create a sorted copy of the chats array (newest first)
//   const sortedChats = data?.chats
//     ? [...data.chats].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//     : [];

//   return (
//     <div className="chatList">
//       <span className="title">DASHBOARD</span>
//       <Link to="/dashboard">Create a new Chat</Link>
//       <Link to="/">Explore Nerd AI</Link>
//       <Link to="/">Contact</Link>
//       <div className="chats">
//         {sortedChats.length > 0 ? (
//           sortedChats.map((chat) => (
//             <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>
//               <div className="chatItem">
//                 <h5>{chat.title}</h5>
//                 <p>{new Date(chat.createdAt).toLocaleString()}</p>
//               </div>
//             </Link>
//           ))
//         ) : (
//           <div>No chats available</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatList;
import { Link } from "react-router-dom";
import "./chatList.css";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react"; // Import useAuth

const ChatList = () => {
  const { getToken } = useAuth(); // Get the getToken function

  const { isPending, error, data } = useQuery({
    queryKey: ["chatList"],
    queryFn: async () => { // Make queryFn async
      const token = await getToken(); // Get token
      if (!token) {
          throw new Error("Not authenticated");
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
        // credentials: "include", // May remove if using Bearer token
        headers: {
          "Authorization": `Bearer ${token}`, // Add Authorization header
        },
      });

       if (!response.ok) {
         // Handle non-2xx responses specifically
         if (response.status === 404) {
             // If backend returns 404 for "no chats found", handle it gracefully
             console.log("No chats found for user.");
             return { chats: [] }; // Return an empty array structure
         }
         throw new Error(`Failed to fetch user chats (status: ${response.status})`);
       }
       return response.json();
    },
  });

  // Loading and Error States
  if (isPending) return <div className="chatList">Loading chats...</div>;
  if (error) return <div className="chatList">Error: {error.message}</div>;

  // Sort chats safely, ensuring data.chats exists
  const sortedChats = data?.chats
    ? [...data.chats].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  return (
    <div className="chatList">
      <span className="title">DASHBOARD</span>
      {/* Link to initiate NEW chat - THIS is where the POST /api/chats happens */}
      {/* Ensure the component/logic handling this POST request ALSO includes the Auth header */}
      <Link to="/dashboard">Create a new Chat</Link>
      {/* Other links */}
      <Link to="/">Explore Nerd AI</Link>
      <Link to="/">Contact</Link>
      <hr/> {/* Add a separator */}
      <span className="title">Recent Chats</span>
      <div className="chats">
        {sortedChats.length > 0 ? (
          sortedChats.map((chat) => (
            <Link to={`/dashboard/chats/${chat._id}`} key={chat._id} className="chatItemLink">
              <div className="chatItem">
                {/* Truncate long titles if necessary */}
                <h5>{chat.title.length > 30 ? chat.title.substring(0, 30) + "..." : chat.title}</h5>
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