import React from "react";
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
      </div>
    </div>
  );
};

export default AddAsset;