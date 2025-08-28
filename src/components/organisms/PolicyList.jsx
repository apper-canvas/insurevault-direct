import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PolicyCard from "@/components/molecules/PolicyCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { policyService } from "@/services/api/policyService";

const PolicyList = ({ limit, showHeader = true, className }) => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPolicies = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await policyService.getAll();
      const limitedData = limit ? data.slice(0, limit) : data;
      setPolicies(limitedData);
    } catch (err) {
      setError("Failed to load policies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolicies();
  }, [limit]);

  const handleViewDetails = (policy) => {
    navigate(`/policies/${policy.Id}`);
  };

  const handleRenew = (policy) => {
    toast.info(`Renewal process started for ${policy.asset?.name}`);
    navigate(`/policies/${policy.Id}/renew`);
  };

  const handleClaim = (policy) => {
    navigate(`/claims/new?policyId=${policy.Id}`);
  };

  if (loading) {
    return <Loading variant="cards" className={className} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadPolicies} className={className} />;
  }

  if (policies.length === 0) {
    return (
      <Empty
        title="No Policies Found"
        description="You haven't added any insurance policies yet. Start protecting your assets today!"
        action={() => navigate("/add-asset")}
        actionText="Add First Policy"
        icon="Shield"
        className={className}
      />
    );
  }

  return (
    <div className={className}>
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Policies</h2>
            <p className="text-gray-600">Manage your insurance coverage</p>
          </div>
          <Button 
            variant="primary"
            onClick={() => navigate("/add-asset")}
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Policy
          </Button>
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {policies.map((policy) => (
          <PolicyCard
            key={policy.Id}
            policy={policy}
            onViewDetails={handleViewDetails}
            onRenew={handleRenew}
            onClaim={handleClaim}
          />
        ))}
      </div>

      {limit && policies.length >= limit && (
        <div className="text-center mt-6">
          <Button 
            variant="outline"
            onClick={() => navigate("/policies")}
          >
            View All Policies
          </Button>
        </div>
      )}
    </div>
  );
};

export default PolicyList;