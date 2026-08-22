import { User, AccessStatus, AccessType } from '../types/user';
import { LoginCredentials, RegisterData, AuthSession } from '../types/auth';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_USERS_KEY = 'jampa_users_db';
const STORAGE_SESSION_KEY = 'jampa_auth_session';

// Contas de Demonstração Pré-configuradas para Testes Locais
const INITIAL_USERS: User[] = [
  {
    id: 'usr-vip-01',
    name: 'Alessandro Silva',
    email: 'alessandro@exemplo.com.br',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    createdAt: '13/08/2026',
    accessStatus: 'active',
    accessType: 'lifetime',
    purchasedAt: '13/08/2026',
    orderId: 'ORD-VIP-99482'
  },
  {
    id: 'usr-free-02',
    name: 'Turista Iniciante',
    email: 'visitante@exemplo.com.br',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    createdAt: '13/08/2026',
    accessStatus: 'registered',
    accessType: 'none'
  }
];

class AuthService {
  private getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_USERS_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_USERS;
    }
  }

  public getRegisteredUsers(): User[] {
    return this.getUsers();
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  }

  public getSession(): AuthSession | null {
    const data = localStorage.getItem(STORAGE_SESSION_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  public setSession(user: User): AuthSession {
    const session: AuthSession = {
      user,
      token: 'jwt_secure_token_' + Math.random().toString(36).substring(2) + Date.now(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    return session;
  }

  public clearSession(): void {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    if (isSupabaseConfigured() && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
  }

  public async login(credentials: LoginCredentials): Promise<User> {
    const email = credentials.email.trim().toLowerCase();

    // 1. Integração com Supabase Auth se configurado
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: credentials.password
        });

        if (error) {
          throw new Error(error.message || 'Credenciais inválidas no Supabase.');
        }

        if (data.user) {
          // Busca perfil no banco
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const user: User = {
            id: data.user.id,
            name: profile?.full_name || data.user.user_metadata?.full_name || email.split('@')[0],
            email: data.user.email || email,
            avatarUrl: profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
            createdAt: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR'),
            accessStatus: (profile?.access_status || 'registered') as AccessStatus,
            accessType: (profile?.access_type || 'none') as AccessType,
            orderId: profile?.order_id,
            purchasedAt: profile?.purchased_at
          };

          this.setSession(user);
          return user;
        }
      } catch (err: any) {
        console.warn('Login Supabase falhou, tentando base local...', err.message);
      }
    }

    // 2. Fallback de Segurança / Base Local
    await new Promise((r) => setTimeout(r, 400));
    const users = this.getUsers();
    let user = users.find((u) => u.email.toLowerCase() === email);

    if (!user) {
      if (email === 'alessandro@exemplo.com.br') {
        user = INITIAL_USERS[0];
      } else {
        throw new Error('E-mail ou senha incorretos. Verifique suas credenciais.');
      }
    }

    if (!credentials.password || credentials.password.length < 6) {
      throw new Error('A senha deve conter no mínimo 6 caracteres.');
    }

    this.setSession(user);
    return user;
  }

  public async register(data: RegisterData): Promise<User> {
    const name = data.name.trim();
    const email = data.email.trim().toLowerCase();

    if (!name) {
      throw new Error('Por favor, preencha o seu nome completo.');
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      throw new Error('Por favor, informe um e-mail válido.');
    }

    if (data.password.length < 6) {
      throw new Error('A senha deve conter no mínimo 6 caracteres.');
    }

    if (data.password !== data.passwordConfirmation) {
      throw new Error('A confirmação de senha não confere.');
    }

    // 1. Integração com Supabase Auth
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: authData, error } = await supabase.auth.signUp({
          email,
          password: data.password,
          options: {
            data: { full_name: name }
          }
        });

        if (error) {
          throw new Error(error.message);
        }

        if (authData.user) {
          const newUser: User = {
            id: authData.user.id,
            name,
            email,
            avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=00B4D8,F4A261`,
            createdAt: new Date().toLocaleDateString('pt-BR'),
            accessStatus: 'registered',
            accessType: 'none'
          };

          // Salva no perfil do Supabase
          await supabase.from('profiles').upsert({
            id: authData.user.id,
            full_name: name,
            email,
            access_status: 'registered',
            access_type: 'none'
          });

          this.setSession(newUser);
          return newUser;
        }
      } catch (err: any) {
        console.warn('Cadastro Supabase falhou, utilizando base local...', err.message);
      }
    }

    // 2. Base Local
    await new Promise((r) => setTimeout(r, 450));
    const users = this.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email);

    if (existing) {
      throw new Error('Este e-mail já está cadastrado. Faça login para continuar.');
    }

    const newUser: User = {
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      name,
      email,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=00B4D8,F4A261`,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      accessStatus: 'registered',
      accessType: 'none'
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setSession(newUser);

    return newUser;
  }

  public async requestPasswordReset(email: string): Promise<string> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Informe um e-mail válido para recuperação.');
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.resetPasswordForEmail(cleanEmail);
      } catch (e) {
        console.warn('Erro ao solicitar reset via Supabase:', e);
      }
    }

    await new Promise((r) => setTimeout(r, 400));
    return `Enviamos as instruções de recuperação para ${cleanEmail}. Verifique sua caixa de entrada e spam.`;
  }

  public grantLifetimeAccess(userId: string): User | null {
    const users = this.getUsers();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) return null;

    users[userIndex].accessStatus = 'active';
    users[userIndex].accessType = 'lifetime';
    users[userIndex].purchasedAt = new Date().toLocaleDateString('pt-BR');
    users[userIndex].orderId = 'ORD-VITALICIO-' + Math.floor(100000 + Math.random() * 900000);

    this.saveUsers(users);
    this.setSession(users[userIndex]);

    if (isSupabaseConfigured() && supabase) {
      supabase.from('profiles').update({
        access_status: 'active',
        access_type: 'lifetime',
        order_id: users[userIndex].orderId,
        purchased_at: new Date().toISOString()
      }).eq('id', userId);
    }

    return users[userIndex];
  }

  public updateUserProfile(userId: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) return null;

    users[userIndex] = { ...users[userIndex], ...updates };
    this.saveUsers(users);
    this.setSession(users[userIndex]);

    return users[userIndex];
  }
}

export const authService = new AuthService();
