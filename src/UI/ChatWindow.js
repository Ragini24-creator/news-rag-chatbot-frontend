import TypingIndicator from './TypingIndicator'


export default function ChatWindow(props) {
    const { messages, isLoading } = props;

    return (
        <div className="chat-window">
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={msg.role === "user" ? "user-msg" : "bot-msg"}
                >
                    {msg.text}
                </div>
            ))}

            {isLoading && <TypingIndicator />}
        </div>
    )
}