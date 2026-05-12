import React, { useState } from 'react';
import api from '../services/api';

const DocumentManager = ({ title = "Documents", documents = [], touristId, onRefresh }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadMode, setUploadMode] = useState('file');
    const [docType, setDocType] = useState('ID_PROOF');
    const [file, setFile] = useState(null);
    const [fileUri, setFileUri] = useState('');
    const [uploading, setUploading] = useState(false);

    const [previewUrl, setPreviewUrl] = useState(null);

    const handlePreviewBeforeUpload = () => {
        if (uploadMode === 'file' && file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else if (uploadMode === 'link' && fileUri) {
            setPreviewUrl(fileUri);
        }
    };

    const handleViewDocument = async (documentId) => {
        try {
            const response = await api.get(`/tourismgov/v1/touristdoc/documents/${documentId}/view`);
            const fileUrl = response.data?.fileUri;
            
            if (fileUrl) {
                // Open the secure popup viewer
                setPreviewUrl(fileUrl);
            } else {
                alert("Document link is not available.");
            }
        } catch (error) {
            console.error("Error viewing document", error);
            alert("Could not retrieve document for viewing.");
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setUploading(true);

        const formData = new FormData();
        formData.append('docType', docType);
        
        if (uploadMode === 'file' && file) formData.append('file', file);
        else formData.append('fileUri', fileUri);

        try {
            await api.post('/tourismgov/v1/touristdoc/documents', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setIsModalOpen(false);
            setFile(null);
            setFileUri('');
            onRefresh(); 
        } catch (err) {
            alert(err.response?.data?.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-md font-black uppercase tracking-tight">{title}</h2>
                <button onClick={() => setIsModalOpen(true)} className="bg-[#1A237E] text-white text-[10px] font-black uppercase px-4 py-2 rounded-full hover:bg-[#FF6D00] transition-colors shadow-sm hover:-translate-y-0.5">
                    + Add New
                </button>
            </div>

            <div className="space-y-2">
                {documents.map((doc) => (
                    <div key={doc.documentId} className="flex items-center justify-between p-3 bg-[#F8F9FF] rounded-xl hover:bg-[#f0f2ff] transition-colors">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">📄</span>
                            <p className="text-[10px] font-black uppercase">{doc.docType.replace('_', ' ')}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full ${doc.verificationStatus === 'VERIFIED' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                {doc.verificationStatus}
                            </span>
                            <button onClick={() => handleViewDocument(doc.documentId)} className="text-[#1A237E] font-black text-[10px] uppercase tracking-widest hover:text-[#FF6D00] hover:underline bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200">
                                View
                            </button>
                        </div>
                    </div>
                ))}
                {(!documents || documents.length === 0) && (
                    <p className="text-center text-[10px] font-bold text-gray-400 py-4">No documents yet.</p>
                )}
            </div>

            {/* --- UPLOAD MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1A237E]/40 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl">
                        <h2 className="text-xl font-black uppercase mb-4">Upload Document</h2>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div className="flex bg-[#F8F9FF] p-1 rounded-full mb-2">
                                <button type="button" onClick={() => setUploadMode('file')} className={`flex-1 py-2 text-[9px] font-black uppercase rounded-full transition-colors ${uploadMode === 'file' ? 'bg-[#1A237E] text-white shadow-md' : 'text-[#1A237E]'}`}>Local File</button>
                                <button type="button" onClick={() => setUploadMode('link')} className={`flex-1 py-2 text-[9px] font-black uppercase rounded-full transition-colors ${uploadMode === 'link' ? 'bg-[#1A237E] text-white shadow-md' : 'text-[#1A237E]'}`}>URL Link</button>
                            </div>
                            
                            <select value={docType} onChange={(e) => setDocType(e.target.value)} className="w-full px-4 py-2 text-[10px] bg-[#F8F9FF] rounded-full outline-none font-bold uppercase">
                                <option value="ID_PROOF">Identity Proof</option>
                                <option value="PASSPORT">Passport</option>
                            </select>
                            
                            {uploadMode === 'file' ? (
                                <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword" onChange={(e) => setFile(e.target.files[0])} className="w-full text-[10px]" required />
                            ) : (
                                <input type="url" placeholder="https://..." value={fileUri} onChange={(e) => setFileUri(e.target.value)} className="w-full px-4 py-2 text-[10px] bg-[#F8F9FF] rounded-full" required />
                            )}

                            {((uploadMode === 'file' && file) || (uploadMode === 'link' && fileUri)) && (
                                <button type="button" onClick={handlePreviewBeforeUpload} className="text-[9px] font-black text-[#FF6D00] uppercase tracking-widest hover:underline mt-1 block text-right w-full">
                                    👁 Preview
                                </button>
                            )}

                            <div className="flex gap-2 pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 text-[9px] font-black uppercase bg-gray-100 rounded-full hover:bg-gray-200">Cancel</button>
                                <button type="submit" disabled={uploading} className="flex-1 py-2 text-[9px] font-black uppercase text-white bg-[#FF6D00] rounded-full hover:bg-[#e66200] disabled:opacity-50">
                                    {uploading ? "Wait..." : "Confirm"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- PREVIEW VIEWER MODAL --- */}
            {previewUrl && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#1A237E]/80 backdrop-blur-md animate-fadeIn">
                    <div className="bg-white w-full max-w-4xl h-[85vh] rounded-[2rem] p-4 shadow-2xl flex flex-col">
                        <div className="flex justify-between items-center mb-4 px-4">
                            <div>
                                <h2 className="text-lg font-black uppercase tracking-tight">Document Preview</h2>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">PDFs display natively. Word Docs may trigger a download.</p>
                            </div>
                            <button onClick={() => setPreviewUrl(null)} className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors font-black">
                                ✕
                            </button>
                        </div>
                        
                        <div className="flex-1 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 relative">
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase tracking-widest -z-10">
                                Loading Document...
                            </div>
                            <iframe src={previewUrl} className="w-full h-full border-none relative z-10 bg-white" title="Document Preview" />
                        </div>

                        <div className="mt-4 flex justify-between items-center px-4">
                            <p className="text-[9px] font-bold text-gray-400 uppercase">Secure Viewer</p>
                            <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-[#FF6D00] uppercase tracking-widest hover:underline bg-[#FF6D00]/10 px-4 py-2 rounded-full">
                                Open in New Tab ↗
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentManager;