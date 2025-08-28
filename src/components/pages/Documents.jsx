import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { documentService } from "@/services/api/documentService";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await documentService.getAll();
      setDocuments(data);
    } catch (err) {
      setError("Failed to load documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

const documentTypes = [
    { value: "all", label: "All Documents", icon: "FolderOpen" },
    { value: "policy", label: "Policy Documents", icon: "Shield" },
    { value: "claim", label: "Claim Documents", icon: "FileText" },
    { value: "certificate", label: "Certificates", icon: "Award" },
    { value: "receipt", label: "Receipts", icon: "Receipt" },
    { value: "id", label: "ID Cards", icon: "CreditCard" },
    { value: "license", label: "Driver's License", icon: "Car" },
    { value: "repair", label: "Repair Bills", icon: "Wrench" },
    { value: "personal", label: "Personal Documents", icon: "User" }
  ];

  const getDocumentIcon = (type) => {
    const icons = {
      policy: "Shield",
      claim: "FileText",
      certificate: "Award",
      receipt: "Receipt",
photo: "Image",
      pdf: "FileText",
      doc: "FileText",
      docx: "FileText",
      jpg: "Image",
      jpeg: "Image",
      png: "Image"
    };
    return icons[type] || "File";
  };

  const getDocumentColor = (type) => {
    const colors = {
      policy: "from-primary-100 to-primary-200 text-primary-600",
      claim: "from-orange-100 to-orange-200 text-orange-600",
certificate: "from-green-100 to-green-200 text-green-600",
      receipt: "from-purple-100 to-purple-200 text-purple-600",
      photo: "from-blue-100 to-blue-200 text-blue-600",
      id: "from-indigo-100 to-indigo-200 text-indigo-600",
      license: "from-yellow-100 to-yellow-200 text-yellow-600",
      repair: "from-red-100 to-red-200 text-red-600",
      personal: "from-teal-100 to-teal-200 text-teal-600",
      pdf: "from-red-100 to-red-200 text-red-600"
    };
    return colors[type] || "from-gray-100 to-gray-200 text-gray-600";
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return <Loading variant="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDocuments} />;
  }

const handleUploadDocument = () => {
    setShowUploadModal(true);
  };

return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      {/* Header */}
      <div className="glass-card rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">My Documents</h1>
            <p className="text-gray-600 text-sm sm:text-base">Securely store and manage all your insurance documents</p>
          </div>
          <Button 
            variant="primary" 
            className="shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 w-full sm:w-auto"
            onClick={handleUploadDocument}
          >
            <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

{/* Search & Filters */}
      <div className="glass-card rounded-xl p-4 sm:p-6">
        <div className="space-y-4">
          <div className="w-full">
            <Input
              placeholder="Search documents by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-base"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {documentTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setFilterType(type.value)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg whitespace-nowrap transition-all duration-200 text-sm sm:text-sm font-medium min-w-fit ${
                  filterType === type.value
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md"
                    : "bg-white/80 text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <ApperIcon name={type.icon} className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">{type.label}</span>
                <span className="sm:hidden">{type.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

{/* Document Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card rounded-xl p-3 sm:p-4 text-center hover:shadow-elevated transition-all duration-300 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
            <ApperIcon name="FolderOpen" className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold gradient-text">{documents.length}</p>
          <p className="text-xs sm:text-sm text-gray-600 font-medium">Total Documents</p>
        </div>
        
        <div className="glass-card rounded-xl p-3 sm:p-4 text-center hover:shadow-elevated transition-all duration-300 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
            <ApperIcon name="Shield" className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-600">
            {documents.filter(d => d.type === "policy").length}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 font-medium">Policy Cards</p>
        </div>
        
        <div className="glass-card rounded-xl p-3 sm:p-4 text-center hover:shadow-elevated transition-all duration-300 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
            <ApperIcon name="FileText" className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-orange-600">
            {documents.filter(d => d.type === "claim").length}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 font-medium">Claim Docs</p>
        </div>
        
        <div className="glass-card rounded-xl p-3 sm:p-4 text-center hover:shadow-elevated transition-all duration-300 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-100 to-violet-200 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
            <ApperIcon name="Award" className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-violet-600">
            {documents.filter(d => d.type === "certificate").length}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 font-medium">Certificates</p>
        </div>
      </div>

{/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <Empty
          title="No Documents Found"
          description="Start building your secure document vault by uploading your important documents like ID cards, policies, and receipts."
          action={handleUploadDocument}
          actionText="Upload First Document"
          icon="Upload"
        />
      ) : (
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredDocuments?.map((document, index) => (
            <Card 
              key={`document-${document?.id || document?.name || index}`} 
              className="hover:shadow-elevated transition-all duration-300 group hover:scale-[1.02] transform"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${getDocumentColor(document?.type || 'pdf')} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <ApperIcon name={getDocumentIcon(document?.type || 'pdf')} className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div className="flex gap-1 sm:gap-2">
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100 hover:scale-110 transition-all duration-200" title="Download document">
                    <ApperIcon name="Download" className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100 hover:scale-110 transition-all duration-200" title="Share document">
                    <ApperIcon name="Share" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-1 text-base sm:text-lg leading-tight">
                  {document?.name || 'Unnamed Document'}
                </h3>
                {document?.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{document.description}</p>
                )}
              </div>

              <div className="space-y-2.5 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Type</span>
                  <Badge variant="default" className="text-xs">
                    {(document?.type || 'pdf').charAt(0).toUpperCase() + (document?.type || 'pdf').slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Size</span>
                  <span className="text-gray-900 font-medium">{document?.fileSize || "2.5 MB"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Updated</span>
                  <span className="text-gray-900 font-medium">{document?.lastModified || "2 days ago"}</span>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-all duration-200">
                <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
                View Document
              </Button>
            </Card>
          )) || (
            <div className="col-span-full text-center py-12 text-gray-500">
              <div className="max-w-sm mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="FileX" className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-600 mb-1">No documents available</p>
                <p className="text-sm text-gray-500">Upload your first document to get started</p>
              </div>
            </div>
          )}
        </div>
      )}

{/* Digital Wallet Section */}
      <Card className="bg-gradient-to-br from-primary-50 via-primary-25 to-secondary-50 border border-primary-100/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
              <ApperIcon name="CreditCard" className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-900 text-lg">Digital Insurance Wallet</h3>
              <p className="text-sm text-gray-600">Quick access to all your policy cards and certificates</p>
            </div>
          </div>
          <Button variant="primary" className="shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 w-full sm:w-auto">
            <ApperIcon name="Wallet" className="w-4 h-4 mr-2" />
            Open Wallet
          </Button>
        </div>
      </Card>

{/* Document Upload Modal */}
      {showUploadModal && (
        <DocumentUploadModal 
          onClose={() => setShowUploadModal(false)}
          onUpload={loadDocuments}
        />
      )}
    </div>
  );
};
// DocumentUploadModal Component
const DocumentUploadModal = ({ onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState("policy");
  const [documentName, setDocumentName] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && !uploading) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, uploading]);

  const documentTypes = [
    { value: "policy", label: "Policy Document" },
    { value: "claim", label: "Claim Form" },
    { value: "certificate", label: "Certificate" },
    { value: "receipt", label: "Receipt" },
    { value: "photo", label: "Photo/Image" },
    { value: "id", label: "ID Document" },
    { value: "license", label: "License" },
    { value: "repair", label: "Repair Estimate" },
    { value: "personal", label: "Personal Document" }
  ];

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid file type (PDF, Word, or Image)");
      return;
    }

    setSelectedFile(file);
    if (!documentName) {
      setDocumentName(file.name.replace(/\.[^/.]+$/, ""));
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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const getFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    if (!documentName.trim()) {
      toast.error("Please enter a document name");
      return;
    }

    setUploading(true);

    try {
      await documentService.create({
        name: documentName.trim(),
        type: documentType,
        description: description.trim(),
        fileSize: getFileSize(selectedFile.size),
        fileName: selectedFile.name,
        mimeType: selectedFile.type,
        uploadDate: new Date().toISOString()
      });

      toast.success("Document uploaded successfully!");
      onUpload(); // Refresh the documents list
      onClose(); // Close modal
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error("Failed to upload document. Please try again.");
    } finally {
      setUploading(false);
    }
  };

return (
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 pointer-events-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget && !uploading) {
            onClose();
          }
        }}
      >
        <div 
          className="bg-white rounded-2xl shadow-elevated max-w-md w-full max-h-[90vh] flex flex-col animate-scale-in overflow-hidden pointer-events-auto border border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
        <div className="p-6 overflow-y-auto scroll-smooth flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Upload Document</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              disabled={uploading}
              className="hover:bg-gray-100 hover:scale-110 transition-all duration-200"
              title="Close modal (Esc)"
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleUpload} className="space-y-4">
            {/* File Drop Zone */}
<div 
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-primary-500 bg-primary-50 scale-[1.02]' 
                  : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                    <ApperIcon name="FileText" className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">{getFileSize(selectedFile.size)}</p>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedFile(null)}
                  >
                    Remove File
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <ApperIcon name="Upload" className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">Drop your file here</p>
                    <p className="text-sm text-gray-500">or click to browse</p>
                  </div>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Document Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Name *
                </label>
                <Input
                  type="text"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Enter document name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Type *
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  {documentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description (optional)"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                />
              </div>
            </div>

            {/* Actions */}
<div className="flex gap-3 pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 hover:bg-gray-50 hover:scale-[1.02] transform transition-all duration-200"
                disabled={uploading}
                title="Cancel upload and close modal"
              >
                <ApperIcon name="X" className="w-4 h-4 mr-2" />
                Cancel
              </Button>
<Button
                type="submit"
                variant="primary"
                className="flex-1 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                disabled={uploading || !selectedFile}
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
                    Upload Document
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Documents;