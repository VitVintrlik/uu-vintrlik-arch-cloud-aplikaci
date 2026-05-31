# Frontend — LiftLog

![](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)
![](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=flat-square&logo=reactquery&logoColor=white)
![](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white)

---

> Frontendová část aplikace pro sledování workoutů. Single Page Application postavená na Reactu 19 s vlastním design systémem, silným typováním a čistou vrstvovou architekturou. Dokumentace je psána česky, kód a technické komentáře v angličtině.

---

## Spuštění projektu

1. **Instalace závislostí** (z kořene monorepa):
   ```bash
   npm install
   ```

2. **Vývojový režim:**
   ```bash
   npm run dev:fe
   ```

3. **Produkční build:**
   ```bash
   npm run build
   ```

---

## Technologický Stack

| Technologie | Verze | Význam v projektu           |
| :--- | :--- |:----------------------------|
| **React** | 19 | UI framework                |
| **TypeScript** | 5.8 | Statické typování           |
| **Vite** | 6 | Build tool a dev server     |
| **Tailwind CSS** | 4 | Utility-first styling       |
| **TanStack Query** | 5 | Server-state management     |
| **react-hook-form** | 7 | Správa formulářů            |
| **Zod** | 3 | Validace a typová inference |
| **react-router-dom** | 7 | Klientský routing           |
| **@uu/kinetic-ui** | 1 | Interní UI komponenty       |
| **lucide-react** | 0.479 | Ikonová sada                |

---

## Architektonická rozhodnutí

### 1. React 19

- Zvolil jsem nejnovější stabilní verzi Reactu dostupnou v době vývoje.
- React 19 odstranil `forwardRef` API a umožňuje předávat `ref` přímo jako propku — využívám to hlavně v `@uu/kinetic-ui`. Eliminuje zbytečný wrapper a zjednodušuje komponenty.

### 2. Vite 6

- Zvolil jsem Vite oproti Webpack nebo RSbuild, protože momentálně v Reactím ekosystému má pravděpodobně nejlepší podporu a je nejvíce adopted. Webpack je moc starý a RSbuild moc nový. CRA je deprecated od 2023. 
- Vite využívá nativní ES Modules v dev módu — modul se transformuje až při prvním importu, nikoliv celý bundle najednou. Výsledkem je téměř okamžitý cold start a HMR bez full reloadu stránky při každé změně.
- Produkční build je postaven na Rollup — garantuje tree-shaking a minifikaci výstupního bundle, i když pro účely prezentace z localhostu to moc nevyužijeme.

### 3. TanStack Query v5

- Vzhledem k rozsahu projektu jsem se rozhodl neřešit global state management stylu Redux, Zustand nebo Jotai. V tomto případě bohatě stačí cache TanStack Query. 
- `queryKey` pole funguje jako deklarativní dependency array — invalidace celé cache po mutaci je jednořádková operace (`queryClient.invalidateQueries`).
- Eliminuje veškerý loading/error boilerplate, který by bylo nutné psát ručně kombinací `useEffect` + `useState` + vlastní cache.

### 4. react-hook-form + Zod

- `react-hook-form` pracuje s **uncontrolled inputs** — formulář nepřekresluje celý komponent tree při každém stisku klávesy.
- Zod schémata slouží k deklarativní validaci a zároveň k automatické inferenci TypeScript typů.
- Knihovna `@hookform/resolvers` integruje Zod resolver přímo do `react-hook-form` bez nutnosti vlastního adaptera.

### 5. react-router-dom v7

- Deklarativní API (`<Routes>`, `<Route>`) přehledně mapuje URL na komponenty a umožňuje nested routing pro hierarchické layouty.
- Hooks `useLocation`, `useParams` a `useNavigate` pokrývají všechny navigační potřeby aplikace.

### 6. Tailwind CSS v4

- Zvolil jsem tailwind, je méně souborů, žádný problém se specificitou CSS selektorů a přímá viditelnost stylů v JSX bez přeskakování mezi soubory.
- Tailwind v4 přineslo zásadní změnu architektury: konfiguraci lze psát přímo jako **CSS `@theme` direktiva** místo `tailwind.config.js`. Design tokeny jsou tak definovány jako nativní CSS custom properties (`--color-primary-fixed`, `--color-background`, `--font-sans`) — přístupné i mimo Tailwind utility třídy, například v inline stylech nebo CSS animacích.
- Zero runtime — veškeré utility třídy jsou generovány v build čase, žádný JavaScript nezatěžuje browser za běhu.

### 7. Interní UI knihovna @uu/kinetic-ui

- Tohle pravděpodobně není poslední FE projekt, který na škole budu psát, takže jsem se rozhodl postavit vlastní design system, který budu moct použít i v budoucích projektech. Stačí změnit CSS tokeny a komponenty fungují v novém duchu — logika zůstane stejná.
- Deployment vlastní knihovny jsem záměrně neřešil. V rámci předmětu deployment nikam neděláme, takže by to byl zbytečný overkill — navíc řešit npm registry a auth klíče jen kvůli tomuhle nedává smysl. Funguje jako npm workspace balíček přímo v monorepu.
- Detailní popis knihovny je v `packages/ui/README.md`.

### 8. Vrstvová architektura (hooks / components / pages)

Striktní oddělení odpovědností aplikuje principy **SOLID** na React — konkrétně Single Responsibility Principle:

- **`hooks/api/`**: Výhradně TanStack Query hooks. Obsahují pouze fetchovací logiku a mutace — žádná byznys logika. Tyto hooks jsou přímou "mapou" REST API endpointů.
- **`hooks/domain/`**: Hooks s byznys logikou závislou na datech (např. `useActiveSession` odvozuje aktivní session z listu všech session, `useDashboardStats` agreguje statistiky z více zdrojů). Nevědí nic o HTTP ani o tom, jak jsou data renderována.
- **`components/`**: Čisté renderovací komponenty. Přijímají data přes props a emitují události callbacky. Neobsahují žádné volání hooks pro data — jsou testovatelné v izolaci bez závislosti na síti nebo globálním stavu.
- **`pages/`**: Routing-level komponenty. Orchestrují hooks, spravují lokální UI stav (otevřené modaly, výběr) a předávají data dolů do komponent.

### 9. Sdílené typy a balíček `shared`

- Typy `WorkoutSession`, `ExerciseEntry`, `WorkoutSplit` a `SessionStatus` jsou definovány jednou v balíčku `shared` a konzumovány backendem i frontendem jako přímý import.
- Alternativou by bylo generování typů z OpenAPI specifikace nebo GraphQL schématu. To by přidalo extra build step, nutnost udržovat aktuální specifikaci a risk divergence při zapomenutém vygenerování. Přímé sdílení přes npm workspace je jednodušší, přesnější a bez additional toolingu.
- Bez `shared` by bylo nutné typy ručně udržovat synchronizované na obou stranách, což je náchylné na chyby a divergenci při každé změně API kontraktu.

---
## Poznámky k implementaci

> - **Překlady:** Stringy jsem nechával v hardcoded v Češtině a překlady jsme nijak neřešil, požadavek pro i18n nebo jiné překlady nebyl tudíž jsem vše nechal hardcoded, ačkoliv pokud by se projekt v budoucnu rozširoval klíče pro překlady by byly nutné.
> - **RESTful standard:** Opět vzhledem k rozsahu projektu jsem neřešil žádné unit, integrační ani E2E tesy, na BE je stále jeden integrační, každopádně na FE bychom museli mockovat render API cally atd. tuna test suites by byly overkill.
> - **JSDOC:** Stejně jako u backendu, vzhledem k self-documenting natuře TS a typů jsem se rozhodl JSDOC vynechat a přidat pouze pár komentářů nad funkcemi.