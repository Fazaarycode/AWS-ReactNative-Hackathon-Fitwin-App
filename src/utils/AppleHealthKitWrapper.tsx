import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
  HealthUnit,
  HealthDateOfBirth,
} from 'react-native-health'
//AppleHealthKit.Constants.Permissions.HeartRate,
/* Permission options */
const permissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      // AppleHealthKit.Constants.Permissions.ActivitySummary,
      // AppleHealthKit.Constants.Permissions.AllergyRecord,
      AppleHealthKit.Constants.Permissions.BasalEnergyBurned,
      AppleHealthKit.Constants.Permissions.BiologicalSex,
      // AppleHealthKit.Constants.Permissions.BloodType,
      // AppleHealthKit.Constants.Permissions.BloodAlcoholContent,
      // AppleHealthKit.Constants.Permissions.BloodGlucose,
      // AppleHealthKit.Constants.Permissions.BloodPressureDiastolic,
      // AppleHealthKit.Constants.Permissions.BloodPressureSystolic,
      // AppleHealthKit.Constants.Permissions.BodyFatPercentage,
      AppleHealthKit.Constants.Permissions.BodyMassIndex,
      AppleHealthKit.Constants.Permissions.BodyTemperature,
      // AppleHealthKit.Constants.Permissions.ConditionRecord,
      // AppleHealthKit.Constants.Permissions.CoverageRecord,
      AppleHealthKit.Constants.Permissions.DateOfBirth,
      AppleHealthKit.Constants.Permissions.DistanceCycling,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
      // AppleHealthKit.Constants.Permissions.Electrocardiogram,
      // AppleHealthKit.Constants.Permissions.EnvironmentalAudioExposure,
      AppleHealthKit.Constants.Permissions.FlightsClimbed,
      // AppleHealthKit.Constants.Permissions.HeadphoneAudioExposure,
      // AppleHealthKit.Constants.Permissions.HeartbeatSeries,
      // AppleHealthKit.Constants.Permissions.HeartRateVariability,
      AppleHealthKit.Constants.Permissions.HeartRate,
      AppleHealthKit.Constants.Permissions.Height,
      // AppleHealthKit.Constants.Permissions.ImmunizationRecord,
      // AppleHealthKit.Constants.Permissions.LabResultRecord,
      // AppleHealthKit.Constants.Permissions.LeanBodyMass,
      // AppleHealthKit.Constants.Permissions.MedicationRecord,
      // AppleHealthKit.Constants.Permissions.ProcedureRecord,
      AppleHealthKit.Constants.Permissions.RespiratoryRate,
      // AppleHealthKit.Constants.Permissions.SleepAnalysis,
      AppleHealthKit.Constants.Permissions.StepCount,
      AppleHealthKit.Constants.Permissions.Steps,
      // AppleHealthKit.Constants.Permissions.VitalSignRecord,
      AppleHealthKit.Constants.Permissions.Weight,
      // AppleHealthKit.Constants.Permissions.WalkingHeartRateAverage,
    ],
    write: [
      AppleHealthKit.Constants.Permissions.BloodAlcoholContent,
      AppleHealthKit.Constants.Permissions.BloodPressureDiastolic,
      AppleHealthKit.Constants.Permissions.BloodPressureSystolic,
      AppleHealthKit.Constants.Permissions.BodyFatPercentage,
      AppleHealthKit.Constants.Permissions.BodyMassIndex,
      AppleHealthKit.Constants.Permissions.DistanceCycling,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
      AppleHealthKit.Constants.Permissions.FlightsClimbed,
      AppleHealthKit.Constants.Permissions.Height,
      AppleHealthKit.Constants.Permissions.LeanBodyMass,
      AppleHealthKit.Constants.Permissions.StepCount,
      AppleHealthKit.Constants.Permissions.Steps,
    ]
  },
} as HealthKitPermissions

class AppleHealthKitWrapper {
  private _ready: boolean;
  constructor () {
    this._ready = false;
  }

  _isAvailablePromise = () => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.isAvailable((err: Object, available: boolean) => {
        if (err) {
          console.log('error initializing Healthkit: ', err)
          return reject(err)
        }
        // console.log(`John > AppleHealthKit.isAvailable=${available}`);
        resolve(available)
      })
    })
  }

  _initHealthKit = () => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.initHealthKit(permissions, (error: string) => {
        /* Called after we receive a response from the system */
      
        if (error) {
          console.log('[ERROR] Cannot grant permissions!')
          return reject(error)
        }
      
        /* Can now read or write to HealthKit */
        this._ready = true;
        resolve(true)
      })
    })
    
  }

  isReady = () => {
    return this._ready;
  }

  // singleton init behaviour
  init = async ():Promise<boolean> => {

    if (this._ready) 
      return true;

    const available = await this._isAvailablePromise();
    if (available) {
      // go and init Health Kit
      await this._initHealthKit();
    }
    console.log(`AppleHealthKitWrapper isReady = ${this._ready}`);
    return this._ready;
  }

  getAuthStatus = () => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getAuthStatus(permissions, (err, results) => {
        console.log(err, results)
        if(err) {
          console.log('[ERROR] getAuthStatus!');
          return reject(err)
        }
        resolve(results)
      })
    })
  }

  // getLatestHeight = () => {
  //   return new Promise((resolve, reject) => {
  //     AppleHealthKit.getLatestHeight({unit: HealthUnit.meter}, (err: string, results: HealthValue) => {
  //       if (err) {
  //         console.log('error getting latest height: ', err)
  //         return reject(err)
  //       }
  //       // console.log(results)
  //       resolve(results)
  //     })
  //   })
  // }

  // return kg
  // getLatestWeight = () => {
  //   return new Promise((resolve, reject) => {
  //     AppleHealthKit.getLatestWeight({unit: HealthUnit.gram}, (err: string, results: HealthValue) => {
  //       if (err) {
  //         console.log('error getting latest weight: ', err)
  //         return reject(err)
  //       }
  //       // console.log(results)
  //       results.value = results.value / 1000; // convert to kg
  //       resolve(results)
  //     })
  //   })
  // }

  getSex = () => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getBiologicalSex({unit: HealthUnit.count}, (err: Object, results: Object) => {
        if (err) {
          console.log('error getting biological sex: ', err)
          return reject(err)
        }
        // console.log(results)
        resolve(results)
      })
    })
  }

  getDOB = () => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getDateOfBirth(
        null,
        (err: Object, results: HealthDateOfBirth) => {
          if (err) {
            console.log('error getting DOB: ', err)
            return reject(err)
          }
          // console.log(results)
          resolve(results)
        },
      )
    })
  }

  getActiveEnergyBurned = (startDate: Date) => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getActiveEnergyBurned(
        {startDate: startDate.toISOString()},
        (err: Object, results: HealthValue[]) => {
          if (err) {
            return reject(err)
          }
          // console.log(results)
          resolve(results)
        },
      )
    });
  }

  getDailyStepCountSamples = (startDate: Date, endDate: Date) => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getDailyStepCountSamples(
        {startDate: startDate.toISOString(), endDate: endDate.toISOString()},
        (err: Object, results: Array<Object>) => {
          if (err) {
            return reject(err)
          }
          // console.log(results)
          resolve(results)
        }
      )
    })
  }

  getStepCount = (date: Date, includeManuallyAdded: boolean = true) => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getStepCount(
        {
          date: date.toISOString(), 
          includeManuallyAdded,
        },
        (err: Object, results: HealthValue) => {
          if (err) {
            return reject(err)
          }
          // console.log(results)
          resolve(results)
        }
      )
    })
  }

  // getSamples = (startDate: Date, endDate: Date, execiseType: string) => {
  //   return new Promise((resolve, reject) => {
  //     AppleHealthKit.getSamples({
  //       startDate: startDate.toISOString(),
  //       endDate: endDate.toISOString(),
  //       type: execiseType,
  //     }, (err: Object, results: Array<Object>) => {
  //       if (err) {
  //         return
  //       }
  //       console.log(results)
  //     })
  //   })
  // }

  getDailyDistanceWalkingRunningSamples = (startDate: Date) => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getDailyDistanceWalkingRunningSamples(
        {
          startDate: startDate.toISOString(),
        },
        (err: Object, results: Array<Object>) => {
          if (err) {
            return reject(err)
          }
          // console.log(results)
          resolve(results)
        },
      )
    })
  }

  getDistanceWalkingRunning = (date: Date) => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getDistanceWalkingRunning(
        {
          date: date.toISOString(),
        },
        (err: Object, results: HealthValue) => {
          if (err) {
            return reject(err)
          }
          // console.log(results)
          resolve(results)
        },
      )
    })
  }

  getDailyDistanceCyclingSamples = (startDate: Date) => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getDailyDistanceCyclingSamples(
        {
          startDate: startDate.toISOString(),
        },
        (err: Object, results: Array<HealthValue>) => {
          if (err) {
            return reject(err)
          }
          // console.log(results)
          resolve(results)
        },
      )
    })
  }

  getDistanceCycling = (startDate: Date) => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getDistanceCycling(
        {
          unit: HealthUnit.meter,
          startDate: startDate.toISOString()
        },
        (err: Object, results: HealthValue) => {
          if (err) {
            return reject(err)
          }
          // console.log(results)
          resolve(results)
        },
      )
    })
  }

  getDailyFlightsClimbedSamples = (startDate: Date, endDate: Date) => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getDailyFlightsClimbedSamples(
        {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        },
        (err: Object, results: Array<Object>) => {
          if (err) {
            return reject(err)
          }
          // console.log(results)
          resolve(results)
        },
      )
    })
  }

  getFlightsClimbed = (date: Date) => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getFlightsClimbed(
        {
          date: date.toISOString(),
        },
        (err: Object, results: HealthValue) => {
          if (err) {
            return reject(err)
          }
          // console.log(results)
          resolve(results)
        },
      )
    })
  }

  getHeartRateSamples = (startDate: Date, endDate: Date) => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getHeartRateSamples(
        {
          unit: HealthUnit.bpm,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
        (err: Object, results: Array<HealthValue>) => {
          if (err) {
            return reject(err)
          }
          // console.log(results)
          resolve(results)
        },
      )
    })
  }

  // getLatestBmi = () => {
  //   return new Promise((resolve, reject) => {
  //     AppleHealthKit.getLatestBmi({unit: HealthUnit.}, (err: string, results: HealthValue) => {
  //       if (err) {
  //         console.log('error getting latest bmi data: ', err)
  //         return
  //       }
  //       console.log(results)
  //     })
  //   })
  // }

  getWalkingHeartRateAverage = (startDate: Date, endDate: Date) => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getWalkingHeartRateAverage(
        {
          unit: HealthUnit.bpm,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
        (err: Object, results: HealthValue[]) => {
          if (err) {
            return reject(err)
          }
          // console.log(results);
          resolve(results)
        },
      )
    })
  }


}

export default new AppleHealthKitWrapper();