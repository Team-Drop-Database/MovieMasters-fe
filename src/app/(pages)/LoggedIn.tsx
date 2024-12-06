interface LoggedInProps {
  onLogout: () => void;
  userDetails?: { username: string; userId: number };
}

export default function LoggedIn({ onLogout, userDetails }: LoggedInProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-5">
      <h1 className="text-3xl font-semibold">
        Welcome Back, {userDetails?.username || "User"}!
      </h1>
      <button
        onClick={onLogout}
        className="px-6 py-2 mt-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300"
      >
        Logout
      </button>
    </div>
  );
}
