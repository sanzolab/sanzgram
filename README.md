# Sanzgram 🎉📸

A modern social media application built with **React** and **Appwrite**, allowing users to share, like, and save posts in a familiar social networking environment inspired by **Instagram**.

![Sanzgram Preview](https://res.cloudinary.com/dgicvkltw/image/upload/v1742242788/lrbnml7bqyqtfrrnki1l_smizu5.jpg)

## Description 📖

**Sanzgram** is a feature-rich social media platform that enables users to create, share, and interact with posts. Inspired by Instagram, it offers an intuitive experience with functionalities such as user authentication, post management, social interactions, and more.

## Technologies Used ⚙️

**Frontend:**

- **React** with **TypeScript** 🖥️
- **Vite** (fast build tool) ⚡
- **TailwindCSS** for modular styling 🎨
- **Shadcn UI Components** for modern UI elements 🎛️

**Backend/Services:**

- **Appwrite** (Authentication, Database, Storage) 🔒
- **React Query** for data fetching 🔄
- **React Router DOM** for routing 📍

## Installation 🛠️

To get started with **Sanzgram**, follow these simple steps:

1. Clone the repository:

```bash
git clone https://github.com/yourusername/sanzgram.git
cd sanzgram
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:
   Create a `.env` file in the root of the project with the following variables:

```
VITE_APPWRITE_URL=your-appwrite-url
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=your-database-id
VITE_APPWRITE_STORAGE_ID=your-storage-id
VITE_APPWRITE_USER_COLLECTION_ID=your-user-collection-id
VITE_APPWRITE_POST_COLLECTION_ID=your-post-collection-id
VITE_APPWRITE_SAVES_COLLECTION_ID=your-saves-collection-id
```

> **Note:** Make sure you have an active Appwrite account and your project set up to use the provided services.

## Usage 🚀

Run the development server locally:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to explore the app.

## Key Features 🌟

- User authentication (sign up/sign in) 🔑
- Create, edit, and delete posts ✏️
- Like and save posts ❤️💾
- Explore feed with infinite scroll 🔄
- User profiles with personal content 👤
- Top creators section to highlight popular users 🌟
- Real-time updates for a dynamic experience ⚡
- Fully responsive design (works on all devices) 📱💻

## Project Structure 🗂️

Here’s a breakdown of the project structure:

```
src/
├── _auth/          # Authentication-related components
├── _root/          # Main application routes and layouts
├── components/     # Reusable UI components
├── context/        # React context providers for state management
├── lib/            # Utility functions and API calls
└── types/          # TypeScript type definitions
```

## Functionality 🔧

The application leverages **Appwrite** for its backend services. Key features include:

- **Authentication**: Users can sign up and sign in via Appwrite's authentication service.
- **Database**: Stores essential data like users' posts, saves, and profile information.
- **Storage**: Manages media files (images, videos) and user avatars.
- **API Integration**: Custom API wrapper for seamless interaction with Appwrite services.

## Contributing 🤝

We welcome contributions to improve **Sanzgram**! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add new feature'`)
5. Push to the branch (`git push origin feature/your-feature`)
6. Open a pull request

> **Note:** This project was built following the JavaScript Mastery tutorial: [Build and Deploy a Full Stack Social Media App](https://www.youtube.com/watch?v=_W3R2VwRyF4).

If you have any ideas, feel free to submit an issue or open a pull request! ✨

## License 📄

## This project is licensed under the **MIT License**.

> **Enjoy using Sanzgram!** 🎉  
> Made with ❤️ by **Santiago Anzola**
