import "./dashboardPage.css"
import {useAuth} from "@clerk/clerk-react"
export default function DashboardPage() {
  const auth = useAuth();
  const userId = auth.userId;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text ) return;

    try {
      const result = await fetch("http://localhost:3000/api/chats", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const data = await result.json();
      console.log(data);
    } catch (error) {
      console.error("Error generating content:", error);
    }
  };

  return (
    <div className="dashboardPage">
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="" />
          <h1>NERD</h1>
        </div>
        <div className="options">
          <div className="option">
            <img src="/chat.png" alt="" />
            <span>Create A New Chat</span>
          </div>
          <div className="option">
            <img src="/image.png" alt="" />
            <span>Analyze Image</span>
          </div>
          <div className="option">
            <img src="/code.png" alt="" />
            <span>Help me in my code</span>
          </div>
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
        <input type="text" name="text" placeholder="Ask your nerd quetions....." />
        <button >
          <img src="/arrow.png" alt="" />
        </button>
        </form>
      </div>
    </div>
  );
}