import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClaimCard from "@/components/molecules/ClaimCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { claimService } from "@/services/api/claimService";

const ClaimsList = ({ limit, showHeader = true, className }) => {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadClaims = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await claimService.getAll();
      const limitedData = limit ? data.slice(0, limit) : data;
      setClaims(limitedData);
    } catch (err) {
      setError("Failed to load claims. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClaims();
  }, [limit]);

  const handleViewDetails = (claim) => {
    navigate(`/claims/${claim.Id}`);
  };

  const handleTrackStatus = (claim) => {
    navigate(`/claims/${claim.Id}/track`);
  };

  if (loading) {
    return <Loading variant="cards" className={className} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadClaims} className={className} />;
  }

  if (claims.length === 0) {
    return (
      <Empty
        title="No Claims Found"
        description="You haven't filed any insurance claims yet. We hope you never need to!"
        action={() => navigate("/claims/new")}
        actionText="File New Claim"
        icon="FileText"
        className={className}
      />
    );
  }

  return (
    <div className={className}>
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Claims</h2>
            <p className="text-gray-600">Track your claim status</p>
          </div>
          <Button 
            variant="primary"
            onClick={() => navigate("/claims/new")}
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            File Claim
          </Button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {claims.map((claim) => (
          <ClaimCard
            key={claim.Id}
            claim={claim}
            onViewDetails={handleViewDetails}
            onTrackStatus={handleTrackStatus}
          />
        ))}
      </div>

      {limit && claims.length >= limit && (
        <div className="text-center mt-6">
          <Button 
            variant="outline"
            onClick={() => navigate("/claims")}
          >
            View All Claims
          </Button>
        </div>
      )}
    </div>
  );
};

export default ClaimsList;