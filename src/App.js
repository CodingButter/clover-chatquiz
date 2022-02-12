import "./styles.css";
import { read, update, create } from "./services/api";
import { useEffect, useState } from "react";
export default function App() {
  const [questions, setQuestions] = useState([]);
  const [winners, setWinners] = useState([]);

  const setActiveQuestion = async (id) => {
    await update("activechatquestion", { id });
    await getQuestions();
  };

  const addQuestion = async () => {
    const question = prompt("New Question");
    const answers = prompt(`answer to "${question}"`)
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
      <h1>Chat Quesitons</h1>
      <div className="container">
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
                      <div className="col answer">{question.answer}</div>
                      <div className="col winner">
                        {(winner && winner.username) || "No Winner"}
                      </div>
                      <div className="col activeBtn">
                        <button
                          onClick={() => setActiveQuestion(question.id)}
                          className="btn-primary btn"
                          disabled={question.active === 1 || winner}
                        >
                          Activate
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
