
export const getCountryFlag = (countryCode: string) => {
  if (!countryCode) return '🌍';
  try {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return '🌍';
  }
};

export const getCurrentDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  let deviceName = "Unknown Device";
  let deviceType = "desktop";
  
  if (/iPhone/.test(userAgent)) {
    deviceName = "iPhone";
    deviceType = "mobile";
  } else if (/iPad/.test(userAgent)) {
    deviceName = "iPad";
    deviceType = "tablet";
  } else if (/Android/.test(userAgent)) {
    deviceName = "Android Device";
    deviceType = "mobile";
  } else if (/Windows/.test(userAgent)) {
    deviceName = "Windows PC";
  } else if (/Mac/.test(userAgent)) {
    deviceName = "MacBook";
  } else if (/Linux/.test(userAgent)) {
    deviceName = "Linux PC";
  }
  
  return { deviceName, deviceType };
};
