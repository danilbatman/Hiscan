import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login
        const response = await axios.post(`${API_BASE_URL}/api/login`, {
          email: formData.email,
          password: formData.password
        });
        
        if (response.data.user) {
          onLogin(response.data.user);
        }
      } else {
        // Register
        await axios.post(`${API_BASE_URL}/api/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          age: formData.age ? parseInt(formData.age) : null,
          gender: formData.gender
        });
        
        // Auto login after registration
        const loginResponse = await axios.post(`${API_BASE_URL}/api/login`, {
          email: formData.email,
          password: formData.password
        });
        
        if (loginResponse.data.user) {
          onLogin(loginResponse.data.user);
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || 
        'Произошла ошибка. Пожалуйста, попробуйте еще раз.'
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="abstract-bg"></div>
      <div className="molecular-pattern"></div>
      
      {/* Back to home */}
      <div className="absolute top-6 left-6 z-10">
        <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
          <ArrowLeft size={20} />
          На главную
        </Link>
      </div>

      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="card">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">
                {isLogin ? 'Вход в аккаунт' : 'Регистрация'}
              </h1>
              <p className="text-gray-600">
                {isLogin 
                  ? 'Войдите в свой личный кабинет' 
                  : 'Создайте аккаунт для анализа медицинских данных'
                }
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Имя</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleInputChange}
                    required={!isLogin}
                    placeholder="Введите ваше имя"
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="example@mail.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Пароль</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="form-input pr-12"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Введите пароль"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Возраст</label>
                      <input
                        type="number"
                        name="age"
                        className="form-input"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="Возраст"
                        min="1"
                        max="120"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Пол</label>
                      <select
                        name="gender"
                        className="form-input"
                        value={formData.gender}
                        onChange={handleInputChange}
                      >
                        <option value="">Выберите</option>
                        <option value="male">Мужской</option>
                        <option value="female">Женский</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  isLogin ? 'Войти' : 'Создать аккаунт'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                className="text-gray-600 hover:text-black transition-colors"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({
                    name: '',
                    email: '',
                    password: '',
                    age: '',
                    gender: ''
                  });
                }}
              >
                {isLogin 
                  ? 'Нет аккаунта? Зарегистрироваться' 
                  : 'Уже есть аккаунт? Войти'
                }
              </button>
            </div>

            {isLogin && (
              <div className="mt-4 text-center">
                <button className="text-sm text-gray-500 hover:text-black transition-colors">
                  Забыли пароль?
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;