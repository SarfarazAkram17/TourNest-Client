# TourNest — Tourism Management System

**TourNest** is a full-stack tourism and travel management platform where users can explore tour packages, book trips, apply as tour guides, share their stories, and securely make payments. It supports multiple user roles with robust access control, real-time updates, and a responsive user interface.

---

## 🔗 Live Project

- 🌐 **Website**: [https://tournest-sarfaraz-akram.netlify.app](https://tournest-sarfaraz-akram.netlify.app)
- ⚙️ **Backend Repository**: [GitHub – TourNest Server](https://github.com/SarfarazAkram17/TourNest-Server)

---

## 🚀 Features Overview

### 👥 User Roles

- **Tourist**: Browse, book, and share stories.
- **Tour Guide**: Handle assigned tours, share stories.
- **Admin**: Manage users, packages, candidates, stats, and share stories.

### 🌍 Tour Packages

- Explore tour packages with gallery, location, and plan.

### 📅 Bookings & Payments

- Tourists can book trips with selected guide/date.
- Stripe integration for secure card payments.
- Status flow: Pending → In Review → Accepted/Rejected.
- Confetti animation after 3 successful payments 🎉.

### 🧑‍🏫 Tour Guide Application

- Tourists can apply as guides with title, reason, CV and other things.
- Admin approves or rejects tour guide applications.

### 📝 Stories

- Users and guides can add stories with title, content, and images.
- Shareable via Facebook using `react-share`.
- Guides’ stories visible on their public profile.

### 📊 Admin Dashboard

- View total:
  - ✅ Payments (sum of all)
  - ✅ Tour Guides (count)
  - ✅ Tourists (count)
  - ✅ Packages
  - ✅ Stories
- Manage:
  - ✅ All users (search/filter by role)
  - ✅ Candidate applications
  - ✅ Add packages

### 📄 Profile & Dashboard

- All users can update their profile (except email/role).
- Role-based dashboard views and actions.
- Join as Tour Guide button for tourists.
- Manage guide profile page where tour guides update their guide profile.

### 🎯 Homepage Highlights

- Tabs for "Our Packages" and "Meet Our Tour Guides"
- Randomized content with MongoDB `$sample`
- Stories with share options and All Stories link

### 🔐 Auth & Security

- Firebase Auth (Email/Password + Google Sign-In)
- JWT-secured API access
- Role-based route protection
- Persistent login after page refresh

### 🧠 Smart UX

- SweetAlert2 modals for actions
- Toast feedbacks
- Lottie animations for loaders
- Fully responsive design
- Framer Motion for smooth transitions on homepage

---

## 🧰 Tech Stack

| Layer      | Technology                        |
| ---------- | --------------------------------- |
| Frontend   | React, Tailwind CSS, DaisyUI      |
| Backend    | Node.js, Express.js, MongoDB      |
| Auth       | Firebase Authentication, JWT      |
| Animation  | Framer Motion, Lottie             |
| Payment    | Stripe                            |
| Deployment | Netlify (Client), Vercel (Server) |

---

## 📦 All NPM Packages

| Package                     | Version  | Purpose                                    |
| --------------------------- | -------- | ------------------------------------------ |
| `@stripe/react-stripe-js`   | ^3.7.0   | Stripe frontend integration                |
| `@tanstack/react-query`     | ^5.82.0  | API data fetching                          |
| `framer-motion`             | ^12.23.5 | Animations & transitions                   |
| `lottie-react`              | ^2.4.1   | Lottie animations for loaders              |
| `react-confetti`            | ^6.4.0   | Confetti celebration after 3 paid bookings |
| `react-datepicker`          | ^8.4.0   | Elegant datepicker for booking form        |
| `react-hook-form`           | ^7.60.0  | Form handling and validation               |
| `react-icons`               | ^5.5.0   | Icons for UI                               |
| `react-responsive-carousel` | ^3.2.23  | Carousel for banner section                |
| `react-router`              | ^7.6.3   | Routing system                             |
| `react-select`              | ^5.10.1  | Stylish select/dropdown UI                 |
| `react-share`               | ^5.2.2   | Share stories on Facebook                  |
| `react-tabs`                | ^6.1.0   | Tab components                             |
| `react-toastify`            | ^11.0.5  | Toast notifications                        |
| `react-use`                 | ^17.6.0  | to get window size to show confetti        |
| `sweetalert2`               | ^11.22.2 | Confirmation modals                        |


### 👨‍💻 Developer

- 🧑‍💻 **Name**: Sarfaraz Akram
- 🌍 **Portfolio**: [https://sarfarazakram.netlify.app](https://sarfarazakram.netlify.app)
- 📧 **Email**: sarfaraz.akram055@gmail.com
- 🐱 **GitHub**: [Sarfaraz Akram](https://github.com/SarfarazAkram17)

# 🛠️ Getting Started

git clone https://github.com/SarfarazAkram17/TourNest-Client <br />
cd TourNest-Client
