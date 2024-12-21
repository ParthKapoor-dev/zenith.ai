

# 🌟 **Jobverse AI**  

**Jobverse AI** is a cutting-edge job recruitment and hiring platform that leverages **AI-driven insights** to streamline the job application and hiring process. Designed to make hiring easier and more effective, Jobverse AI helps recruiters and candidates find the perfect match, faster and smarter.

---

## 🚀 **Features**

### For Candidates:
- 📝 **Resume Upload and Management**: Easily upload and manage multiple resumes tailored for specific job applications.
- 🔍 **AI-Powered Job Recommendations**: Personalized job suggestions based on skills, experience, and interests.
- 📊 **Application Insights**: Track your application status and receive real-time updates.

### For Recruiters:
- 🛠️ **Custom Job Workflows**: Design job workflows with custom hiring checkpoints and eligibility criteria.
- 📋 **Candidate Pool Management**: Filter and manage candidates using **AI-powered scoring** and **role-specific filters**.
- 🗂️ **Detailed Job Listings**: Add essential details like min CGPA, hiring workflow, roles, and eligible branches with ease.
  
### General Features:
- 🌐 **Responsive and Intuitive UI**: A sleek interface built with **React.js** and **Tailwind CSS** for seamless user experience.
- 🔐 **Secure Authentication**: Leverages modern authentication techniques for both candidates and recruiters.
- 🖥️ **Admin Dashboard**: Comprehensive control over job postings, user data, and analytics.
  
---

## 🛠️ **Tech Stack**

| **Technology**  | **Purpose**                                   |
|------------------|-----------------------------------------------|
| **Next.js**      | Full-stack development with API routes       |
| **React.js**     | Frontend framework for dynamic UI            |
| **Tailwind CSS** | Responsive and modern design system          |
| **Node.js**      | Backend server and API integration      |
| **MySQL**   | Reliable relational database                 |
| **AI Integration** | Smart recommendations and insights         |

---

## 📖 **How It Works**

1. **Candidate Workflow**:
   - Sign up and upload resumes.
   - View recommended job listings and apply directly.
   - Track application progress via a clean dashboard.

2. **Recruiter Workflow**:
   - Create job posts with custom eligibility and workflow checkpoints.
   - Review applicants and manage the hiring process step-by-step.
   - Gain insights into candidate suitability with AI-driven metrics.

3. **Admin Features**:
   - Monitor platform usage and manage user data.
   - Oversee hiring workflows and ensure smooth operations.

---

## 🖥️ **Setup and Installation**

### **1. Prerequisites**
- Node.js `v16+`
- PostgreSQL or any compatible SQL database
- Firebase credentials for authentication

### **2. Clone the Repository**
```bash
git clone https://github.com/<your-username>/jobverse-ai.git
cd jobverse-ai
```

### **3. Install Dependencies**
```bash
npm install
```

### **4. Environment Variables**
Create a `.env.local` file in the root directory and configure the following:
```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
FIREBASE_API_KEY=<your-firebase-api-key>
FIREBASE_AUTH_DOMAIN=<your-auth-domain>
DATABASE_URL=<your-database-url>
JWT_SECRET=<your-jwt-secret>
```

### **5. Database Setup**
Run migrations to set up your database schema:
```bash
npx drizzle-kit generate:pg
npx drizzle-kit up
```

### **6. Run the Application**
Start the development server:
```bash
npm run dev
```

---

## ✨ **Why Jobverse AI?**

- **Efficiency**: Reduce hiring time by automating workflows and leveraging AI-powered insights.
- **Simplicity**: A user-friendly platform that works for both candidates and recruiters.
- **Scalability**: Designed with modern technologies to grow alongside your needs.

---

## 🤝 **Contributing**

Contributions are welcome! If you want to add features or report bugs, feel free to open an issue or a pull request.  

---

## 📜 **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## ✨ **Acknowledgments**

- **React.js** and **Tailwind CSS** for building a sleek, responsive UI.
- **MySQL** and **Drizzle ORM** for efficient and scalable data management.
- **OpenAI** for inspiring AI-driven recommendations.

---

## 📞 **Contact**

For inquiries, contact **<parthkapoor.coder@gmail.com>** or connect with us on [LinkedIn](https://linkedin.com/in/parthkapoor08).

---

Feel free to tweak this to better suit your project's unique attributes! If you'd like to add any other specifics, let me know. 😊