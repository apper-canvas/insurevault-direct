import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { policyService } from "@/services/api/policyService";
import { claimService } from "@/services/api/claimService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import StatsCard from "@/components/molecules/StatsCard";
import ClaimCard from "@/components/molecules/ClaimCard";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";

const PolicyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const loadPolicyDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const [policyData, policyClaimsData] = await Promise.all([
        policyService.getById(id),
        claimService.getByPolicyId(id).catch(() => []) // Handle if claims don't exist
      ]);
      setPolicy(policyData);
      setClaims(policyClaimsData);
    } catch (err) {
      setError("Failed to load policy details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadPolicyDetails();
    }
  }, [id]);

  const getAssetIcon = (type) => {
    const icons = {
      car: "Car",
      bike: "Bike", 
      home: "Home",
      gadget: "Smartphone",
      travel: "Plane",
      health: "Heart"
    };
    return icons[type] || "Shield";
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { variant: "active", text: "Active", color: "text-green-600" },
      expired: { variant: "expired", text: "Expired", color: "text-red-600" },
      cancelled: { variant: "error", text: "Cancelled", color: "text-gray-600" }
    };
    return statusMap[status] || { variant: "default", text: "Unknown", color: "text-gray-600" };
  };

  const isExpiringSoon = () => {
    if (!policy?.endDate) return false;
    try {
      const endDate = new Date(policy.endDate);
      const today = new Date();
      const diffInDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
      return diffInDays <= 30 && diffInDays > 0;
    } catch (error) {
      return false;
    }
  };

  const handleRenew = async () => {
    try {
      const assetName = policy.asset?.name || policy.assetName || 'your policy';
      toast.info(`Initiating renewal for ${assetName}...`);
      await policyService.renew(policy.Id);
      toast.success(`Renewal process started for ${assetName}`);
      navigate(`/policies/${policy.Id}/renew`);
    } catch (error) {
      toast.error(`Failed to start renewal: ${error.message}`);
    }
  };

  const handleClaim = () => {
    navigate(`/claims/new?policyId=${policy.Id}`);
  };

  const handleDownloadDocument = (docName) => {
    toast.info(`Downloading ${docName}...`);
    // Mock download functionality
    setTimeout(() => {
      toast.success(`${docName} downloaded successfully`);
    }, 1500);
  };

  if (loading) {
    return <Loading variant="page" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadPolicyDetails} />;
  }

  if (!policy) {
    return <Error message="Policy not found" onRetry={() => navigate("/policies")} />;
  }

  const statusInfo = getStatusBadge(policy.status);
  const tabs = [
    { id: "overview", label: "Overview", icon: "Eye" },
    { id: "documents", label: "Documents", icon: "FolderOpen" },
    { id: "claims", label: "Claims", icon: "FileText" },
    { id: "history", label: "History", icon: "Clock" }
  ];

  const documents = [
    { name: "Policy Certificate", type: "PDF", size: "1.2 MB", lastModified: "2024-01-15" },
    { name: "Premium Receipt", type: "PDF", size: "0.8 MB", lastModified: "2024-01-10" },
    { name: "Terms & Conditions", type: "PDF", size: "2.1 MB", lastModified: "2023-12-20" }
  ];

  const policyHistory = [
    { date: "2024-01-15", action: "Premium Payment", status: "Completed", amount: policy.premium },
    { date: "2023-12-20", action: "Policy Renewed", status: "Completed", amount: null },
    { date: "2023-11-30", action: "NCB Updated", status: "Completed", amount: null },
    { date: "2023-06-15", action: "Policy Issued", status: "Completed", amount: policy.premium }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/policies")}
            className="flex items-center gap-2"
          >
            <ApperIcon name="ChevronLeft" className="w-4 h-4" />
            Back to Policies
          </Button>
          <div className="flex gap-2">
            {statusInfo && (
              <Badge variant={statusInfo.variant}>
                {statusInfo.text}
              </Badge>
            )}
            {isExpiringSoon() && (
              <Badge variant="warning">
                <ApperIcon name="Clock" className="w-3 h-3 mr-1" />
                Expiring Soon
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
            <ApperIcon
              name={getAssetIcon(policy.asset?.type)}
              className="w-8 h-8 text-primary-600"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {policy.asset?.name || policy.assetName || `${policy.type || "Asset"} Insurance`}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              <span>Policy: {policy.policyNumber || 'N/A'}</span>
              <span>•</span>
              <span>Insurer: {policy.insurer || 'N/A'}</span>
              <span>•</span>
              <span>Type: {policy.asset?.type || policy.type || 'N/A'}</span>
            </div>
            <div className="flex gap-3">
              {policy.status === "active" && (
                <>
                  <Button variant="primary" onClick={handleRenew}>
                    <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
                    Renew Policy
                  </Button>
                  <Button variant="outline" onClick={handleClaim}>
                    <ApperIcon name="FileText" className="w-4 h-4 mr-2" />
                    File Claim
                  </Button>
                </>
              )}
              <Button variant="ghost" onClick={() => navigate("/safety")}>
                <ApperIcon name="ShieldCheck" className="w-4 h-4 mr-2" />
                Safety Checklist
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Policy Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Coverage Amount"
          value={`₹${policy.coverageAmount ? policy.coverageAmount.toLocaleString() : '0'}`}
          icon="Shield"
          className="bg-gradient-to-br from-primary-50 to-primary-100"
        />
        <StatsCard
          title="Annual Premium"
          value={`₹${policy.premium ? policy.premium.toLocaleString() : '0'}`}
          icon="CreditCard"
          className="bg-gradient-to-br from-accent-50 to-accent-100"
        />
        <StatsCard
          title="No Claim Bonus"
          value={policy.ncb ? `${policy.ncb}%` : '0%'}
          icon="Award"
          className="bg-gradient-to-br from-green-50 to-green-100"
        />
        <StatsCard
          title="Days to Expiry"
          value={(() => {
            if (!policy.endDate) return 'N/A';
            try {
              const diffInDays = Math.ceil((new Date(policy.endDate) - new Date()) / (1000 * 60 * 60 * 24));
              return diffInDays > 0 ? diffInDays.toString() : 'Expired';
            } catch {
              return 'N/A';
            }
          })()}
          icon="Clock"
          className={isExpiringSoon() ? "bg-gradient-to-br from-warning/10 to-warning/20" : "bg-gradient-to-br from-gray-50 to-gray-100"}
        />
      </div>

      {/* Expiry Warning */}
      {isExpiringSoon() && (
        <div className="glass-card rounded-xl p-6 bg-gradient-to-r from-warning/10 to-yellow-100 border border-warning/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-warning to-yellow-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="AlertTriangle" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-warning">Renewal Required</h3>
                <p className="text-sm text-warning/80">
                  Your policy expires in {(() => {
                    try {
                      return Math.ceil((new Date(policy.endDate) - new Date()) / (1000 * 60 * 60 * 24));
                    } catch {
                      return 'N/A';
                    }
                  })()} days. Renew now to avoid coverage gaps.
                </p>
              </div>
            </div>
            <Button variant="warning" onClick={handleRenew}>
              Renew Now
            </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="glass-card rounded-xl p-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Policy Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ApperIcon name="FileText" className="w-5 h-5" />
                  Policy Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Policy Number</span>
                    <span className="font-medium">{policy.policyNumber || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Insurer</span>
                    <span className="font-medium">{policy.insurer || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Policy Type</span>
                    <span className="font-medium">{policy.type || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date</span>
                    <span className="font-medium">
                      {policy.startDate ? format(new Date(policy.startDate), "MMM dd, yyyy") : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Date</span>
                    <span className="font-medium">
                      {policy.endDate ? format(new Date(policy.endDate), "MMM dd, yyyy") : 'N/A'}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ApperIcon name="Phone" className="w-5 h-5" />
                  Emergency Contact
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">24/7 Helpline</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        toast.info("Connecting to emergency helpline...");
                        window.open("tel:1800-123-4567");
                      }}
                    >
                      <ApperIcon name="Phone" className="w-4 h-4 mr-1" />
                      1800-123-4567
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Claim Support</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        toast.info("Opening claim support chat...");
                        navigate("/emergency");
                      }}
                    >
                      <ApperIcon name="MessageCircle" className="w-4 h-4 mr-1" />
                      Live Chat
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Roadside Assistance</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        toast.info("Connecting to roadside assistance...");
                        window.open("tel:1800-567-8901");
                      }}
                    >
                      <ApperIcon name="Truck" className="w-4 h-4 mr-1" />
                      1800-567-8901
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Asset Details */}
            {policy.asset && (
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ApperIcon name={getAssetIcon(policy.asset.type)} className="w-5 h-5" />
                  Asset Details
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-gray-600 block">Asset Name</span>
                    <span className="font-medium">{policy.asset.name || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Asset Type</span>
                    <span className="font-medium capitalize">{policy.asset.type || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Asset Value</span>
                    <span className="font-medium">₹{policy.asset.value ? policy.asset.value.toLocaleString() : 'N/A'}</span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === "documents" && (
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                    <ApperIcon name="FileText" className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-500">
                      {doc.type} • {doc.size} • Modified {format(new Date(doc.lastModified), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownloadDocument(doc.name)}
                >
                  <ApperIcon name="Download" className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "claims" && (
          <div className="space-y-6">
            {claims.length > 0 ? (
              <div className="grid gap-6">
                {claims.map((claim) => (
                  <ClaimCard
                    key={claim.Id}
                    claim={claim}
                    onViewDetails={(claim) => navigate(`/claims/${claim.Id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="FileX" className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Claims Filed</h3>
                <p className="text-gray-600 mb-6">
                  You haven't filed any claims for this policy yet.
                </p>
                <Button variant="primary" onClick={handleClaim}>
                  <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                  File New Claim
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            {policyHistory.map((event, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Clock" className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{event.action}</p>
                    <span className="text-sm text-gray-500">
                      {format(new Date(event.date), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <Badge variant="success">{event.status}</Badge>
                    {event.amount && (
                      <span className="text-sm font-medium text-gray-700">
                        ₹{event.amount.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyDetails;