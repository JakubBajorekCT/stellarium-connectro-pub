const current1raw = {
  altAz: JSON.stringify([0.522456, 0.836669, -0.164394]),
  j2000: JSON.stringify([0.492914, -0.742998, -0.452757]),
  jNow: JSON.stringify([0.498324, -0.740119, -0.45155]),
};

const requested1VariableRateAzmRaSlewPositive = [
  0.4923080892492821, -0.7434001455611884, -0.4527570748639106,
];
const requested1VariableRateAzmRaSlewNegative = [
  0.493520073758555, -0.7425961001500248, -0.45275707486391065,
];
const requested1VariableRateAltDecSlewPositive = [
  0.4930961001763145, -0.7432724902088425, -0.4521086609319228,
];
const requested1VariableRateAltDecSlewNegative = [
  0.4927320628316381, -0.742723755502545, -0.4534054887954868,
];

const requested1FixedRateAzmRaSlewPositive = [
  0.49018462124117523, -0.7448034338640113, -0.45275477027086447,
];
const requested1FixedRateAzmRaSlewNegative = [
  0.49563852377168105, -0.7411852479309108, -0.45275477027086447,
];
const requested1FixedRateAltDecSlewPositive = [
  0.4937306523638673, -0.7442289877038362, -0.44983692242597595,
];
const requested1FixedRateAltDecSlewNegative = [
  0.49209249265132876, -0.7417596940946128, -0.45567261810741777,
];

export const slew = {
  c1: {
    apiRaw: current1raw,
    variable: {
      AzmRa: {
        Positive: requested1VariableRateAzmRaSlewPositive,
        Negative: requested1VariableRateAzmRaSlewNegative,
      },
      AltDec: {
        Positive: requested1VariableRateAltDecSlewPositive,
        Negative: requested1VariableRateAltDecSlewNegative,
      },
    },
    fixed: {
      AzmRa: {
        Positive: requested1FixedRateAzmRaSlewPositive,
        Negative: requested1FixedRateAzmRaSlewNegative,
      },
      AltDec: {
        Positive: requested1FixedRateAltDecSlewPositive,
        Negative: requested1FixedRateAltDecSlewNegative,
      },
    },
  },
};
