import { useEffect, useState } from "react";
import ShareIcon from "./images/Share.png";
import ScoreCircle from "ScoreCircle";

type Stats = {
  correct: number;
  incorrect: number;
  accuracy: number;
};

const CatQuizStats = () => {
  const [stats, setStats] = useState<Stats>({
    correct: 0,
    incorrect: 0,
    accuracy: 0,
  });
  const [shareClicked, setShareClicked] = useState<boolean>(false);

  useEffect(() => {
    const stats = localStorage.getItem("stats");
    const parsedStats = typeof stats === "string" ? JSON.parse(stats) : null;
    if (
      parsedStats &&
      parsedStats.hasOwnProperty("correct") &&
      parsedStats.hasOwnProperty("incorrect") &&
      parsedStats.hasOwnProperty("accuracy")
    ) {
      setStats({
        correct: parsedStats.correct,
        incorrect: parsedStats.incorrect,
        accuracy: parsedStats.accuracy,
      });
    }
  }, []);

  const handleClickShare = () => {
    setShareClicked(true);

    const shareStatsText = `I've guessed over ${
      stats.correct + stats.incorrect
    } cat breeds on "Cat quiz challenge" with a win rate of ${
      stats.accuracy
    }%. Think you can do any better?`;

    navigator.clipboard.writeText(shareStatsText);
  };

  const getStatsFeedback = (accuracy: number) => {
    if (accuracy > 70) {
      return "Wow, you've really got a (cats)eye for this!";
    } else if (accuracy > 50) {
      return "Pretty good, but there's definitely room for improvement!";
    } else {
      return "Oh dear, keep practicing and you'll sleuth those cat breeds in no time!";
    }
  };

  return (
    <div className="CatQuizStats fade-in">
      <ScoreCircle percentage={stats.accuracy} radius={50} strokeWidth={5} />

      <p>
        You've correctly guessed {stats.correct} cat breeds out of{" "}
        {stats.correct + stats.incorrect}!
      </p>

      <p>{getStatsFeedback(stats.accuracy)}</p>

      <div className="Button" onClick={() => handleClickShare()}>
        {shareClicked ? "Copied to clipboad" : "Share your stats"}
        <img src={ShareIcon} alt="Share icon" />
      </div>
    </div>
  );
};

export default CatQuizStats;
