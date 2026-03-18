# F-021 · Champs Alternatives et Hypothèses dans DecisionForm

## Problème

Les champs `alternatives` et `assumptions` existent en base de données et sont affichés dans la page détail (`DecisionDetail.tsx`) et la page sample, mais ils sont absents du `DecisionForm` (création et édition).

Actuellement, l'IA draft génère des assumptions et risks qu'elle place en texte libre dans le champ Contexte — ce n'est pas idéal.

## Proposition

Ajouter deux sections au formulaire de décision :

### Alternatives envisagées
- Liste dynamique (bouton "Ajouter une alternative")
- Chaque entrée : titre (requis) + description optionnelle
- Bouton de suppression par entrée

### Hypothèses
- Liste dynamique (bouton "Ajouter une hypothèse")
- Chaque entrée : texte simple
- Bouton de suppression par entrée

## Pourquoi c'est important

Alternatives et hypothèses sont parmi les champs les plus précieux pour la mémoire décisionnelle :
- Les **alternatives** montrent que la décision a été réfléchie, pas prise à la légère
- Les **hypothèses** permettent de savoir quand reouvrir une décision (si une hypothèse ne tient plus)

Les laisser hors formulaire est un manque fonctionnel réel.

## Considérations techniques

- `DecisionFormFields` dans `src/types/forms.ts` doit être étendu avec `alternatives` et `assumptions`
- `buildFormData` dans `DecisionForm.tsx` doit sérialiser les listes via `FormData.append` (tableau)
- `createDecisionAction` et `updateDecisionAction` reçoivent déjà ces champs — rien à changer côté actions
- Utiliser `useFieldArray` de React Hook Form pour gérer les listes dynamiques

## Statut

`planned` — en attente d'implémentation
