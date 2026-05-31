# @uu/kinetic-ui

![](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![](https://img.shields.io/badge/Headless_UI-v2-66E3FF?style=flat-square)

---

> Interní UI komponenty knihovna projektu LiftLog. Implementuje **Kinetic Dark** design systém — tmavé téma s Electric Lime akcentem (`#c3f400`). Distribuována jako npm workspace balíček `@uu/kinetic-ui`, přímo importovatelná frontendem bez publishování do registru.

---

## Proč vlastní UI knihovna?

Standardní alternativy jsou hotové knihovny (MUI, Chakra UI, Ant Design) nebo copy-paste přístup (shadcn/ui).

MUI a spol. mají silně zaopinionovaný vizuální jazyk navržený pro světlá nebo generická témata. Použití těchto komponent pro custom knihovnu by znamenalo přepisovat desítky theme proměnných a bojovat s každou komponentou zvlášť. Výsledek jsou overridy na overridy a CSS specificity války.

shadcn/ui kopíruje zdrojový kód přímo do projektu — nejsou to izolované dependencies, jsou to tvoje soubory. Při každé upstream změně jsi na ručním mergování.

Vlastní `@uu/kinetic-ui` zajišťuje:
- Plnou kontrolu nad designem a tokeny bez externích omezení
- Přímé sdílení Tailwind tokenů s frontendem — oba balíčky konzumují stejné CSS custom properties (`--color-primary-fixed`, `--color-background` apod.)
- Čistou hranici mezi design systémem a aplikačním kódem — UI evoluuje nezávisle

---

## Architektura komponent

Každá komponenta je postavena na třech vrstvách:

### 1. Headless UI — logika a přístupnost

[Headless UI](https://headlessui.com/) od Tailwind Labs poskytuje plně přístupné, unstyled primitives pro komplexnější interaktivní komponenty (`Modal`, `Select`). Zajišťuje ARIA atributy, focus management, keyboard navigaci a animace — bez jediné CSS třídy. Accessibility je vyřešená jednou na úrovni knihovny, ne ručně pro každou komponentu zvlášť.

### 2. CVA (class-variance-authority) — typované varianty

`cva()` definuje vizuální varianty jako strukturovaný objekt s plným TypeScript typingem. Bez toho by byly varianty ternární operátory rozházené po celém souboru — takhle jsou na jednom místě a TypeScript inferuje typy sám:

```ts
const buttonVariants = cva('základní-třídy', {
  variants: {
    variant: { primary: '...', secondary: '...', danger: '...', ghost: '...' },
    size:    { sm: '...', md: '...', lg: '...', icon: '...' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});
```

Výsledný typ `VariantProps<typeof buttonVariants>` je automaticky inferován TypeScriptem — spotřebitel dostane `variant` a `size` props s plným autocomplete a bez možnosti předat neplatnou kombinaci. Přidání nové varianty je změna na jednom místě.

### 3. tailwind-merge + clsx — kompozice tříd

Tailwind generuje statické utility třídy — při konfliktu (např. `p-4` a `p-8` předaných z různých zdrojů) závisí výsledek na pořadí v CSS souboru, ne na pořadí v kódu. `tailwind-merge` to řeší deterministicky: pozdější třída vždy vyhraje. `clsx` zjednodušuje podmíněné sestavování. Funkce `cn()` je jejich kombinací a je ve všech komponentách:

```ts
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
```

---

## Kinetic Dark Design Systém

Tokeny jsou definovány v `src/styles/index.css` pomocí Tailwind v4 `@theme` direktivy jako nativní CSS custom properties. Jsou automaticky dostupné jako Tailwind utility třídy (`bg-primary-fixed`, `text-on-surface` apod.) i jako přímé CSS proměnné (`var(--color-primary-fixed)`).

### Barevná paleta

| Token | Hodnota | Použití |
| :--- | :--- | :--- |
| `--color-primary-fixed` | `#c3f400` | Primární akcentní barva (Electric Lime) |
| `--color-on-primary-fixed` | `#283500` | Text na primárním akcentu |
| `--color-background` | `#0a0a0a` | Pozadí celé aplikace |
| `--color-surface` | `#131313` | Povrch karet, navbaru, panelů |
| `--color-surface-container` | `#201f1f` | Zanořené kontejnery |
| `--color-surface-container-high` | `#2a2a2a` | Hover stavy, zvýrazněné plochy |
| `--color-on-surface` | `#e5e2e1` | Primární text |
| `--color-on-surface-variant` | `#c4c9ac` | Sekundární text, ikony, popisky |
| `--color-outline-variant` | `#444933` | Subtilní ohraničení |
| `--color-error` | `#ff4545` | Chybové stavy, destruktivní akce |

### Typografie

| Token | Hodnota | Použití |
| :--- | :--- | :--- |
| `--font-sans` | Geist Variable | Primární písmo (nadpisy, UI text) |
| `--font-mono` | JetBrains Mono | Monospace (číselné hodnoty, kódy) |

---

## Komponenty

| Komponenta | Popis |
| :--- | :--- |
| `Button` | 4 varianty (primary, secondary, danger, ghost), 4 velikosti (sm, md, lg, icon), loading stav s animací |
| `Badge` | Barevné štítky pro kategorie a stavy (split tréninku, status session) |
| `Card` | Obalový container pro sekce obsahu s konzistentním paddingem a border-radius |
| `Heading` | Typografická hierarchie h1–h4 s předdefinovanými velikostmi a váhami |
| `Text` | Tělo textu s variantami pro různé kontexty (body, caption, label) |
| `Input` | Textový vstup s error state, focus ring a integrací s react-hook-form |
| `Textarea` | Víceřádkový textový vstup se stejným design language jako Input |
| `FormField` | Wrapper s label, error message a hint textem — obaluje Input nebo Textarea |
| `Select` | Dropdown postavený na Headless UI s plnou keyboard navigací a ARIA atributy |
| `Modal` | Dialog s focus trapem a animací (Headless UI), blokuje scroll pozadí |
| `Table` | Datová tabulka s integrací pro `@tanstack/react-table` |

## Vývoj a přispívání

Knihovna se kompiluje přes Vite do `dist/`. Frontend importuje z `dist/`, ne přímo ze zdrojových souborů — po každé změně v `packages/ui/src/` je potřeba rebuild.

Deployment do npm registru jsem záměrně neřešil — npm workspace v monorepu stačí, viz sekce "Proč vlastní UI knihovna?".

```bash
# Build UI knihovny (z kořene monorepa)
npm run build -w @uu/kinetic-ui
```
