import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const AssetScanner = ({ 
  assetType,
  onScanComplete,
  className,
  ...props 
}) => {
  const [scanMode, setScanMode] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [scanning, setScanning] = useState(false);

  const getScanConfig = (type) => {
    const configs = {
      car: { 
        label: "Vehicle RC/VIN Scanner", 
        placeholder: "Enter RC Number or VIN",
        icon: "Car",
        scanText: "Scan RC Book"
      },
      bike: { 
        label: "Vehicle RC/VIN Scanner", 
        placeholder: "Enter RC Number or VIN",
        icon: "Bike",
        scanText: "Scan RC Book"
      },
      gadget: { 
        label: "IMEI Scanner", 
        placeholder: "Enter IMEI Number",
        icon: "Smartphone",
        scanText: "Scan IMEI"
      },
      home: { 
        label: "Address Scanner", 
        placeholder: "Enter Property Address",
        icon: "Home",
        scanText: "Scan Address"
      },
      travel: { 
        label: "Passport Scanner", 
        placeholder: "Enter Passport Number",
        icon: "Plane",
        scanText: "Scan Passport"
      },
      health: { 
        label: "Health ID Scanner", 
        placeholder: "Enter Health ID",
        icon: "Heart",
        scanText: "Scan Health Card"
      }
    };
    return configs[type] || configs.car;
  };

  const config = getScanConfig(assetType);

  const simulateScan = async () => {
    setScanning(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate AI-detected data
    const mockData = {
      car: {
        identifiers: { rc: "MH01AB1234", vin: "MBJKS1234567890123" },
        name: "Honda City 2022",
        details: { make: "Honda", model: "City", year: 2022, fuel: "Petrol" }
      },
      bike: {
        identifiers: { rc: "MH02CD5678", vin: "MD2A1234567890123" },
        name: "Honda Activa 125",
        details: { make: "Honda", model: "Activa", year: 2023, engine: "125cc" }
      },
      gadget: {
        identifiers: { imei: "123456789012345" },
        name: "iPhone 14 Pro",
        details: { brand: "Apple", model: "iPhone 14 Pro", storage: "128GB" }
      },
      home: {
        identifiers: { address: "123 Main St, Mumbai 400001" },
        name: "Residential Property",
        details: { type: "Apartment", area: "1200 sq ft", location: "Bandra" }
      },
      travel: {
        identifiers: { passport: "A1234567" },
        name: "Travel Insurance",
        details: { destination: "Europe", duration: "15 days" }
      },
      health: {
        identifiers: { healthId: "HID123456789" },
        name: "Health Insurance",
        details: { age: 35, coverage: "Family Floater" }
      }
    };
    
    setScanning(false);
    onScanComplete?.(mockData[assetType] || mockData.car);
  };

  const handleManualSubmit = () => {
    if (!manualInput.trim()) return;
    
    const mockData = {
      identifiers: { [assetType === 'gadget' ? 'imei' : assetType === 'home' ? 'address' : 'rc']: manualInput },
      name: `Manual ${assetType} Entry`,
      details: { manually_entered: true }
    };
    
    onScanComplete?.(mockData);
  };

  return (
    <div className={cn("space-y-6", className)} {...props}>
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={config.icon} className="w-8 h-8 text-primary-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{config.label}</h3>
        <p className="text-gray-600">Scan or manually enter your {assetType} details</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Scan Option */}
        <div className="glass-card rounded-xl p-6 text-center">
          <ApperIcon name="Camera" className="w-12 h-12 text-primary-500 mx-auto mb-4" />
          <h4 className="font-semibold text-gray-900 mb-2">AI Scan</h4>
          <p className="text-sm text-gray-600 mb-4">
            Use AI to automatically detect and fill details
          </p>
          <Button 
            variant="primary" 
            onClick={simulateScan}
            disabled={scanning}
            className="w-full"
          >
            {scanning ? (
              <>
                <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <ApperIcon name="Scan" className="w-4 h-4 mr-2" />
                {config.scanText}
              </>
            )}
          </Button>
        </div>

        {/* Manual Option */}
        <div className="glass-card rounded-xl p-6 text-center">
          <ApperIcon name="Edit3" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="font-semibold text-gray-900 mb-2">Manual Entry</h4>
          <p className="text-sm text-gray-600 mb-4">
            Enter details manually if scanning is not available
          </p>
          <div className="space-y-3">
            <Input
              placeholder={config.placeholder}
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
            />
            <Button 
              variant="outline" 
              onClick={handleManualSubmit}
              disabled={!manualInput.trim()}
              className="w-full"
            >
              <ApperIcon name="ArrowRight" className="w-4 h-4 mr-2" />
              Continue
            </Button>
          </div>
        </div>
      </div>

      {scanning && (
        <div className="glass-card rounded-xl p-8 text-center">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-primary-200 rounded-lg"></div>
            <div className="absolute inset-2 border-2 border-primary-400 rounded animate-pulse"></div>
            <div className="absolute inset-4 bg-primary-100 rounded flex items-center justify-center">
              <ApperIcon name={config.icon} className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-2">AI Scanning in Progress</p>
          <p className="text-gray-600">Please hold steady while we detect your {assetType} details...</p>
        </div>
      )}
    </div>
  );
};

export default AssetScanner;