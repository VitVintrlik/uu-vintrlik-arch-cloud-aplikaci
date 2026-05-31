# LiftLog

![](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)
![](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)


## Struktura projektu

| Balíček | Název balíčku | Popis |
| :--- | :--- | :--- |
| `packages/backend` | `backend` | Express REST API, business logika, SQLite databáze |
| `packages/frontend` | `frontend` | React SPA — stránky, komponenty, hooks |
| `packages/shared` | `shared` | Sdílené TypeScript typy, Zod schémata, konstanty |
| `packages/ui` | `@uu/kinetic-ui` | Interní UI knihovna (Headless UI + CVA + Tailwind) |

---

## Rychlý start

1. **Instalace závislostí:**
   ```bash
   npm install
   ```

2. **Development (backend + frontend):**
   ```bash
   npm run dev
   ```

3. **Samostatný backend:**
   ```bash
   npm run dev:be
   ```

4. **Samostatný frontend:**
   ```bash
   npm run dev:fe
   ```

5. **Integrační testy:**
   ```bash
   npm run test -w backend
   ```

---

## Dokumentace balíčků

Podrobná technická dokumentace a architektonická rozhodnutí jsou popsána v README každého balíčku:

- [Backend — Express REST API](packages/backend/README.md)
- [Frontend — React SPA](packages/frontend/README.md)
- [UI Knihovna — @uu/kinetic-ui](packages/ui/README.md)

---


## Poznámky pro učitele

- Projekt jsem odevzdal do svého stávajícího repozitáře — pro backend mi vypršel invite link a migrovat celé repo do školního gitu jen kvůli tomu mi přišlo zbytečné.
- Aplikaci stačí spustit přes `npm run dev`. Připravil jsem testovací dataset v `seed.ts`, ze kterého se vygenerovala `liftlog.db` db není v`.gitignore`, takže je součástí repozitáře jako zbytek codebase.
- Pokud by v kódu nebo architektuře bylo cokoliv nejasného, neváhejte se na mě obrátit.
