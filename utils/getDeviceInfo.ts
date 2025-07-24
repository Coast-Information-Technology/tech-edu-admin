export function getDeviceInfo(): string {
  if (typeof navigator !== "undefined") {
    const { userAgent, platform } = navigator;
    return `${userAgent} on ${platform}`;
  }
  return "Unknown device";
}
