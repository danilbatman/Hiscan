import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  User, 
  BarChart3, 
  FileText, 
  Calendar, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Heart,
  Activity,
  Weight,
  Shield
} from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const DashboardPage = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/user/${user.user_id}/dashboard`);
        setDashboardData(response.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
      setLoading(false);
    };

    fetchDashboard();
  }, [user.user_id]);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving':
      case 'increasing':
        return <TrendingUp size={16} className="text-green-500" />;
      case 'decreasing':
        return <TrendingDown size={16} className="text-red-500" />;
      default:
        return <Minus size={16} className="text-gray-500" />;
    }
  };

  const sidebarItems = [
    { id: 'overview', icon: BarChart3, label: 'Обзор', active: true },
    { id: 'analytics', icon: Brain, label: 'Аналитика' },
    { id: 'history', icon: FileText, label: 'История' },
    { id: 'appointments', icon: Calendar, label: 'Встречи' },
    { id: 'messages', icon: MessageSquare, label: 'Сообщения', badge: '2' },
    { id: 'settings', icon: Settings, label: 'Настройки' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка дашборда...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <div className="abstract-bg opacity-30"></div>
      
      <div className="dashboard">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="logo text-xl font-bold mb-8">MEDANALYZER</div>
          
          <div className="mb-8">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <User className="text-white" size={20} />
              </div>
              <div>
                <div className="font-medium">{dashboardData?.user.name}</div>
                <div className="text-sm text-gray-500">
                  {dashboardData?.user.subscription_plan === 'premium' ? 'Premium' : 'Базовый'}
                </div>
              </div>
            </div>
          </div>

          <nav className="sidebar-nav">
            {sidebarItems.map((item) => (
              <li key={item.id} className="sidebar-item">
                <button
                  className={`sidebar-link w-full ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon size={20} />
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </nav>

          {/* Connected Profiles */}
          <div className="mt-8">
            <div className="text-sm font-medium text-gray-700 mb-3">Связанные профили</div>
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white"></div>
              <button className="w-8 h-8 bg-black text-white rounded-full border-2 border-white flex items-center justify-center text-xs">
                <Plus size={14} />
              </button>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="sidebar-link w-full mt-auto text-red-600 hover:bg-red-50"
          >
            <LogOut size={20} />
            Выйти
          </button>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {activeTab === 'overview' && (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold">Добро пожаловать, {dashboardData?.user.name}!</h1>
                  <p className="text-gray-600">
                    Сегодня {new Date().toLocaleDateString('ru-RU', { 
                      day: 'numeric', 
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <Link to="/analysis" className="btn btn-primary">
                  <Brain size={16} />
                  Новый анализ
                </Link>
              </div>

              {/* Stats Cards */}
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="flex items-center justify-between mb-2">
                    <div className="metric-value">{dashboardData?.stats.total_analyses || 0}</div>
                    <FileText size={24} className="text-gray-400" />
                  </div>
                  <div className="metric-label">Анализов выполнено</div>
                </div>
                
                <div className="metric-card">
                  <div className="flex items-center justify-between mb-2">
                    <div className="metric-value">{dashboardData?.stats.active_treatments || 0}</div>
                    <Activity size={24} className="text-gray-400" />
                  </div>
                  <div className="metric-label">Активные лечения</div>
                </div>
                
                <div className="metric-card">
                  <div className="flex items-center justify-between mb-2">
                    <div className="metric-value">{dashboardData?.stats.upcoming_appointments || 0}</div>
                    <Calendar size={24} className="text-gray-400" />
                  </div>
                  <div className="metric-label">Предстоящие встречи</div>
                </div>
              </div>

              {/* Health Metrics */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="card">
                  <h2 className="text-lg font-semibold mb-4">Основные показатели</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <Heart size={20} className="text-red-500" />
                        </div>
                        <div>
                          <div className="font-medium">Пульс</div>
                          <div className="text-sm text-gray-500">
                            {dashboardData?.health_metrics.heart_rate.value} уд/мин
                          </div>
                        </div>
                      </div>
                      <div className="metric-trend">
                        {getTrendIcon(dashboardData?.health_metrics.heart_rate.trend)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Activity size={20} className="text-blue-500" />
                        </div>
                        <div>
                          <div className="font-medium">Давление</div>
                          <div className="text-sm text-gray-500">
                            {dashboardData?.health_metrics.blood_pressure.value} мм рт.ст
                          </div>
                        </div>
                      </div>
                      <div className="metric-trend">
                        {getTrendIcon(dashboardData?.health_metrics.blood_pressure.trend)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Weight size={20} className="text-green-500" />
                        </div>
                        <div>
                          <div className="font-medium">Вес</div>
                          <div className="text-sm text-gray-500">
                            {dashboardData?.health_metrics.weight.value} кг
                          </div>
                        </div>
                      </div>
                      <div className="metric-trend">
                        {getTrendIcon(dashboardData?.health_metrics.weight.trend)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <Shield size={20} className="text-orange-500" />
                        </div>
                        <div>
                          <div className="font-medium">Риск заболеваний</div>
                          <div className="text-sm text-gray-500">
                            {dashboardData?.health_metrics.risk_score.value}% - низкий
                          </div>
                        </div>
                      </div>
                      <div className="metric-trend">
                        {getTrendIcon(dashboardData?.health_metrics.risk_score.trend)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h2 className="text-lg font-semibold mb-4">Последние анализы</h2>
                  
                  {dashboardData?.recent_analyses?.length > 0 ? (
                    <div className="space-y-3">
                      {dashboardData.recent_analyses.map((analysis) => (
                        <div key={analysis.analysis_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{analysis.analysis_type}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(analysis.created_at).toLocaleDateString('ru-RU')}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">ИИ: {analysis.ai_confidence}%</div>
                            <Link 
                              to={`/results/${analysis.analysis_id}`}
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Посмотреть
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText size={48} className="mx-auto mb-4 opacity-50" />
                      <p>Пока нет анализов</p>
                      <Link to="/analysis" className="btn btn-primary mt-4">
                        Сделать первый анализ
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'analytics' && (
            <div className="text-center py-20">
              <Brain size={64} className="mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">ИИ Аналитика</h2>
              <p className="text-gray-600 mb-4">Расширенная аналитика будет доступна в следующих версиях</p>
              <Link to="/analysis" className="btn btn-primary">
                Сделать анализ
              </Link>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="text-center py-20">
              <FileText size={64} className="mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">История анализов</h2>
              <p className="text-gray-600 mb-4">Полная история анализов будет доступна в следующих версиях</p>
            </div>
          )}

          {['appointments', 'messages', 'settings'].includes(activeTab) && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🚧</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">В разработке</h2>
              <p className="text-gray-600">Этот раздел будет доступен в ближайшее время</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;