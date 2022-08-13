// A very simple logger function to load nicely formatted data to CloudWatch
export const logInfo = (message: string, object?: any) => {
  const logMessage = message + (object ? ":\n" + JSON.stringify(object, null, 2) : "");
  console.log(logMessage);
}