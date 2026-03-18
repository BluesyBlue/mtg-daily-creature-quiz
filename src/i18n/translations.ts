export type SupportedLang = 'en' | 'es' | 'fr' | 'de' | 'it';

export interface Translations {
  // App states
  loadingText: string;
  errorTitle: string;
  tryAgain: string;
  // Header
  gameTitle: string;
  // Game view – progress bar
  cardProgress: string;
  totalScore: string;
  card: string;
  // Ko-fi
  buySupport: string;
  // Game-complete: Quest Complete box
  questComplete: string;
  finalScore: string;
  comeTomorrow: string;
  tryAgainBtn: string;
  showArt: string;
  results: string;
  // Game-complete: Summary section
  recordOfKnowledge: string;
  points: string;
  yourGuesses: string;
  noGuesses: string;
  correctAnswer: string;
  // GuessInput
  guessTitle: string;
  guessHint: string;
  typeLabel: string;
  required: string;
  optional: string;
  scoredPoints: string;
  takeAGuess: string;
  nextCard: string;
  showResults: string;
  fillFirstType: string;
  // Language selector confirmation
  switchLanguage: string;
  switchLanguageConfirm: string;
  yesSwitch: string;
  cancel: string;
}

const translations: Record<SupportedLang, Translations> = {
  en: {
    loadingText: 'Rounding up the creatures...',
    errorTitle: 'Error Loading Cards',
    tryAgain: 'Try Again',
    gameTitle: 'Daily Creature Quiz',
    cardProgress: 'Card Progress',
    totalScore: 'Total Score',
    card: 'Card',
    buySupport: 'Buy Me a Support Booster',
    questComplete: 'Quest Complete!',
    finalScore: 'Final Score',
    comeTomorrow: 'Come back tomorrow to guess a new set of 10 creatures.',
    tryAgainBtn: 'Try again!',
    showArt: 'No, show me the cool art!',
    results: 'Results',
    recordOfKnowledge: 'Record of Your Knowledge',
    points: 'Points',
    yourGuesses: 'Your Guesses',
    noGuesses: 'No guesses',
    correctAnswer: 'Correct Answer',
    guessTitle: 'Guess the Creature Type(s)',
    guessHint: 'Enter at least 1 creature type. Typically a creature has 1–3 types.',
    typeLabel: 'Type',
    required: 'Required',
    optional: 'Optional',
    scoredPoints: 'Scored points',
    takeAGuess: 'Take a Guess',
    nextCard: 'Next Card',
    showResults: 'Show Results',
    fillFirstType: 'Please fill in at least the first creature type!',
    switchLanguage: 'Switch Language?',
    switchLanguageConfirm: 'Switching language will reset your current progress. Are you sure?',
    yesSwitch: 'Yes, switch',
    cancel: 'Cancel',
  },
  es: {
    loadingText: 'Reuniendo las criaturas...',
    errorTitle: 'Error al Cargar las Cartas',
    tryAgain: 'Intentar de Nuevo',
    gameTitle: 'Quiz Diario de Criaturas',
    cardProgress: 'Progreso de Cartas',
    totalScore: 'Puntuación Total',
    card: 'Carta',
    buySupport: 'Cómprame un Refuerzo de Apoyo',
    questComplete: '¡Misión Cumplida!',
    finalScore: 'Puntuación Final',
    comeTomorrow: 'Vuelve mañana para adivinar un nuevo conjunto de 10 criaturas.',
    tryAgainBtn: '¡Intentar de nuevo!',
    showArt: '¡No, muéstrame el arte!',
    results: 'Resultados',
    recordOfKnowledge: 'Registro de tu Conocimiento',
    points: 'Puntos',
    yourGuesses: 'Tus Respuestas',
    noGuesses: 'Sin respuestas',
    correctAnswer: 'Respuesta Correcta',
    guessTitle: 'Adivina el Tipo de Criatura',
    guessHint: 'Ingresa al menos 1 tipo de criatura. Normalmente tiene 1–3 tipos.',
    typeLabel: 'Tipo',
    required: 'Obligatorio',
    optional: 'Opcional',
    scoredPoints: 'Puntos obtenidos',
    takeAGuess: 'Adivinar',
    nextCard: 'Siguiente Carta',
    showResults: 'Ver Resultados',
    fillFirstType: '¡Por favor, rellena al menos el primer tipo de criatura!',
    switchLanguage: '¿Cambiar Idioma?',
    switchLanguageConfirm: 'Cambiar de idioma reiniciará tu progreso actual. ¿Estás seguro?',
    yesSwitch: 'Sí, cambiar',
    cancel: 'Cancelar',
  },
  fr: {
    loadingText: 'Rassemblement des créatures...',
    errorTitle: 'Erreur de Chargement des Cartes',
    tryAgain: 'Réessayer',
    gameTitle: 'Quiz Quotidien des Créatures',
    cardProgress: 'Progression des Cartes',
    totalScore: 'Score Total',
    card: 'Carte',
    buySupport: 'Offrez-moi un Booster de Soutien',
    questComplete: 'Quête Accomplie !',
    finalScore: 'Score Final',
    comeTomorrow: 'Revenez demain pour deviner un nouveau lot de 10 créatures.',
    tryAgainBtn: 'Rejouer !',
    showArt: "Non, montrez-moi l'art !",
    results: 'Résultats',
    recordOfKnowledge: 'Registre de vos Connaissances',
    points: 'Points',
    yourGuesses: 'Vos Réponses',
    noGuesses: 'Aucune réponse',
    correctAnswer: 'Bonne Réponse',
    guessTitle: 'Devinez le Type de Créature',
    guessHint: 'Entrez au moins 1 type de créature. Généralement 1 à 3 types.',
    typeLabel: 'Type',
    required: 'Requis',
    optional: 'Optionnel',
    scoredPoints: 'Points marqués',
    takeAGuess: 'Deviner',
    nextCard: 'Carte Suivante',
    showResults: 'Voir les Résultats',
    fillFirstType: 'Veuillez remplir au moins le premier type de créature !',
    switchLanguage: 'Changer de Langue ?',
    switchLanguageConfirm: 'Changer de langue réinitialisera votre progression actuelle. Êtes-vous sûr ?',
    yesSwitch: 'Oui, changer',
    cancel: 'Annuler',
  },
  de: {
    loadingText: 'Kreaturen werden zusammengerufen...',
    errorTitle: 'Fehler beim Laden der Karten',
    tryAgain: 'Erneut versuchen',
    gameTitle: 'Tägliches Kreatur-Quiz',
    cardProgress: 'Kartenfortschritt',
    totalScore: 'Gesamtpunktzahl',
    card: 'Karte',
    buySupport: 'Kauf mir einen Support-Booster',
    questComplete: 'Abenteuer abgeschlossen!',
    finalScore: 'Endpunktzahl',
    comeTomorrow: 'Komm morgen wieder, um 10 neue Kreaturen zu erraten.',
    tryAgainBtn: 'Nochmal versuchen!',
    showArt: 'Nein, zeig mir die Kunst!',
    results: 'Ergebnisse',
    recordOfKnowledge: 'Aufzeichnung deines Wissens',
    points: 'Punkte',
    yourGuesses: 'Deine Antworten',
    noGuesses: 'Keine Antworten',
    correctAnswer: 'Richtige Antwort',
    guessTitle: 'Errate den Kreaturtyp',
    guessHint: 'Gib mindestens 1 Kreaturtyp ein. Normalerweise 1–3 Typen.',
    typeLabel: 'Typ',
    required: 'Pflichtfeld',
    optional: 'Optional',
    scoredPoints: 'Erzielte Punkte',
    takeAGuess: 'Raten',
    nextCard: 'Nächste Karte',
    showResults: 'Ergebnisse anzeigen',
    fillFirstType: 'Bitte gib mindestens den ersten Kreaturtyp ein!',
    switchLanguage: 'Sprache wechseln?',
    switchLanguageConfirm: 'Das Wechseln der Sprache setzt deinen aktuellen Fortschritt zurück. Bist du sicher?',
    yesSwitch: 'Ja, wechseln',
    cancel: 'Abbrechen',
  },
  it: {
    loadingText: 'Raccogliendo le creature...',
    errorTitle: 'Errore nel Caricamento delle Carte',
    tryAgain: 'Riprova',
    gameTitle: 'Quiz Giornaliero delle Creature',
    cardProgress: 'Progressi delle Carte',
    totalScore: 'Punteggio Totale',
    card: 'Carta',
    buySupport: 'Offrimi un Booster di Supporto',
    questComplete: 'Missione Completata!',
    finalScore: 'Punteggio Finale',
    comeTomorrow: 'Torna domani per indovinare un nuovo set di 10 creature.',
    tryAgainBtn: 'Riprova!',
    showArt: "No, mostrami l'arte!",
    results: 'Risultati',
    recordOfKnowledge: 'Registro delle tue Conoscenze',
    points: 'Punti',
    yourGuesses: 'Le tue Risposte',
    noGuesses: 'Nessuna risposta',
    correctAnswer: 'Risposta Corretta',
    guessTitle: 'Indovina il Tipo di Creatura',
    guessHint: 'Inserisci almeno 1 tipo di creatura. Solitamente 1–3 tipi.',
    typeLabel: 'Tipo',
    required: 'Obbligatorio',
    optional: 'Opzionale',
    scoredPoints: 'Punti ottenuti',
    takeAGuess: 'Indovina',
    nextCard: 'Carta Successiva',
    showResults: 'Mostra Risultati',
    fillFirstType: 'Per favore, inserisci almeno il primo tipo di creatura!',
    switchLanguage: 'Cambiare Lingua?',
    switchLanguageConfirm: 'Cambiare lingua azzererà il tuo progresso attuale. Sei sicuro?',
    yesSwitch: 'Sì, cambia',
    cancel: 'Annulla',
  },
};

export default translations;

// Hardcoded estimates of creature cards available per language on Scryfall
export const LANG_CARD_COUNTS: Record<SupportedLang, number> = {
  en: 25000,
  es: 13000,
  fr: 13000,
  de: 13000,
  it: 9000,
};

export const LANG_LABELS: Record<SupportedLang, { flagCode: string; native: string }> = {
  en: { flagCode: 'gb', native: 'English' },
  es: { flagCode: 'es', native: 'Español' },
  fr: { flagCode: 'fr', native: 'Français' },
  de: { flagCode: 'de', native: 'Deutsch' },
  it: { flagCode: 'it', native: 'Italiano' },
};
