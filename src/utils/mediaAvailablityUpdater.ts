import { mediaService, mediaTrackingService } from "../services";

export async function availablityUpdater(item: any) {
  if (item.fine_imposed_at && item.fine_paid_at) {
    const res = await mediaTrackingService.fetchMediaTracking(
      item.media_tracking_id
    );
    if (res?.data) {
      await mediaService.updateMedia({ status: 1 }, res.data[0].media_id);
    }
  }
}
