// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Preferences } = initSchema(schema);

export {
  Preferences
};