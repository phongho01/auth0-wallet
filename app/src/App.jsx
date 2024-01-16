import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { user, isAuthenticated, logout, loginWithRedirect } = useAuth0();

  if (isAuthenticated) {
    console.log(user);
  }

  return (
    <div>
      <button onClick={() => loginWithRedirect()}>Log In</button>
      <button
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
      >
        Log Out
      </button>
    </div>
  );
}

export default App;
