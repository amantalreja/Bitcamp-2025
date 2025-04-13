// SampleData.js

function generateRandomMerchantData(numEntries) {
  // Define some realistic options
  const merchantCategories = [
    "Retail",
    "E-commerce",
    "Grocery",
    "Fashion",
    "Electronics",
    "Automotive",
    "Home & Garden",
    "Health & Beauty",
    "Sports & Outdoors"
  ];

  // List of all 50 states
  const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma",
    "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
    "West Virginia", "Wisconsin", "Wyoming"
  ];

  // Additional merchant name fragments for more variety
  const merchantPrefixes = [
    "Super", "Mega", "Ultra", "Best", "Elite", "Quality", "Value", "Prime"
  ];
  const merchantSuffixes = [
    "Store", "Outlet", "Mart", "Center", "Bazaar", "Depot", "Express", "Market"
  ];

  // Ensure that every state is included by creating a long array that repeats the full states array.
  const baseStates = [];
  while (baseStates.length < numEntries) {
    baseStates.push(...states);
  }
  // Slice to exactly numEntries and then shuffle the result.
  const assignedStates = baseStates.slice(0, numEntries);

  // Shuffle using Fisher-Yates algorithm
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  shuffleArray(assignedStates);

  const sampleData = [];

  for (let i = 0; i < numEntries; i++) {
    const randomCategory = merchantCategories[Math.floor(Math.random() * merchantCategories.length)];
    const randomState = assignedStates[i]; // Ensures every state is covered
    const randomPrefix = merchantPrefixes[Math.floor(Math.random() * merchantPrefixes.length)];
    const randomSuffix = merchantSuffixes[Math.floor(Math.random() * merchantSuffixes.length)];

    // Construct a realistic merchant name
    const merchantName = `${randomPrefix} ${randomCategory} ${randomSuffix} ${i + 1}`;

    // Generate a realistic number for totalTransactions (between 100 and 10,000)
    const totalTransactions = Math.floor(Math.random() * 9900) + 100;

    // Calculate the number of disputes as a fraction (up to 20% of transactions)
    const numberOfDisputes = Math.floor(totalTransactions * (Math.random() * 0.2));

    // Calculate dispute rate (percentage) based on disputes / total transactions
    const disputeRate = totalTransactions
      ? parseFloat(((numberOfDisputes / totalTransactions) * 100).toFixed(2))
      : 0;

    // Random denied percentage between 0 and 100
    const deniedPercentage = Math.floor(Math.random() * 101);

    // Average resolution time (between 1 and 30 days)
    const avgResolutionTime = `${Math.floor(Math.random() * 30) + 1} days`;

    // Create a random establishment date between 2000-01-01 and 2021-12-31
    const year = Math.floor(Math.random() * 22) + 2000; // 2000 to 2021
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1; // To simplify, always use up to 28
    const dateEstablished = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

    // Average transaction value between $5 and $500
    const avgTransactionValue = parseFloat((Math.random() * 495 + 5).toFixed(2));

    // Assemble the merchant object
    sampleData.push({
      merchantId: `M-${i + 1}`,
      merchantName,
      state: randomState,
      numberOfDisputes,
      deniedPercentage,
      totalTransactions,
      disputeRate,
      avgResolutionTime,
      merchantCategory: randomCategory,
      dateEstablished,
      avgTransactionValue
    });
  }

  return sampleData;
}

const tableData = generateRandomMerchantData(2000); // Generates 2000 entries

export default tableData;
