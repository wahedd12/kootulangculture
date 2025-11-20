// src/Contact.jsx
import React, { useState } from "react";

const Contact = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Your message has been sent:\n\n${message}`);
    setMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-[#08203e] to-[#13e759] text-white p-6">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <p className="mb-4 text-center max-w-xl">
        Have questions or suggestions? Send us a message and we’ll get back to
        you as soon as possible.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-lg gap-4 bg-[#0a2340] p-6 rounded-lg shadow-lg"
      >
        <label className="flex flex-col">
          Your Message:
          <textarea
            className="mt-2 p-2 rounded text-black resize-none h-32"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            required
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-purple-600 transition-colors rounded py-2 font-semibold"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
