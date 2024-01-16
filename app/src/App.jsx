import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { user, isAuthenticated, logout, loginWithPopup } = useAuth0();

  if (isAuthenticated) {
    console.log(user);
  }

  return (
    <div className="app">
      {!isAuthenticated ? (
        <button onClick={() => loginWithPopup()}>Log In With Auth0</button>
      ) : (
        <div className="auth">
          {
            <a
              href={`http://13.213.65.152:3001/api/v1/user/${user.sub}`}
              target="_blank"
              rel="noreferrer"
            >
              User: {user.sub}
            </a>
          }
          <button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
