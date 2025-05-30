import * as chrono from "../../src";
import { testSingleCase, testUnexpectedResult, testWithExpectedDate } from "../test_util";

test("Test - Parsing Offset Expression", function () {
    testSingleCase(chrono, "    04/2016   ", new Date(2012, 7, 10), (result) => {
        expect(result.index).toBe(4);
        expect(result.text).toBe("04/2016");
    });
});

test("Test - Single Expression (MM/dd/yyyy)", function () {
    testSingleCase(chrono, "8/10/2012", new Date(2012, 7, 10), (result) => {
        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(10);

        expect(result.index).toBe(0);
        expect(result.text).toBe("8/10/2012");
        expect(result.tags()).toContain("parser/SlashDateFormatParser");

        expect(result.start.isCertain("day")).toBe(true);
        expect(result.start.isCertain("month")).toBe(true);
        expect(result.start.isCertain("year")).toBe(true);

        expect(result.start).toBeDate(new Date(2012, 8 - 1, 10, 12));
    });

    testSingleCase(chrono, ": 8/1/2012", new Date(2012, 7, 10), (result) => {
        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(1);

        expect(result.index).toBe(2);
        expect(result.text).toBe("8/1/2012");

        expect(result.start).toBeDate(new Date(2012, 8 - 1, 1, 12));
    });

    testSingleCase(chrono, "The Deadline is 8/10/2012", new Date(2012, 7, 10), (result) => {
        expect(result.index).toBe(16);
        expect(result.text).toBe("8/10/2012");

        expect(result.start).toBeDate(new Date(2012, 7, 10, 12));
    });

    testSingleCase(chrono, "The Deadline is Tuesday 11/3/2015", new Date(2015, 10, 3), (result) => {
        expect(result.index).toBe(16);
        expect(result.text).toBe("Tuesday 11/3/2015");

        expect(result.start).toBeDate(new Date(2015, 10, 3, 12));
    });

    testSingleCase(chrono.strict, "2/28/2014", (result) => {
        expect(result.text).toBe("2/28/2014");
    });

    testWithExpectedDate(chrono.strict, "12-30-16", new Date(2016, 12 - 1, 30, 12));

    testSingleCase(chrono.strict, "Friday 12-30-16", (result) => {
        expect(result.text).toBe("Friday 12-30-16");
        expect(result).toBeDate(new Date(2016, 12 - 1, 30, 12));
    });
});

test("Test - Single Expression Little-Endian (dd/MM/yyyy)", function () {
    testSingleCase(chrono.en.GB, "8/10/2012", new Date(2012, 7, 10), (result) => {
        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(10);
        expect(result.start.get("day")).toBe(8);

        expect(result.index).toBe(0);
        expect(result.text).toBe("8/10/2012");

        expect(result.start).toBeDate(new Date(2012, 10 - 1, 8, 12));
    });

    testWithExpectedDate(chrono.strict, "30-12-16", new Date(2016, 12 - 1, 30, 12));

    testSingleCase(chrono.strict, "Friday 30-12-16", (result) => {
        expect(result.text).toBe("Friday 30-12-16");
        expect(result).toBeDate(new Date(2016, 12 - 1, 30, 12));
    });
});

test("Test - Single Expression Little-Endian with Month name", function () {
    testSingleCase(chrono.en.GB, "8/Oct/2012", new Date(2012, 7, 10), (result) => {
        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(10);
        expect(result.start.get("day")).toBe(8);

        expect(result.index).toBe(0);
        expect(result.text).toBe("8/Oct/2012");

        expect(result.start).toBeDate(new Date(2012, 10 - 1, 8, 12));
    });

    testSingleCase(chrono.strict, "06/Nov/2023", (result) => {
        expect(result.text).toBe("06/Nov/2023");
        expect(result).toBeDate(new Date(2023, 11 - 1, 6, 12));
    });

    testSingleCase(chrono.strict, "06/Nov/2023:06:36:02", (result) => {
        expect(result.text).toBe("06/Nov/2023:06:36:02");
        expect(result).toBeDate(new Date(2023, 11 - 1, 6, 6, 36, 2));
    });

    testSingleCase(chrono.strict, "06/Nov/2023:06:36:02 +0200", (result) => {
        expect(result.text).toBe("06/Nov/2023:06:36:02 +0200");
        expect(result).toBeDate(new Date("Mon Nov 06 2023 06:36:02 GMT+0200"));
    });
});

test("Test - Single Expression Shorten (mm/yyyy)", () => {
    testSingleCase(chrono, "The event is going ahead (04/2016)", new Date(2012, 7, 10), (result) => {
        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2016);
        expect(result.start.get("month")).toBe(4);
        expect(result.start.get("day")).toBe(1);

        expect(result.index).toBe(26);
        expect(result.text).toBe("04/2016");

        expect(result.start).toBeDate(new Date(2016, 4 - 1, 1, 12));
    });

    testSingleCase(chrono, "Published: 06/2004", new Date(2012, 7, 10), (result) => {
        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2004);
        expect(result.start.get("month")).toBe(6);
        expect(result.start.get("day")).toBe(1);

        expect(result.index).toBe(11);
        expect(result.text).toBe("06/2004");

        expect(result.start).toBeDate(new Date(2004, 6 - 1, 1, 12));
    });
});

test("Test - Single Expression Shorten (dd/mm)", () => {
    testSingleCase(chrono, "8/10", new Date(2012, 7, 10), (result) => {
        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(10);

        expect(result.index).toBe(0);
        expect(result.text).toBe("8/10");

        expect(result.start.isCertain("day")).toBe(true);
        expect(result.start.isCertain("month")).toBe(true);
        expect(result.start.isCertain("year")).toBe(false);

        expect(result.start).toBeDate(new Date(2012, 8 - 1, 10, 12));
    });
});

test("Test - Range Expression", function () {
    testSingleCase(chrono.en, "8/10/2012 - 8/15/2012", new Date(2012, 7, 10), (result) => {
        expect(result.index).toBe(0);
        expect(result.text).toBe("8/10/2012 - 8/15/2012");
        expect(result.tags()).toContain("parser/SlashDateFormatParser");

        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(10);
        expect(result.start.tags()).toContain("parser/SlashDateFormatParser");

        expect(result.start).toBeDate(new Date(2012, 8 - 1, 10, 12));

        expect(result.end).not.toBeNull();
        expect(result.end.get("year")).toBe(2012);
        expect(result.end.get("month")).toBe(8);
        expect(result.end.get("day")).toBe(15);
        expect(result.end.tags()).toContain("parser/SlashDateFormatParser");

        expect(result.end).toBeDate(new Date(2012, 8 - 1, 15, 12));
    });
});

test("Test - Range Expressions with Time", function () {
    testSingleCase(chrono.en, "from 01/21/2021 10:00 to 01/01/2023 07:00", new Date(2012, 7, 10), (result) => {
        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2021);
        expect(result.start.get("month")).toBe(1);
        expect(result.start.get("day")).toBe(21);
        expect(result.start.get("hour")).toBe(10);
        expect(result.start.get("minute")).toBe(0);

        expect(result.end).not.toBeNull();
        expect(result.end.get("year")).toBe(2023);
        expect(result.end.get("month")).toBe(1);
        expect(result.end.get("day")).toBe(1);
        expect(result.end.get("hour")).toBe(7);
        expect(result.end.get("minute")).toBe(0);
    });

    testSingleCase(chrono.en, "08/08/2023, 09:15 AM to 08/29/2023, 09:15 AM", new Date(2012, 7, 10), (result) => {
        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2023);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(8);
        expect(result.start.get("hour")).toBe(9);
        expect(result.start.get("minute")).toBe(15);

        expect(result.end).not.toBeNull();
        expect(result.end.get("year")).toBe(2023);
        expect(result.end.get("month")).toBe(8);
        expect(result.end.get("day")).toBe(29);
        expect(result.end.get("hour")).toBe(9);
        expect(result.end.get("minute")).toBe(15);
    });
});

test("Test - Splitter variances patterns", function () {
    const expectDate = new Date(2015, 5 - 1, 25, 12, 0);

    testWithExpectedDate(chrono, "2015-05-25", expectDate);
    testWithExpectedDate(chrono, "2015/05/25", expectDate);
    testWithExpectedDate(chrono, "2015.05.25", expectDate);
    testWithExpectedDate(chrono, "05-25-2015", expectDate);
    testWithExpectedDate(chrono, "05/25/2015", expectDate);
    testWithExpectedDate(chrono, "05.25.2015", expectDate);
    testWithExpectedDate(chrono, "/05/25/2015", expectDate);

    // Also, guessing ambiguous date
    testWithExpectedDate(chrono, "25/05/2015", expectDate);
});

test("Test - Impossible Dates and Unexpected Results", function () {
    testUnexpectedResult(chrono, "8/32/2014");
    testUnexpectedResult(chrono, "8/32");
    testUnexpectedResult(chrono, "2/29/2014");
    testUnexpectedResult(chrono, "2014/22/29");
    testUnexpectedResult(chrono, "2014/13/22");
    testUnexpectedResult(chrono, "80-32-89-89");
    testUnexpectedResult(chrono, "02/29/2022");
    testUnexpectedResult(chrono, "06/31/2022");
    testUnexpectedResult(chrono, "06/-31/2022");
    testUnexpectedResult(chrono, "18/13/2022");
    testUnexpectedResult(chrono, "15/28/2022");
    testUnexpectedResult(chrono, "4/13/1");
});

test("Test - forward dates only option", function () {
    testSingleCase(chrono, "5/31", new Date(1999, 6 - 1, 1), { forwardDate: true }, (result) => {
        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2000);
        expect(result.start.get("month")).toBe(5);
        expect(result.start.get("day")).toBe(31);

        expect(result.index).toBe(0);
        expect(result.text).toBe("5/31");

        expect(result.start.isCertain("day")).toBe(true);
        expect(result.start.isCertain("month")).toBe(true);
        expect(result.start.isCertain("year")).toBe(false);

        expect(result.start).toBeDate(new Date(2000, 5 - 1, 31, 12));
    });

    testSingleCase(chrono, "1/8 at 12pm", new Date("Sep 25 2021 12:00:00"), { forwardDate: true }, (result) => {
        expect(result.text).toBe("1/8 at 12pm");

        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2022);
        expect(result.start.get("month")).toBe(1);
        expect(result.start.get("day")).toBe(8);

        expect(result.start).toBeDate(new Date(2022, 1 - 1, 8, 12));
    });
});

test("Test - Slash date with an extra chunk", () => {
    testSingleCase(chrono, "14/4 90", new Date(2012, 7, 10), (result) => {
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(4);
        expect(result.start.get("day")).toBe(14);
    });
});
