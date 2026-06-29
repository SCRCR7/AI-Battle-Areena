import React, { useState } from "react";

/**
 * PromptInput — Premium chat-like text input for user prompt.
 * @param {Object} props
 * @param {function} props.onSubmit
 * @param {boolean} props.isLoading
 */
const PromptInput = ({ onSubmit, isLoading }) => {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <section className="relative z-10 px-8 mb-16">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div
            className="premium-panel p-4 flex flex-col focus-within:border-[#3f3f46] transition-colors duration-200"
            style={{ minHeight: "150px" }}
          >
            {/* Input field */}
            <textarea
              id="battle-question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything... Press Enter to launch battle."
              disabled={isLoading}
              rows={3}
              className="w-full resize-none text-base leading-relaxed bg-transparent border-none p-2 placeholder-[#52525b] text-[#f4f4f5] focus:outline-none disabled:opacity-50"
              style={{
                fontFamily: "Inter, sans-serif",
              }}
            />

            {/* Bottom Actions Area */}
            <div className="flex items-center justify-between pt-4 mt-auto border-t border-[#202024]">
              {/* Models status */}
              <div
                className="text-[10px] uppercase tracking-wider text-[#52525b] font-semibold flex items-center gap-3"
                style={{ fontFamily: "Geist Mono, monospace" }}
              >
                <span>Mistral 7B &times; Cohere Command</span>
                <span className="text-[#202024]">&bull;</span>
                <span>Ref: Gemini-2.5</span>
              </div>

              {/* Submit Button */}
              <button
                id="start-battle-btn"
                type="submit"
                disabled={isLoading || !question.trim()}
                className="btn-premium px-5 py-2 text-xs font-semibold flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin w-3 h-3 text-[#09090b]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    <span>Running Battle...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Prompt</span>
                    <span className="text-[10px] opacity-75">↵</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default PromptInput;
