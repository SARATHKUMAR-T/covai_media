import { mediaFineService } from "../services";

export async function fineUpdater(s1: any) {
  let issued_date = s1.issued_at.toString().replace(/[-]/g, "/");
  issued_date = Date.parse(issued_date);
  let js_date = new Date(issued_date);
  const current_date = new Date();
  const dayDifference = current_date.getDate() - js_date.getDate();
  if (dayDifference > 7) {
    const res = await mediaFineService.fetchMediaFineByMediaId(s1.id);
    if (res.isError) {
      await mediaFineService.addMediaFine({
        media_tracking_id: s1.id,
        library_card: s1.library_card,
        fine_amount: 1,
        fine_imposed_at: new Date()
          .toISOString()
          .replace("T", " ")
          .slice(0, 19),
      });
    } else {
      await mediaFineService.updateFine({ fine_amount: 1 }, s1.id);
    }
  }
}
