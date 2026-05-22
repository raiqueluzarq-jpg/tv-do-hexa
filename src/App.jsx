import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SHEET_URL =
  "https://opensheet.elk.sh/1xrWaEm2IqESM4IeAxRs4lJYNQmDKFw205RyUDZhyBIc/TVs";

const WHATSAPP_LINK =
  "https://whatsapp.com/channel/0029VbD34By0QeanVfEiF22f";

const TELEGRAM_LINK = "https://t.me/tv_do_hexa";

const APP_VERSION = "v2.1-mobile-ok";

export default function App() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [tvs, setTvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadTVs() {
      try {
        const response = await fetch(`${SHEET_URL}?t=${Date.now()}`);
        const data = await response.json();
        setTvs(data);
      } catch (err) {
        console.error("Erro ao carregar TVs", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadTVs();
  }, []);

  const allQuestions = [
    {
      key: "selectionMode",
      title: "Como você quer escolher sua TV?",
      subtitle: "Escolha o jeito que faz mais sentido pra você.",
      icon: "📺",
      options: [
        {
          label: "Quero a maior TV possível",
          value: "📏 Quero a maior tela possível",
          icon: "📏",
        },
        {
          label: "Quero a TV ideal pro meu ambiente",
          value: "🏠 Tamanho ideal para meu ambiente",
          icon: "🏠",
        },
      ],
    },
    {
      key: "distance",
      title: "Qual a distância do sofá até a TV?",
      subtitle: "Escolha a distância aproximada.",
      icon: "📏",
      options: [
        { label: "Até 2m", value: "Até 2m", icon: "🛋️" },
        { label: "2m – 2.5m", value: "2m – 2.5m", icon: "📺" },
        { label: "2.5m – 3m", value: "2.5m – 3m", icon: "🏠" },
        { label: "Mais de 3m", value: "Mais de 3m", icon: "🏟️" },
      ],
      condition: () => !answers.selectionMode?.includes("maior tela"),
    },
    {
      key: "usage",
      title: "O que você mais assiste?",
      subtitle: "Isso ajuda a escolher o tipo de imagem ideal.",
      icon: "🎯",
      options: [
        { label: "Futebol", value: "⚽ Futebol", icon: "⚽" },
        { label: "Games / PS5", value: "🎮 Games / PS5", icon: "🎮" },
        { label: "Filmes e séries", value: "🎬 Filmes e séries", icon: "🎬" },
        { label: "Uso misto", value: "📺 Uso misto", icon: "📺" },
      ],
    },
    {
      key: "brightness",
      title: "Sua sala é muito iluminada?",
      subtitle: "",
      icon: "☀️",
      options: [
        { label: "Sim", value: "☀️ Sim", icon: "☀️" },
        { label: "Não", value: "🌙 Não", icon: "🌙" },
      ],
    },
    {
      key: "colors",
      title: "Qual imagem você prefere?",
      subtitle: "",
      icon: "🎨",
      options: [
        { label: "Cores vibrantes", value: "🔥 Cores vibrantes", icon: "🔥" },
        { label: "Cores naturais", value: "🎬 Cores naturais", icon: "🎬" },
      ],
    },
    {
      key: "budget",
      title: "Quanto pretende gastar?",
      subtitle: "",
      icon: "💰",
      options: [
        { label: "Até R$ 2.000", value: "Até R$ 2.000", icon: "💵" },
        { label: "R$ 2.000 – R$ 3.500", value: "R$ 2.000 – R$ 3.500", icon: "💳" },
        { label: "R$ 3.500 – R$ 5.000", value: "R$ 3.500 – R$ 5.000", icon: "🏆" },
        { label: "R$ 5.000 – R$ 8.000", value: "R$ 5.000 – R$ 8.000", icon: "⭐" },
        { label: "R$ 8.000 – R$ 10.000", value: "R$ 8.000 – R$ 10.000", icon: "💎" },
        { label: "R$ 10.000 – R$ 55.000", value: "R$ 10.000 – R$ 55.000", icon: "🚀" },
        { label: "O céu é o limite", value: "O céu é o limite", icon: "🌌" },
      ],
    },
  ];

  const questions = allQuestions.filter((q) => !q.condition || q.condition());
  const currentQuestion = questions[step];

  const normalizePrice = (value) => {
    if (!value) return 0;
    return (
      Number(
        String(value)
          .replace(/[^0-9,.-]/g, "")
          .replace(".", "")
          .replace(",", ".")
      ) || 0
    );
  };

  const formatMoney = (value) => normalizePrice(value).toLocaleString("pt-BR");

  const getBudgetLimit = () => {
    const budget = answers.budget || "";
    if (budget.includes("Até R$ 2.000")) return 2000;
    if (budget.includes("3.500")) return 3500;
    if (budget.includes("5.000")) return 5000;
    if (budget.includes("8.000")) return 8000;
    if (budget.includes("10.000") && !budget.includes("55.000")) return 10000;
    if (budget.includes("55.000")) return 55000;
    return 999999;
  };

  const getMinimumSize = () => {
    if (answers.selectionMode?.includes("maior tela")) return 0;
    const distance = answers.distance || "";
    if (distance.includes("Até 2m")) return 32;
    if (distance.includes("2m – 2.5m")) return 43;
    if (distance.includes("2.5m – 3m")) return 50;
    return 55;
  };

  const getTVSize = (tv) => Number(String(tv.Tamanho || "").replace(/[^0-9]/g, "")) || 0;
  const getBestLink = (tv) => tv["Link ml"] || tv["Link amazon"] || tv["Link shopee"] || "#";
  const getImageUrl = (tv) => tv.Imagens || tv.Imagem || tv["Imagem URL"] || "";
  const hasAnyLink = (tv) => Boolean(tv["Link ml"] || tv["Link amazon"] || tv["Link shopee"]);

  const getDisplayName = (tv) => {
    const brand = tv.Marca || "";
    const size = tv.Tamanho || "";
    const model = tv.Modelo || "TV recomendada";
    const escapedBrand = brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const modelWithoutBrand = brand
      ? model.replace(new RegExp("^" + escapedBrand + "\\s*", "i"), "")
      : model;
    return { brand, model: modelWithoutBrand, size };
  };

  const scoreTV = (tv) => {
    let score = 0;
    const futebol = Number(tv.Futebol) || 0;
    const filmes = Number(tv.Filmes) || 0;
    const games = Number(tv.Games) || 0;
    const salaClara = Number(tv["Sala Clara"]) || 0;
    const coresVivas = Number(tv["Cores Vivas"]) || 0;
    const coresNaturais = Number(tv["Cores Naturais"]) || 0;
    const compatibilidade = Number(tv["Compatibilidade Geral"]) || 0;
    const size = getTVSize(tv);

    if (answers.usage?.includes("Futebol")) score += futebol * 3;
    if (answers.usage?.includes("Filmes")) score += filmes * 3;
    if (answers.usage?.includes("Games")) score += games * 3;
    if (answers.usage?.includes("Uso misto")) score += futebol + filmes + games;
    if (answers.brightness?.includes("Sim")) score += salaClara * 2;
    if (answers.colors?.includes("vibrantes")) score += coresVivas * 2;
    if (answers.colors?.includes("naturais")) score += coresNaturais * 2;

    score += compatibilidade * 2;
    score += Math.min(size / 10, 12);

    if (String(tv["HDMI 2.1"]).toLowerCase() === "sim" && answers.usage?.includes("Games")) {
      score += 8;
    }

    return score;
  };

  const rankedTVs = useMemo(() => {
    const budgetLimit = getBudgetLimit();
    const minSize = getMinimumSize();

    const baseTVs = tvs
      .filter(hasAnyLink)
      .filter((tv) => normalizePrice(tv["Preço Médio"]) > 0)
      .filter((tv) => normalizePrice(tv["Preço Médio"]) <= budgetLimit);

    let filtered = baseTVs.filter((tv) => getTVSize(tv) >= minSize);
    let fallbackMode = false;

    if (filtered.length === 0) {
      fallbackMode = true;
      filtered = baseTVs;
    }

    return filtered
      .map((tv) => ({ ...tv, score: scoreTV(tv), fallbackMode }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 30);
  }, [tvs, answers]);

  const getCompatibility = (tv) => {
    if (!rankedTVs.length) return 0;
    const bestScore = rankedTVs[0]?.score || 1;
    return Math.max(58, Math.min(98, Math.round((tv.score / bestScore) * 96)));
  };

  const getProfile = () => {
    if (answers.usage?.includes("Futebol")) return "Fanático por Futebol";
    if (answers.usage?.includes("Filmes")) return "Cinema em Casa";
    if (answers.usage?.includes("Games")) return "Gamer Competitivo";
    return "Maratonista Premium";
  };

  const getProfileIcon = () => {
    if (answers.usage?.includes("Futebol")) return "⚽";
    if (answers.usage?.includes("Filmes")) return "🎬";
    if (answers.usage?.includes("Games")) return "🎮";
    return "📺";
  };

  const getRecommendations = () => {
    const biggestScreen = [...rankedTVs].sort((a, b) => {
      const sizeDiff = getTVSize(b) - getTVSize(a);
      if (sizeDiff !== 0) return sizeDiff;
      return b.score - a.score;
    })[0];

    const bestImage = [...rankedTVs].sort((a, b) => {
      const aImage = (Number(a.Filmes) || 0) + (Number(a["Cores Naturais"]) || 0) + (Number(a["Cores Vivas"]) || 0);
      const bImage = (Number(b.Filmes) || 0) + (Number(b["Cores Naturais"]) || 0) + (Number(b["Cores Vivas"]) || 0);
      return bImage - aImage || b.score - a.score;
    })[0];

    const cheapestRecommended = [...rankedTVs]
      .filter((tv) => getCompatibility(tv) >= 70)
      .sort((a, b) => normalizePrice(a["Preço Médio"]) - normalizePrice(b["Preço Médio"]) || b.score - a.score)[0];

    return [
      {
        title: "Maior tela possível",
        badge: "IMERSÃO",
        icon: "📏",
        tv: biggestScreen,
        description: "Para quem quer máxima imersão dentro do orçamento.",
      },
      {
        title: "Melhor qualidade de imagem",
        badge: "IMAGEM",
        icon: "🎬",
        tv: bestImage,
        description: "Melhor combinação de contraste, cores e experiência premium.",
      },
      {
        title: "Mais barata recomendada",
        badge: "ECONOMIA",
        icon: "💰",
        tv: cheapestRecommended,
        description: "A opção mais econômica que ainda combina bem com seu perfil.",
      },
    ].filter((item) => item.tv);
  };

  const handleAnswer = (option) => {
    setAnswers((previous) => ({ ...previous, [currentQuestion.key]: option.value }));
    setTimeout(() => setStep((previous) => previous + 1), 160);
  };

  const resetQuiz = () => {
    setStep(0);
    setAnswers({});
  };

  const progress = Math.min((step / questions.length) * 100, 100);

  return (
    <>
      <style>{`
        :root {
          --green-900: #052e16;
          --green-800: #064e3b;
          --green-700: #047857;
          --green-500: #10b981;
          --gold-400: #facc15;
          --gold-500: #eab308;
          --zinc-100: #f4f4f5;
          --zinc-200: #e4e4e7;
          --zinc-400: #a1a1aa;
          --zinc-500: #71717a;
          --zinc-600: #52525b;
          --zinc-900: #18181b;
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background:
            radial-gradient(circle at top left, rgba(250, 204, 21, 0.22), transparent 30%),
            radial-gradient(circle at top right, rgba(16, 185, 129, 0.20), transparent 30%),
            linear-gradient(180deg, #f8fafc 0%, #ecfdf5 48%, #f4f4f5 100%);
          color: var(--zinc-900);
        }
        a { color: inherit; }
        .page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px 18px;
          position: relative;
          overflow: hidden;
        }
        .page::before {
          content: "";
          position: fixed;
          inset: -20%;
          background:
            linear-gradient(115deg, transparent 0 45%, rgba(5, 150, 105, 0.06) 45% 47%, transparent 47% 100%),
            linear-gradient(65deg, transparent 0 45%, rgba(234, 179, 8, 0.07) 45% 47%, transparent 47% 100%);
          pointer-events: none;
        }
        .shell { width: 100%; max-width: 1120px; position: relative; z-index: 1; }
        .hero { text-align: center; margin-bottom: 26px; }
        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.78);
          border: 1px solid rgba(5, 150, 105, 0.18);
          color: var(--green-800);
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          box-shadow: 0 12px 30px rgba(4, 120, 87, 0.08);
          margin-bottom: 14px;
          backdrop-filter: blur(12px);
        }
        .brand-title {
          margin: 0;
          font-size: clamp(42px, 8vw, 72px);
          line-height: 0.95;
          font-weight: 1000;
          letter-spacing: -0.06em;
          color: var(--green-800);
        }
        .brand-title span { color: var(--gold-500); text-shadow: 0 10px 30px rgba(234, 179, 8, 0.20); }
        .subtitle { margin: 14px auto 0; max-width: 680px; color: var(--zinc-600); font-size: clamp(16px, 2.5vw, 19px); line-height: 1.55; }
        .status { margin: 10px 0 0; color: var(--zinc-500); font-size: 13px; font-weight: 700; }
        .status.error { color: #dc2626; }
        .version { margin-top: 6px; color: var(--zinc-400); font-size: 11px; font-weight: 800; }
        .progress-wrap {
          width: 100%; height: 14px; border-radius: 999px; padding: 3px;
          background: rgba(255, 255, 255, 0.72); border: 1px solid rgba(5, 150, 105, 0.12);
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.04); margin: 28px 0;
        }
        .progress { height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--green-700), var(--green-500), var(--gold-400)); transition: width 0.45s ease; box-shadow: 0 8px 22px rgba(5,150,105,0.28); }
        .glass-card {
          background: rgba(255, 255, 255, 0.86); border: 1px solid rgba(255,255,255,0.78); border-radius: 36px;
          box-shadow: 0 24px 80px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.90);
          backdrop-filter: blur(18px);
        }
        .question-card { padding: clamp(24px, 4vw, 42px); }
        .question-header { text-align: center; margin-bottom: 28px; }
        .question-icon {
          width: 72px; height: 72px; display: inline-flex; align-items: center; justify-content: center; border-radius: 24px;
          background: linear-gradient(145deg, #ecfdf5, #ffffff); border: 1px solid rgba(5,150,105,0.12);
          box-shadow: 0 18px 35px rgba(5,150,105,0.12); font-size: 34px; margin-bottom: 16px;
        }
        .question-title { margin: 0; font-size: clamp(28px, 5vw, 42px); line-height: 1.05; font-weight: 1000; letter-spacing: -0.04em; color: var(--zinc-900); }
        .question-subtitle { margin: 10px auto 0; max-width: 640px; color: var(--zinc-600); font-size: 16px; line-height: 1.55; }
        .options-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
        .option-card {
          display: flex; gap: 16px; align-items: center; text-align: left; width: 100%;
          border: 1px solid rgba(5,150,105,0.13); border-radius: 26px;
          background: linear-gradient(145deg, #ffffff, #f8fafc); padding: 20px; cursor: pointer;
          transition: 0.22s ease; box-shadow: 0 12px 30px rgba(15,23,42,0.05);
        }
        .option-card:hover { transform: translateY(-3px) scale(1.01); border-color: rgba(5,150,105,0.45); box-shadow: 0 22px 48px rgba(5,150,105,0.13); background: linear-gradient(145deg, #ffffff, #ecfdf5); }
        .option-icon { width: 46px; height: 46px; flex: 0 0 auto; display: flex; align-items: center; justify-content: center; border-radius: 17px; background: #ecfdf5; font-size: 24px; }
        .option-label { display: block; color: var(--zinc-900); font-size: 18px; font-weight: 950; }
        .result-hero { padding: clamp(28px, 5vw, 46px); text-align: center; overflow: hidden; position: relative; }
        .result-hero::before { content: ""; position: absolute; width: 260px; height: 260px; border-radius: 999px; background: rgba(250,204,21,0.14); top: -120px; right: -90px; }
        .result-icon { font-size: 64px; margin-bottom: 14px; position: relative; }
        .profile-title { margin: 0; color: var(--green-800); font-size: clamp(34px, 6vw, 52px); line-height: 1; font-weight: 1000; letter-spacing: -0.05em; position: relative; }
        .result-copy { margin: 14px auto 0; max-width: 620px; color: var(--zinc-600); font-size: 17px; line-height: 1.55; position: relative; }
        .warning { padding: 16px 18px; border-radius: 22px; border: 1px solid rgba(234,179,8,0.35); background: linear-gradient(145deg,#fef9c3,#fff7ed); color: #854d0e; font-weight: 850; line-height: 1.4; box-shadow: 0 14px 35px rgba(234,179,8,0.10); }
        .results-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 20px; }
        .tv-card { padding: 22px; position: relative; overflow: hidden; }
        .tv-card::before { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(16,185,129,0.08), transparent 34%); pointer-events: none; }
        .tv-card > * { position: relative; }
        .card-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
        .card-title { margin: 0; color: var(--green-800); font-size: 19px; line-height: 1.15; font-weight: 1000; letter-spacing: -0.03em; }
        .mini-badge { display: inline-flex; align-items: center; border-radius: 999px; padding: 6px 10px; background: rgba(250,204,21,0.18); color: #854d0e; border: 1px solid rgba(234,179,8,0.30); font-size: 11px; font-weight: 1000; letter-spacing: 0.08em; }
        .image-box { aspect-ratio: 16 / 9; border-radius: 22px; background: radial-gradient(circle at center, rgba(16,185,129,0.10), transparent 52%), #f8fafc; border: 1px solid rgba(15,23,42,0.06); display: flex; align-items: center; justify-content: center; overflow: hidden; font-size: 52px; margin-bottom: 16px; }
        .image-box img { width: 100%; height: 100%; object-fit: contain; padding: 10px; }
        .compat-pill { display: inline-flex; align-items: center; gap: 7px; background: linear-gradient(90deg,#dcfce7,#ecfdf5); color: var(--green-800); border: 1px solid rgba(5,150,105,0.16); font-weight: 1000; border-radius: 999px; padding: 7px 11px; font-size: 14px; margin-bottom: 13px; }
        .brand { margin: 0 0 4px; color: var(--zinc-500); font-size: 12px; font-weight: 1000; letter-spacing: 0.08em; text-transform: uppercase; }
        .model { margin: 0 0 4px; color: var(--zinc-900); font-size: 23px; line-height: 1.05; font-weight: 1000; letter-spacing: -0.04em; }
        .size { margin: 0 0 10px; color: var(--green-700); font-size: 18px; font-weight: 1000; }
        .meta { margin: 0 0 12px; color: var(--zinc-500); font-size: 14px; font-weight: 750; }
        .price-label { margin: 0; color: var(--zinc-500); font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 1000; }
        .price { margin: 2px 0 4px; color: var(--zinc-900); font-size: 31px; line-height: 1; font-weight: 1000; letter-spacing: -0.05em; }
        .price-note { margin: 0 0 14px; color: var(--zinc-400); font-size: 12px; font-weight: 700; line-height: 1.35; }
        .desc { color: var(--zinc-600); margin: 0 0 18px; line-height: 1.45; font-size: 14px; font-weight: 650; }
        .primary-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%; text-decoration: none; border: 0; border-radius: 20px; padding: 15px 18px; background: linear-gradient(135deg,var(--green-700),var(--green-500)); color: white; font-size: 16px; font-weight: 1000; cursor: pointer; box-shadow: 0 16px 32px rgba(5,150,105,0.22); transition: 0.2s ease; }
        .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 20px 38px rgba(5,150,105,0.28); }
        .telegram-btn { background: linear-gradient(135deg,#0284c7,#38bdf8); box-shadow: 0 16px 32px rgba(2,132,199,0.18); }
        .gold-btn { background: linear-gradient(135deg,var(--gold-500),#fde047); color: var(--zinc-900); box-shadow: 0 16px 32px rgba(234,179,8,0.22); }
        .extra-card { padding: 24px; }
        .section-title { margin: 0 0 16px; font-size: clamp(24px, 4vw, 32px); line-height: 1; font-weight: 1000; letter-spacing: -0.04em; }
        .extra-list { display: grid; gap: 12px; }
        .extra-item { display: flex; align-items: center; justify-content: space-between; gap: 16px; text-decoration: none; color: inherit; padding: 16px; border-radius: 22px; background: linear-gradient(145deg,#ffffff,#f8fafc); border: 1px solid rgba(5,150,105,0.10); transition: 0.2s ease; }
        .extra-item:hover { transform: translateY(-2px); border-color: rgba(5,150,105,0.35); background: linear-gradient(145deg,#ffffff,#ecfdf5); }
        .extra-name { margin: 0 0 5px; color: var(--zinc-900); font-weight: 1000; line-height: 1.2; }
        .extra-meta { margin: 0; color: var(--zinc-500); font-size: 14px; font-weight: 700; }
        .extra-percent { text-align: right; flex-shrink: 0; }
        .extra-percent strong { display: block; color: var(--green-700); font-size: 22px; line-height: 1; font-weight: 1000; }
        .extra-percent span { display: block; color: var(--zinc-500); margin-top: 3px; font-size: 12px; font-weight: 800; }
        .cta-card { padding: 28px; text-align: center; }
        .cta-buttons { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; margin-top: 20px; }
        .cta-buttons .primary-btn { width: auto; min-width: 160px; padding-inline: 22px; }
        .reset-btn { border: 0; background: transparent; color: var(--green-800); font-weight: 1000; font-size: 16px; text-decoration: underline; cursor: pointer; margin-top: 18px; }
        .empty-card { padding: 34px; text-align: center; }
        @media (max-width: 920px) {
          .results-grid, .options-grid { grid-template-columns: 1fr; }
          .page { align-items: flex-start; padding-top: 22px; }
          .glass-card { border-radius: 28px; }
          .question-card { padding: 22px; }
        }
        @media (max-width: 560px) {
          .cta-buttons { flex-direction: column; }
          .cta-buttons .primary-btn { width: 100%; }
          .extra-item { align-items: flex-start; }
        }
      `}</style>

      <div className="page">
        <div className="shell">
          <header className="hero">
            <div className="eyebrow">⚽ Calculadora de TV para a Copa</div>
            <h1 className="brand-title">TV do <span>Hexa</span></h1>
            <p className="subtitle">Responda algumas perguntas e descubra TVs que combinam com seu ambiente, seu uso e seu orçamento.</p>
            {loading && <p className="status">Carregando catálogo de TVs...</p>}
            {error && <p className="status error">Não consegui carregar a planilha de TVs.</p>}
            <p className="version">{APP_VERSION}</p>
          </header>

          <div className="progress-wrap"><div className="progress" style={{ width: progress + "%" }} /></div>

          <AnimatePresence mode="wait">
            {step < questions.length ? (
              <motion.section
                key={step}
                initial={{ opacity: 0, y: 20, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -18, scale: 0.99 }}
                transition={{ duration: 0.24 }}
                className="glass-card question-card"
              >
                <div className="question-header">
                  <div className="question-icon">{currentQuestion.icon}</div>
                  <h2 className="question-title">{currentQuestion.title}</h2>
                  {currentQuestion.subtitle && <p className="question-subtitle">{currentQuestion.subtitle}</p>}
                </div>

                <div className="options-grid">
                  {currentQuestion.options.map((option) => (
                    <button key={option.value} onClick={() => handleAnswer(option)} className="option-card">
                      <span className="option-icon">{option.icon}</span>
                      <span className="option-label">{option.label}</span>
                    </button>
                  ))}
                </div>
              </motion.section>
            ) : (
              <motion.section key="result" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
                <div className="glass-card result-hero">
                  <div className="result-icon">{getProfileIcon()}</div>
                  <h2 className="profile-title">{getProfile()}</h2>
                  <p className="result-copy">Com base nas suas respostas, essas são as TVs mais indicadas para você.</p>
                </div>

                <div style={{ height: 20 }} />

                {rankedTVs[0]?.fallbackMode && (
                  <>
                    <div className="warning">⚠️ Não encontramos TVs no tamanho ideal para esse orçamento. Mostramos as melhores opções disponíveis dentro da sua faixa de preço.</div>
                    <div style={{ height: 20 }} />
                  </>
                )}

                {rankedTVs.length === 0 ? (
                  <div className="glass-card empty-card">
                    <h3 className="section-title">Nenhuma TV encontrada</h3>
                    <p className="subtitle">Tente aumentar a faixa de preço ou adicionar mais links na planilha.</p>
                  </div>
                ) : (
                  <>
                    <div className="results-grid">
                      {getRecommendations().map((item) => {
                        const tv = item.tv;
                        const display = getDisplayName(tv);
                        const imageUrl = getImageUrl(tv);

                        return (
                          <article key={item.title + "-" + tv.Modelo} className="glass-card tv-card">
                            <div className="card-top">
                              <h3 className="card-title">{item.icon} {item.title}</h3>
                              <span className="mini-badge">{item.badge}</span>
                            </div>

                            <div className="image-box">
                              {imageUrl ? <img src={imageUrl} alt={tv.Modelo} loading="lazy" /> : "📺"}
                            </div>

                            <span className="compat-pill">✨ {getCompatibility(tv)}% compatível</span>
                            <p className="brand">{display.brand}</p>
                            <p className="model">{display.model}</p>
                            <p className="size">{display.size} polegadas</p>
                            <p className="meta">{tv.Tecnologia} • {tv.Sistema} • {tv.Hz}Hz</p>
                            <p className="price-label">Preço médio estimado</p>
                            <p className="price">R$ {formatMoney(tv["Preço Médio"])}</p>
                            <p className="price-note">Valores podem variar conforme promoção, estoque e loja.</p>
                            <p className="desc">{item.description}</p>
                            <a href={getBestLink(tv)} target="_blank" rel="noreferrer" className="primary-btn">🔥 Ver oferta</a>
                          </article>
                        );
                      })}
                    </div>

                    <div style={{ height: 20 }} />

                    <div className="glass-card extra-card">
                      <h3 className="section-title">Outras TVs que também combinam com você</h3>
                      <div className="extra-list">
                        {rankedTVs.slice(3, 9).map((tv) => {
                          const display = getDisplayName(tv);

                          return (
                            <a key={"extra-" + tv.Modelo} href={getBestLink(tv)} target="_blank" rel="noreferrer" className="extra-item">
                              <div>
                                <p className="extra-name">{display.brand} {display.model}</p>
                                <p className="extra-meta">{display.size} polegadas • {tv.Tecnologia} • preço médio R$ {formatMoney(tv["Preço Médio"])}</p>
                              </div>
                              <div className="extra-percent"><strong>{getCompatibility(tv)}%</strong><span>compatível</span></div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                <div style={{ height: 20 }} />

                <div className="glass-card cta-card">
                  <h3 className="section-title">Quer receber alertas de promoção?</h3>
                  <p className="subtitle">Entre nos canais do TV do Hexa e veja ofertas atualizadas.</p>

                  <div className="cta-buttons">
                    <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="primary-btn">WhatsApp</a>
                    <a href={TELEGRAM_LINK} target="_blank" rel="noreferrer" className="primary-btn telegram-btn">Telegram</a>
                    <button
                      onClick={() => {
                        const text = "Minha TV ideal no TV do Hexa foi: " + (rankedTVs[0]?.Modelo || "uma TV incrível") + "! Faça o teste também.";
                        navigator.clipboard.writeText(text);
                        alert("Resultado copiado para compartilhar!");
                      }}
                      className="primary-btn gold-btn"
                    >
                      Compartilhar resultado
                    </button>
                  </div>

                  <button onClick={resetQuiz} className="reset-btn">Refazer quiz</button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
