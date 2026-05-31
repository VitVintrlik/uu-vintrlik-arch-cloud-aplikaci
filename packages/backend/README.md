# Backend — LiftLog

![](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)
![](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white)
![](https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white)

---

> Backendová část aplikace pro sledování workoutů a tréninkových záznamů. Dokumentace je psána česky, kód a technické komentáře v angličtině.

---

## Spuštění projektu

1. **Instalace závislostí:**
   ```bash
   npm install
   ```

2. **Vývojový režim (backend):**
   ```bash
   npm run dev:be
   ```

3. **Ověření kvality (integrační testy):**
   ```bash
   npm run test -w backend
   ```

---

## Technologický Stack

| Technologie | Verze | Význam v projektu |
| :--- | :--- | :--- |
| **Node.js** | >= 20.0.0 | Základní runtime prostředí |
| **TypeScript** | 5.4.5 | Statická typizace a bezpečnost kódu |
| **Express.js** | 4.19.2 | Minimalistický framework pro REST API |
| **better-sqlite3** | 9.4.3 | Výkonný SQLite driver se synchronním API |
| **Zod** | 3.23.8 | Deklarativní validace a typová inference |
| **Vitest** | 4.1.5 | Moderní testovací runner |
| **Supertest** | 7.2.2 | Knihovna pro testování HTTP endpointů |

---

## Architektonická rozhodnutí

### 1. TypeScript
- Zvolil jsem TypeScript pro static typing a eliminaci runtime chyb.
- Self-documenting typy zvyšují čitelnost kódu a usnadňují refaktorizaci bez rizika rozbití API nebo jiných částí kódu.
- V moderním tech stacku si nedovedu představit projekt bez TS.

### 2. Vrstvená architektura (Controller-ABL-DAO)
Striktní oddělení odpovědností podle principů **SOLID**:
- **Controller**: Odpovídá pouze za parsování HTTP requestu, extrakci dat a vrácení odpovídajícího status kódu.
- **ABL (Application Business Logic)**: Vrstva zodpovědná za business logic a pravidla (např. validace existence záznamů, kontrola limitu aktivních session, výpočet duration).
- **DAO (Data Access Object)**: Zapouzdřuje SQL logiku. Zajišťuje perzistenci a mapování dat mezi DB a TS.

### 3. UUID v4
- Používám UUID namísto inkrementálních ID.
- Důvodem je zamezení predikovatelnosti záznamů a možnost paralelního generování ID bez nutnosti synchronizace s databází (eliminace fronty na "další číslo").
- UUID je pro tento projekt dle mého názoru industry standard.

### 4. SQLite a better-sqlite3
- Pro perzistenci jsem zvolil SQLite namísto JSON.
- Na rozdíl od JSON souborů SQLite garantuje konzistenci dat a umožňuje využití `ON DELETE CASCADE`.
- Knihovnu `better-sqlite3` jsem vybral pro její synchronní API, které je v Node.js prostředí výkonnější a jednodušší na správu než standardní asynchronní drivery.
- Práce s JSON soubory by byla mnohem náročnější a složitější než použití těchto silných technologií a knihoven.

### 5. Zod
- Validace vstupů (dtoIn) je řešena deklarativně pomocí knihovny Zod.
- Je řádově výkonnější, bezpečnější a jednodušší než manuální psaní validátorů.
- Zod schémata využívám k automatické inferenci TypeScript typů přímo ze schématu — typ je odvozen automaticky, nikoliv psán ručně.
- Takto nemusíme generovat typy pro FE; kdybychom se rozhodli jít cestou například GraphQL, práce s typy a resolvery by byla mnohonásobně náročnější.

### 6. Centralizovaný Error Handling
- Veškeré chyby probublávají do globálního `errorHandleru`.
- Pro byznys chyby (např. limit aktivních session) používám wrapper `throwBusinessError`, který vrací 400 Bad Request, zatímco technické chyby končí jako 500 Internal Server Error.
- Zachoval jsem jednoduchost ErrorHandleru; za normálních okolností by se na to udělala velmi silná třída, ale vzhledem k projektu jsem se rozhodl ponechat funkce.

### 7. Integrační testy
- Zvolil jsem cestu integračních testů (Vitest + Supertest), které testují kompletní tok request-to-db.
- Jsou klíčové pro prevenci regresí při změnách v logice.
- Testy pokrývají kritické scénáře jako výpočet trvání workoutu a vynucení pravidla jedné aktivní session.
- Unit testy mi přišly jako overkill vzhledem k tomu, že bychom museli mockovat DB atd. Jeden pořádný test suite nám zaručil, že děláme vše správně a nic při úpravách "nerozbijeme".
- Testy následují standardní AAA pattern.

### 8. Monorepo (npm workspaces)
- Projekt je strukturován jako monorepo, což umožňuje existenci **Single Source of Truth (SSoT)** v balíčku `shared`.
- Veškeré typy pro workouty a cviky jsou definovány na jednom místě a přímo konzumovány backendem i frontendem bez nutnosti generovat typy z API.
- Silnější knihovny stylu Turborepo nebo Nx mi nepřišly vhodné vzhledem k velikosti projektu.

### 9. Správa databáze
- **Idempotentní inicializace:** DB schéma se vytváří automaticky při startu aplikace (`CREATE TABLE IF NOT EXISTS`). Díky tomu máme "plug-and-play" projekt bez nutnosti manuálního spouštění SQL skriptů nebo importu dat.
- **Konfigurace enginu:** V rámci inicializace vynucuji kontrolu cizích klíčů (`PRAGMA foreign_keys = ON`), která je v SQLite standardně vypnutá. To garantuje funkčnost vazeb jako `ON DELETE CASCADE`.
- **Izolace prostředí:** Systém na základě `NODE_ENV` automaticky přepíná mezi vývojovou databází a izolovanou testovací databází (`.test.db`), což garantuje, že integrační testy nikdy neovlivní reálná data.

---

## Poznámky k implementaci

> - **Funkcionální přístup:** V rámci jednoduchosti projektu jsem se vědomě odklonil od OOP (tříd). Čisté funkce jsou pro tento rozsah čitelnější a lépe se udržují.
> - **RESTful standard:** Zvolil jsem standardní HTTP metody (GET, POST, PUT, DELETE) namísto Command patternu, protože se jedná o industry standard, který sémanticky lépe popisuje operace nad zdroji.
> - **JSDOC:** Vzhledem k self-documenting natuře TS a typů jsem se rozhodl JSDOC vynechat a přidat pouze pár komentářů s vysvětlením rozhodnutí.