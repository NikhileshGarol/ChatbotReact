import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function formatDateLocal(date: string) {
  if (!date) return;
  const localFormatted = dayjs.utc(date).local().format("DD-MM-YYYY hh:mm A");
  return localFormatted;
}
