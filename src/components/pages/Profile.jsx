import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [personalInfo, setPersonalInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    address: "123 Main Street, Mumbai, MH 400001",
    dateOfBirth: "1990-05-15",
    panNumber: "ABCDE1234F",
    aadharNumber: "1234 5678 9012"
  });
  
  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      sms: true,
      push: false,
      renewalReminders: true,
      claimUpdates: true,
      promotions: false
    },
    language: "en",
    currency: "INR"
  });

  const tabs = [
    { id: "personal", label: "Personal Info", icon: "User" },
    { id: "preferences", label: "Preferences", icon: "Settings" },
    { id: "security", label: "Security", icon: "Shield" },
    { id: "support", label: "Support", icon: "HelpCircle" }
  ];

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            value={personalInfo.name}
            onChange={(e) => setPersonalInfo(prev => ({ ...prev, name: e.target.value }))}
          />
          <Input
            label="Email Address"
            type="email"
            value={personalInfo.email}
            onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
          />
          <Input
            label="Phone Number"
            value={personalInfo.phone}
            onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
          />
          <Input
            label="Date of Birth"
            type="date"
            value={personalInfo.dateOfBirth}
            onChange={(e) => setPersonalInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
          />
          <Input
            label="PAN Number"
            value={personalInfo.panNumber}
            onChange={(e) => setPersonalInfo(prev => ({ ...prev, panNumber: e.target.value }))}
          />
          <Input
            label="Aadhar Number"
            value={personalInfo.aadharNumber}
            onChange={(e) => setPersonalInfo(prev => ({ ...prev, aadharNumber: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
        <textarea
          className="block w-full px-3 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
          rows="3"
          value={personalInfo.address}
          onChange={(e) => setPersonalInfo(prev => ({ ...prev, address: e.target.value }))}
        />
      </div>

      <div className="flex justify-end">
        <Button variant="primary">
          <ApperIcon name="Save" className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {Object.entries(preferences.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-sm text-gray-600">
                  {key === "renewalReminders" && "Get notified about upcoming policy renewals"}
                  {key === "claimUpdates" && "Receive updates about your claim status"}
                  {key === "promotions" && "Get offers and promotional content"}
                  {key === "email" && "Receive notifications via email"}
                  {key === "sms" && "Receive notifications via SMS"}
                  {key === "push" && "Get push notifications on your device"}
                </p>
              </div>
              <button
                onClick={() => setPreferences(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, [key]: !value }
                }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  value ? "bg-primary-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    value ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <select
            value={preferences.language}
            onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
            className="block w-full px-3 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="mr">मराठी</option>
            <option value="gu">ગુજરાતી</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select
            value={preferences.currency}
            onChange={(e) => setPreferences(prev => ({ ...prev, currency: e.target.value }))}
            className="block w-full px-3 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="INR">Indian Rupee (₹)</option>
            <option value="USD">US Dollar ($)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="primary">
          <ApperIcon name="Save" className="w-4 h-4 mr-2" />
          Save Preferences
        </Button>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
          </div>
          <Badge variant="success">Enabled</Badge>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="Key" className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Password</h4>
              <p className="text-sm text-gray-600">Last changed 3 months ago</p>
            </div>
          </div>
          <Button variant="outline" size="sm">Change Password</Button>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="Smartphone" className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Trusted Devices</h4>
              <p className="text-sm text-gray-600">Manage devices that can access your account</p>
            </div>
          </div>
          <Button variant="outline" size="sm">Manage Devices</Button>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="Activity" className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Login Activity</h4>
              <p className="text-sm text-gray-600">View recent login history and suspicious activity</p>
            </div>
          </div>
          <Button variant="outline" size="sm">View Activity</Button>
        </div>
      </Card>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-elevated transition-all duration-300 cursor-pointer">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="MessageCircle" className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">24/7 Chat Support</h3>
            <p className="text-sm text-gray-600 mb-4">Get instant help from our support team</p>
            <Button variant="primary" size="sm">Start Chat</Button>
          </div>
        </Card>

        <Card className="hover:shadow-elevated transition-all duration-300 cursor-pointer">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Phone" className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-sm text-gray-600 mb-4">Call our helpline for immediate assistance</p>
            <Button variant="success" size="sm">Call Now</Button>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {[
            "How do I file an insurance claim?",
            "When will my policy renewal reminder be sent?",
            "How can I update my personal information?",
            "What documents do I need for claim processing?",
            "How to download my policy certificate?"
          ].map((question, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
              <span className="text-sm text-gray-700">{question}</span>
              <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="Star" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Rate Our App</h3>
            <p className="text-sm text-gray-600">Help us improve by sharing your feedback</p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto">
            <ApperIcon name="ExternalLink" className="w-4 h-4 mr-2" />
            Rate App
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-2xl flex items-center justify-center">
            <ApperIcon name="User" className="w-10 h-10 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{personalInfo.name}</h1>
            <p className="text-gray-600">{personalInfo.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="success">Verified</Badge>
              <Badge variant="primary">Premium User</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex space-x-1 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "personal" && renderPersonalInfo()}
        {activeTab === "preferences" && renderPreferences()}
        {activeTab === "security" && renderSecurity()}
        {activeTab === "support" && renderSupport()}
      </div>
    </div>
  );
};

export default Profile;