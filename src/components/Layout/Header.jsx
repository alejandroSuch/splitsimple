import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ user, onLogout, showBackButton = false }) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          {showBackButton && (
            <button onClick={() => navigate('/dashboard')} className="btn-back">
              ← Volver
            </button>
          )}
          <h1 className="logo" onClick={() => navigate(user ? '/dashboard' : '/')}>
            💰 SplitSimple
          </h1>
        </div>

        {user && (
          <div className="header-right">
            <div className="user-info">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="user-avatar"
                />
              )}
              <span className="user-name">{user.displayName}</span>
            </div>
            <button onClick={onLogout} className="btn-logout">
              Salir
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
