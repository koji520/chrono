import { ParsingComponents } from "../results";
import dayjs from "dayjs";
import { Meridiem } from "../types";

export function assignTheNextDay(component: ParsingComponents, targetDayJs: dayjs.Dayjs) {
    targetDayJs = targetDayJs.add(1, "day");
    assignSimilarDate(component, targetDayJs);
    implySimilarTime(component, targetDayJs);
}

export function implyTheNextDay(component: ParsingComponents, targetDayJs: dayjs.Dayjs) {
    targetDayJs = targetDayJs.add(1, "day");
    implySimilarDate(component, targetDayJs);
    implySimilarTime(component, targetDayJs);
}

export function assignSimilarDate(component: ParsingComponents, targetDayJs: dayjs.Dayjs) {
    component.assign("day", targetDayJs.date());
    component.assign("month", targetDayJs.month() + 1);
    component.assign("year", targetDayJs.year());
}

export function assignSimilarTime(component: ParsingComponents, targetDayJs: dayjs.Dayjs) {
    component.assign("hour", targetDayJs.hour());
    component.assign("minute", targetDayJs.minute());
    component.assign("second", targetDayJs.second());
    component.assign("millisecond", targetDayJs.millisecond());
    if (component.get("hour") < 12) {
        component.assign("meridiem", Meridiem.AM);
    } else {
        component.assign("meridiem", Meridiem.PM);
    }
}

/**
 * @deprecated Use `dates.implySimilarDate` with normal Javascript Date instead.
 */
export function implySimilarDate(component: ParsingComponents, targetDayJs: dayjs.Dayjs) {
    component.imply("day", targetDayJs.date());
    component.imply("month", targetDayJs.month() + 1);
    component.imply("year", targetDayJs.year());
}

/**
 * @deprecated Use `dates.implySimilarTime` with normal Javascript Date instead.
 */
export function implySimilarTime(component: ParsingComponents, targetDayJs: dayjs.Dayjs) {
    component.imply("hour", targetDayJs.hour());
    component.imply("minute", targetDayJs.minute());
    component.imply("second", targetDayJs.second());
    component.imply("millisecond", targetDayJs.millisecond());
}
