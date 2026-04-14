# Library Management System - Specification Document

## 1. Project Overview

**Project Name:** GestioBib - Library Management System  
**Project Type:** Full-stack web application  
**Core Functionality:** A modern library management system with authentication, role-based access control, book management, and borrowing system  
**Target Users:** Students and Librarians in educational institutions

## 2. Technical Stack

- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js v4
- **Database ORM:** Prisma
- **Database:** SQLite (for development simplicity)
- **State Management:** React Context API + Zustand for global state
- **Password Hashing:** bcryptjs

## 3. UI/UX Specification

### 3.1 Color Palette

**Primary Colors:**
- Primary: `#6366F1` (Indigo 500)
- Primary Dark: `#4F46E5` (Indigo 600)
- Primary Light: `#818CF8` (Indigo 400)

**Secondary Colors:**
- Secondary: `#10B981` (Emerald 500)
- Secondary Dark: `#059669` (Emerald 600)

**Neutral Colors:**
- Background: `#F9FAFB` (Gray 50)
- Card Background: `#FFFFFF`
- Text Primary: `#111827` (Gray 900)
- Text Secondary: `#6B7280` (Gray 500)
- Border: `#E5E7EB` (Gray 200)

**Status Colors:**
- Success: `#10B981` (Emerald 500)
- Warning: `#F59E0B` (Amber 500)
- Error: `#EF4444` (Red 500)
- Info: `#3B82F6` (Blue 500)

### 3.2 Typography

**Font Family:** 
- Primary: `Inter` (Google Fonts)
- Monospace: `JetBrains Mono` for code

**Font Sizes:**
- Heading 1: `text-4xl font-bold`
- Heading 2: `text-3xl font-semibold`
- Heading 3: `text-2xl font-semibold`
- Body: `text-base`
- Small: `text-sm`
- Tiny: `text-xs`

### 3.3 Spacing System

- Base unit: `4px`
- Common spacings: `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`
- Container max-width: `1280px`
- Card padding: `24px`
- Section spacing: `48px`

### 3.4 Visual Effects

**Shadows:**
- Card shadow: `shadow-lg`
- Hover shadow: `shadow-xl`
- Modal shadow: `shadow-2xl`

**Transitions:**
- Default transition: `transition-all duration-300 ease-in-out`
- Hover effects: `hover:scale-105`
- Button hover: `hover:bg-indigo-600`

**Border Radius:**
- Buttons: `rounded-lg`
- Cards: `rounded-xl`
- Inputs: `rounded-md`
- Full round: `rounded-full`

### 3.5 Layout Structure

**Global Layout:**
- Header with navigation
- Main content area with container
- Footer (optional)

**Dashboard Layout:**
- Sidebar navigation (collapsible)
- Main content area
- Top bar with user info

## 4. Page Structure

### 4.1 Home Page (`/`)

**Design:** Chat-style interface inspired by ChatGPT

**Components:**
- Header: Logo + Navigation buttons
- Chat container: 
  - Welcome message bubble (AI assistant style)
  - Quick action buttons in chat bubble format:
    - "📚 Browse Books" → Navigate to `/books`
    - "🔐 Login" → Navigate to `/login`
    - "📝 Register" → Navigate to `/register`
    - "👨‍💼 I'm a Librarian" → Navigate to `/login?role=librarian`
- Background: Subtle gradient or pattern

**Chat Bubble Styling:**
- AI message: Left-aligned, gray background, rounded corners
- User actions: Grid of large clickable cards
- Smooth fade-in animations

### 4.2 Login Page (`/login`)

**Design:** Clean, centered card layout

**Components:**
- Toggle: Student / Librarian role selector (pill-style)
- Email input field
- Password input field
- Remember me checkbox
- Login button (full width)
- Link to register page
- Error message display

**Validation:**
- Email format validation
- Password minimum 6 characters
- Required field validation

### 4.3 Register Page (`/register`)

**Design:** Similar to login page

**Components:**
- Name input
- Email input
- Password input (with strength indicator)
- Confirm password
- Role selector (hidden field, defaults to student)
- Register button
- Link to login page

### 4.4 Student Dashboard (`/student/dashboard`)

**Layout:** Dashboard with sidebar

**Sections:**

**Header:**
- Welcome message with user name
- Quick stats cards

**Available Books Section:**
- Grid of book cards
- Each card shows: Title, Author, Category, Availability badge
- "Borrow" button for available books
- Search bar
- Category filter dropdown

**My Borrowed Books Section:**
- Table/list of currently borrowed books
- Columns: Title, Borrow Date, Due Date, Status
- "Return" button
- Overdue warning badges

**Statistics Cards:**
- Total books borrowed
- Currently borrowed
- Overdue count
- Books read this month

### 4.5 Librarian Dashboard (`/admin/dashboard`)

**Layout:** Dashboard with sidebar navigation

**Sections:**

**Header:**
- Welcome message
- Date and time
- Quick action buttons

**Statistics Overview:**
- Total books count
- Total students
- Books borrowed today
- Pending requests
- Overdue books

**Add New Book Form:**
- Floating card in sidebar or main area
- Fields: Title, Author, Description, Category
- Submit button

**Book Management Table:**
- Search and filter
- Columns: Title, Author, Category, Status, Actions
- Edit and Delete buttons
- Availability toggle

**User Management:**
- List of students
- Search functionality
- View user details
- Disable/Enable user

**Borrow Requests:**
- Pending requests list
- Approve/Reject buttons
- Request details

### 4.6 Books Page (`/books`)

**Design:** Public browsing page

**Components:**
- Hero section with search bar
- Category filters (horizontal scrollable pills)
- Book grid (responsive: 1 col mobile, 2 col tablet, 3-4 col desktop)
- Each book card:
  - Cover placeholder (gradient based on category)
  - Title, Author
  - Category badge
  - Availability status badge
  - "View Details" button

**Book Detail Modal:**
- Full book information
- Description
- Borrow button (if available and user is logged in)
- Close button

**Features:**
- Search by title/author
- Filter by category
- Filter by availability
- Pagination (12 books per page)

## 5. Data Models

### 5.1 User Model

```prisma
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  password      String
  role          Role      @default(STUDENT)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  borrowRecords BorrowRecord[]
}

enum Role {
  STUDENT
  LIBRARIAN
}
```

### 5.2 Book Model

```prisma
model Book {
  id            String    @id @default(cuid())
  title         String
  author        String
  description   String?
  category      String
  isAvailable   Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  borrowRecords BorrowRecord[]
}
```

### 5.3 BorrowRecord Model

```prisma
model BorrowRecord {
  id          String         @id @default(cuid())
  userId      String
  bookId      String
  borrowDate  DateTime       @default(now())
  dueDate     DateTime
  returnDate  DateTime?
  status      BorrowStatus   @default(PENDING)
  user        User           @relation(fields: [userId], references: [id])
  book        Book           @relation(fields: [bookId], references: [id])
}

enum BorrowStatus {
  PENDING
  APPROVED
  REJECTED
  RETURNED
  OVERDUE
}
```

## 6. Authentication System

### 6.1 NextAuth Configuration

**Providers:**
- Credentials provider (email/password)

**Callbacks:**
- JWT: Include user role in token
- Session: Include user role in session

**Session Strategy:** JWT

### 6.2 Protected Routes

**Middleware Configuration:**
- `/student/*` → Requires STUDENT or LIBRARIAN role
- `/admin/*` → Requires LIBRARIAN role only
- `/api/*` → Appropriate role validation

## 7. API Endpoints

### 7.1 Authentication APIs
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### 7.2 Book APIs
- `GET /api/books` - List all books (with filters)
- `GET /api/books/[id]` - Get single book
- `POST /api/books` - Create book (admin only)
- `PUT /api/books/[id]` - Update book (admin only)
- `DELETE /api/books/[id]` - Delete book (admin only)

### 7.3 Borrow APIs
- `GET /api/borrow` - Get user's borrow records
- `GET /api/borrow/all` - Get all borrow records (admin only)
- `POST /api/borrow` - Request to borrow a book
- `PUT /api/borrow/[id]` - Approve/Reject/Return (admin only)

### 7.4 User APIs
- `GET /api/users` - List all users (admin only)
- `GET /api/users/[id]` - Get user details
- `PUT /api/users/[id]` - Update user (admin only)

## 8. Component Library

### 8.1 Shared Components

1. **Button**
   - Variants: primary, secondary, outline, ghost
   - Sizes: sm, md, lg
   - States: default, hover, active, disabled, loading

2. **Input**
   - Types: text, email, password
   - States: default, focus, error, disabled
   - With label and error message

3. **Card**
   - Default card with shadow
   - Hover effect variant
   - Clickable variant

4. **Badge**
   - Status badges (available, borrowed, overdue)
   - Category badges
   - Role badges

5. **Modal**
   - Centered overlay
   - Close button
   - Backdrop click to close

6. **Sidebar**
   - Navigation links
   - Active state
   - Collapsible on mobile

7. **Header**
   - Logo
   - Navigation
   - User menu

8. **BookCard**
   - Book information display
   - Action buttons
   - Status indicators

9. **ChatBubble**
   - Message bubble styling
   - Action buttons grid

10. **StatsCard**
    - Icon
    - Value
    - Label
    - Trend indicator

## 9. State Management

### 9.1 Auth Context
- User information
- Login/logout functions
- Role checking

### 9.2 UI State (Zustand)
- Sidebar open/closed
- Modal states
- Toast notifications
- Theme (light/dark)

## 10. Security Requirements

1. **Password Security:**
   - Hash passwords with bcrypt (10 rounds)
   - Never store plain text passwords

2. **Route Protection:**
   - Middleware for protected routes
   - Server-side role validation

3. **Input Validation:**
   - Sanitize all inputs
   - Validate on both client and server

4. **API Security:**
   - Validate user ownership for modifications
   - Rate limiting (optional)

## 11. Extra Features (To Implement)

1. **Dark Mode Toggle**
   - System preference detection
   - Manual toggle
   - Persist preference

2. **Borrow/Return System**
   - Automatic due date calculation (14 days)
   - Overdue tracking
   - Return confirmation

3. **Notifications**
   - Toast notifications for actions
   - Success/error messages

4. **Pagination**
   - Books list pagination
   - Admin tables pagination

5. **Search & Filter**
   - Real-time search
   - Multiple filter options

## 12. File Structure

```
library-management/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── books/
│   │   │   └── page.tsx
│   │   ├── student/
│   │   │   └── dashboard/
│   │   │       └── page.tsx
│   │   ├── admin/
│   │   │   └── dashboard/
│   │   │       └── page.tsx
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts
│   │       ├── books/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       ├── borrow/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       └── users/
│   │           └── route.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── index.ts
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── DashboardLayout.tsx
│   │   ├── books/
│   │   │   ├── BookCard.tsx
│   │   │   ├── BookGrid.tsx
│   │   │   └── BookFilters.tsx
│   │   └── chat/
│   │       └── ChatInterface.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts
│   └── store/
│       └── uiStore.ts
├── .env
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 13. Development Checklist

- [ ] Initialize Next.js project
- [ ] Configure Tailwind CSS
- [ ] Set up Prisma with SQLite
- [ ] Create database schema
- [ ] Implement authentication with NextAuth
- [ ] Create UI components
- [ ] Build homepage with chat interface
- [ ] Build login/register pages
- [ ] Build student dashboard
- [ ] Build librarian dashboard
- [ ] Build books page
- [ ] Implement API routes
- [ ] Add middleware for protected routes
- [ ] Test all functionality
- [ ] Add dark mode (optional)
- [ ] Polish UI and animations
