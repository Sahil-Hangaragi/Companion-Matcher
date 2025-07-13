# 💕 Companion Matcher

A modern, full-stack web application for finding compatible companions based on shared interests. Built with React, TypeScript, Express, and a beautiful gradient design system.


## ✨ Features

### 🔍 **Smart Matching System**

- **Interest-Based Algorithm**: Find companions with 2+ shared interests
- **Compatibility Scoring**: Percentage-based compatibility calculation
- **Advanced Filtering**: 20+ interest categories to choose from

### 👤 **Rich User Profiles**

- **Photo Upload**: Drag-and-drop image upload with preview
- **Detailed Information**: Bio, location, occupation, and relationship goals
- **Interest Selection**: Multi-category interest selection system
- **Profile Validation**: Comprehensive form validation and error handling

### 💬 **Real-Time Messaging**

- **Beautiful Chat Interface**: Modern WhatsApp/iMessage-style design
- **Conversation Management**: Organized conversation list with search
- **Message Threading**: Date-grouped messages with timestamps
- **Profile Integration**: User photos and details in chat headers

### 🎯 **Companion Management**

- **Match Discovery**: Find compatible companions instantly
- **Shortlist System**: Save favorite companions for later
- **Direct Messaging**: Start conversations from matches or shortlist
- **Cross-Navigation**: Seamless flow between all features

### 🎨 **Modern UI/UX**

- **Gradient Design System**: Beautiful purple-pink companion theme
- **Responsive Design**: Perfect on desktop, tablet, and mobile
- **Smooth Animations**: Hover effects, transitions, and loading states
- **Glassmorphism**: Modern backdrop blur effects

## 🛠 Tech Stack

### **Frontend**

- **React 18** - Modern React with hooks
- **TypeScript** - Full type safety
- **React Router 6** - SPA routing
- **Tailwind CSS 3** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **Vite** - Fast development and building

### **Backend**

- **Express.js** - RESTful API server
- **TypeScript** - Type-safe backend
- **CORS** - Cross-origin resource sharing
- **In-Memory Storage** - Fast development (easily replaced with database)

### **Development**

- **Vitest** - Fast unit testing
- **ESLint & Prettier** - Code formatting
- **Date-fns** - Date manipulation
- **Sonner** - Toast notifications

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd companion-matcher
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:8080
   ```

## 📖 Usage Guide

### 1. **Create Your Profile**

- Upload a profile photo (optional)
- Fill in basic information (name, age, location)
- Write a bio describing yourself
- Select your interests (minimum 2 required)
- Choose what you're looking for

### 2. **Find Matches**

- View compatible companions with shared interests
- See compatibility scores and shared interests highlighted
- Add interesting people to your shortlist
- Start conversations directly from match cards

### 3. **Manage Conversations**

- Access all your conversations from the Messages page
- Search through conversations by name
- Continue chats with beautiful, organized interface
- Send messages with character counter and validation

### 4. **Build Connections**

- Message shortlisted companions
- View detailed profiles in chat headers
- Navigate seamlessly between features
- Discover new matches as more users join

### 📷 **Adding Screenshots**

To add screenshots to this README:

1. Run the application: `npm run dev`
2. Create test profiles with varied interests and photos
3. Take screenshots of each page at the recommended resolutions
4. Save them in the `screenshots/` directory with the exact filenames shown above
5. See `screenshots/README.md` for detailed guidelines

## 🔧 Development

### **Available Scripts**

```bash
npm run dev        # Start development server (client + server)
npm run build      # Production build
npm run start      # Start production server
npm run typecheck  # TypeScript validation
npm test          # Run Vitest tests
npm run format.fix # Format code with Prettier
```

### **Project Structure**

```
├── client/                   # React frontend
│   ├── components/ui/        # Reusable UI components
│   ├── pages/               # Route components
│   │   ├── Index.tsx        # Homepage with profile creation
│   │   ├── Matches.tsx      # View compatible matches
│   │   ├── Shortlist.tsx    # Shortlisted companions
│   │   ├── Conversations.tsx # Message list
│   │   └── Chat.tsx         # Chat interface
│   ├── App.tsx              # App routing and setup
│   └── global.css           # TailwindCSS theme
├── server/                  # Express API
│   ├── routes/
│   │   ├── users.ts         # User and matching endpoints
│   │   └── messages.ts      # Messaging endpoints
│   └── index.ts             # Server configuration
├── shared/                  # Shared TypeScript types
│   └── api.ts               # API interfaces and types
└── README.md
```

## 🌐 API Reference

### **User Management**

#### Create User Profile

```http
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "age": 25,
  "interests": ["music", "tech", "sports"],
  "photo": "data:image/jpeg;base64,/9j/4AAQ...",
  "bio": "Love hiking and good coffee!",
  "location": "San Francisco, CA",
  "occupation": "Software Engineer",
  "lookingFor": "friendship"
}
```

#### Get Compatible Matches

```http
GET /api/matches/:username
```

#### Add to Shortlist

```http
POST /api/shortlist
Content-Type: application/json

{
  "username": "john",
  "targetUsername": "jane"
}
```

#### Get Shortlist

```http
GET /api/shortlist/:username
```

### **Messaging System**

#### Send Message

```http
POST /api/messages/:username
Content-Type: application/json

{
  "receiverUsername": "jane",
  "content": "Hey! I saw we both love hiking. Want to chat?"
}
```

#### Get Conversations

```http
GET /api/conversations/:username
```

#### Get Messages

```http
GET /api/messages/:username/:conversationId?limit=50&offset=0
```

#### Mark Messages as Read

```http
PUT /api/messages/:username/:conversationId/read
```

## 🎨 Design System

### **Color Palette**

- **Primary**: Purple gradient (`hsl(283 100% 67%)`)
- **Secondary**: Pink accent (`hsl(324 100% 67%)`)
- **Background**: Gradient from purple to pink
- **Surface**: White with glassmorphism effects

### **Typography**

- **System Fonts**: ui-sans-serif, system-ui, sans-serif
- **Weights**: 400 (normal), 600 (semibold), 700 (bold)
- **Responsive**: Scales appropriately across devices

### **Components**

- **Cards**: Rounded corners with shadows and backdrop blur
- **Buttons**: Gradient fills with hover animations
- **Inputs**: Clean borders with focus states
- **Avatars**: Circular with gradient fallbacks

## 🔒 Data Storage

Currently uses **in-memory storage** for rapid development and testing. In production, replace with:

- **PostgreSQL** or **MongoDB** for user profiles and messages
- **Redis** for session management and real-time features
- **Cloud storage** (AWS S3, Cloudinary) for photo uploads
- **WebSocket** integration for real-time messaging

## 🚀 Deployment

### **Production Build**

```bash
npm run build
npm start
```

### **Environment Variables**

```env
NODE_ENV=production
PORT=8080
```

### **Recommended Hosting**

- **Frontend**: Vercel, Netlify, or AWS CloudFront
- **Backend**: Railway, Heroku, or AWS EC2
- **Database**: PlanetScale, Supabase, or AWS RDS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

### **Upcoming Features**

- [ ] Real-time messaging with WebSocket
- [ ] Push notifications for new messages
- [ ] Advanced filtering (age, location, occupation)
- [ ] Photo galleries and multiple images
- [ ] Video chat integration
- [ ] Mobile app (React Native)
- [ ] Social media integration
- [ ] Advanced matching algorithms (ML-based)

### **Performance Optimizations**

- [ ] Database integration with proper indexing
- [ ] Image optimization and CDN integration
- [ ] Caching strategies for matches and conversations
- [ ] Progressive Web App (PWA) features

## 💡 Inspiration

Built for connecting like-minded individuals through shared interests. Whether you're looking for friendship, study partners, workout buddies, or romantic connections, Companion Matcher helps you find your perfect match!

---

**Made with ❤️ for meaningful connections**

For questions or support, please open an issue or contact the development team.
