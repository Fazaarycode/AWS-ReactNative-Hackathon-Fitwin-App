import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type PreferencesMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Preferences {
  readonly id: string;
  readonly email: string;
  readonly preferences: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Preferences, PreferencesMetaData>);
  static copyOf(source: Preferences, mutator: (draft: MutableModel<Preferences, PreferencesMetaData>) => MutableModel<Preferences, PreferencesMetaData> | void): Preferences;
}