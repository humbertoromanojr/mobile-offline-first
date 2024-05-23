import { startLocationUpdatesAsync, Accuracy } from "expo-location";
import * as TaskManager from "expo-task-manager";

export const BACKGROUND_TASK_NAME = "location-tracking";

TaskManager.defineTask(BACKGROUND_TASK_NAME, ({ data, error }: any) => {
    try {
        if (error) {
            throw error;
        }

        const { coords, timestamp } = data.location[0];

        const currentLocation = {
            latitude: coords.latitude,
            longitude: coords.longitude,
            timestamp: timestamp,
        };

        console.log("==> currentLocation: ", currentLocation);
    } catch (error) {
        console.log("==> TaskManager: ", error);
    }
});

export async function startLocationTask() {
    try {
        await startLocationUpdatesAsync(BACKGROUND_TASK_NAME, {
            accuracy: Accuracy.Highest,
            distanceInterval: 1,
            timeInterval: 10000,
        });
    } catch (error) {
        console.log("==> startLocationTask: ", error);
    }
}
