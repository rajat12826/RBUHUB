# User and Role Management Chat Application

This project is a user and role management system built on top of a real-time chat application using **React** and **Supabase**. The application allows admins to manage users, roles, and permissions, while regular users can interact in real-time chat rooms. The app also simulates server responses for CRUD operations on users and roles, allowing users to add, edit, delete, and modify the permissions of users and roles.

## **Core Features**

### 1. **User Management**

The application allows for comprehensive user management, where admins can view, add, edit, and delete users. The key features of the User Management system include:

- **View Users**: Admins can see the list of all users, including details like username, email, status (active/inactive), and roles.
- **Add Users**: Admins can add new users to the system by specifying their username, email, password, and role.
- **Edit Users**: Admins can modify user details such as username, email, role, and status (active/inactive).
- **Delete Users**: Admins can remove users from the system.
- **Manage Status**: Admins can set a user’s status to `Active` or `Inactive`.
- **Search Users**: Admins and users can search for users by their username, email, or status.

### 2. **Role Management**

Roles define the level of access a user has within the system. This system allows the creation and management of roles:

- **Create Roles**: Admins can create new roles such as `Admin`, `User`, `Manager`, etc.
- **Assign Roles to Users**: Admins can assign roles to users during user creation or via editing user profiles.
- **Edit Roles**: Admins can modify existing roles to include or remove specific permissions.
- **Delete Roles**: Admins can remove roles if they are no longer needed.

### 3. **Dynamic Permissions**

The permission system is built to be dynamic and flexible, with permissions being assigned to roles. Admins can manage the permissions for each role, and each user can have different permissions based on their role.

- **Permissions Model**: Each role has a set of permissions such as `Read`, `Write`, and `Delete`. Admins can customize the permissions for each role.
- **Assign Permissions to Roles**: Admins can assign or revoke permissions for specific roles. For instance, an admin can give a `Manager` role the ability to `Write` but not `Delete`.
- **Clear Permission Interface**: The permissions for each role are clearly displayed in the user interface, making it easy to modify roles and their associated permissions.

### 4. **Custom API Simulation (Optional)**

To simulate CRUD operations on users and roles, a mock API approach is used. This allows for testing the user and role management features without directly interacting with a backend.

- **Simulated Server Calls**: The application mimics backend API calls for creating, updating, and deleting users and roles.
- **Mock Responses**: Responses from the mock API simulate success or failure, allowing users to see how the application would behave in a real-world scenario.
- **CRUD Operations**: Each user and role management operation (create, read, update, delete) is simulated by the API, ensuring the system behaves as expected.

### 5. **Real-Time Chat Features**

In addition to user and role management, this app also includes real-time chat functionality, allowing users to interact with each other in chat rooms. Some of the real-time features include:

- **Real-Time Messaging**: Messages are sent and received instantly between users in the same room. No need for manual refreshes.
- **Room Creation & Joining**: Users can create or join chat rooms by entering a room ID. Admin users can create rooms, and regular users can join them.
- **Typing Indicators**: The application shows when a user is typing a message, providing a better user experience in real-time conversations.
- **Message Replies**: Users can reply to specific messages within a room. This allows for threaded conversations.
- **Online User Tracking**: The app tracks online users and shows a list of users currently active in the room.
- **User Presence**: When users join or leave rooms, the system updates in real-time to reflect these changes.

---

## **Technologies Used**

- **Frontend**: React, React Router, React Hot Toast (for notifications)
- **Backend**: Supabase (for authentication, real-time database, and storage)
- **State Management**: React `useState`, `useEffect`
- **Authentication**: Supabase Auth for user sign-up, login, and management
- **Real-time Communication**: Supabase Real-Time to handle live updates for user actions (typing, joining, leaving rooms, etc.)
- **Permissions Management**: Custom logic to assign and update user roles and permissions dynamically

---

## **Installation**

### Prerequisites

- **Node.js** (v16 or later)
- **npm** or **yarn**

### Steps to Set Up Locally

1. **Clone the Repository**:

   ```bash
   git clone # User and Role Management Chat Application

This project is a user and role management system built on top of a real-time chat application using **React** and **Supabase**. The application allows admins to manage users, roles, and permissions, while regular users can interact in real-time chat rooms. The app also simulates server responses for CRUD operations on users and roles, allowing users to add, edit, delete, and modify the permissions of users and roles.

## **Core Features**

### 1. **User Management**

The application allows for comprehensive user management, where admins can view, add, edit, and delete users. The key features of the User Management system include:

- **View Users**: Admins can see the list of all users, including details like username, email, status (active/inactive), and roles.
- **Add Users**: Admins can add new users to the system by specifying their username, email, password, and role.
- **Edit Users**: Admins can modify user details such as username, email, role, and status (active/inactive).
- **Delete Users**: Admins can remove users from the system.
- **Manage Status**: Admins can set a user’s status to `Active` or `Inactive`.
- **Search Users**: Admins and users can search for users by their username, email, or status.

### 2. **Role Management**

Roles define the level of access a user has within the system. This system allows the creation and management of roles:

- **Create Roles**: Admins can create new roles such as `Admin`, `User`, `Manager`, etc.
- **Assign Roles to Users**: Admins can assign roles to users during user creation or via editing user profiles.
- **Edit Roles**: Admins can modify existing roles to include or remove specific permissions.
- **Delete Roles**: Admins can remove roles if they are no longer needed.

### 3. **Dynamic Permissions**

The permission system is built to be dynamic and flexible, with permissions being assigned to roles. Admins can manage the permissions for each role, and each user can have different permissions based on their role.

- **Permissions Model**: Each role has a set of permissions such as `Read`, `Write`, and `Delete`. Admins can customize the permissions for each role.
- **Assign Permissions to Roles**: Admins can assign or revoke permissions for specific roles. For instance, an admin can give a `Manager` role the ability to `Write` but not `Delete`.
- **Clear Permission Interface**: The permissions for each role are clearly displayed in the user interface, making it easy to modify roles and their associated permissions.

### 4. **Custom API Simulation (Optional)**

To simulate CRUD operations on users and roles, a mock API approach is used. This allows for testing the user and role management features without directly interacting with a backend.

- **Simulated Server Calls**: The application mimics backend API calls for creating, updating, and deleting users and roles.
- **Mock Responses**: Responses from the mock API simulate success or failure, allowing users to see how the application would behave in a real-world scenario.
- **CRUD Operations**: Each user and role management operation (create, read, update, delete) is simulated by the API, ensuring the system behaves as expected.

### 5. **Real-Time Chat Features**

In addition to user and role management, this app also includes real-time chat functionality, allowing users to interact with each other in chat rooms. Some of the real-time features include:

- **Real-Time Messaging**: Messages are sent and received instantly between users in the same room. No need for manual refreshes.
- **Room Creation & Joining**: Users can create or join chat rooms by entering a room ID. Admin users can create rooms, and regular users can join them.
- **Typing Indicators**: The application shows when a user is typing a message, providing a better user experience in real-time conversations.
- **Message Replies**: Users can reply to specific messages within a room. This allows for threaded conversations.
- **Online User Tracking**: The app tracks online users and shows a list of users currently active in the room.
- **User Presence**: When users join or leave rooms, the system updates in real-time to reflect these changes.

---

## **Technologies Used**

- **Frontend**: React, React Router, React Hot Toast (for notifications)
- **Backend**: Supabase (for authentication, real-time database, and storage)
- **State Management**: React `useState`, `useEffect`
- **Authentication**: Supabase Auth for user sign-up, login, and management
- **Real-time Communication**: Supabase Real-Time to handle live updates for user actions (typing, joining, leaving rooms, etc.)
- **Permissions Management**: Custom logic to assign and update user roles and permissions dynamically

---

## **Installation**

### Prerequisites

- **Node.js** (v16 or later)
- **npm** or **yarn**

### Steps to Set Up Locally

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/your-repository-name.git
   cd RBUHUB

   cd your-repository-name
