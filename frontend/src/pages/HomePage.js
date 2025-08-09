import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Brain, FileText, Shield, Users } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Abstract background */}
      <div className="abstract-bg"></div>
      <div className="molecular-pattern"></div>
      
      {/* Navigation */}
      <nav className="nav-header">
        <div className="logo">MEDANALYZER</div>
        <div className="nav-menu">
          <Link to="/" className="nav-link">Главная</Link>
          <Link to="/auth" className="btn btn-secondary">Войти</Link>
          <Link to="/analysis" className="btn btn-primary">Анализ</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content animate-fadeInUp">
          <div className="text-sm font-medium text-gray-600 mb-4">
            ЦЕЛЬ MEDANALYZER
          </div>
          <h1 className="hero-title">
            Детальная диагностика
            <br />
            вашего организма
          </h1>
          <p className="hero-subtitle">
            Здоровье — это самое важное. Поэтому не откладывайте на потом.
            <br />
            Подумайте о своем будущем уже сегодня.
          </p>
          <div className="hero-cta">
            <Link to="/analysis" className="btn btn-primary btn-lg">
              Сделать анализ
              <ChevronRight size={20} />
            </Link>
            <Link to="#features" className="btn btn-secondary btn-lg">
              Узнать больше
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Возможности ИИ-анализа</h2>
            <p className="text-xl text-gray-600">
              Передовые технологии для точной диагностики
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card text-center">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Brain className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">ИИ-анализ</h3>
              <p className="text-gray-600 text-sm">
                Точная интерпретация медицинских данных с помощью искусственного интеллекта
              </p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4 mx-auto">
                <FileText className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Все типы анализов</h3>
              <p className="text-gray-600 text-sm">
                Поддержка лабораторных анализов, медицинских снимков и исследований
              </p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Shield className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Безопасность</h3>
              <p className="text-gray-600 text-sm">
                Защищенное хранение медицинских данных с соблюдением конфиденциальности
              </p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Users className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Личный кабинет</h3>
              <p className="text-gray-600 text-sm">
                Мониторинг показателей здоровья и история всех анализов
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-8 bg-gray-50 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-black mb-2">10,000+</div>
              <div className="text-gray-600">Проанализированных образцов</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-black mb-2">98%</div>
              <div className="text-gray-600">Точность диагностики</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-black mb-2">24/7</div>
              <div className="text-gray-600">Доступность сервиса</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8 relative">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Начните заботиться о здоровье прямо сейчас
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Загрузите результаты анализов и получите детальную расшифровку
            от искусственного интеллекта за несколько минут
          </p>
          <Link to="/analysis" className="btn btn-primary btn-lg">
            Загрузить анализы
            <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-bold mb-4">MEDANALYZER</div>
              <p className="text-gray-400 text-sm">
                Искусственный интеллект для медицинской диагностики
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Услуги</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Анализ крови</li>
                <li>Рентген-диагностика</li>
                <li>Лабораторные исследования</li>
                <li>Персональные рекомендации</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Компания</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>О нас</li>
                <li>Команда</li>
                <li>Карьера</li>
                <li>Новости</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Поддержка</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Центр поддержки</li>
                <li>Конфиденциальность</li>
                <li>Условия использования</li>
                <li>Контакты</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2025 MedAnalyzer. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;