import { OpUnitType, QUnitType } from "dayjs";
import { ParsingComponents } from "../results";

/**
 * @deprecated Use `calculation.duration.Duration`.
 */
export type TimeUnits = { [c in OpUnitType | QUnitType]?: number };

/**
 * @deprecated Use `calculation.duration.*`.
 */
export function reverseTimeUnits(timeUnits: TimeUnits): TimeUnits {
    const reversed = {};
    for (const key in timeUnits) {
        // noinspection JSUnfilteredForInLoop
        reversed[key] = -timeUnits[key];
    }

    return reversed as TimeUnits;
}

/**
 * @deprecated Use `calculation.duration.*`.
 */
export function addImpliedTimeUnits(components: ParsingComponents, timeUnits: TimeUnits): ParsingComponents {
    const output = components.clone();

    let date = components.dayjs();
    for (const key in timeUnits) {
        // noinspection JSUnfilteredForInLoop,TypeScriptValidateTypes
        date = date.add(timeUnits[key], key as QUnitType);
    }

    if ("day" in timeUnits || "d" in timeUnits || "week" in timeUnits || "month" in timeUnits || "year" in timeUnits) {
        output.imply("day", date.date());
        output.imply("month", date.month() + 1);
        output.imply("year", date.year());
    }

    if ("second" in timeUnits || "minute" in timeUnits || "hour" in timeUnits) {
        output.imply("second", date.second());
        output.imply("minute", date.minute());
        output.imply("hour", date.hour());
    }

    return output;
}
