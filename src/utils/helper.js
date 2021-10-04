// Helper methods to allow us to send the data in the way AWS expects it.


const getAWSDate = () => {
  let date = new Date()
  return date.toISOString().substring(0, date.indexOf('T'))
}

const getAWSTime = () => {
  let time = new Date().toISOString()
  time.substring(time.indexOf('T') + 1, time.indexOf('Z'))
}

const getEncodedJSON = myJSON => {
  var myJSONString = JSON.stringify(myJSON);
  return myJSONString.replace(/\\n/g, "\\n")
                      .replace(/\\'/g, "\\'")
                      .replace(/\\"/g, '\\"')
                      .replace(/\\&/g, "\\&")
                      .replace(/\\r/g, "\\r")
                      .replace(/\\t/g, "\\t")
                      .replace(/\\b/g, "\\b")
                      .replace(/\\f/g, "\\f");
}

/**
 * @param dateRef: Date - object of the reference
 * @param numDaysAgo: number - number of days ago
 */
const getISODaysAgoString = (dateRef, numDaysAgo) => {
  const iDateObj = new Date(dateRef.valueOf() - (numDaysAgo * 24 * 60 * 60 * 1000));
  const iDateStr = iDateObj.toISOString().split('T')[0];  
  return iDateStr;
}


export { getAWSDate , getAWSTime, getEncodedJSON, getISODaysAgoString } ; 
