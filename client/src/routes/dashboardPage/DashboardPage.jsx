// // import { useMutation, useQueryClient } from "@tanstack/react-query";
// // import "./dashboardPage.css";
// // import { useNavigate } from "react-router-dom";

// // const DashboardPage = () => {
// //   const queryClient = useQueryClient();

// //   const navigate = useNavigate();

// //   const mutation = useMutation({
// //     mutationFn: (text) => {
// //       return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
// //         method: "POST",
// //         credentials: "include",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ text }),
// //       }).then((res) => res.json());
      
// //     },
// //     onSuccess: (data) => {
// //       console.log(data); // See what the response contains
// //       const chatId = data.chatId; // or data.chatId if that's how it's named
// //       console.log(chatId);
// //       queryClient.invalidateQueries({ queryKey: ["userChats"] });
// //       navigate(`/dashboard/chats/${chatId}`);
// //     },
// //   });

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     const text = e.target.text.value;
// //     if (!text) return;

// //     mutation.mutate(text);
// //   };
// //   return (
// //     <div className="dashboardPage">
// //       <div className="texts">
// //         <div className="logo">
// //           <img src="/logo.png" alt="" />
// //           <h1>NERD AI</h1>
// //         </div>
// //         <div className="options">
// //           <div className="option">
// //             <img src="/chat.png" alt="" />
// //             <span>Create a New Chat</span>
// //           </div>
// //           <div className="option">
// //             <img src="/image.png" alt="" />
// //             <span>Analyze Images</span>
// //           </div>
// //           <div className="option">
// //             <img src="/code.png" alt="" />
// //             <span>Help me with my Code</span>
// //           </div>
// //         </div>
// //       </div>
// //       <div className="formContainer">
// //         <form onSubmit={handleSubmit}>
// //           <input type="text" name="text" placeholder="Ask me anything..." />
// //           <button>
// //             <img src="/arrow.png" alt="" />
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default DashboardPage;
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import "./dashboardPage.css";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@clerk/clerk-react";

// const DashboardPage = () => {
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();
//   const { getToken } = useAuth();

//   const mutation = useMutation({
//     mutationFn: async (text) => {
//       // Get the JWT token from Clerk
//       const token = await getToken();
//       if (!token) {
//         throw new Error("Not authenticated");
//       }

//       // Send the authenticated request to create a new chat
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//         body: JSON.stringify({ text }),
//       });

//       if (!res.ok) {
//         throw new Error(`Server responded with status ${res.status}`);
//       }

//       return res.json();
//     },
//     onSuccess: (data) => {
//       console.log("Chat created:", data);
//       // Assuming your backend returns { chatId: "..." }
//       const chatId = data.chatId;
//       // Refresh the user's chat list
//       queryClient.invalidateQueries({ queryKey: ["userChats"] });
//       // Navigate to the new chat page
//       navigate(`/dashboard/chats/${chatId}`);
//     },
//     onError: (err) => {
//       console.error("Failed to create chat:", err);
//       // TODO: Show user-friendly error message
//     }
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const text = e.target.text.value.trim();
//     if (!text) return;
//     mutation.mutate(text);
//     e.target.reset();
//   };

//   return (
//     <div className="dashboardPage">
//       <div className="texts">
//         <div className="logo">
//           <img src="/logo.png" alt="Logo" />
//           <h1>NERD AI</h1>
//         </div>
//         <div className="options">
//           <div className="option">
//             <img src="/chat.png" alt="New Chat" />
//             <span>Create a New Chat</span>
//           </div>
//           <div className="option">
//             <img src="/image.png" alt="Image Analysis" />
//             <span>Analyze Images</span>
//           </div>
//           <div className="option">
//             <img src="/code.png" alt="Code Help" />
//             <span>Help me with my Code</span>
//           </div>
//         </div>
//       </div>
//       <div className="formContainer">
//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             name="text"
//             placeholder="Ask me anything..."
//             disabled={mutation.isLoading}
//           />
//           <button type="submit" disabled={mutation.isLoading}>
//             <img src="/arrow.png" alt="Send" />
//           </button>
//         </form>
//         {mutation.isLoading && <p className="loading">Creating chat...</p>}
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;

import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./dashboardPage.css"; // Make sure this CSS file exists
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useState } from "react"; // Import useState for error message

const DashboardPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const mutation = useMutation({
    mutationFn: async (text) => {
      setErrorMessage(""); // Clear previous errors on new attempt
      // Get the JWT token from Clerk
      const token = await getToken();
      if (!token) {
        // This case might happen if the user's session expires mid-use
        // Redirecting to login might be appropriate here, or showing an error.
        throw new Error("Authentication token not available. Please log in again.");
      }

      // Send the authenticated request to create a new chat
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        // Try to get more specific error from backend response if possible
        const errorData = await res.json().catch(() => ({})); // Attempt to parse error JSON
        throw new Error(errorData.message || `Server responded with status ${res.status}`);
      }

      return res.json();
    },
    onSuccess: (data) => {
      console.log("Chat created:", data);
      // IMPORTANT: Ensure your backend *actually* returns an object like { chatId: "some-id" }
      const chatId = data?.chatId; // Use optional chaining for safety

      if (!chatId) {
         console.error("Chat ID not found in response:", data);
         setErrorMessage("Failed to get chat ID from server response.");
         // Don't navigate if chatId is missing
         return;
      }

      // Refresh the user's chat list (useful if displayed elsewhere)
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      // Navigate to the new chat page
      navigate(`/dashboard/chats/${chatId}`);
    },
    onError: (err) => {
      console.error("Failed to create chat:", err);
      // Show user-friendly error message
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const textInput = form.elements.text; // More robust way to get input
    const text = textInput.value.trim();

    if (!text) return; // Don't submit if text is empty

    // Disable input while submitting is handled by `mutation.isLoading` already
    mutation.mutate(text);

    // Resetting the form *after* mutate is called is fine.
    form.reset();
  };

  return (
    <div className="dashboardPage">
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="Logo" />
          <h1>NERD AI</h1>
        </div>
        {/* These options are currently just visual, add onClick handlers if needed */}
        <div className="options">
          <div className="option">
            <img src="/chat.png" alt="New Chat Icon" />
            <span>Create a New Chat</span>
          </div>
          <div className="option">
            <img src="/image.png" alt="Image Analysis Icon" />
            <span>Analyze Images</span>
          </div>
          <div className="option">
            <img src="/code.png" alt="Code Help Icon" />
            <span>Help me with my Code</span>
          </div>
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="text" // name is used by form.elements.text
            placeholder="Ask me anything..."
            disabled={mutation.isLoading} // Disable input while loading
            aria-label="Chat input" // Accessibility
          />
          <button type="submit" disabled={mutation.isLoading} aria-label="Send message">
            <img src="/arrow.png" alt="Send" />
          </button>
        </form>
        {/* Display Loading and Error States */}
        {mutation.isLoading && <p className="loading-message">Creating chat...</p>}
        {mutation.isError && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default DashboardPage;