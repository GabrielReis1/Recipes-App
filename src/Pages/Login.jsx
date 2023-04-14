import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './login.css';
import logo from '../images/logo.png';

// requisitos da página de login feitos por todo o grupo em conjunto

function Login() {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [isDisabled, setIsDisabled] = useState(true);
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();

    localStorage.setItem('user', JSON.stringify({ email: user.email }));
    history.push('/meals');
  };

  const handleValidation = () => {
    const { email, password } = user;
    const emailValidation = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email);
    const minLength = 6;
    const passwordValidation = password.length < minLength;

    setIsDisabled(!emailValidation || passwordValidation);
  };

  return (
    <section className="login-page">
      <img className="logoImg" src={ logo } alt="Logo MiniCheff" />
      <form onSubmit={ (e) => handleSubmit(e) } className="login-form">
        <h3>Login</h3>
        <label htmlFor="email-input">
          <input
            type="email"
            value={ user.email }
            id="email-input"
            className="text-input"
            placeholder="E-mail"
            onChange={ ({ target: { value } }) => {
              setUser({ ...user, email: value });
              handleValidation();
            } }
            data-testid="email-input"
          />
        </label>
        <label htmlFor="password-input">
          <input
            type="password"
            value={ user.password }
            id="password-input"
            className="text-input"
            placeholder="Password"
            onChange={ ({ target: { value } }) => {
              setUser({ ...user, password: value });
              handleValidation();
            } }
            data-testid="password-input"
          />
        </label>
        <button
          type="submit"
          data-testid="login-submit-btn"
          disabled={ isDisabled }
          className="btn-1"
        >
          Entrar
        </button>
      </form>
    </section>
  );
}

export default Login;
