import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AssetScanner from "@/components/molecules/AssetScanner";
import QuoteComparison from "@/components/molecules/QuoteComparison";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { assetService } from "@/services/api/assetService";
import { quoteService } from "@/services/api/quoteService";
import { policyService } from "@/services/api/policyService";

const AddAssetFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [assetType, setAssetType] = useState("");
  const [scannedData, setScannedData] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [purchaseData, setPurchaseData] = useState({
    personalDetails: {
      name: "",
      email: "",
      phone: "",
      address: ""
    },
    paymentMethod: "card"
  });
  const [loading, setLoading] = useState(false);

  const assetTypes = [
    { type: "car", label: "Car", icon: "Car", description: "Four-wheeler insurance" },
    { type: "bike", label: "Bike", icon: "Bike", description: "Two-wheeler insurance" },
    { type: "home", label: "Home", icon: "Home", description: "Property insurance" },
    { type: "gadget", label: "Gadget", icon: "Smartphone", description: "Electronics insurance" },
    { type: "travel", label: "Travel", icon: "Plane", description: "Trip insurance" },
    { type: "health", label: "Health", icon: "Heart", description: "Medical insurance" }
  ];

  const handleAssetTypeSelect = (type) => {
    setAssetType(type);
    setCurrentStep(2);
  };

  const handleScanComplete = async (data) => {
    setScannedData(data);
    setLoading(true);
    
    try {
      // Create asset first
      const asset = await assetService.create({
        type: assetType,
        name: data.name,
        identifiers: data.identifiers,
        images: data.images || [],
      });

      // Get quotes for this asset
      const quoteData = await quoteService.getByAssetId(asset.Id);
      setQuotes(quoteData);
      setCurrentStep(3);
    } catch (error) {
      toast.error("Failed to process asset data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuoteSelect = (quote) => {
    setSelectedQuote(quote);
    setCurrentStep(4);
  };

  const handlePurchaseComplete = async () => {
    if (!selectedQuote || !scannedData) return;
    
    setLoading(true);
    
    try {
      // Create policy
      const policy = await policyService.create({
        assetId: scannedData.id || 1,
        insurer: selectedQuote.insurer,
        premium: selectedQuote.premium,
        coverageAmount: selectedQuote.coverage?.amount || 500000,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
        documents: [],
        ncb: 0
      });

      toast.success("Policy purchased successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to complete purchase. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Select Asset Type", completed: currentStep > 1 },
    { number: 2, title: "Scan & Verify", completed: currentStep > 2 },
    { number: 3, title: "Compare Quotes", completed: currentStep > 3 },
    { number: 4, title: "Complete Purchase", completed: currentStep > 4 }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step.completed 
                    ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white" 
                    : currentStep === step.number
                    ? "bg-primary-100 text-primary-600 border-2 border-primary-300"
                    : "bg-gray-100 text-gray-400"
                }`}>
                  {step.completed ? (
                    <ApperIcon name="Check" className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.number}</span>
                  )}
                </div>
                <span className="text-xs text-gray-600 mt-2 text-center max-w-20">
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 transition-colors duration-300 ${
                  step.completed ? "bg-gradient-to-r from-primary-500 to-secondary-500" : "bg-gray-200"
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="glass-card rounded-xl p-8">
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What would you like to insure?
              </h2>
              <p className="text-gray-600">
                Select the type of asset you want to protect
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assetTypes.map((asset) => (
                <button
                  key={asset.type}
                  onClick={() => handleAssetTypeSelect(asset.type)}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 text-center group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-primary-100 group-hover:to-primary-200 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-200">
                    <ApperIcon name={asset.icon} className="w-8 h-8 text-gray-600 group-hover:text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{asset.label}</h3>
                  <p className="text-sm text-gray-500">{asset.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <AssetScanner
            assetType={assetType}
            onScanComplete={handleScanComplete}
          />
        )}

        {currentStep === 3 && quotes.length > 0 && (
          <QuoteComparison
            quotes={quotes}
            onSelectQuote={handleQuoteSelect}
          />
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Complete Your Purchase
              </h3>
              <p className="text-gray-600">
                Just a few more details to secure your coverage
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Personal Information</h4>
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={purchaseData.personalDetails.name}
                    onChange={(e) => setPurchaseData(prev => ({
                      ...prev,
                      personalDetails: { ...prev.personalDetails, name: e.target.value }
                    }))}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    value={purchaseData.personalDetails.email}
                    onChange={(e) => setPurchaseData(prev => ({
                      ...prev,
                      personalDetails: { ...prev.personalDetails, email: e.target.value }
                    }))}
                  />
                  <Input
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    value={purchaseData.personalDetails.phone}
                    onChange={(e) => setPurchaseData(prev => ({
                      ...prev,
                      personalDetails: { ...prev.personalDetails, phone: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Selected Plan</h4>
                <div className="glass-card-dark rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="font-semibold text-gray-900">{selectedQuote?.insurer}</h5>
                    <Badge variant="primary">Recommended</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Premium (Annual)</span>
                      <span className="text-sm font-medium">₹{selectedQuote?.premium?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Coverage</span>
                      <span className="text-sm font-medium">₹{selectedQuote?.coverage?.amount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={purchaseData.paymentMethod === "card"}
                          onChange={(e) => setPurchaseData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                          className="text-primary-600 focus:ring-primary-500"
                        />
                        <ApperIcon name="CreditCard" className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">Credit/Debit Card</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="upi"
                          checked={purchaseData.paymentMethod === "upi"}
                          onChange={(e) => setPurchaseData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                          className="text-primary-600 focus:ring-primary-500"
                        />
                        <ApperIcon name="Smartphone" className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">UPI Payment</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(3)}
                disabled={loading}
              >
                Back to Quotes
              </Button>
              <Button
                variant="primary"
                onClick={handlePurchaseComplete}
                disabled={loading || !purchaseData.personalDetails.name || !purchaseData.personalDetails.email}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Shield" className="w-4 h-4 mr-2" />
                    Complete Purchase - ₹{selectedQuote?.premium?.toLocaleString()}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Navigation Buttons for Steps 2-3 */}
        {(currentStep === 2 || currentStep === 3) && (
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={loading}
            >
              Back
            </Button>
            {loading && (
              <div className="flex items-center gap-2 text-primary-600">
                <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddAssetFlow;