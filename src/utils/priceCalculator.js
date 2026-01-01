// Pricing based on destination and duration
const PRICE_PER_DAY = {
  'local': 5,      // Local destinations
  'regional': 10,  // Regional (GCC, etc.)
  'international': 15, // International
}

const DESTINATION_ZONES = {
  'local': ['السعودية', 'الإمارات', 'الكويت', 'البحرين', 'قطر', 'عمان'],
  'regional': ['مصر', 'الأردن', 'لبنان', 'سوريا', 'تونس', 'المغرب', 'تركيا'],
  'international': ['أمريكا', 'كندا', 'بريطانيا', 'فرنسا', 'ألمانيا', 'إيطاليا', 'أستراليا', 'اليابان', 'الصين']
}

export const calculatePrice = (destination, startDate, endDate) => {
  if (!destination || !startDate || !endDate) {
    return 0
  }

  // Calculate duration in days
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // Include both start and end days

  // Determine zone
  let zone = 'international'
  for (const [key, countries] of Object.entries(DESTINATION_ZONES)) {
    if (countries.includes(destination)) {
      zone = key
      break
    }
  }

  // Calculate base price
  const basePrice = PRICE_PER_DAY[zone] * diffDays

  // Add minimum charge
  const minimumPrice = zone === 'local' ? 50 : zone === 'regional' ? 100 : 200
  const finalPrice = Math.max(basePrice, minimumPrice)

  return {
    price: finalPrice,
    duration: diffDays,
    zone,
    basePrice,
    minimumPrice
  }
}

export const getDestinationsByZone = () => {
  return DESTINATION_ZONES
}

