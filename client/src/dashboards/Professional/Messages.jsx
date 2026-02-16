import useMessages from "../../hooks/useMessages";

const MessagesPro = () => {
  const { conversations, loading, error, sendMessage } = useMessages("professional");

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p>{error}</p>;

  const handleSend = async () => {
    await sendMessage("user123", "Hello client!");
  };

  return (
    <div>
      <h1>Messages</h1>
      {conversations.map(c => (
        <div key={c.id}>
          <p>{c.clientName}: {c.lastMessage}</p>
        </div>
      ))}
      <button onClick={handleSend}>Send Test Message</button>
    </div>
  );
};

export default MessagesPro;
