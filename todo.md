That's the standard approach.

## Desired Flow

```text
Visitor
   ↓
Home Page (/)
   ↓
 ┌──────────────┐
 │ Sign In      │
 │ Sign Up      │
 └──────────────┘

Sign Up
   ↓
Create account
   ↓
Login automatically (optional)
   ↓
Authenticated

OR

Sign In
   ↓
Login
   ↓
Authenticated

Authenticated
   ↓
Access protected routes
   ↓
/app
/dashboard
/profile
/settings
```

---

## Route Layout

```jsx
<Routes>
  {/* Public */}
  <Route path="/" element={<Home />} />
  <Route path="/signin" element={<SignIn />} />
  <Route path="/signup" element={<SignUp />} />

  {/* Protected */}
  <Route
    path="/app"
    element={
      <ProtectedRoute>
        <AppView />
      </ProtectedRoute>
    }
  />

  <Route
    path="/profile"
    element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    }
  />
</Routes>
```

---

## Auth Context State

Your auth context should expose something like:

```jsx
{
  user,
  loading,
  login,
  logout,
  signup
}
```

Example:

```jsx
const [user, setUser] = useState(null);
```

When logged out:

```js
user === null
```

When logged in:

```js
user = {
  id: 123,
  email: "test@example.com"
}
```

---

## Persist Login Across Refreshes

This is the part many beginners miss.

If you only do:

```jsx
setUser(data.user);
```

then refreshing the page logs the user out because React state is reset.

Instead:

### Preferred: HttpOnly Session Cookie

Server:

```text
POST /login
↓
Set-Cookie: session=abc123
```

Browser automatically stores it.

Then on page load:

```text
GET /me
Cookie: session=abc123
```

Server replies:

```json
{
  "id": 1,
  "email": "test@example.com"
}
```

AuthProvider restores the user.

---

## AuthProvider Startup Check

```jsx
useEffect(() => {
  async function loadUser() {
    try {
      const res = await fetch("/api/me", {
        credentials: "include",
      });

      if (res.ok) {
        const user = await res.json();
        setUser(user);
      }
    } finally {
      setLoading(false);
    }
  }

  loadUser();
}, []);
```

---

## ProtectedRoute

```jsx
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}
```

---

## Navbar Logic

Logged out:

```text
Home
Sign In
Sign Up
```

Logged in:

```text
Home
App
Profile
Logout
```

Example:

```jsx
const { user, logout } = useAuth();

return (
  <nav>
    {!user ? (
      <>
        <Link to="/signin">Sign In</Link>
        <Link to="/signup">Sign Up</Link>
      </>
    ) : (
      <>
        <Link to="/app">App</Link>

        <button onClick={logout}>
          Logout
        </button>
      </>
    )}
  </nav>
);
```

---

## Backend Endpoints

Typically:

```text
POST /api/signup
POST /api/login
POST /api/logout
GET  /api/me
```

`/api/me` is what restores the user's session after refresh.

---

### State Diagram

```text
Unauthenticated
      │
      ├── Sign Up
      │
      └── Sign In
             │
             ▼
      Authenticated
             │
             ├── /app
             ├── /profile
             ├── /settings
             │
             └── Logout
                     │
                     ▼
             Unauthenticated
```

For a React + Express application in 2026, a session cookie (HttpOnly, Secure, SameSite) plus an `/api/me` endpoint is usually cleaner and safer than storing JWTs in localStorage.
