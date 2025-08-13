import React from "react";
import { getRandomColor } from "../../Helper/iconHelper";

const MessageCard = ({
  msg,
  sender = false,
  isSameSenderAsPrevious = false,
}) => {
  return (
    <div className={`flex gap-1 w-full ${sender && "justify-end"}`}>
      {!sender && !isSameSenderAsPrevious ? (
        <div className="h-8 w-8 rounded-full bg-amber-300"></div>
      ) : (
        <div className="h-8 w-8 rounded-full bg-transparent"></div>
      )}
      <div
        className={`${
          sender
            ? ` bg-purple-500 text-white dark:bg-purple-700 dark:text-white ${
                !isSameSenderAsPrevious ? "rounded-tr-none mb-1" : "mb-2"
              } `
            : ` bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 ${
                !isSameSenderAsPrevious ? "rounded-tl-none mb-1" : "mb-2"
              } `
        } break-words max-w-70 rounded-2xl p-2`}
      >
        <div
          className={`flex gap-1 justify-start mb-1 ${
            sender || isSameSenderAsPrevious ? "hidden" : "block"
          }`}
        >
          <span
            className="font-semibold"
            style={{
              color: getRandomColor("Fullrwdwame", true),
            }}
          >
            {msg.sender.fullName}
          </span>
          <span className="text-gray-400">@{msg.sender.username}</span>
        </div>
        <div>{msg.text}</div>
      </div>
    </div>
  );
};

export default MessageCard;
