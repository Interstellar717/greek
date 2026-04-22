var score = 0;
var turn = 0;

function updateScoreAndTurn(n = 0) {
	score += n;
	qs("#score").textContent = score + " / " + turn;
}

const newQuestion = (q, a = [], correctN, time = 60, appendTo, fullList, func) => {

	const qacon = crel("div");
	qacon.classList.add("question-answer-container");

	const qcon = crel("div");
	qcon.classList.add("question-container");

	const question = crel("h1");
	question.textContent = q;

	qcon.append(question);


	var colors = ["rgb(212, 0, 0)", "rgb(57, 183, 224)", "lightgreen", "gold"];
	var alpha = "abcdefghijklmnopqrstuvwxyz".split("");

	const acon = crel("div");
	acon.classList.add("answer-container");


	for (let i = 0; i < a.length; i++) {
		const answer = crel("div");
		answer.classList.add("answer");
		answer.classList.add("transition-answer-btn");
		answer.style.setProperty("--bkg", colors[i]);
		if (a[i].toString().split("(").length > 1) {
			answer.textContent = a[i].toString().split("(")[0].toUpperCase();
			var subhead = crel("h3");
			subhead.classList.add("subanswer");
			subhead.textContent = "(" + a[i].split("(")[1];
			answer.append(subhead);
		} else if (a[i].toString().endsWith("]")) {
			answer.textContent = a[i].toString().split("[")[0].toUpperCase();
			var subhead = crel("h3");
			subhead.classList.add("subanswer");
			subhead.textContent = "[" + a[i].split("[")[1];
			answer.append(subhead);
		} else {
			answer.textContent = a[i].toString().toUpperCase();
		}
		answer.setAttribute("qn", i + 1);

		for (let j = 0; j < 4; j++) {
			const piece1 = crel("div");
			piece1.classList.add("ani-piece");
			answer.append(piece1);
		}

		for (let j = 0; j < 4; j++) {
			const piece2 = crel("div");
			piece2.classList.add("ani-piece2");
			answer.append(piece2);
		}
		acon.append(answer);
	}

	qacon.append(qcon, acon);

	appendTo.append(qacon);


	qcon.style.setProperty("--transition", time + "s");
	setTimeout(() => qcon.style.setProperty("--qw", "100"), 100);

	const answerOnClick = e => {

		const answer = e.currentTarget;

		const correct = (correctN == answer.getAttribute("qn"));

		answer.classList.add("selected");


		answer.style.filter = "none";
		answer.style.color = "white";

		qcon.style.setProperty("--qw", "0");
		qcon.style.setProperty("--transition", "0.5s");


		setTimeout(() => qcon.style.setProperty("--qw", "100"));

		answer.querySelectorAll("div").forEach(piece => {
			piece.style.translate = "translateX(0)";
			piece.style.borderRadius = "0";
			piece.style.width = "50%";
			piece.style.height = "50%";
		});

		setTimeout(() => {
			question.style.transition = "all .75s ease-in-out";
			// question.style.transform = `translateY(-${question.offsetHeight}px)`;

			answer.style.setProperty("--bkg", correct ? "rgb(122, 255, 101)" : "rgb(227, 0, 0)");


			const afterTextContainer = crel("div");
			afterTextContainer.style.display = "none";
			afterTextContainer.classList.add("after-text-container");
			// afterTextContainer.style.transform = `translateY(-${question.offsetHeight}px)`;


			const answerText = crel("h2");
			answerText.classList.add("answer-text");
			answerText.textContent = correct ? "Correct!" : "Answer: ";

			if (!correct) {
				const answerSpan = crel("span");
				try {
					answerSpan.textContent = qsa(".answer")[correctN - 1].textContent;
				} catch (e) {
					console.log(`correctN: ${correctN}\nq:${q}\na:${a}`);
				}
				answerText.append(answerSpan);
			} else updateScoreAndTurn(1);


			if (currentQindex + 1 < fullList.length || !!func) {
				qsa('.answer').forEach(el => {
					el.addEventListener("click", () => nextQuestion(fullList, appendTo, func));
				})
			}

			afterTextContainer.append(answerText);
			// currentQindex + 1 < fullList.length && afterTextContainer.append(nextBtn);

			qcon.append(afterTextContainer);

			afterTextContainer.style.opacity = 0;
			afterTextContainer.style.display = "";
			setTimeout(() => {
				afterTextContainer.style.opacity = 1;
			}, 100);


			setTimeout(() => {
				answerText.style.opacity = 1;
			}, 500);



		}, 1000);


		qsa('.answer').forEach(el => {
			el.removeEventListener('click', answerOnClick);
			el.classList.add("no-hover");
		});
	}

	qsa(".answer").forEach(answer => {
		answer.addEventListener("click", answerOnClick);
	})
}

var currentQindex = -1;
function nextQuestion(q, appendTo, func) {

	turn++;
	updateScoreAndTurn();

	currentQindex++;

	if (currentQindex >= q.length) {
		if (func) {
			q.push(func());
		} else return false;
	}

	appendTo.innerHTML = "";

	newQuestion(
		q[currentQindex].question,
		q[currentQindex].answers,
		q[currentQindex].correct,
		q[currentQindex].time,
		appendTo,
		q,
		func
	);
}


var questions = [
	{
		question: "example question",
		answers: [
			1, 2, 3, 4
		],
		correct: 2,
		time: 60
	},
	{
		question: "example question 2",
		answers: [
			1, 2, 3, 4
		],
		correct: 2,
		time: 60
	}
];

var dictionary = {
	"verb": {
		"κάνω": "I do",
		"τρέχω": "I run",
		"περπατάω": "I walk",
		"τρώω": "I eat",
		"μιλάω": "I speak",
		"πετάω": "I fly",
		"χρησιμοποιώ": "I use",
		"μαθαίνω": "I learn",
		"αγαπώ": "I love",
		"πλένω": "I wash",
		"ρωτάω": "I ask",
		"φωνάζω": "I yell"
	},
	"noun": {
		"μήλο": "apple",
		"αχλάδι": "pear",
		"μπρόκολο": "broccoli",
		"ψωμί": "bread",
		"μπισκότο": "cookie",
		"φίλος": "friend",
		"μητέρα": "mother",
		"πατέρα": "father",
		"αδερφή": "sister",
		"αδερφός": "brother"
	},
	"adjective": {
		"ψηλός": "tall",
		"ύψηλος": "high",
		"κοντό": "short",
		"μακρύ": "long",
		"μεγάλο": "big",
		"μικρό": "small",
		"κρύο": "cold",
		"ζεστό": "hot",
		"σκουρό": "dark",
		"ανοιχτό": "light"
	},
	"positional": {
		"μακριά": "far",
		"κοντά": "close",
		"απέναντι": "across",
		"δεξιά": "right",
		"αριστερά": "left",
		"δίπλα": "next",
		"μπροστά": "front",
		"επάνω": "up",
		"κάτω": "down",
		"παρακάτω": "below",
		"παραπάνω": "above",
		"πίσω": "back"
	}
}

function stringToDictionary(string) {
	// "noun:μακριά=far,κοντά=high"
}

async function getDictionaries(arr, callback) {
	var res = {};
	for (let i of arr) {
		var f = fetch(`${window.location.pathname.split("/greek/")[0]}/greek/json/${i.toLowerCase()}.json`);
		var j = (await f).json();
		res[i] = await j;
	}

	if (callback) {
		return callback(res), res;
	} else return res;
}

(async () => {
	dictionary = await getDictionaries(["nouns", "verbs", "adjectives", "adverbs", "conjunctions", "prepositions", "interrogative", "odds and ends"], () => {
		nextQuestion([], document.querySelector(".quiz"), randomGreek);
	});
})();


const randomGreek = () => {
	var dictToUse = dictionary[arrayRandom(Object.keys(dictionary), e => !!Object.keys(e).length)];

	// alert(JSON.stringify(dictToUse))

	var rn
	var res;
	var answers;

	if (Math.floor(Math.random() * 2)) {
		rn = Math.floor(Math.random() * Object.entries(dictToUse).length);
		res = {
			question: Object.keys(dictToUse)[rn],
			time: 60
		}

		answers = comprehension(4, () => arrayRandom(Object.values(dictToUse)), [Object.values(dictToUse)[rn]], true, true);

		res.answers = answers;

		res.correct = res.answers.indexOf(dictToUse[res.question]) + 1;

	} else {

		rn = Math.floor(Math.random() * Object.entries(dictToUse).length);
		res = {
			question: Object.values(dictToUse)[rn],
			time: 60
		}

		answers = comprehension(4, () => arrayRandom(Object.keys(dictToUse)), [Object.keys(dictToUse)[rn]], true, true);

		res.answers = answers;

		// res.answers = keys
		res.correct = res.answers.indexOf(Object.keys(dictToUse)[rn]) + 1;
	}





	return res;
}