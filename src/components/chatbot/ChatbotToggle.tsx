interface ChatbotToggleProps {
  onClick: () => void;
}

const ChatbotToggle = ({ onClick }: ChatbotToggleProps) => (
  <button
    onClick={onClick}
    className="w-16 h-16 bg-gradient-to-r from-primary to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center group relative"
    aria-label="Mở trợ lý ảo"
  >
    <svg
      className="w-8 h-8 group-hover:scale-110 transition-transform duration-200"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
    <div
      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
      aria-hidden="true"
    >
      <span className="text-xs text-white font-bold">!</span>
    </div>
  </button>
);

export default ChatbotToggle;
