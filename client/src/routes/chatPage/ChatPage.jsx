import "./chatPage.css"
import NewPrompt from "../../components/newPrompt/NewPrompt";

export default function ChatPage() {
  
  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          <div className="message">Test Message from ai</div>
          <div className="message user">Test Message from user i want okfsddcjhjhdj dfjhdsdcjh jhfscscshjd jcsdjhjd</div>
          <div className="message">Test Message from ai</div>
          <div className="message user">Test Message from user</div>
          <div className="message">Test Message from ai</div>
          <div className="message user">Test Message from user</div>
          <div className="message">Test Message from ai</div>
          <div className="message user">Test Message from user</div>
          <div className="message">Test Message from ai</div>
          <div className="message user">Test Message from user</div>
          <div className="message">Test Message from ai</div>
          <div className="message user">Test Message from user</div>
          <NewPrompt/>
           
        </div>
      </div>
    </div>
  );
}