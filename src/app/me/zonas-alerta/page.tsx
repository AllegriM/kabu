import { getOwnZones } from "@/utils/supabase/fetchs";
import { AlertZonesContent } from "./components/alert-zone-content";

export default async function AlertZonesPage() {
  const { zones } = await getOwnZones();

  return <AlertZonesContent zones={zones} />;
}
