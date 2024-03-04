import { getNoParams, getWithParams } from "endpointCalls";
import { useEffect, useState } from "react";
import { Grid } from "react-loader-spinner";
import TickIcon from "./images/Tick.png";
import CrossIcon from "./images/Cross.png";
import ChartIcon from "./images/Chart.png";
import CatQuizStats from "CatQuizStats";

// There are far more fields being returned, but setting up a type to add fields as and when are needed. Better habit than defaulting to type "any"
type RawCatBreedData = {
  id: string;
  description: string;
  name: string;
};

type RawCatGeneralData = {
  breeds: RawCatBreedData[];
  id: string;
  url: string;
  width: number;
  height: number;
};

type CatQuestionData = {
  catImage: string;
  catBreed: string;
  catId: string;
  possibleAnswers: string[];
};

const CatQuiz = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingError, setLoadingError] = useState<boolean>(false);
  const [catBreedList, setCatBreedList] = useState<string[]>([]);
  const [catQuestions, setCatQuestions] = useState<CatQuestionData[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean>(false);

  const getCatBreedList = async () => {
    setLoadingError(false);
    setLoading(true);

    const catBreeds = await getNoParams(
      "https://api.thecatapi.com/v1/breeds?search?&api_key=59913b83-8b00-42ed-8d87-0400c51e8529"
    );

    if (
      catBreeds.response &&
      Array.isArray(catBreeds.response) &&
      catBreeds.response.length > 0
    ) {
      const parsedCatBreeds = parseCatBreeds(catBreeds.response);
      setCatBreedList(parsedCatBreeds);
      setLoading(false);
    } else {
      setLoadingError(true);
      setLoading(false);
    }
  };

  const getNewCatQuestions = async () => {
    setLoadingError(false);
    setLoading(true);

    const catDetails = await getNoParams(
      "https://api.thecatapi.com/v1/images/search?limit=10&has_breeds=1&api_key=59913b83-8b00-42ed-8d87-0400c51e8529"
    );

    if (
      catDetails.response &&
      Array.isArray(catDetails.response) &&
      catDetails.response.length > 0
    ) {
      const parsedCatDetails = buildCatQuestions(catDetails.response);
      setCatQuestions(parsedCatDetails);
      setCurrentQuestion(0);
      setLoading(false);
    } else {
      setLoadingError(true);
      setLoading(false);
    }
  };

  const parseCatBreeds = (rawData: RawCatBreedData[]) => {
    const parsedData = rawData.map((breedItem: RawCatBreedData) => {
      return breedItem.name;
    });

    return parsedData;
  };

  const shuffleArray = (array: any[]) => {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  const getMultipleBreedChoices = (actualBreed: string) => {
    // First remove the actual breed from the list of options to avoid duplicates
    const filteredBreedList = catBreedList.filter(
      (breedItem: string) => breedItem !== actualBreed
    );

    // Shuffle the filtered list (Fisher-Yates algorithm) and take 3 options from it
    const shuffledBreedList = shuffleArray(filteredBreedList);
    let selectedWrongBreeds = shuffledBreedList;

    if (shuffledBreedList.length >= 3) {
      selectedWrongBreeds = shuffledBreedList.slice(0, 3);
    } else {
      selectedWrongBreeds = shuffledBreedList.slice(
        0,
        shuffledBreedList.length
      );
    }

    // Create multiple choice list of 4 options and shuffle to randomise position of actual breed
    return shuffleArray([...selectedWrongBreeds, actualBreed]);
  };

  const buildCatQuestions = (rawData: RawCatGeneralData[]) => {
    // Filter out any cats with multiple breeds
    let singleBreedCatList = rawData.filter(
      (catItem: RawCatGeneralData) => catItem.breeds.length === 1
    );

    let catQuestions = [];

    if (singleBreedCatList.length > 0) {
      catQuestions = singleBreedCatList.map((catItem: any) => {
        return {
          catImage: catItem.url,
          catBreed: catItem.breeds[0].name,
          catId: catItem.id,
          possibleAnswers: getMultipleBreedChoices(catItem.breeds[0].name),
        };
      });

      return catQuestions;
    } else return [];
  };

  const handleAnswer = (answer: string, actualBreed: string) => {
    let stats = {
      correct: 0,
      incorrect: 0,
      accuracy: 0,
    };

    const previousStats = localStorage.getItem("stats");
    const parsedPreviousStats =
      typeof previousStats === "string" ? JSON.parse(previousStats) : null;

    if (
      parsedPreviousStats &&
      parsedPreviousStats.hasOwnProperty("correct") &&
      parsedPreviousStats.hasOwnProperty("incorrect") &&
      parsedPreviousStats.hasOwnProperty("accuracy")
    ) {
      stats.correct = parsedPreviousStats.correct;
      stats.incorrect = parsedPreviousStats.incorrect;
      stats.accuracy = parsedPreviousStats.accuracy;
    }

    if (answer === actualBreed) {
      setIsCorrectAnswer(true);
      stats.correct = stats.correct + 1;
    } else {
      setIsCorrectAnswer(false);
      stats.incorrect = stats.incorrect + 1;
    }

    stats.accuracy =
      Math.round(
        (stats.correct / (stats.correct + stats.incorrect)) * 100 * 100
      ) / 100;

    localStorage.setItem("stats", JSON.stringify(stats));

    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    setShowAnswer(false);
    setLoading(true);
    setCurrentQuestion(() => currentQuestion + 1);
    setTimeout(() => setLoading(false), 500);
  };

  const getNextQuestionPrompt = (wasCorrectAnswer: boolean) => {
    let nextQuestionPrompts = ["Next question"];

    if (wasCorrectAnswer) {
      nextQuestionPrompts = [
        ...nextQuestionPromptsCorrectAnswer,
        ...nextQuestionPrompts,
      ];
    } else {
      nextQuestionPrompts = [
        ...nextQuestionPromptsInCorrectAnswer,
        ...nextQuestionPrompts,
      ];
    }

    const randomIndex = Math.floor(Math.random() * nextQuestionPrompts.length);
    return nextQuestionPrompts[randomIndex];
  };

  const isVowel = (char: string) => {
    return /[aeiou]/i.test(char);
  };

  useEffect(() => {
    getCatBreedList();
  }, []);

  useEffect(() => {
    if (
      (catBreedList && catBreedList.length > 0 && catQuestions.length === 0) ||
      (catQuestions.length > 0 && currentQuestion === catQuestions.length)
    ) {
      getNewCatQuestions();
    }
  }, [catBreedList, currentQuestion]);

  useEffect(() => {
    // The event listener detects if stats in the local storage are updated in another tab
    // Simply listening for the event updates the local storage value across tabs, so the handler function is not strictly necessary as results are kept in local storage
    // If we were tracking stats in state, then the handler could be used to update that
    window.addEventListener("storage", (e) => {});

    return () => window.removeEventListener("storage", (e) => {});
  }, []);

  const nextQuestionPromptsCorrectAnswer = [
    "I'm on a roll!",
    "Give me the next one already!",
    "There's no stopping me!",
    "Keep 'em coming!",
  ];

  const nextQuestionPromptsInCorrectAnswer = [
    "That was just a fluke!",
    "Oops, another go!",
    "Fair enough. Another!",
    "Wait, that's a real breed?",
  ];

  return (
    <>
      {loading ? (
        <Grid
          visible={true}
          color="#4fa94d"
          ariaLabel="grid-loading"
          radius="12.5"
          wrapperStyle={{}}
          wrapperClass="Spinner"
        />
      ) : loadingError ? (
        <div>
          Something went wrong when getting the cat data (I bet one of them
          unplugged the server). Please refresh and try again.
        </div>
      ) : (
        <div className="CatQuiz">
          <div className="Introduction">
            <p>
              Welcome to the cat breed quiz! The game is simple: below is the
              image of a cat, and you have to guess the correct breed from a
              list of four possible options.
            </p>
            <p>
              There's no limit to the number of questions you can attempt - see
              how many you can get right in a row!
            </p>
            <p>To view your overall stats, click the graph icon</p>
          </div>
          <div className="AnswerBlock fade-in">
            <div
              className="AnswerBlock_Stats"
              onClick={() => setShowStats(!showStats)}
            >
              <img src={ChartIcon} alt="Statistics" />
            </div>

            {showStats ? (
              <CatQuizStats />
            ) : (
              <>
                <div className="AnswerBlock_Image">
                  <img
                    src={catQuestions[currentQuestion]?.catImage}
                    alt="Cat image"
                  />
                </div>

                <div className="AnswerBlock_Answers fade-in">
                  {!showAnswer ? (
                    catQuestions[currentQuestion]?.possibleAnswers.map(
                      (option: string, index: number) => {
                        return (
                          <div
                            className="Button"
                            key={option}
                            onClick={() =>
                              handleAnswer(
                                option,
                                catQuestions[currentQuestion].catBreed
                              )
                            }
                          >
                            {option}
                          </div>
                        );
                      }
                    )
                  ) : (
                    <div className="ResultBlock fade-in">
                      {isCorrectAnswer ? (
                        <>
                          <div className="ResultBlock_Answer">
                            <img src={TickIcon} alt="Tick" />
                            Good job!
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="ResultBlock_Answer">
                            <img src={CrossIcon} alt="Cross" />
                            {`Not quite right :(`}
                          </div>
                        </>
                      )}

                      <div className="ResultBlock_Feedback">
                        {`${
                          isCorrectAnswer ? "That's right" : "Unfortunately"
                        }, this cat breed is ${
                          isVowel(catQuestions[currentQuestion].catBreed[0])
                            ? "an "
                            : "a "
                        }`}
                        <a
                          href={`https://www.google.com/search?q=${catQuestions[currentQuestion].catBreed}+cat+breed`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {catQuestions[currentQuestion].catBreed.toLowerCase()}
                        </a>
                      </div>

                      <div
                        className="Button"
                        onClick={() => handleNextQuestion()}
                      >
                        {getNextQuestionPrompt(isCorrectAnswer)}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CatQuiz;
