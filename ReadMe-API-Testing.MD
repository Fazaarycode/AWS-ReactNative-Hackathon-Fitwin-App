### Create a mutation

mutation create {
  createMetrics(input:{
    id: "abc",
    email: "yello@hello.com",
    date:"2021-10-02",
    startTime:"18:57:43.629",
    endTime:"18:57:43.629",
    distanceInMeters: 3123
  }) {
    id
    email
  }
}

### Display All items
query {
  listMetrics {
    items {
      id
      email
      distanceInMeters
    }
  }
}

### Display by User ID (Query)

{
  listMetrics(filter: {id: {eq: "abc"}}) {
    items {
      id
      email
      distanceInMeters
      startTime
      endTime
      date
    }
  }
}

# Create Preferences:
# Example 1:
mutation create {
  createPreferences(input : {
    id: "aa",
    email:"yellow@hellow.com",
    preferences: "{\"name\":\"test\"}",
  }) {
    id
    preferences
  }
}

# Example 2: 

mutation create {
  createPreferences(input : {
    id: "a32",
    email:"yellow@hellow.com",
    preferences: "[\"Gym and Fitness\"]",
  }) {
    id
    preferences
  }
}


# List Preferences

query {
  listPreferences {
    items {
      id
      email
      preferences
    }
  }
}


// Javascript How To: 

// AWSDate

let date = new Date()
date.toISOString().substring(0, date.indexOf('T') )

// AWSTime

let time = new Date().toISOString()
time.substring(time.indexOf('T') + 1, time.indexOf('Z'))
