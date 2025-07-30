# 🧳 Wanderlust

**Wanderlust** is a full-stack web application where users can explore, create, and review vacation listings — inspired by Airbnb. It allows user authentication, image uploads, category-based listing creation, and review management in a seamless UI.

---

## 📌 About the Project

This project follows the **MVC (Model-View-Controller)** architecture, ensuring clean separation of concerns. The **Model** handles the database, the **View** manages the UI with EJS templates, and the **Controller** deals with the logic. This structure made it easy to scale features and keep the code organized.

---

## 🌍 Features

- 🏕️ Add, edit, and delete listings
- 🌟 Leave reviews on listings
- 📸 Upload multiple images with Cloudinary
- 🔐 User authentication with Passport.js
- 🗂️ Filter listings by category
- 🧾 Clean UI with EJS templating and Bootstrap
- 📦 Environment variable support using `.env`

---

## 🛠️ Tech Stack

### Frontend
- EJS
- HTML, CSS, Bootstrap

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- Passport.js for Authentication
- Multer for Image Uploads
- Cloudinary for Image Hosting

---

## 📁 Project Structure

├── app.js
├── routes/
│ ├── listings.js
│ └── users.js
├── controllers/
│ ├── listing.js
│ └── review.js
├── models/
│ ├── listing.js
│ ├── user.js
│ └── review.js
├── views/
│ └── *.ejs
├── public/
│ ├── images/
│ └── styles/
├── middleware.js
├── .env
├── .gitignore
└── README.md


---

## ⚙️ Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/urvashi-lab/wanderLust.git
cd wanderlust

# 2. Install dependencies
npm install

# 3. Create a `.env` file with your environment variables:
# CLOUDINARY_CLOUD_NAME=
# CLOUDINARY_KEY=
# CLOUDINARY_SECRET=
# DB_URL=
# SESSION_SECRET=

# 4. Run the app
node app.js

🎯 Future Enhancements
🧭 Add map-based location tagging

📱 Responsive design improvements

🛑 Rate limiting and spam protection

💬 Real-time messaging between users

👩‍💻 Author
Urvashi Patil
Full Stack Developer | PICT Pune
LinkedIn | GitHub

---

## 📜 License

This project is licensed for educational and personal learning use.
