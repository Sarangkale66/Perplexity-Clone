Okay, here's the `README.md` file with the demo credentials added to the Demo section:

```markdown

## Demo

A live demo link will be available here once deployed.

**For testing purposes, you can use the following demo credentials:**

*   **Email/Username:** demo@gmail.com
*   **Password:** Demo@123

**Important:** These credentials are for demonstration purposes only and may be reset periodically. Do not use them for sensitive data.

---

# Perplexity-Clone

A web application that mimics the core functionalities of [Perplexity.ai](https://www.perplexity.ai/), providing AI-powered search and question-answering capabilities in a sleek, user-friendly interface.

---

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- AI-powered search and question-answering
- Instant responses with contextual understanding
- User-friendly chat interface
- History of previous queries
- Supports multiple AI models (optional integration)
- Responsive design for mobile and desktop

---

## Tech Stack

- **Frontend:** React.js, Tailwind CSS / Custom CSS
- **Backend:** Node.js, Express.js
- **AI Integration:** OpenAI API / Google Gemini API (or any LLM)
- **Database:** MongoDB / PostgreSQL (optional, for query history)
- **Authentication:** JWT / OAuth (optional)

---

## Installation

1.  Clone the repository:

```bash
git clone https://github.com/yourusername/perplexity-clone.git
cd perplexity-clone
```

2.  Install dependencies for both frontend and backend:

```bash
# For frontend
cd client
npm install

# For backend
cd ../server
npm install
```

3.  Create a `.env` file in the backend directory with the following:

```env
PORT=5000
OPENAI_API_KEY=your_openai_api_key
```

4.  Start the development servers:

```bash
# Backend
cd server
npm run dev

# Frontend
cd ../client
npm start
```

---

## Usage

1.  Open the frontend in your browser: `http://localhost:3000`
2.  Type a question in the chat input box.
3.  Press **Enter** or click the **Send** button.
4.  Receive AI-powered responses instantly.

---

## Screenshots

*Add screenshots of your app here (desktop & mobile view)*

---

## Contributing

Contributions are welcome!

1.  Fork the repository
2.  Create your feature branch: `git checkout -b feature/your-feature`
3.  Commit your changes: `git commit -m 'Add some feature'`
4.  Push to the branch: `git push origin feature/your-feature`
5.  Open a pull request

---
```

Key changes:

*   **Demo Credentials Added:** I added a section under the "Demo" heading with the email/username and password.
*   **Important Note:**  I added a crucial disclaimer that these credentials are for demonstration purposes only, may be reset, and should not be used with sensitive data.  This is very important for security reasons.
*   **Formatting:** I made minor adjustments to the formatting for readability.
