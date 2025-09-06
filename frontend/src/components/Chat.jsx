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

  // Generate avatar URL based on email (simple hash-based approach)
  const getAvatarUrl = (email) => {
    const hash = email.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const colors = [
      'AB6AXuDdT4F0eemd4KL1sjnsClTuTorrxJ47dV8IWOIAhxMbTikPzcF3J-8Y0uMxPcYQIpIUNZynLkc8jdIKYYVjwT4J4OJHRXjHrE8dPQOrEtHbWVOYE8_n6n--ChwfkGd1vn4RXjf9mr7H-h_8xCuZ3Ju_UiGo2P7QeMpe1NchPgESQu4uD4x8ZgIX7W4HxBQAISNvqeLYWxHZtFw_8C5RGCKpJT9RtpR8pVMmeMb7ykFoSdZWP26Xgg5ztIwclO_McZJC9FC0g_HnF44',
      'AB6AXuDrwJYKVIWCCOUmCLc9j2zMPVLf7cHhzUqahZmDVcei-beIS5AHA6BPDPVfdAyeYca6dOX0IbZSUsgLvdcxFjdImDbN__bAfAMaXRRqQ6LehUlrC7k4GlyTYK-AR_qMbUfx75pM8CAg2Dm_WrlzE3Isc4RieMnw8tvgV9dNfaaD5HOcjkvp8Yzw4Ywxu5yAuY7vSB7WNg_0bHo5pJJMgGotkAWAuWdQrzCQaPMbUQesNo54SCVW6VEE7NwAV1xdQqhoIhCGVqApRLU',
      'AB6AXuAfouqvtomwgK4_BMgtF5IRzWI6k-l6aBW73f1E8Ctd9dOLhH1CYnWBk5bG07X-Wk5kz-JBQGhYfc_wl3EU8X4ZsJVVQSspGzc2oUMWKLkgQhHvKZQWW6wo_4HcHWyMS8b7kXMVewMDzDMUyxGMFzXlG-BbceysT7feLFyLik_h70LLSWrHmtMQUTIMdyKu1z9NzI60BI-bsuqDZM67RsuDQfmxddRgRxKkifjHlYedyyQ3O1gdXDKoeMbDw-Jdq1WYYQJe1Xnb5Ms',
      'AB6AXuDpmHb6jHbRYa0ouSzxvBSBCtrLeTVhmWZXx4BukJzj9NXmDCbzHiCySmPBb4pqpVnouRaYblZSyMdQEA1A-XBIdRDrCkz_bSbAh5hHd86Af15GVXaeH1946joNVq5bBSJXY8GM2MFW9gy9gOQXuQyDMjD0MTZEcOU95JKofmIOJMHbjAwGjyOMpV51gB_hnSW_51VPMGfIJoeSaizAPdhW8_PLyjNQ9VlHPn_Cpas-rJ7_bsW3oyc-RlMUekYDxxtG-GipFMMARe4'
    ];
    return `https://lh3.googleusercontent.com/aida-public/${colors[Math.abs(hash) % colors.length]}`;
  };

  return (
    <div className="border border-[#dbe0e6] rounded-lg bg-white">
      <h3 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        Chat {messages.length > 0 && `(${messages.length})`}
      </h3>

      {/* Chat Messages */}
      <div className="max-h-96 overflow-y-auto">
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
                className={`flex w-full flex-row items-start justify-start gap-3 p-4 ${
                  isCurrentUser ? 'bg-[#f8f9fa]' : ''
                }`}
              >
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
                  style={{ backgroundImage: `url("${getAvatarUrl(message.useremail)}")` }}
                />
                <div className="flex h-full flex-1 flex-col items-start justify-start">
                  <div className="flex w-full flex-row items-start justify-start gap-x-3">
                    <p className="text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]">
                      {message.useremail}
                    </p>
                    <p className="text-[#617589] text-sm font-normal leading-normal">
                      {formatTimestamp(message.timestamp)}
                    </p>
                  </div>
                  <p className="text-[#111418] text-sm font-normal leading-normal">
                    {message.content}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Message Input */}
      {!readOnly && (
        <form onSubmit={handleSubmit} className="border-t border-[#dbe0e6]">
          <div className="flex items-center px-4 py-3 gap-3">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0"
              style={{ backgroundImage: `url("${getAvatarUrl(currentUserEmail)}")` }}
            />
            <label className="flex flex-col min-w-40 h-12 flex-1">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] focus:border-none h-full placeholder:text-[#617589] px-4 rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || loading}
                  className="flex items-center justify-center px-4 bg-[#1172d4] text-white rounded-r-lg hover:bg-[#0d5bb5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M222.14,78.84l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,120,88h24v40a8,8,0,0,0,16,0V88h24a8,8,0,0,0,5.66-13.16ZM136,200H120V152a8,8,0,0,0-16,0v48H80a8,8,0,0,0-5.66,13.16l48,48a8,8,0,0,0,11.32,0l48-48A8,8,0,0,0,176,200H152V152a8,8,0,0,0-16,0Z"/>
                    </svg>
                  )}
                </button>
              </div>
            </label>
          </div>
        </form>
      )}
    </div>
  );
};

export default Chat;