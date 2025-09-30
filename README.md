# SaveUp

SaveUp è un'applicazione mobile per la gestione degli obiettivi di risparmio personale, sviluppata con Expo, React Native e TypeScript.

## Funzionalità principali

- Creazione e gestione di obiettivi di risparmio
- Visualizzazione delle statistiche di progresso
- Notifiche e reminder
- Interfaccia moderna con supporto tema chiaro/scuro
- Storico delle transazioni per ogni obiettivo
- Navigazione a tab e modali
- Animazioni e icone personalizzate

## Struttura del progetto

- `app/` — Routing e pagine principali (tab, modali, auth, obiettivi)
- `components/` — Componenti UI riutilizzabili (Card, Button, StatCard, GoalCard, ecc.)
- `services/` — Servizi come notifiche
- `store/` — Gestione stato globale con Zustand
- `assets/` — Immagini e icone

## Stack tecnologico

- **React Native** (Expo)
- **TypeScript**
- **Zustand** per lo stato globale
- **Tailwind CSS** (NativeWind) per lo styling
- **Expo Router** per la navigazione
- **Lucide Icons** per le icone
- **Date-fns** per la gestione delle date

## Avvio rapido

1. Installa le dipendenze:
	```sh
	npm install
	```
2. Avvia l'app in modalità sviluppo:
	```sh
	npm start
	```
	Oppure:
	```sh
	npm run android
	npm run ios
	npm run web
	```

## Script utili

- `npm run lint` — Analizza il codice con ESLint
- `npm run reset-project` — Resetta la configurazione del progetto

## Configurazione

- Modifica i file di configurazione (`app.json`, `babel.config.js`, `tailwind.config.js`, ecc.) secondo le tue esigenze.
- Le variabili d'ambiente possono essere gestite tramite `expo-env.d.ts` e `nativewind-env.d.ts`.

## Contribuire

1. Forka il repository
2. Crea un branch (`git checkout -b feature/nuova-funzionalità`)
3. Fai commit delle modifiche (`git commit -am 'Aggiunta nuova funzionalità'`)
4. Push sul branch (`git push origin feature/nuova-funzionalità`)
5. Apri una Pull Request

## Licenza

Questo progetto è privato.
