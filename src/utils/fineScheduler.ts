import { mediaTrackingService } from "../services";
import { fineUpdater } from "./fineUpdater";

export async function fineScheduler() {
  try {
    const res = await mediaTrackingService.allMediaTracking();

    const filter1 = res.data?.filter((item) => {
      if (item.issued_at && item.returned_at === null) return item;
    });
    filter1?.forEach((item) => {
      fineUpdater(item);
    });
  } catch (error) {
    console.log(error);
  }
}
