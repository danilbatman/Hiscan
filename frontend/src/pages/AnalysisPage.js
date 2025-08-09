import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, FileText, X, ArrowLeft, Brain } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const AnalysisPage = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  
  const [formData, setFormData] = useState({
    patient_name: user.name || '',
    patient_age: '',
    patient_gender: '',
    analysis_type: '',
    symptoms: '',
    medications: '',
    file: null
  });

  const analysisTypes = [
    'Общий анализ крови',
    'Биохимический анализ крови',
    'Общий анализ мочи',
    'Рентген грудной клетки',
    'Флюорография',
    'ЭКГ',
    'УЗИ',
    'МРТ',
    'КТ',
    'Другое'
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleFileSelect = (files) => {
    if (files && files[0]) {
      const file = files[0];
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Размер файла не должен превышать 10 МБ');
        return;
      }
      
      // Check file type
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'text/plain', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setError('Поддерживаются только изображения, PDF и текстовые документы');
        return;
      }
      
      setFormData({ ...formData, file });
      setError('');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const removeFile = () => {
    setFormData({ ...formData, file: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.patient_name || !formData.patient_age || !formData.analysis_type) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      submitData.append('user_id', user.user_id);
      submitData.append('patient_name', formData.patient_name);
      submitData.append('patient_age', formData.patient_age);
      submitData.append('patient_gender', formData.patient_gender);
      submitData.append('analysis_type', formData.analysis_type);
      submitData.append('symptoms', formData.symptoms);
      submitData.append('medications', formData.medications);
      
      if (formData.file) {
        submitData.append('file', formData.file);
      }

      const response = await axios.post(`${API_BASE_URL}/api/analyze`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.analysis_id) {
        navigate(`/results/${response.data.analysis_id}`);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || 
        'Произошла ошибка при анализе. Пожалуйста, попробуйте еще раз.'
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="abstract-bg"></div>
      <div className="molecular-pattern"></div>
      
      {/* Navigation */}
      <nav className="nav-header">
        <div className="logo">MEDANALYZER</div>
        <div className="nav-menu">
          <Link to="/dashboard" className="nav-link">Кабинет</Link>
          <Link to="/" className="btn btn-secondary">
            <ArrowLeft size={16} />
            На главную
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4 mx-auto">
            <Brain className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Анализ медицинских данных</h1>
          <p className="text-gray-600">
            Загрузите файлы анализов и получите детальную расшифровку с помощью ИИ
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* File Upload */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Загрузка файлов</h2>
            
            <div
              className={`form-file ${dragActive ? 'dragover' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
                accept="image/*,.pdf,.txt,.doc,.docx"
              />
              
              {formData.file ? (
                <div className="flex items-center justify-center gap-4">
                  <FileText size={24} />
                  <div>
                    <div className="font-medium">{formData.file.name}</div>
                    <div className="text-sm text-gray-500">
                      {(formData.file.size / 1024 / 1024).toFixed(1)} МБ
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload size={32} className="mx-auto mb-2 text-gray-400" />
                  <div className="text-lg font-medium mb-1">
                    Перетащите файл или нажмите для выбора
                  </div>
                  <div className="text-sm text-gray-500">
                    Поддерживаются: JPG, PNG, PDF, DOC (макс. 10 МБ)
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Patient Information */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Данные пациента</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Имя пациента *</label>
                <input
                  type="text"
                  name="patient_name"
                  className="form-input"
                  value={formData.patient_name}
                  onChange={handleInputChange}
                  required
                  placeholder="Введите имя"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Возраст *</label>
                  <input
                    type="number"
                    name="patient_age"
                    className="form-input"
                    value={formData.patient_age}
                    onChange={handleInputChange}
                    required
                    placeholder="Возраст"
                    min="0"
                    max="120"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Пол *</label>
                  <select
                    name="patient_gender"
                    className="form-input"
                    value={formData.patient_gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Выберите</option>
                    <option value="male">Мужской</option>
                    <option value="female">Женский</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Тип анализа *</label>
                <select
                  name="analysis_type"
                  className="form-input"
                  value={formData.analysis_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Выберите тип анализа</option>
                  {analysisTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Симптомы (необязательно)</label>
                <textarea
                  name="symptoms"
                  className="form-input form-textarea"
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  placeholder="Опишите симптомы, если есть..."
                  rows="3"
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Принимаемые лекарства (необязательно)</label>
                <textarea
                  name="medications"
                  className="form-input form-textarea"
                  value={formData.medications}
                  onChange={handleInputChange}
                  placeholder="Укажите принимаемые лекарства..."
                  rows="3"
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Анализируем...
                  </>
                ) : (
                  <>
                    <Brain size={20} />
                    Проанализировать
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;