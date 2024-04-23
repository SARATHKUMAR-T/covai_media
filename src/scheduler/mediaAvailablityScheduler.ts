import { mediaTrackingService } from "../services";
import { availablityUpdater } from "./mediaAvailablityUpdater";

export async function availablityScheduler() {
  try {
    const res = await mediaTrackingService.allMediaTracking();
    res.data?.forEach((item) => {
      availablityUpdater(item);
    });
  } catch (error) {
    console.log(error);
  }
}
