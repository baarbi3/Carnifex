export function convertDate(duration: string) {
  if (!duration || typeof duration !== 'string') {
    console.warn("Invalid or missing duration input:", duration);
    return null;
  }

  const regex = /^(\d+)([smhd])$/i;
  const match = duration.match(regex);
  if (!match) {
    console.warn("Duration input did not match expected format (e.g., 1h, 30m):", duration);
    return null;
  }

  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();

  let milliseconds;
  switch (unit) {
    case 's':
      milliseconds = value * 1000;
      break;
    case 'm':
      milliseconds = value * 60 * 1000;
      break;
    case 'h':
      milliseconds = value * 60 * 60 * 1000;
      break;
    case 'd':
      milliseconds = value * 24 * 60 * 60 * 1000;
      break;
    default:
      console.warn("Unknown time unit in duration:", unit);
      return null;
  }
  
  const result = Math.floor(
    new Date(Date.now() + milliseconds).getTime() / 1000
  );
  console.log("Converted duration:", duration, "→", result.toLocaleString());
  return result;
}