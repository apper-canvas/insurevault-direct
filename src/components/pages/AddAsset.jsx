import React from "react";
import Button from "@/components/atoms/Button";
import Policies from "@/components/pages/Policies";
import AddAssetFlow from "@/components/organisms/AddAssetFlow";

const AddAsset = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Add New Insurance Policy</h1>
          <p className="text-gray-600">Protect your assets with comprehensive insurance coverage</p>
        </div>
<AddAssetFlow />
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Already have policies to compare?</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/policies/compare'}
          >
            Compare Existing Policies
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddAsset;