// Scroll chat to bottom helper
function scrollChatToBottom() {
  const chatBody = document.getElementById("chat-body");
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Handle sending user text messages
function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (message === "") return;

  const chatBody = document.getElementById("chat-body");

  // Append user message
  const userMsg = document.createElement("div");
  userMsg.className = "user-message message";
  userMsg.textContent = message;
  chatBody.appendChild(userMsg);
  scrollChatToBottom();

  input.value = "";

  // Example bot response
  setTimeout(() => {
    const botMsg = document.createElement("div");
    botMsg.className = "bot-message message";
    botMsg.textContent = "Observo here! Processing your input.";
    chatBody.appendChild(botMsg);
    scrollChatToBottom();
  }, 800);
}

document.getElementById("send-btn").addEventListener("click", sendMessage);

document.getElementById("video-upload").addEventListener("change", async function(e) {
  const file = e.target.files[0];
  const chatBody = document.getElementById("chat-body");
  const preview = document.getElementById("preview");

  if (file && file.type.startsWith("video/")) {
    // Show user message about uploaded video
    const videoMsg = document.createElement("div");
    videoMsg.className = "user-message message";
    videoMsg.textContent = "📹 Video uploaded: " + file.name;
    chatBody.appendChild(videoMsg);
    scrollChatToBottom();

    // Show preview
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";

    // Prepare form data for upload
    const formData = new FormData();
    formData.append("file", file);

    // Show bot message "Processing..."
    const processingMsg = document.createElement("div");
    processingMsg.className = "bot-message message";
    processingMsg.textContent = "Analyzing your video, please wait...";
    chatBody.appendChild(processingMsg);
    scrollChatToBottom();

    try {
      // POST to your backend upload API
      const response = await fetch("http://127.0.0.1:8000/upload/", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      // Remove "processing" message
      processingMsg.remove();

      // Show summary returned by backend
      const summaryMsg = document.createElement("div");
      summaryMsg.className = "bot-message message";
      summaryMsg.textContent = result.summary ? result.summary.join("\n") : "No summary available.";
      chatBody.appendChild(summaryMsg);
      scrollChatToBottom();

    } catch (error) {
      processingMsg.textContent = "Oops! Something went wrong: " + error.message;
      scrollChatToBottom();
    }
  }
});
