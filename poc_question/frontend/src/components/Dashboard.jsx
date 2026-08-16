import React, { useState, useEffect } from 'react';
import { getSession, deleteQuestion, updateQuestion } from '../services/api';
import { ChevronDown, ChevronRight, Plus, Edit2, Trash2, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import QuestionBankModal from './QuestionBankModal';

export default function Dashboard({ sessionId }) {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedTopics, setExpandedTopics] = useState({});
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);
    const [currentTopicForBank, setCurrentTopicForBank] = useState(null);

    const loadSession = async () => {
        try {
            setLoading(true);
            const data = await getSession(sessionId);
            setSession(data);
            
            // Expand all by default
            const initialExpanded = {};
            data.topics.forEach(t => initialExpanded[t.id] = true);
            setExpandedTopics(initialExpanded);
        } catch (error) {
            toast.error("Không thể tải dữ liệu phiên làm việc.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (sessionId) {
            loadSession();
        }
    }, [sessionId]);

    const toggleTopic = (id) => {
        setExpandedTopics(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleDeleteQuestion = async (qId) => {
        if (!window.confirm("Bạn có chắc muốn xóa câu hỏi này?")) return;
        try {
            await deleteQuestion(qId);
            toast.success("Đã xóa câu hỏi");
            loadSession();
        } catch (error) {
            toast.error("Xóa thất bại");
        }
    };

    const handleEditQuestion = async (q) => {
        const newText = window.prompt("Sửa nội dung câu hỏi:", q.question_text);
        if (newText && newText !== q.question_text) {
            try {
                await updateQuestion(q.id, { ...q, question_text: newText });
                toast.success("Đã cập nhật câu hỏi");
                loadSession();
            } catch (error) {
                toast.error("Cập nhật thất bại");
            }
        }
    };

    const openBankModal = (topicId) => {
        setCurrentTopicForBank(topicId);
        setIsBankModalOpen(true);
    };

    const handleBankQuestionsAdded = () => {
        setIsBankModalOpen(false);
        loadSession();
    };

    if (loading) return <div className="text-center py-10">Đang tải dữ liệu...</div>;
    if (!session) return null;

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{session.job_title}</h2>
                    <p className="text-gray-500 text-sm mt-1">Review và tùy chỉnh bộ câu hỏi phỏng vấn</p>
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    Hoàn tất & Bắt đầu luyện tập
                </button>
            </div>

            <div className="space-y-4">
                {session.topics.map(topic => (
                    <div key={topic.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div 
                            className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer border-b border-gray-200"
                            onClick={() => toggleTopic(topic.id)}
                        >
                            <div className="flex items-center gap-3">
                                {expandedTopics[topic.id] ? <ChevronDown className="text-gray-500 w-5 h-5" /> : <ChevronRight className="text-gray-500 w-5 h-5" />}
                                <div>
                                    <h3 className="font-semibold text-gray-800 text-lg">{topic.name}</h3>
                                    <p className="text-sm text-gray-500">{topic.description}</p>
                                </div>
                            </div>
                            <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                {topic.questions?.length || 0} câu hỏi
                            </div>
                        </div>

                        {expandedTopics[topic.id] && (
                            <div className="p-4 bg-white">
                                <div className="space-y-3">
                                    {topic.questions?.map((q, idx) => (
                                        <div key={q.id} className="flex gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors group">
                                            <div className="font-bold text-gray-400">#{idx + 1}</div>
                                            <div className="flex-1">
                                                <p className="text-gray-800 font-medium">{q.question_text}</p>
                                                <div className="flex gap-2 mt-2">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                                        q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 
                                                        q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                        {q.difficulty}
                                                    </span>
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 font-medium">
                                                        {q.source === 'Question_Bank' ? 'Ngân hàng' : 'AI Gợi ý'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEditQuestion(q)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDeleteQuestion(q.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {(!topic.questions || topic.questions.length === 0) && (
                                        <p className="text-center text-gray-500 py-4 text-sm">Chưa có câu hỏi nào trong chủ đề này.</p>
                                    )}
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                                    <button 
                                        onClick={() => openBankModal(topic.id)}
                                        className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        Thêm từ Ngân hàng
                                    </button>
                                    <button 
                                        className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
                                        onClick={() => handleEditQuestion({ id: 'new', question_text: '' })} // Demo placeholder
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Tự soạn câu hỏi
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {isBankModalOpen && (
                <QuestionBankModal 
                    topicId={currentTopicForBank} 
                    onClose={() => setIsBankModalOpen(false)}
                    onSuccess={handleBankQuestionsAdded}
                />
            )}
        </div>
    );
}
