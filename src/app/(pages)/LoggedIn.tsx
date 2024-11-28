export default function LoggedIn({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Welcome Back!</h1>
      <button
        onClick={onLogout}
        className="px-4 py-2 bg-red-600 text-white rounded-md"
      >
        Logout
      </button>
    </div>
  );
}