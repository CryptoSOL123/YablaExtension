// let mclimit, fitblimit, punctuation;
// (function () {
//     if (
//         location.pathname !== "/multiple_choice.php" &&
//         location.pathname !== "/fill_in_the_blank.php" &&
//         location.pathname !== "/player_cdn.php"
//     )
//         return;

//     function start(type) {
//         // Added a delay
//         setTimeout(() => {
//             continueAnswering(type);
//         }, 1000);
//     }

//     function continueAnswering(type) {
//         answerQuestion(type);
//         setTimeout(() => {
//             const totalPoints = document.getElementsByClassName("total_points")[0];
//             const scoreHistory = document.getElementsByClassName("score_history_link")[0];
            
//             // Check if end of questions reached
//             const noMoreQuestions = document.querySelector('.play_again') === null && 
//                                   document.querySelector('.quitgame') !== null;

//             // Quit if at end -> doesn't currently work -> manually quitting necessary
//             if (noMoreQuestions) {
//                 const quitButton = document.getElementsByClassName("quitgame")[0];
//                 if (quitButton) quitButton.click();
//                 return;
//             }

//             if (scoreHistory && totalPoints.innerText !== "") {
//                 const allTimePoints = parseInt(scoreHistory.innerText.split(" ")[0]);
//                 if ((type === "mc" && allTimePoints >= (mclimit ? mclimit : 200)) ||
//                     (type === "fitb" && allTimePoints >= (fitblimit ? fitblimit : 100))) {
//                     document.getElementsByClassName("quitgame")[0].click();
//                     return;
//                 }
//             }

//             if (totalPoints.innerText !== "") {
//                 const playAgain = document.getElementsByClassName("play_again")[0];
//                 if (playAgain) {
//                     playAgain.click();
//                     totalPoints.innerText = "";
//                     setTimeout(() => continueAnswering(type), 2000);
//                 }
//                 return;
//             }
//             continueAnswering(type);
//         }, 4200);
//     }

//     document.addEventListener("keydown", (e) => {
//         if (
//             e.key === "a" &&
//             e.metaKey &&
//             e.ctrlKey &&
//             location.pathname === "/multiple_choice.php"
//         ) {
//             document.getElementsByClassName("blue button start_game")[0].click();
//             setTimeout(() => start("mc"), 2000);
//         }
//         if (
//             e.key === "z" &&
//             e.metaKey &&
//             e.ctrlKey &&
//             location.pathname === "/fill_in_the_blank.php"
//         ) {
//             document.getElementsByClassName("blue button start_game")[0].click();
//             setTimeout(() => start("fitb"), 2000);
//         }
//         if (
//             e.key === "x" &&
//             e.metaKey &&
//             e.ctrlKey &&
//             (location.pathname === "/multiple_choice.php" ||
//                 location.pathname === "/fill_in_the_blank.php" ||
//                 location.pathname === "/player_cdn.php")
//         ) {
//             downloadTranscript(
//                 `${location.host.charAt(0).toUpperCase()}${location.host
//                     .split(".")[0]
//                     .slice(1)} - ${
//                     location.pathname === "/player_cdn.php"
//                         ? document.title.split(":")[3]
//                         : document.title.split(" -- ")[1]
//                 } transcript.txt`
//             );
//         }
//     });

//     function generateTranscript() {
//         const transcript_obj = Array.from(
//             document.getElementsByTagName("script")
//         )
//             .map(
//                 (script) =>
//                     script.innerText.includes("var captions") &&
//                     JSON.parse(
//                         script.innerText
//                             .split("\t")[3]
//                             .split("var captions = $.extend(")
//                             .join("")
//                             .split(", PlayerCommon.Mixins.Captions),\n")
//                             .join("")
//                             .replace(/(\r\n|\n|\r)/gm, "")
//                     )
//             )
//             .filter((item) => item)[0];

//         return location.pathname === "/player_cdn.php"
//             ? punctuation
//                 ? CAPTIONS.map((item) => item.transcript).join(" ")
//                 : CAPTIONS.map((item) =>
//                       item.transcript_words.map(({ word }) => word)
//                   )
//                       .map((arr) => arr.join(" "))
//                       .join(" ")
//             : punctuation
//             ? transcript_obj.map((item) => item.transcript).join(" ")
//             : transcript_obj
//                   .map((item) => item.transcript_words.map(({ word }) => word))
//                   .map((arr) => arr.join(" "))
//                   .join(" ");
//     }

//     function answerQuestion(type) {
//         const transcript = generateTranscript();

//         let words = document.getElementsByClassName("question")[0].children;
//         let options = document.getElementsByClassName("choice_buttons")[0].children;

//         let blankIndex, correctAnswer, correctAnswerIndex;

//         for (let i = 0; i < words.length; i++)
//             if (words[i].classList.contains("underline")) blankIndex = i;

//         if (blankIndex === 0) {
//             let wordsAfterBlank = "";

//             for (let i = 1; i < words.length; i++)
//                 wordsAfterBlank += `${words[i].innerText} `;

//             type === "mc"
//                 ? Array.from(options).forEach((option, i) => {
//                       if (transcript.includes(
//                           `${option.innerText} ${wordsAfterBlank}`
//                       )) correctAnswerIndex = i;
//                   })
//                 : (correctAnswer = transcript.match(
//                       new RegExp(
//                           "(\\p{L}+)(?=\\s" + wordsAfterBlank.trim() + "\\b)",
//                           "gui"
//                       )
//                   )[0]);
//         } else {
//             let wordsBeforeBlank = "";

//             for (let i = 0; i < blankIndex; i++)
//                 wordsBeforeBlank += `${words[i].innerText} `;

//             type === "mc"
//                 ? Array.from(options).forEach((option, i) => {
//                       if (transcript.includes(
//                           `${wordsBeforeBlank}${option.innerText}`
//                       )) correctAnswerIndex = i;
//                   })
//                 : (correctAnswer = transcript.match(
//                       new RegExp(
//                           "(?<=\\b" + wordsBeforeBlank.trim() + "\\s)(\\p{L}+)",
//                           "gui"
//                       )
//                   )[0]);
//         }

//         if (type === "mc" && correctAnswerIndex !== undefined) {
//             options[correctAnswerIndex].click();
//         }
//         if (type === "fitb" && correctAnswer) {
//             document.getElementsByClassName("answer")[0].value = correctAnswer;
//             document.getElementById("submit_answer").click();
//             setTimeout(() => {
//                 const nextButton = document.getElementsByClassName("next")[0];
//                 if (nextButton) nextButton.click();
//             }, 2000);
//         }
//     }

//     function downloadTranscript(filename) {
//         const blob = new Blob([generateTranscript()], { type: "text/plain" });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = filename;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//     }
// })();

let mclimit, fitblimit, punctuation;
let isAnswering = false; // Track answering state

(function () {
    if (
        location.pathname !== "/multiple_choice.php" &&
        location.pathname !== "/fill_in_the_blank.php" &&
        location.pathname !== "/player_cdn.php"
    )
        return;

    // Function to initialize popup with Start and Stop buttons
    function initializePopup() {
        const popup = document.createElement("div");
        popup.id = "answer-popup";
        popup.style.position = "fixed";
        popup.style.top = "10px";
        popup.style.right = "10px";
        popup.style.backgroundColor = "#fff";
        popup.style.border = "1px solid #ddd";
        popup.style.padding = "10px";
        popup.style.zIndex = 1000;

        const startButton = document.createElement("button");
        startButton.innerText = "Start Answering";
        startButton.onclick = () => {
            if (!isAnswering) {
                isAnswering = true;
                const type = location.pathname === "/multiple_choice.php" ? "mc" : "fitb";
                start(type);
            }
        };

        const stopButton = document.createElement("button");
        stopButton.innerText = "Stop Answering";
        stopButton.onclick = () => {
            isAnswering = false;
        };

        popup.appendChild(startButton);
        popup.appendChild(stopButton);
        document.body.appendChild(popup);
    }

    // Start function with delay
    function start(type) {
        setTimeout(() => {
            if (isAnswering) continueAnswering(type);
        }, 1000);
    }

    function continueAnswering(type) {
        if (!isAnswering) return; // Stop answering if stopped

        answerQuestion(type);
        setTimeout(() => {
            const totalPoints = document.getElementsByClassName("total_points")[0];
            const scoreHistory = document.getElementsByClassName("score_history_link")[0];
            
            const noMoreQuestions = document.querySelector('.play_again') === null && 
                                  document.querySelector('.quitgame') !== null;

            if (noMoreQuestions) {
                const quitButton = document.getElementsByClassName("quitgame")[0];
                if (quitButton) quitButton.click();
                return;
            }

            if (scoreHistory && totalPoints.innerText !== "") {
                const allTimePoints = parseInt(scoreHistory.innerText.split(" ")[0]);
                if ((type === "mc" && allTimePoints >= (mclimit ? mclimit : 200)) ||
                    (type === "fitb" && allTimePoints >= (fitblimit ? fitblimit : 100))) {
                    document.getElementsByClassName("quitgame")[0].click();
                    return;
                }
            }

            if (totalPoints.innerText !== "") {
                const playAgain = document.getElementsByClassName("play_again")[0];
                if (playAgain) {
                    playAgain.click();
                    totalPoints.innerText = "";
                    setTimeout(() => continueAnswering(type), 2000);
                }
                return;
            }
            continueAnswering(type);
        }, 4200);
    }

    document.addEventListener("keydown", (e) => {
        if (
            e.key === "x" &&
            e.metaKey &&
            e.ctrlKey &&
            (location.pathname === "/multiple_choice.php" ||
                location.pathname === "/fill_in_the_blank.php" ||
                location.pathname === "/player_cdn.php")
        ) {
            downloadTranscript(
                `${location.host.charAt(0).toUpperCase()}${location.host
                    .split(".")[0]
                    .slice(1)} - ${
                    location.pathname === "/player_cdn.php"
                        ? document.title.split(":")[3]
                        : document.title.split(" -- ")[1]
                } transcript.txt`
            );
        }
    });

    function generateTranscript() {
        const transcript_obj = Array.from(
            document.getElementsByTagName("script")
        )
            .map(
                (script) =>
                    script.innerText.includes("var captions") &&
                    JSON.parse(
                        script.innerText
                            .split("\t")[3]
                            .split("var captions = $.extend(")
                            .join("")
                            .split(", PlayerCommon.Mixins.Captions),\n")
                            .join("")
                            .replace(/(\r\n|\n|\r)/gm, "")
                    )
            )
            .filter((item) => item)[0];

        return location.pathname === "/player_cdn.php"
            ? punctuation
                ? CAPTIONS.map((item) => item.transcript).join(" ")
                : CAPTIONS.map((item) =>
                      item.transcript_words.map(({ word }) => word)
                  )
                      .map((arr) => arr.join(" "))
                      .join(" ")
            : punctuation
            ? transcript_obj.map((item) => item.transcript).join(" ")
            : transcript_obj
                  .map((item) => item.transcript_words.map(({ word }) => word))
                  .map((arr) => arr.join(" "))
                  .join(" ");
    }

    function answerQuestion(type) {
        const transcript = generateTranscript();

        let words = document.getElementsByClassName("question")[0].children;
        let options = document.getElementsByClassName("choice_buttons")[0].children;

        let blankIndex, correctAnswer, correctAnswerIndex;

        for (let i = 0; i < words.length; i++)
            if (words[i].classList.contains("underline")) blankIndex = i;

        if (blankIndex === 0) {
            let wordsAfterBlank = "";

            for (let i = 1; i < words.length; i++)
                wordsAfterBlank += `${words[i].innerText} `;

            type === "mc"
                ? Array.from(options).forEach((option, i) => {
                      if (transcript.includes(
                          `${option.innerText} ${wordsAfterBlank}`
                      )) correctAnswerIndex = i;
                  })
                : (correctAnswer = transcript.match(
                      new RegExp(
                          "(\\p{L}+)(?=\\s" + wordsAfterBlank.trim() + "\\b)",
                          "gui"
                      )
                  )[0]);
        } else {
            let wordsBeforeBlank = "";

            for (let i = 0; i < blankIndex; i++)
                wordsBeforeBlank += `${words[i].innerText} `;

            type === "mc"
                ? Array.from(options).forEach((option, i) => {
                      if (transcript.includes(
                          `${wordsBeforeBlank}${option.innerText}`
                      )) correctAnswerIndex = i;
                  })
                : (correctAnswer = transcript.match(
                      new RegExp(
                          "(?<=\\b" + wordsBeforeBlank.trim() + "\\s)(\\p{L}+)",
                          "gui"
                      )
                  )[0]);
        }

        if (type === "mc" && correctAnswerIndex !== undefined) {
            options[correctAnswerIndex].click();
        }
        if (type === "fitb" && correctAnswer) {
            document.getElementsByClassName("answer")[0].value = correctAnswer;
            document.getElementById("submit_answer").click();
            setTimeout(() => {
                const nextButton = document.getElementsByClassName("next")[0];
                if (nextButton) nextButton.click();
            }, 2000);
        }
    }

    function downloadTranscript(filename) {
        const blob = new Blob([generateTranscript()], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Initialize the popup with Start and Stop buttons
    initializePopup();
})();
