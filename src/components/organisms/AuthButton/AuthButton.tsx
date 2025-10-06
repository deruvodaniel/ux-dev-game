import React from 'react';

import { Button } from '@/components/atoms/Button/Button';

import { useAuth } from '@/context/AuthContext';

import styles from './AuthButton.module.css';

export const AuthButton: React.FC = () => {
  const { user, signIn, signOut } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn();
    } catch (err) {
      console.error('Login failed', err);
      alert('Login failed — revisa la consola para más detalles');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (e) {
      console.error('logout error', e);
    }
  };

  return (
    <div className={styles.authWrapper} data-testid="auth-button-wrapper">
      {user ? (
        <>
          <img
            className={styles.avatar}
            src={user.photoURL ?? undefined}
            alt={user.displayName || 'avatar'}
            data-testid="user-avatar"
          />
          <Button
            onClick={handleLogout}
            ariaLabel="Cerrar sesión"
            variant="ghost"
            title="Cerrar sesión"
            data-testid="logout-button"
          >
            Cerrar
          </Button>
        </>
      ) : (
        <Button
          onClick={handleLogin}
          ariaLabel="Iniciar sesión"
          variant="primary"
          title="Iniciar sesión"
          data-testid="login-button"
        >
          Login
        </Button>
      )}
    </div>
  );
};
