import "./styles.css";
import { read, update, create, deletes } from "./services/api";
import { useEffect, useReducer, useState } from "react";
import banner from "./banner.jpg";
export default function App() {
  const reduceRevieled = (currentState, { action, id }) => {
    switch (action) {
      case "show":
        currentState[id] = true;
        break;
      case "hide":
        currentState[id] = false;
        break;
      default:
    }
    return currentState;
  };

  const [questions, setQuestions] = useState([]);
  const [winners, setWinners] = useState([]);
  const [revieled, dispatchRevield] = useReducer(reduceRevieled, {});

  const toggleHidden = (id) => {
    if (revieled[id]) dispatchRevield({ action: "hide", id });
    else dispatchRevield({ action: "show", id });
  };

  const setActiveQuestion = async (id) => {
    await update("activechatquestion", { id });
    await getQuestions();
  };

  const deleteQuestion = async (id) => {
    await deletes("deletechatquestion", { id });
    await getQuestions();
  };

  const addQuestion = async () => {
    const question = prompt("New Question");
    if (!question) return;
    let answers = prompt(`answer to "${question}"`);
    if (!question || !answers) return;
    answers = answers
      .split(",")
      .map((answer) => answer.trim().toLowerCase())
      .join(",");
    await create("chatquestion", { question, answers });
    await getQuestions();
  };
  const getWinners = async () => {
    const resp = await read("chatwinners");
    setWinners(resp);
  };

  const getQuestions = async () => {
    const resp = await read("chatquestions");
    setQuestions(resp);
  };

  useEffect(() => {
    getQuestions();
    const winIntval = setInterval(getWinners, 1000);
    return () => {
      clearInterval(winIntval);
    };
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="row row-banner">
          <div className="col">
            <img
              className="banner"
              src={banner}
              alt="clover competitions banner"
            />
          </div>
        </div>
        <div className="row main-header">
          <div className="col">
            <h1>Chat Quesitons</h1>
          </div>
        </div>
        <div className="row add-question-row">
          <div className="col-10"></div>
          <div className="col-2">
            <button
              onClick={addQuestion}
              className="btn-primary btn add-question"
            >
              +
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <ul className="list-group">
              <li className="container list-group-item header" key="header">
                <div className="row">
                  <div className="col quesion">Question</div>
                  <div className="col answer">Answer</div>
                  <div className="col winner">Winner</div>
                  <div className="col activeBtn">Activate</div>
                  <div className="col deleteBtn">Delete</div>
                </div>
              </li>
              {questions.map((question, index) => {
                const winner = winners.filter(
                  (winner) => winner.question === question.id
                )[0];
                return (
                  <li className="container list-group-item" key={question.id}>
                    <div className="row">
                      <div className="col quesion">{question.question}</div>
                      <div
                        onClick={() => toggleHidden(question.id)}
                        className="col answer list-answer"
                      >
                        {revieled[question.id] || winner
                          ? question.answer
                          : "Click To Show/Hide"}
                      </div>
                      <div className="col winner">
                        {(winner && winner.username) || "No Winner"}
                      </div>
                      <div className="col activeBtn">
                        <button
                          onClick={() => setActiveQuestion(question.id)}
                          className="btn-primary btn"
                          disabled={question.active === 1 || winner}
                        >
                          {winner ? "WON" : "Activate"}
                        </button>
                      </div>
                      <div className="col delete">
                        <button
                          onClick={() => deleteQuestion(question.id)}
                          className="btn-primary btn"
                        >
                          X
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
