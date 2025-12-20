import React from "react";
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation, useParams } from "react-router-dom";
import { Button } from "./components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Separator } from "./components/ui/separator";
import { Input } from "./components/ui/input";
import { Slider } from "./components/base/slider/slider";
import verbs from "./data/verbs";
import "./App.css";

const formOptions = [
  { key: "infinitive", label: "1 форма (Infinitive)" },
  { key: "pastSimple", label: "2 форма (Past Simple)" },
  { key: "pastParticiple", label: "3 форма (Past Participle)" }
];

const PAGE1_COUNT = 23; // фиксированный диапазон первой страницы
const PAGE2_START = PAGE1_COUNT; // индекс, с которого начинаются слова второй страницы
const PAGE2_COUNT = Math.max(1, verbs.length - PAGE2_START); // количество слов на второй странице

const normalize = (value) => (value || "").trim().toLowerCase();
const matchesExpected = (expected, input) => {
  const normInput = normalize(input);
  return expected
    .split("/")
    .map((v) => normalize(v))
    .some((v) => v === normInput);
};
const randomItem = (list) => list[Math.floor(Math.random() * list.length)];
const buildPool = (count, startIndex = 0) => {
  // Берём N элементов начиная с startIndex без перемешивания
  const safeStart = Math.min(Math.max(startIndex, 0), verbs.length - 1);
  const safeCount = Math.max(1, Math.min(count, verbs.length - safeStart));
  return verbs.slice(safeStart, safeStart + safeCount);
};

const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const initialTriple = { infinitive: "", pastSimple: "", pastParticiple: "" };

function Home({ selectedCount, setSelectedCount, startIndex, setStartIndex }) {
  const navigate = useNavigate();

  const startMode = (modeKey) => {
    navigate(`/mode/${modeKey}`, { state: { count: selectedCount, startIndex } });
  };

  const handleRangeChange = (next) => {
    const [startVal, endVal] = Array.isArray(next) ? next : [next.start, next.end];
    const safeStart = Math.min(Math.max(startVal, 0), verbs.length - 1);
    const safeEnd = Math.min(Math.max(endVal, safeStart + 1), verbs.length);
    setStartIndex(safeStart);
    setSelectedCount(safeEnd - safeStart);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 px-4 py-10 text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <Card className="border border-slate-800/70 bg-slate-900/80">
          <CardHeader className="flex flex-col gap-2">
            <p className="text-sm uppercase tracking-wide text-blue-400">Irregular Verbs Exerciser</p>
            <CardTitle>Выбор режима</CardTitle>
            <CardDescription>
              Слова берутся из файла <code>src/data/verbs.js</code>. Перед запуском выберите количество слов и режим.
            </CardDescription>
          </CardHeader>
          <Separator className="bg-slate-800" />
          <CardContent className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <div className="space-y-4">
              <p className="font-semibold">Сколько слов участвует</p>
              <div className="flex items-center justify-between">
                <Badge>
                  {selectedCount} / {verbs.length}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setStartIndex(0);
                    setSelectedCount(verbs.length);
                  }}
                >
                  Выбрать все
                </Button>
              </div>
              <div className="space-y-2">
                <Slider
                  min={0}
                  max={verbs.length}
                  value={[startIndex, startIndex + selectedCount]}
                  onValueChange={handleRangeChange}
                  labelPosition="top-floating"
                  step={1}
                />
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>Текущий диапазон</span>
                  <span className="text-slate-100 font-semibold">
                    {selectedCount} слов ( {startIndex + 1} — {startIndex + selectedCount} )
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setStartIndex(0);
                      setSelectedCount(PAGE1_COUNT);
                    }}
                  >
                    1 страница ( {PAGE1_COUNT} слов)
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setStartIndex(PAGE2_START);
                      setSelectedCount(PAGE2_COUNT);
                    }}
                  >
                    2 страница ( {PAGE2_COUNT} слов)
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <Card className="border border-slate-800/60 bg-slate-900/70">
                <CardContent className="flex flex-col gap-3 pt-6">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">Русское слово → одна форма</p>
                  </div>
                  <Button onClick={() => startMode("single")}>Начать</Button>
                </CardContent>
              </Card>

              <Card className="border border-slate-800/60 bg-slate-900/70">
                <CardContent className="flex flex-col gap-3 pt-6">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">Русское слово → три формы</p>
                  </div>
                  <Button variant="secondary" onClick={() => startMode("triple")}>Начать</Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-800/70 bg-slate-900/80">
          <CardHeader className="flex flex-col gap-2">
            <CardTitle>Словарь (все слова)</CardTitle>
            <CardDescription>1, 2, 3 формы и перевод из файла <code>src/data/verbs.js</code></CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="overflow-x-auto">
              <div className="min-w-full text-sm">
                <div className="grid grid-cols-4 gap-2 border-b border-slate-800 pb-2 text-slate-400">
                  <span>1 форма</span>
                  <span>2 форма</span>
                  <span>3 форма</span>
                  <span>Перевод</span>
                </div>
                <div className="divide-y divide-slate-800">
                  {verbs.map((v) => (
                    <div key={v.infinitive} className="grid grid-cols-4 gap-2 py-2 items-center">
                      <span className="text-slate-100">{v.infinitive}</span>
                      <span className="text-slate-100">{v.pastSimple}</span>
                      <span className="text-slate-100">{v.pastParticiple}</span>
                      <span className="text-slate-200">{v.translation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TrainerPage() {
  const { mode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { selectedCount, startIndex } = React.useMemo(() => {
    const value = Number(location.state?.count);
    const start = Number.isFinite(location.state?.startIndex) ? Math.max(0, location.state.startIndex) : 0;
    const clampedCount = Number.isFinite(value) && value > 0 ? Math.min(value, verbs.length - start) : Math.min(12, verbs.length - start);
    return {
      selectedCount: clampedCount,
      startIndex: start
    };
  }, [location.state]);

  const [pool, setPool] = React.useState(() => buildPool(selectedCount, startIndex));
  const [question, setQuestion] = React.useState(null);
  const [singleAnswer, setSingleAnswer] = React.useState("");
  const [tripleAnswers, setTripleAnswers] = React.useState(initialTriple);
  const [result, setResult] = React.useState(null);
  const [stats, setStats] = React.useState({ correct: 0, total: 0 });
  const [graded, setGraded] = React.useState(false);
  const [answers, setAnswers] = React.useState([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [showSummary, setShowSummary] = React.useState(false);
  const [tasks, setTasks] = React.useState([]);
  const singleInputRef = React.useRef(null);
  const tripleInputRef = React.useRef(null);

  const createQuestion = React.useCallback(
    (verb) => {
      if (!verb) return null;
      if (mode === "single") {
        const formKey = randomItem(formOptions).key;
        return { verb, formKey };
      }
      if (mode === "triple") {
        return { verb, formKey: null };
      }
      return null;
    },
    [mode]
  );

  React.useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  React.useEffect(() => {
    const basePool = buildPool(selectedCount, startIndex);
    const orderedPool = mode === "triple" ? shuffle(basePool) : basePool;
    setPool(orderedPool);
    setCurrentIndex(0);
    setAnswers([]);
    setStats({ correct: 0, total: 0 });
    setShowSummary(false);
  }, [selectedCount, mode, startIndex]);

  React.useEffect(() => {
    if (!pool.length) return;
    setResult(null);
    setSingleAnswer("");
    setTripleAnswers(initialTriple);
    setGraded(false);
    setShowSummary(false);
    setCurrentIndex(0);
    setAnswers([]);
    setStats({ correct: 0, total: 0 });

    if (mode === "single") {
      const newTasks = shuffle(
        pool.flatMap((verb) => formOptions.map((f) => ({ verb, formKey: f.key })))
      );
      setTasks(newTasks);
      setQuestion(newTasks[0] || null);
    } else {
      setTasks([]);
      setQuestion(createQuestion(pool[0]));
    }
  }, [pool, mode, createQuestion]);

  React.useEffect(() => {
    if (mode === "single") {
      singleInputRef.current?.focus();
    } else {
      tripleInputRef.current?.focus();
    }
  }, [question, mode]);

  if (mode !== "single" && mode !== "triple") {
    return <Navigate to="/" replace />;
  }

  const gradeCurrent = () => {
    if (!question) return null;

    if (mode === "single") {
      const expected = question.verb[question.formKey];
      const isCorrect = matchesExpected(expected, singleAnswer);
      const requiredLabel = formOptions.find((f) => f.key === question.formKey)?.label;
      return {
        isCorrect,
        summary: {
          translation: question.verb.translation,
          required: requiredLabel,
          userAnswer: singleAnswer || "—",
          ok: isCorrect
        },
        resultObj: {
          status: isCorrect ? "success" : "danger",
          message: isCorrect ? "Верно!" : "Есть неточность. Сверьтесь с ответом.",
          details: expected
        }
      };
    }

    const checks = formOptions.map(({ key, label }) => ({
      key,
      label,
      user: tripleAnswers[key],
      expected: question.verb[key],
      ok: matchesExpected(question.verb[key], tripleAnswers[key])
    }));
    const allCorrect = checks.every((c) => c.ok);

    return {
      isCorrect: allCorrect,
      summary: {
        translation: question.verb.translation,
        required: "3 формы",
        userAnswer: `${tripleAnswers.infinitive || "—"} / ${tripleAnswers.pastSimple || "—"} / ${tripleAnswers.pastParticiple || "—"}`,
        ok: allCorrect
      },
      resultObj: {
        status: allCorrect ? "success" : "danger",
        message: allCorrect ? "Все 3 формы верны!" : "Есть ошибки. Проверьте подсказку ниже.",
        checks
      }
    };
  };

  const totalItems = mode === "single" ? tasks.length : pool.length;

  const handleSubmit = () => {
    if (!question || graded) return;
    const gradedData = gradeCurrent();
    if (!gradedData) return;

    setResult(gradedData.resultObj);
    setStats((prev) => ({
      total: prev.total + 1,
      correct: prev.correct + (gradedData.isCorrect ? 1 : 0)
    }));
    setAnswers((prev) => [...prev, gradedData.summary]);
    setGraded(true);
  };

  const handleNext = () => {
    if ((!question && !showSummary) || totalItems === 0) return;

    let gradedData = null;
    if (!graded && question) {
      gradedData = gradeCurrent();
      if (gradedData) {
        setStats((prev) => ({
          total: prev.total + 1,
          correct: prev.correct + (gradedData.isCorrect ? 1 : 0)
        }));
        setAnswers((prev) => [...prev, gradedData.summary]);
      }
    }

    setResult(null);
    setSingleAnswer("");
    setTripleAnswers(initialTriple);
    setGraded(false);

    const nextIndex = currentIndex + 1;
    if (nextIndex >= totalItems) {
      setShowSummary(true);
      setQuestion(null);
      return;
    }

    setCurrentIndex(nextIndex);
    if (mode === "single") {
      setQuestion(tasks[nextIndex]);
    } else {
      const nextVerb = pool[nextIndex];
      setQuestion(createQuestion(nextVerb));
    }
  };

  const rebuildPool = () => {
    const basePool = buildPool(selectedCount, startIndex);
    const orderedPool = mode === "triple" ? shuffle(basePool) : basePool;
    setPool(orderedPool);
  };

  const accuracy = stats.total ? Math.round((stats.correct / stats.total) * 100) : 0;
  const currentForm = formOptions.find((f) => f.key === question?.formKey);

  const renderSingleMode = () => (
    <Card className="border border-slate-800/60 bg-slate-900/80">
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-slate-400">Русское слово</p>
          <p className="text-2xl font-semibold text-white">{question?.verb.translation ?? "—"}</p>
          <p className="text-sm text-slate-400">Введите: {currentForm?.label}</p>
        </div>
        <Input
          placeholder={currentForm?.label}
          value={singleAnswer}
          onChange={(e) => setSingleAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          autoFocus
          ref={singleInputRef}
        />
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleSubmit}>Проверить</Button>
          <Button variant="outline" onClick={handleNext}>Следующее слово</Button>
        </div>
        {result && (
          <div className="space-y-2">
            <Badge variant={result.status === "success" ? "success" : "danger"}>{result.message}</Badge>
            {result.status === "danger" && (
              <p className="text-sm text-slate-400">
                Правильно: <span className="font-semibold text-white">{result.details}</span>
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderTripleMode = () => (
    <Card className="border border-slate-800/60 bg-slate-900/80">
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-slate-400">Русское слово</p>
          <p className="text-2xl font-semibold text-white">{question?.verb.translation ?? "—"}</p>
          <p className="text-sm text-slate-400">Напишите сразу все 3 формы</p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {formOptions.map(({ key, label }) => (
            <Input
              key={key}
              placeholder={label}
              value={tripleAnswers[key]}
              onChange={(e) => setTripleAnswers((prev) => ({ ...prev, [key]: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              ref={key === "infinitive" ? tripleInputRef : undefined}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleSubmit}>Проверить</Button>
          <Button variant="outline" onClick={handleNext}>Следующее слово</Button>
        </div>
        {result && (
          <div className="space-y-2">
            <Badge variant={result.status === "success" ? "success" : "danger"}>{result.message}</Badge>
            {result.status === "danger" && (
              <div className="grid gap-2 md:grid-cols-3">
                {result.checks.map((check) => (
                  <Card key={check.key} className="border border-slate-800/40 bg-slate-900/70 p-3">
                    <p className="text-sm text-slate-400">{check.label}</p>
                    <p className="text-base font-semibold">
                      Ваш ответ:{" "}
                      <span className={check.ok ? "text-emerald-400" : "text-rose-400"}>
                        {check.user || "—"}
                      </span>
                    </p>
                    {!check.ok && (
                      <p className="text-sm text-slate-400">
                        Правильно: <span className="font-semibold text-white">{check.expected}</span>
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 px-4 py-10 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-wide text-primary">Irregular Verbs Trainer</p>
            <h1 className="text-2xl font-bold">
              {mode === "single" ? "Русское слово → одна форма" : "Русское слово → три формы"}
            </h1>
            <p className="text-default-500">Слова в игре: {selectedCount}. Перемешайте, чтобы начать заново.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/")}>Изменить количество/режим</Button>
            <Button onClick={rebuildPool}>Перемешать</Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div>
            {!showSummary && question ? (
              mode === "single" ? renderSingleMode() : renderTripleMode()
            ) : (
              <Card className="border border-slate-800/60 bg-slate-900/80">
                <CardContent className="space-y-3">
                  <p className="text-lg font-semibold text-slate-100">Вопросы закончились</p>
                  <p className="text-sm text-slate-400">
                    Посмотрите итоги ниже или начните заново, выбрав новое количество слов.
                  </p>
                  <Button onClick={rebuildPool}>Начать заново</Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <Card className="border border-slate-800/60 bg-slate-900/80">
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Статистика</p>
                  <Badge variant="secondary">{accuracy || 0}% точность</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-blue-600/10 p-3 text-blue-300 border border-blue-600/30">
                    <p className="text-xs uppercase tracking-wide">Верных</p>
                    <p className="text-xl font-bold">{stats.correct}</p>
                  </div>
                  <div className="rounded-lg bg-slate-800/60 p-3 text-slate-200 border border-slate-700/60">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Всего ответов</p>
                    <p className="text-xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {showSummary && answers.length > 0 && (
              <Card className="border border-slate-800/60 bg-slate-900/80">
                <CardContent className="space-y-3">
                  <p className="font-semibold">Ответы</p>
                  <div className="overflow-x-auto">
                    <div className="min-w-full text-sm">
                      <div className="grid grid-cols-[2fr_2fr_auto] gap-2 border-b border-slate-800 pb-2 text-slate-400">
                        <span>Что требовалось</span>
                        <span>Ответ игрока</span>
                        <span>Результат</span>
                      </div>
                      <div className="divide-y divide-slate-800">
                        {answers.map((a, idx) => (
                          <div key={idx} className="grid grid-cols-[2fr_2fr_auto] gap-2 py-2 items-center">
                            <span className="text-slate-200">
                              {a.translation} — {a.required}
                            </span>
                            <span className="text-slate-100">{a.userAnswer}</span>
                            <span className={a.ok ? "text-emerald-400" : "text-rose-400"}>
                              {a.ok ? "✔" : "✖"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  React.useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const defaultCount = Math.min(12, verbs.length);
  const [startIndex, setStartIndex] = React.useState(0);
  const [selectedCount, setSelectedCount] = React.useState(defaultCount);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              selectedCount={selectedCount}
              startIndex={startIndex}
              setStartIndex={setStartIndex}
              setSelectedCount={setSelectedCount}
            />
          }
        />
        <Route path="/mode/:mode" element={<TrainerPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
