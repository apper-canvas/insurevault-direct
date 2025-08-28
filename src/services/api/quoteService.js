import quoteData from "@/services/mockData/quotes.json";

export const quoteService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...quoteData];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const quote = quoteData.find(item => item.Id === parseInt(id));
    if (!quote) {
      throw new Error("Quote not found");
    }
    return { ...quote };
  },

  getByAssetId: async (assetId) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const assetQuotes = quoteData.filter(quote => quote.assetId === parseInt(assetId));
    
    // Generate additional mock quotes if none exist for this asset
    if (assetQuotes.length === 0) {
      const mockQuotes = [
        {
          Id: Date.now(),
          assetId: parseInt(assetId),
          insurer: "HDFC ERGO",
          planName: "Comprehensive Plan",
          premium: 15000,
          coverage: { amount: 500000, deductible: 5000 },
          features: ["Cashless Claims", "24/7 Support", "Zero Depreciation"],
          exclusions: ["Consequential losses", "Mechanical breakdown"]
        },
        {
          Id: Date.now() + 1,
          assetId: parseInt(assetId),
          insurer: "Bajaj Allianz",
          planName: "Premium Plan",
          premium: 14500,
          coverage: { amount: 500000, deductible: 7500 },
          features: ["Cashless Claims", "Engine Protection", "NCB Protection"],
          exclusions: ["Pre-existing damage", "Racing activities"]
        },
        {
          Id: Date.now() + 2,
          assetId: parseInt(assetId),
          insurer: "ICICI Lombard",
          planName: "Gold Plan",
          premium: 16500,
          coverage: { amount: 500000, deductible: 3000 },
          features: ["Network Claims", "Emergency Assistance", "Tyre Protection"],
          exclusions: ["Intentional damage", "Commercial use"]
        }
      ];
      return mockQuotes;
    }
    
    return [...assetQuotes];
  },

  create: async (quoteInfo) => {
    await new Promise(resolve => setTimeout(resolve, 350));
    const highestId = Math.max(...quoteData.map(item => item.Id));
    const newQuote = {
      Id: highestId + 1,
      ...quoteInfo
    };
    quoteData.push(newQuote);
    return { ...newQuote };
  }
};