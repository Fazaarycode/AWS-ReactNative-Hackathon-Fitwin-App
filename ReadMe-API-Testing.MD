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

# Create Coupon
# User id aka id isnt important - it is for avoid creating relationships as we test access.
mutation create {
  createCoupons(input: {contentType: "image/png", couponId: "1a", date: "2021-04-10", email: "mohamed.fazaary@servian.com", imgData: "https://awsrn-runtimeterror.s3.amazonaws.com/Screenshot+2021-10-04+at+12.14.54+AM.png", id: "23620773-0e58-4eed-a159-e9eb810a60a3", height: 197, width: 296}) {
    imgData
    height
    id
    width
  }
}

// Javascript How To: 

// AWSDate

let date = new Date()
date.toISOString().substring(0, date.indexOf('T') )

// AWSTime

let time = new Date().toISOString()
time.substring(time.indexOf('T') + 1, time.indexOf('Z'))



