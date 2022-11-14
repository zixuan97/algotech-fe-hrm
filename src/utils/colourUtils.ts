type ColorRangeInfo = {
  colorStart: number;
  colorEnd: number;
  useEndAsStart: boolean;
};

const calculatePoint = (
  i: number,
  intervalSize: number,
  colorRangeInfo: ColorRangeInfo
) => {
  const { colorStart, colorEnd, useEndAsStart } = colorRangeInfo;
  return useEndAsStart
    ? colorEnd - i * intervalSize
    : colorStart + i * intervalSize;
};

const interpolateColors = (
  dataObject: number[],
  colorScale: (t: number) => string,
  colorRangeInfo: ColorRangeInfo = {
    colorStart: 0,
    colorEnd: 1,
    useEndAsStart: false
  }
) => {
  const { colorStart, colorEnd } = colorRangeInfo;
  const colorRange = colorEnd - colorStart;
  const intervalSize = colorRange / dataObject.length;
  let i, colorPoint;
  let colorMap = new Map<number, string>();

  for (i = 0; i < dataObject.length; i++) {
    colorPoint = calculatePoint(i, intervalSize, colorRangeInfo);
    colorMap.set(dataObject[i], colorScale(colorPoint));
  }

  return colorMap;
};

export default interpolateColors;
