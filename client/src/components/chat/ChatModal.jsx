import React, { useState, useEffect, useRef } from "react";
import MessageCard from "./MessageCard.jsx";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { useAuth } from "../../context/authContext.jsx";
import {
  fetchMessages,
  markMessagesAsRead,
} from "../../services/ChatService.js";
import socket from "../../services/socket.js";
import { BsChatFill } from "react-icons/bs";
import { MdOutlineRefresh, MdOutlineDoubleArrow } from "react-icons/md";
import { TiMessages } from "react-icons/ti";

import { Tooltip } from "react-tooltip";
import toast from "react-hot-toast";

const ChatModal = ({
  visible,
  workspaceId,
  workspaceTitle,
  setChatVisible,
}) => {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // used for paging/refresh spinners (inline)
  const [page, setPage] = useState(1);

  const { user } = useAuth();

  // Refs for scrolling + “was at bottom” tracking
  const messagesEndRef = useRef(null);
  const messageRefs = useRef({});
  const scrollContainerRef = useRef(null);
  const wasAtBottomRef = useRef(true);

  // Initial load on workspace change
  useEffect(() => {
    if (!workspaceId) return;
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const firstPage = 1;
        const msgs = await fetchMessages(workspaceId, firstPage);
        setMessages(msgs);
        setPage(firstPage);
      } finally {
        setIsLoading(false);
      }
    };
    loadMessages();
  }, [workspaceId]);

  // Mark as read when modal is visible (don’t depend on messages to avoid re-running constantly)
  useEffect(() => {
    if (!visible || !workspaceId) return;
    markMessagesAsRead(workspaceId);
  }, [visible, workspaceId]);

  // Bottom pin helper
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  // On message changes: go to first unread, else bottom only if we were already near bottom
  useEffect(() => {
    if (!visible || messages.length === 0) return;

    const firstUnread = messages.find((msg) => msg.isRead === false);

    if (firstUnread && messageRefs.current[firstUnread._id]) {
      messageRefs.current[firstUnread._id].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else if (wasAtBottomRef.current) {
      scrollToBottom();
    }
  }, [visible, messages]);

  // Socket listener (dedup guard)
  useEffect(() => {
    const handleIncomingMessage = ({ message }) => {
      setMessages((prev) => {
        if (prev.find((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    };

    if (visible && workspaceId) {
      // keep your server event name; if you have a room join event, emit here
      socket.emit("join-board", workspaceId);
    }

    socket.on("message-received", handleIncomingMessage);
    return () => socket.off("message-received", handleIncomingMessage);
  }, [workspaceId, visible]);

  // Infinite scroll: load older on reaching top, preserve scroll position (no viewport jump)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = async () => {
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      // Track if user is near bottom (so we only auto-scroll on new msg then)
      wasAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 50;

      // Top reached: fetch older page, prepend, and preserve scroll offset
      if (scrollTop === 0 && !isLoading) {
        const prevScrollHeight = container.scrollHeight;
        const nextPage = page + 1;

        setIsLoading(true);
        try {
          const older = await fetchMessages(workspaceId, nextPage);
          if (older.length > 0) {
            setMessages((prev) => [...older, ...prev]);
            setPage(nextPage);
            // Restore visual position after DOM updates
            requestAnimationFrame(() => {
              const newScrollHeight = container.scrollHeight;
              container.scrollTop = newScrollHeight - prevScrollHeight;
            });
          }
        } finally {
          setIsLoading(false);
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [page, isLoading, workspaceId]);

  async function handleMessageSend() {
    if (messageInput.trim() === "") return;
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER}/workspaces/${workspaceId}/messages`,
        { text: messageInput },
        { withCredentials: true }
      );
      setMessageInput("");
      // If sender is at the bottom already, keep pinned; our effect handles it via wasAtBottomRef
      scrollToBottom();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div
      className={`flex flex-col w-[24rem] max-w-[90vw] h-[calc(100vh-6rem)] text-white fixed top-20 bottom-2 bg-[var(--accent)] transition-transform duration-300 z-50 ${
        visible ? "translate-x-0 right-4" : "translate-x-full right-0"
      }`}
    >
      {/* Header */}
      <div className="p-3 w-full bg-[var(--accent)] bg-gradient-to-r from-white/50 dark:from-black/50 via-gray-300/30 dark:via-gray-700/30 to-transparent backdrop-blur-md text-xl flex justify-between items-center text-black dark:text-white">
        {/* <div className="flex gap-2 items-center justify-start"> */}
        <MdOutlineDoubleArrow
          data-tooltip-id="my-tooltip"
          data-tooltip-content="Close chat"
          data-tooltip-place="right"
          onClick={() => setChatVisible(false)}
          className="cursor-pointer "
        />
        <span>{workspaceTitle} GC</span>
        {/* </div> */}
        <MdOutlineRefresh
          className="outline-none cursor-pointer"
          data-tooltip-id="my-tooltip"
          data-tooltip-content="Refresh chat"
          data-tooltip-place="top"
          onClick={async () => {
            setIsLoading(true);
            try {
              const fresh = await fetchMessages(workspaceId, 1);
              setMessages(fresh);
              setPage(1);
              requestAnimationFrame(scrollToBottom);
            } finally {
              setIsLoading(false);
            }
          }}
        />
        <Tooltip id="my-tooltip" />
      </div>

      {/* Messages list (always mounted; inline top spinner when paging) */}
      <div
        ref={scrollContainerRef}
        className="p-3 flex-1 overflow-y-auto w-full bg-[var(--accent)] bg-gradient-to-r from-white/30 dark:from-black/30 via-gray-200/30 dark:via-gray-800/30 to-transparent backdrop-blur-md scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Tiny top spinner during older-page fetch */}
        {isLoading && messages.length > 0 && (
          <div className="flex justify-center py-2">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-[var(--accent)] rounded-full animate-spin" />
          </div>
        )}
        {/* Initial loader if list is empty and loading */}
        {messages.length === 0 && isLoading && (
          <div className="flex justify-center items-center h-full py-6">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-[var(--accent)] rounded-full animate-spin" />
          </div>
        )}
        {messages.length === 0 && !isLoading && (
          <div className="h-full bg-transparent flex flex-col justify-center items-center gap-4">
            <TiMessages className="text-5xl" />
            <span className="text-2xl">Start the converstaion</span>
          </div>
        )}

        <ul>
          {(() => {
            const firstUnreadIndex = messages.findIndex(
              (msg) => msg.isRead === false
            );

            return (messages || []).map((msg, index) => (
              <React.Fragment key={`msgwrap-${msg._id}`}>
                {index === firstUnreadIndex && (
                  <div
                    key={`unread-divider-${msg._id}`}
                    className="text-center m-5"
                  >
                    <span className="text-sm font-medium p-1 px-3 rounded-xl bg-gray-400 text-black dark:bg-gray-600 dark:text-white">
                      unread messages
                    </span>
                  </div>
                )}
                <li
                  key={msg._id}
                  ref={(el) => (messageRefs.current[msg._id] = el)}
                >
                  <MessageCard
                    msg={msg}
                    sender={user?._id === msg.sender?._id}
                    isSameSenderAsPrevious={
                      index > 0 &&
                      messages[index - 1].sender._id === msg.sender._id
                    }
                  />
                </li>
              </React.Fragment>
            ));
          })()}
          <div ref={messagesEndRef} />
        </ul>
      </div>

      {/* Composer */}
      <div className="pb-3 pt-1 px-5 flex justify-between items-center gap-2 bg-[var(--accent)] bg-gradient-to-r from-white/30 dark:from-black/30 via-gray-200/30 dark:via-gray-800/30 to-transparent backdrop-blur-md ">
        <input
          type="text"
          placeholder="Start a message..."
          value={messageInput}
          className="dark:bg-black bg-white dark:text-white text-black rounded-xl p-2 w-full outline-none"
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleMessageSend();
            }
          }}
        />
        <div className="w-10 h-9 rounded-full bg-green-600 flex justify-center items-center hover:bg-green-400">
          <button
            className="text-xl dark:text-black text-white"
            onClick={handleMessageSend}
          >
            <IoSend />
          </button>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default ChatModal;
