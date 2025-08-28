import React, { useState } from "react";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PaymentModal = ({ payment, onClose, onPaymentSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [processing, setProcessing] = useState(false);

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: "CreditCard", description: "Pay securely with your card" },
    { id: "upi", name: "UPI", icon: "Smartphone", description: "Pay using UPI apps" },
    { id: "netbanking", name: "Net Banking", icon: "Landmark", description: "Pay through your bank" },
    { id: "wallet", name: "Digital Wallet", icon: "Wallet", description: "Pay using digital wallets" }
  ];

  const getStatusConfig = (status) => {
    const configs = {
      paid: { variant: "success", icon: "CheckCircle", color: "text-green-600" },
      pending: { variant: "pending", icon: "Clock", color: "text-yellow-600" },
      overdue: { variant: "error", icon: "AlertTriangle", color: "text-red-600" },
      upcoming: { variant: "primary", icon: "Calendar", color: "text-blue-600" }
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(payment.status);

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const paymentData = {
      paymentMethod: selectedMethod,
      transactionId: `TXN${Date.now()}`,
      processedAt: new Date().toISOString()
    };
    
    onPaymentSuccess(payment.Id, paymentData);
    setProcessing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="CreditCard" className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
              <p className="text-sm text-gray-500">{payment.policyNumber}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        </div>

        {/* Payment Info */}
        <div className="p-6 space-y-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Payment Status</span>
              <Badge variant={statusConfig.variant}>
                <ApperIcon name={statusConfig.icon} className="w-3 h-3 mr-1" />
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Policy</span>
                <span className="text-sm font-medium text-gray-900">{payment.policyNumber}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Insurer</span>
                <span className="text-sm font-medium text-gray-900">{payment.insurer}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Asset</span>
                <span className="text-sm font-medium text-gray-900">{payment.asset.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Due Date</span>
                <span className="text-sm font-medium text-gray-900">
                  {format(new Date(payment.dueDate), "MMM dd, yyyy")}
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-base font-semibold text-gray-900">Amount Due</span>
                <span className="text-xl font-bold gradient-text">
                  ₹{payment.amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment History */}
          {payment.paymentHistory && payment.paymentHistory.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Payment History</h3>
              <div className="space-y-2">
                {payment.paymentHistory.slice(0, 3).map((history, index) => (
                  <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        ₹{history.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">{history.method}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {format(new Date(history.date), "MMM dd, yyyy")}
                      </p>
                      <Badge variant="success" size="sm">Paid</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Methods - Only show for pending/overdue payments */}
          {(payment.status === "pending" || payment.status === "overdue") && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Select Payment Method</h3>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 transition-all duration-200 text-left",
                      selectedMethod === method.id
                        ? "border-primary-300 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        selectedMethod === method.id
                          ? "bg-primary-100"
                          : "bg-gray-100"
                      )}>
                        <ApperIcon 
                          name={method.icon} 
                          className={cn(
                            "w-5 h-5",
                            selectedMethod === method.id
                              ? "text-primary-600"
                              : "text-gray-600"
                          )} 
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{method.name}</p>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                      {selectedMethod === method.id && (
                        <ApperIcon name="CheckCircle" className="w-5 h-5 text-primary-600 ml-auto" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Close
            </Button>
            {(payment.status === "pending" || payment.status === "overdue") && (
              <Button 
                variant="primary" 
                className="flex-1" 
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <ApperIcon name="Loader" className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ApperIcon name="CreditCard" className="w-4 h-4 mr-2" />
                    Pay ₹{payment.amount.toLocaleString()}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;