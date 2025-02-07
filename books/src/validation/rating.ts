import {number, object, refine} from "superstruct";

export const RatingData = object({
    value: refine(number(), 'rating', (value) => value >= 1 && value <= 5)
});