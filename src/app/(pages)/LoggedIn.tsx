interface LoggedInProps {
  onLogout: () => void;
  userDetails?: Record<string, any>;
}

export default function LoggedIn({onLogout, userDetails}: LoggedInProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1>Welcome Back, {userDetails?.username || "User"}!</h1>
      <div className="user-details">
        <h2>Your Details:</h2>
        {userDetails ? (
          <ul className="text-left">
            {Object.entries(userDetails).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {Array.isArray(value) ? value.join(", ") : value?.toString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No details available.</p>
        )}
      </div>
      <button onClick={onLogout} className="px-4 py-2 bg-red-600 text-white rounded-md">
        Logout
      </button>
    </div>
  );
}