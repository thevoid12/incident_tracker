import React, { useState } from 'react';

const Chat = ({ messages = [], onAddMessage, readOnly = false, currentUserEmail }) => {
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    setLoading(true);
    try {
      await onAddMessage(newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error adding message:', error);
      alert('Failed to add message');
    } finally {
      setLoading(false);
    }
  };

  // Generate simple letter avatar based on first character of email
  const getAvatarLetter = (email) => {
    return email.charAt(0).toUpperCase();
  };

  // Generate background color based on email (2 lighter blue shades)
  const getAvatarColor = (email) => {
    const colors = [
      '#4a90e2', // Lighter blue
      '#7bb3f0'  // Even lighter blue
    ];

    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="border border-[#dbe0e6] rounded-lg bg-white flex flex-col h-[500px] md:h-[600px]">
      <h3 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4 border-b border-[#dbe0e6]">
        Chat {messages.length > 0 && `(${messages.length})`}
      </h3>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-[#617589] text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message, index) => {
            const isCurrentUser = message.useremail === currentUserEmail;
            return (
              <div
                key={index}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div className={`flex max-w-[80%] md:max-w-[70%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar - only show for other users */}
                  {!isCurrentUser && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3 shrink-0"
                      style={{ backgroundColor: getAvatarColor(message.useremail) }}
                    >
                      {getAvatarLetter(message.useremail)}
                    </div>
                  )}

                  <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                    {/* User info - only show for other users */}
                    {!isCurrentUser && (
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[#111418] text-xs font-semibold">
                          {message.useremail}
                        </p>
                        <p className="text-[#617589] text-xs">
                          {formatTimestamp(message.timestamp)}
                        </p>
                      </div>
                    )}

                    {/* Message bubble */}
                    <div
                      className={`px-4 py-2 rounded-2xl max-w-full break-words ${
                        isCurrentUser
                          ? 'bg-[#1172d4] text-white rounded-br-md'
                          : 'bg-[#f0f2f4] text-[#111418] rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">
                        {message.content}
                      </p>
                    </div>

                    {/* Timestamp for current user */}
                    {isCurrentUser && (
                      <p className="text-[#617589] text-xs mt-1 mr-1">
                        {formatTimestamp(message.timestamp)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Message Input */}
      {!readOnly && (
        <div className="border-t border-[#dbe0e6] p-4">
          <form onSubmit={handleSubmit} className="flex items-end gap-3">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-4 py-2 border border-[#dbe0e6] rounded-full focus:outline-none focus:ring-2 focus:ring-[#1172d4] focus:border-transparent text-sm"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || loading}
                className="bg-[#1172d4] text-white p-2 rounded-full hover:bg-[#0d5bb5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center w-10 h-10"
              >
                {loading ? (
                  <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M222.14,78.84l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,120,88h24v40a8,8,0,0,0,16,0V88h24a8,8,0,0,0,5.66-13.16ZM136,200H120V152a8,8,0,0,0-16,0v48H80a8,8,0,0,0-5.66,13.16l48,48a8,8,0,0,0,11.32,0l48-48A8,8,0,0,0,176,200H152V152a8,8,0,0,0-16,0Z"/>
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chat;