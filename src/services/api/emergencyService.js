// Emergency Assistance Service
// Provides quick access to roadside assistance, emergency contacts, and immediate help

const emergencyContacts = [
  {
    Id: 1,
    type: 'roadside',
    service: 'Roadside Assistance',
    phone: '1-800-ROADHELP',
    description: '24/7 towing, flat tire, lockout, jump start',
    available: '24/7',
    estimatedResponse: '30-45 minutes'
  },
  {
    Id: 2,
    type: 'roadside',
    service: 'Emergency Towing',
    phone: '1-800-EMERGENCY',
    description: 'Immediate towing for accidents and breakdowns',
    available: '24/7',
    estimatedResponse: '20-30 minutes'
  },
  {
    Id: 3,
    type: 'emergency',
    service: 'Police Emergency',
    phone: '911',
    description: 'Life-threatening emergencies only',
    available: '24/7',
    estimatedResponse: 'Immediate'
  },
  {
    Id: 4,
    type: 'emergency',
    service: 'Fire Emergency',
    phone: '911',
    description: 'Fire, medical emergencies',
    available: '24/7',
    estimatedResponse: 'Immediate'
  },
  {
    Id: 5,
    type: 'insurance',
    service: 'Claims Emergency Line',
    phone: '1-800-CLAIM-NOW',
    description: 'Immediate claim filing for emergencies',
    available: '24/7',
    estimatedResponse: '5-10 minutes'
  },
  {
    Id: 6,
    type: 'insurance',
    service: 'Insurance Hotline',
    phone: '1-800-INSURE-ME',
    description: 'Policy questions and immediate assistance',
    available: 'Mon-Fri 8AM-8PM',
    estimatedResponse: '2-5 minutes'
  }
];

const roadsideServices = [
  {
    Id: 1,
    service: 'Towing Service',
    description: 'Vehicle towing to nearest repair facility',
    icon: 'Truck',
    phone: '1-800-ROADHELP'
  },
  {
    Id: 2,
    service: 'Flat Tire Assistance',
    description: 'Tire change or repair service',
    icon: 'CircleDot',
    phone: '1-800-ROADHELP'
  },
  {
    Id: 3,
    service: 'Lockout Service',
    description: 'Vehicle unlocking service',
    icon: 'Key',
    phone: '1-800-ROADHELP'
  },
  {
    Id: 4,
    service: 'Battery Jump Start',
    description: 'Battery boost and testing',
    icon: 'Zap',
    phone: '1-800-ROADHELP'
  }
];

// Simulate emergency service request
const requestEmergencyService = async (serviceId, location = null) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const service = emergencyContacts.find(s => s.Id === serviceId);
  if (!service) {
    throw new Error('Emergency service not found');
  }
  
  return {
    requestId: `EMG${Date.now()}`,
    service: service.service,
    estimatedArrival: service.estimatedResponse,
    phone: service.phone,
    location: location || 'Current location',
    status: 'dispatched',
    timestamp: new Date().toISOString()
  };
};

export const emergencyService = {
  // Get all emergency contacts
  getAllContacts: () => [...emergencyContacts],
  
  // Get roadside services
  getRoadsideServices: () => [...roadsideServices],
  
  // Get contacts by type
  getContactsByType: (type) => emergencyContacts.filter(contact => contact.type === type),
  
  // Request emergency service
  requestService: requestEmergencyService,
  
  // Get current location (mock)
  getCurrentLocation: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      latitude: 40.7128,
      longitude: -74.0060,
      address: '123 Main St, New York, NY 10001'
    };
  }
};