import { createRealmContext } from "@realm/react";

import { Historic } from "./schemas/Historic";
import { Coords } from "./schemas/Coords";

const realmAccessBehavior: Realm.OpenRealmBehaviorConfiguration = {
    type: Realm.OpenRealmBehaviorType.OpenImmediately,
};

export const syncConfig: any = {
    flexible: true,
    newRealmFileBehavior: realmAccessBehavior,
    existingRealmFileBehavior: realmAccessBehavior,
};

/* 
RealmProvider = Provider itself, share DB all app
useRealm = Instance use Add, delete, update and list
useQuery = use Searching DB
useObject = get specific object
*/

export const { RealmProvider, useRealm, useQuery, useObject } =
    createRealmContext({
        schema: [Historic, Coords],
    });
