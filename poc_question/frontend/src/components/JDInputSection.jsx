import React, { useState, useRef } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';
import { uploadJD } from '../services/api';
import toast from 'react-hot-toast';

export default function JDInputSection({ onSessionCreated }) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Vui lòng chọn file JD để tải lên.");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Đang phân tích JD...");
        try {
            const data = await uploadJD(file);
            toast.success("Phân tích thành công!", { id: toastId });
            onSessionCreated(data.sessionId);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Có lỗi xảy ra khi phân tích JD.", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Tải lên Job Description</h2>
            <p className="text-gray-500 mb-6 text-sm">Hệ thống sẽ tự động bóc tách các kỹ năng yêu cầu và đối chiếu với ngân hàng câu hỏi để tạo bộ đề phỏng vấn phù hợp.</p>
            
            <div 
                className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors
                    ${file ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
                onClick={() => fileInputRef.current?.click()}
            >
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept=".pdf,.txt,.docx,.png,.jpg,.jpeg" 
                    className="hidden" 
                />
                
                <UploadCloud className={`mx-auto h-12 w-12 mb-3 ${file ? 'text-primary' : 'text-gray-400'}`} />
                
                {file ? (
                    <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                ) : (
                    <div>
                        <p className="text-sm font-medium text-gray-900">Bấm để chọn file</p>
                        <p className="text-xs text-gray-500 mt-1">Hỗ trợ PDF, TXT, DOCX, PNG, JPG</p>
                    </div>
                )}
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className={`flex items-center px-6 py-2.5 rounded-lg text-white font-medium transition-colors
                        ${!file || loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                    {loading ? 'Đang xử lý...' : 'Bắt đầu Phân tích'}
                </button>
            </div>
        </div>
    );
}
