import dayjs from "dayjs";

export const getDMY = (date: string) => dayjs(date).format("DD/MM/YYYY");
