import React, { useEffect, useState } from "react";
import { paymentService } from "@/services/api/paymentService";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import PaymentModal from "@/components/molecules/PaymentModal";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const PaymentHistory = ({ searchTerm = "", filterStatus = "all" }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // list or calendar
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentService.getAll();
      setPayments(data);
    } catch (err) {
      setError("Failed to load payment history");
      console.error("Error loading payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = (payment) => {
    setSelectedPayment(payment);
    setModalOpen(true);
  };

  const handlePaymentSuccess = async (paymentId, paymentData) => {
    try {
      await paymentService.update(paymentId, { 
        status: "paid", 
        paidDate: new Date().toISOString(),
        ...paymentData 
      });
      await loadPayments();
      toast.success("Payment processed successfully");
      setModalOpen(false);
      setSelectedPayment(null);
    } catch (err) {
      toast.error("Payment processing failed");
      console.error("Payment error:", err);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      paid: { variant: "success", icon: "CheckCircle", color: "text-green-600" },
      pending: { variant: "pending", icon: "Clock", color: "text-yellow-600" },
      overdue: { variant: "error", icon: "AlertTriangle", color: "text-red-600" },
      upcoming: { variant: "primary", icon: "Calendar", color: "text-blue-600" }
    };
    return configs[status] || configs.pending;
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = searchTerm === "" || 
      payment.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.insurer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.amount.toString().includes(searchTerm);
    
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPayments} />;

  const renderListView = () => (
    <div className="space-y-4">
      {filteredPayments.map((payment) => {
        const statusConfig = getStatusConfig(payment.status);
        
        return (
          <Card key={payment.Id} className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="CreditCard" className="w-6 h-6 text-primary-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {payment.policyNumber}
                    </h3>
                    <Badge variant={statusConfig.variant}>
                      <ApperIcon name={statusConfig.icon} className="w-3 h-3 mr-1" />
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </Badge>
<p className="text-sm text-gray-600 mb-1">{payment.insurer}</p>
                  <p className="text-sm text-gray-500">{payment.asset?.name || payment.assetName || 'Policy Asset'}</p>
                </div>
              </div>
              
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    ₹{payment.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Due: {format(new Date(payment.dueDate), "MMM dd, yyyy")}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  {payment.status === "pending" && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handlePayNow(payment)}
                    >
                      Pay Now
                    </Button>
                  )}
                  {payment.status === "overdue" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handlePayNow(payment)}
                    >
                      Pay Overdue
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPayment(payment);
                      setModalOpen(true);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
            
            {payment.description && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{payment.description}</p>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );

  const renderCalendarView = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const monthPayments = filteredPayments.filter(payment => {
      const paymentDate = new Date(payment.dueDate);
      return paymentDate.getMonth() === currentMonth && 
             paymentDate.getFullYear() === currentYear;
    });

    const getDaysInMonth = (date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: firstDay }, (_, i) => null);

    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {format(currentDate, "MMMM yyyy")} Payment Calendar
          </h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Paid</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Overdue</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 text-center font-medium text-gray-500 text-sm">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {[...emptyDays, ...days].map((day, index) => {
            if (!day) {
              return <div key={index} className="p-2"></div>;
            }
            
            const dayPayments = monthPayments.filter(payment => {
              const paymentDate = new Date(payment.dueDate);
              return paymentDate.getDate() === day;
            });
            
            return (
              <div key={day} className="relative p-2 border border-gray-200 rounded-lg min-h-[80px]">
                <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
                {dayPayments.map((payment, idx) => {
                  const statusConfig = getStatusConfig(payment.status);
                  return (
                    <div
                      key={idx}
                      className={`text-xs p-1 rounded mb-1 cursor-pointer ${
                        payment.status === "paid" ? "bg-green-100 text-green-800" :
                        payment.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}
                      onClick={() => {
                        setSelectedPayment(payment);
                        setModalOpen(true);
                      }}
                      title={`${payment.policyNumber} - ₹${payment.amount.toLocaleString()}`}
                    >
                      ₹{(payment.amount / 1000).toFixed(0)}K
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "list" ? "primary" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <ApperIcon name="List" className="w-4 h-4 mr-2" />
              List View
            </Button>
            <Button
              variant={viewMode === "calendar" ? "primary" : "outline"}
              size="sm"
              onClick={() => setViewMode("calendar")}
            >
              <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
              Calendar View
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredPayments.length === 0 ? (
        <Empty 
          icon="CreditCard" 
          title="No payments found"
          description="No payment records match your current filters."
        />
      ) : (
        viewMode === "list" ? renderListView() : renderCalendarView()
      )}

      {/* Payment Modal */}
      {modalOpen && selectedPayment && (
        <PaymentModal
          payment={selectedPayment}
          onClose={() => {
            setModalOpen(false);
            setSelectedPayment(null);
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default PaymentHistory;