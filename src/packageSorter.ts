export interface Package {
  id: string;
  width: number;
  height: number;
  length: number;
  mass: number;
  result: string;
  reason: string;
  timestamp: Date;
}

export interface SortResult {
  classification: string;
  reason: string;
}

export function sort(width: number, height: number, length: number, mass: number): string {
  const result = sortWithReason(width, height, length, mass);
  return result.classification;
}

export interface SortConfig {
  volumeThreshold: number;
  dimensionThreshold: number;
  massThreshold: number;
}

const defaultConfig: SortConfig = {
  volumeThreshold: 1000000,
  dimensionThreshold: 150,
  massThreshold: 20
};

export function sortWithReason(
  width: number, 
  height: number, 
  length: number, 
  mass: number, 
  config: SortConfig = defaultConfig
): SortResult {
  // Input validation
  if (width <= 0 || height <= 0 || length <= 0 || mass <= 0) {
    throw new Error("All dimensions and mass must be positive numbers");
  }
  
  // Calculate volume
  const volume = width * height * length;
  
  // Check if package is bulky and determine reason
  const maxDimension = Math.max(width, height, length);
  const isBulkyByVolume = volume >= config.volumeThreshold;
  const isBulkyByDimension = maxDimension >= config.dimensionThreshold;
  const isBulky = isBulkyByVolume || isBulkyByDimension;
  
  // Check if package is heavy
  const isHeavy = mass >= config.massThreshold;
  
  // Determine reason for classification
  let reason = "";
  let bulkyReason = "";
  
  if (isBulkyByVolume && isBulkyByDimension) {
    bulkyReason = `oversized (volume: ${volume.toLocaleString()} cm³, max dimension: ${maxDimension} cm)`;
  } else if (isBulkyByVolume) {
    bulkyReason = `oversized (volume: ${volume.toLocaleString()} cm³)`;
  } else if (isBulkyByDimension) {
    bulkyReason = `oversized (max dimension: ${maxDimension} cm)`;
  }
  
  // Sort packages according to rules
  if (isHeavy && isBulky) {
    reason = `overweight (${mass} kg) and ${bulkyReason}`;
    return { classification: "REJECTED", reason };
  } else if (isHeavy) {
    reason = `overweight (${mass} kg)`;
    return { classification: "SPECIAL", reason };
  } else if (isBulky) {
    reason = bulkyReason;
    return { classification: "SPECIAL", reason };
  } else {
    return { classification: "STANDARD", reason: "" };
  }
}