import "./styles/ScoreCircle.scss";

type ScoreCircleProps = {
  percentage: number;
  radius?: number;
  strokeWidth?: number;
  overrideText?: string;
  strokeFill?: string;
  fill?: string;
  fontSize?: number;
};

const scaleColours = {
  weak: "#E7DB2C",
  mid: "#92D848",
  strong: "#2A9A47",
};

const ScoreCircle = ({
  percentage,
  radius = 40,
  overrideText,
  strokeWidth = 8,
  strokeFill = "transparent",
  fill = "#f5f5f5",
  fontSize,
}: ScoreCircleProps) => {
  let colour = scaleColours.weak;

  if (percentage > 50) colour = scaleColours.mid;
  if (percentage > 75) colour = scaleColours.strong;

  const normalisedRadius = radius - strokeWidth;
  const circumference = normalisedRadius * 2 * Math.PI;
  const strokeDashOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="ScoreCircle">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          className="BackgroundCircle"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={normalisedRadius}
          cx={radius}
          cy={radius}
          stroke={fill ? fill : "transparent"}
        />
      </svg>
      <svg
        className="Bar"
        height={radius * 2}
        width={radius * 2}
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          className="ProgressCircle"
          stroke={colour}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          fill={strokeFill}
          style={{ strokeDashoffset: strokeDashOffset }}
          r={normalisedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <p
        className="InnerText"
        style={fontSize ? { fontSize: `${fontSize}rem` } : {}}
      >
        {overrideText ? (
          <div className="OverrideText">{overrideText}</div>
        ) : (
          <>
            {percentage}
            <sup>%</sup>
          </>
        )}
      </p>
    </div>
  );
};

export default ScoreCircle;
