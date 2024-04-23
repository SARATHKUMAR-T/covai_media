import { mediaService } from "../services";

export async function availablityUpdater(item: any) {
  if (item.issued_at && item.returned_at) {
    await mediaService.updateMedia({ status: 1 }, item.media_id);
  }
}
