import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import VideoCapture from "@/components/molecules/VideoCapture";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import { cn } from "@/utils/cn";
import { claimService } from "@/services/api/claimService";
import { policyService } from "@/services/api/policyService";

const ClaimForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [loadingPolicies, setLoadingPolicies] = useState(true);
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    amount: "",
    policyId: "",
    incidentDate: new Date().toISOString().split('T')[0],
    location: "",
    contactPhone: "",
    witnessInfo: ""
  });

  const [errors, setErrors] = useState({});

  const claimTypes = [
    { value: "motor", label: "Motor Vehicle" },
    { value: "property", label: "Property Damage" },
    { value: "health", label: "Health/Medical" },
    { value: "travel", label: "Travel Insurance" },
    { value: "personal", label: "Personal Accident" },
    { value: "liability", label: "Liability" },
    { value: "other", label: "Other" }
  ];

  useEffect(() => {
    const loadPolicies = async () => {
      try {
        const policiesData = await policyService.getAll();
        setPolicies(policiesData.filter(policy => policy.status === "active"));
      } catch (error) {
        toast.error("Failed to load policies");
      } finally {
        setLoadingPolicies(false);
      }
    };
    
    loadPolicies();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleVideoCapture = (blob, url) => {
    setVideoFile(blob);
    setVideoUrl(url);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type) newErrors.type = "Claim type is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Valid claim amount is required";
    }
    if (!formData.policyId) newErrors.policyId = "Policy selection is required";
    if (!formData.incidentDate) newErrors.incidentDate = "Incident date is required";
    if (!formData.location.trim()) newErrors.location = "Incident location is required";
    if (!formData.contactPhone.trim()) newErrors.contactPhone = "Contact phone is required";

    // Validate phone number format
    if (formData.contactPhone && !/^\+?[\d\s\-\(\)]{10,15}$/.test(formData.contactPhone)) {
      newErrors.contactPhone = "Please enter a valid phone number";
    }

    // Validate future date
    if (formData.incidentDate && new Date(formData.incidentDate) > new Date()) {
      newErrors.incidentDate = "Incident date cannot be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    try {
      setLoading(true);
      
      const claimData = {
        ...formData,
        amount: parseFloat(formData.amount),
        videoAttachment: videoFile ? {
          filename: `claim_video_${Date.now()}.webm`,
          size: videoFile.size,
          type: videoFile.type
        } : null
      };

      const newClaim = await claimService.create(claimData);
      
      toast.success("Claim filed successfully! You will receive updates via email and SMS.");
      navigate("/claims");
      
    } catch (error) {
      toast.error("Failed to file claim. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    navigate("/claims");
  };

  if (loadingPolicies) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="p-2"
          >
            <ApperIcon name="ArrowLeft" className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">File New Claim</h1>
            <p className="text-gray-600">Provide details about your incident and upload supporting documentation</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <ApperIcon name="FileText" className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Claim Information</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Claim Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className={cn(
                  "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
                  errors.type && "border-red-500 focus:ring-red-500"
                )}
              >
                <option value="">Select claim type</option>
                {claimTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.type && <p className="text-red-600 text-sm mt-1">{errors.type}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Policy *
              </label>
              <select
                value={formData.policyId}
                onChange={(e) => handleInputChange("policyId", e.target.value)}
                className={cn(
                  "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
                  errors.policyId && "border-red-500 focus:ring-red-500"
                )}
              >
                <option value="">Select policy</option>
                {policies.map(policy => (
                  <option key={policy.Id} value={policy.Id}>
                    {policy.policyNumber} - {policy.type}
                  </option>
                ))}
              </select>
              {errors.policyId && <p className="text-red-600 text-sm mt-1">{errors.policyId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Claim Amount (₹) *
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="Enter claim amount"
                className={errors.amount && "border-red-500 focus:ring-red-500"}
              />
              {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Incident Date *
              </label>
              <Input
                type="date"
                value={formData.incidentDate}
                onChange={(e) => handleInputChange("incidentDate", e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className={errors.incidentDate && "border-red-500 focus:ring-red-500"}
              />
              {errors.incidentDate && <p className="text-red-600 text-sm mt-1">{errors.incidentDate}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Incident Location *
              </label>
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Enter the location where incident occurred"
                className={errors.location && "border-red-500 focus:ring-red-500"}
              />
              {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone *
              </label>
              <Input
                value={formData.contactPhone}
                onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                placeholder="+91 98765 43210"
                className={errors.contactPhone && "border-red-500 focus:ring-red-500"}
              />
              {errors.contactPhone && <p className="text-red-600 text-sm mt-1">{errors.contactPhone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Witness Information
              </label>
              <Input
                value={formData.witnessInfo}
                onChange={(e) => handleInputChange("witnessInfo", e.target.value)}
                placeholder="Witness name and contact (if any)"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Provide detailed description of what happened, damages incurred, and any other relevant information"
                rows={4}
                className={cn(
                  "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none",
                  errors.description && "border-red-500 focus:ring-red-500"
                )}
              />
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>
        </div>

        {/* Video Documentation */}
        <VideoCapture
          onVideoCapture={handleVideoCapture}
          maxDuration={120}
        />

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Filing Claim...
              </>
            ) : (
              <>
                <ApperIcon name="Send" className="w-4 h-4 mr-2" />
                File Claim
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ClaimForm;