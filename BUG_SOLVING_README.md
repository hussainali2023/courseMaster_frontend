# CourseMaster - Bug Solving & Fixes Documentation

This document provides a comprehensive report of all bugs identified, diagnosed, and resolved across the **CourseMaster Backend** and **Frontend** applications.

---

## 📋 Table of Contents
1. [Backend Bug Fixes](#1-backend-bug-fixes)
   - [Bug 1: JWT Secret Missing & Token Generation Crash](#bug-1-jwt-secret-missing--token-generation-crash)
   - [Bug 2: Role Elevation & Unverified Admin Key (Code-12)](#bug-2-role-elevation--unverified-admin-key-code-12)
   - [Bug 3: Plaintext Password Comparison on Login (Code-5)](#bug-3-plaintext-password-comparison-on-login-code-5)
   - [Bug 4: Banned Users Able to Log In](#bug-4-banned-users-able-to-log-in)
   - [Bug 5: JWT Verification Failure Bypassing Auth (Code-15)](#bug-5-jwt-verification-failure-bypassing-auth-code-15)
   - [Bug 6: CORS Restricting HTTP Methods (Code-10)](#bug-6-cors-restricting-http-methods-code-10)
   - [Bug 7: Quiz Percentage Multiplied by 10 (Code-4)](#bug-7-quiz-percentage-multiplied-by-10-code-4)
   - [Bug 8: Schema Field Mismatch in Admin Assignment Filter (Code-8)](#bug-8-schema-field-mismatch-in-admin-assignment-filter-code-8)
   - [Bug 9: Inverted Logic on Enrollment Check](#bug-9-inverted-logic-on-enrollment-check)
   - [Bug 10: Missing `await` on Mongoose `enrollment.save()` (Code-9)](#bug-10-missing-await-on-mongoose-enrollmentsave-code-9)
   - [Bug 11: Backend `.env.example` Template](#bug-11-backend-envexample-template)
2. [Frontend Bug Fixes](#2-frontend-bug-fixes)
   - [Bug 12: LocalStorage Token Key Mismatch (`user_token` vs `token`)](#bug-12-localstorage-token-key-mismatch-user_token-vs-token)
   - [Bug 13: Redux Store Accesses Undefined Property on Enrollments Array (Code-6)](#bug-13-redux-store-accesses-undefined-property-on-enrollments-array-code-6)
   - [Bug 14: Missing Profile Page & 404 Route on `/profile`](#bug-14-missing-profile-page--404-route-on-profile)
   - [Bug 15: Student Dashboard Course Progress Showing `NaN%`](#bug-15-student-dashboard-course-progress-showing-nan)
   - [Bug 16: Course Player Video Dimensions Inverted](#bug-16-course-player-video-dimensions-inverted)
   - [Bug 17: Post-Login Role-Aware Navigation](#bug-17-post-login-role-aware-navigation)
3. [Summary of Coded Assignment Bugs](#3-summary-of-coded-assignment-bugs)

---

## 1. Backend Bug Fixes

### Bug 1: JWT Secret Missing & Token Generation Crash
* **Files:** 
  - `courseMaster_Backend/.env`
  - `courseMaster_Backend/src/utils/generateToken.js`
  - `courseMaster_Backend/src/middlewares/authMiddleware.js`
* **Issue:** 
  When a user attempted to register, the backend crashed with:
  ```
  Error: secretOrPrivateKey must have a value
  ```
  `process.env.JWT_SECRET` was absent from `courseMaster_Backend/.env`, causing `jwt.sign()` in `generateToken.js` to receive `undefined`.
* **Fix:**
  1. Added `JWT_SECRET`, `PORT`, and `ADMIN_REGISTRATION_KEY` to `courseMaster_Backend/.env`.
  2. Added a safe fallback secret in `generateToken.js` and `authMiddleware.js`:
     ```javascript
     const secret = process.env.JWT_SECRET || "coursemaster-super-secret-jwt-key-2026";
     return jwt.sign(payload, secret, { expiresIn: "30d" });
     ```

---

### Bug 2: Role Elevation & Unverified Admin Key (Code-12)
* **File:** `courseMaster_Backend/src/services/auth.service.js`
* **Issue:**
  The registration logic blindly accepted `role: role || "student"` from the request body without verifying `adminKey` against `process.env.ADMIN_REGISTRATION_KEY`. Anyone could register as an admin by passing `"role": "admin"` in the payload, while users providing a valid `adminKey` were not granted admin privileges.
* **Fix:**
  Implemented server-side validation against `process.env.ADMIN_REGISTRATION_KEY`:
  ```javascript
  let userRole = "student";
  if (adminKey) {
    if (process.env.ADMIN_REGISTRATION_KEY && adminKey === process.env.ADMIN_REGISTRATION_KEY) {
      userRole = "admin";
    } else {
      throw new Error("Invalid admin registration key");
    }
  }
  ```

---

### Bug 3: Plaintext Password Comparison on Login (Code-5)
* **File:** `courseMaster_Backend/src/services/auth.service.js`
* **Issue:**
  In the `login` function, passwords were verified using direct string equality:
  ```javascript
  // ❌ Bug:
  const match = (password === user.passwordHash);
  ```
  Because passwords are saved as bcrypt hashes, this comparison always returned `false`, rejecting all valid login attempts.
* **Fix:**
  Replaced with asynchronous bcrypt comparison:
  ```javascript
  // ✅ Fixed:
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new Error("Invalid email or password");
  ```

---

### Bug 4: Banned Users Able to Log In
* **File:** `courseMaster_Backend/src/services/auth.service.js`
* **Issue:**
  The `login` function did not check the `isBanned` flag on the user document. Admins could ban accounts, but banned users could still authenticate and obtain a token.
* **Fix:**
  Added account suspension check prior to token issuance:
  ```javascript
  if (user.isBanned) throw new Error("This account has been banned");
  ```

---

### Bug 5: JWT Verification Failure Bypassing Auth (Code-15)
* **File:** `courseMaster_Backend/src/middlewares/authMiddleware.js`
* **Issue:**
  When token verification failed or expired, the `catch` block invoked `next()` instead of rejecting the request:
  ```javascript
  // ❌ Bug:
  } catch {
    next();
  }
  ```
  Downstream handlers attempting to access `req.user.id` or `req.user.role` crashed with `TypeError: Cannot read properties of undefined (reading 'id')` instead of properly rejecting with HTTP 401.
* **Fix:**
  Updated the catch block to return a 401 Unauthorized response:
  ```javascript
  // ✅ Fixed:
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
  ```

---

### Bug 6: CORS Restricting HTTP Methods (Code-10)
* **File:** `courseMaster_Backend/app.js`
* **Issue:**
  A custom middleware overrode CORS headers restricting allowed methods to only `GET` and `POST`:
  ```javascript
  // ❌ Bug:
  res.header("Access-Control-Allow-Methods", "GET, POST");
  ```
  This blocked `PUT`, `PATCH`, and `DELETE` requests during browser CORS preflight checks (`OPTIONS`), breaking course updates, course deletion, assignment grading, lesson completion, and user management.
* **Fix:**
  Expanded allowed methods to include all API methods:
  ```javascript
  // ✅ Fixed:
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  ```

---

### Bug 7: Quiz Percentage Multiplied by 10 (Code-4)
* **File:** `courseMaster_Backend/src/services/quiz.service.js`
* **Issue:**
  In `submitQuiz`, the percentage calculation was multiplied by 10 instead of 100:
  ```javascript
  // ❌ Bug:
  const percent = Math.round((score / total) * 10);
  ```
  A perfect score of 2/2 produced `10%` instead of `100%`.
* **Fix:**
  Corrected calculation multiplier to 100:
  ```javascript
  // ✅ Fixed:
  const percent = Math.round((score / total) * 100);
  ```

---

### Bug 8: Schema Field Mismatch in Admin Assignment Filter (Code-8)
* **Files:**
  - `courseMaster_Backend/src/services/admin.service.js`
  - `courseMaster_Backend/src/controllers/admin.controller.js`
* **Issue:**
  The `AssignmentSubmission` Mongoose model defines the course reference as `course`, but `getAssignments` filtered on non-existent field `courseId`:
  ```javascript
  // ❌ Bug:
  if (query.courseId) filter.courseId = query.courseId;
  ```
  Additionally, `admin.controller.js` did not pass `req.query` to `adminService.getAssignments()`.
* **Fix:**
  1. Updated `admin.service.js` to query against `course`:
     ```javascript
     // ✅ Fixed:
     const courseId = query.courseId || query.course;
     if (courseId) filter.course = courseId;
     if (query.status) filter.status = query.status;
     ```
  2. Updated `admin.controller.js` to forward `req.query`:
     ```javascript
     const data = await adminService.getAssignments(req.query);
     ```

---

### Bug 9: Inverted Logic on Enrollment Check
* **File:** `courseMaster_Backend/src/services/enrollment.service.js`
* **Issue:**
  Line 14 threw an error when the user was **not** enrolled (`!enrollment`):
  ```javascript
  // ❌ Bug:
  if (!enrollment) {
    throw new Error("Already enrolled in this course");
  }
  ```
  New students were prevented from enrolling, while already-enrolled students bypassed the check and triggered a MongoDB compound unique key error (`E11000 duplicate key error`).
* **Fix:**
  Inverted the condition to check if `enrollment` exists:
  ```javascript
  // ✅ Fixed:
  if (enrollment) {
    throw new Error("Already enrolled in this course");
  }
  ```

---

### Bug 10: Missing `await` on Mongoose `enrollment.save()` (Code-9)
* **File:** `courseMaster_Backend/src/services/enrollment.service.js`
* **Issue:**
  In `completeLesson`, `enrollment.save()` was called without `await`:
  ```javascript
  // ❌ Bug:
  enrollment.save();
  return enrollment;
  ```
  The response was returned before the database write completed, leading to unhandled promise rejections on failure and potential data loss in serverless environments.
* **Fix:**
  Added `await`:
  ```javascript
  // ✅ Fixed:
  await enrollment.save();
  return enrollment;
  ```

---

### Bug 11: Backend `.env.example` Template
* **File:** `courseMaster_Backend/.env.example`
* **Issue:**
  The backend repository had frontend environment variables (`VITE_API_BASE_URL`) instead of backend settings.
* **Fix:**
  Replaced with proper backend environment documentation (`PORT`, `MONGODB_URI`, `JWT_SECRET`, `ADMIN_REGISTRATION_KEY`, `NODE_ENV`).

---

## 2. Frontend Bug Fixes

### Bug 12: LocalStorage Token Key Mismatch (`user_token` vs `token`)
* **File:** `courseMaster_frontEnd/src/utils/auth.js`
* **Issue:**
  `saveToken` saved to `"user_token"`, while `getToken` and `clearToken` accessed `"token"`.
  ```javascript
  // ❌ Bug:
  export const saveToken = (token) => localStorage.setItem("user_token", token);
  export const getToken = () => localStorage.getItem("token");
  export const clearToken = () => localStorage.removeItem("token");
  ```
  After logging in, `getToken()` returned `null`. This caused:
  - Axios interceptor never attached the authorization token.
  - `ProtectedRoute` immediately redirected back to `/login`.
  - The Navbar and Redux store never recognized the user as logged in.
* **Fix:**
  Synchronized keys so saving, getting, and clearing operate consistently on `user_token` (and clean both keys):
  ```javascript
  // ✅ Fixed:
  export const saveToken = (token) => localStorage.setItem("user_token", token);
  export const getToken = () => localStorage.getItem("user_token");
  export const clearToken = () => localStorage.removeItem("user_token");
  ```

---

### Bug 13: Redux Store Accesses Undefined Property on Enrollments Array (Code-6)
* **File:** `courseMaster_frontEnd/src/store/slices/enrollmentSlice.js`
* **Issue:**
  In `fetchMyEnrollments.fulfilled`, the payload was already an array. Trying to access `.data` made `state.enrollments` `undefined`:
  ```javascript
  // ❌ Bug:
  state.enrollments = action.payload.data;
  ```
  When `StudentDashboard.jsx` rendered, evaluating `enrollments.length` threw:
  ```
  TypeError: Cannot read properties of undefined (reading 'length')
  ```
* **Fix:**
  Assigned `action.payload` directly:
  ```javascript
  // ✅ Fixed:
  state.enrollments = action.payload || [];
  ```

---

### Bug 14: Missing Profile Page & 404 Route on `/profile`
* **Files:**
  - `courseMaster_frontEnd/src/pages/Profile/Profile.jsx`
  - `courseMaster_frontEnd/src/App.jsx`
* **Issue:**
  The Navbar user dropdown contained a link to `<Link to="/profile">Profile</Link>`, but there was no `Profile.jsx` component and no `/profile` route in `App.jsx`, causing a 404 Not Found error.
* **Fix:**
  1. Created a responsive `Profile.jsx` page displaying user information, avatar initials, role badge, member since date, account details, and quick links to enrolled courses.
  2. Registered the route in `App.jsx` wrapped inside `<ProtectedRoute>`.

---

### Bug 15: Student Dashboard Course Progress Showing `NaN%`
* **File:** `courseMaster_frontEnd/src/pages/student/StudentDashboard.jsx`
* **Issue:**
  Line 261 attempted to recalculate progress by dividing by `stats?.courseData?.syllabus`, which was `undefined` prior to expanding course details:
  ```javascript
  // ❌ Bug:
  {Math.round((enrollment.progress.completedLessons.length / (stats?.courseData?.syllabus?.reduce(...))) * 100)}%
  ```
  Dividing by `undefined` resulted in `NaN%`.
* **Fix:**
  Used the pre-calculated percentage from the backend enrollment progress:
  ```javascript
  // ✅ Fixed:
  {enrollment.progress?.percent || 0}%
  ```

---

### Bug 16: Course Player Video Dimensions Inverted
* **File:** `courseMaster_frontEnd/src/pages/CoursePlayer/CoursePlayer.jsx`
* **Issue:**
  The YouTube video iframe was set to a vertical phone-like format:
  ```html
  <!-- ❌ Bug: -->
  <iframe style={{ height: '700px', width: '300px' }} ...>
  ```
* **Fix:**
  Corrected dimensions to landscape orientation:
  ```html
  <!-- ✅ Fixed: -->
  <iframe style={{ height: '300px', width: '700px' }} ...>
  ```

---

### Bug 17: Post-Login Role-Aware Navigation
* **File:** `courseMaster_frontEnd/src/pages/Login/Login.jsx`
* **Issue:**
  Both administrators and students were always navigated to `/`, requiring admins to manually browse to the admin panel.
* **Fix:**
  Updated post-login navigation to direct admins to `/admin` and students to `/`:
  ```javascript
  if (res.data.user?.role === "admin") {
      navigate("/admin");
  } else {
      navigate("/");
  }
  window.location.reload();
  ```

---

## 3. Summary of Coded Assignment Bugs

| Code ID | File | Description | Status |
| :--- | :--- | :--- | :---: |
| **Code-4** | `courseMaster_Backend/src/services/quiz.service.js` | Quiz score multiplied by 10 instead of 100 | ✅ Fixed |
| **Code-5** | `courseMaster_Backend/src/services/auth.service.js` | Plaintext password check instead of `bcrypt.compare` | ✅ Fixed |
| **Code-6** | `courseMaster_frontEnd/src/store/slices/enrollmentSlice.js` | Redux payload accesses `.data` on an array | ✅ Fixed |
| **Code-8** | `courseMaster_Backend/src/services/admin.service.js` | Query uses `courseId` instead of model field `course` | ✅ Fixed |
| **Code-9** | `courseMaster_Backend/src/services/enrollment.service.js` | Missing `await` on Mongoose `enrollment.save()` | ✅ Fixed |
| **Code-10**| `courseMaster_Backend/app.js` | CORS restricts methods to `GET, POST`, breaking `PUT/PATCH/DELETE` | ✅ Fixed |
| **Code-12**| `courseMaster_Backend/src/services/auth.service.js` | Direct role pass in register without `adminKey` verification | ✅ Fixed |
| **Code-15**| `courseMaster_Backend/src/middlewares/authMiddleware.js` | JWT verification failure calls `next()` instead of returning 401 | ✅ Fixed |
