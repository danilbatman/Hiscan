import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Download, Share, CheckCircle, AlertCircle, Brain, User, Calendar, FileText } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const ResultsPage = ({ user }) => {
  const { analysisId } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/analysis/${analysisId}`);
        setAnalysis(response.data);
      } catch (err) {
        setError('Не удалось загрузить результаты анализа');
      }
      setLoading(false);
    };

    if (analysisId) {
      fetchAnalysis();
    }
  }, [analysisId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'normal': return <CheckCircle size={16} className="text-green-600" />;
      case 'warning': return <AlertCircle size={16} className="text-yellow-600" />;
      case 'critical': return <AlertCircle size={16} className="text-red-600" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка результатов...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Ошибка загрузки</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/dashboard" className="btn btn-primary">
            Вернуться к дашборду
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="abstract-bg"></div>
      <div className="molecular-pattern"></div>
      
      {/* Navigation */}
      <nav className="nav-header">
        <div className="logo">MEDANALYZER</div>
        <div className="nav-menu">
          <Link to="/dashboard" className="nav-link">
            <ArrowLeft size={16} />
            К дашборду
          </Link>
          <Link to="/analysis" className="btn btn-primary">Новый анализ</Link>
        </div>
      </nav>

      <div className="results-container animate-fadeInUp">
        {/* Header */}
        <div className="results-header">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Результаты анализа</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User size={16} />
                  {analysis.patient_name}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  {new Date(analysis.created_at).toLocaleDateString('ru-RU')}
                </div>
                <div className="flex items-center gap-1">
                  <FileText size={16} />
                  {analysis.analysis_type}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="confidence-badge">
                <Brain size={16} />
                ИИ точность: {analysis.ai_confidence}%
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="btn btn-secondary">
              <Download size={16} />
              Скачать отчет
            </button>
            <button className="btn btn-secondary">
              <Share size={16} />
              Поделиться
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Общий вывод</h2>
          <p className="text-gray-700 leading-relaxed">
            {analysis.summary}
          </p>
        </div>

        {/* Indicators */}
        {analysis.indicators && (
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Показатели</h2>
            <div className="indicators-grid">
              {analysis.indicators.map((indicator, index) => (
                <div key={index} className="indicator-item">
                  <div>
                    <div className="indicator-name">{indicator.name}</div>
                    <div className="indicator-norm text-xs">
                      Норма: {indicator.norm}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`indicator-value ${getStatusColor(indicator.status)}`}>
                      {indicator.value}
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      {getStatusIcon(indicator.status)}
                      <span className={`text-xs ${getStatusColor(indicator.status)}`}>
                        {indicator.status === 'normal' ? 'Норма' : 
                         indicator.status === 'warning' ? 'Внимание' : 'Критично'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Findings (for medical imaging) */}
        {analysis.findings && (
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Результаты исследования</h2>
            <ul className="space-y-2">
              {analysis.findings.map((finding, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {analysis.recommendations && (
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Рекомендации</h2>
            <ul className="space-y-3">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Patient Info */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Информация о пациенте</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Имя:</span> {analysis.patient_name}
            </div>
            <div>
              <span className="font-medium">Возраст:</span> {analysis.patient_age} лет
            </div>
            <div>
              <span className="font-medium">Пол:</span> {analysis.patient_gender === 'male' ? 'Мужской' : 'Женский'}
            </div>
            <div>
              <span className="font-medium">Тип анализа:</span> {analysis.analysis_type}
            </div>
            {analysis.symptoms && (
              <div className="md:col-span-2">
                <span className="font-medium">Симптомы:</span> {analysis.symptoms}
              </div>
            )}
            {analysis.medications && (
              <div className="md:col-span-2">
                <span className="font-medium">Лекарства:</span> {analysis.medications}
              </div>
            )}
            {analysis.file_name && (
              <div className="md:col-span-2">
                <span className="font-medium">Загруженный файл:</span> {analysis.file_name}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-8">
          <Link to="/analysis" className="btn btn-primary">
            <Brain size={16} />
            Новый анализ
          </Link>
          <Link to="/dashboard" className="btn btn-secondary">
            К дашборду
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;