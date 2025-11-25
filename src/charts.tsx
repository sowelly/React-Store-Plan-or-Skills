import React, { useState, useMemo, useTransition, useRef } from "react";
import ReactECharts from "echarts-for-react";

// 模拟耗性能计算
function generateChartData(multiplier) {
  const points = [];
  for (let i = 0; i < 5000; i++) {
    points.push(Math.sin(i * 0.01) * multiplier);
  }
  return points;
}

// 自定义防抖 hook
function useDebouncedValue(value, delay = 200) {
  const [debounced, setDebounced] = useState(value);
  const timer = useRef(null);

  React.useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer.current);
  }, [value, delay]);

  return debounced;
}

export default function SliderDeferredECharts() {
  const [sliderValue, setSliderValue] = useState(10);
  const debouncedValue = useDebouncedValue(sliderValue, 300); // 图表延迟 300ms
  const [isPending, startTransition] = useTransition();

  // 低优先级渲染图表
  const chartData = useMemo(() => {
    console.log("📊 图表重计算");
    return generateChartData(debouncedValue);
  }, [debouncedValue]);

  const chartOption = useMemo(() => ({
    title: { text: `折线图 - Multiplier: ${debouncedValue}` },
    tooltip: {},
    xAxis: { type: "category", data: Array(chartData.length).fill("") },
    yAxis: { type: "value" },
    series: [
      { type: "line", smooth: true, data: chartData },
    ],
  }), [chartData, debouncedValue]);

  const handleChange = (e) => {
    const val = Number(e.target.value);
    setSliderValue(val); // 滑块数字立即更新
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>滑块即时数字 + 图表延迟渲染示例</h2>

      <div style={{ marginBottom: 20 }}>
        <label>Multiplier: {sliderValue}</label>
        <input
          type="range"
          min="1"
          max="100"
          value={sliderValue}
          onChange={handleChange}
        />
      </div>
        <ReactECharts option={chartOption} style={{ height: 400 }} />
    </div>
  );
}
