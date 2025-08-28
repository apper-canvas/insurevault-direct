import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import PolicyCard from "@/components/molecules/PolicyCard";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import { policyService } from "@/services/api/policyService";
import { quoteService } from "@/services/api/quoteService";
import { toast } from "react-toastify";

const PolicyComparison = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [policies, setPolicies] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [selectedPolicies, setSelectedPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    insurer: 'all',
    premiumRange: 'all',
    coverageType: 'all'
  });
  const [viewMode, setViewMode] = useState('selection'); // 'selection' | 'comparison'

  useEffect(() => {
    loadData();
    // Check if specific policies were passed for comparison
    const preselected = location.state?.selectedPolicies || [];
    if (preselected.length > 0) {
      setSelectedPolicies(preselected);
      setViewMode('comparison');
    }
  }, [location.state]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [policiesData, quotesData] = await Promise.all([
        policyService.getAll(),
        quoteService.getAll()
      ]);
      setPolicies(policiesData);
      setQuotes(quotesData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load comparison data");
    } finally {
      setLoading(false);
    }
  };

  const handlePolicySelect = (policy) => {
    if (selectedPolicies.find(p => p.Id === policy.Id)) {
      setSelectedPolicies(prev => prev.filter(p => p.Id !== policy.Id));
    } else if (selectedPolicies.length < 4) {
      setSelectedPolicies(prev => [...prev, policy]);
    } else {
      toast.warning("Maximum 4 policies can be compared at once");
    }
  };

  const startComparison = () => {
    if (selectedPolicies.length < 2) {
      toast.error("Please select at least 2 policies to compare");
      return;
    }
    setViewMode('comparison');
  };

  const clearSelection = () => {
    setSelectedPolicies([]);
    setViewMode('selection');
  };

  const filterPolicies = () => {
    let filtered = [...policies, ...quotes.map(quote => ({
      ...quote,
      asset: { name: `Quote ${quote.Id}`, type: 'quote' },
      insurer: quote.insurer,
      policyNumber: `QUOTE-${quote.Id}`,
      premium: quote.premium,
      coverageAmount: quote.coverage?.amount || 500000,
      status: 'quote',
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      isQuote: true
    }))];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.insurer?.toLowerCase().includes(searchTerm) ||
        item.asset?.name?.toLowerCase().includes(searchTerm) ||
        item.policyNumber?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.insurer !== 'all') {
      filtered = filtered.filter(item => item.insurer === filters.insurer);
    }

    if (filters.premiumRange !== 'all') {
      const ranges = {
        'low': [0, 10000],
        'medium': [10000, 25000],
        'high': [25000, Infinity]
      };
      const [min, max] = ranges[filters.premiumRange];
      filtered = filtered.filter(item => item.premium >= min && item.premium < max);
    }

    return filtered;
  };

  const getUniqueInsurers = () => {
    const allItems = [...policies, ...quotes];
    return [...new Set(allItems.map(item => item.insurer))];
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const filteredPolicies = filterPolicies();

  if (viewMode === 'comparison') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">
                Policy Comparison
              </h1>
              <p className="text-gray-600">
                Compare {selectedPolicies.length} selected policies side-by-side
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setViewMode('selection')}
              >
                <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                Back to Selection
              </Button>
              <Button 
                variant="ghost" 
                onClick={clearSelection}
              >
                <ApperIcon name="X" className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>

          <ComparisonTable policies={selectedPolicies} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Compare Insurance Plans
            </h1>
            <p className="text-gray-600">
              Select up to 4 policies to compare coverage, premiums, and benefits
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/policies')}
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Back to Policies
          </Button>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search policies or insurers..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="flex-1"
            />
            <select
              value={filters.insurer}
              onChange={(e) => setFilters(prev => ({ ...prev, insurer: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Insurers</option>
              {getUniqueInsurers().map(insurer => (
                <option key={insurer} value={insurer}>{insurer}</option>
              ))}
            </select>
            <select
              value={filters.premiumRange}
              onChange={(e) => setFilters(prev => ({ ...prev, premiumRange: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Premium Ranges</option>
              <option value="low">Up to ₹10,000</option>
              <option value="medium">₹10,000 - ₹25,000</option>
              <option value="high">Above ₹25,000</option>
            </select>
            {selectedPolicies.length > 0 && (
              <Button
                variant="primary"
                onClick={startComparison}
                className="w-full"
              >
                Compare {selectedPolicies.length} Selected
              </Button>
            )}
          </div>
        </div>

        {/* Selected Policies Preview */}
        {selectedPolicies.length > 0 && (
          <div className="glass-card rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Selected for Comparison ({selectedPolicies.length}/4)
              </h3>
              <Button variant="ghost" size="sm" onClick={clearSelection}>
                Clear All
              </Button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {selectedPolicies.map(policy => (
                <div key={policy.Id} className="flex-shrink-0 bg-white rounded-lg p-3 border border-primary-200 min-w-[200px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{policy.insurer}</span>
                    <button
                      onClick={() => handlePolicySelect(policy)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ApperIcon name="X" className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{policy.asset?.name}</p>
                  <p className="text-sm font-semibold gradient-text">₹{policy.premium.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Policies */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Available Policies & Quotes ({filteredPolicies.length})
          </h3>
          {filteredPolicies.length === 0 ? (
            <Empty 
              title="No policies found"
              description="Try adjusting your filters or search terms"
              action={
                <Button onClick={() => setFilters({ search: '', insurer: 'all', premiumRange: 'all', coverageType: 'all' })}>
                  Clear Filters
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPolicies.map((policy) => (
                <PolicyCard
                  key={`${policy.isQuote ? 'quote' : 'policy'}-${policy.Id}`}
                  policy={policy}
                  isComparison={true}
                  isSelected={selectedPolicies.some(p => p.Id === policy.Id)}
                  onSelect={() => handlePolicySelect(policy)}
                  className={cn(
                    "transition-all duration-200",
                    selectedPolicies.some(p => p.Id === policy.Id) 
                      ? "ring-2 ring-primary-500 shadow-elevated" 
                      : "hover:shadow-card"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Comparison Table Component
const ComparisonTable = ({ policies }) => {
  const [sortBy, setSortBy] = useState('premium');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getBestValue = (field) => {
    const values = policies.map(p => {
      switch (field) {
        case 'premium': return p.premium;
        case 'coverage': return p.coverageAmount || p.coverage?.amount;
        case 'deductible': return p.coverage?.deductible || 0;
        default: return 0;
      }
    });
    
    if (field === 'premium' || field === 'deductible') {
      return Math.min(...values);
    } else {
      return Math.max(...values);
    }
  };

  const comparisonFeatures = [
    'Cashless Claims',
    '24/7 Support',
    'Roadside Assistance',
    'Zero Depreciation',
    'Engine Protection',
    'Personal Accident Cover',
    'NCB Protection'
  ];

  return (
    <div className="space-y-6">
      {/* Quick Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {policies.map((policy, index) => (
          <div key={policy.Id} className="glass-card rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="font-bold text-primary-600">{policy.insurer.charAt(0)}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{policy.insurer}</h3>
            <p className="text-sm text-gray-600 mb-3">{policy.asset?.name}</p>
            <div className="space-y-2">
              <div className={cn(
                "text-2xl font-bold",
                policy.premium === getBestValue('premium') ? "text-accent-600" : "gradient-text"
              )}>
                ₹{policy.premium.toLocaleString()}
                {policy.premium === getBestValue('premium') && (
                  <Badge variant="success" className="ml-2 text-xs">Best Price</Badge>
                )}
              </div>
              <div className="text-sm text-gray-600">
                Coverage: ₹{(policy.coverageAmount || policy.coverage?.amount || 0).toLocaleString()}
                {(policy.coverageAmount || policy.coverage?.amount) === getBestValue('coverage') && (
                  <Badge variant="primary" className="ml-1 text-xs">Highest</Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Comparison Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-primary-50 to-blue-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Feature
                </th>
                {policies.map(policy => (
                  <th key={policy.Id} className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    {policy.insurer}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Premium */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  Annual Premium
                  <button onClick={() => handleSort('premium')} className="ml-2 text-gray-400">
                    <ApperIcon name="ArrowUpDown" className="w-4 h-4" />
                  </button>
                </td>
                {policies.map(policy => (
                  <td key={policy.Id} className="px-6 py-4 text-center">
                    <div className={cn(
                      "font-semibold",
                      policy.premium === getBestValue('premium') 
                        ? "text-accent-600" 
                        : "text-gray-900"
                    )}>
                      ₹{policy.premium.toLocaleString()}
                      {policy.premium === getBestValue('premium') && (
                        <Badge variant="success" className="ml-2 text-xs">Lowest</Badge>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Coverage Amount */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">Coverage Amount</td>
                {policies.map(policy => (
                  <td key={policy.Id} className="px-6 py-4 text-center">
                    <div className={cn(
                      "font-semibold",
                      (policy.coverageAmount || policy.coverage?.amount) === getBestValue('coverage')
                        ? "text-primary-600"
                        : "text-gray-900"
                    )}>
                      ₹{(policy.coverageAmount || policy.coverage?.amount || 0).toLocaleString()}
                      {(policy.coverageAmount || policy.coverage?.amount) === getBestValue('coverage') && (
                        <Badge variant="primary" className="ml-2 text-xs">Highest</Badge>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Deductible */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">Deductible</td>
                {policies.map(policy => (
                  <td key={policy.Id} className="px-6 py-4 text-center">
                    <div className="font-semibold text-gray-900">
                      ₹{(policy.coverage?.deductible || 0).toLocaleString()}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Features Comparison */}
              {comparisonFeatures.map(feature => (
                <tr key={feature} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{feature}</td>
                  {policies.map(policy => {
                    const hasFeature = policy.features?.includes(feature) || 
                                     (policy.features && policy.features.some(f => f.toLowerCase().includes(feature.toLowerCase())));
                    return (
                      <td key={policy.Id} className="px-6 py-4 text-center">
                        {hasFeature ? (
                          <ApperIcon name="Check" className="w-5 h-5 text-accent-600 mx-auto" />
                        ) : (
                          <ApperIcon name="X" className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => window.print()}>
          <ApperIcon name="Printer" className="w-4 h-4 mr-2" />
          Print Comparison
        </Button>
        <Button variant="primary">
          <ApperIcon name="Download" className="w-4 h-4 mr-2" />
          Export as PDF
        </Button>
      </div>
    </div>
  );
};

export default PolicyComparison;