import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Crown,
  LogOut,
  User as UserIcon,
  Sparkles
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { AdminPanelModal } from './AdminPanelModal';
import { Place } from '../../types/place';
import { adminService } from '../../services/adminService';

interface AdminSecurityGatekeeperProps {
  allPlaces: Place[];
  onPlacesUpdated: () => void;
  onExitAdmin?: () => void;
}

const ADMIN_CREDENTIALS_KEY = 'jampa_admin_master_credentials';
const ADMIN_SESSION_KEY = 'jampa_admin_authenticated_session';

// Credenciais Padrão do Administrador
const DEFAULT_CREDENTIALS = {
  username: 'admin@jampaexperience.com.br',
  password: 'Jampa@Admin2026!'
};

export const AdminSecurityGatekeeper: React.FC<AdminSecurityGatekeeperProps> = ({
  allPlaces,
  onPlacesUpdated,
  onExitAdmin
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const session = localStorage.getItem(ADMIN_SESSION_KEY) || sessionStorage.getItem(ADMIN_SESSION_KEY);
    return session === 'valid_admin_token';
  });

  // Form states
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);

  // Recupera ou inicializa as credenciais do admin
  const getStoredCredentials = () => {
    const data = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
    if (!data) {
      localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(DEFAULT_CREDENTIALS));
      return DEFAULT_CREDENTIALS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_CREDENTIALS;
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (isLockedOut) {
      setErrorMessage('Muitas tentativas incorretas. Aguarde 30 segundos.');
      return;
    }

    const creds = getStoredCredentials();
    const inputUser = usernameInput.trim().toLowerCase();
    const targetUser = creds.username.toLowerCase();
    const targetUserShort = 'admin'; // Atalho conveniente

    const isUserValid = inputUser === targetUser || inputUser === targetUserShort;
    const isPassValid = passwordInput.trim() === creds.password;

    if (isUserValid && isPassValid) {
      localStorage.setItem(ADMIN_SESSION_KEY, 'valid_admin_token');
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'valid_admin_token');
      setIsAuthenticated(true);
      setUsernameInput('');
      setPasswordInput('');
      setFailedAttempts(0);

      // Registra em log de auditoria
      adminService.addLog({
        type: 'user_granted',
        title: 'Login de Administrador Efetuado',
        details: `Sessão iniciada pelo usuário ${creds.username}.`
      });
    } else {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);

      if (nextAttempts >= 4) {
        setIsLockedOut(true);
        setErrorMessage('Acesso temporariamente bloqueado por segurança (30s).');
        setTimeout(() => {
          setIsLockedOut(false);
          setFailedAttempts(0);
          setErrorMessage(null);
        }, 30000);
      } else {
        setErrorMessage(`Usuário ou senha incorretos. (${4 - nextAttempts} tentativas restantes)`);
      }
    }
  };

  // Fecha a visualização do admin e volta para o site
  const handleCloseAdmin = () => {
    if (onExitAdmin) {
      onExitAdmin();
    } else {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  // Encerra explicitamente a sessão do admin e faz logout
  const handleLogoutAdmin = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
    setErrorMessage(null);

    if (onExitAdmin) {
      onExitAdmin();
    } else {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <>
      {/* SE ESTIVER AUTENTICADO: RENDERIZA O PAINEL COMPLETO DO GESTOR (STANDALONE 100% RESPONSIVO) */}
      {isAuthenticated ? (
        <AdminPanelModal
          isOpen={true}
          isStandalone={true}
          onClose={handleCloseAdmin}
          onLogout={handleLogoutAdmin}
          allPlaces={allPlaces}
          onPlacesUpdated={onPlacesUpdated}
        />
      ) : (
        /* SE NÃO ESTIVER AUTENTICADO: TELA DE LOGIN & SENHA DE SEGURANÇA 100% RESPONSIVA */
        <div className="admin-gate-login-wrapper">
          <div className="admin-gate-login-box glass-panel">
            <div className="security-shield-icon">
              <Lock size={32} color="#F4A261" />
            </div>

            <Badge variant="gold" icon={<ShieldCheck size={14} />}>
              ACESSO RESTRITO • CMS DO GESTOR
            </Badge>

            <div className="security-title-group">
              <h1 className="security-brand">JAMPA EXPERIENCE</h1>
              <p className="security-subtitle">Painel de Gestão & Administração</p>
            </div>

            <p className="security-desc">
              Área restrita aos administradores. Insira suas credenciais de segurança para gerenciar catálogo, fotos, parceiros e métricas.
            </p>

            <form className="security-form" onSubmit={handleLoginSubmit}>
              {/* Campo de Usuário / E-mail */}
              <div className="security-field">
                <label className="security-field-label">Usuário ou E-mail:</label>
                <div className="security-input-group">
                  <UserIcon size={18} className="input-key-icon" />
                  <input
                    type="text"
                    placeholder="admin ou admin@jampaexperience.com.br"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    disabled={isLockedOut}
                    autoFocus
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Campo de Senha */}
              <div className="security-field">
                <label className="security-field-label">Senha de Acesso:</label>
                <div className="security-input-group">
                  <KeyRound size={18} className="input-key-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha secreta..."
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    disabled={isLockedOut}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="toggle-pass-visibility-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Mostrar ou ocultar senha"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="security-error-banner">
                  <AlertTriangle size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="gold"
                size="lg"
                iconRight={<ArrowRight size={18} />}
                className="w-full security-submit-btn"
                disabled={isLockedOut || !usernameInput.trim() || !passwordInput.trim()}
              >
                {isLockedOut ? 'Bloqueado Temporariamente (30s)' : 'ENTRAR NO PAINEL'}
              </Button>
            </form>

            <button className="security-back-btn" onClick={handleCloseAdmin} type="button">
              <ArrowLeft size={16} />
              <span>Voltar ao Site Público</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        /* LOGIN STANDALONE CONTAINER */
        .admin-gate-login-wrapper {
          min-height: 100vh;
          width: 100%;
          background: radial-gradient(circle at 50% 20%, rgba(0, 180, 216, 0.08) 0%, transparent 60%), #050B12;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          box-sizing: border-box;
          animation: adminGateFadeIn 0.3s ease-out;
        }

        .admin-gate-login-box {
          width: 100%;
          max-width: 440px;
          background: rgba(11, 19, 30, 0.95);
          border: 1px solid rgba(244, 162, 97, 0.35);
          border-radius: var(--radius-xl);
          padding: 2.25rem 1.75rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 50px rgba(244, 162, 97, 0.15);
          animation: adminGateScaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
        }

        .security-shield-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(244, 162, 97, 0.12);
          border: 1px solid rgba(244, 162, 97, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 25px rgba(244, 162, 97, 0.2);
        }

        .security-title-group {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .security-brand {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 900;
          color: #F8FAFC;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .security-subtitle {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #F4A261;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .security-desc {
          font-size: 0.8125rem;
          color: #94A3B8;
          line-height: 1.5;
          margin: 0;
        }

        .security-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-top: 0.35rem;
        }

        .security-field {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          text-align: left;
        }

        .security-field-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #CBD5E1;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .security-input-group {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
        }

        .input-key-icon {
          position: absolute;
          left: 0.9rem;
          color: #F4A261;
          pointer-events: none;
        }

        .security-input-group input {
          width: 100%;
          min-height: 48px;
          padding: 0.75rem 2.75rem 0.75rem 2.6rem;
          background: rgba(6, 11, 17, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: var(--radius-md);
          color: #F8FAFC;
          font-family: var(--font-body);
          font-size: 16px; /* 16px evita zoom automático no iOS */
          outline: none;
          transition: all var(--transition-fast);
          box-sizing: border-box;
        }

        .security-input-group input:focus {
          border-color: #F4A261;
          box-shadow: 0 0 15px rgba(244, 162, 97, 0.3);
          background: rgba(8, 14, 22, 1);
        }

        .toggle-pass-visibility-btn {
          position: absolute;
          right: 0.75rem;
          background: none;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          min-width: 44px;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color var(--transition-fast);
        }

        .toggle-pass-visibility-btn:hover {
          color: #F4A261;
        }

        .security-error-banner {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: rgba(231, 111, 81, 0.15);
          border: 1px solid rgba(231, 111, 81, 0.4);
          border-radius: var(--radius-md);
          color: #F87171;
          font-size: 0.8125rem;
          font-weight: 600;
          text-align: left;
        }

        .security-submit-btn {
          min-height: 48px;
          font-size: 0.9375rem;
          font-weight: 800;
          box-shadow: 0 0 25px rgba(244, 162, 97, 0.35);
        }

        .security-back-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          background: none;
          border: none;
          color: #94A3B8;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          min-height: 44px;
          padding: 0.5rem 1rem;
          transition: color var(--transition-fast);
        }

        .security-back-btn:hover {
          color: #00B4D8;
        }

        @keyframes adminGateFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes adminGateScaleUp {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @media (max-width: 480px) {
          .admin-gate-login-wrapper {
            padding: 0.75rem;
          }
          .admin-gate-login-box {
            padding: 1.75rem 1.25rem;
          }
          .security-brand {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </>
  );
};
