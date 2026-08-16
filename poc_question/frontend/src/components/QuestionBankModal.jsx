import React, { useState, useEffect } from 'react';
import { getQuestionBank, addQuestionToTopic } from '../services/api';
import { X, Search, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QuestionBankModal({ topicId, onClose, onSuccess }) {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState(new Set());

    useEffect(() => {
        loadBank();
    }, []);

    const loadBank = async () => {
        try {
            setLoading(true);
            const data = await getQuestionBank();
            setQuestions(data);
        } catch (error) {
            toast.error("Không thể tải ngân hàng câu hỏi");
        } finally {
            setLoading(false);
        }
    };

    const toggleSelect = (id) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const handleAddSelected = async () => {
        if (selectedIds.size === 0) return;
        
        const toastId = toast.loading("Đang thêm câu hỏi...");
        try {
            for (const id of selectedIds) {
                const q = questions.find(x => x.id === id);
                if (q) {
                    await addQuestionToTopic(topicId, {
                        question_text: q.question_text,
                        sample_answer: q.sample_answer,
                        difficulty: q.difficulty,
                        source: 'Question_Bank',
                        original_bank_id: q.id
                    });
                }
            }
            toast.success(`Đã thêm ${selectedIds.size} câu hỏi!`, { id: toastId });
            onSuccess();
        } catch (error) {
            toast.error("Có lỗi xảy ra", { id: toastId });
        }
    };

    const filteredQuestions = questions.filter(q => 
        q.question_text.toLowerCase().includes(search.toLowerCase()) || 
        q.topic.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Ngân hàng câu hỏi</h2>
                        <p className="text-sm text-gray-500 mt-1">Chọn các câu hỏi để thêm vào chủ đề hiện tại</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-white p-2 rounded-lg border border-gray-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                            type="text"
                            placeholder="Tìm kiếm theo nội dung, chủ đề..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30">
                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Đang tải...</div>
                    ) : (
                        <div className="space-y-3">
                            {filteredQuestions.map(q => (
                                <div 
                                    key={q.id} 
                                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex gap-4 ${
                                        selectedIds.has(q.id) ? 'border-blue-500 bg-blue-50/50' : 'border-gray-100 bg-white hover:border-gray-300'
                                    }`}
                                    onClick={() => toggleSelect(q.id)}
                                >
                                    <div className="pt-1">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedIds.has(q.id)}
                                            readOnly
                                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex gap-2 mb-1">
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">{q.topic}</span>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                                q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 
                                                q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {q.difficulty}
                                            </span>
                                        </div>
                                        <p className="text-gray-800 font-medium">{q.question_text}</p>
                                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{q.sample_answer}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100 bg-white rounded-b-xl flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-medium">
                        Đã chọn <span className="text-blue-600 font-bold text-lg mx-1">{selectedIds.size}</span> câu hỏi
                    </span>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition-colors">
                            Hủy
                        </button>
                        <button 
                            onClick={handleAddSelected}
                            disabled={selectedIds.size === 0}
                            className={`flex items-center px-6 py-2.5 rounded-lg font-medium transition-colors ${
                                selectedIds.size > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm vào Chủ đề
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
