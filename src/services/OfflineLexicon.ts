// Bilingual & Trilingual Lexicon extracted directly from Trill Translate's OfflineNeuralLexicon

export interface LexiconEntry {
  en: string;
  es: string;
  hi: string;
}

export const PHRASE_BOOK: LexiconEntry[] = [
  // 1. GREETINGS & CIVILITY
  { en: "hello", es: "hola", hi: "नमस्ते" },
  { en: "hi", es: "hola", hi: "नमस्ते" },
  { en: "greetings", es: "saludos", hi: "नमस्कार" },
  { en: "good morning", es: "buenos días", hi: "शुभ प्रभात" },
  { en: "good afternoon", es: "buenas tardes", hi: "शुभ दोपहर" },
  { en: "good evening", es: "buenas noches", hi: "शुभ संध्या" },
  { en: "good night", es: "buenas noches", hi: "शुभ रात्रि" },
  { en: "how are you", es: "¿cómo estás?", hi: "आप कैसे हैं?" },
  { en: "how are you doing", es: "¿cómo te va?", hi: "आप कैसे हैं?" },
  { en: "hello how are you", es: "hola, ¿cómo estás?", hi: "नमस्ते, आप कैसे हैं?" },
  { en: "i am fine", es: "estoy bien", hi: "मैं ठीक हूँ" },
  { en: "i am doing well", es: "estoy muy bien", hi: "मैं बहुत अच्छा हूँ" },
  { en: "i am good", es: "estoy bien", hi: "मैं अच्छा हूँ" },
  { en: "thank you", es: "gracias", hi: "धन्यवाद" },
  { en: "thank you very much", es: "muchas gracias", hi: "बहुत-बहुत धन्यवाद" },
  { en: "thanks a lot", es: "muchas gracias", hi: "बहुत धन्यवाद" },
  { en: "you are welcome", es: "de nada", hi: "आपका स्वागत है" },
  { en: "no problem", es: "no hay problema", hi: "कोई बात नहीं" },
  { en: "please", es: "por favor", hi: "कृपया" },
  { en: "excuse me", es: "disculpe", hi: "माफ़ कीजिये" },
  { en: "sorry", es: "lo siento", hi: "मुझे माफ़ करें" },
  { en: "pardon me", es: "perdón", hi: "क्षमा करें" },
  { en: "yes", es: "sí", hi: "हाँ" },
  { en: "no", es: "no", hi: "नहीं" },
  { en: "ok", es: "está bien", hi: "ठीक है" },
  { en: "okay", es: "de acuerdo", hi: "ठीक है" },
  { en: "goodbye", es: "adiós", hi: "अलविदा" },
  { en: "bye", es: "adiós", hi: "फिर मिलेंगे" },
  { en: "see you later", es: "hasta luego", hi: "बाद में मिलते हैं" },
  { en: "see you soon", es: "hasta pronto", hi: "जल्द मिलते हैं" },
  { en: "see you tomorrow", es: "hasta mañana", hi: "कल मिलते हैं" },
  { en: "have a good day", es: "que tenga un buen día", hi: "आपका दिन शुभ हो" },
  { en: "nice to meet you", es: "mucho gusto", hi: "आपसे मिलकर बहुत खुशी हुई" },
  { en: "welcome", es: "bienvenido", hi: "स्वागत है" },
  { en: "take care", es: "cuídate", hi: "अपना ख़्याल रखना" },
  { en: "congratulations", es: "felicidades", hi: "बधाई हो" },
  { en: "happy birthday", es: "feliz cumpleaños", hi: "जन्मदिन मुबारक हो" },
  { en: "good luck", es: "buena suerte", hi: "शुभकामनाएं" },

  // 1B. GRATITUDE & THANK YOU
  { en: "thank you so much", es: "muchísimas gracias", hi: "लाख-लाख धन्यवाद" },
  { en: "thanks a million", es: "un millón de gracias", hi: "अनेक धन्यवाद" },
  { en: "many thanks", es: "muchas gracias", hi: "बहुत धन्यवाद" },
  { en: "i appreciate it", es: "te lo agradezco", hi: "मैं इसकी सराहना करता हूँ" },
  { en: "i really appreciate your help", es: "agradezco mucho tu ayuda", hi: "आपकी मदद के लिए दिल से शुक्रिया" },
  { en: "grateful for your support", es: "agradecido por tu apoyo", hi: "आपके सहयोग के लिए आभारी हूँ" },
  { en: "you are a lifesaver", es: "me salvaste la vida", hi: "आपने मुझे बचा लिया" },
  { en: "i owe you one", es: "te debo una", hi: "मुझ पर आपका एहसान रहा" },
  { en: "my pleasure", es: "es un placer", hi: "यह तो मेरा सौभाग्य है" },
  { en: "don't mention it", es: "ni lo menciones", hi: "कोई बात नहीं" },
  { en: "cheers", es: "salud", hi: "शुक्रिया / जय हो" },
  { en: "heartfelt thanks", es: "agradecimiento sincero", hi: "दिल से धन्यवाद" },

  // 1C. COLLOQUIAL BANTER & STREET COMEBACKS
  { en: "shut up", es: "cállate", hi: "चुप रहो" },
  { en: "shut your mouth", es: "cierra la boca", hi: "अपना मुँह बंद रखो" },
  { en: "stop talking nonsense", es: "deja de decir tonterías", hi: "बकवास बंद करो" },
  { en: "don't talk nonsense", es: "no digas tonterías", hi: "बकवास मत करो" },
  { en: "what nonsense", es: "qué tontería", hi: "क्या बकवास है" },
  { en: "nonsense", es: "tonterías", hi: "बकवास" },
  { en: "rubbish", es: "basura", hi: "कचरा / फ़िज़ूल" },
  { en: "get lost", es: "lárgate", hi: "दफ़ा हो जाओ" },
  { en: "go away", es: "vete", hi: "दूर चले जाओ" },
  { en: "leave me alone", es: "déjame en paz", hi: "मुझे अकेला छोड़ दो" },
  { en: "stop bothering me", es: "deja de molestarme", hi: "मुझे परेशान करना बंद करो" },
  { en: "don't disturb me", es: "no me molestes", hi: "मुझे तंग मत करो" },
  { en: "mind your own business", es: "métete en tus asuntos", hi: "अपने काम से काम रखो" },
  { en: "none of your business", es: "no es asunto tuyo", hi: "यह तुम्हारा काम नहीं है" },
  { en: "who asked you", es: "¿quién te preguntó?", hi: "तुमसे किसने पूछा?" },
  { en: "are you crazy", es: "¿estás loco?", hi: "क्या तुम पागल हो?" },
  { en: "are you insane", es: "¿te volviste loco?", hi: "क्या दिमाग खराब है?" },
  { en: "are you out of your mind", es: "¿estás mal de la cabeza?", hi: "दिमाग ठिकाने पर है क्या?" },
  { en: "idiot", es: "idiota", hi: "मूर्ख / बेवकूफ़" },
  { en: "fool", es: "tonto", hi: "उल्लू / मूर्ख" },
  { en: "you fool", es: "tonto de remate", hi: "अरे मूर्ख" },
  { en: "stupid", es: "estúpido", hi: "बेवकूफ़" },
  { en: "dumb", es: "tonto", hi: "बुद्धू" },
  { en: "lazy", es: "perezoso", hi: "आलसी" },
  { en: "lazy bones", es: "holgazán", hi: "कामचोर" },
  { en: "useless", es: "inútil", hi: "निकम्मा" },
  { en: "you are useless", es: "no sirves para nada", hi: "तुम किसी काम के नहीं हो" },
  { en: "clown", es: "payaso", hi: "जोकर" },
  { en: "liar", es: "mentiroso", hi: "झूठा" },
  { en: "drama queen", es: "dramático", hi: "नौटंकीबाज़" },
  { en: "show off", es: "presumido", hi: "दिखावा करने वाला" },
  { en: "greedy", es: "codicioso", hi: "लालची" },
  { en: "coward", es: "cobarde", hi: "डरपोक" },
  { en: "don't act smart", es: "no te hagas el listo", hi: "ज़्यादा होशियार मत बनो" },
  { en: "smart aleck", es: "sabelotodo", hi: "डेढ़ शाणा" },
  { en: "arrogant", es: "arrogante", hi: "घमंडी" },
  { en: "stubborn", es: "terco", hi: "ज़िद्दी" },
  { en: "shameless", es: "desvergonzado", hi: "बेशर्म" },
  { en: "cheater", es: "tramposo", hi: "धोखेबाज़" },
  { en: "hypocrite", es: "hipócrita", hi: "पाखंडी" },
  { en: "stop crying", es: "deja de llorar", hi: "रोना बंद करो" },
  { en: "whatever", es: "lo que sea", hi: "जो भी हो" },
  { en: "who cares", es: "¿a quién le importa?", hi: "किसे परवाह है" },
  { en: "i do not care", es: "no me importa", hi: "मुझे कोई फर्क नहीं पड़ता" },
  { en: "i don't care", es: "no me importa", hi: "मुझे कोई फर्क नहीं पड़ता" },
  { en: "big deal", es: "gran cosa", hi: "कोई बड़ी बात नहीं" },
  { en: "annoying", es: "molesto", hi: "परेशान करने वाला" },
  { en: "you are so annoying", es: "eres tan molesto", hi: "तुम बहुत परेशान करते हो" },
  { en: "loser", es: "perdedor", hi: "हारा हुआ इंसान" },
  { en: "hopeless", es: "sin esperanza", hi: "नाउम्मीद" },

  // 2. IDENTITY, INTRODUCTIONS & CONVERSATION
  { en: "what is your name", es: "¿cómo te llamas?", hi: "आपका नाम क्या है?" },
  { en: "my name is", es: "mi nombre es", hi: "मेरा नाम है" },
  { en: "who are you", es: "¿quién eres?", hi: "आप कौन हैं?" },
  { en: "where are you from", es: "¿de dónde eres?", hi: "आप कहाँ से हैं?" },
  { en: "i am from india", es: "soy de la india", hi: "मैं भारत से हूँ" },
  { en: "i am from america", es: "soy de estados unidos", hi: "मैं अमेरिका से हूँ" },
  { en: "do you speak english", es: "¿habla usted inglés?", hi: "क्या आप अंग्रेज़ी बोलते हैं?" },
  { en: "do you speak hindi", es: "¿habla usted hindi?", hi: "क्या आप हिन्दी बोलते हैं?" },
  { en: "do you speak spanish", es: "¿habla usted español?", hi: "क्या आप स्पैनिश बोलते हैं?" },
  { en: "i speak english", es: "hablo inglés", hi: "मैं अंग्रेज़ी बोलता हूँ" },
  { en: "i speak a little hindi", es: "hablo un poco de hindi", hi: "मैं थोड़ी हिन्दी बोलता हूँ" },
  { en: "i do not speak hindi", es: "no hablo hindi", hi: "मैं हिन्दी नहीं बोलता" },
  { en: "i do not speak spanish", es: "no hablo español", hi: "मैं स्पैनिश नहीं बोलता" },
  { en: "i do not understand", es: "no entiendo", hi: "मुझे समझ नहीं आया" },
  { en: "i understand", es: "entiendo", hi: "मैं समझ गया" },
  { en: "do you understand", es: "¿entiendes?", hi: "क्या आप समझ रहे हैं?" },
  { en: "speak slowly please", es: "hable más despacio, por favor", hi: "कृपया धीरे बोलें" },
  { en: "can you repeat that", es: "¿puede repetir eso?", hi: "क्या आप इसे दोहरा सकते हैं?" },
  { en: "what did you say", es: "¿qué dijiste?", hi: "आपने क्या कहा?" },
  { en: "what does this mean", es: "¿qué significa esto?", hi: "इसका क्या मतलब है?" },

  // 3. TRAVEL, DIRECTIONS & NAVIGATION
  { en: "where is the airport", es: "¿dónde está el aeropuerto?", hi: "हवाई अड्डा कहाँ है?" },
  { en: "where is the train station", es: "¿dónde está la estación de tren?", hi: "रेलवे स्टेशन कहाँ है?" },
  { en: "where is the metro station", es: "¿dónde está la estación de metro?", hi: "मेट्रो स्टेशन कहाँ है?" },
  { en: "where is the bus stop", es: "¿dónde está la parada de autobús?", hi: "बस स्टॉप कहाँ है?" },
  { en: "where is the hotel", es: "¿dónde está el hotel?", hi: "होटल कहाँ है?" },
  { en: "where is the bathroom", es: "¿dónde está el baño?", hi: "शौचालय कहाँ है?" },
  { en: "where is the restroom", es: "¿dónde está el servicio?", hi: "शौचालय कहाँ है?" },
  { en: "where is the exit", es: "¿dónde está la salida?", hi: "निकास द्वार कहाँ है?" },
  { en: "where is the entrance", es: "¿dónde está la entrada?", hi: "प्रवेश द्वार कहाँ है?" },
  { en: "turn right", es: "gire a la derecha", hi: "दायें मुड़ें" },
  { en: "turn left", es: "gire a la izquierda", hi: "बायें मुड़ें" },
  { en: "go straight", es: "siga todo recto", hi: "सीधे जाइये" },
  { en: "straight ahead", es: "todo recto", hi: "सीधे आगे" },
  { en: "stop here", es: "pare aquí", hi: "यहाँ रोकिये" },
  { en: "stop the car", es: "pare el coche", hi: "गाड़ी रोकिये" },
  { en: "call a taxi", es: "llame a un taxi", hi: "टैक्सी बुलाओ" },
  { en: "i want to go to", es: "quiero ir a", hi: "मैं जाना चाहता हूँ" },
  { en: "how far is it", es: "¿a qué distancia está?", hi: "यह कितनी दूर है?" },
  { en: "is it far", es: "¿está lejos?", hi: "क्या यह दूर है?" },
  { en: "it is near here", es: "está cerca de aquí", hi: "यह यहाँ के पास है" },
  { en: "i am lost", es: "estoy perdido", hi: "मैं रास्ता भटक गया हूँ" },
  { en: "i have a reservation", es: "tengo una reserva", hi: "मेरी बुकिंग है" },
  { en: "one ticket please", es: "un billete, por favor", hi: "एक टिकट दीजिये, कृपया" },
  { en: "two tickets please", es: "dos billetes, por favor", hi: "दो टिकट दीजिये, कृपया" },

  // 4. FOOD, DINING & STREET FOOD
  { en: "i am hungry", es: "tengo hambre", hi: "मुझे भूख लगी है" },
  { en: "i am thirsty", es: "tengo sed", hi: "मुझे प्यास लगी है" },
  { en: "drinking water please", es: "agua potable, por favor", hi: "पीने का पानी दीजिये, कृपया" },
  { en: "cold water", es: "agua fría", hi: "ठंडा पानी" },
  { en: "hot water", es: "agua caliente", hi: "गरम पानी" },
  { en: "one cup of tea please", es: "una taza de té, por favor", hi: "एक कप चाय दीजिये, कृपया" },
  { en: "one cup of coffee", es: "un café", hi: "एक कप कॉफ़ी" },
  { en: "delicious food", es: "comida deliciosa", hi: "बहुत स्वादिष्ट खाना" },
  { en: "is this food spicy", es: "¿es picante esta comida?", hi: "क्या यह खाना तीखा है?" },
  { en: "not too spicy please", es: "no muy picante, por favor", hi: "ज़्यादा तीखा मत बनाइये, कृपया" },
  { en: "less spicy", es: "menos picante", hi: "कम मिर्च" },
  { en: "do you have vegetarian food", es: "¿tiene comida vegetariana?", hi: "क्या आपके पास शाकाहारी भोजन है?" },
  { en: "i am vegetarian", es: "soy vegetariano", hi: "मैं शाकाहारी हूँ" },
  { en: "the bill please", es: "la cuenta, por favor", hi: "बिल दीजिये, कृपया" },
  { en: "how much is the bill", es: "¿cuánto es la cuenta?", hi: "कितना बिल हुआ?" },

  // 5. SHOPPING, MONEY & PAYMENTS
  { en: "how much does this cost", es: "¿cuánto cuesta esto?", hi: "इसकी कीमत क्या है?" },
  { en: "how much is it", es: "¿cuánto es?", hi: "यह कितने का है?" },
  { en: "this is very expensive", es: "esto es muy caro", hi: "यह बहुत महंगा है" },
  { en: "can you give a discount", es: "¿puede hacer un descuento?", hi: "क्या थोड़ा कम कर सकते हैं?" },
  { en: "lower the price a little", es: "baje un poco el precio", hi: "थोड़ा दाम कम कीजिये" },
  { en: "do you accept card", es: "¿acepta tarjeta?", hi: "क्या कार्ड लेते हैं?" },
  { en: "do you accept upi", es: "¿acepta upi?", hi: "क्या आप UPI लेते हैं?" },
  { en: "cash only", es: "sólo efectivo", hi: "केवल नकद" },
  { en: "i will pay in cash", es: "pagaré en efectivo", hi: "मैं नकद भुगतान करूँगा" },
  { en: "i want to buy this", es: "quiero comprar esto", hi: "मैं इसे खरीदना चाहता हूँ" },

  // 6. MEDICAL, HEALTH & EMERGENCY
  { en: "i need help", es: "necesito ayuda", hi: "मुझे मदद चाहिए" },
  { en: "please help me", es: "por favor, ayúdeme", hi: "कृपया मेरी मदद कीजिये" },
  { en: "call an ambulance", es: "llame a una ambulancia", hi: "एम्बुलेंस को बुलाओ" },
  { en: "call the police", es: "llame a la policía", hi: "पुलिस को बुलाओ" },
  { en: "call a doctor", es: "llame a un médico", hi: "डॉक्टर को बुलाओ" },
  { en: "where is the hospital", es: "¿dónde está el hospital?", hi: "अस्पताल कहाँ है?" },
  { en: "where is the pharmacy", es: "¿dónde está la farmacia?", hi: "दवा की दुकान कहाँ है?" },
  { en: "i am sick", es: "estoy enfermo", hi: "मैं बीमार हूँ" },
  { en: "i have a fever", es: "tengo fiebre", hi: "मुझे बुखार है" },
  { en: "i have a headache", es: "me duele la cabeza", hi: "मेरे सिर में दर्द है" },
  { en: "it hurts here", es: "me duele aquí", hi: "यहाँ दर्द हो रहा है" },
  { en: "emergency", es: "emergencia", hi: "आपातकाल" },
  { en: "danger", es: "peligro", hi: "खतरा" },
  { en: "do not enter", es: "no pasar", hi: "प्रवेश निषेध" },
  { en: "be careful", es: "tenga cuidado", hi: "सावधान रहें" },

  // 7. TIME & WEATHER
  { en: "what time is it", es: "¿qué hora es?", hi: "कितने बजे हैं?" },
  { en: "it is one o clock", es: "es la una", hi: "एक बजा है" },
  { en: "it is two o clock", es: "son las dos", hi: "दो बजे हैं" },
  { en: "today is hot", es: "hoy hace calor", hi: "आज बहुत गर्मी है" },
  { en: "today is cold", es: "hoy hace frío", hi: "आज बहुत ठंड है" },
  { en: "it is raining", es: "está lloviendo", hi: "बारिश हो रही है" },
  { en: "wait a moment", es: "espere un momento", hi: "एक पल रुकिये" },
  { en: "hurry up", es: "date prisa", hi: "जल्दी करो" },
  { en: "let us go", es: "vamos", hi: "चलो चलें" },
  { en: "i am ready", es: "estoy listo", hi: "मैं तैयार हूँ" },
];

export const WORD_LEXICON: LexiconEntry[] = [
  { en: "i", es: "yo", hi: "मैं" },
  { en: "you", es: "tú", hi: "आप" },
  { en: "he", es: "él", hi: "वह" },
  { en: "she", es: "ella", hi: "वह" },
  { en: "we", es: "nosotros", hi: "हम" },
  { en: "they", es: "ellos", hi: "वे" },
  { en: "this", es: "esto", hi: "यह" },
  { en: "that", es: "eso", hi: "वह" },
  { en: "what", es: "qué", hi: "क्या" },
  { en: "where", es: "dónde", hi: "कहाँ" },
  { en: "when", es: "cuándo", hi: "कब" },
  { en: "why", es: "por qué", hi: "क्यों" },
  { en: "who", es: "quién", hi: "कौन" },
  { en: "how", es: "cómo", hi: "कैसे" },
  { en: "is", es: "es", hi: "है" },
  { en: "are", es: "son", hi: "हैं" },
  { en: "am", es: "soy", hi: "हूँ" },
  { en: "have", es: "tengo", hi: "पास है" },
  { en: "want", es: "quiero", hi: "चाहता हूँ" },
  { en: "need", es: "necesito", hi: "ज़रूरत है" },
  { en: "go", es: "voy", hi: "जाना" },
  { en: "come", es: "venir", hi: "आना" },
  { en: "water", es: "agua", hi: "पानी" },
  { en: "food", es: "comida", hi: "खाना" },
  { en: "tea", es: "té", hi: "चाय" },
  { en: "coffee", es: "café", hi: "कॉफ़ी" },
  { en: "bread", es: "pan", hi: "रोटी" },
  { en: "money", es: "dinero", hi: "पैसा" },
  { en: "car", es: "coche", hi: "गाड़ी" },
  { en: "bus", es: "autobús", hi: "बस" },
  { en: "train", es: "tren", hi: "ट्रेन" },
  { en: "hotel", es: "hotel", hi: "होटल" },
  { en: "room", es: "habitación", hi: "कमरा" },
  { en: "doctor", es: "médico", hi: "डॉक्टर" },
  { en: "hospital", es: "hospital", hi: "अस्पताल" },
  { en: "pharmacy", es: "farmacia", hi: "दवाखाना" },
  { en: "good", es: "bueno", hi: "अच्छा" },
  { en: "bad", es: "malo", hi: "बुरा" },
  { en: "big", es: "grande", hi: "बड़ा" },
  { en: "small", es: "pequeño", hi: "छोटा" },
  { en: "hot", es: "caliente", hi: "गरम" },
  { en: "cold", es: "frío", hi: "ठंडा" },
  { en: "fast", es: "rápido", hi: "तेज़" },
  { en: "slow", es: "lento", hi: "धीमा" },
  { en: "friend", es: "amigo", hi: "दोस्त" },
  { en: "family", es: "familia", hi: "परिवार" },
  { en: "time", es: "tiempo", hi: "समय" },
  { en: "day", es: "día", hi: "दिन" },
  { en: "night", es: "noche", hi: "रात" },
  { en: "today", es: "hoy", hi: "आज" },
  { en: "tomorrow", es: "mañana", hi: "कल" },
  { en: "yesterday", es: "ayer", hi: "कल" },
];

function cleanKey(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[.,?!¿¡:;"'()\-_]/g, "")
    .replace(/\s+/g, " ");
}

function formatCapitalization(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("¿") || trimmed.startsWith("¡")) {
    return trimmed.charAt(0) + trimmed.charAt(1).toUpperCase() + trimmed.slice(2);
  }
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function translateOffline(
  text: string,
  sourceLang: string,
  targetLang: string
): string {
  const trimmed = text.trim();
  if (!trimmed || sourceLang === targetLang) return trimmed;

  const normalizedInput = cleanKey(trimmed);

  // 1. Direct Phrase Match
  for (const entry of PHRASE_BOOK) {
    let src = "";
    let tgt = "";
    if (sourceLang === "en" && targetLang === "hi") { src = entry.en; tgt = entry.hi; }
    else if (sourceLang === "hi" && targetLang === "en") { src = entry.hi; tgt = entry.en; }
    else if (sourceLang === "en" && targetLang === "es") { src = entry.en; tgt = entry.es; }
    else if (sourceLang === "es" && targetLang === "en") { src = entry.es; tgt = entry.en; }
    else if (sourceLang === "es" && targetLang === "hi") { src = entry.es; tgt = entry.hi; }
    else if (sourceLang === "hi" && targetLang === "es") { src = entry.hi; tgt = entry.es; }

    if (src && cleanKey(src) === normalizedInput) {
      return formatCapitalization(tgt);
    }
  }

  // 2. Sub-phrase N-gram Replacement
  let workingText = trimmed;
  for (const entry of PHRASE_BOOK) {
    let src = "";
    let tgt = "";
    if (sourceLang === "en" && targetLang === "hi") { src = entry.en; tgt = entry.hi; }
    else if (sourceLang === "hi" && targetLang === "en") { src = entry.hi; tgt = entry.en; }
    else if (sourceLang === "en" && targetLang === "es") { src = entry.en; tgt = entry.es; }
    else if (sourceLang === "es" && targetLang === "en") { src = entry.es; tgt = entry.en; }
    else if (sourceLang === "es" && targetLang === "hi") { src = entry.es; tgt = entry.hi; }
    else if (sourceLang === "hi" && targetLang === "es") { src = entry.hi; tgt = entry.es; }

    if (src && src.length > 3) {
      const regex = new RegExp(`\\b${src}\\b`, "gi");
      if (regex.test(workingText)) {
        workingText = workingText.replace(regex, tgt);
      }
    }
  }

  if (workingText !== trimmed && workingText.trim()) {
    return formatCapitalization(workingText);
  }

  // 3. Fast Token-level Lexicon Mapping
  const tokens = trimmed.split(/\s+/);
  const translatedTokens = tokens.map((rawToken) => {
    const cleanToken = rawToken.toLowerCase().replace(/[.,?!¿¡:;"'()]/g, "");
    const match = WORD_LEXICON.find((w) => {
      if (sourceLang === "en") return cleanKey(w.en) === cleanToken;
      if (sourceLang === "es") return cleanKey(w.es) === cleanToken;
      if (sourceLang === "hi") return w.hi.trim() === cleanToken || cleanKey(w.hi) === cleanToken;
      return false;
    });

    if (match) {
      let replacement = rawToken;
      if (targetLang === "en") replacement = match.en;
      else if (targetLang === "es") replacement = match.es;
      else if (targetLang === "hi") replacement = match.hi;

      const trailingPunct = rawToken.replace(/[^.,?!]/g, "");
      return `${replacement}${trailingPunct}`;
    }
    return rawToken;
  });

  const result = translatedTokens.join(" ").trim();
  return formatCapitalization(result);
}
