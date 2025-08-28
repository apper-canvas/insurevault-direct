import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { documentService } from "@/services/api/documentService";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
            <p className="text-gray-600">Access all your insurance documents and certificates</p>
          </div>
<Button variant="primary" className="shadow-lg hover:shadow-xl">
            <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search documents by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {documentTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setFilterType(type.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                  filterType === type.value
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <ApperIcon name={type.icon} className="w-4 h-4" />
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Document Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center mx-auto mb-2">
            <ApperIcon name="FolderOpen" className="w-5 h-5 text-primary-600" />
          </div>
          <p className="text-2xl font-bold gradient-text">{documents.length}</p>
          <p className="text-sm text-gray-600">Total Documents</p>
        </div>
        
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mx-auto mb-2">
            <ApperIcon name="Shield" className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">
            {documents.filter(d => d.type === "policy").length}
          </p>
          <p className="text-sm text-gray-600">Policy Cards</p>
        </div>
        
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center mx-auto mb-2">
            <ApperIcon name="FileText" className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-orange-600">
            {documents.filter(d => d.type === "claim").length}
          </p>
          <p className="text-sm text-gray-600">Claim Docs</p>
        </div>
        
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mx-auto mb-2">
            <ApperIcon name="Award" className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {documents.filter(d => d.type === "certificate").length}
          </p>
          <p className="text-sm text-gray-600">Certificates</p>
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <Empty
          title="No Documents Found"
description="Start building your secure document vault by uploading your important documents like ID cards, policies, and receipts."
          action={() => {/* Upload action */}}
          actionText="Upload First Document"
          icon="Upload"
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <Card key={document.Id} className="hover:shadow-elevated transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${getDocumentColor(document.type)} rounded-lg flex items-center justify-center`}>
                  <ApperIcon name={getDocumentIcon(document.type)} className="w-6 h-6" />
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="Download" className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="Share" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-1">{document.name}</h3>
                {document.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{document.description}</p>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Type</span>
                  <Badge variant="default">
                    {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Size</span>
                  <span className="text-gray-900">{document.fileSize || "2.5 MB"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Updated</span>
                  <span className="text-gray-900">{document.lastModified || "2 days ago"}</span>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
                View Document
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Digital Wallet Section */}
      <Card className="bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="CreditCard" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Digital Insurance Wallet</h3>
              <p className="text-sm text-gray-600">Quick access to all your policy cards</p>
            </div>
          </div>
          <Button variant="primary">
            <ApperIcon name="Wallet" className="w-4 h-4 mr-2" />
            Open Wallet
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Documents;