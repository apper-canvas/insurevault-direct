import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { emergencyService } from '@/services/api/emergencyService';

const EmergencyAssistance = () => {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);

  const handleEmergencyCall = (phone, serviceName) => {
    toast.info(`Connecting to ${serviceName}...`);
    window.open(`tel:${phone}`, '_self');
  };

  const handleRoadsideRequest = async (serviceId) => {
    setLoading(true);
    try {
      const currentLocation = await emergencyService.getCurrentLocation();
      setLocation(currentLocation);
      
      const response = await emergencyService.requestService(serviceId, currentLocation.address);
      toast.success(`${response.service} dispatched! ETA: ${response.estimatedArrival}. Request ID: ${response.requestId}`);
    } catch (error) {
      toast.error('Failed to request service. Please call directly.');
    } finally {
      setLoading(false);
    }
  };

  const handleImmediateClaimHelp = () => {
    toast.info('Connecting to claims emergency line...');
    window.open('tel:1-800-CLAIM-NOW', '_self');
  };

  const emergencyContacts = emergencyService.getContactsByType('emergency');
  const insuranceContacts = emergencyService.getContactsByType('insurance');
  const roadsideServices = emergencyService.getRoadsideServices();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertTriangle" className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency Assistance</h1>
        <p className="text-gray-600">Get immediate help when you need it most</p>
      </div>

      {/* Emergency Contacts */}
      <Card variant="elevated" className="border-l-4 border-error">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-error rounded-lg flex items-center justify-center">
            <ApperIcon name="Phone" className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Emergency Contacts</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {emergencyContacts.map((contact) => (
            <Button
              key={contact.Id}
              variant="outline"
              size="lg"
              className="h-auto p-4 justify-start border-error text-error hover:bg-error hover:text-white"
              onClick={() => handleEmergencyCall(contact.phone, contact.service)}
            >
              <div className="text-left">
                <div className="font-semibold">{contact.service}</div>
                <div className="text-sm opacity-75">{contact.phone}</div>
                <div className="text-xs opacity-60">{contact.description}</div>
              </div>
            </Button>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-error/10 rounded-lg">
          <p className="text-sm text-error font-medium flex items-center gap-2">
            <ApperIcon name="AlertTriangle" className="w-4 h-4" />
            Call 911 for life-threatening emergencies
          </p>
        </div>
      </Card>

      {/* Roadside Assistance */}
      <Card variant="elevated" className="border-l-4 border-warning">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-warning rounded-lg flex items-center justify-center">
            <ApperIcon name="Truck" className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Roadside Assistance</h2>
        </div>
        
        {location && (
          <div className="mb-4 p-3 bg-accent-50 rounded-lg border border-accent-200">
            <p className="text-sm text-accent-700 flex items-center gap-2">
              <ApperIcon name="MapPin" className="w-4 h-4" />
              Current location: {location.address}
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {roadsideServices.map((service) => (
            <Card key={service.Id} variant="default" className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name={service.icon} className="w-5 h-5 text-warning" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{service.service}</h3>
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={loading}
                      onClick={() => handleRoadsideRequest(service.Id)}
                      className="flex-1"
                    >
                      {loading ? (
                        <>
                          <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                          Requesting...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="Send" className="w-4 h-4 mr-2" />
                          Request Service
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEmergencyCall(service.phone, service.service)}
                    >
                      <ApperIcon name="Phone" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-warning/10 rounded-lg">
          <p className="text-sm text-warning font-medium">
            Average response time: 30-45 minutes • Available 24/7
          </p>
        </div>
      </Card>

      {/* Immediate Claim Help */}
      <Card variant="elevated" className="border-l-4 border-info">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-info rounded-lg flex items-center justify-center">
            <ApperIcon name="FileText" className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Immediate Claim Help</h2>
        </div>
        
        <div className="space-y-3">
          <Card variant="default" className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Emergency Claim Filing</h3>
                <p className="text-sm text-gray-600">Fast-track claim processing for emergencies</p>
                <p className="text-xs text-info mt-1">Available 24/7 • Average wait: 5-10 minutes</p>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={handleImmediateClaimHelp}
                className="bg-info hover:bg-blue-600"
              >
                <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
                Call Now
              </Button>
            </div>
          </Card>
          
          {insuranceContacts.map((contact) => (
            <Card key={contact.Id} variant="default" className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{contact.service}</h3>
                  <p className="text-sm text-gray-600">{contact.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {contact.available} • ETA: {contact.estimatedResponse}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleEmergencyCall(contact.phone, contact.service)}
                >
                  <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
                  {contact.phone}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Safety Tips */}
      <Card variant="default" className="bg-accent-50 border-accent-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="Shield" className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Safety First</h2>
        </div>
        
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <ApperIcon name="CheckCircle" className="w-4 h-4 text-accent-500 mt-0.5 flex-shrink-0" />
            <span>Move to a safe location away from traffic if possible</span>
          </div>
          <div className="flex items-start gap-2">
            <ApperIcon name="CheckCircle" className="w-4 h-4 text-accent-500 mt-0.5 flex-shrink-0" />
            <span>Turn on hazard lights and set up warning triangles</span>
          </div>
          <div className="flex items-start gap-2">
            <ApperIcon name="CheckCircle" className="w-4 h-4 text-accent-500 mt-0.5 flex-shrink-0" />
            <span>Take photos of damage and gather insurance information</span>
          </div>
          <div className="flex items-start gap-2">
            <ApperIcon name="CheckCircle" className="w-4 h-4 text-accent-500 mt-0.5 flex-shrink-0" />
            <span>Stay with your vehicle and wait for assistance</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EmergencyAssistance;