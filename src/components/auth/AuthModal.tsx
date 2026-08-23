import React, { useState } from 'react';
import {
  LogIn,
  UserPlus,
  KeyRound,
  Mail,
  Lock,
  User as UserIcon,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { authService } from '../../services/authService';
import { User } from '../../types/user';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  initialTab?: 'login' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialTab = 'login'
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>(initialTab);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterPasswordConfirm, setShowRegisterPasswordConfirm] = useState(false);

  const resetForm = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSwitchTab = (newTab: 'login' | 'register' | 'forgot') => {
    resetForm();
    setTab(newTab);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const user = await authService.login({ email, password });
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao efetuar login.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const user = await authService.register({
        name,
        email,
        password,
        passwordConfirmation
      });
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const msg = await authService.requestPasswordReset(email);
      setSuccessMessage(msg);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao solicitar recuperação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="520px"
      title={
        <div className="auth-header-title">
          <ShieldCheck size={20} color="#00B4D8" />
          <span>
            {tab === 'login' && 'Acessar JAMPA EXPERIENCE'}
            {tab === 'register' && 'Criar Nova Conta'}
            {tab === 'forgot' && 'Recuperação de Senha'}
          </span>
        </div>
      }
    >
      <div className="auth-modal-content">
        {/* Abas de Navegação */}
        <div className="auth-tabs-row">
          <button
            className={`auth-tab-btn ${tab === 'login' ? 'active' : ''}`}
            onClick={() => handleSwitchTab('login')}
          >
            <LogIn size={16} /> Entrar
          </button>
          <button
            className={`auth-tab-btn ${tab === 'register' ? 'active' : ''}`}
            onClick={() => handleSwitchTab('register')}
          >
            <UserPlus size={16} /> Criar Conta
          </button>
        </div>

        {/* Feedback de Erro ou Sucesso */}
        {errorMessage && (
          <div className="auth-alert error glass-panel">
            <AlertCircle size={18} color="#EF4444" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="auth-alert success glass-panel">
            <CheckCircle2 size={18} color="#10B981" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* TAB 1: LOGIN */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label className="form-label">E-mail</label>
              <div className="input-icon-wrap">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input with-icon"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label">Senha</label>
                <button
                  type="button"
                  className="forgot-link"
                  onClick={() => handleSwitchTab('forgot')}
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="input-icon-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input with-icon with-eye"
                />
                <button
                  type="button"
                  className="pass-toggle-eye-btn"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  aria-label={showLoginPassword ? 'Ocultar senha' : 'Ver senha'}
                  title={showLoginPassword ? 'Ocultar senha' : 'Ver senha'}
                >
                  {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              fullWidth
              isLoading={loading}
              iconLeft={<LogIn size={18} />}
            >
              ENTRAR NO JAMPA EXPERIENCE
            </Button>

            <div className="switch-auth-mode">
              <span>Ainda não possui conta?</span>
              <button
                type="button"
                className="switch-link"
                onClick={() => handleSwitchTab('register')}
              >
                Cadastre-se
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: CADASTRO */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label className="form-label">Nome Completo</label>
              <div className="input-icon-wrap">
                <UserIcon size={18} className="input-icon" />
                <input
                  type="text"
                  required
                  placeholder="Ex: João Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input with-icon"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">E-mail</label>
              <div className="input-icon-wrap">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input with-icon"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Senha (mínimo 6 caracteres)</label>
              <div className="input-icon-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  type={showRegisterPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input with-icon with-eye"
                />
                <button
                  type="button"
                  className="pass-toggle-eye-btn"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  aria-label={showRegisterPassword ? 'Ocultar senha' : 'Ver senha'}
                  title={showRegisterPassword ? 'Ocultar senha' : 'Ver senha'}
                >
                  {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirmar Senha</label>
              <div className="input-icon-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  type={showRegisterPasswordConfirm ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="form-input with-icon with-eye"
                />
                <button
                  type="button"
                  className="pass-toggle-eye-btn"
                  onClick={() => setShowRegisterPasswordConfirm(!showRegisterPasswordConfirm)}
                  aria-label={showRegisterPasswordConfirm ? 'Ocultar confirmação de senha' : 'Ver confirmação de senha'}
                  title={showRegisterPasswordConfirm ? 'Ocultar confirmação de senha' : 'Ver confirmação de senha'}
                >
                  {showRegisterPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={loading}
              iconLeft={<UserPlus size={18} />}
            >
              CRIAR MINHA CONTA
            </Button>

            <div className="switch-auth-mode">
              <span>Já possui uma conta?</span>
              <button
                type="button"
                className="switch-link"
                onClick={() => handleSwitchTab('login')}
              >
                Fazer login
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: RECUPERAR SENHA */}
        {tab === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="auth-form">
            <p className="forgot-instruction">
              Digite o e-mail associado à sua conta para receber as instruções de redefinição de senha.
            </p>

            <div className="form-group">
              <label className="form-label">E-mail Cadastrado</label>
              <div className="input-icon-wrap">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input with-icon"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              fullWidth
              isLoading={loading}
              iconLeft={<KeyRound size={18} />}
            >
              ENVIAR LINK DE RECUPERAÇÃO
            </Button>

            <div className="switch-auth-mode">
              <button
                type="button"
                className="switch-link"
                onClick={() => handleSwitchTab('login')}
              >
                ← Voltar para o Login
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .auth-header-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          color: #F8FAFC;
        }

        .auth-modal-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .auth-tabs-row {
          display: flex;
          background: rgba(255, 255, 255, 0.04);
          border-radius: var(--radius-md);
          padding: 4px;
          border: 1px solid var(--border-subtle);
        }

        .auth-tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.6rem 1rem;
          font-family: var(--font-display);
          font-size: 0.875rem;
          font-weight: 700;
          color: #94A3B8;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
          cursor: pointer;
        }

        .auth-tab-btn.active {
          background: rgba(0, 180, 216, 0.2);
          color: #F8FAFC;
          border: 1px solid #00B4D8;
        }

        .auth-alert {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          border-radius: var(--radius-md);
        }

        .auth-alert.error {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.35);
          color: #FCA5A5;
        }

        .auth-alert.success {
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #6EE7B7;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }


        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .form-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .form-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #94A3B8;
        }

        .forgot-link {
          font-size: 0.75rem;
          color: #00B4D8;
          font-weight: 600;
          cursor: pointer;
        }

        .input-icon-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          color: #64748B;
          pointer-events: none;
        }

        .form-input.with-icon {
          padding-left: 2.75rem;
          width: 100%;
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
          padding-right: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: #F8FAFC;
          font-size: 0.9375rem;
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .form-input.with-icon:focus {
          border-color: #00B4D8;
          box-shadow: 0 0 15px rgba(0, 180, 216, 0.2);
        }

        .form-input.with-icon.with-eye {
          padding-right: 2.85rem;
        }

        .pass-toggle-eye-btn {
          position: absolute;
          right: 0.85rem;
          background: transparent;
          border: none;
          color: #94A3B8;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem;
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: color var(--transition-fast), transform var(--transition-fast);
          z-index: 2;
        }

        .pass-toggle-eye-btn:hover {
          color: #00B4D8;
          transform: scale(1.1);
        }

        .pass-toggle-eye-btn:active {
          transform: scale(0.95);
        }

        .switch-auth-mode {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          font-size: 0.8125rem;
          color: #94A3B8;
          margin-top: 0.5rem;
        }

        .switch-link {
          color: #38BDF8;
          font-weight: 700;
          cursor: pointer;
        }

        .forgot-instruction {
          font-size: 0.875rem;
          color: #CBD5E1;
          line-height: 1.5;
        }
      `}</style>
    </Modal>
  );
};
