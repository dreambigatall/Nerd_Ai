import { Link } from "react-router-dom";
import "./chatList.css";
export default function ChatList() {
  return (
    <div className="chatList">
      <h1>Chat List</h1>
      <span className="title">DASHBORED</span>
      <Link to="/dashbored">Create a new Chat</Link>
      <Link to="/dashbored">Explore Nerd AI</Link>
      <Link to="/">Contact Us</Link>
      <hr/>
      <div className="list">
        <Link to="/dashboard/chats/45">Chat 1</Link>
        <Link to="/">Chat 1</Link>
        <Link to="/">Chat 1</Link>
        <Link to="/">Chat 1</Link>
        <Link to="/">Chat 1</Link>
        <Link to="/">Chat 1</Link>
        <Link to="/">Chat 1</Link>
        <Link to="/">Chat 1</Link>
        <Link to="/">Chat 1</Link>
       

      </div>
      <hr/>
      <div className="upgrade">
        <img src="/logo.png" alt="" />
        <div className="text">
            <span>Upgrade to Pro</span>
            <span>Get more features</span>
        </div>
      </div>


    </div>
  );
}