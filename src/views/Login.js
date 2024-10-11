import React, { useState } from 'react';
import { auth } from '../services/firebase'; // Asegúrate de que tienes configurado Firebase aquí
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // Importar estilos

const Login = () => {
  const [email, setEmail] = useState(''); // Estado para el email
  const [password, setPassword] = useState(''); // Estado para la contraseña
  const [error, setError] = useState(''); // Estado para manejar errores
  const navigate = useNavigate(); // Para redirigir después del inicio de sesión

  const handleLogin = async (e) => {
    e.preventDefault(); // Evitar el envío del formulario

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); // Redirigir al dashboard después del inicio de sesión
    } catch (err) {
      setError('Error al iniciar sesión: ' + err.message); // Mostrar el mensaje de error
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mostrar mensaje de error si existe */}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;


