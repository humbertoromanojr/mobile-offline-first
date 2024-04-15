import { createRealmContext } from "@realm/react";

import { Historic } from "./schemas/Historic";

/* 
RealmProvider = Provider itself, share DB all app
useRealm = Instance use Add, delete, update and list
useQuery = use Searching DB
useObject = get specific object
*/
export const { RealmProvider, useRealm, useQuery, useObject } =
  createRealmContext({
    schema: [Historic],
  });
