import React, { useState } from 'react';
import JDInputSection from './components/JDInputSection';
import Dashboard from './components/Dashboard';
import { Toaster } from 'react-hot-toast';

function App() {
  const [sessionId, setSessionId] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Toaster position="top-right" />

      <header className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">InterviewPrep</h1>
          </div>

        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {!sessionId ? (
          <div>
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Tạo bộ câu hỏi phỏng vấn chuẩn xác</h1>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">Upload Job Description của công ty bạn muốn ứng tuyển. Hệ thống sẽ dùng AI để phân tích và trích xuất những câu hỏi sát nhất từ ngân hàng dữ liệu.</p>
            </div>
            <JDInputSection onSessionCreated={setSessionId} />
          </div>
        ) : (
          <Dashboard sessionId={sessionId} />
        )}
      </main>
    </div>
  );
}

export default App;
